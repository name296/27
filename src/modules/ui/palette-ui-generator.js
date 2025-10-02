/* ==============================
  🎨 팔레트 UI 생성기
  ============================== */

export const PaletteUIGenerator = {
  generateLightThemePickers() {
    const lightContainer = document.getElementById('light-color-pickers');
    if (!lightContainer) {
      console.warn('⚠️ [PaletteUIGenerator] light-color-pickers 요소를 찾을 수 없음');
      return;
    }
    
    const lightPickers = [
      { id: 'light-content-default', label: '콘텐츠(기본)', color: 'rgba(255, 255, 255, 1)', hex: '#FFFFFFFF' },
      { id: 'light-content-pressed', label: '콘텐츠(눌림)', color: 'rgba(140, 83, 44, 1)', hex: '#8C532CFF' },
      { id: 'light-content-disabled', label: '콘텐츠(비활성)', color: 'rgba(140, 83, 44, 1)', hex: '#8C532CFF' },
      { id: 'light-background-default', label: '배경(기본)', color: 'rgba(164, 105, 63, 1)', hex: '#A4693FFF' },
      { id: 'light-background-pressed', label: '배경(눌림)', color: 'rgba(238, 220, 210, 1)', hex: '#EEDCD2FF' },
      { id: 'light-background-disabled', label: '배경(비활성)', color: 'transparent', hex: '#00000000' },
      { id: 'light-border-default', label: '테두리(기본)', color: 'rgba(164, 105, 63, 1)', hex: '#A4693FFF' },
      { id: 'light-border-pressed', label: '테두리(눌림)', color: 'rgba(140, 83, 44, 1)', hex: '#8C532CFF' },
      { id: 'light-border-disabled', label: '테두리(비활성)', color: 'rgba(140, 83, 44, 1)', hex: '#8C532CFF' }
    ];
    
    lightPickers.forEach(picker => {
      const html = `
        <div class="palette-input-group">
          <label for="${picker.id}">${picker.label}:</label>
          <div class="custom-color-picker" data-target="${picker.id}">
            <div class="color-display" style="background: ${picker.color}"></div>
            <div class="color-picker-panel">
              <canvas id="color-sphere-canvas" class="color-canvas-3d" width="400" height="400" aria-label="3D 색상 구체 선택기"></canvas>
              
              <section class="color-info">
                <div class="picker-color-display">
                  <h3>선택된 색상</h3>
                  <div class="picker-color-preview-container">
                    <div class="picker-color-preview" id="selected-color-preview"></div>
                    <div class="picker-color-details">
                      <p>HEX: <span id="selected-color-hex">#FFFFFF</span></p>
                      <p>RGB: <span id="selected-color-rgb">rgb(255, 255, 255)</span></p>
                      <p>HSL: <span id="selected-color-hsl">hsl(0, 0%, 100%)</span></p>
                    </div>
                  </div>
                </div>
                
                <div class="picker-zoom-controls">
                  <h3>구체 크기 조절</h3>
                  <div class="scaling zoom">
                    <label for="zoom-slider">확대/축소:</label>
                    <input type="range" id="zoom-slider" min="0.1" max="3.0" step="0.1" value="1.0" aria-label="색상 구체 확대/축소 (10% ~ 300%)">
                    <span class="size value zoom-value">100%</span>
                  </div>
                </div>
                
                <div class="picker-color-input-group">
                  <label>색상 코드</label>
                  <input type="text" class="panel-hex-input" value="${picker.hex}" maxlength="9" placeholder="#RRGGBBAA">
                </div>
                
                <div class="picker-sphere-info">
                  <small>🌐 3D 색상 구체 | 드래그: 회전 | 휠: 알파 조절</small>
                </div>
              </section>
            </div>
          </div>
          <input type="text" class="hex-input" value="${picker.hex}">
        </div>
      `;
      lightContainer.innerHTML += html;
    });
  },
  
  generateDarkThemePickers() {
    const darkContainer = document.getElementById('dark-color-pickers');
    if (!darkContainer) {
      console.warn('⚠️ [PaletteUIGenerator] dark-color-pickers 요소를 찾을 수 없음');
      return;
    }
    
    const darkPickers = [
      { id: 'dark-content-default', label: '콘텐츠(기본)', color: 'rgba(0, 0, 0, 1)', hex: '#000000FF' },
      { id: 'dark-content-pressed', label: '콘텐츠(눌림)', color: 'rgba(255, 239, 128, 1)', hex: '#FFEF80FF' },
      { id: 'dark-content-disabled', label: '콘텐츠(비활성)', color: 'rgba(255, 225, 0, 1)', hex: '#FFE100FF' },
      { id: 'dark-background-default', label: '배경(기본)', color: 'rgba(255, 225, 0, 1)', hex: '#FFE100FF' },
      { id: 'dark-background-pressed', label: '배경(눌림)', color: 'rgba(36, 31, 0, 1)', hex: '#241F00FF' },
      { id: 'dark-background-disabled', label: '배경(비활성)', color: 'transparent', hex: '#00000000' },
      { id: 'dark-border-default', label: '테두리(기본)', color: 'rgba(255, 225, 0, 1)', hex: '#FFE100FF' },
      { id: 'dark-border-pressed', label: '테두리(눌림)', color: 'rgba(255, 239, 128, 1)', hex: '#FFEF80FF' },
      { id: 'dark-border-disabled', label: '테두리(비활성)', color: 'rgba(255, 225, 0, 1)', hex: '#FFE100FF' }
    ];
    
    darkPickers.forEach(picker => {
      const html = `
        <div class="palette-input-group">
          <label for="${picker.id}">${picker.label}:</label>
          <div class="custom-color-picker" data-target="${picker.id}">
            <div class="color-display" style="background: ${picker.color}"></div>
            <div class="color-picker-panel">
              <canvas id="color-sphere-canvas" class="color-canvas-3d" width="400" height="400" aria-label="3D 색상 구체 선택기"></canvas>
              
              <section class="color-info">
                <div class="picker-color-display">
                  <h3>선택된 색상</h3>
                  <div class="picker-color-preview-container">
                    <div class="picker-color-preview" id="selected-color-preview"></div>
                    <div class="picker-color-details">
                      <p>HEX: <span id="selected-color-hex">#FFFFFF</span></p>
                      <p>RGB: <span id="selected-color-rgb">rgb(255, 255, 255)</span></p>
                      <p>HSL: <span id="selected-color-hsl">hsl(0, 0%, 100%)</span></p>
                    </div>
                  </div>
                </div>
                
                <div class="picker-zoom-controls">
                  <h3>구체 크기 조절</h3>
                  <div class="scaling zoom">
                    <label for="zoom-slider">확대/축소:</label>
                    <input type="range" id="zoom-slider" min="0.1" max="3.0" step="0.1" value="1.0" aria-label="색상 구체 확대/축소 (10% ~ 300%)">
                    <span class="size value zoom-value">100%</span>
                  </div>
                </div>
                
                <div class="picker-color-input-group">
                  <label>색상 코드</label>
                  <input type="text" class="panel-hex-input" value="${picker.hex}" maxlength="9" placeholder="#RRGGBBAA">
                </div>
                
                <div class="picker-sphere-info">
                  <small>🌐 3D 색상 구체 | 드래그: 회전 | 휠: 알파 조절</small>
                </div>
              </section>
            </div>
          </div>
          <input type="text" class="hex-input" value="${picker.hex}">
        </div>
      `;
      darkContainer.innerHTML += html;
    });
  }
};
