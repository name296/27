/* ==============================
  🎨 아이콘 중앙 관리 시스템
  자동 생성됨 - 직접 수정하지 마세요!
  스크립트: .\scripts\update-icons.ps1
  ============================== */

// 아이콘 경로 정의 (자동 생성됨)
export const iconPaths = {
  'add': 'add.svg',
  'arrow-left': 'arrow-left.svg',
  'arrow-right': 'arrow-right.svg',
  'cancel': 'cancel.svg',
  'contrast': 'contrast.svg',
  'delete': 'delete.svg',
  'done': 'done.svg',
  'exit': 'exit.svg',
  'extention': 'extention.svg',
  'favicon': 'favicon.svg',
  'help': 'help.svg',
  'home': 'home.svg',
  'info': 'info.svg',
  'large': 'large.svg',
  'lowpos': 'lowpos.svg',
  'minus': 'minus.svg',
  'ok': 'ok.svg',
  'order': 'order.svg',
  'pay': 'pay.svg',
  'placeholder': 'placeholder.svg',
  'plus': 'plus.svg',
  'print': 'print.svg',
  'reset': 'reset.svg',
  'restart': 'restart.svg',
  'soldout-large': 'soldout-large.svg',
  'soldout-small': 'soldout-small.svg',
  'step': 'step.svg',
  'takein': 'takein.svg',
  'takeout': 'takeout.svg',
  'time': 'time.svg',
  'toggle': 'toggle.svg',
  'volume': 'volume.svg',
  'warning': 'warning.svg'
};

// 선택자 맵핑 (특수한 경우만 정의, 나머지는 기본 선택자 사용)
export const iconSelectors = {
  default: '.content.icon:not(.pressed)',
  toggle: '.content.icon.pressed',
  contrast: '[data-icon="contrast"]',
  large: '[data-icon="large"]'
};

// 기본 선택자 생성 함수
export function getSelector(iconKey) {
  return iconSelectors[iconKey] || `[data-icon="${iconKey}"]`;
}

// 전체 경로 생성 함수
export function getIconPath(iconKey) {
  const filename = iconPaths[iconKey];
  if (!filename) {
    console.warn(`⚠️ Icon "${iconKey}" not found in iconPaths, using placeholder`);
    return 'svg/icon/placeholder.svg';
  }
  return `svg/icon/${filename}`;
}

// iconMap 생성 함수
export function createIconMap() {
  const map = {};
  
  for (const [key, filename] of Object.entries(iconPaths)) {
    if (key === 'placeholder' && map['default']) continue;
    
    map[key] = {
      path: getIconPath(key),
      selector: getSelector(key)
    };
  }
  
  return map;
}

// 폴백 아이콘
export const fallbackIcon = 'placeholder';

/* ==============================
  📊 메타데이터
  ============================== */
// 총 아이콘 개수: 33
// 생성 일시: 2025-10-02T19:25:45
// 아이콘 목록: add, arrow-left, arrow-right, cancel, contrast, delete, done, exit, extention, favicon, help, home, info, large, lowpos, minus, ok, order, pay, placeholder, plus, print, reset, restart, soldout-large, soldout-small, step, takein, takeout, time, toggle, volume, warning

