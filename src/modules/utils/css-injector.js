/* ==============================
  💉 CSS 인젝터 모듈
  ============================== */

export const CSSInjector = {
  inject(id, content, description = '') {
    const existingStyle = document.getElementById(id);
    if (existingStyle) existingStyle.remove();
    
    const styleElement = document.createElement('style');
    styleElement.id = id;
    styleElement.textContent = content;
    document.head.appendChild(styleElement);
  }
};

