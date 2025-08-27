// ===============================================
// 🎨 버튼 컴포넌트 시스템 - 메인 스크립트
// ===============================================

window.addEventListener("DOMContentLoaded", () => {
  
  // ===== 테마 관리 시스템 그룹 =====
  
  /**
   * 🎨 ThemeManager - 테마 상태 관리 (Light ↔ Dark 전환)
   * 
   * 기능:
   * - Light 테마: 기본 브랜드 색상 중심의 밝은 인터페이스  
   * - Dark 테마: 고대비 모드, 접근성 최적화된 어두운 인터페이스
   * - Static 요소: 테마 독립적 포커스/호버 (핑크)
   * - 로컬 스토리지 연동으로 설정 유지
   * - 시스템 설정 자동 감지 (@media prefers-contrast)
   * - 키보드 단축키 지원 (Ctrl+Alt+H)
   */
  const ThemeManager = {
    
    // 상수 및 설정
    THEMES: {
      LIGHT: 'light',
      DARK: 'dark'
    },
    
    STORAGE_KEY: 'theme-mode',
    MANUAL_MODE_KEY: 'manual-theme-mode',
    
    // DOM 캐시
    _domCache: {
      html: null,
      toggleButton: null,
      toggleLabel: null,
      liveRegion: null
    },
    
    // 상태 관리
    currentTheme: 'light',
    isManualMode: false,
    
    // 초기화 플로우
    
    // 메인 초기화 메소드
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

        this.currentTheme = this.detectSystemPreference();
      }
      
      console.log('🎨 테마 설정 로드:', {
        theme: this.currentTheme,
        manual: this.isManualMode,
        systemPreference: this.detectSystemPreference()
      });
    },
    
    // 시스템 테마 선호도 감지
    detectSystemPreference() {
      const prefersHighContrast = window.matchMedia('(prefers-contrast: high)').matches;
      return prefersHighContrast ? this.THEMES.DARK : this.THEMES.LIGHT;
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
      
      // 시스템 설정 변경 감지 (자동 모드일 때만)
      const contrastQuery = window.matchMedia('(prefers-contrast: high)');
      
      const handleSystemChange = () => {
        if (!this.isManualMode) {
          const newSystemPreference = this.detectSystemPreference();
          if (newSystemPreference !== this.currentTheme) {
            this.currentTheme = newSystemPreference;
            this.applyCurrentState();
            this.syncToggleButton();
            console.log('🖥️ 시스템 테마 설정 변경 감지:', this.currentTheme);
          }
        }
      };
      
      contrastQuery.addEventListener('change', handleSystemChange);
    },
    
    // 자동 모드로 재설정
    resetToAuto() {
      this.isManualMode = false;
      this.currentTheme = this.detectSystemPreference();
      this.applyCurrentState();
      this.saveSettings();
      this.syncToggleButton();
      
      console.log('🔄 자동 테마 모드로 재설정:', {
        theme: this.currentTheme,
        systemPreference: this.detectSystemPreference()
      });
    }
  };
  
  // 테마 관리자 초기화
  console.log('🚀 ThemeManager 초기화 시작...');
  ThemeManager.init();
  console.log('✅ ThemeManager 초기화 완료!', ThemeManager);
  
  // 전역 접근을 위해 window 객체에 추가 (개발자 도구용)
  window.ThemeManager = ThemeManager;

  // ===== 큰글씨 모드 관리 시스템 그룹 =====
  
  /**
   * 📝 LargeTextManager - 큰글씨 모드 상태 관리 (기본 ↔ 큰글씨 전환)
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
    
    STORAGE_KEY: 'large-text-mode',
    
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
      this._domCache.toggleButton = document.querySelector('.large-text-toggle');
      if (this._domCache.toggleButton) {
        this._domCache.toggleLabel = this._domCache.toggleButton.querySelector('.label');
      }
      this._domCache.liveRegion = document.getElementById('large-text-announcer');
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
      const body = this._domCache.body;
      
      if (this.currentMode === this.MODES.LARGE) {
        body.classList.add('large-text');
      } else {
        body.classList.remove('large-text');
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
        liveRegion.id = 'large-text-announcer';
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
      const toggleButton = document.querySelector('.large-text-toggle');
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

  // ==============================
  // 상수 (비율/스케일)
  // ==============================
  const BASE = 0.03125;
  const BACKGROUND_BORDER_RADIUS = BASE;
  const BUTTON_BORDER_RADIUS = 2 * BACKGROUND_BORDER_RADIUS;
  const BACKGROUND_OUTLINE_WIDTH = BASE;
  const BUTTON_PADDING = BACKGROUND_OUTLINE_WIDTH;
  const BUTTON_OUTLINE_WIDTH = 3 * BACKGROUND_OUTLINE_WIDTH;
  const BUTTON_OUTLINE_OFFSET = -1 * BACKGROUND_OUTLINE_WIDTH;
  const SELECTED_ICON_SIZE = 4 * BASE; // 선택 상태 아이콘 크기 비율 (minSide 기준)
  
  // 상태 변수
  let selectedSvgContent = null; // 누락된 컨테이너 보강용 SVG 내용
  const buttonElements = Array.from(document.querySelectorAll('.button'));
  const styleCache = new WeakMap(); // 불필요한 스타일 업데이트 방지를 위한 마지막 적용값 캐시

  // ==============================
  // 동적 스타일링 함수 (모든 버튼 타입과 상태에 적용)
  // ==============================
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
      const background = button.querySelector(".button-background");
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
      const selectedIconSize = minSide * SELECTED_ICON_SIZE;

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
        (cached.selectedIconSize || 0) !== selectedIconSize
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

      // 선택 상태 아이콘 스타일 적용
      const selectedIconSvg = button.querySelector('.selected-icon svg');
      if (selectedIconSvg) {
        selectedIconSvg.style.width = `${selectedIconSize}px`;
        selectedIconSvg.style.height = `${selectedIconSize}px`;
      }

      // 선택 상태 아이콘을 패딩 오프셋만큼 우상단에 배치
      const selectedIcon = button.querySelector('.selected-icon');
      if (selectedIcon) {
        selectedIcon.style.top = `${buttonPadding}px`;
        selectedIcon.style.right = `${buttonPadding}px`;
      }

      // 적용된 값들을 캐시에 저장
      styleCache.set(button, {
        minSide, buttonPadding, buttonBorderRadius, buttonOutlineWidth, buttonOutlineOffset,
        backgroundBorderRadius, backgroundOutlineWidth, selectedIconSize
      });
    }
  }

  // ==============================
  // SVG 주입 (우선순위: 최우선) - 모든 버튼 타입에 적용
  // ==============================
  /**
   * SVG 파일을 로드하고 DOM 컨테이너에 주입합니다.
   * 
   * 적용 범위:
   * - 기본 버튼: 기본 아이콘만 주입
   * - 토글 버튼: 기본 아이콘 + 선택 상태 아이콘 주입
   * - 비활성 버튼: 기본 아이콘만 주입 (상호작용 불가)
   * - 모든 팔레트에 동일한 아이콘 적용
   * 
   * 누락된 selected-icon 컨테이너가 있다면 생성합니다.
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
  const selectedIconPromise = loadSvg('selected.svg', '.selected-icon')
    .then(svg => { selectedSvgContent = svg; });

  Promise.all([iconPromise, selectedIconPromise])
    .then(() => {
      // 누락된 selected-icon 컨테이너를 생성하고 SVG 주입
      for (const button of buttonElements) {
        const background = button.querySelector('.button-background');
        if (!background) continue;
        if (!background.querySelector('.selected-icon')) {
          const selectedIconSpan = document.createElement('span');
          selectedIconSpan.className = 'selected-icon';
          if (selectedSvgContent) selectedIconSpan.innerHTML = selectedSvgContent;
          const iconEl = background.querySelector('.icon');
          if (iconEl && iconEl.parentNode) background.insertBefore(selectedIconSpan, iconEl);
          else background.insertBefore(selectedIconSpan, background.firstChild);
        }
      }

      // 주입 후 접근성 상태 동기화
      for (const button of buttonElements) {
        const isInitiallySelected = button.classList.contains('selected');
        if (isInitiallySelected) button.dataset.toggleSelected = 'true';
        button.setAttribute('aria-pressed', isInitiallySelected ? 'true' : 'false');
      }

      // 최적 성능을 위해 다음 프레임에서 스타일 적용
      requestAnimationFrame(() => { applyButtonStyles(); });
    })
    .catch(err => { 
      console.error("SVG 파일 로드 오류:", err); 
      applyButtonStyles(); // 폴백 스타일링
    });

  // ==============================
  // 리사이즈 처리
  // ==============================
  let resizeScheduled = false;
  window.addEventListener("resize", () => {
    if (resizeScheduled) return;
    resizeScheduled = true;
    requestAnimationFrame(() => {
      applyButtonStyles();
      resizeScheduled = false;
    });
  });

  // ==============================
  // 이벤트 핸들러 (버튼 타입별 상태 전환)
  // ==============================
  // 토글 버튼을 위한 클릭 핸들러 (기본 상태 ↔ 선택 상태)
  document.addEventListener('click', (event) => {
    const button = event.target.closest('.button');
    if (!button || button.getAttribute('aria-disabled') === 'true' || 
        button.dataset.toggleSelected !== 'true') return;

    const wasSelected = button.classList.contains('selected');
    const selectedIcon = button.querySelector('.selected-icon');

    if (wasSelected) {
      // 아이콘을 먼저 숨기고 다음 프레임에서 선택 상태 제거
      if (selectedIcon) selectedIcon.style.display = 'none';
      requestAnimationFrame(() => {
        button.classList.remove('selected');
        button.setAttribute('aria-pressed', 'false');
        if (selectedIcon) selectedIcon.style.removeProperty('display');
      });
    } else {
      // 선택 상태를 즉시 표시
      if (selectedIcon) selectedIcon.style.removeProperty('display');
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

    // 활성화된 버튼에서 Enter/Space 처리
    const enabledButton = event.target.closest('.button');
    if (enabledButton && enabledButton.getAttribute('aria-disabled') !== 'true') {
      if (event.key === 'Enter' || event.key === 'NumpadEnter' || event.key === ' ') {
        event.preventDefault();
        enabledButton.classList.add('pressed');
      }
    }
  }, true);

  document.addEventListener('keyup', (event) => {
    const button = event.target.closest('.button');
    if (!button) return;
    if (event.key === 'Enter' || event.key === 'NumpadEnter' || event.key === ' ') {
      button.classList.remove('pressed');
      if (button.getAttribute('aria-disabled') !== 'true') {
        button.click();
      }
    }
  }, true);

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
