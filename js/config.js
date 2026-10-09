/**
 * CleanDrive Pro - Configuration & Storage Constants
 */
const CONFIG = {
  // Default app settings
  STORAGE_KEY_CLIENT_ID: 'cleandrive_oauth_client_id',
  STORAGE_KEY_ACCESS_TOKEN: 'cleandrive_access_token',
  STORAGE_KEY_TOKEN_EXPIRY: 'cleandrive_token_expiry',
  STORAGE_KEY_LAST_MODE: 'cleandrive_last_mode',

  // Google OAuth 2.0 Scopes required for inspecting Drive and cleaning files
  OAUTH_SCOPES: [
    'https://www.googleapis.com/auth/drive',
    'https://www.googleapis.com/auth/userinfo.profile',
    'https://www.googleapis.com/auth/userinfo.email'
  ].join(' '),

  // Google API endpoints
  ENDPOINTS: {
    DRIVE_ABOUT: 'https://www.googleapis.com/drive/v3/about?fields=user,storageQuota',
    DRIVE_FILES: 'https://www.googleapis.com/drive/v3/files',
    DRIVE_EMPTY_TRASH: 'https://www.googleapis.com/drive/v3/files/trash',
    USERINFO: 'https://www.googleapis.com/oauth2/v3/userinfo'
  },

  // Pagination & limits
  FILES_PER_PAGE: 25,
  MAX_SCAN_FILES: 50000, // Upgraded from 1,000 to 50,000 files for complete cleanup
  DRIVE_PAGE_SIZE: 1000, // Maximum batch size supported by Google Drive API v3

  // Thresholds
  LARGE_FILE_THRESHOLD_BYTES: 100 * 1024 * 1024, // 100 MB
  OLD_FILE_DAYS_THRESHOLD: 365 // 1 year
};
