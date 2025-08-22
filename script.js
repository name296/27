window.addEventListener("DOMContentLoaded", () => {

  // ==============================
  // 상수(비율/스케일)
  // ==============================
  
  
  const BASE = 0.03125;

  const BACKGROUND_BORDER_RADIUS = BASE;
  const BUTTON_BORDER_RADIUS = 2 * BACKGROUND_BORDER_RADIUS;

  const BACKGROUND_OUTLINE_WIDTH = BASE;
  const BUTTON_PADDING =  BACKGROUND_OUTLINE_WIDTH;

  const BUTTON_OUTLINE_WIDTH = 3 * BACKGROUND_OUTLINE_WIDTH;
  const BUTTON_OUTLINE_OFFSET = -1 * BACKGROUND_OUTLINE_WIDTH;
  const SELECTED_ICON_SIZE = 4 * BASE; // selected-icon 크기 비율 (minSide 기준)
  let selectedSvgContent = null; // 주입 후 없을 수 있는 컨테이너 보강용


  // ==============================
  // 함수: 동적 스타일링
  // ==============================
  /**
   * 버튼과 내부 배경, 선택 아이콘을 minSide 기준으로 동적 스타일링합니다.
   * @returns {void}
   */
  function stylingButtonBackground() {
    document.querySelectorAll(".button").forEach(buttonEl => {
      const backgroundEl = buttonEl.querySelector(".button-background");
      if (!backgroundEl) return;

      const rect = buttonEl.getBoundingClientRect();
      const minSide = Math.min(rect.width, rect.height);

      const buttonPadding = minSide * BUTTON_PADDING;
      const buttonBorderRadius = minSide * BUTTON_BORDER_RADIUS;
      const buttonOutlineWidth = minSide * BUTTON_OUTLINE_WIDTH;
      const buttonOutlineOffset = minSide * BUTTON_OUTLINE_OFFSET;

      const backgroundBoderRadius = minSide * BACKGROUND_BORDER_RADIUS;
      const bakcgroundOutlineWidth = minSide * BACKGROUND_OUTLINE_WIDTH;
      const selectedIconSize = minSide * SELECTED_ICON_SIZE;

      buttonEl.style.padding = `${buttonPadding}px`;
      buttonEl.style.borderRadius = `${buttonBorderRadius}px`;
      buttonEl.style.outlineWidth = `${buttonOutlineWidth}px`;
      buttonEl.style.outlineOffset = `${buttonOutlineOffset}px`;

      backgroundEl.style.borderRadius = `${backgroundBoderRadius}px`;
      backgroundEl.style.outlineWidth = `${bakcgroundOutlineWidth}px`;

      const selectedIconSvg = buttonEl.querySelector('.selected-icon svg');
      if (selectedIconSvg) {
        selectedIconSvg.style.width = `${selectedIconSize}px`;
        selectedIconSvg.style.height = `${selectedIconSize}px`;
      }
    });
  }
 
  // ==============================
  // 초기 렌더/리사이즈 처리
  // ==============================
  /*DOM 로드 시, 스타일링 함수 호출*/
  stylingButtonBackground();

  /*DOM 로드 시, 내장되어, 화면 사이즈 변동 감시, 스타일링 함수 호출*/
  let resizeScheduled = false;
  window.addEventListener("resize", () => {
    if (resizeScheduled) return;
    resizeScheduled = true;
    requestAnimationFrame(() => {
      stylingButtonBackground();
      resizeScheduled = false;
    });
  });

  // ==============================
  // SVG 주입 (두 아이콘 주입 후 일괄 사이징)
  // ==============================
  /*index.html에 동봉된 아이콘을 span 컨테이너에 주입 → 모두 주입된 뒤 사이즈 계산*/
  function loadSvg(path, selector) {
    return fetch(path)
      .then(response => response.text())
      .then(svgMarkup => {
        document.querySelectorAll(selector).forEach(targetNode => { targetNode.innerHTML = svgMarkup; });
        return svgMarkup;
      });
  }

  const iconPromise = loadSvg('icon.svg', '.icon');
  const selectedIconPromise = loadSvg('selected.svg', '.selected-icon').then(svg => { selectedSvgContent = svg; });

  Promise.all([iconPromise, selectedIconPromise])
    .then(() => {
      // 버튼별로 .selected-icon 컨테이너가 없다면 생성 후 SVG 주입
      document.querySelectorAll('.button').forEach(buttonEl => {
        const backgroundEl = buttonEl.querySelector('.button-background');
        if (!backgroundEl) return;
        if (!backgroundEl.querySelector('.selected-icon')) {
          const selectedIconSpan = document.createElement('span');
          selectedIconSpan.className = 'selected-icon';
          if (selectedSvgContent) selectedIconSpan.innerHTML = selectedSvgContent;
          const iconEl = backgroundEl.querySelector('.icon');
          if (iconEl && iconEl.parentNode) backgroundEl.insertBefore(selectedIconSpan, iconEl);
          else backgroundEl.insertBefore(selectedIconSpan, backgroundEl.firstChild);
        }
      });
      stylingButtonBackground();
    })
    .catch(err => console.error("SVG 파일 로드 오류:", err));

  // ==============================
  // 접근성 상태 동기화
  // ==============================
  // 초기 로드시 aria-pressed 동기화 및 토글 가능한 버튼 표시(처음에 selected였던 버튼만 토글 대상)
  document.querySelectorAll('.button').forEach(buttonEl => {
    const isInitiallySelected = buttonEl.classList.contains('selected');
    if (isInitiallySelected) {
      buttonEl.dataset.toggleSelected = 'true';
    }
    buttonEl.setAttribute('aria-pressed', isInitiallySelected ? 'true' : 'false');
  });

  // ==============================
  // 클릭/키보드 이벤트 핸들러
  // ==============================
  // 클릭 시 토글 대상(초기 selected였던 버튼)만 선택 토글
  document.addEventListener('click', (clickEvent) => {
    const buttonEl = clickEvent.target.closest('.button');
    if (!buttonEl) return;
    if (buttonEl.getAttribute('aria-disabled') === 'true') return;
    if (buttonEl.dataset.toggleSelected !== 'true') return;
    buttonEl.classList.toggle('selected');
    buttonEl.setAttribute('aria-pressed', buttonEl.classList.contains('selected') ? 'true' : 'false');
  }, false);

  // aria-disabled="true" 버튼의 클릭/키보드 활성화를 전역에서 차단 (포커스는 허용)
  // --------------------------------------------------
  /**
   * 이벤트 경로에서 aria-disabled="true" 버튼을 찾아 반환합니다.
   * @param {Event} event - 처리할 이벤트 객체
   * @returns {HTMLElement|null} 비활성 버튼 노드 또는 null
   */
  const findDisabledButtonInPath = (domEvent) => {
    if (typeof domEvent.composedPath !== 'function') {
      return domEvent.target.closest && domEvent.target.closest('.button[aria-disabled="true"]');
    }
    const path = domEvent.composedPath();
    for (const node of path) {
      if (node && node.matches && node.matches('.button[aria-disabled="true"]')) return node;
    }
    return null;
  };

  /**
   * aria-disabled 버튼이면 해당 이벤트를 전파/기본 동작을 차단합니다.
   * @param {Event} event - 처리할 이벤트 객체
   * @returns {boolean} 차단되었으면 true
   */
  const blockEventIfAriaDisabled = (domEvent) => {
    const targetButtonEl = findDisabledButtonInPath(domEvent);
    if (targetButtonEl) {
      domEvent.preventDefault();
      domEvent.stopPropagation();
      if (typeof domEvent.stopImmediatePropagation === 'function') domEvent.stopImmediatePropagation();
      return true;
    }
    return false;
  };

  document.addEventListener('click', (clickEvent) => {
    blockEventIfAriaDisabled(clickEvent);
  }, true);

  document.addEventListener('keydown', (keyboardEvent) => {
    const disabledButtonEl = keyboardEvent.target.closest('.button[aria-disabled="true"]');
    // Space/Enter로 인한 활성화 방지
    if (disabledButtonEl && (keyboardEvent.key === ' ' || keyboardEvent.key === 'Enter' || keyboardEvent.key === 'NumpadEnter')) {
      keyboardEvent.preventDefault();
      keyboardEvent.stopPropagation();
      if (typeof keyboardEvent.stopImmediatePropagation === 'function') keyboardEvent.stopImmediatePropagation();
      return;
    }

    // Enabled 버튼에서 Enter/Space 시, 비주얼만 부여(네이티브 클릭 유지)
    const enabledButtonEl = keyboardEvent.target.closest('.button');
    if (enabledButtonEl && enabledButtonEl.getAttribute('aria-disabled') !== 'true') {
      if (keyboardEvent.key === 'Enter' || keyboardEvent.key === 'NumpadEnter' || keyboardEvent.key === ' ') {
        enabledButtonEl.classList.add('key-active');
      }
    }
  }, true);

  document.addEventListener('keyup', (keyboardEvent) => {
    const buttonEl = keyboardEvent.target.closest('.button');
    if (!buttonEl) return;
    if (keyboardEvent.key === 'Enter' || keyboardEvent.key === 'NumpadEnter' || keyboardEvent.key === ' ') {
      buttonEl.classList.remove('key-active');
    }
  }, true);

  // 마우스다운/업, 포인터다운/업, 터치스타트/엔드 차단 (포커스는 키보드로만 허용)
  const blockPointerLikeEvent = (pointerEvent) => {
    blockEventIfAriaDisabled(pointerEvent);
  };

  document.addEventListener('mousedown', blockPointerLikeEvent, true);
  document.addEventListener('mouseup', blockPointerLikeEvent, true);
  document.addEventListener('pointerdown', blockPointerLikeEvent, true);
  document.addEventListener('pointerup', blockPointerLikeEvent, true);
  // 터치 이벤트는 preventDefault를 위해 passive:false 필요
  document.addEventListener('touchstart', blockPointerLikeEvent, { capture: true, passive: false });
  document.addEventListener('touchend', blockPointerLikeEvent, { capture: true, passive: false });

  // 추가적인 이벤트도 차단
  document.addEventListener('contextmenu', blockPointerLikeEvent, true);
  document.addEventListener('dblclick', blockPointerLikeEvent, true);
  document.addEventListener('dragstart', blockPointerLikeEvent, true);

  // 키보드 입력에 대한 커스텀 비주얼/합성 클릭은 사용하지 않습니다. 
});
