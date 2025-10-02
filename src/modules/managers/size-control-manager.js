/* ==============================
  📐 크기 조절 관리자
  ============================== */

export const SizeControlManager = {
  DEFAULT_WIDTH: 256,
  DEFAULT_HEIGHT: 256,
  _domCache: { widthSlider: null, heightSlider: null, widthValue: null, heightValue: null, resetButton: null, allButtons: null },
  currentWidth: 256,
  currentHeight: 256,
  
  init() {
    console.log('📐 [SizeControlManager] 초기화 시작');
    this._initDOMCache();
    this.setupEventListeners();
    this.updateDisplay();
    console.log('  ├─ 기본 크기:', `${this.currentWidth}x${this.currentHeight}px`);
    console.log('✅ [SizeControlManager] 초기화 완료');
  },
  
  _initDOMCache() {
    this._domCache.widthSlider = document.querySelector('.button-width');
    this._domCache.heightSlider = document.querySelector('.button-height');
    this._domCache.widthValue = document.querySelector('.width-value');
    this._domCache.heightValue = document.querySelector('.height-value');
    this._domCache.resetButton = document.querySelector('.scaling.reset');
    this._domCache.allButtons = document.querySelectorAll('.button');
  },
  
  setupEventListeners() {
    if (this._domCache.widthSlider) {
      this._domCache.widthSlider.addEventListener('input', (e) => {
        this.currentWidth = parseInt(e.target.value);
        this.updateButtonSizes();
        this.updateDisplay();
      });
    }
    if (this._domCache.heightSlider) {
      this._domCache.heightSlider.addEventListener('input', (e) => {
        this.currentHeight = parseInt(e.target.value);
        this.updateButtonSizes();
        this.updateDisplay();
      });
    }
    if (this._domCache.resetButton) {
      this._domCache.resetButton.addEventListener('click', () => {
        this.resetToDefault();
      });
    }
  },
  
  updateButtonSizes() {
    this._domCache.allButtons.forEach(button => {
      button.style.width = `${this.currentWidth}px`;
      button.style.height = `${this.currentHeight}px`;
    });
    if (typeof ButtonSystem !== 'undefined' && ButtonSystem.StyleManager) {
      requestAnimationFrame(() => {
        ButtonSystem.StyleManager.applyDynamicStyles();
      });
    }
  },
  
  updateDisplay() {
    if (this._domCache.widthValue) {
      this._domCache.widthValue.textContent = `${this.currentWidth}px`;
    }
    if (this._domCache.heightValue) {
      this._domCache.heightValue.textContent = `${this.currentHeight}px`;
    }
  },
  
  resetToDefault() {
    this.currentWidth = this.DEFAULT_WIDTH;
    this.currentHeight = this.DEFAULT_HEIGHT;
    if (this._domCache.widthSlider) {
      this._domCache.widthSlider.value = this.currentWidth;
    }
    if (this._domCache.heightSlider) {
      this._domCache.heightSlider.value = this.currentHeight;
    }
    this.updateButtonSizes();
    this.updateDisplay();
  }
};
