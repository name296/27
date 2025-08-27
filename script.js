window.addEventListener("DOMContentLoaded", () => {
  // ==============================
  // 고대비 모드 관리 시스템
  // ==============================
  
  /**
   * 고대비 모드 상태 관리
   * - 로컬 스토리지 연동
   * - 시스템 설정 감지
   * - 수동 토글 지원
   * - 키보드 단축키 (Ctrl+Alt+H)
   */
  const HighContrastManager = {
    // 설정 키
    STORAGE_KEY: 'high-contrast-mode',
    MANUAL_MODE_KEY: 'manual-contrast-mode',
    
    // 현재 상태
    isEnabled: false,
    isManualMode: false,
    
    // 초기화
    init() {
      this.loadSettings();
      this.setupEventListeners();
      this.applyCurrentState();
      this.syncToggleButton();
    },
    
    // 로컬 스토리지에서 설정 로드
    loadSettings() {
      const savedState = localStorage.getItem(this.STORAGE_KEY);
      const savedManualMode = localStorage.getItem(this.MANUAL_MODE_KEY);
      
      this.isManualMode = savedManualMode === 'true';
      
      if (this.isManualMode) {
        // 수동 모드: 저장된 설정 사용
        this.isEnabled = savedState === 'enabled';
      } else {
        // 자동 모드: 시스템 설정 감지
        this.isEnabled = this.detectSystemHighContrast();
      }
      
      console.log('🎨 고대비 모드 설정 로드:', {
        enabled: this.isEnabled,
        manual: this.isManualMode,
        system: this.detectSystemHighContrast()
      });
    },
    
    // 시스템 고대비 모드 감지
    detectSystemHighContrast() {
      return window.matchMedia('(prefers-contrast: high)').matches ||
             window.matchMedia('(prefers-contrast: more)').matches;
    },
    
    // 현재 상태를 DOM에 적용
    applyCurrentState() {
      const html = document.documentElement;
      
      if (this.isEnabled) {
        html.classList.add('high-contrast');
      } else {
        html.classList.remove('high-contrast');
      }
      
      if (this.isManualMode) {
        html.classList.add('manual-contrast-mode');
      } else {
        html.classList.remove('manual-contrast-mode');
      }
    },
    
    // 설정을 로컬 스토리지에 저장
    saveSettings() {
      localStorage.setItem(this.STORAGE_KEY, this.isEnabled ? 'enabled' : 'disabled');
      localStorage.setItem(this.MANUAL_MODE_KEY, this.isManualMode.toString());
      
      console.log('💾 고대비 모드 설정 저장:', {
        enabled: this.isEnabled,
        manual: this.isManualMode
      });
    },
    
    // 토글 버튼 상태 동기화
    syncToggleButton() {
      const toggleButton = document.querySelector('.high-contrast-toggle');
      if (toggleButton) {
        toggleButton.setAttribute('aria-pressed', this.isEnabled.toString());
        
        // 버튼 텍스트 업데이트
        const label = toggleButton.querySelector('.label');
        if (label) {
          label.textContent = this.isEnabled ? '고대비\n해제' : '고대비\n모드';
        }
      }
    },
    
    // 고대비 모드 토글
    toggle() {
      this.isEnabled = !this.isEnabled;
      this.isManualMode = true; // 수동 토글 시 수동 모드로 전환
      
      this.applyCurrentState();
      this.saveSettings();
      this.syncToggleButton();
      
      // 접근성 알림
      this.announceChange();
      
      console.log('🔄 고대비 모드 토글:', {
        enabled: this.isEnabled,
        manual: this.isManualMode
      });
    },
    
    // 접근성 알림 (스크린 리더용)
    announceChange() {
      const message = this.isEnabled ? '고대비 모드가 활성화되었습니다.' : '고대비 모드가 비활성화되었습니다.';
      
      // aria-live 영역에 메시지 추가
      let liveRegion = document.getElementById('high-contrast-announcer');
      if (!liveRegion) {
        liveRegion = document.createElement('div');
        liveRegion.id = 'high-contrast-announcer';
        liveRegion.setAttribute('aria-live', 'polite');
        liveRegion.setAttribute('aria-atomic', 'true');
        liveRegion.style.position = 'absolute';
        liveRegion.style.left = '-10000px';
        liveRegion.style.width = '1px';
        liveRegion.style.height = '1px';
        liveRegion.style.overflow = 'hidden';
        document.body.appendChild(liveRegion);
      }
      
      liveRegion.textContent = message;
    },
    
    // 이벤트 리스너 설정
    setupEventListeners() {
      // 토글 버튼 클릭
      const toggleButton = document.querySelector('.high-contrast-toggle');
      if (toggleButton) {
        toggleButton.addEventListener('click', () => {
          this.toggle();
        });
      }
      
      // 키보드 단축키: Ctrl+Alt+H
      document.addEventListener('keydown', (e) => {
        if (e.ctrlKey && e.altKey && e.key.toLowerCase() === 'h') {
          e.preventDefault(); // 기본 동작 방지
          this.toggle();
        }
      });
      
      // 시스템 설정 변경 감지 (자동 모드일 때만)
      const contrastQuery = window.matchMedia('(prefers-contrast: high)');
      const moreContrastQuery = window.matchMedia('(prefers-contrast: more)');
      
      const handleSystemChange = () => {
        if (!this.isManualMode) {
          const newSystemState = this.detectSystemHighContrast();
          if (newSystemState !== this.isEnabled) {
            this.isEnabled = newSystemState;
            this.applyCurrentState();
            this.syncToggleButton();
            console.log('🖥️ 시스템 고대비 모드 변경 감지:', this.isEnabled);
          }
        }
      };
      
      contrastQuery.addEventListener('change', handleSystemChange);
      moreContrastQuery.addEventListener('change', handleSystemChange);
    },
    
    // 자동 모드로 재설정
    resetToAuto() {
      this.isManualMode = false;
      this.isEnabled = this.detectSystemHighContrast();
      this.applyCurrentState();
      this.saveSettings();
      this.syncToggleButton();
      
      console.log('🔄 자동 모드로 재설정:', {
        enabled: this.isEnabled,
        system: this.detectSystemHighContrast()
      });
    }
  };
  
  // 고대비 모드 관리자 초기화
  HighContrastManager.init();
  
  // 전역 접근을 위해 window 객체에 추가 (개발자 도구용)
  window.HighContrastManager = HighContrastManager;

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
   * - 모든 팔레트: Primary-1, Primary-2, Secondary-1, Secondary-2
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
        event.preventDefault(); // 네이티브 동작 방지
        enabledButton.classList.add('key-active');
      }
    }
  }, true);

  document.addEventListener('keyup', (event) => {
    const button = event.target.closest('.button');
    if (!button) return;
    if (event.key === 'Enter' || event.key === 'NumpadEnter' || event.key === ' ') {
      button.classList.remove('key-active');
      if (button.getAttribute('aria-disabled') !== 'true') {
        button.click(); // 프로그래매틱 클릭
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

// ==============================
// 하이 콘트라스트 모드 토글 기능 (모든 버튼 타입과 상태에 적용)
// ==============================
/**
 * 하이 콘트라스트 모드를 토글하고 localStorage에 상태를 저장합니다.
 * 
 * 적용 범위:
 * - 모든 버튼 타입: 기본 버튼, 토글 버튼, 비활성 버튼
 * - 모든 버튼 상태: 기본, 눌림, 선택, 비활성, 초점, 호버
 * - 모든 팔레트: Primary-1, Primary-2, Secondary-1, Secondary-2
 * 
 * 고대비 색상으로 일관성 있게 오버라이드됩니다.
 */
function initializeHighContrastToggle() {
  const toggleButton = document.querySelector('.high-contrast-toggle');
  const body = document.body;
  
  if (!toggleButton) return;
  
  // 로컬 스토리지에서 하이 콘트라스트 모드 상태 복원
  const isHighContrast = localStorage.getItem('highContrastMode') === 'true';
  if (isHighContrast) {
    body.classList.add('high-contrast');
    toggleButton.setAttribute('aria-pressed', 'true');
  }
  
  // 하이 콘트라스트 모드 토글 이벤트
  toggleButton.addEventListener('click', () => {
    const isCurrentlyHighContrast = body.classList.contains('high-contrast');
    
    if (isCurrentlyHighContrast) {
      // 일반 모드로 전환
      body.classList.remove('high-contrast');
      toggleButton.setAttribute('aria-pressed', 'false');
      localStorage.setItem('highContrastMode', 'false');
    } else {
      // 하이 콘트라스트 모드로 전환
      body.classList.add('high-contrast');
      toggleButton.setAttribute('aria-pressed', 'true');
      localStorage.setItem('highContrastMode', 'true');
    }
  });
}

// 하이 콘트라스트 모드 초기화
initializeHighContrastToggle();
