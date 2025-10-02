/* ==============================
  ?벀 紐⑤뱢 Import
  ============================== */
const { ColorConverter, Topology, Mechanics, AppUtils, ButtonSystem, ThemeManager, LargeTextManager, SizeControlManager, CustomPaletteManager } = window;


/* ==============================
  🚀 시스템 초기화 및 무결성 검증
  ============================== */

const initializeApp = async () => {
  // HTML 구조 검증
  const requiredElements = ['#main-header', '#main-content', '#control-panel', '#demo-area'];
  const missingElements = requiredElements.filter(selector => !document.querySelector(selector));
  if (missingElements.length > 0) {
    // HTML 구조 오류 감지됨
  }
  
  // CSS 변수 검증
  const testElement = document.createElement('div');
  document.body.appendChild(testElement);
  const computedStyle = getComputedStyle(testElement);
  const criticalVars = ['--primary1-background-color-default', '--color-system-01', '--font-family'];
  const missingVars = criticalVars.filter(varName => !computedStyle.getPropertyValue(varName));
  document.body.removeChild(testElement);
  if (missingVars.length > 0) {
    // CSS 변수 오류 감지됨
  }
  
  // Manager 초기화 (종속성 순서)
  try {
    ThemeManager.init();
    LargeTextManager.init();
    SizeControlManager.init();
    CustomPaletteManager.init();
    await ButtonSystem.init();
  } catch (error) {
    // 시스템 초기화 실패
    throw error;
  }
  
/* ==============================
  🎮 글로벌 이벤트 시스템
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
    const button = event.target?.closest?.('.button');
    if (!button || button.getAttribute('aria-disabled') === 'true' || 
        button.dataset.isToggleButton !== 'true') return;

    const wasPressed = button.classList.contains('pressed');
    const iconPressed = button.querySelector('.content.icon.pressed');

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
      
      // 상태 변경 후 명도대비 업데이트
      ButtonSystem.StyleManager.scheduleContrastUpdate();
    }
  }, false);

  const blockDisabledButtonEvents = (event) => {
    const disabledButton = event.target?.closest?.('.button[aria-disabled="true"]');
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
    const disabledButton = event.target?.closest?.('.button[aria-disabled="true"]');
    if (disabledButton && (event.key === ' ' || event.key === 'Enter' || event.key === 'NumpadEnter')) {
      event.preventDefault();
      event.stopPropagation();
      return;
    }

    const enabledButton = event.target?.closest?.('.button');
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
      case 'ArrowRight':
        event.preventDefault();
        // 전체 버튼을 순환하여 다음 버튼으로 이동
        const currentIndex = allButtons.indexOf(focusedButton);
        const nextIndex = (currentIndex + 1) % allButtons.length;
        targetButton = allButtons[nextIndex];
        break;
        
      case 'ArrowLeft':
        event.preventDefault();
        // 전체 버튼을 순환하여 이전 버튼으로 이동
        const currentIndex2 = allButtons.indexOf(focusedButton);
        const prevIndex = currentIndex2 === 0 ? allButtons.length - 1 : currentIndex2 - 1;
        targetButton = allButtons[prevIndex];
        break;

      case 'ArrowDown':
          event.preventDefault();
        // 좌우 버튼 순환에서 다음 컨테이너 경계 찾기
        const currentContainer = focusedButton.closest('.showcase');
        const currentIndexForDown = allButtons.indexOf(focusedButton);
        
        // 현재 버튼부터 다음 컨테이너의 첫 번째 버튼 찾기
        for (let i = 1; i < allButtons.length; i++) {
          const nextIndex = (currentIndexForDown + i) % allButtons.length;
          const nextButton = allButtons[nextIndex];
          const nextContainer = nextButton.closest('.showcase');
          
          if (nextContainer !== currentContainer) {
            targetButton = nextButton;
            break;
          }
        }
          break;
          
      case 'ArrowUp':
          event.preventDefault();
        // 좌우 버튼 순환에서 이전 컨테이너 경계 찾기
        const currentContainerUp = focusedButton.closest('.showcase');
        const currentIndexUp = allButtons.indexOf(focusedButton);
        
        // 현재 버튼부터 역순으로 이전 컨테이너의 첫 번째 버튼 찾기
        for (let i = 1; i < allButtons.length; i++) {
          const prevIndex = (currentIndexUp - i + allButtons.length) % allButtons.length;
          const prevButton = allButtons[prevIndex];
          const prevContainer = prevButton.closest('.showcase');
          
          if (prevContainer !== currentContainerUp) {
            // 이전 컨테이너의 첫 번째 버튼 찾기
            const buttonsInPrevContainer = allButtons.filter(btn => btn.closest('.showcase') === prevContainer);
            targetButton = buttonsInPrevContainer[0];
            break;
          }
        }
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
    const button = event.target?.closest?.('.button');
    if (button && button.getAttribute('aria-disabled') !== 'true' && !button.classList.contains('toggle')) {
      button.classList.add('pressed');
      

    }
  }, true);

  document.addEventListener('mouseup', (event) => {
    const button = event.target?.closest?.('.button');
    if (button && button.classList.contains('pressed') && !button.classList.contains('toggle')) {
      button.classList.remove('pressed');
      
      // 상태 변경 후 명도대비 업데이트
      ButtonSystem.StyleManager.scheduleContrastUpdate();
    }
  }, true);

  document.addEventListener('mouseleave', (event) => {
    if (event.target && typeof event.target.closest === 'function') {
      const button = event.target?.closest?.('.button');
      if (button && button.classList.contains('pressed') && !button.classList.contains('toggle')) {
      button.classList.remove('pressed');
        
      // 상태 변경 후 업데이트
      ButtonSystem.StyleManager.scheduleUpdate();
      }
    }
  }, true);

  document.addEventListener('touchstart', (event) => {
    const button = event.target?.closest?.('.button');
    if (button && button.getAttribute('aria-disabled') !== 'true' && !button.classList.contains('toggle')) {
      button.classList.add('pressed');
      

    }
  }, { passive: true });

  document.addEventListener('touchend', (event) => {
    const button = event.target?.closest?.('.button');
    if (button && button.classList.contains('pressed') && !button.classList.contains('toggle')) {
      button.classList.remove('pressed');
      
      // 상태 변경 후 명도대비 업데이트
      ButtonSystem.StyleManager.scheduleContrastUpdate();
    }
  }, { passive: true });

  document.addEventListener('touchcancel', (event) => {
    const button = event.target?.closest?.('.button');
    if (button && button.classList.contains('pressed') && !button.classList.contains('toggle')) {
      button.classList.remove('pressed');
      
      // 상태 변경 후 명도대비 업데이트
      ButtonSystem.StyleManager.scheduleContrastUpdate();
    }
  }, { passive: true });

  window.AppUtils = AppUtils;
  window.ButtonSystem = ButtonSystem;
  window.ThemeManager = ThemeManager;
  window.LargeTextManager = LargeTextManager;
  window.SizeControlManager = SizeControlManager;
  window.CustomPaletteManager = CustomPaletteManager;
};

// DOMContentLoaded 체크 및 실행
if (document.readyState === 'loading') {
  window.addEventListener('DOMContentLoaded', initializeApp);
} else {
  initializeApp();
}
