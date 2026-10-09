/**
 * CleanDrive Pro - Google Drive REST API & Google Identity Services (GIS) Client
 */
class GoogleDriveService {
  constructor() {
    this.tokenClient = null;
    this.accessToken = null;
    this.tokenExpiry = 0;
    this.isInitialized = false;
  }

  /**
   * Initialize GIS Token Client
   * @param {string} clientId 
   * @param {function} onTokenCallback 
   */
  init(clientId, onTokenCallback) {
    if (!window.google || !window.google.accounts || !window.google.accounts.oauth2) {
      console.warn('Google Identity Services SDK chưa tải xong');
      return false;
    }

    if (!clientId) {
      return false;
    }

    try {
      this.tokenClient = google.accounts.oauth2.initTokenClient({
        client_id: clientId,
        scope: CONFIG.OAUTH_SCOPES,
        callback: (response) => {
          if (response.error) {
            console.error('Lỗi xác thực OAuth:', response);
            if (onTokenCallback) onTokenCallback(null, response.error);
            return;
          }
          this.accessToken = response.access_token;
          const expiresInSec = parseInt(response.expires_in, 10) || 3600;
          this.tokenExpiry = Date.now() + expiresInSec * 1000;
          
          sessionStorage.setItem(CONFIG.STORAGE_KEY_ACCESS_TOKEN, this.accessToken);
          sessionStorage.setItem(CONFIG.STORAGE_KEY_TOKEN_EXPIRY, this.tokenExpiry.toString());

          if (onTokenCallback) onTokenCallback(this.accessToken, null);
        }
      });
      this.isInitialized = true;
      return true;
    } catch (err) {
      console.error('Không thể khởi tạo Google OAuth Token Client:', err);
      return false;
    }
  }

  /**
   * Request OAuth Token / trigger login popup
   */
  requestAccessToken() {
    if (!this.tokenClient) {
      throw new Error('Google OAuth Client chưa được cấu hình Client ID');
    }
    this.tokenClient.requestAccessToken({ prompt: 'consent' });
  }

  /**
   * Check if token is still valid
   */
  isAuthenticated() {
    if (this.accessToken && Date.now() < this.tokenExpiry) {
      return true;
    }
    // Check session storage
    const savedToken = sessionStorage.getItem(CONFIG.STORAGE_KEY_ACCESS_TOKEN);
    const savedExpiry = parseInt(sessionStorage.getItem(CONFIG.STORAGE_KEY_TOKEN_EXPIRY) || '0', 10);
    if (savedToken && Date.now() < savedExpiry) {
      this.accessToken = savedToken;
      this.tokenExpiry = savedExpiry;
      return true;
    }
    return false;
  }

  /**
   * Sign out / Revoke token
   */
  signOut() {
    if (this.accessToken && window.google && window.google.accounts && window.google.accounts.oauth2) {
      try {
        google.accounts.oauth2.revoke(this.accessToken, () => {
          console.log('Đã thu hồi token Google OAuth thành công');
        });
      } catch (e) {
        console.warn('Lỗi khi thu hồi token:', e);
      }
    }
    this.accessToken = null;
    this.tokenExpiry = 0;
    sessionStorage.removeItem(CONFIG.STORAGE_KEY_ACCESS_TOKEN);
    sessionStorage.removeItem(CONFIG.STORAGE_KEY_TOKEN_EXPIRY);
  }

  /**
   * Helper to make authenticated requests
   */
  async fetchWithAuth(url, options = {}) {
    if (!this.isAuthenticated()) {
      throw new Error('Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.');
    }

    const headers = {
      ...(options.headers || {}),
      'Authorization': `Bearer ${this.accessToken}`
    };

    const res = await fetch(url, { ...options, headers });
    if (!res.ok) {
      const errBody = await res.json().catch(() => ({}));
      const errMsg = errBody.error?.message || `HTTP ${res.status}: ${res.statusText}`;
      throw new Error(errMsg);
    }

    if (res.status === 204) {
      return null;
    }
    return res.json();
  }

  /**
   * Get Storage Quota and User info from Google Drive
   */
  async getAboutInfo() {
    return await this.fetchWithAuth(CONFIG.ENDPOINTS.DRIVE_ABOUT);
  }

  /**
   * Scan files in Google Drive
   * @param {function} onProgressCallback (filesLoadedCount, currentBatchSize)
   */
  async fetchAllFiles(onProgressCallback) {
    let allFiles = [];
    let pageToken = null;
    let pageCount = 0;

    const fields = 'nextPageToken, files(id, name, mimeType, size, modifiedTime, md5Checksum, trashed, webViewLink, iconLink, ownedByMe, capabilities(canDelete, canTrash), shared, owners(displayName, emailAddress))';
    const pageSize = CONFIG.DRIVE_PAGE_SIZE || 1000;

    do {
      const params = new URLSearchParams({
        pageSize: pageSize.toString(),
        fields: fields,
        // Include trashed files as well so we can clean trash or regular files
        q: 'trashed = true or trashed = false',
        spaces: 'drive'
      });

      if (pageToken) {
        params.append('pageToken', pageToken);
      }

      const url = `${CONFIG.ENDPOINTS.DRIVE_FILES}?${params.toString()}`;
      const data = await this.fetchWithAuth(url);

      if (data.files && data.files.length > 0) {
        allFiles = allFiles.concat(data.files);
        if (onProgressCallback) {
          onProgressCallback(allFiles.length, data.files.length);
        }
      }

      pageToken = data.nextPageToken;
      pageCount++;

      // Max safety scan threshold (default 50,000 files)
      if (allFiles.length >= CONFIG.MAX_SCAN_FILES) {
        console.warn(`Đã đạt giới hạn quét tối đa ${CONFIG.MAX_SCAN_FILES} tệp.`);
        break;
      }

    } while (pageToken);

    return allFiles;
  }

  /**
   * Fetch top-level items directly in Google Drive root ('root' in parents)
   * Deleting root folders immediately deletes all subfiles/subfolders inside them.
   */
  async fetchRootItems() {
    const fields = 'nextPageToken, files(id, name, mimeType, size, capabilities(canDelete), ownedByMe)';
    let items = [];
    let pageToken = null;
    do {
      const params = new URLSearchParams({
        pageSize: '1000',
        fields: fields,
        q: "'root' in parents and trashed = false and 'me' in owners",
        spaces: 'drive'
      });
      if (pageToken) params.append('pageToken', pageToken);
      const data = await this.fetchWithAuth(`${CONFIG.ENDPOINTS.DRIVE_FILES}?${params.toString()}`);
      if (data.files) items = items.concat(data.files);
      pageToken = data.nextPageToken;
    } while (pageToken);
    return items;
  }

  /**
   * Fetch active files owned by the user (useful to find any orphaned files)
   */
  async fetchActiveOwnedFiles(pageSize = 1000) {
    const fields = 'files(id, name, mimeType, size, capabilities(canDelete), ownedByMe)';
    const params = new URLSearchParams({
      pageSize: pageSize.toString(),
      fields: fields,
      q: "trashed = false and 'me' in owners",
      spaces: 'drive'
    });
    const data = await this.fetchWithAuth(`${CONFIG.ENDPOINTS.DRIVE_FILES}?${params.toString()}`);
    return data.files || [];
  }

  /**
   * Move file to Trash
   * @param {string} fileId 
   */
  async moveToTrash(fileId) {
    const url = `${CONFIG.ENDPOINTS.DRIVE_FILES}/${fileId}`;
    return await this.fetchWithAuth(url, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ trashed: true })
    });
  }

  /**
   * Permanently delete file from Drive
   * @param {string} fileId 
   */
  async deletePermanently(fileId) {
    const url = `${CONFIG.ENDPOINTS.DRIVE_FILES}/${fileId}`;
    return await this.fetchWithAuth(url, {
      method: 'DELETE'
    });
  }

  /**
   * Empty entire Google Drive trash
   */
  async emptyTrash() {
    return await this.fetchWithAuth(CONFIG.ENDPOINTS.DRIVE_EMPTY_TRASH, {
      method: 'DELETE'
    });
  }
}

// Global instance
window.gdriveService = new GoogleDriveService();
