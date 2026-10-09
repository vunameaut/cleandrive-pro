/**
 * CleanDrive Pro - Main Application Logic & UI Controller
 */

// Application State
const state = {
  isDemoMode: false,
  isAuthenticated: false,
  user: null,
  quota: null,
  files: [],
  selectedFileIds: new Set(),
  activeTab: 'all', // 'all', 'large', 'duplicates', 'trash', 'old', 'zero'
  ownershipFilter: 'owned', // 'owned' (default), 'all', 'shared'
  filterType: 'all',
  searchQuery: '',
  sortBy: 'size-desc',
  currentPage: 1,
  pageSize: CONFIG.FILES_PER_PAGE,
  isScanning: false,
  isOperationAborted: false,
  deletionTarget: null // stores pending delete operation payload
};

// DOM Elements
const DOM = {
  // Auth & Header
  authStatusBar: document.getElementById('auth-status-bar'),
  authStatusText: document.getElementById('auth-status-text'),
  btnOAuthSettings: document.getElementById('btn-oauth-settings'),
  btnDemoMode: document.getElementById('btn-demo-mode'),
  btnLoginGoogle: document.getElementById('btn-login-google'),
  btnLoginText: document.getElementById('btn-login-text'),
  btnLogout: document.getElementById('btn-logout'),
  modeBanner: document.getElementById('mode-banner'),
  btnExitDemo: document.getElementById('btn-exit-demo'),

  // Sections
  welcomeSection: document.getElementById('welcome-section'),
  dashboardSection: document.getElementById('dashboard-section'),
  btnWelcomeLogin: document.getElementById('btn-welcome-login'),
  btnWelcomeDemo: document.getElementById('btn-welcome-demo'),

  // User & Quota
  userAvatar: document.getElementById('user-avatar'),
  userAvatarFallback: document.getElementById('user-avatar-fallback'),
  userDisplayName: document.getElementById('user-display-name'),
  userEmail: document.getElementById('user-email'),
  quotaUsedText: document.getElementById('quota-used-text'),
  quotaTotalText: document.getElementById('quota-total-text'),
  quotaPercentage: document.getElementById('quota-percentage'),
  quotaProgressBar: document.getElementById('quota-progress-bar'),
  quotaDriveVal: document.getElementById('quota-drive-val'),
  quotaTrashVal: document.getElementById('quota-trash-val'),
  quotaFreeVal: document.getElementById('quota-free-val'),
  btnStartScan: document.getElementById('btn-start-scan'),
  scanBtnText: document.getElementById('scan-btn-text'),
  scanIcon: document.getElementById('scan-icon'),
  scanTimeIndicator: document.getElementById('scan-time-indicator'),

  // Scan progress box
  scanProgressBox: document.getElementById('scan-progress-box'),
  scanStatusTitle: document.getElementById('scan-status-title'),
  scanCountLive: document.getElementById('scan-count-live'),
  scanSizeLive: document.getElementById('scan-size-live'),
  scanLiveProgress: document.getElementById('scan-live-progress'),

  // Metrics
  metricCards: document.querySelectorAll('.metric-card'),
  metricAllSize: document.getElementById('metric-all-size'),
  metricAllCount: document.getElementById('metric-all-count'),
  metricLargeSize: document.getElementById('metric-large-size'),
  metricLargeCount: document.getElementById('metric-large-count'),
  metricDupsSize: document.getElementById('metric-dups-size'),
  metricDupsCount: document.getElementById('metric-dups-count'),
  metricTrashSize: document.getElementById('metric-trash-size'),
  metricTrashCount: document.getElementById('metric-trash-count'),
  metricOldSize: document.getElementById('metric-old-size'),
  metricOldCount: document.getElementById('metric-old-count'),
  metricZeroSize: document.getElementById('metric-zero-size'),
  metricZeroCount: document.getElementById('metric-zero-count'),

  // Tab counters
  tabCntAll: document.getElementById('tab-cnt-all'),
  tabCntLarge: document.getElementById('tab-cnt-large'),
  tabCntDuplicates: document.getElementById('tab-cnt-duplicates'),
  tabCntTrash: document.getElementById('tab-cnt-trash'),
  tabCntOld: document.getElementById('tab-cnt-old'),
  tabCntZero: document.getElementById('tab-cnt-zero'),

  // Controls & Filters
  explorerTabs: document.getElementById('explorer-tabs'),
  tabButtons: document.querySelectorAll('.tab-btn'),
  inputSearch: document.getElementById('input-search'),
  selectFilterOwnership: document.getElementById('select-filter-ownership'),
  selectFilterType: document.getElementById('select-filter-type'),
  selectSort: document.getElementById('select-sort'),

  // Selection & Actions
  checkboxSelectAll: document.getElementById('checkbox-select-all'),
  selectedSummaryText: document.getElementById('selected-summary-text'),
  btnSelectDuplicatesCopies: document.getElementById('btn-select-duplicates-copies'),
  btnExportCsv: document.getElementById('btn-export-csv'),
  btnEmptyTrash: document.getElementById('btn-empty-trash'),
  btnMoveToTrash: document.getElementById('btn-move-to-trash'),
  btnDeletePermanently: document.getElementById('btn-delete-permanently'),
  btnSelectedCounts: document.querySelectorAll('.btn-selected-cnt'),

  // Table & Pagination
  filesTable: document.getElementById('files-table'),
  filesTableBody: document.getElementById('files-table-body'),
  tableEmptyState: document.getElementById('table-empty-state'),
  footerShowingCnt: document.getElementById('footer-showing-cnt'),
  footerTotalCnt: document.getElementById('footer-total-cnt'),
  btnPagePrev: document.getElementById('btn-page-prev'),
  btnPageNext: document.getElementById('btn-page-next'),
  currentPageEl: document.getElementById('current-page'),
  totalPagesEl: document.getElementById('total-pages'),

  // Settings Modal
  modalSettings: document.getElementById('modal-settings'),
  btnCloseSettings: document.getElementById('btn-close-settings'),
  inputClientId: document.getElementById('input-client-id'),
  btnSaveSettings: document.getElementById('btn-save-settings'),
  btnTestDemoFromModal: document.getElementById('btn-test-demo-from-modal'),
  currentOriginDisplay: document.getElementById('current-origin-display'),
  currentOriginIp: document.getElementById('current-origin-ip'),

  // Confirmation Modal
  modalConfirmDelete: document.getElementById('modal-confirm-delete'),
  btnCloseConfirm: document.getElementById('btn-close-confirm'),
  confirmModalTitle: document.getElementById('confirm-modal-title'),
  confirmModalMessage: document.getElementById('confirm-modal-message'),
  confirmFileCount: document.getElementById('confirm-file-count'),
  confirmFileSize: document.getElementById('confirm-file-size'),
  confirmDeleteType: document.getElementById('confirm-delete-type'),
  confirmWarningBox: document.getElementById('confirm-warning-box'),
  btnCancelDelete: document.getElementById('btn-cancel-delete'),
  btnExecuteDelete: document.getElementById('btn-execute-delete'),

  // Operation Progress Modal
  modalOperationProgress: document.getElementById('modal-operation-progress'),
  opModalTitle: document.getElementById('op-modal-title'),
  opModalSubtitle: document.getElementById('op-modal-subtitle'),
  opSpinner: document.getElementById('op-spinner'),
  btnCloseProgress: document.getElementById('btn-close-progress'),
  opStatusLabel: document.getElementById('op-status-label'),
  opPercentVal: document.getElementById('op-percent-val'),
  opBarFill: document.getElementById('op-bar-fill'),
  opStatProgress: document.getElementById('op-stat-progress'),
  opStatSuccess: document.getElementById('op-stat-success'),
  opStatFreed: document.getElementById('op-stat-freed'),
  opStatSkipped: document.getElementById('op-stat-skipped'),
  opCurrentFilename: document.getElementById('op-current-filename'),
  opCurrentFilesize: document.getElementById('op-current-filesize'),
  opEtaText: document.getElementById('op-eta-text'),
  opLogList: document.getElementById('op-log-list'),
  btnStopOperation: document.getElementById('btn-stop-operation'),
  btnFinishOperation: document.getElementById('btn-finish-operation'),

  // Nuke Drive Modal
  btnNukeDrive: document.getElementById('btn-nuke-drive'),
  modalNukeDrive: document.getElementById('modal-nuke-drive'),
  btnCloseNuke: document.getElementById('btn-close-nuke'),
  btnCancelNuke: document.getElementById('btn-cancel-nuke'),
  btnExecuteNuke: document.getElementById('btn-execute-nuke'),
  inputNukeConfirm: document.getElementById('input-nuke-confirm'),
  nukeTotalFreedVal: document.getElementById('nuke-total-freed-val'),

  // Storage Guide Modal
  btnStorageGuide: document.getElementById('btn-storage-guide'),
  modalStorageGuide: document.getElementById('modal-storage-guide'),
  btnCloseStorageGuide: document.getElementById('btn-close-storage-guide'),
  btnOkStorageGuide: document.getElementById('btn-ok-storage-guide'),

  // Toast
  toastContainer: document.getElementById('toast-container')
};

// ==========================================
// Utility Helpers
// ==========================================

function formatBytes(bytes, decimals = 2) {
  if (bytes === 0 || !bytes) return '0 B';
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}

function formatDate(isoString) {
  if (!isoString) return '--';
  const d = new Date(isoString);
  return d.toLocaleDateString('vi-VN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  });
}

function getMimeCategory(mimeType, fileName = '') {
  const mime = (mimeType || '').toLowerCase();
  const ext = fileName.split('.').pop().toLowerCase();

  if (mime.includes('video') || ['mp4', 'mkv', 'mov', 'avi', 'wmv', 'flv'].includes(ext)) {
    return 'video';
  }
  if (mime.includes('zip') || mime.includes('rar') || mime.includes('tar') || mime.includes('gzip') || mime.includes('compressed') || ['zip', 'rar', '7z', 'tar', 'gz', 'iso'].includes(ext)) {
    return 'archive';
  }
  if (mime.includes('image') || ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'svg', 'webp', 'psd', 'ai', 'raw'].includes(ext)) {
    return 'image';
  }
  if (mime.includes('pdf') || mime.includes('word') || mime.includes('excel') || mime.includes('presentation') || mime.includes('document') || mime.includes('sheet') || ['doc', 'docx', 'xls', 'xlsx', 'ppt', 'pptx', 'pdf', 'txt'].includes(ext)) {
    return 'doc';
  }
  if (mime.includes('audio') || ['mp3', 'wav', 'flac', 'aac', 'ogg', 'm4a'].includes(ext)) {
    return 'audio';
  }
  return 'other';
}

function getFileIconClass(category) {
  return `file-icon-${category}`;
}

function getFileIconSymbol(category) {
  switch (category) {
    case 'video': return '🎥';
    case 'archive': return '📦';
    case 'image': return '🖼️';
    case 'doc': return '📄';
    case 'audio': return '🎵';
    default: return '📁';
  }
}

function showToast(message, type = 'success') {
  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;

  let iconSvg = '';
  if (type === 'success') {
    iconSvg = '<svg class="toast-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"></polyline></svg>';
  } else if (type === 'error') {
    iconSvg = '<svg class="toast-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><line x1="15" y1="9" x2="9" y2="15"></line><line x1="9" y1="9" x2="15" y2="15"></line></svg>';
  } else {
    iconSvg = '<svg class="toast-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>';
  }

  toast.innerHTML = `${iconSvg}<span>${message}</span>`;
  DOM.toastContainer.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(10px)';
    toast.style.transition = 'all 0.3s ease';
    setTimeout(() => toast.remove(), 300);
  }, 4000);
}

// ==========================================
// Initialization & Authentication
// ==========================================

function initApp() {
  // Update origins displayed in settings modal
  const origin = window.location.origin;
  if (DOM.currentOriginDisplay) DOM.currentOriginDisplay.textContent = origin;
  if (DOM.currentOriginIp) DOM.currentOriginIp.textContent = origin.replace('localhost', '127.0.0.1');

  // Load saved client ID
  const savedClientId = localStorage.getItem(CONFIG.STORAGE_KEY_CLIENT_ID) || '';
  DOM.inputClientId.value = savedClientId;

  // Initialize GIS if Client ID is saved
  if (savedClientId) {
    tryInitGoogleOAuth(savedClientId);
  }

  // Bind Event Listeners
  setupEventListeners();

  // Check if previous session was authenticated or demo
  const lastMode = localStorage.getItem(CONFIG.STORAGE_KEY_LAST_MODE);
  if (lastMode === 'demo') {
    startDemoMode();
  } else if (window.gdriveService.isAuthenticated()) {
    onLoginSuccess();
  } else {
    showWelcomeScreen();
  }
}

function tryInitGoogleOAuth(clientId) {
  const success = window.gdriveService.init(clientId, (token, error) => {
    if (token) {
      onLoginSuccess();
    } else {
      showToast(error || 'Đăng nhập Google thất bại hoặc đã bị hủy', 'error');
    }
  });
  return success;
}

function setupEventListeners() {
  // Header Actions
  DOM.btnOAuthSettings.addEventListener('click', openSettingsModal);
  DOM.btnCloseSettings.addEventListener('click', closeSettingsModal);
  DOM.btnSaveSettings.addEventListener('click', saveSettings);
  DOM.btnTestDemoFromModal.addEventListener('click', () => {
    closeSettingsModal();
    startDemoMode();
  });

  DOM.btnDemoMode.addEventListener('click', startDemoMode);
  DOM.btnWelcomeDemo.addEventListener('click', startDemoMode);
  DOM.btnExitDemo.addEventListener('click', exitDemoMode);

  DOM.btnLoginGoogle.addEventListener('click', handleGoogleLogin);
  DOM.btnWelcomeLogin.addEventListener('click', handleGoogleLogin);
  DOM.btnLogout.addEventListener('click', handleLogout);

  // Scan button
  DOM.btnStartScan.addEventListener('click', startScan);

  // Tab navigation
  DOM.tabButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      switchTab(btn.dataset.tab);
    });
  });

  DOM.metricCards.forEach(card => {
    card.addEventListener('click', () => {
      switchTab(card.dataset.tab);
    });
  });

  // Filters & Search
  DOM.inputSearch.addEventListener('input', (e) => {
    state.searchQuery = e.target.value.toLowerCase().trim();
    state.currentPage = 1;
    renderTable();
  });

  if (DOM.selectFilterOwnership) {
    DOM.selectFilterOwnership.addEventListener('change', (e) => {
      state.ownershipFilter = e.target.value;
      state.currentPage = 1;
      renderTable();
    });
  }

  DOM.selectFilterType.addEventListener('change', (e) => {
    state.filterType = e.target.value;
    state.currentPage = 1;
    renderTable();
  });

  DOM.selectSort.addEventListener('change', (e) => {
    state.sortBy = e.target.value;
    state.currentPage = 1;
    renderTable();
  });

  // Selection actions
  DOM.checkboxSelectAll.addEventListener('change', handleSelectAll);
  DOM.btnSelectDuplicatesCopies.addEventListener('click', selectDuplicateCopies);
  DOM.btnExportCsv.addEventListener('click', exportToCsv);

  DOM.btnMoveToTrash.addEventListener('click', () => openConfirmModal('trash'));
  DOM.btnDeletePermanently.addEventListener('click', () => openConfirmModal('delete'));
  DOM.btnEmptyTrash.addEventListener('click', () => openConfirmModal('empty_trash'));

  // Confirm Modal
  DOM.btnCloseConfirm.addEventListener('click', closeConfirmModal);
  DOM.btnCancelDelete.addEventListener('click', closeConfirmModal);
  DOM.btnExecuteDelete.addEventListener('click', executeConfirmedDeletion);

  // Operation Progress Modal
  if (DOM.btnStopOperation) {
    DOM.btnStopOperation.addEventListener('click', () => {
      state.isOperationAborted = true;
      DOM.btnStopOperation.disabled = true;
      DOM.btnStopOperation.textContent = 'Đang dừng...';
    });
  }
  if (DOM.btnFinishOperation) {
    DOM.btnFinishOperation.addEventListener('click', () => {
      DOM.modalOperationProgress.classList.add('hidden');
    });
  }
  if (DOM.btnCloseProgress) {
    DOM.btnCloseProgress.addEventListener('click', () => {
      DOM.modalOperationProgress.classList.add('hidden');
    });
  }

  // Nuke Drive Modal Events
  if (DOM.btnNukeDrive) {
    DOM.btnNukeDrive.addEventListener('click', openNukeModal);
  }
  if (DOM.btnCloseNuke) {
    DOM.btnCloseNuke.addEventListener('click', closeNukeModal);
  }
  if (DOM.btnCancelNuke) {
    DOM.btnCancelNuke.addEventListener('click', closeNukeModal);
  }
  if (DOM.inputNukeConfirm) {
    DOM.inputNukeConfirm.addEventListener('input', (e) => {
      const val = e.target.value.trim().toUpperCase();
      DOM.btnExecuteNuke.disabled = (val !== 'XOA TRANG');
    });
  }
  if (DOM.btnExecuteNuke) {
    DOM.btnExecuteNuke.addEventListener('click', executeDriveNuke);
  }

  // Storage Breakdown Guide Modal
  if (DOM.btnStorageGuide && DOM.modalStorageGuide) {
    DOM.btnStorageGuide.addEventListener('click', () => {
      DOM.modalStorageGuide.classList.remove('hidden');
    });
  }
  if (DOM.btnCloseStorageGuide && DOM.modalStorageGuide) {
    DOM.btnCloseStorageGuide.addEventListener('click', () => {
      DOM.modalStorageGuide.classList.add('hidden');
    });
  }
  if (DOM.btnOkStorageGuide && DOM.modalStorageGuide) {
    DOM.btnOkStorageGuide.addEventListener('click', () => {
      DOM.modalStorageGuide.classList.add('hidden');
    });
  }

  // Pagination
  DOM.btnPagePrev.addEventListener('click', () => {
    if (state.currentPage > 1) {
      state.currentPage--;
      renderTable();
    }
  });

  DOM.btnPageNext.addEventListener('click', () => {
    const totalPages = Math.ceil(getFilteredFiles().length / state.pageSize) || 1;
    if (state.currentPage < totalPages) {
      state.currentPage++;
      renderTable();
    }
  });
}

// ==========================================
// Authentication Handlers
// ==========================================

function handleGoogleLogin() {
  const savedClientId = localStorage.getItem(CONFIG.STORAGE_KEY_CLIENT_ID);
  if (!savedClientId) {
    openSettingsModal();
    showToast('Vui lòng nhập Google Client ID trước khi đăng nhập', 'warning');
    return;
  }

  if (!window.gdriveService.isInitialized) {
    const ok = tryInitGoogleOAuth(savedClientId);
    if (!ok) {
      showToast('Không thể khởi động Google SDK. Vui lòng kiểm tra Client ID hoặc mạng.', 'error');
      return;
    }
  }

  try {
    window.gdriveService.requestAccessToken();
  } catch (err) {
    showToast(err.message, 'error');
  }
}

async function onLoginSuccess() {
  state.isDemoMode = false;
  state.isAuthenticated = true;
  localStorage.setItem(CONFIG.STORAGE_KEY_LAST_MODE, 'oauth');

  updateAuthStatusBar(true, 'Đã kết nối Google Drive', 'online');
  DOM.modeBanner.classList.add('hidden');
  DOM.btnLogout.classList.remove('hidden');
  DOM.btnLoginGoogle.classList.add('hidden');

  showToast('Đăng nhập Google thành công!', 'success');

  showDashboardScreen();
  await loadDriveData();
}

function handleLogout() {
  if (state.isDemoMode) {
    exitDemoMode();
    return;
  }

  window.gdriveService.signOut();
  state.isAuthenticated = false;
  state.user = null;
  state.files = [];
  state.selectedFileIds.clear();
  localStorage.removeItem(CONFIG.STORAGE_KEY_LAST_MODE);

  updateAuthStatusBar(false, 'Chưa kết nối tài khoản', 'offline');
  DOM.btnLogout.classList.add('hidden');
  DOM.btnLoginGoogle.classList.remove('hidden');

  showWelcomeScreen();
  showToast('Đã đăng xuất tài khoản Google', 'info');
}

// ==========================================
// Demo Mode
// ==========================================

function startDemoMode() {
  state.isDemoMode = true;
  state.isAuthenticated = true;
  localStorage.setItem(CONFIG.STORAGE_KEY_LAST_MODE, 'demo');

  updateAuthStatusBar(true, 'Chế độ Demo (Mô phỏng)', 'demo');
  DOM.modeBanner.classList.remove('hidden');
  DOM.btnLogout.classList.remove('hidden');
  DOM.btnLoginGoogle.classList.add('hidden');

  // Clone demo dataset so changes don't mutate base
  state.user = { ...DEMO_DATA.user };
  state.quota = { ...DEMO_DATA.storageQuota };
  state.files = JSON.parse(JSON.stringify(DEMO_DATA.files));

  showDashboardScreen();
  updateUserQuotaUI();
  calculateCategoryMetrics();
  renderTable();

  showToast('Đã khởi chạy Chế độ Demo với dữ liệu mẫu hoàn chỉnh!', 'success');
}

function exitDemoMode() {
  state.isDemoMode = false;
  state.isAuthenticated = false;
  state.user = null;
  state.files = [];
  state.selectedFileIds.clear();
  localStorage.removeItem(CONFIG.STORAGE_KEY_LAST_MODE);

  DOM.modeBanner.classList.add('hidden');
  updateAuthStatusBar(false, 'Chưa kết nối tài khoản', 'offline');
  DOM.btnLogout.classList.add('hidden');
  DOM.btnLoginGoogle.classList.remove('hidden');

  showWelcomeScreen();
  showToast('Đã thoát Chế độ Demo', 'info');
}

// ==========================================
// Screen Management
// ==========================================

function showWelcomeScreen() {
  DOM.welcomeSection.classList.remove('hidden');
  DOM.dashboardSection.classList.add('hidden');
}

function showDashboardScreen() {
  DOM.welcomeSection.classList.add('hidden');
  DOM.dashboardSection.classList.remove('hidden');
}

function updateAuthStatusBar(isOnline, text, dotClass) {
  const dot = DOM.authStatusBar.querySelector('.status-dot');
  dot.className = `status-dot ${dotClass}`;
  DOM.authStatusText.textContent = text;
}

// ==========================================
// Settings Modal
// ==========================================

function openSettingsModal() {
  DOM.modalSettings.classList.remove('hidden');
}

function closeSettingsModal() {
  DOM.modalSettings.classList.add('hidden');
}

function saveSettings() {
  const val = DOM.inputClientId.value.trim();
  if (!val) {
    showToast('Vui lòng không để trống Client ID', 'warning');
    return;
  }
  localStorage.setItem(CONFIG.STORAGE_KEY_CLIENT_ID, val);
  tryInitGoogleOAuth(val);
  closeSettingsModal();
  showToast('Đã lưu Google Client ID thành công!', 'success');
}

// ==========================================
// Drive Data Loading & Scanning
// ==========================================

async function loadDriveData() {
  if (state.isDemoMode) {
    updateUserQuotaUI();
    calculateCategoryMetrics();
    renderTable();
    return;
  }

  try {
    const about = await window.gdriveService.getAboutInfo();
    state.user = {
      displayName: about.user?.displayName || 'Người dùng Google',
      emailAddress: about.user?.emailAddress || '',
      photoLink: about.user?.photoLink || ''
    };
    state.quota = {
      limit: parseInt(about.storageQuota?.limit || '16106127360', 10),
      usage: parseInt(about.storageQuota?.usage || '0', 10),
      usageInDrive: parseInt(about.storageQuota?.usageInDrive || '0', 10),
      usageInDriveTrash: parseInt(about.storageQuota?.usageInDriveTrash || '0', 10)
    };

    updateUserQuotaUI();

    // Auto trigger initial scan
    await startScan();

  } catch (err) {
    console.error('Lỗi khi tải thông tin Google Drive:', err);
    showToast(`Lỗi: ${err.message}`, 'error');
  }
}

async function startScan() {
  if (state.isScanning) return;
  state.isScanning = true;

  DOM.btnStartScan.disabled = true;
  DOM.scanBtnText.textContent = 'Đang quét...';
  DOM.scanIcon.style.animation = 'spin 1s linear infinite';
  DOM.scanProgressBox.classList.remove('hidden');

  let liveCount = 0;
  let liveSize = 0;

  try {
    if (state.isDemoMode) {
      // Simulate live scanning animation
      for (let i = 1; i <= 4; i++) {
        await new Promise(r => setTimeout(r, 200));
        DOM.scanLiveProgress.style.width = `${i * 25}%`;
      }
      state.files = JSON.parse(JSON.stringify(DEMO_DATA.files));
    } else {
      state.files = await window.gdriveService.fetchAllFiles((count, batchSize) => {
        liveCount = count;
        DOM.scanCountLive.textContent = count;
        DOM.scanLiveProgress.style.width = `${Math.min(95, count / 5)}%`;
      });
    }

    DOM.scanLiveProgress.style.width = '100%';
    DOM.scanTimeIndicator.textContent = `Quét lúc ${new Date().toLocaleTimeString('vi-VN')}`;
    showToast(`Quét thành công ${state.files.length} tệp trên Google Drive!`, 'success');

  } catch (err) {
    console.error('Lỗi khi quét Google Drive:', err);
    showToast(`Quét thất bại: ${err.message}`, 'error');
  } finally {
    state.isScanning = false;
    DOM.btnStartScan.disabled = false;
    DOM.scanBtnText.textContent = 'Quét Lại File';
    DOM.scanIcon.style.animation = '';
    setTimeout(() => {
      DOM.scanProgressBox.classList.add('hidden');
    }, 600);

    state.selectedFileIds.clear();
    state.currentPage = 1;
    calculateCategoryMetrics();
    renderTable();
  }
}

// ==========================================
// Quota & UI Updates
// ==========================================

function updateUserQuotaUI() {
  if (!state.user || !state.quota) return;

  DOM.userDisplayName.textContent = state.user.displayName;
  DOM.userEmail.textContent = state.user.emailAddress;

  if (state.user.photoLink) {
    DOM.userAvatar.src = state.user.photoLink;
    DOM.userAvatar.classList.remove('hidden');
    DOM.userAvatarFallback.classList.add('hidden');
  } else {
    DOM.userAvatar.classList.add('hidden');
    DOM.userAvatarFallback.classList.remove('hidden');
    DOM.userAvatarFallback.textContent = (state.user.displayName || 'G')[0].toUpperCase();
  }

  const limit = state.quota.limit || 16106127360; // 15 GB default
  const usage = state.quota.usage || 0;
  const driveUsage = state.quota.usageInDrive || 0;
  const trashUsage = state.quota.usageInDriveTrash || 0;
  const free = Math.max(0, limit - usage);

  const percent = Math.min(100, Math.round((usage / limit) * 100));

  DOM.quotaUsedText.textContent = formatBytes(usage);
  DOM.quotaTotalText.textContent = formatBytes(limit);
  DOM.quotaPercentage.textContent = `${percent}%`;
  DOM.quotaProgressBar.style.width = `${percent}%`;

  DOM.quotaDriveVal.textContent = formatBytes(driveUsage);
  DOM.quotaTrashVal.textContent = formatBytes(trashUsage);
  DOM.quotaFreeVal.textContent = formatBytes(free);
}

// ==========================================
// Category & Duplicate Analysis
// ==========================================

function analyzeDuplicates(filesList) {
  // Map by hash or name+size
  const groups = new Map();
  const nonTrashed = filesList.filter(f => !f.trashed && parseInt(f.size || 0, 10) > 0);

  nonTrashed.forEach(file => {
    // If md5 exists use md5, otherwise name + size
    const key = file.md5Checksum ? `md5:${file.md5Checksum}` : `name_size:${file.name}_${file.size}`;
    if (!groups.has(key)) {
      groups.set(key, []);
    }
    groups.get(key).push(file);
  });

  // Filter groups with > 1 file
  const dupGroups = [];
  const duplicateFiles = [];

  groups.forEach((items, key) => {
    if (items.length > 1) {
      // Sort so oldest is first (original) and newer ones are copies
      items.sort((a, b) => new Date(a.modifiedTime) - new Date(b.modifiedTime));
      dupGroups.push(items);

      // Mark copies
      items.forEach((item, index) => {
        item.isDuplicate = true;
        item.isDuplicateCopy = index > 0; // index > 0 is redundant copy
        duplicateFiles.push(item);
      });
    }
  });

  return { dupGroups, duplicateFiles };
}

function calculateCategoryMetrics() {
  const all = state.files;
  const now = Date.now();
  const oldThresholdMs = CONFIG.OLD_FILE_DAYS_THRESHOLD * 24 * 60 * 60 * 1000;

  // Duplicate analysis
  const { dupGroups, duplicateFiles } = analyzeDuplicates(all);

  // Large files (> 100MB)
  const largeFiles = all.filter(f => !f.trashed && parseInt(f.size || 0, 10) >= CONFIG.LARGE_FILE_THRESHOLD_BYTES);

  // Trash files
  const trashFiles = all.filter(f => f.trashed);

  // Old files (> 1 year)
  const oldFiles = all.filter(f => {
    if (f.trashed) return false;
    const modTime = new Date(f.modifiedTime).getTime();
    return (now - modTime) > oldThresholdMs;
  });

  // Zero-byte files
  const zeroFiles = all.filter(f => !f.trashed && parseInt(f.size || 0, 10) === 0);

  // Totals
  const sumSize = (arr) => arr.reduce((acc, f) => acc + parseInt(f.size || 0, 10), 0);

  // Update DOM Metric cards
  DOM.metricAllSize.textContent = formatBytes(sumSize(all));
  DOM.metricAllCount.textContent = `${all.length} tệp`;
  DOM.tabCntAll.textContent = all.length;

  DOM.metricLargeSize.textContent = formatBytes(sumSize(largeFiles));
  DOM.metricLargeCount.textContent = `${largeFiles.length} tệp`;
  DOM.tabCntLarge.textContent = largeFiles.length;

  // Duplicate excess size = total duplicate size minus 1 original per group
  let excessDupSize = 0;
  dupGroups.forEach(grp => {
    const origSize = parseInt(grp[0].size || 0, 10);
    excessDupSize += origSize * (grp.length - 1);
  });
  DOM.metricDupsSize.textContent = formatBytes(excessDupSize);
  DOM.metricDupsCount.textContent = `${dupGroups.length} nhóm`;
  DOM.tabCntDuplicates.textContent = duplicateFiles.length;

  DOM.metricTrashSize.textContent = formatBytes(sumSize(trashFiles));
  DOM.metricTrashCount.textContent = `${trashFiles.length} tệp`;
  DOM.tabCntTrash.textContent = trashFiles.length;

  DOM.metricOldSize.textContent = formatBytes(sumSize(oldFiles));
  DOM.metricOldCount.textContent = `${oldFiles.length} tệp`;
  DOM.tabCntOld.textContent = oldFiles.length;

  DOM.metricZeroSize.textContent = '0 B';
  DOM.metricZeroCount.textContent = `${zeroFiles.length} tệp`;
  DOM.tabCntZero.textContent = zeroFiles.length;
}

// ==========================================
// Filtering, Sorting & Table Rendering
// ==========================================

function getFilteredFiles() {
  let list = [...state.files];
  const now = Date.now();
  const oldThresholdMs = CONFIG.OLD_FILE_DAYS_THRESHOLD * 24 * 60 * 60 * 1000;

  // Tab Filtering
  switch (state.activeTab) {
    case 'large':
      list = list.filter(f => !f.trashed && parseInt(f.size || 0, 10) >= CONFIG.LARGE_FILE_THRESHOLD_BYTES);
      break;
    case 'duplicates': {
      const { duplicateFiles } = analyzeDuplicates(state.files);
      const dupSet = new Set(duplicateFiles.map(d => d.id));
      list = list.filter(f => dupSet.has(f.id));
      break;
    }
    case 'trash':
      list = list.filter(f => f.trashed);
      break;
    case 'old':
      list = list.filter(f => !f.trashed && (now - new Date(f.modifiedTime).getTime()) > oldThresholdMs);
      break;
    case 'zero':
      list = list.filter(f => !f.trashed && parseInt(f.size || 0, 10) === 0);
      break;
    case 'all':
    default:
      // In 'all', display non-trashed by default unless specifically searching
      list = list.filter(f => !f.trashed);
      break;
  }

  // Type Filtering
  if (state.filterType !== 'all') {
    list = list.filter(f => getMimeCategory(f.mimeType, f.name) === state.filterType);
  }

  // Ownership Filtering
  if (state.ownershipFilter === 'owned') {
    list = list.filter(f => f.ownedByMe !== false);
  } else if (state.ownershipFilter === 'shared') {
    list = list.filter(f => f.ownedByMe === false);
  }

  // Search Query
  if (state.searchQuery) {
    list = list.filter(f => f.name.toLowerCase().includes(state.searchQuery));
  }

  // Sorting
  list.sort((a, b) => {
    const sizeA = parseInt(a.size || 0, 10);
    const sizeB = parseInt(b.size || 0, 10);
    const dateA = new Date(a.modifiedTime || 0).getTime();
    const dateB = new Date(b.modifiedTime || 0).getTime();

    switch (state.sortBy) {
      case 'size-desc': return sizeB - sizeA;
      case 'size-asc': return sizeA - sizeB;
      case 'date-desc': return dateB - dateA;
      case 'date-asc': return dateA - dateB;
      case 'name-asc': return a.name.localeCompare(b.name);
      default: return sizeB - sizeA;
    }
  });

  return list;
}

function switchTab(tabKey) {
  state.activeTab = tabKey;
  state.currentPage = 1;

  // Update tabs active state
  DOM.tabButtons.forEach(btn => {
    btn.classList.toggle('active', btn.dataset.tab === tabKey);
  });
  DOM.metricCards.forEach(card => {
    card.classList.toggle('active', card.dataset.tab === tabKey);
  });

  // Toggle specific action buttons based on tab
  DOM.btnSelectDuplicatesCopies.classList.toggle('hidden', tabKey !== 'duplicates');
  DOM.btnEmptyTrash.classList.toggle('hidden', tabKey !== 'trash');

  // Update text of trash vs permanent delete
  if (tabKey === 'trash') {
    DOM.btnMoveToTrash.classList.add('hidden');
  } else {
    DOM.btnMoveToTrash.classList.remove('hidden');
  }

  renderTable();
}

function renderTable() {
  const filtered = getFilteredFiles();
  const totalCount = filtered.length;
  const totalPages = Math.ceil(totalCount / state.pageSize) || 1;

  if (state.currentPage > totalPages) state.currentPage = totalPages;

  const startIdx = (state.currentPage - 1) * state.pageSize;
  const pageFiles = filtered.slice(startIdx, startIdx + state.pageSize);

  // Update pagination UI
  DOM.footerShowingCnt.textContent = pageFiles.length;
  DOM.footerTotalCnt.textContent = totalCount;
  DOM.currentPageEl.textContent = state.currentPage;
  DOM.totalPagesEl.textContent = totalPages;
  DOM.btnPagePrev.disabled = state.currentPage <= 1;
  DOM.btnPageNext.disabled = state.currentPage >= totalPages;

  // Empty state handling
  if (pageFiles.length === 0) {
    DOM.filesTableBody.innerHTML = '';
    DOM.tableEmptyState.classList.remove('hidden');
    DOM.filesTable.classList.add('hidden');
    updateSelectionBar();
    return;
  }

  DOM.tableEmptyState.classList.add('hidden');
  DOM.filesTable.classList.remove('hidden');

  // Populate Rows
  DOM.filesTableBody.innerHTML = pageFiles.map(file => {
    const isSelected = state.selectedFileIds.has(file.id);
    const category = getMimeCategory(file.mimeType, file.name);
    const iconClass = getFileIconClass(category);
    const iconSymbol = getFileIconSymbol(category);
    const sizeBytes = parseInt(file.size || 0, 10);

    let sizeHighlight = 'size-highlight-small';
    if (sizeBytes > 1024 * 1024 * 1024) sizeHighlight = 'size-highlight-huge';
    else if (sizeBytes > 100 * 1024 * 1024) sizeHighlight = 'size-highlight-large';
    else if (sizeBytes > 10 * 1024 * 1024) sizeHighlight = 'size-highlight-medium';

    return `
      <tr class="${isSelected ? 'selected' : ''}" data-file-id="${file.id}">
        <td class="th-check">
          <label class="custom-checkbox">
            <input type="checkbox" class="row-checkbox" data-file-id="${file.id}" ${isSelected ? 'checked' : ''}>
            <span class="checkmark"></span>
          </label>
        </td>
        <td>
          <div class="file-name-cell">
            <div class="file-icon-badge ${iconClass}">${iconSymbol}</div>
            <div class="file-text-info">
              <a href="${file.webViewLink || '#'}" target="_blank" rel="noopener" class="file-name-title" title="${file.name}">
                ${escapeHtml(file.name)}
              </a>
              <div class="file-meta-sub">
                ${file.ownedByMe === false ? '<span class="badge-shared" title="Tệp do người khác chia sẻ - Không chiếm dung lượng của bạn">👥 Tệp chia sẻ</span>' : ''}
                ${file.trashed ? '<span class="badge-trashed">Đang trong Thùng rác</span>' : ''}
                ${file.isDuplicateCopy ? '<span class="badge-dup-copy">Bản sao trùng lặp</span>' : ''}
                ${file.isDuplicate && !file.isDuplicateCopy ? '<span class="badge-dup-copy" style="opacity:0.7">Bản gốc</span>' : ''}
              </div>
            </div>
          </div>
        </td>
        <td>
          <span class="type-pill">${category}</span>
        </td>
        <td>
          <span class="file-size-val ${sizeHighlight}">${formatBytes(sizeBytes)}</span>
        </td>
        <td>
          <span class="file-date-val">${formatDate(file.modifiedTime)}</span>
        </td>
        <td>
          <div class="row-actions">
            ${file.webViewLink ? `
              <a href="${file.webViewLink}" target="_blank" rel="noopener" class="btn-row-action" title="Mở trong Google Drive">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path><polyline points="15 3 21 3 21 9"></polyline><line x1="10" y1="14" x2="21" y2="3"></line></svg>
              </a>
            ` : ''}
            ${file.ownedByMe === false || (file.capabilities && file.capabilities.canDelete === false) ? `
              <button class="btn-row-action" style="opacity: 0.35; cursor: not-allowed;" title="Tệp do người khác chia sẻ: Bạn không phải chủ sở hữu nên không có quyền xóa tệp này">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><line x1="4.93" y1="4.93" x2="19.07" y2="19.07"></line></svg>
              </button>
            ` : `
              <button class="btn-row-action action-delete btn-single-delete" data-file-id="${file.id}" title="${file.trashed ? 'Xóa vĩnh viễn' : 'Bỏ vào thùng rác'}">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
              </button>
            `}
          </div>
        </td>
      </tr>
    `;
  }).join('');

  // Attach row event listeners
  DOM.filesTableBody.querySelectorAll('.row-checkbox').forEach(chk => {
    chk.addEventListener('change', (e) => {
      const id = e.target.dataset.fileId;
      if (e.target.checked) {
        state.selectedFileIds.add(id);
      } else {
        state.selectedFileIds.delete(id);
      }
      updateSelectionBar();
      // Update tr style
      const tr = e.target.closest('tr');
      if (tr) tr.classList.toggle('selected', e.target.checked);
    });
  });

  DOM.filesTableBody.querySelectorAll('.btn-single-delete').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const id = btn.dataset.fileId;
      const targetFile = state.files.find(f => f.id === id);
      if (!targetFile) return;

      state.selectedFileIds.clear();
      state.selectedFileIds.add(id);
      updateSelectionBar();
      openConfirmModal(targetFile.trashed ? 'delete' : 'trash');
    });
  });

  updateSelectionBar();
}

function escapeHtml(str) {
  if (!str) return '';
  return str.replace(/[&<>'"]/g, 
    tag => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[tag] || tag)
  );
}

// ==========================================
// Selection Management
// ==========================================

function handleSelectAll(e) {
  const isChecked = e.target.checked;
  const filtered = getFilteredFiles();

  if (isChecked) {
    filtered.forEach(f => state.selectedFileIds.add(f.id));
  } else {
    state.selectedFileIds.clear();
  }

  renderTable();
}

function selectDuplicateCopies() {
  const { duplicateFiles } = analyzeDuplicates(state.files);
  const copies = duplicateFiles.filter(f => f.isDuplicateCopy);

  state.selectedFileIds.clear();
  copies.forEach(c => state.selectedFileIds.add(c.id));

  renderTable();
  showToast(`Đã tự động chọn ${copies.length} bản sao thừa (giữ lại 1 bản gốc)!`, 'success');
}

function updateSelectionBar() {
  const count = state.selectedFileIds.size;
  let totalBytes = 0;

  state.selectedFileIds.forEach(id => {
    const file = state.files.find(f => f.id === id);
    if (file) totalBytes += parseInt(file.size || 0, 10);
  });

  DOM.selectedSummaryText.innerHTML = `Đã chọn <strong>${count}</strong> tệp (${formatBytes(totalBytes)})`;
  DOM.btnSelectedCounts.forEach(el => el.textContent = count);

  DOM.btnMoveToTrash.disabled = count === 0;
  DOM.btnDeletePermanently.disabled = count === 0;

  // Checkbox select all state
  const filtered = getFilteredFiles();
  const allSelected = filtered.length > 0 && filtered.every(f => state.selectedFileIds.has(f.id));
  DOM.checkboxSelectAll.checked = allSelected;
}

// ==========================================
// Confirmation Dialog & Execution
// ==========================================

function openConfirmModal(actionType) {
  // If empty trash action, we target all trashed files
  if (actionType === 'empty_trash') {
    const trashedFiles = state.files.filter(f => f.trashed);
    if (trashedFiles.length === 0) {
      showToast('Thùng rác hiện đang trống!', 'info');
      return;
    }
    const totalSize = trashedFiles.reduce((acc, f) => acc + parseInt(f.size || 0, 10), 0);

    state.deletionTarget = {
      actionType: 'empty_trash',
      files: trashedFiles,
      fileCount: trashedFiles.length,
      totalBytes: totalSize
    };

    DOM.confirmModalTitle.textContent = 'Dọn Sạch Thùng Rác';
    DOM.confirmModalMessage.innerHTML = `Bạn có chắc chắn muốn <strong>xóa vĩnh viễn toàn bộ ${trashedFiles.length} tệp</strong> trong Thùng rác không?`;
    DOM.confirmFileCount.textContent = trashedFiles.length;
    DOM.confirmFileSize.textContent = formatBytes(totalSize);
    DOM.confirmDeleteType.textContent = 'Làm Rỗng Thùng Rác (Vĩnh Viễn)';
    DOM.confirmDeleteType.className = 'badge-danger';
    DOM.confirmWarningBox.classList.remove('hidden');

    DOM.modalConfirmDelete.classList.remove('hidden');
    return;
  }

  // Regular batch selection
  if (state.selectedFileIds.size === 0) {
    showToast('Vui lòng chọn ít nhất 1 tệp để thực hiện', 'warning');
    return;
  }

  const selectedFiles = state.files.filter(f => state.selectedFileIds.has(f.id));
  const unownedFiles = selectedFiles.filter(f => f.ownedByMe === false || (f.capabilities && f.capabilities.canDelete === false));
  const deletableFiles = selectedFiles.filter(f => f.ownedByMe !== false && (!f.capabilities || f.capabilities.canDelete !== false));
  const deletableSize = deletableFiles.reduce((acc, f) => acc + parseInt(f.size || 0, 10), 0);

  state.deletionTarget = {
    actionType: actionType, // 'trash' or 'delete'
    files: selectedFiles,
    deletableFiles: deletableFiles,
    unownedFiles: unownedFiles,
    fileCount: deletableFiles.length,
    totalBytes: deletableSize
  };

  let unownedNoticeHtml = '';
  if (unownedFiles.length > 0) {
    unownedNoticeHtml = `<div class="unowned-callout">⚠️ Có <strong>${unownedFiles.length} tệp được chia sẻ</strong> (do người khác sở hữu, ví dụ: file game/phim chia sẻ link). Các tệp này không tính vào dung lượng của bạn và bạn không có quyền xóa. Hệ thống sẽ <strong>tự động bỏ qua</strong> chúng và xóa <strong>${deletableFiles.length} tệp</strong> thuộc quyền sở hữu của bạn.</div>`;
  }

  if (actionType === 'trash') {
    DOM.confirmModalTitle.textContent = 'Bỏ Tệp Vào Thùng Rác';
    DOM.confirmModalMessage.innerHTML = `Bạn muốn chuyển <strong>${deletableFiles.length} tệp</strong> thuộc quyền sở hữu của bạn vào Thùng rác Google Drive? ${unownedNoticeHtml}`;
    DOM.confirmDeleteType.textContent = 'Bỏ Vào Thùng Rác (Có thể khôi phục)';
    DOM.confirmDeleteType.className = 'btn-warning';
    DOM.confirmWarningBox.classList.add('hidden');
  } else {
    DOM.confirmModalTitle.textContent = 'Xác Nhận Xóa Vĩnh Viễn';
    DOM.confirmModalMessage.innerHTML = `Hành động này sẽ <strong>xóa vĩnh viễn ${deletableFiles.length} tệp</strong> khỏi Google Drive để giải phóng dung lượng. ${unownedNoticeHtml}`;
    DOM.confirmDeleteType.textContent = 'Xóa Vĩnh Viễn';
    DOM.confirmDeleteType.className = 'badge-danger';
    DOM.confirmWarningBox.classList.remove('hidden');
  }

  DOM.confirmFileCount.textContent = deletableFiles.length;
  DOM.confirmFileSize.textContent = formatBytes(deletableSize);
  DOM.modalConfirmDelete.classList.remove('hidden');
}

function closeConfirmModal() {
  DOM.modalConfirmDelete.classList.add('hidden');
  state.deletionTarget = null;
}

async function executeConfirmedDeletion() {
  if (!state.deletionTarget) return;

  const { actionType, files, deletableFiles, unownedFiles, totalBytes } = state.deletionTarget;
  const processList = deletableFiles || files;
  const unownedList = unownedFiles || [];

  closeConfirmModal();

  // Reset & Open Operation Progress Modal
  state.isOperationAborted = false;
  DOM.opModalTitle.textContent = actionType === 'trash' 
    ? 'Đang Chuyển Vào Thùng Rác...' 
    : (actionType === 'empty_trash' ? 'Đang Dọn Sạch Thùng Rác...' : 'Đang Xóa Vĩnh Viễn Tệp...');
  DOM.opModalSubtitle.textContent = 'Vui lòng không đóng trình duyệt trong khi đang xử lý';
  DOM.opSpinner.className = 'spinner-brand';
  DOM.opBarFill.style.width = '0%';
  DOM.opPercentVal.textContent = '0%';
  DOM.opStatusLabel.textContent = 'Đang chuẩn bị tiến trình...';

  const totalToProcess = actionType === 'empty_trash' ? files.length : (processList.length + unownedList.length);
  DOM.opStatProgress.textContent = `0 / ${totalToProcess}`;
  DOM.opStatSuccess.textContent = '0 tệp';
  DOM.opStatFreed.textContent = '0 B';
  DOM.opStatSkipped.textContent = `${unownedList.length} tệp`;
  DOM.opCurrentFilename.textContent = 'Bắt đầu xử lý...';
  DOM.opCurrentFilesize.textContent = '--';
  DOM.opEtaText.textContent = 'Đang tính toán...';
  DOM.opLogList.innerHTML = '';
  
  DOM.btnStopOperation.classList.remove('hidden');
  DOM.btnStopOperation.disabled = false;
  DOM.btnStopOperation.textContent = 'Dừng Quá Trình';
  DOM.btnFinishOperation.classList.add('hidden');
  DOM.btnCloseProgress.classList.add('hidden');
  DOM.modalOperationProgress.classList.remove('hidden');

  const addLog = (icon, name, sizeStr, type = 'success') => {
    const item = document.createElement('div');
    item.className = `log-item log-item-${type}`;
    item.innerHTML = `
      <span class="log-item-name">${icon} ${escapeHtml(name)}</span>
      <span>${sizeStr}</span>
    `;
    DOM.opLogList.appendChild(item);
    DOM.opLogList.scrollTop = DOM.opLogList.scrollHeight;
  };

  // First, log all skipped unowned files if any
  unownedList.forEach(f => {
    addLog('⏭️', f.name, 'Bỏ qua (Tệp chia sẻ)', 'skipped');
  });

  const startTime = Date.now();
  let processedCount = unownedList.length;
  let successCount = 0;
  let freedBytes = 0;
  let failedCount = 0;
  const deletedIds = new Set();

  try {
    if (state.isDemoMode) {
      if (actionType === 'empty_trash') {
        const trashed = state.files.filter(f => f.trashed);
        for (let i = 0; i < trashed.length; i++) {
          if (state.isOperationAborted) break;
          const f = trashed[i];
          DOM.opCurrentFilename.textContent = f.name;
          DOM.opCurrentFilesize.textContent = formatBytes(parseInt(f.size || 0, 10));
          await new Promise(r => setTimeout(r, 60));
          successCount++;
          freedBytes += parseInt(f.size || 0, 10);
          addLog('🗑️', f.name, formatBytes(parseInt(f.size || 0, 10)), 'success');
          
          const pct = Math.round(((i + 1) / trashed.length) * 100);
          DOM.opBarFill.style.width = `${pct}%`;
          DOM.opPercentVal.textContent = `${pct}%`;
          DOM.opStatProgress.textContent = `${i + 1} / ${trashed.length}`;
          DOM.opStatSuccess.textContent = `${successCount} tệp`;
          DOM.opStatFreed.textContent = formatBytes(freedBytes);
        }
        state.files = state.files.filter(f => !f.trashed);
        state.quota.usage = Math.max(0, state.quota.usage - freedBytes);
        state.quota.usageInDriveTrash = 0;
      } else {
        for (let i = 0; i < processList.length; i++) {
          if (state.isOperationAborted) {
            addLog('⚠️', 'Đã dừng theo yêu cầu của bạn', '', 'error');
            break;
          }
          const f = processList[i];
          DOM.opCurrentFilename.textContent = f.name;
          DOM.opCurrentFilesize.textContent = formatBytes(parseInt(f.size || 0, 10));
          DOM.opStatusLabel.textContent = `Đang xử lý (${i + 1}/${processList.length})...`;

          await new Promise(r => setTimeout(r, 50)); // smooth visual simulation

          deletedIds.add(f.id);
          successCount++;
          freedBytes += parseInt(f.size || 0, 10);
          processedCount++;

          addLog(actionType === 'trash' ? '📥' : '✅', f.name, formatBytes(parseInt(f.size || 0, 10)), 'success');

          const pct = Math.round((processedCount / totalToProcess) * 100);
          DOM.opBarFill.style.width = `${pct}%`;
          DOM.opPercentVal.textContent = `${pct}%`;
          DOM.opStatProgress.textContent = `${processedCount} / ${totalToProcess}`;
          DOM.opStatSuccess.textContent = `${successCount} tệp`;
          DOM.opStatFreed.textContent = formatBytes(freedBytes);

          // ETA
          const elapsed = (Date.now() - startTime) / 1000;
          const remainingItems = totalToProcess - processedCount;
          const rate = processedCount / elapsed;
          const etaSec = rate > 0 ? Math.ceil(remainingItems / rate) : 0;
          DOM.opEtaText.textContent = remainingItems > 0 ? `Ước tính: ~${etaSec}s còn lại` : 'Gần xong...';
        }

        if (actionType === 'trash') {
          state.files.forEach(f => {
            if (deletedIds.has(f.id)) f.trashed = true;
          });
          state.quota.usageInDriveTrash += freedBytes;
        } else {
          state.files = state.files.filter(f => !deletedIds.has(f.id));
          state.quota.usage = Math.max(0, state.quota.usage - freedBytes);
        }
      }

    } else {
      // Real Google Drive API calls with real-time feedback
      if (actionType === 'empty_trash') {
        DOM.opCurrentFilename.textContent = 'Đang gọi Google API để dọn sạch Thùng rác...';
        DOM.opStatusLabel.textContent = 'Đang làm rỗng thùng rác...';
        await window.gdriveService.emptyTrash();
        state.files = state.files.filter(f => !f.trashed);
        successCount = files.length;
        freedBytes = totalBytes;
        addLog('🗑️', 'Đã dọn sạch toàn bộ thùng rác Google Drive', formatBytes(totalBytes), 'success');
        DOM.opBarFill.style.width = '100%';
        DOM.opPercentVal.textContent = '100%';
        DOM.opStatProgress.textContent = `${files.length} / ${files.length}`;
        DOM.opStatSuccess.textContent = `${files.length} tệp`;
        DOM.opStatFreed.textContent = formatBytes(totalBytes);
      } else {
        for (let i = 0; i < processList.length; i++) {
          if (state.isOperationAborted) {
            addLog('⚠️', 'Đã dừng theo yêu cầu của bạn', '', 'error');
            break;
          }

          const file = processList[i];
          DOM.opCurrentFilename.textContent = file.name;
          DOM.opCurrentFilesize.textContent = formatBytes(parseInt(file.size || 0, 10));
          DOM.opStatusLabel.textContent = `Đang xử lý ${i + 1}/${processList.length}...`;

          try {
            if (actionType === 'trash') {
              await window.gdriveService.moveToTrash(file.id);
              file.trashed = true;
            } else {
              await window.gdriveService.deletePermanently(file.id);
            }

            deletedIds.add(file.id);
            successCount++;
            freedBytes += parseInt(file.size || 0, 10);
            addLog(actionType === 'trash' ? '📥' : '✅', file.name, formatBytes(parseInt(file.size || 0, 10)), 'success');

          } catch (err) {
            console.warn(`Lỗi khi xử lý tệp ${file.name}:`, err);
            failedCount++;
            addLog('❌', file.name, 'Lỗi quyền hoặc mạng', 'error');
          }

          processedCount++;
          const pct = Math.round((processedCount / totalToProcess) * 100);
          DOM.opBarFill.style.width = `${pct}%`;
          DOM.opPercentVal.textContent = `${pct}%`;
          DOM.opStatProgress.textContent = `${processedCount} / ${totalToProcess}`;
          DOM.opStatSuccess.textContent = `${successCount} tệp`;
          DOM.opStatFreed.textContent = formatBytes(freedBytes);

          // ETA calculation
          const elapsed = (Date.now() - startTime) / 1000;
          const remainingItems = totalToProcess - processedCount;
          const rate = (i + 1) / elapsed;
          const etaSec = rate > 0 ? Math.ceil(remainingItems / rate) : 0;
          DOM.opEtaText.textContent = remainingItems > 0 ? `Ước tính: ~${etaSec}s còn lại` : 'Đang hoàn tất...';
        }

        if (actionType === 'delete') {
          state.files = state.files.filter(f => !deletedIds.has(f.id));
        }
      }

      // Refresh real quota from Drive
      try {
        const about = await window.gdriveService.getAboutInfo();
        state.quota = {
          limit: parseInt(about.storageQuota?.limit || '16106127360', 10),
          usage: parseInt(about.storageQuota?.usage || '0', 10),
          usageInDrive: parseInt(about.storageQuota?.usageInDrive || '0', 10),
          usageInDriveTrash: parseInt(about.storageQuota?.usageInDriveTrash || '0', 10)
        };
      } catch (e) {
        console.warn('Không thể tải lại quota:', e);
      }
    }

  } catch (err) {
    console.error('Lỗi khi xóa tệp:', err);
    addLog('❌', 'Lỗi nghiêm trọng: ' + err.message, '', 'error');
    showToast(`Thao tác xóa thất bại: ${err.message}`, 'error');
  } finally {
    // Operation completed or stopped
    DOM.opSpinner.className = 'spinner-brand completed';
    DOM.opModalTitle.textContent = state.isOperationAborted ? 'Đã Tạm Dừng Quá Trình' : '🎉 Hoàn Tất Dọn Dẹp!';
    DOM.opModalSubtitle.textContent = `Đã xử lý ${successCount} tệp, giải phóng ${formatBytes(freedBytes)} dung lượng`;
    DOM.opStatusLabel.textContent = state.isOperationAborted ? 'Đã tạm dừng' : 'Đã hoàn thành';
    DOM.opBarFill.style.width = '100%';
    DOM.opPercentVal.textContent = '100%';
    DOM.opCurrentFilename.textContent = `Thành công: ${successCount} tệp | Bỏ qua: ${unownedList.length} | Lỗi: ${failedCount}`;
    DOM.opEtaText.textContent = 'Hoàn tất';

    DOM.btnStopOperation.classList.add('hidden');
    DOM.btnFinishOperation.classList.remove('hidden');
    DOM.btnCloseProgress.classList.remove('hidden');

    state.selectedFileIds.clear();
    updateUserQuotaUI();
    calculateCategoryMetrics();
    renderTable();

    if (unownedList.length > 0) {
      showToast(`Đã xóa ${successCount} tệp thành công (${formatBytes(freedBytes)}). Đã bỏ qua ${unownedList.length} tệp chia sẻ.`, 'warning');
    } else {
      showToast(`Đã dọn dẹp thành công ${successCount} tệp! Giải phóng ${formatBytes(freedBytes)} bộ nhớ.`, 'success');
    }
  }
}

// ==========================================
// Drive Nuke / Factory Reset Handlers
// ==========================================

function openNukeModal() {
  const usage = state.quota?.usage || 0;
  const driveUsage = state.quota?.usageInDrive || 0;
  const trashUsage = state.quota?.usageInDriveTrash || 0;
  const totalWipe = driveUsage + trashUsage;

  DOM.nukeTotalFreedVal.textContent = formatBytes(totalWipe > 0 ? totalWipe : usage);
  DOM.inputNukeConfirm.value = '';
  DOM.btnExecuteNuke.disabled = true;
  DOM.modalNukeDrive.classList.remove('hidden');
}

function closeNukeModal() {
  DOM.modalNukeDrive.classList.add('hidden');
  DOM.inputNukeConfirm.value = '';
}

async function executeDriveNuke() {
  closeNukeModal();

  state.isOperationAborted = false;
  DOM.opModalTitle.textContent = '🔥 Đang Dọn Trắng Toàn Bộ Google Drive...';
  DOM.opModalSubtitle.textContent = 'Đang tiến hành dọn sạch 100% dung lượng theo 3 giai đoạn';
  DOM.opSpinner.className = 'spinner-brand';
  DOM.opBarFill.style.width = '5%';
  DOM.opPercentVal.textContent = '5%';
  DOM.opStatusLabel.textContent = 'Giai đoạn 1/3: Đang quét & xóa thư mục gốc...';

  DOM.opStatProgress.textContent = 'Giai đoạn 1/3';
  DOM.opStatSuccess.textContent = '0 tệp';
  DOM.opStatFreed.textContent = '0 B';
  DOM.opStatSkipped.textContent = '0 tệp';
  DOM.opCurrentFilename.textContent = 'Đang chuẩn bị danh sách thư mục gốc...';
  DOM.opCurrentFilesize.textContent = '--';
  DOM.opEtaText.textContent = 'Đang tính toán...';
  DOM.opLogList.innerHTML = '';

  DOM.btnStopOperation.classList.remove('hidden');
  DOM.btnStopOperation.disabled = false;
  DOM.btnStopOperation.textContent = 'Dừng Quá Trình';
  DOM.btnFinishOperation.classList.add('hidden');
  DOM.btnCloseProgress.classList.add('hidden');
  DOM.modalOperationProgress.classList.remove('hidden');

  const addLog = (icon, name, sizeStr, type = 'success') => {
    const item = document.createElement('div');
    item.className = `log-item log-item-${type}`;
    item.innerHTML = `
      <span class="log-item-name">${icon} ${escapeHtml(name)}</span>
      <span>${sizeStr}</span>
    `;
    DOM.opLogList.appendChild(item);
    DOM.opLogList.scrollTop = DOM.opLogList.scrollHeight;
  };

  addLog('🚀', 'BẮT ĐẦU QUY TRÌNH DỌN TRẮNG TOÀN BỘ DRIVE', 'Target: 0 GB', 'success');

  let successCount = 0;
  let freedBytes = 0;
  let skippedCount = 0;

  try {
    if (state.isDemoMode) {
      // Demo wipe simulation
      const allFiles = [...state.files];
      for (let i = 0; i < allFiles.length; i++) {
        if (state.isOperationAborted) break;
        const f = allFiles[i];
        if (f.ownedByMe === false) {
          skippedCount++;
          addLog('⏭️', f.name, 'Giữ lại (Tệp chia sẻ)', 'skipped');
          continue;
        }

        DOM.opCurrentFilename.textContent = f.name;
        DOM.opCurrentFilesize.textContent = formatBytes(parseInt(f.size || 0, 10));
        await new Promise(r => setTimeout(r, 40));

        successCount++;
        freedBytes += parseInt(f.size || 0, 10);
        addLog('💥', f.name, formatBytes(parseInt(f.size || 0, 10)), 'success');

        const pct = Math.min(95, Math.round(((i + 1) / allFiles.length) * 100));
        DOM.opBarFill.style.width = `${pct}%`;
        DOM.opPercentVal.textContent = `${pct}%`;
        DOM.opStatSuccess.textContent = `${successCount} tệp`;
        DOM.opStatFreed.textContent = formatBytes(freedBytes);
      }

      state.files = state.files.filter(f => f.ownedByMe === false);
      state.quota.usage = 0;
      state.quota.usageInDrive = 0;
      state.quota.usageInDriveTrash = 0;

    } else {
      // Real Drive Factory Reset

      // ==========================================
      // GIAI ĐOẠN 1: XÓA CÁC THƯ MỤC VÀ TỆP GỐC
      // ==========================================
      DOM.opStatusLabel.textContent = 'Giai đoạn 1/3: Xóa thư mục & tệp gốc (Root)...';
      addLog('📁', 'GIAI ĐOẠN 1: Quét các thư mục và tệp gốc trên Drive...', '', 'active');

      const rootItems = await window.gdriveService.fetchRootItems();
      addLog('ℹ️', `Tìm thấy ${rootItems.length} thư mục/tệp gốc cần dọn dẹp`, '', 'active');

      for (let i = 0; i < rootItems.length; i++) {
        if (state.isOperationAborted) break;
        const item = rootItems[i];
        DOM.opCurrentFilename.textContent = `[Gốc] ${item.name}`;
        DOM.opCurrentFilesize.textContent = formatBytes(parseInt(item.size || 0, 10));

        try {
          await window.gdriveService.deletePermanently(item.id);
          successCount++;
          freedBytes += parseInt(item.size || 0, 10);
          addLog('💥', `Đã xóa: ${item.name}`, formatBytes(parseInt(item.size || 0, 10)), 'success');
        } catch (err) {
          console.warn(`Không thể xóa ${item.name}:`, err);
          addLog('⚠️', `Bỏ qua ${item.name}: ${err.message}`, '', 'skipped');
          skippedCount++;
        }

        const pct = Math.round(((i + 1) / (rootItems.length + 10)) * 30);
        DOM.opBarFill.style.width = `${pct}%`;
        DOM.opPercentVal.textContent = `${pct}%`;
        DOM.opStatSuccess.textContent = `${successCount} mục`;
        DOM.opStatFreed.textContent = formatBytes(freedBytes);
      }

      // ==========================================
      // GIAI ĐOẠN 2: DỌN CÁC TỆP MỒ CÔI / TỆP CÒN SÓT LẠI
      // ==========================================
      if (!state.isOperationAborted) {
        DOM.opStatusLabel.textContent = 'Giai đoạn 2/3: Quét và dọn tệp mồ côi còn sót lại...';
        addLog('🧹', 'GIAI ĐOẠN 2: Kiểm tra các tệp lẻ ngoài thư mục gốc...', '', 'active');

        let remainingFiles = await window.gdriveService.fetchActiveOwnedFiles(500);
        let batchLoop = 0;

        while (remainingFiles.length > 0 && batchLoop < 20) {
          if (state.isOperationAborted) break;
          addLog('ℹ️', `Đang dọn đợt ${batchLoop + 1}: ${remainingFiles.length} tệp...`, '', 'active');

          for (let j = 0; j < remainingFiles.length; j++) {
            if (state.isOperationAborted) break;
            const f = remainingFiles[j];
            DOM.opCurrentFilename.textContent = f.name;
            DOM.opCurrentFilesize.textContent = formatBytes(parseInt(f.size || 0, 10));

            try {
              await window.gdriveService.deletePermanently(f.id);
              successCount++;
              freedBytes += parseInt(f.size || 0, 10);
              addLog('🗑️', f.name, formatBytes(parseInt(f.size || 0, 10)), 'success');
            } catch (err) {
              skippedCount++;
            }

            const pct = Math.min(80, 30 + Math.round(((j + 1) / remainingFiles.length) * 45));
            DOM.opBarFill.style.width = `${pct}%`;
            DOM.opPercentVal.textContent = `${pct}%`;
            DOM.opStatSuccess.textContent = `${successCount} mục`;
            DOM.opStatFreed.textContent = formatBytes(freedBytes);
          }

          batchLoop++;
          remainingFiles = await window.gdriveService.fetchActiveOwnedFiles(500);
        }
      }

      // ==========================================
      // GIAI ĐOẠN 3: LÀM RỖNG THÙNG RÁC VĨNH VIỄN
      // ==========================================
      if (!state.isOperationAborted) {
        DOM.opStatusLabel.textContent = 'Giai đoạn 3/3: Làm rỗng Thùng rác vĩnh viễn (emptyTrash)...';
        addLog('🔥', 'GIAI ĐOẠN 3: Xóa sạch toàn bộ Thùng rác để giải phóng 100% dung lượng...', '', 'active');

        await window.gdriveService.emptyTrash();
        addLog('✅', 'Đã làm rỗng hoàn toàn Thùng rác Google Drive!', '', 'success');
        DOM.opBarFill.style.width = '95%';
        DOM.opPercentVal.textContent = '95%';
      }

      // Refresh actual quota and re-scan
      try {
        const about = await window.gdriveService.getAboutInfo();
        state.quota = {
          limit: parseInt(about.storageQuota?.limit || '16106127360', 10),
          usage: parseInt(about.storageQuota?.usage || '0', 10),
          usageInDrive: parseInt(about.storageQuota?.usageInDrive || '0', 10),
          usageInDriveTrash: parseInt(about.storageQuota?.usageInDriveTrash || '0', 10)
        };
      } catch (e) {
        console.warn('Lỗi làm mới quota:', e);
      }
    }

    // Finished
    DOM.opBarFill.style.width = '100%';
    DOM.opPercentVal.textContent = '100%';
    DOM.opSpinner.className = 'spinner-brand completed';
    DOM.opModalTitle.textContent = state.isOperationAborted ? 'Đã Tạm Dừng Dọn Trắng' : '✨ GOOGLE DRIVE ĐÃ ĐƯỢC DỌN TRẮNG 100%!';
    DOM.opModalSubtitle.textContent = `Đã dọn dẹp thành công ${successCount} mục, đưa bộ nhớ Drive về trạng thái trống hoàn toàn!`;
    DOM.opStatusLabel.textContent = 'Đã hoàn tất quy trình Dọn Trắng Drive';
    DOM.opCurrentFilename.textContent = `Thành công: ${successCount} mục | Dung lượng đã giải phóng: ${formatBytes(freedBytes)}`;
    DOM.opEtaText.textContent = '0s';

    addLog('🎉', 'DỌN TRẮNG HOÀN TẤT: GOOGLE DRIVE ĐÃ TRỐNG 100%!', '', 'success');

  } catch (err) {
    console.error('Lỗi khi dọn trắng Drive:', err);
    addLog('❌', 'Lỗi: ' + err.message, '', 'error');
    showToast(`Dọn trắng thất bại: ${err.message}`, 'error');
  } finally {
    DOM.btnStopOperation.classList.add('hidden');
    DOM.btnFinishOperation.classList.remove('hidden');
    DOM.btnCloseProgress.classList.remove('hidden');

    state.selectedFileIds.clear();
    updateUserQuotaUI();

    // Trigger re-scan to show clean state
    if (!state.isDemoMode) {
      setTimeout(() => startScan(), 1000);
    } else {
      calculateCategoryMetrics();
      renderTable();
    }
  }
}

// ==========================================
// CSV Export
// ==========================================

function exportToCsv() {
  const filtered = getFilteredFiles();
  if (filtered.length === 0) {
    showToast('Không có tệp nào để xuất báo cáo', 'warning');
    return;
  }

  const headers = ['Tên Tệp', 'Loại', 'Dung Lượng (Bytes)', 'Dung Lượng', 'Thời Gian Cập Nhật', 'Trạng Thái', 'Đường Dẫn'];
  const rows = filtered.map(f => [
    `"${(f.name || '').replace(/"/g, '""')}"`,
    `"${getMimeCategory(f.mimeType, f.name)}"`,
    f.size || 0,
    `"${formatBytes(parseInt(f.size || 0, 10))}"`,
    `"${formatDate(f.modifiedTime)}"`,
    f.trashed ? '"Trong thùng rác"' : '"Bình thường"',
    `"${f.webViewLink || ''}"`
  ]);

  const csvContent = '\uFEFF' + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);

  const link = document.createElement('a');
  link.href = url;
  link.download = `CleanDrive_Report_${state.activeTab}_${Date.now()}.csv`;
  link.click();
  URL.revokeObjectURL(url);

  showToast(`Đã xuất báo cáo ${filtered.length} tệp ra file CSV!`, 'success');
}

// ==========================================
// Start Application
// ==========================================
document.addEventListener('DOMContentLoaded', initApp);
