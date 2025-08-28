/* 버튼 컴포넌트 시스템 - 메인 스크립트 */

window.addEventListener('DOMContentLoaded', () => {
  /**
   * ThemeManager - 테마 상태 관리 (Light ↔ Dark 전환)
   * 
   * 기능:
   * - Light 테마: 기본 브랜드 색상 중심의 밝은 인터페이스
   * - Dark 테마: 접근성 최적화된 어두운 인터페이스
   * - Static 요소: 테마 독립적 포커스/호버 (핑크)
   * - 로컬 스토리지 연동으로 설정 유지
   * - 키보드 단축키 지원 (Ctrl+Alt+H)
   */
  const ThemeManager = {
    THEMES: {
      LIGHT: 'light',
      DARK: 'dark'
    },
    
    STORAGE_KEY: 'theme-mode',
    MANUAL_MODE_KEY: 'manual-theme-mode',
    
    _domCache: {
      html: null,
      toggleButton: null,
      toggleLabel: null,
      liveRegion: null
    },
    
    currentTheme: 'light',
    isManualMode: false,
    init() {
      this._initDOMCache();
      this.loadSettings();
      this.setupEventListeners();
      this.applyCurrentState();
      this.syncToggleButton();
    },
    
    // DOM 캐시 초기화
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
    
    // 설정 로드
    loadSettings() {
      const savedTheme = localStorage.getItem(this.STORAGE_KEY);
      const savedManualMode = localStorage.getItem(this.MANUAL_MODE_KEY);
      
      this.isManualMode = savedManualMode === 'true';
      
      if (this.isManualMode) {
        this.currentTheme = savedTheme === this.THEMES.DARK ? this.THEMES.DARK : this.THEMES.LIGHT;
      } else {
        this.currentTheme = this.THEMES.LIGHT; // 기본값은 Light 테마
      }
      
      console.log('🎨 테마 설정 로드:', {
        theme: this.currentTheme,
        manual: this.isManualMode
      });
    },
    
    // DOM 조작 메소드
    
    // DOM 적용
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
    
    // 설정 저장
    saveSettings() {
      localStorage.setItem(this.STORAGE_KEY, this.currentTheme);
      localStorage.setItem(this.MANUAL_MODE_KEY, this.isManualMode.toString());
      
      console.log('💾 테마 설정 저장:', {
        theme: this.currentTheme,
        manual: this.isManualMode
      });
    },
    
    // 토글 버튼 상태 동기화
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
    
    // 사용자 상호작용 메소드
    
    // 테마 토글
    toggle() {
      this.currentTheme = this.currentTheme === this.THEMES.LIGHT ? this.THEMES.DARK : this.THEMES.LIGHT;
      this.isManualMode = true;
      
      this.applyCurrentState();
      this.saveSettings();
      this.syncToggleButton();
      

      this.announceChange();
      
      console.log('🔄 테마 토글:', {
        theme: this.currentTheme,
        manual: this.isManualMode
      });
    },
    
    // 접근성 알림
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
    
    // 이벤트 설정 메소드
    
    setupEventListeners() {

      const toggleButton = document.querySelector('.theme-toggle');
      console.log('🔍 테마 토글 버튼 찾기:', toggleButton);
      
      if (toggleButton) {
        console.log('✅ 버튼 발견! 이벤트 리스너 추가 중...');
        toggleButton.addEventListener('click', () => {
          console.log('🖱️ 테마 토글 버튼 클릭됨!');
          this.toggle();
        });
      } else {
        console.error('❌ 테마 토글 버튼을 찾을 수 없습니다!');
      }
      
      // 키보드 단축키: Ctrl+Alt+H (테마 전환)
      document.addEventListener('keydown', (e) => {
        if (e.ctrlKey && e.altKey && e.key.toLowerCase() === 'h') {
          e.preventDefault();
          this.toggle();
        }
      });
      

    },
    
    // 자동 모드로 재설정 (Light 테마로)
    resetToAuto() {
      this.isManualMode = false;
      this.currentTheme = this.THEMES.LIGHT; // 기본값은 Light 테마
      this.applyCurrentState();
      this.saveSettings();
      this.syncToggleButton();
      
      console.log('🔄 자동 테마 모드로 재설정:', {
        theme: this.currentTheme
      });
    }
  };
  
  // 테마 관리자 초기화
  console.log('🚀 ThemeManager 초기화 시작...');
  ThemeManager.init();
  console.log('✅ ThemeManager 초기화 완료!', ThemeManager);
  
  // 전역 접근을 위해 window 객체에 추가 (개발자 도구용)
  window.ThemeManager = ThemeManager;

  /**
   * LargeTextManager - 큰글씨 모드 상태 관리 (기본 ↔ 큰글씨 전환)
   * 
   * 기능:
   * - 기본 모드: 40px 기준 텍스트 크기
   * - 큰글씨 모드: 48px (1.2배 확대) 텍스트 크기
   * - 로컬 스토리지 연동으로 설정 유지
   * - 키보드 단축키 지원 (Ctrl+Alt+L)
   * - 접근성 최적화
   */
  const LargeTextManager = {
    
    // 상수 및 설정
    MODES: {
      DEFAULT: 'default',
      LARGE: 'large'
    },
    
    STORAGE_KEY: 'large-mode',
    
    // DOM 캐시
    _domCache: {
      html: null,
      body: null,
      toggleButton: null,
      toggleLabel: null,
      liveRegion: null
    },
    
    // 상태 관리
    currentMode: 'default',
    
    // 초기화 플로우
    
    /**
     * 🚀 메인 초기화 메소드
     */
    init() {
      this._initDOMCache();       // 0️⃣ DOM 요소 캐싱
      this.loadSettings();        // 1️⃣ 저장된 설정 불러오기
      this.setupEventListeners(); // 2️⃣ 이벤트 리스너 등록
      this.applyCurrentState();   // 3️⃣ DOM에 큰글씨 모드 적용
      this.syncToggleButton();    // 4️⃣ UI 동기화
    },
    
    /**
     * 0️⃣ DOM 캐시 초기화
     */
    _initDOMCache() {
      this._domCache.html = document.documentElement;
      this._domCache.body = document.body;
      this._domCache.toggleButton = document.querySelector('.large-toggle');
      if (this._domCache.toggleButton) {
        this._domCache.toggleLabel = this._domCache.toggleButton.querySelector('.label');
      }
      this._domCache.liveRegion = document.getElementById('large-announcer');
    },
    
    /**
     * 1️⃣ 설정 로드
     */
    loadSettings() {
      const savedMode = localStorage.getItem(this.STORAGE_KEY);
      this.currentMode = savedMode === this.MODES.LARGE ? this.MODES.LARGE : this.MODES.DEFAULT;
      
      console.log('📝 큰글씨 모드 설정 로드:', {
        mode: this.currentMode
      });
    },
    
    // DOM 조작 메소드
    
    /**
     * 3️⃣ DOM 적용
     */
    applyCurrentState() {
      const html = this._domCache.html;
      
      if (this.currentMode === this.MODES.LARGE) {
        html.classList.add('large');
      } else {
        html.classList.remove('large');
      }
    },
    
    // 설정을 로컬 스토리지에 저장
    saveSettings() {
      localStorage.setItem(this.STORAGE_KEY, this.currentMode);
      
      console.log('💾 큰글씨 모드 설정 저장:', {
        mode: this.currentMode
      });
    },
    
    // 큰글씨 모드 토글 버튼 상태 동기화
    syncToggleButton() {
      const toggleButton = this._domCache.toggleButton;
      if (toggleButton) {
        const isLargeMode = this.currentMode === this.MODES.LARGE;
        toggleButton.setAttribute('aria-pressed', isLargeMode.toString());
        
        // 버튼 텍스트 업데이트
        const label = this._domCache.toggleLabel;
        if (label) {
          label.innerHTML = isLargeMode ? '기본<br>글씨' : '큰글씨<br>모드';
        }
      }
    },
    
    // 사용자 상호작용 메소드
    
    // 큰글씨 모드 토글 (기본 ↔ 큰글씨)
    toggle() {
      this.currentMode = this.currentMode === this.MODES.DEFAULT ? this.MODES.LARGE : this.MODES.DEFAULT;
      
      this.applyCurrentState();
      this.saveSettings();
      this.syncToggleButton();
      

      this.announceChange();
      
      console.log('🔄 큰글씨 모드 토글:', {
        mode: this.currentMode
      });
    },
    
    // 접근성 알림 (스크린 리더용)
    announceChange() {
      const modeLabel = this.currentMode === this.MODES.LARGE ? '큰글씨 모드' : '기본 글씨 크기';
      const message = `${modeLabel}로 전환되었습니다.`;
      
      // aria-live 영역에 메시지 추가
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
    
    // 이벤트 설정 메소드
    
    setupEventListeners() {
      // 큰글씨 모드 토글 버튼 클릭
      const toggleButton = document.querySelector('.large-toggle');
      console.log('🔍 큰글씨 모드 토글 버튼 찾기:', toggleButton);
      
      if (toggleButton) {
        console.log('✅ 버튼 발견! 이벤트 리스너 추가 중...');
        toggleButton.addEventListener('click', () => {
          console.log('🖱️ 큰글씨 모드 토글 버튼 클릭됨!');
          this.toggle();
        });
      } else {
        console.error('❌ 큰글씨 모드 토글 버튼을 찾을 수 없습니다!');
      }
      
      // 키보드 단축키: Ctrl+Alt+L (큰글씨 모드 전환)
      document.addEventListener('keydown', (e) => {
        if (e.ctrlKey && e.altKey && e.key.toLowerCase() === 'l') {
          e.preventDefault();
          this.toggle();
        }
      });
    }
  };
  
  // 큰글씨 모드 관리자 초기화
  console.log('🚀 LargeTextManager 초기화 시작...');
  LargeTextManager.init();
  console.log('✅ LargeTextManager 초기화 완료!', LargeTextManager);
  
  // 전역 접근을 위해 window 객체에 추가 (개발자 도구용)
  window.LargeTextManager = LargeTextManager;

  /**
   * SizeControlManager - 버튼 크기 실시간 조절 (데모용)
   * 
   * 기능:
   * - 가로/세로 크기 슬라이더로 실시간 조절
   * - 모든 데모 버튼에 동시 적용
   * - 기본값 재설정 기능
   * - 값 표시 및 접근성 지원
   */
  const SizeControlManager = {
    
    // 상수 및 설정
    DEFAULT_WIDTH: 256, // 8px 단위 기본값
    DEFAULT_HEIGHT: 256, // 8px 단위 기본값
    
    // DOM 캐시
    _domCache: {
      widthSlider: null,
      heightSlider: null,
      widthValue: null,
      heightValue: null,
      resetButton: null,
      allButtons: null
    },
    
    // 상태 관리
    currentWidth: 256, // 8px 단위 기본값
    currentHeight: 256, // 8px 단위 기본값
    
    // 초기화 플로우
    init() {
      this._initDOMCache();
      this.setupEventListeners();
      this.updateDisplay();
    },
    
    // DOM 캐시 초기화
    _initDOMCache() {
      this._domCache.widthSlider = document.querySelector('.button-width');
      this._domCache.heightSlider = document.querySelector('.button-height');
      this._domCache.widthValue = document.querySelector('.width-value');
      this._domCache.heightValue = document.querySelector('.height-value');
      this._domCache.resetButton = document.querySelector('.scaling.reset');
      this._domCache.allButtons = document.querySelectorAll('.button');
    },
    
    // 이벤트 리스너 설정
    setupEventListeners() {
      // 가로 크기 슬라이더
      if (this._domCache.widthSlider) {
        this._domCache.widthSlider.addEventListener('input', (e) => {
          this.currentWidth = parseInt(e.target.value);
          this.updateButtonSizes();
          this.updateDisplay();
        });
      }
      
      // 세로 크기 슬라이더
      if (this._domCache.heightSlider) {
        this._domCache.heightSlider.addEventListener('input', (e) => {
          this.currentHeight = parseInt(e.target.value);
          this.updateButtonSizes();
          this.updateDisplay();
        });
      }
      
      // 재설정 버튼
      if (this._domCache.resetButton) {
        this._domCache.resetButton.addEventListener('click', () => {
          this.resetToDefault();
        });
      }
    },
    
    // 버튼 크기 업데이트
    updateButtonSizes() {
      this._domCache.allButtons.forEach(button => {
        button.style.width = `${this.currentWidth}px`;
        button.style.height = `${this.currentHeight}px`;
      });
      
      // 동적 스타일링 함수 호출 (아이콘 크기 재조정)
      if (typeof applyButtonStyles === 'function') {
        requestAnimationFrame(() => {
          applyButtonStyles();
        });
      }
    },
    
    // 표시값 업데이트
    updateDisplay() {
      if (this._domCache.widthValue) {
        this._domCache.widthValue.textContent = `${this.currentWidth}px`;
      }
      if (this._domCache.heightValue) {
        this._domCache.heightValue.textContent = `${this.currentHeight}px`;
      }
    },
    
    // 기본값으로 재설정
    resetToDefault() {
      this.currentWidth = this.DEFAULT_WIDTH;
      this.currentHeight = this.DEFAULT_HEIGHT;
      
      // 슬라이더 값 업데이트
      if (this._domCache.widthSlider) {
        this._domCache.widthSlider.value = this.currentWidth;
      }
      if (this._domCache.heightSlider) {
        this._domCache.heightSlider.value = this.currentHeight;
      }
      
      this.updateButtonSizes();
      this.updateDisplay();
      
      console.log('🔄 버튼 크기 기본값으로 재설정:', {
        width: this.currentWidth,
        height: this.currentHeight
      });
    }
  };
  
  // 크기 조절 관리자 초기화
  console.log('🚀 SizeControlManager 초기화 시작...');
  SizeControlManager.init();
  console.log('✅ SizeControlManager 초기화 완료!', SizeControlManager);
  
  // 전역 접근을 위해 window 객체에 추가 (개발자 도구용)
  window.SizeControlManager = SizeControlManager;


  
  /* 상수 (비율/스케일) */
  const BASE = 0.03125;
  const BACKGROUND_BORDER_RADIUS = BASE;
  const BUTTON_BORDER_RADIUS = 2 * BACKGROUND_BORDER_RADIUS;
  const BACKGROUND_OUTLINE_WIDTH = BASE;
  const BUTTON_PADDING = BACKGROUND_OUTLINE_WIDTH;
  const BUTTON_OUTLINE_WIDTH = 3 * BACKGROUND_OUTLINE_WIDTH;
  const BUTTON_OUTLINE_OFFSET = -1 * BACKGROUND_OUTLINE_WIDTH;
  const SELECTED_ICON_SIZE = 4 * BASE; // 선택 상태 아이콘 크기 비율 (minSide 기준)
  
  /* 상태 변수 */
  let iconSelectedSvgContent = null;
  const buttonElements = Array.from(document.querySelectorAll('.button'));
  const styleCache = new WeakMap();


  /**
   * minSide 기준으로 버튼, 배경, 선택 상태 아이콘을 동적으로 스타일링합니다.
   * 
   * 적용 범위:
   * - 버튼 타입: 기본 버튼(기본↔눌림), 토글 버튼(기본↔선택), 비활성 버튼(비활성)
   * - 버튼 상태: 기본, 눌림, 선택, 비활성, 초점, 호버 (초점/호버는 복합 적용)
   * - 모든 팔레트: Primary1, Primary2, Secondary1, Secondary2
   * 
   * 캐싱을 통해 불필요한 스타일 업데이트를 최소화합니다.
   */
  function applyButtonStyles() {
    for (const button of buttonElements) {
      const background = button.querySelector(".background");
      if (!background) continue;

      const rect = button.getBoundingClientRect();
      const minSide = Math.min(rect.width, rect.height);

      // minSide 기준으로 모든 치수 계산
      const buttonPadding = minSide * BUTTON_PADDING;
      const buttonBorderRadius = minSide * BUTTON_BORDER_RADIUS;
      const buttonOutlineWidth = minSide * BUTTON_OUTLINE_WIDTH;
      const buttonOutlineOffset = minSide * BUTTON_OUTLINE_OFFSET;
      const backgroundBorderRadius = minSide * BACKGROUND_BORDER_RADIUS;
      const backgroundOutlineWidth = minSide * BACKGROUND_OUTLINE_WIDTH;
      const iconSelectedSize = minSide * SELECTED_ICON_SIZE;

      // 업데이트 필요 여부 확인 (캐시 최적화)
      const cached = styleCache.get(button) || {};
      const needsUpdate = (
        (cached.minSide || 0) !== minSide ||
        (cached.buttonPadding || 0) !== buttonPadding ||
        (cached.buttonBorderRadius || 0) !== buttonBorderRadius ||
        (cached.buttonOutlineWidth || 0) !== buttonOutlineWidth ||
        (cached.buttonOutlineOffset || 0) !== buttonOutlineOffset ||
        (cached.backgroundBorderRadius || 0) !== backgroundBorderRadius ||
        (cached.backgroundOutlineWidth || 0) !== backgroundOutlineWidth ||
        (cached.iconSelectedSize || 0) !== iconSelectedSize
      );

      if (!needsUpdate) continue;

      // 버튼 스타일 적용
      button.style.padding = `${buttonPadding}px`;
      button.style.borderRadius = `${buttonBorderRadius}px`;
      button.style.outlineWidth = `${buttonOutlineWidth}px`;
      button.style.outlineOffset = `${buttonOutlineOffset}px`;

      // 배경 스타일 적용
      background.style.borderRadius = `${backgroundBorderRadius}px`;
      background.style.outlineWidth = `${backgroundOutlineWidth}px`;

      // 선택 상태 아이콘 스타일 적용 (min-side 기준)
      const iconSelected = button.querySelector('.icon.dynamic.selected');
      if (iconSelected) {
        iconSelected.style.width = `${iconSelectedSize}px`;
        iconSelected.style.height = `${iconSelectedSize}px`;
        iconSelected.style.top = `${buttonPadding}px`;
        iconSelected.style.right = `${buttonPadding}px`;
      }

      // 적용된 값들을 캐시에 저장
      styleCache.set(button, {
        minSide, buttonPadding, buttonBorderRadius, buttonOutlineWidth, buttonOutlineOffset,
        backgroundBorderRadius, backgroundOutlineWidth, iconSelectedSize
      });
    }
  }


  /**
   * SVG 파일을 로드하고 DOM 컨테이너에 주입합니다.
   * 
   * 적용 범위:
   * - 기본 버튼: 기본 아이콘만 주입
   * - 토글 버튼: 기본 아이콘 + 선택 상태 아이콘 주입
   * - 비활성 버튼: 기본 아이콘만 주입 (상호작용 불가)
   * - 모든 팔레트에 동일한 아이콘 적용
   * 
   * 누락된 icon.dynamic.selected 컨테이너가 있다면 생성합니다.
   */
  function loadSvg(path, selector) {
    return fetch(path)
      .then(response => response.text())
      .then(svgMarkup => {
        document.querySelectorAll(selector).forEach(target => { target.innerHTML = svgMarkup; });
        return svgMarkup;
      });
  }

  // 두 아이콘 타입을 동시에 로드
  const iconPromise = loadSvg('icon.svg', '.icon');
  const iconSelectedPromise = loadSvg('selected.svg', '.icon.dynamic.selected')
    .then(svg => { iconSelectedSvgContent = svg; });

  Promise.all([iconPromise, iconSelectedPromise])
    .then(() => {
      // 누락된 icon.dynamic.selected 컨테이너를 생성하고 SVG 주입 (토글 버튼에만)
      for (const button of buttonElements) {
        const background = button.querySelector('.background');
        if (!background) continue;
        
        // 토글 버튼인지 확인 (toggle 클래스가 있는 경우)
        const isToggleButton = button.classList.contains('toggle');
        
        if (isToggleButton && !background.querySelector('.icon.dynamic.selected')) {
          const iconSelectedSpan = document.createElement('span');
          iconSelectedSpan.className = 'icon dynamic selected';
          if (iconSelectedSvgContent) iconSelectedSpan.innerHTML = iconSelectedSvgContent;
          const iconEl = background.querySelector('.icon.dynamic');
          if (iconEl && iconEl.parentNode) background.insertBefore(iconSelectedSpan, iconEl);
          else background.insertBefore(iconSelectedSpan, background.firstChild);
        }
      }

      // 주입 후 접근성 상태 동기화
      for (const button of buttonElements) {
        const isToggleButton = button.classList.contains('toggle');
        const isInitiallySelected = button.classList.contains('selected');
        
        if (isToggleButton) {
          button.dataset.toggleSelected = 'true';
          button.setAttribute('aria-pressed', isInitiallySelected ? 'true' : 'false');
        }
      }

      // 최적 성능을 위해 다음 프레임에서 스타일 적용
      requestAnimationFrame(() => { applyButtonStyles(); });
    })
    .catch(err => { 
      console.error("SVG 파일 로드 오류:", err); 
      applyButtonStyles(); // 폴백 스타일링
    });


  let resizeScheduled = false;
  window.addEventListener("resize", () => {
    if (resizeScheduled) return;
    resizeScheduled = true;
    requestAnimationFrame(() => {
      applyButtonStyles();
      resizeScheduled = false;
    });
  });


  // 토글 버튼을 위한 클릭 핸들러 (기본 상태 ↔ 선택 상태)
  document.addEventListener('click', (event) => {
    const button = event.target.closest('.button');
    if (!button || button.getAttribute('aria-disabled') === 'true' || 
        button.dataset.toggleSelected !== 'true') return;

    const wasSelected = button.classList.contains('selected');
    const iconSelected = button.querySelector('.icon.dynamic.selected');

    if (wasSelected) {
      // 아이콘을 먼저 숨기고 다음 프레임에서 선택 상태 제거
      if (iconSelected) iconSelected.style.display = 'none';
      requestAnimationFrame(() => {
        button.classList.remove('selected');
        button.setAttribute('aria-pressed', 'false');
        if (iconSelected) iconSelected.style.removeProperty('display');
      });
    } else {
      // 선택 상태를 즉시 표시
      if (iconSelected) iconSelected.style.removeProperty('display');
      button.classList.add('selected');
      button.setAttribute('aria-pressed', 'true');
    }
  }, false);

  // 비활성 버튼을 위한 전역 이벤트 차단
  const findDisabledButton = (event) => {
    if (typeof event.composedPath === 'function') {
      const path = event.composedPath();
      for (const node of path) {
        if (node && node.matches && node.matches('.button[aria-disabled="true"]')) return node;
      }
    }
    return event.target.closest && event.target.closest('.button[aria-disabled="true"]');
  };

  const blockDisabledButtonEvents = (event) => {
    const disabledButton = findDisabledButton(event);
    if (disabledButton) {
      event.preventDefault();
      event.stopPropagation();
      if (typeof event.stopImmediatePropagation === 'function') event.stopImmediatePropagation();
      return true;
    }
    return false;
  };

  // 캡처 단계 이벤트 차단
  document.addEventListener('click', blockDisabledButtonEvents, true);

  // 키보드 이벤트 처리
  document.addEventListener('keydown', (event) => {
    const disabledButton = event.target.closest('.button[aria-disabled="true"]');
    if (disabledButton && (event.key === ' ' || event.key === 'Enter' || event.key === 'NumpadEnter')) {
      event.preventDefault();
      event.stopPropagation();
      if (typeof event.stopImmediatePropagation === 'function') event.stopImmediatePropagation();
      return;
    }

    // Enter 키를 Space 키로 변환하여 브라우저 기본 :active 동작 활용
    const enabledButton = event.target.closest('.button');
    console.log('🔍 키보드 이벤트:', event.key, enabledButton);
    
    if (enabledButton && enabledButton.getAttribute('aria-disabled') !== 'true') {
      if (event.key === 'Enter' || event.key === 'NumpadEnter') {
        console.log('🔄 Enter → pressed 클래스로 활성화');
        event.preventDefault();
        event.stopPropagation();
        
        // pressed 클래스 추가로 활성 상태 시뮬레이션
        enabledButton.classList.add('pressed');
        
        setTimeout(() => {
          // pressed 클래스 제거 후 클릭 실행
          enabledButton.classList.remove('pressed');
          
          // 클릭 이벤트 발생
          const clickEvent = new MouseEvent('click', {
            bubbles: true,
            cancelable: true,
            button: 0
          });
          enabledButton.dispatchEvent(clickEvent);
        }, 100);
      }
    }
  }, true);

  // 회사 표준: 위아래 방향키로 네비게이션 구현
  document.addEventListener('keydown', (event) => {
    const focusedButton = document.activeElement;
    
    // 방향키가 눌렸는지 확인
    const isArrowKey = ['ArrowDown', 'ArrowUp', 'ArrowRight', 'ArrowLeft', 'Home', 'End'].includes(event.key);
    
    // 현재 포커스된 요소가 버튼이 아니고 방향키가 눌렸다면 첫 번째 버튼으로 이동
    if ((!focusedButton || !focusedButton.classList.contains('button')) && isArrowKey) {
      console.log('🔄 방향키 감지 → 첫 번째 버튼으로 자동 포커스');
      event.preventDefault();
      const firstButton = getFirstButton();
      if (firstButton) {
        firstButton.focus();
      }
      return;
    }

    // 현재 포커스된 요소가 버튼인지 확인
    if (!focusedButton || !focusedButton.classList.contains('button')) {
      return;
    }

    let targetButton = null;

    switch (event.key) {
      case 'ArrowDown':
        console.log('🔄 ↓ 다음 버튼 그룹으로 이동');
        event.preventDefault();
        targetButton = getNextButtonGroup(focusedButton);
        break;
        
      case 'ArrowUp':
        console.log('🔄 ↑ 이전 버튼 그룹으로 이동');
        event.preventDefault();
        targetButton = getPreviousButtonGroup(focusedButton);
        break;

              case 'ArrowRight':
          console.log('🔄 → 전체 버튼 중 다음 버튼으로 이동');
          event.preventDefault();
          targetButton = getNextButton(focusedButton);
          break;
          
        case 'ArrowLeft':
          console.log('🔄 ← 전체 버튼 중 이전 버튼으로 이동');
          event.preventDefault();
          targetButton = getPreviousButton(focusedButton);
          break;
        
      case 'Home':
        console.log('🔄 Home: 첫 번째 버튼으로 이동');
        event.preventDefault();
        targetButton = getFirstButton();
        break;
        
      case 'End':
        console.log('🔄 End: 마지막 버튼으로 이동');
        event.preventDefault();
        targetButton = getLastButton();
        break;
    }

    // 포커스 이동
    if (targetButton) {
      targetButton.focus();
    }
  }, true);

  // 마우스/터치 상호작용을 .pressed 클래스로 통일
  document.addEventListener('mousedown', (event) => {
    const button = event.target.closest('.button');
    if (button && button.getAttribute('aria-disabled') !== 'true' && !button.classList.contains('toggle')) {
      console.log('🖱️ 마우스 다운 → pressed 클래스 추가');
      button.classList.add('pressed');
    }
  }, true);

  document.addEventListener('mouseup', (event) => {
    const button = event.target.closest('.button');
    if (button && button.classList.contains('pressed')) {
      console.log('🖱️ 마우스 업 → pressed 클래스 제거');
      button.classList.remove('pressed');
    }
  }, true);

  document.addEventListener('mouseleave', (event) => {
    const button = event.target.closest('.button');
    if (button && button.classList.contains('pressed')) {
      console.log('🖱️ 마우스 벗어남 → pressed 클래스 제거');
      button.classList.remove('pressed');
    }
  }, true);

  // 터치 상호작용도 .pressed 클래스로 통일
  document.addEventListener('touchstart', (event) => {
    const button = event.target.closest('.button');
    if (button && button.getAttribute('aria-disabled') !== 'true' && !button.classList.contains('toggle')) {
      console.log('👆 터치 시작 → pressed 클래스 추가');
      button.classList.add('pressed');
    }
  }, { passive: true });

  document.addEventListener('touchend', (event) => {
    const button = event.target.closest('.button');
    if (button && button.classList.contains('pressed')) {
      console.log('👆 터치 종료 → pressed 클래스 제거');
      button.classList.remove('pressed');
    }
  }, { passive: true });

  document.addEventListener('touchcancel', (event) => {
    const button = event.target.closest('.button');
    if (button && button.classList.contains('pressed')) {
      console.log('👆 터치 취소 → pressed 클래스 제거');
      button.classList.remove('pressed');
    }
  }, { passive: true });

  // 회사 표준: 모든 버튼이 Tab으로 접근 가능 (기본 동작 유지)

  // 버튼 네비게이션 헬퍼 함수들
  function getAllButtons() {
    const allButtons = Array.from(document.querySelectorAll('.button'));
    const visibleButtons = allButtons.filter(btn => 
      btn.offsetParent !== null // 보이는 버튼만 (aria-disabled 포함)
    );
    console.log('🔍 전체 버튼:', allButtons.length, '보이는 버튼:', visibleButtons.length);
    return visibleButtons;
  }

  function getNextButton(currentButton) {
    const buttons = getAllButtons();
    const currentIndex = buttons.indexOf(currentButton);
    console.log('🔍 전체 버튼 탐색 (다음):', currentIndex, '/', buttons.length);
    
    if (currentIndex === -1) return null;
    
    // 다음 버튼, 마지막이면 첫 번째로 순환
    const nextIndex = (currentIndex + 1) % buttons.length;
    console.log('🔍 다음 버튼 인덱스:', nextIndex, buttons[nextIndex]);
    return buttons[nextIndex];
  }

  function getPreviousButton(currentButton) {
    const buttons = getAllButtons();
    const currentIndex = buttons.indexOf(currentButton);
    console.log('🔍 전체 버튼 탐색 (이전):', currentIndex, '/', buttons.length);
    
    if (currentIndex === -1) return null;
    
    // 이전 버튼, 첫 번째면 마지막으로 순환
    const prevIndex = currentIndex === 0 ? buttons.length - 1 : currentIndex - 1;
    console.log('🔍 이전 버튼 인덱스:', prevIndex, buttons[prevIndex]);
    return buttons[prevIndex];
  }

  function getFirstButton() {
    const buttons = getAllButtons();
    return buttons.length > 0 ? buttons[0] : null;
  }

  function getLastButton() {
    const buttons = getAllButtons();
    return buttons.length > 0 ? buttons[buttons.length - 1] : null;
  }

  // 다음 버튼 그룹으로 이동 (상하 네비게이션) - 부모 변경 기준
  function getNextButtonGroup(currentButton) {
    const allButtons = getAllButtons();
    const currentIndex = allButtons.indexOf(currentButton);
    const currentParent = getCurrentShowcase(currentButton);
    
    console.log('🔍 현재 버튼 인덱스:', currentIndex, '부모:', currentParent?.tagName, currentParent?.className);
    
    if (currentIndex === -1) return null;
    
    // 현재 버튼 다음부터 탐색하여 부모가 다른 첫 번째 버튼 찾기
    for (let i = currentIndex + 1; i < allButtons.length; i++) {
      const nextButton = allButtons[i];
      const nextParent = getCurrentShowcase(nextButton);
      
      if (nextParent !== currentParent) {
        console.log('🔍 다음 그룹 발견:', nextParent?.tagName, nextParent?.className);
        // 새로운 부모의 첫 번째 버튼 찾기
        const firstButtonInNewParent = getButtonsInShowcase(nextParent)[0];
        console.log('🔍 새 부모의 첫 번째 버튼:', firstButtonInNewParent);
        return firstButtonInNewParent;
      }
    }
    
    // 끝까지 갔으면 처음부터 다시 탐색 (루프)
    for (let i = 0; i < currentIndex; i++) {
      const nextButton = allButtons[i];
      const nextParent = getCurrentShowcase(nextButton);
      
      if (nextParent !== currentParent) {
        console.log('🔍 루프하여 다음 그룹 발견:', nextParent?.tagName, nextParent?.className);
        // 새로운 부모의 첫 번째 버튼 찾기
        const firstButtonInNewParent = getButtonsInShowcase(nextParent)[0];
        console.log('🔍 루프하여 새 부모의 첫 번째 버튼:', firstButtonInNewParent);
        return firstButtonInNewParent;
      }
    }
    
    return null;
  }

  // 이전 버튼 그룹으로 이동 (상하 네비게이션) - 부모 변경 기준
  function getPreviousButtonGroup(currentButton) {
    const allButtons = getAllButtons();
    const currentIndex = allButtons.indexOf(currentButton);
    const currentParent = getCurrentShowcase(currentButton);
    
    console.log('🔍 현재 버튼 인덱스 (이전):', currentIndex, '부모:', currentParent?.tagName, currentParent?.className);
    
    if (currentIndex === -1) return null;
    
    // 현재 버튼 이전부터 역순으로 탐색하여 부모가 다른 첫 번째 버튼 찾기
    for (let i = currentIndex - 1; i >= 0; i--) {
      const prevButton = allButtons[i];
      const prevParent = getCurrentShowcase(prevButton);
      
      if (prevParent !== currentParent) {
        console.log('🔍 이전 그룹 발견:', prevParent?.tagName, prevParent?.className);
        // 새로운 부모의 첫 번째 버튼 찾기
        const firstButtonInNewParent = getButtonsInShowcase(prevParent)[0];
        console.log('🔍 새 부모의 첫 번째 버튼:', firstButtonInNewParent);
        return firstButtonInNewParent;
      }
    }
    
    // 처음까지 갔으면 끝부터 다시 탐색 (루프)
    for (let i = allButtons.length - 1; i > currentIndex; i--) {
      const prevButton = allButtons[i];
      const prevParent = getCurrentShowcase(prevButton);
      
      if (prevParent !== currentParent) {
        console.log('🔍 루프하여 이전 그룹 발견:', prevParent?.tagName, prevParent?.className);
        // 새로운 부모의 첫 번째 버튼 찾기
        const firstButtonInNewParent = getButtonsInShowcase(prevParent)[0];
        console.log('🔍 루프하여 새 부모의 첫 번째 버튼:', firstButtonInNewParent);
        return firstButtonInNewParent;
      }
    }
    
    return null;
  }

  // 같은 그룹 내에서 다음 버튼 찾기 (좌우 네비게이션)
  function getNextButtonInSameGroup(currentButton) {
    const currentPalette = getCurrentPalette(currentButton);
    if (!currentPalette) return null;

    const paletteButtons = getButtonsInPalette(currentPalette);
    const currentIndex = paletteButtons.indexOf(currentButton);
    
    if (currentIndex === -1) return null;
    
    // 같은 그룹 내에서 다음 버튼, 마지막이면 첫 번째로 순환
    const nextIndex = (currentIndex + 1) % paletteButtons.length;
    return paletteButtons[nextIndex];
  }

  // 같은 그룹 내에서 이전 버튼 찾기 (좌우 네비게이션)
  function getPreviousButtonInSameGroup(currentButton) {
    const currentPalette = getCurrentPalette(currentButton);
    if (!currentPalette) return null;

    const paletteButtons = getButtonsInPalette(currentPalette);
    const currentIndex = paletteButtons.indexOf(currentButton);
    
    if (currentIndex === -1) return null;
    
    // 같은 그룹 내에서 이전 버튼, 첫 번째면 마지막으로 순환
    const prevIndex = currentIndex === 0 ? paletteButtons.length - 1 : currentIndex - 1;
    return paletteButtons[prevIndex];
  }

  // 현재 버튼의 팔레트 클래스 찾기
  function getCurrentPalette(button) {
    const paletteClasses = ['primary1', 'primary2', 'secondary1', 'secondary2'];
    return paletteClasses.find(palette => button.classList.contains(palette));
  }

  // 특정 팔레트의 모든 버튼 가져오기
  function getButtonsInPalette(palette) {
    return getAllButtons().filter(btn => btn.classList.contains(palette));
  }

  // 현재 버튼이 속한 showcase 섹션 찾기 (section 또는 aside 기준)
  function getCurrentShowcase(button) {
    // section.showcase 또는 aside를 찾기
    const showcase = button.closest('section.showcase, aside');
    console.log('🔍 버튼 부모 showcase 찾음:', showcase?.tagName, showcase?.className, showcase);
    return showcase;
  }

  // 다음 showcase 섹션 찾기
  function getNextShowcase(currentShowcase) {
    const allShowcases = Array.from(document.querySelectorAll('section.showcase, aside'));
    const currentIndex = allShowcases.indexOf(currentShowcase);
    console.log('🔍 전체 showcase 개수:', allShowcases.length, '현재 인덱스:', currentIndex);
    
    // showcase가 없거나 찾지 못한 경우 첫 번째 showcase로
    if (currentIndex === -1 || allShowcases.length === 0) {
      console.log('🔍 showcase 찾지 못함 → 첫 번째로 이동');
      return allShowcases.length > 0 ? allShowcases[0] : null;
    }
    
    // 다음 showcase, 마지막이면 첫 번째로 순환
    const nextIndex = (currentIndex + 1) % allShowcases.length;
    console.log('🔍 다음 인덱스:', nextIndex, '(순환 적용)');
    return allShowcases[nextIndex];
  }

  // 이전 showcase 섹션 찾기
  function getPreviousShowcase(currentShowcase) {
    const allShowcases = Array.from(document.querySelectorAll('section.showcase, aside'));
    const currentIndex = allShowcases.indexOf(currentShowcase);
    console.log('🔍 전체 showcase 개수 (이전):', allShowcases.length, '현재 인덱스:', currentIndex);
    
    // showcase가 없거나 찾지 못한 경우 마지막 showcase로
    if (currentIndex === -1 || allShowcases.length === 0) {
      console.log('🔍 showcase 찾지 못함 → 마지막으로 이동');
      return allShowcases.length > 0 ? allShowcases[allShowcases.length - 1] : null;
    }
    
    // 이전 showcase, 첫 번째면 마지막으로 순환
    const prevIndex = currentIndex === 0 ? allShowcases.length - 1 : currentIndex - 1;
    console.log('🔍 이전 인덱스:', prevIndex, '(순환 적용)');
    return allShowcases[prevIndex];
  }

  // 특정 showcase 섹션의 모든 버튼 가져오기
  function getButtonsInShowcase(showcase) {
    const buttonsInShowcase = Array.from(showcase.querySelectorAll('.button'));
    return buttonsInShowcase.filter(btn => 
      btn.offsetParent !== null // 보이는 버튼만 (aria-disabled 포함)
    );
  }

  // keyup 이벤트는 더 이상 필요 없음 (pressed 클래스 사용 안 함)

  // 마우스 이벤트는 브라우저가 자동으로 :active 상태 처리

  // 비활성 버튼을 위한 포인터 이벤트 차단
  const blockPointerEvents = (event) => blockDisabledButtonEvents(event);
  document.addEventListener('mousedown', blockPointerEvents, true);
  document.addEventListener('mouseup', blockPointerEvents, true);
  document.addEventListener('pointerdown', blockPointerEvents, true);
  document.addEventListener('pointerup', blockPointerEvents, true);
  document.addEventListener('touchstart', blockPointerEvents, { capture: true, passive: false });
  document.addEventListener('touchend', blockPointerEvents, { capture: true, passive: false });
  document.addEventListener('contextmenu', blockPointerEvents, true);
  document.addEventListener('dblclick', blockPointerEvents, true);
  document.addEventListener('dragstart', blockPointerEvents, true);
});
