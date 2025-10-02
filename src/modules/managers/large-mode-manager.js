/* ==============================
  📏 큰글씨 모드 관리자
  ============================== */

export const LargeTextManager = {
  MODES: { DEFAULT: 'default', LARGE: 'large' },
  STORAGE_KEY: 'large-mode',
  _domCache: { html: null, toggleButton: null, toggleLabel: null, liveRegion: null },
  currentMode: 'default',
  
  init() {
    console.log('📏 [LargeTextManager] 초기화 시작');
    this._initDOMCache();
    this.loadSettings();
    console.log('  ├─ 현재 모드:', this.currentMode);
    this.setupEventListeners();
    this.applyCurrentState();
    this.syncToggleButton();
    console.log('✅ [LargeTextManager] 초기화 완료');
  },
  
  _initDOMCache() {
    this._domCache.html = document.documentElement;
    this._domCache.toggleButton = document.querySelector('.large-toggle');
    if (this._domCache.toggleButton) {
      this._domCache.toggleLabel = this._domCache.toggleButton.querySelector('.label');
    }
    this._domCache.liveRegion = document.getElementById('large-announcer');
  },
  
  loadSettings() {
    const savedMode = localStorage.getItem(this.STORAGE_KEY);
    this.currentMode = savedMode === this.MODES.LARGE ? this.MODES.LARGE : this.MODES.DEFAULT;
  },
  
  applyCurrentState() {
    const html = this._domCache.html;
    if (this.currentMode === this.MODES.LARGE) {
      html.classList.add('large');
    } else {
      html.classList.remove('large');
    }
  },
  
  saveSettings() {
    localStorage.setItem(this.STORAGE_KEY, this.currentMode);
  },
  
  syncToggleButton() {
    const toggleButton = this._domCache.toggleButton;
    if (toggleButton) {
      const isLargeMode = this.currentMode === this.MODES.LARGE;
      toggleButton.setAttribute('aria-pressed', isLargeMode.toString());
      const label = this._domCache.toggleLabel;
      if (label) {
        label.innerHTML = isLargeMode ? '기본<br>글씨' : '큰글씨<br>모드';
      }
    }
  },
  
  toggle() {
    this.currentMode = this.currentMode === this.MODES.DEFAULT ? this.MODES.LARGE : this.MODES.DEFAULT;
    this.applyCurrentState();
    this.saveSettings();
    this.syncToggleButton();
    this.announceChange();
  },
  
  announceChange() {
    const modeLabel = this.currentMode === this.MODES.LARGE ? '큰글씨 모드' : '기본 글씨 크기';
    const message = `${modeLabel}로 전환되었습니다.`;
    let liveRegion = this._domCache.liveRegion;
    if (!liveRegion) {
      liveRegion = document.createElement('div');
      liveRegion.id = 'large-announcer';
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
    const toggleButton = document.querySelector('.large-toggle');
    if (toggleButton) {
      toggleButton.addEventListener('click', () => this.toggle());
    }
    document.addEventListener('keydown', (e) => {
      if (e.ctrlKey && e.altKey && e.key.toLowerCase() === 'l') {
        e.preventDefault();
        this.toggle();
      }
    });
  }
};

