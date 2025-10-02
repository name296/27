/* ==============================
  🎨 색상 구체 UI 컨트롤러
  ============================== */

export const ColorSphereUI = {
  // 확대/축소 슬라이더 설정
  setupZoomSlider(sphereState, canvas) {
    const zoomSlider = document.getElementById('zoom-slider');
    const zoomValue = document.querySelector('.zoom-value');
    
    if (!zoomSlider || !zoomValue) return;
    
    zoomSlider.addEventListener('input', (e) => {
      sphereState.zoom = parseFloat(e.target.value);
      // Mechanics는 window에서 가져옴
      window.Mechanics.RenderColorSphere(canvas.getContext('2d'), sphereState);
      zoomValue.textContent = `${Math.round(sphereState.zoom * 100)}%`;
    });
    
    zoomSlider.value = sphereState.zoom;
    zoomValue.textContent = `${Math.round(sphereState.zoom * 100)}%`;
  },

  // 색상 정보 업데이트 설정
  setupColorInfoUpdate(sphereState, canvas) {
    const colorHex = document.querySelector('.color-hex');
    const colorRgb = document.querySelector('.color-rgb');
    const colorHsl = document.querySelector('.color-hsl');
    
    if (!colorHex || !colorRgb || !colorHsl) return;
    
    const updateColorInfo = () => {
      const hex = `#${sphereState.selectedColor.r.toString(16).padStart(2, '0')}${sphereState.selectedColor.g.toString(16).padStart(2, '0')}${sphereState.selectedColor.b.toString(16).padStart(2, '0')}`.toUpperCase();
      const rgb = `rgb(${sphereState.selectedColor.r}, ${sphereState.selectedColor.g}, ${sphereState.selectedColor.b})`;
      const hslString = `hsl(${Math.round((sphereState.selectedColor.r + sphereState.selectedColor.g + sphereState.selectedColor.b) / 3 * 360 / 255)}, 50%, 50%)`;
      
      colorHex.textContent = hex;
      colorRgb.textContent = rgb;
      colorHsl.textContent = hslString;
    };
    
    updateColorInfo();
    
    setInterval(() => {
      if (sphereState.selectedColor) {
        updateColorInfo();
      }
    }, 100);
  }
};

