/* ==============================
  🎨 테마 관리자
  ============================== */

export const ThemeManager = {
  THEMES: { LIGHT: 'light', DARK: 'dark' },
  STORAGE_KEY: 'theme-mode',
  MANUAL_MODE_KEY: 'manual-theme-mode',
  _domCache: { html: null, toggleButton: null, toggleLabel: null, liveRegion: null },
  currentTheme: 'light',
  isManualMode: false,
  
  init() {
    console.log('🎨 [ThemeManager] 초기화 시작');
    this._initDOMCache();
    this.loadSettings();
    console.log('  ├─ 현재 테마:', this.currentTheme, '| 수동 모드:', this.isManualMode);
    this.setupEventListeners();
    this.applyCurrentState();
    this.syncToggleButton();
    console.log('✅ [ThemeManager] 초기화 완료');
  },
  
  _initDOMCache() {
    this._domCache.html = document.documentElement;
    this._domCache.html.classList.remove('no-js');
    this._domCache.html.classList.add('js');
    this._domCache.toggleButton = document.querySelector('.theme-toggle');
    if (this._domCache.toggleButton) {
      this._domCache.toggleLabel = this._domCache.toggleButton.querySelector('.label');
    }
    this._domCache.liveRegion = document.getElementById('theme-announcer');
  },
  
  loadSettings() {
    const savedTheme = localStorage.getItem(this.STORAGE_KEY);
    const savedManualMode = localStorage.getItem(this.MANUAL_MODE_KEY);
    this.isManualMode = savedManualMode === 'true';
    if (this.isManualMode) {
      this.currentTheme = savedTheme === this.THEMES.DARK ? this.THEMES.DARK : this.THEMES.LIGHT;
    } else {
      this.currentTheme = this.THEMES.LIGHT;
    }
  },
  
  applyCurrentState() {
    const html = this._domCache.html;
    if (this.currentTheme === this.THEMES.DARK) {
      html.classList.add('dark');
    } else {
      html.classList.remove('dark');
    }
    if (this.isManualMode) {
      html.classList.add('manual-theme-mode');
    } else {
      html.classList.remove('manual-theme-mode');
    }
  },
  
  saveSettings() {
    localStorage.setItem(this.STORAGE_KEY, this.currentTheme);
    localStorage.setItem(this.MANUAL_MODE_KEY, this.isManualMode.toString());
  },
  
  syncToggleButton() {
    const toggleButton = this._domCache.toggleButton;
    if (toggleButton) {
      const isDarkTheme = this.currentTheme === this.THEMES.DARK;
      toggleButton.setAttribute('aria-pressed', isDarkTheme.toString());
      const label = this._domCache.toggleLabel;
      if (label) {
        label.innerHTML = isDarkTheme ? 'Light<br>테마' : 'Dark<br>테마';
      }
    }
  },
  
  toggle() {
    this.currentTheme = this.currentTheme === this.THEMES.LIGHT ? this.THEMES.DARK : this.THEMES.LIGHT;
    this.isManualMode = true;
    this.applyCurrentState();
    this.saveSettings();
    this.syncToggleButton();
    this.announceChange();
  },
  
  announceChange() {
    const themeLabel = this.currentTheme === this.THEMES.DARK ? 'Dark 테마' : 'Light 테마';
    const message = `${themeLabel}로 전환되었습니다.`;
    let liveRegion = this._domCache.liveRegion;
    if (!liveRegion) {
      liveRegion = document.createElement('div');
      liveRegion.id = 'theme-announcer';
      liveRegion.setAttribute('aria-live', 'polite');
      liveRegion.setAttribute('aria-atomic', 'true');
      liveRegion.style.position = 'absolute';
      liveRegion.style.left = '-10000px';
      liveRegion.style.width = '1px';
      liveRegion.style.height = '1px';
      liveRegion.style.overflow = 'hidden';
      document.body.appendChild(liveRegion);
      this._domCache.liveRegion = liveRegion;
    }
    liveRegion.textContent = message;
  },
  
  setupEventListeners() {
    const toggleButton = document.querySelector('.theme-toggle');
    if (toggleButton) {
      toggleButton.addEventListener('click', () => this.toggle());
    }
    document.addEventListener('keydown', (e) => {
      if (e.ctrlKey && e.altKey && e.key.toLowerCase() === 'h') {
        e.preventDefault();
        this.toggle();
      }
    });
  }
};

