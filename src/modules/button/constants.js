/* ==============================
  🔘 버튼 시스템 상수
  ============================== */

export const BUTTON_CONSTANTS = {
  BASE: 0.03125,
  get BACKGROUND_BORDER_RADIUS() { return this.BASE; },
  get BUTTON_BORDER_RADIUS() { return 2 * this.BACKGROUND_BORDER_RADIUS; },
  get BACKGROUND_OUTLINE_WIDTH() { return this.BASE; },
  get BUTTON_PADDING() { return this.BACKGROUND_OUTLINE_WIDTH; },
  get BUTTON_OUTLINE_WIDTH() { return 3 * this.BACKGROUND_OUTLINE_WIDTH; },
  get BUTTON_OUTLINE_OFFSET() { return -1 * this.BACKGROUND_OUTLINE_WIDTH; },
  get SELECTED_ICON_SIZE() { return 4 * this.BASE; }
};

