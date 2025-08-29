/* 버튼 컴포넌트 시스템 - 시스테매틱 모듈 구조 */

/* ==============================
  🛠️ 유틸리티 모듈
  ============================== */

const AppUtils = {
  SVGLoader: {
    async loadSvg(path, selector) {
      const response = await fetch(path);
      const svgMarkup = await response.text();
      document.querySelectorAll(selector).forEach(target => { target.innerHTML = svgMarkup; });
      return svgMarkup;
    },
    
    async loadAllIcons() {
      const iconPromise = this.loadSvg('icon.svg', '.icon');
      const selectedIconPromise = this.loadSvg('selected.svg', '.icon.dynamic.pressed')
        .then(svg => { ButtonSystem.state.iconSelectedSvgContent = svg; });
      
      await Promise.all([iconPromise, selectedIconPromise]);
      console.log('📦 모든 아이콘 로드 완료');
    }
  },
  
  CSSInjector: {
    inject(id, content, description = '') {
      const existingStyle = document.getElementById(id);
      if (existingStyle) existingStyle.remove();
      
      const styleElement = document.createElement('style');
      styleElement.id = id;
      styleElement.textContent = content;
      document.head.appendChild(styleElement);
      
      console.log(`📝 ${description || id} CSS 주입 완료`);
    }
  }
};

/* ==============================
  🎨 버튼 시스템 코어
  ============================== */

const ButtonSystem = {
  CONSTANTS: {
    BASE: 0.03125,
    get BACKGROUND_BORDER_RADIUS() { return this.BASE; },
    get BUTTON_BORDER_RADIUS() { return 2 * this.BACKGROUND_BORDER_RADIUS; },
    get BACKGROUND_OUTLINE_WIDTH() { return this.BASE; },
    get BUTTON_PADDING() { return this.BACKGROUND_OUTLINE_WIDTH; },
    get BUTTON_OUTLINE_WIDTH() { return 3 * this.BACKGROUND_OUTLINE_WIDTH; },
    get BUTTON_OUTLINE_OFFSET() { return -1 * this.BACKGROUND_OUTLINE_WIDTH; },
    get SELECTED_ICON_SIZE() { return 4 * this.BASE; }
  },
  
  state: {
    iconSelectedSvgContent: null,
    styleCache: new WeakMap()
  },
  
  PaletteManager: {
    defaultColors: {
      light: {
        'contents-color-default': '#252525FF', 'contents-color-pressed': '#FFFFFFFF', 'contents-color-disabled': '#8C8C8CFF',
        'background-color-default': '#A4693FFF', 'background-color-pressed': '#EEDCD2FF', 'background-color-disabled': '#00000000', 'background-color-pointed': '#A4693FFF',
        'border-color-default': '#A4693FFF', 'border-color-pressed': '#A4693FFF', 'border-color-disabled': '#BFBFBFFF', 'border-color-pointed': 'var(--system-pointed)'
      },
      dark: {
        'contents-color-default': '#FFE100FF', 'contents-color-pressed': '#807000FF', 'contents-color-disabled': '#8C8C8CFF',
        'background-color-default': '#241F00FF', 'background-color-pressed': '#FFE100FF', 'background-color-disabled': '#00000000', 'background-color-pointed': '#241F00FF',
        'border-color-default': '#FFE100FF', 'border-color-pressed': '#FFE100FF', 'border-color-disabled': '#757575FF', 'border-color-pointed': 'var(--system-pointed)'
      }
    },
    
    generateCSS() {
      const buttons = document.querySelectorAll('.button');
      const discoveredPalettes = new Set();
      
      buttons.forEach(button => {
        const classList = Array.from(button.classList);
        const palette = classList.find(cls => !['button', 'pressed', 'toggle', 'dynamic'].includes(cls));
        if (palette) discoveredPalettes.add(palette);
      });
      
      let lightThemeCSS = '', darkThemeCSS = '', selectorsCSS = '';
      
      discoveredPalettes.forEach(palette => {
        const isExisting = ['primary1', 'primary2', 'secondary1', 'secondary2'].includes(palette);
        
        [
          { name: 'default', selector: '', disabled: false },
          { name: 'pressed', selector: '.pressed:not(.toggle)', disabled: false },
          { name: 'pressed', selector: '.pressed.toggle', disabled: false },
          { name: 'disabled', selector: '[aria-disabled="true"]', disabled: true }
        ].forEach(({name: stateName, selector: stateSelector, disabled}) => {
          const baseSelector = palette === 'primary1' && stateName === 'default' && !disabled ? `&${stateSelector}` : null;
          const paletteSelector = `&.${palette}${stateSelector}`;
          
          if (baseSelector) {
            selectorsCSS += `\n    ${baseSelector} { color: var(--${palette}-contents-color-${stateName}); & .background.dynamic { background: var(--${palette}-background-color-${stateName}); outline-color: var(--${palette}-border-color-${stateName}); } }`;
          }
          
          selectorsCSS += `\n    ${paletteSelector} { color: var(--${palette}-contents-color-${stateName}); & .background.dynamic { background: var(--${palette}-background-color-${stateName}); outline-color: var(--${palette}-border-color-${stateName}); ${stateName === 'pressed' ? 'outline-width: var(--border-style-pressed);' : ''} } ${stateName === 'pressed' ? '&.toggle { & .icon.dynamic.pressed { display: flex; } }' : ''} ${disabled ? 'cursor: not-allowed;' : ''} }`;
        });
        
        if (!isExisting) {
          Object.entries(this.defaultColors.light).forEach(([property, value]) => {
            lightThemeCSS += `  --${palette}-${property}: ${value};\n`;
          });
          Object.entries(this.defaultColors.dark).forEach(([property, value]) => {
            darkThemeCSS += `  --${palette}-${property}: ${value};\n`;
          });
        }
      });
      
      AppUtils.CSSInjector.inject('palette-system-styles', `${lightThemeCSS ? `:root {\n${lightThemeCSS}}` : ''}${darkThemeCSS ? `.dark {\n${darkThemeCSS}}` : ''}@layer components { .button {${selectorsCSS} } }`, '팔레트 시스템');
      return discoveredPalettes;
    }
  },
  
  StyleManager: {
    applyDynamicStyles() {
      const allButtons = document.querySelectorAll('.button');
      if (allButtons.length === 0) return;
      
      let processedCount = 0;
      
      for (const button of allButtons) {
        const background = button.querySelector(".background");
        if (!background) continue;

        const rect = button.getBoundingClientRect();
        const minSide = Math.min(rect.width, rect.height);

        const buttonPadding = minSide * ButtonSystem.CONSTANTS.BUTTON_PADDING;
        const buttonBorderRadius = minSide * ButtonSystem.CONSTANTS.BUTTON_BORDER_RADIUS;
        const buttonOutlineWidth = minSide * ButtonSystem.CONSTANTS.BUTTON_OUTLINE_WIDTH;
        const buttonOutlineOffset = minSide * ButtonSystem.CONSTANTS.BUTTON_OUTLINE_OFFSET;
        const backgroundBorderRadius = minSide * ButtonSystem.CONSTANTS.BACKGROUND_BORDER_RADIUS;
        const backgroundOutlineWidth = minSide * ButtonSystem.CONSTANTS.BACKGROUND_OUTLINE_WIDTH;
        const iconSelectedSize = minSide * ButtonSystem.CONSTANTS.SELECTED_ICON_SIZE;

        const cached = ButtonSystem.state.styleCache.get(button) || {};
        const needsUpdate = (
          (cached.minSide || 0) !== minSide || (cached.buttonPadding || 0) !== buttonPadding ||
          (cached.buttonBorderRadius || 0) !== buttonBorderRadius || (cached.buttonOutlineWidth || 0) !== buttonOutlineWidth ||
          (cached.buttonOutlineOffset || 0) !== buttonOutlineOffset || (cached.backgroundBorderRadius || 0) !== backgroundBorderRadius ||
          (cached.backgroundOutlineWidth || 0) !== backgroundOutlineWidth || (cached.iconSelectedSize || 0) !== iconSelectedSize
        );

        if (!needsUpdate) continue;

        button.style.padding = `${buttonPadding}px`;
        button.style.borderRadius = `${buttonBorderRadius}px`;
        button.style.outlineWidth = `${buttonOutlineWidth}px`;
        button.style.outlineOffset = `${buttonOutlineOffset}px`;

        background.style.borderRadius = `${backgroundBorderRadius}px`;
        background.style.outlineWidth = `${backgroundOutlineWidth}px`;

        const iconPressed = button.querySelector('.icon.dynamic.pressed');
        if (iconPressed) {
          iconPressed.style.width = `${iconSelectedSize}px`;
          iconPressed.style.height = `${iconSelectedSize}px`;
          iconPressed.style.top = `${buttonPadding}px`;
          iconPressed.style.right = `${buttonPadding}px`;
        }

        ButtonSystem.state.styleCache.set(button, {
          minSide, buttonPadding, buttonBorderRadius, buttonOutlineWidth, buttonOutlineOffset,
          backgroundBorderRadius, backgroundOutlineWidth, iconSelectedSize
        });
        
        processedCount++;
      }
      
      console.log(`✅ 동적 스타일링 완료 - 처리: ${processedCount}/${allButtons.length}`);
    },
    
    setupIconInjection() {
      const allButtons = document.querySelectorAll('.button');
      
      for (const button of allButtons) {
        const background = button.querySelector('.background');
        if (!background) continue;
        
        const isToggleButton = button.classList.contains('toggle');
        
        if (isToggleButton && !background.querySelector('.icon.dynamic.pressed')) {
          const iconPressedSpan = document.createElement('span');
          iconPressedSpan.className = 'icon dynamic pressed';
          if (ButtonSystem.state.iconSelectedSvgContent) iconPressedSpan.innerHTML = ButtonSystem.state.iconSelectedSvgContent;
          const iconEl = background.querySelector('.icon.dynamic');
          if (iconEl && iconEl.parentNode) background.insertBefore(iconPressedSpan, iconEl);
          else background.insertBefore(iconPressedSpan, background.firstChild);
        }
      }
      
      for (const button of allButtons) {
        const isToggleButton = button.classList.contains('toggle');
        const isInitiallyPressed = button.classList.contains('pressed');
        
        if (isToggleButton) {
          button.dataset.isToggleButton = 'true';
          button.setAttribute('aria-pressed', isInitiallyPressed ? 'true' : 'false');
        }
      }
      
      console.log('🎯 아이콘 주입 및 접근성 설정 완료');
    }
  },
  
  async init() {
    console.log('🚀 ButtonSystem 초기화 시작');
    await AppUtils.SVGLoader.loadAllIcons();
    this.StyleManager.setupIconInjection();
    this.PaletteManager.generateCSS();
    this.StyleManager.applyDynamicStyles();
    console.log('✅ ButtonSystem 초기화 완료');
  }
};

window.addEventListener('DOMContentLoaded', async () => {
  /* ==============================
    🌌 전역 상태 관리자들
    ============================== */
  
  const ThemeManager = {
    THEMES: { LIGHT: 'light', DARK: 'dark' },
    STORAGE_KEY: 'theme-mode',
    MANUAL_MODE_KEY: 'manual-theme-mode',
    _domCache: { html: null, toggleButton: null, toggleLabel: null, liveRegion: null },
    currentTheme: 'light',
    isManualMode: false,
    
    init() {
      this._initDOMCache();
      this.loadSettings();
      this.setupEventListeners();
      this.applyCurrentState();
      this.syncToggleButton();
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

  const LargeTextManager = {
    MODES: { DEFAULT: 'default', LARGE: 'large' },
    STORAGE_KEY: 'large-mode',
    _domCache: { html: null, toggleButton: null, toggleLabel: null, liveRegion: null },
    currentMode: 'default',
    
    init() {
      this._initDOMCache();
      this.loadSettings();
      this.setupEventListeners();
      this.applyCurrentState();
      this.syncToggleButton();
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
  
  const SizeControlManager = {
    DEFAULT_WIDTH: 256,
    DEFAULT_HEIGHT: 256,
    _domCache: { widthSlider: null, heightSlider: null, widthValue: null, heightValue: null, resetButton: null, allButtons: null },
    currentWidth: 256,
    currentHeight: 256,
    
    init() {
      this._initDOMCache();
      this.setupEventListeners();
      this.updateDisplay();
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

  const CustomPaletteManager = {
    CUSTOM_PALETTE_NAME: 'custom',
    _domCache: { lightInputs: {}, darkInputs: {}, applyBtn: null, resetBtn: null, previewColors: {}, testButtons: null },
    currentPalette: { name: 'custom' },
    
    init() {
      this._initDOMCache();
      this.setupEventListeners();
      this.updatePreview();
      setTimeout(() => this.generateAndApplyPalette(), 100);
    },
    
    _initDOMCache() {
      this._domCache.lightInputs = {
        bgDefault: document.getElementById('light-bg-default'),
        textDefault: document.getElementById('light-text-default'),
        bgPressed: document.getElementById('light-bg-pressed'),
        textPressed: document.getElementById('light-text-pressed'),
        bgDisabled: document.getElementById('light-bg-disabled'),
        textDisabled: document.getElementById('light-text-disabled'),
        bgPointed: document.getElementById('light-bg-pointed')
      };
      this._domCache.darkInputs = {
        bgDefault: document.getElementById('dark-bg-default'),
        textDefault: document.getElementById('dark-text-default'),
        bgPressed: document.getElementById('dark-bg-pressed'),
        textPressed: document.getElementById('dark-text-pressed'),
        bgDisabled: document.getElementById('dark-bg-disabled'),
        textDisabled: document.getElementById('dark-text-disabled'),
        bgPointed: document.getElementById('dark-bg-pointed')
      };
      this._domCache.applyBtn = document.querySelector('.palette-apply-btn');
      this._domCache.resetBtn = document.querySelector('.palette-reset-btn');
      this._domCache.previewColors = {
        lightBg: document.getElementById('preview-light-bg'),
        lightText: document.getElementById('preview-light-text'),
        darkBg: document.getElementById('preview-dark-bg'),
        darkText: document.getElementById('preview-dark-text')
      };
      this._domCache.testButtons = document.querySelectorAll('.button.custom');
    },
    
    setupEventListeners() {
      Object.entries(this._domCache.lightInputs).forEach(([key, input]) => {
        if (input) {
          input.addEventListener('input', () => {
            this.updatePreview();
            clearTimeout(this.autoUpdateTimer);
            this.autoUpdateTimer = setTimeout(() => {
              this.generateAndApplyPalette();
            }, 500);
          });
        }
      });
      Object.entries(this._domCache.darkInputs).forEach(([key, input]) => {
        if (input) {
          input.addEventListener('input', () => {
            this.updatePreview();
            clearTimeout(this.autoUpdateTimer);
            this.autoUpdateTimer = setTimeout(() => {
              this.generateAndApplyPalette();
            }, 500);
          });
        }
      });
      document.querySelectorAll('.hex-input').forEach(hexInput => {
        hexInput.addEventListener('input', (e) => {
          const colorInput = e.target.previousElementSibling;
          if (colorInput && colorInput.type === 'color') {
            const hexValue = e.target.value.replace('#', '').substring(0, 6);
            if (hexValue.length === 6) {
              colorInput.value = '#' + hexValue;
              this.updatePreview();
              clearTimeout(this.autoUpdateTimer);
              this.autoUpdateTimer = setTimeout(() => {
                this.generateAndApplyPalette();
              }, 500);
            }
          }
        });
      });
      document.querySelectorAll('input[type="color"]').forEach(colorInput => {
        colorInput.addEventListener('input', (e) => {
          const hexInput = e.target.nextElementSibling;
          if (hexInput && hexInput.classList.contains('hex-input')) {
            const alpha = e.target.id.includes('disabled') && e.target.id.includes('bg') ? '00' : 'FF';
            hexInput.value = e.target.value + alpha;
            this.updatePreview();
            clearTimeout(this.autoUpdateTimer);
            this.autoUpdateTimer = setTimeout(() => {
              this.generateAndApplyPalette();
            }, 500);
          }
        });
      });
      if (this._domCache.applyBtn) {
        this._domCache.applyBtn.addEventListener('click', () => {
          this.generateAndApplyPalette();
        });
      }
      if (this._domCache.resetBtn) {
        this._domCache.resetBtn.addEventListener('click', () => {
          this.resetToDefaults();
        });
      }
    },
    
    updatePreview() {
      const lightBg = this._domCache.lightInputs.bgDefault?.value || '#A4693F';
      const lightText = this._domCache.lightInputs.textDefault?.value || '#FFFFFF';
      const darkBg = this._domCache.darkInputs.bgDefault?.value || '#241F00';
      const darkText = this._domCache.darkInputs.textDefault?.value || '#FFE100';
      if (this._domCache.previewColors.lightBg) {
        this._domCache.previewColors.lightBg.style.backgroundColor = lightBg;
      }
      if (this._domCache.previewColors.lightText) {
        this._domCache.previewColors.lightText.style.backgroundColor = lightText;
      }
      if (this._domCache.previewColors.darkBg) {
        this._domCache.previewColors.darkBg.style.backgroundColor = darkBg;
      }
      if (this._domCache.previewColors.darkText) {
        this._domCache.previewColors.darkText.style.backgroundColor = darkText;
      }
      if (this.currentPalette) {
        this.currentPalette.name = this.CUSTOM_PALETTE_NAME;
      }
    },
    
    generateAndApplyPalette() {
      const paletteName = this.CUSTOM_PALETTE_NAME;
      const lightColors = {
        'background-color-default': this._domCache.lightInputs.bgDefault?.nextElementSibling?.value || '#A4693FFF',
        'contents-color-default': this._domCache.lightInputs.textDefault?.nextElementSibling?.value || '#FFFFFFFF',
        'background-color-pressed': this._domCache.lightInputs.bgPressed?.nextElementSibling?.value || '#EEDCD2FF',
        'contents-color-pressed': this._domCache.lightInputs.textPressed?.nextElementSibling?.value || '#C4895FFF',
        'background-color-disabled': this._domCache.lightInputs.bgDisabled?.nextElementSibling?.value || '#00000000',
        'contents-color-disabled': this._domCache.lightInputs.textDisabled?.nextElementSibling?.value || '#8C8C8CFF',
        'background-color-pointed': this._domCache.lightInputs.bgPointed?.nextElementSibling?.value || '#A4693FFF',
        'border-color-default': this._domCache.lightInputs.bgDefault?.nextElementSibling?.value || '#A4693FFF',
        'border-color-pressed': this._domCache.lightInputs.bgDefault?.nextElementSibling?.value || '#A4693FFF',
        'border-color-disabled': '#BFBFBFFF',
        'border-color-pointed': 'var(--system-pointed)'
      };
      const darkColors = {
        'background-color-default': this._domCache.darkInputs.bgDefault?.nextElementSibling?.value || '#241F00FF',
        'contents-color-default': this._domCache.darkInputs.textDefault?.nextElementSibling?.value || '#FFE100FF',
        'background-color-pressed': this._domCache.darkInputs.bgPressed?.nextElementSibling?.value || '#FFE100FF',
        'contents-color-pressed': this._domCache.darkInputs.textPressed?.nextElementSibling?.value || '#807000FF',
        'background-color-disabled': this._domCache.darkInputs.bgDisabled?.nextElementSibling?.value || '#00000000',
        'contents-color-disabled': this._domCache.darkInputs.textDisabled?.nextElementSibling?.value || '#8C8C8CFF',
        'background-color-pointed': this._domCache.darkInputs.bgPointed?.nextElementSibling?.value || '#241F00FF',
        'border-color-default': this._domCache.darkInputs.textDefault?.nextElementSibling?.value || '#FFE100FF',
        'border-color-pressed': this._domCache.darkInputs.textDefault?.nextElementSibling?.value || '#FFE100FF',
        'border-color-disabled': '#757575FF',
        'border-color-pointed': 'var(--system-pointed)'
      };
      this.injectCustomPaletteCSS(paletteName, lightColors, darkColors);
      this.applyToTestButtons();
    },
    
    injectCustomPaletteCSS(paletteName, lightColors, darkColors) {
      let lightCSS = '';
      Object.entries(lightColors).forEach(([property, value]) => {
        lightCSS += `  --${paletteName}-${property}: ${value};\n`;
      });
      let darkCSS = '';
      Object.entries(darkColors).forEach(([property, value]) => {
        darkCSS += `  --${paletteName}-${property}: ${value};\n`;
      });
      const cssContent = `:root {\n${lightCSS}}\n.dark {\n${darkCSS}}\n@layer components {\n  .button.${paletteName} {\n    color: var(--${paletteName}-contents-color-default);\n    & .background.dynamic {\n      background: var(--${paletteName}-background-color-default);\n      outline-color: var(--${paletteName}-border-color-default);\n    }\n    &.pressed {\n      color: var(--${paletteName}-contents-color-pressed);\n      & .background.dynamic {\n        outline: 0 var(--border-style-pressed) var(--${paletteName}-border-color-pressed);\n        background: var(--${paletteName}-background-color-pressed);\n      }\n      &.toggle {\n        & .icon.dynamic.pressed {\n          display: flex;\n        }\n      }\n    }\n    &[aria-disabled="true"] {\n      cursor: not-allowed;\n      color: var(--${paletteName}-contents-color-disabled);\n      & .background.dynamic {\n        background: var(--${paletteName}-background-color-disabled);\n        outline: 0 var(--border-style-disabled) var(--${paletteName}-border-color-disabled);\n      }\n    }\n  }\n}`;
      AppUtils.CSSInjector.inject('custom-palette-styles', cssContent, `커스텀 팔레트 ${paletteName}`);
    },
    
    applyToTestButtons() {
      const paletteName = this.CUSTOM_PALETTE_NAME;
      this._domCache.testButtons.forEach(button => {
        const classList = Array.from(button.classList);
        const excludedClasses = ['button', 'pressed', 'toggle', 'dynamic'];
        const oldPalette = classList.find(cls => !excludedClasses.includes(cls));
        if (oldPalette && oldPalette !== paletteName) {
          button.classList.remove(oldPalette);
        }
        if (!button.classList.contains(paletteName)) {
          button.classList.add(paletteName);
        }
      });
    },
    
    resetToDefaults() {
      const lightDefaults = {
        bgDefault: ['#A4693F', '#A4693FFF'],
        textDefault: ['#FFFFFF', '#FFFFFFFF'],
        bgPressed: ['#EEDCD2', '#EEDCD2FF'],
        textPressed: ['#C4895F', '#C4895FFF'],
        bgDisabled: ['#000000', '#00000000'],
        textDisabled: ['#8C8C8C', '#8C8C8CFF'],
        bgPointed: ['#A4693F', '#A4693FFF']
      };
      Object.entries(lightDefaults).forEach(([key, [colorValue, hexValue]]) => {
        const input = this._domCache.lightInputs[key];
        if (input) {
          input.value = colorValue;
          const hexInput = input.nextElementSibling;
          if (hexInput) hexInput.value = hexValue;
        }
      });
      const darkDefaults = {
        bgDefault: ['#241F00', '#241F00FF'],
        textDefault: ['#FFE100', '#FFE100FF'],
        bgPressed: ['#FFE100', '#FFE100FF'],
        textPressed: ['#807000', '#807000FF'],
        bgDisabled: ['#000000', '#00000000'],
        textDisabled: ['#8C8C8C', '#8C8C8CFF'],
        bgPointed: ['#241F00', '#241F00FF']
      };
      Object.entries(darkDefaults).forEach(([key, [colorValue, hexValue]]) => {
        const input = this._domCache.darkInputs[key];
        if (input) {
          input.value = colorValue;
          const hexInput = input.nextElementSibling;
          if (hexInput) hexInput.value = hexValue;
        }
      });
      this.updatePreview();
      setTimeout(() => this.generateAndApplyPalette(), 100);
    }
  };

  /* ==============================
    🚀 메인 초기화 체인
    ============================== */
  
  console.log('🚀 시스템 초기화 시작');
  
  ThemeManager.init();
  console.log('✅ ThemeManager 초기화 완료');
  
  LargeTextManager.init();
  console.log('✅ LargeTextManager 초기화 완료');
  
  SizeControlManager.init();
  console.log('✅ SizeControlManager 초기화 완료');
  
  CustomPaletteManager.init();
  console.log('✅ CustomPaletteManager 초기화 완료');
  
  await ButtonSystem.init();
  
  /* ==============================
    🎮 이벤트 시스템
    ============================== */

  let resizeScheduled = false;
  window.addEventListener("resize", () => {
    if (resizeScheduled) return;
    resizeScheduled = true;
    requestAnimationFrame(() => {
      ButtonSystem.StyleManager.applyDynamicStyles();
      resizeScheduled = false;
    });
  });

  document.addEventListener('click', (event) => {
    const button = event.target.closest('.button');
    if (!button || button.getAttribute('aria-disabled') === 'true' || 
        button.dataset.isToggleButton !== 'true') return;

    const wasPressed = button.classList.contains('pressed');
    const iconPressed = button.querySelector('.icon.dynamic.pressed');

    if (wasPressed) {
      if (iconPressed) iconPressed.style.display = 'none';
      requestAnimationFrame(() => {
        button.classList.remove('pressed');
        button.setAttribute('aria-pressed', 'false');
        if (iconPressed) iconPressed.style.removeProperty('display');
      });
    } else {
      if (iconPressed) iconPressed.style.removeProperty('display');
      button.classList.add('pressed');
      button.setAttribute('aria-pressed', 'true');
    }
  }, false);

  const blockDisabledButtonEvents = (event) => {
    const disabledButton = event.target.closest('.button[aria-disabled="true"]');
    if (disabledButton) {
      event.preventDefault();
      event.stopPropagation();
      if (typeof event.stopImmediatePropagation === 'function') event.stopImmediatePropagation();
      return true;
    }
    return false;
  };

  document.addEventListener('click', blockDisabledButtonEvents, true);

  document.addEventListener('keydown', (event) => {
    const disabledButton = event.target.closest('.button[aria-disabled="true"]');
    if (disabledButton && (event.key === ' ' || event.key === 'Enter' || event.key === 'NumpadEnter')) {
      event.preventDefault();
      event.stopPropagation();
      return;
    }

    const enabledButton = event.target.closest('.button');
    if (enabledButton && enabledButton.getAttribute('aria-disabled') !== 'true') {
      if (event.key === 'Enter' || event.key === 'NumpadEnter' || event.key === ' ') {
        event.preventDefault();
        event.stopPropagation();
        
        const isToggleButton = enabledButton.classList.contains('toggle');
        
        if (isToggleButton) {
          // 토글 버튼: 클릭 이벤트만 발생시키고 pressed 조작하지 않음
          const clickEvent = new MouseEvent('click', {
            bubbles: true,
            cancelable: true,
            button: 0
          });
          enabledButton.dispatchEvent(clickEvent);
        } else {
          // 일반 버튼: momentary press 효과 (Enter/Space 동일)
          enabledButton.classList.add('pressed');
          setTimeout(() => {
            enabledButton.classList.remove('pressed');
            const clickEvent = new MouseEvent('click', {
              bubbles: true,
              cancelable: true,
              button: 0
            });
            enabledButton.dispatchEvent(clickEvent);
          }, 100);
        }
      }
    }
  }, true);

  document.addEventListener('keydown', (event) => {
    const focusedButton = document.activeElement;
    const isArrowKey = ['ArrowDown', 'ArrowUp', 'ArrowRight', 'ArrowLeft', 'Home', 'End'].includes(event.key);
    
    if ((!focusedButton || !focusedButton.classList.contains('button')) && isArrowKey) {
      event.preventDefault();
      const firstButton = document.querySelector('.button');
      if (firstButton) {
        firstButton.focus();
      }
      return;
    }

    if (!focusedButton || !focusedButton.classList.contains('button')) {
      return;
    }

    let targetButton = null;
    const allButtons = Array.from(document.querySelectorAll('.button')).filter(btn => 
      btn.offsetParent !== null
    );

    switch (event.key) {
      case 'ArrowDown':
              case 'ArrowRight':
          event.preventDefault();
        const currentIndex = allButtons.indexOf(focusedButton);
        const nextIndex = (currentIndex + 1) % allButtons.length;
        targetButton = allButtons[nextIndex];
          break;
          
      case 'ArrowUp':
        case 'ArrowLeft':
          event.preventDefault();
        const currentIndex2 = allButtons.indexOf(focusedButton);
        const prevIndex = currentIndex2 === 0 ? allButtons.length - 1 : currentIndex2 - 1;
        targetButton = allButtons[prevIndex];
          break;
        
      case 'Home':
        event.preventDefault();
        targetButton = allButtons[0];
        break;
        
      case 'End':
        event.preventDefault();
        targetButton = allButtons[allButtons.length - 1];
        break;
    }

    if (targetButton) {
      targetButton.focus();
    }
  }, true);

  document.addEventListener('mousedown', (event) => {
    const button = event.target.closest('.button');
    if (button && button.getAttribute('aria-disabled') !== 'true' && !button.classList.contains('toggle')) {
      button.classList.add('pressed');
    }
  }, true);

  document.addEventListener('mouseup', (event) => {
    const button = event.target.closest('.button');
    if (button && button.classList.contains('pressed') && !button.classList.contains('toggle')) {
      button.classList.remove('pressed');
    }
  }, true);

  document.addEventListener('mouseleave', (event) => {
    const button = event.target.closest('.button');
    if (button && button.classList.contains('pressed') && !button.classList.contains('toggle')) {
      button.classList.remove('pressed');
    }
  }, true);

  document.addEventListener('touchstart', (event) => {
    const button = event.target.closest('.button');
    if (button && button.getAttribute('aria-disabled') !== 'true' && !button.classList.contains('toggle')) {
      button.classList.add('pressed');
    }
  }, { passive: true });

  document.addEventListener('touchend', (event) => {
    const button = event.target.closest('.button');
    if (button && button.classList.contains('pressed') && !button.classList.contains('toggle')) {
      button.classList.remove('pressed');
    }
  }, { passive: true });

  document.addEventListener('touchcancel', (event) => {
    const button = event.target.closest('.button');
    if (button && button.classList.contains('pressed') && !button.classList.contains('toggle')) {
      button.classList.remove('pressed');
    }
  }, { passive: true });

  window.AppUtils = AppUtils;
  window.ButtonSystem = ButtonSystem;
  window.ThemeManager = ThemeManager;
  window.LargeTextManager = LargeTextManager;
  window.SizeControlManager = SizeControlManager;
  window.CustomPaletteManager = CustomPaletteManager;
  
  console.log('🎆 전체 시스템 초기화 완료!');
});