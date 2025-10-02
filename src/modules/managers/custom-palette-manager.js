/* ==============================
  ?렓 而ㅼ뒪? ?붾젅??愿由ъ옄
  ============================== */

export 
  const CustomPaletteManager = {
    CUSTOM_PALETTE_NAME: 'custom',
    _domCache: { lightInputs: {}, darkInputs: {}, resetBtn: null, testButtons: null },
    currentPalette: { name: 'custom' },
    
/* ==============================
  🌈 3D 색상 선택기 모듈
  ============================== */

      CustomColorPicker: {
      // 통합 색구체 상태 사용 (별도 상태 제거)
      get sphereState() {
        return Mechanics.UnifiedSphereState;
      },
      
      // ========================================
      // 🚀 초기화 시스템
      // ========================================
      
      init() {
        console.log('  ├─ [CustomColorPicker] 초기화 시작');
        this.generateLightThemePickers();
        console.log('    ✅ Light 테마 피커 생성');
        this.generateDarkThemePickers();
        console.log('    ✅ Dark 테마 피커 생성');
        this.setupColorDisplays();
        console.log('    ✅ 컬러 디스플레이 설정');
        this.setup3DCanvasInteraction();
        console.log('    ✅ 3D 캔버스 인터랙션 설정');
        this.setupHexInputs();
        console.log('    ✅ Hex 입력 설정');
      },
      
      // ========================================
      // 🎨 UI 생성 시스템
      // ========================================
      
      generateLightThemePickers() {
        const lightContainer = document.getElementById('light-color-pickers');
        if (!lightContainer) {
          console.warn('⚠️ [CustomColorPicker] light-color-pickers 요소를 찾을 수 없음');
          return;
        }
        console.log('    ├─ light-color-pickers 찾음:', lightContainer);
        
        const lightPickers = [
          { id: 'light-content-default', label: '콘텐츠(기본)', color: 'rgba(255, 255, 255, 1)', hex: '#FFFFFFFF', hue: 0, alpha: 255 },
          { id: 'light-content-pressed', label: '콘텐츠(눌림)', color: 'rgba(140, 83, 44, 1)', hex: '#8C532CFF', hue: 25, alpha: 255 },
          { id: 'light-content-disabled', label: '콘텐츠(비활성)', color: 'rgba(140, 83, 44, 1)', hex: '#8C532CFF', hue: 25, alpha: 255 },
          { id: 'light-background-default', label: '배경(기본)', color: 'rgba(164, 105, 63, 1)', hex: '#A4693FFF', hue: 25, alpha: 255 },
          { id: 'light-background-pressed', label: '배경(눌림)', color: 'rgba(238, 220, 210, 1)', hex: '#EEDCD2FF', hue: 25, alpha: 255 },
          { id: 'light-background-disabled', label: '배경(비활성)', color: 'transparent', hex: '#00000000', hue: 0, alpha: 0 },
          { id: 'light-border-default', label: '테두리(기본)', color: 'rgba(164, 105, 63, 1)', hex: '#A4693FFF', hue: 25, alpha: 255 },
          { id: 'light-border-pressed', label: '테두리(눌림)', color: 'rgba(140, 83, 44, 1)', hex: '#8C532CFF', hue: 25, alpha: 255 },
          { id: 'light-border-disabled', label: '테두리(비활성)', color: 'rgba(140, 83, 44, 1)', hex: '#8C532CFF', hue: 25, alpha: 255 }
        ];
        
        lightPickers.forEach(picker => {
          const html = `
            <div class="palette-input-group">
              <label for="${picker.id}">${picker.label}:</label>
              <div class="custom-color-picker" data-target="${picker.id}">
                <div class="color-display" style="background: ${picker.color}"></div>
                <div class="color-picker-panel">
                  <!-- 색상구체 캔버스 -->
                  <canvas id="color-sphere-canvas" class="color-canvas-3d" width="400" height="400" aria-label="3D 색상 구체 선택기"></canvas>
                  
                  <!-- 색상 정보 표시 -->
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
                    
                    <!-- 확대/축소 컨트롤 -->
                    <div class="picker-zoom-controls">
                      <h3>구체 크기 조절</h3>
                      <div class="scaling zoom">
                        <label for="zoom-slider">확대/축소:</label>
                        <input 
                          type="range" 
                          id="zoom-slider" 
                          min="0.1" 
                          max="3.0" 
                          step="0.1" 
                          value="1.0"
                          aria-label="색상 구체 확대/축소 (10% ~ 300%)"
                        >
                        <span class="size value zoom-value">100%</span>
                      </div>
                    </div>
                    
                    <!-- 색상 코드 입력 -->
                  <div class="picker-color-input-group">
                    <label>색상 코드</label>
                    <input type="text" class="panel-hex-input" value="${picker.hex}" maxlength="9" placeholder="#RRGGBBAA">
                  </div>
                    
                    <!-- 구체 정보 -->
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
        if (!darkContainer) return;
        
        const darkPickers = [
          { id: 'dark-content-default', label: '콘텐츠(기본)', color: 'rgba(0, 0, 0, 1)', hex: '#000000FF', hue: 0, alpha: 255 },
          { id: 'dark-content-pressed', label: '콘텐츠(눌림)', color: 'rgba(255, 239, 128, 1)', hex: '#FFEF80FF', hue: 54, alpha: 255 },
          { id: 'dark-content-disabled', label: '콘텐츠(비활성)', color: 'rgba(255, 225, 0, 1)', hex: '#FFE100FF', hue: 54, alpha: 255 },
          { id: 'dark-background-default', label: '배경(기본)', color: 'rgba(255, 225, 0, 1)', hex: '#FFE100FF', hue: 54, alpha: 255 },
          { id: 'dark-background-pressed', label: '배경(눌림)', color: 'rgba(36, 31, 0, 1)', hex: '#241F00FF', hue: 54, alpha: 255 },
          { id: 'dark-background-disabled', label: '배경(비활성)', color: 'transparent', hex: '#00000000', hue: 0, alpha: 0 },
          { id: 'dark-border-default', label: '테두리(기본)', color: 'rgba(255, 225, 0, 1)', hex: '#FFE100FF', hue: 54, alpha: 255 },
          { id: 'dark-border-pressed', label: '테두리(눌림)', color: 'rgba(255, 239, 128, 1)', hex: '#FFEF80FF', hue: 54, alpha: 255 },
          { id: 'dark-border-disabled', label: '테두리(비활성)', color: 'rgba(255, 225, 0, 1)', hex: '#FFE100FF', hue: 54, alpha: 255 }
        ];
        
        darkPickers.forEach(picker => {
          const html = `
            <div class="palette-input-group">
              <label for="${picker.id}">${picker.label}:</label>
              <div class="custom-color-picker" data-target="${picker.id}">
                <div class="color-display" style="background: ${picker.color}"></div>
                <div class="color-picker-panel">
                  <!-- 색상구체 캔버스 -->
                  <canvas id="color-sphere-canvas" class="color-canvas-3d" width="400" height="400" aria-label="3D 색상 구체 선택기"></canvas>
                  
                  <!-- 색상 정보 표시 -->
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
                    
                    <!-- 확대/축소 컨트롤 -->
                    <div class="picker-zoom-controls">
                      <h3>구체 크기 조절</h3>
                      <div class="scaling zoom">
                        <label for="zoom-slider">확대/축소:</label>
                        <input 
                          type="range" 
                          id="zoom-slider" 
                          min="0.1" 
                          max="3.0" 
                          step="0.1" 
                          value="1.0"
                          aria-label="색상 구체 확대/축소 (10% ~ 300%)"
                        >
                        <span class="size value zoom-value">100%</span>
                      </div>
                    </div>
                    
                    <!-- 색상 코드 입력 -->
                  <div class="picker-color-input-group">
                    <label>색상 코드</label>
                    <input type="text" class="panel-hex-input" value="${picker.hex}" maxlength="9" placeholder="#RRGGBBAA">
                  </div>
                    
                    <!-- 구체 정보 -->
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
      },
      
      // ========================================
      // 🎛️ 상호작용 설정 시스템
      // ========================================
      
      setupColorDisplays() {
        document.querySelectorAll('.color-display').forEach(display => {
          display.addEventListener('click', (e) => {
            const picker = e.target.closest('.custom-color-picker');
            const panel = picker.querySelector('.color-picker-panel');
            
            // 다른 패널들 닫기
            document.querySelectorAll('.color-picker-panel').forEach(p => p.classList.remove('active'));
            
            // 현재 패널 토글
            panel.classList.toggle('active');
            
            if (panel.classList.contains('active')) {
              // 3D 캔버스 초기화 후 색상 이동
              this.initialize3DCanvas(picker);
              
              // 팔레트 열릴 때 현재 입력값에 해당하는 색상을 중심점으로 이동
              const hexInput = picker.parentElement.querySelector('.hex-input');
              if (hexInput && hexInput.value) {
                const hexValue = hexInput.value.replace('#', '').toUpperCase();
                
                // 8자리 헥스코드만 확인 (완전 입력시에만)
                if (hexValue.length === 8 && /^[0-9A-F]{8}$/.test(hexValue)) {
                  // RGBA 직접 생성 (파싱 오버헤드 없음)
                  const r = parseInt(hexValue.substr(0, 2), 16);
                  const g = parseInt(hexValue.substr(2, 2), 16);
                  const b = parseInt(hexValue.substr(4, 2), 16);
                  
                  // 캔버스 초기화 완료 후 색상 이동 (입력값 변경 없이 구체만 회전)

                }
              }
            }
          });
        });
        
        // 외부 클릭 시 패널 닫기
        document.addEventListener('click', (e) => {
          if (!e.target.closest('.custom-color-picker')) {
            document.querySelectorAll('.color-picker-panel').forEach(panel => {
              panel.classList.remove('active');
            });
          }
        });
      },
      
      initialize3DCanvas(picker) {
        const canvas3D = picker.querySelector('.color-canvas-3d');
        if (canvas3D) {
          // 통합 색구체 상태로 초기화
          const ctx = canvas3D.getContext('2d');
          ctx.clearRect(0, 0, canvas3D.width, canvas3D.height);
          
          // 구체 렌더링
          Mechanics.RenderColorSphere(ctx, Mechanics.UnifiedSphereState);
          
          // 통합 상태로 인터랙션 설정
          Mechanics.setupCanvasInteraction(
            canvas3D, 
            Mechanics.UnifiedSphereState, 
            (canvas) => this.updateCenterColorRealtime(canvas)
          );
        }
      },
      
      setup3DCanvasInteraction() {
        // 통합 색구체 상태로 상호작용 설정
        const handleCanvasSetup = (canvas) => {
          Mechanics.setupCanvasInteraction(
            canvas, 
            Mechanics.UnifiedSphereState, 
            (canvas) => this.updateCenterColorRealtime(canvas)
          );
        };
        
        // 3D 구체에서 색상 선택 (쿼터니언 기반)
        const selectColorAt3D = (e, canvas) => {
          const rect = canvas.getBoundingClientRect();
          const x = e.clientX - rect.left;
          const y = e.clientY - rect.top;
          const centerX = rect.width / 2;
          const centerY = rect.height / 2;
          const radius = (Math.min(rect.width, rect.height) / 2 - 20) * this.sphereState.zoom;
          
          const dx = x - centerX;
          const dy = y - centerY;
          const distance = Math.sqrt(dx * dx + dy * dy);
          
          if (distance <= radius) {
            // 3D 구체 좌표 (음영 효과는 없지만 구조는 3D)
            const screenX = dx / radius;
            const screenY = dy / radius;
            const screenZ = Math.sqrt(Math.max(0, 1 - screenX * screenX - screenY * screenY));  // 3D 구체 곡면
            
            // 쿼터니언으로 회전 적용 (통합 상태 사용)
            const rotatedVector = Mechanics.rotateVector(Mechanics.UnifiedSphereState.Q, [screenX, screenY, screenZ]);
            const [rotatedX, rotatedY, rotatedZ] = rotatedVector;
            
            // 구면 좌표로 변환
            const phi = Math.atan2(rotatedY, rotatedX);
            const theta = Math.acos(Math.max(-1, Math.min(1, rotatedZ)));
            
            // 직접 RGB 헥스코드 스케일링 (캘리브레이션)
            let hue = ((phi + Math.PI) / (2 * Math.PI)) * 360;  // 0-360도
            if (hue >= 360) hue = 0;
            
            const radialFactor = distance / radius;  // 0~1
            const lightnessRatio = ((Math.PI - theta) / Math.PI); // 0(남극)~1(북극)
                      // SphericalSystem 모듈 사용 (통합된 색상 계산)
          const color = Topology.calculateColor(theta, phi);
          const { r, g, b } = color;
            
            // 8자리 헥스코드로 직접 처리 (통합 상태 사용)
            Mechanics.UnifiedSphereState.selectedColor = { r, g, b, hue };
            
            const picker = canvas.closest('.custom-color-picker');
            const targetId = picker.dataset.target;
            const panelHexInput = picker.querySelector('.panel-hex-input');
            
            // 현재 알파값 유지
            let alpha = 255;
            if (panelHexInput && panelHexInput.value) {
              const currentHex = panelHexInput.value.replace('#', '');
              if (currentHex.length === 8) {
                alpha = parseInt(currentHex.substr(6, 2), 16);
              }
            }
            
            const rgb = { r, g, b };
            const hexColor = ColorConverter.rgbaToHex(r, g, b, alpha);
            
            this.updateColorInputs(targetId, rgb, alpha, hexColor);
          this.updateSelectedColorInfo(rgb, alpha, hexColor);
            this.updateSelectedColorInfo(rgb, alpha, hexColor);
            
            // 구체 다시 그리기 (선택점 업데이트, 투명도 반영) - 통합 상태 사용 (렌더링은 setupCanvasInteraction에서 처리)
          }
        };
        
        this.selectColorAt3D = selectColorAt3D;
        

        
        // 뷰포트 중심점 색상 실시간 업데이트
        this.updateCenterColorRealtime = (canvas) => {
          // 화면 중심점 (0, 0, 1) 3D 구체 표면
          const screenX = 0;  // 중심점
          const screenY = 0;  // 중심점  
          const screenZ = 1;  // 구체 표면 (z = 1)
          
          // 쿼터니언으로 회전 적용 (통합 상태 사용)
          const rotatedVector = Mechanics.rotateVector(Mechanics.UnifiedSphereState.Q, [screenX, screenY, screenZ]);
          const [rotatedX, rotatedY, rotatedZ] = rotatedVector;
          
          // 3D 좌표를 구면 좌표로 변환
          const phi = Math.atan2(rotatedY, rotatedX);  // 경도 (-π ~ π)
          const theta = Math.acos(Math.max(-1, Math.min(1, rotatedZ)));  // 위도 (0 ~ π)

          // 렌더링과 동일한 색상 계산 사용
          const color = Topology.calculateColor(theta, phi);
          const { r, g, b } = color;
          
          // 8자리 헥스코드로 직접 처리 (통합 상태 사용)
          Mechanics.UnifiedSphereState.selectedColor = { r, g, b };
          
          // 컬러피커 구체도 회전 상태 동기화 (렌더링은 setupCanvasInteraction에서 처리)
          
          const picker = canvas.closest('.custom-color-picker');
          if (!picker) return;
          
          const targetId = picker.dataset.target;
          const panelHexInput = picker.querySelector('.panel-hex-input');
          
          // 현재 알파값 유지
          let alpha = 255;
          if (panelHexInput && panelHexInput.value) {
            const currentHex = panelHexInput.value.replace('#', '');
            if (currentHex.length === 8) {
              alpha = parseInt(currentHex.substr(6, 2), 16);
            }
          }
          
          const rgb = { r, g, b };
          const hexColor = ColorConverter.rgbaToHex(r, g, b, alpha);
          
          // UI 업데이트 (드래그 시 실시간 입력값 변경)
          requestAnimationFrame(() => {
            this.updateColorInputs(targetId, rgb, alpha, hexColor);
          this.updateSelectedColorInfo(rgb, alpha, hexColor);
            this.updateSelectedColorInfo(rgb, alpha, hexColor);
          });
        };
        
        // 2D 캔버스 색상 선택
        const handle2DColorSelect = (e, canvas) => {
          const rect = canvas.getBoundingClientRect();
          const x = e.clientX - rect.left;
          const y = e.clientY - rect.top;
          const saturation = Math.max(0, Math.min(100, (x / rect.width) * 100));
          const value = Math.max(0, Math.min(100, (1 - y / rect.height) * 100));
          
          const picker = canvas.closest('.custom-color-picker');
          const hueSlider = picker.querySelector('.hue-slider');
          const alphaSlider = picker.querySelector('.alpha-slider');
          const targetId = picker.dataset.target;
          
          const hue = parseInt(hueSlider?.value || 0);
          const alpha = parseInt(alphaSlider?.value || 255);
          const rgb = ColorConverter.hsvToRgb(hue, saturation, value);
          const hexColor = ColorConverter.rgbaToHex(rgb.r, rgb.g, rgb.b, alpha);
          
          this.updateColorInputs(targetId, rgb, alpha, hexColor);
          this.updateSelectedColorInfo(rgb, alpha, hexColor);
        };
        
        document.querySelectorAll('.color-canvas-3d').forEach(canvas => {
          handleCanvasSetup(canvas);
          
          // 휠 이벤트 (알파 조절)
          canvas.addEventListener('wheel', (e) => {
            e.preventDefault();
            e.stopPropagation();
            
            const picker = canvas.closest('.custom-color-picker');
            const panelHexInput = picker.querySelector('.panel-hex-input');
            
            if (panelHexInput) {
              const currentHex = panelHexInput.value.replace('#', '');
              let currentAlpha = 255;
              
              // 알파값이 없으면 예외 발생
              if (!currentHex || currentHex.length < 6) {
                throw new Error('유효하지 않은 헥스 색상입니다');
              }
              
              // 현재 알파값 추출 (8자리 hex인 경우)
              if (currentHex.length === 8) {
                currentAlpha = parseInt(currentHex.substr(6, 2), 16);
              } else if (currentHex.length === 6) {
                currentAlpha = 255;
              }
              
              // 휠 업: 알파 증가, 휠 다운: 알파 감소 (±4씩)
              const alphaChange = e.deltaY > 0 ? -4 : 4;
              const newAlpha = Math.max(0, Math.min(255, currentAlpha + alphaChange));
              
              // 현재 색상에 새 알파 적용
              if (currentHex.length >= 6) {
                const rgb = currentHex.substr(0, 6);
                const newHex = '#' + rgb + newAlpha.toString(16).padStart(2, '0').toUpperCase();
                
                const targetId = picker.dataset.target;
                const r = parseInt(rgb.substr(0, 2), 16);
                const g = parseInt(rgb.substr(2, 2), 16);
                const b = parseInt(rgb.substr(4, 2), 16);
                
                this.updateColorInputs(targetId, {r, g, b}, newAlpha, newHex);
                
                // 투명도 변화 후 업데이트 (성능 최적화)
                setTimeout(() => {
                  if (window.ButtonSystem && window.ButtonSystem.StyleManager) {
                    window.ButtonSystem.StyleManager.scheduleUpdate();
                  }
                }, 100);
              }
            }
          });
        });
      },
      
      // ========================================
      // 📝 입력 처리 시스템
      // ========================================
      
      setupHexInputs() {
        // 패널 내 Hex 입력 - 8자리 헥스코드 처리
        document.querySelectorAll('.panel-hex-input').forEach(hexInput => {
          hexInput.addEventListener('input', (e) => {
            const hexValue = e.target.value.replace('#', '').toUpperCase();
            
            // 8자리 헥스코드만 검증 (#RRGGBBAA 완전 입력시에만)
            if (hexValue.length === 8 && /^[0-9A-F]{8}$/.test(hexValue)) {
              // RGBA 직접 생성 (파싱 오버헤드 없음)
              const r = parseInt(hexValue.substr(0, 2), 16);
              const g = parseInt(hexValue.substr(2, 2), 16);
              const b = parseInt(hexValue.substr(4, 2), 16);
              const a = parseInt(hexValue.substr(6, 2), 16); // 8자리에서 알파값 추출
              
              const picker = e.target.closest('.custom-color-picker');
              const targetId = picker.dataset.target;
              const fullHex = '#' + hexValue; // 8자리 그대로 사용
              
              // 색상 업데이트 (슬라이더 없음)
              
              // 3D 캔버스 업데이트
              const canvas3d = picker.querySelector('.color-canvas-3d');
              if (canvas3d) {
                const ctx3d = canvas3d.getContext('2d');
                Mechanics.RenderColorSphere(ctx3d, canvas3d.className);
              }
              
              // CSS 변수 및 UI 업데이트
              this.updateColorInputs(targetId, {r, g, b}, a, fullHex);
              
              // 선택된 색상 정보 업데이트
              this.updateSelectedColorInfo({r, g, b}, a, fullHex);

            }
          });
        });
            },
      
      // ========================================
      // 🔄 상태 업데이트 시스템
      // ========================================
      
      updateSelectedColorInfo(rgb, alpha, hexColor) {
        // 선택된 색상 미리보기 업데이트 (모든 color-picker-panel 내의 preview)
        document.querySelectorAll('.color-picker-panel .picker-color-preview').forEach(preview => {
          preview.style.background = hexColor;
        });
        
        // 선택된 색상 미리보기 업데이트 (index.html의 정적 요소)
        const colorPreview = document.getElementById('selected-color-preview');
        if (colorPreview) {
          colorPreview.style.background = hexColor;
        }
        
        // 색상 정보 텍스트 업데이트 (모든 color-picker-panel 내의 요소들)
        document.querySelectorAll('.color-picker-panel #selected-color-hex').forEach(hex => {
          hex.textContent = hexColor;
        });
        document.querySelectorAll('.color-picker-panel #selected-color-rgb').forEach(rgbEl => {
          rgbEl.textContent = `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`;
        });
        document.querySelectorAll('.color-picker-panel #selected-color-hsl').forEach(hslEl => {
          const hslValue = ColorConverter.rgbToHsl(rgb.r, rgb.g, rgb.b);
          hslEl.textContent = `hsl(${Math.round(hslValue.h)}, ${Math.round(hslValue.s)}%, ${Math.round(hslValue.l)}%)`;
        });
        
        // index.html의 정적 요소들도 업데이트
        const colorHex = document.getElementById('selected-color-hex');
        const colorRgb = document.getElementById('selected-color-rgb');
        const colorHsl = document.getElementById('selected-color-hsl');
        
        if (colorHex) colorHex.textContent = hexColor;
        if (colorRgb) colorRgb.textContent = `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`;
        if (colorHsl) {
          const hsl = ColorConverter.rgbToHsl(rgb.r, rgb.g, rgb.b);
          colorHsl.textContent = `hsl(${Math.round(hsl.h)}, ${Math.round(hsl.s)}%, ${Math.round(hsl.l)}%)`;
        }
      },
      
      updateColorInputs(targetId, rgb, alpha, hexColor) {
        const picker = document.querySelector(`[data-target="${targetId}"]`);
        const hexInput = picker?.parentElement?.querySelector('.hex-input');
        const panelHexInput = picker?.querySelector('.panel-hex-input');
        const display = picker?.querySelector('.color-display');
        
        // 외부 hex 입력 업데이트
        if (hexInput) hexInput.value = hexColor;
        
        // 패널 내 hex 입력 업데이트
        if (panelHexInput) panelHexInput.value = hexColor;
        
        // 선택된 색상 정보는 updateSelectedColorInfo에서 처리
        
        // 컬러 디스플레이 업데이트
        if (display) display.style.background = hexColor;
        
        // 실시간 CSS 변수 업데이트
        this.updateCSSVariable(targetId, hexColor);
        
        // 버튼 적용 및 업데이트
        if (typeof CustomPaletteManager !== 'undefined') {
          CustomPaletteManager.generateAndApplyPalette();
        }
      },
      
      updateCSSVariable(inputId, hexColor) {
        const root = document.documentElement;
        
        // input ID를 CSS 변수명으로 매핑 (Light + Dark)
        const variableMap = {
          // Light 테마
          'light-content-default': '--custom-content-color-default',
          'light-content-pressed': '--custom-content-color-pressed',
          'light-content-disabled': '--custom-content-color-disabled',
          'light-background-default': '--custom-background-color-default',
          'light-background-pressed': '--custom-background-color-pressed',
          'light-background-disabled': '--custom-background-color-disabled',
          'light-border-default': '--custom-border-color-default',
          'light-border-pressed': '--custom-border-color-pressed',
          'light-border-disabled': '--custom-border-color-disabled',
          // Dark 테마 (별도 CSS 주입 필요)
          'dark-content-default': '--custom-content-color-default',
          'dark-content-pressed': '--custom-content-color-pressed',
          'dark-content-disabled': '--custom-content-color-disabled',
          'dark-background-default': '--custom-background-color-default',
          'dark-background-pressed': '--custom-background-color-pressed',
          'dark-background-disabled': '--custom-background-color-disabled',
          'dark-border-default': '--custom-border-color-default',
          'dark-border-pressed': '--custom-border-color-pressed',
          'dark-border-disabled': '--custom-border-color-disabled'
        };
        
        const cssVariable = variableMap[inputId];
        if (cssVariable) {
          if (inputId.startsWith('light-')) {
            // Light 테마: root에 직접 적용
            root.style.setProperty(cssVariable, hexColor);
          } else if (inputId.startsWith('dark-')) {
            // Dark 테마: .dark 클래스에 적용 (CSS 주입)
            AppUtils.CSSInjector.inject('custom-dark-variable', `.dark { ${cssVariable}: ${hexColor}; }`, 'Dark 커스텀 변수');
          }
          
          // CSS 변수 업데이트 후 업데이트 (성능 최적화)
          setTimeout(() => {
            if (window.ButtonSystem && window.ButtonSystem.StyleManager) {
              window.ButtonSystem.StyleManager.scheduleUpdate();
            }
          }, 100);
        }
      },
    },
    
    init() {
      console.log('🎨 [CustomPaletteManager] 초기화 시작');
      this._initDOMCache();
      
      // CustomColorPicker는 즉시 초기화 (파레트 버튼 생성)
      console.log('  ├─ CustomColorPicker 초기화 중...');
      this.CustomColorPicker.init();
      console.log('  ✅ CustomColorPicker 초기화 완료');
      
      // 동적 생성 완료 후 DOM 캐시 업데이트 (더 긴 대기 시간)
      setTimeout(() => {
        this._updateDynamicDOMCache();
        this.setupEventListeners();
        this.generateAndApplyPalette();
      }, 500); // 200ms → 500ms로 증가
    },
    
    _initDOMCache() {
      // 정적 요소들만 먼저 캐시
      this._domCache.resetBtn = document.querySelector('.palette-reset-btn');
      this._domCache.testButtons = document.querySelectorAll('.button.custom');
      
      // 동적 생성 요소들은 나중에 캐시
      this._domCache.lightInputs = {};
      this._domCache.darkInputs = {};
    },
    
    // 동적 생성된 요소들을 캐시하는 메서드
    _updateDynamicDOMCache() {
      this._domCache.lightInputs = {
        contentDefault: document.querySelector('[data-target="light-content-default"]')?.parentElement?.querySelector('.hex-input'),
        contentPressed: document.querySelector('[data-target="light-content-pressed"]')?.parentElement?.querySelector('.hex-input'),
        contentDisabled: document.querySelector('[data-target="light-content-disabled"]')?.parentElement?.querySelector('.hex-input'),
        backgroundDefault: document.querySelector('[data-target="light-background-default"]')?.parentElement?.querySelector('.hex-input'),
        backgroundPressed: document.querySelector('[data-target="light-background-pressed"]')?.parentElement?.querySelector('.hex-input'),
        backgroundDisabled: document.querySelector('[data-target="light-background-disabled"]')?.parentElement?.querySelector('.hex-input'),
        borderDefault: document.querySelector('[data-target="light-border-default"]')?.parentElement?.querySelector('.hex-input'),
        borderPressed: document.querySelector('[data-target="light-border-pressed"]')?.parentElement?.querySelector('.hex-input'),
        borderDisabled: document.querySelector('[data-target="light-border-disabled"]')?.parentElement?.querySelector('.hex-input')
      };
      this._domCache.darkInputs = {
        contentDefault: document.querySelector('[data-target="dark-content-default"]')?.parentElement?.querySelector('.hex-input'),
        contentPressed: document.querySelector('[data-target="dark-content-pressed"]')?.parentElement?.querySelector('.hex-input'),
        contentDisabled: document.querySelector('[data-target="dark-content-disabled"]')?.parentElement?.querySelector('.hex-input'),
        backgroundDefault: document.querySelector('[data-target="dark-background-default"]')?.parentElement?.querySelector('.hex-input'),
        backgroundPressed: document.querySelector('[data-target="dark-background-pressed"]')?.parentElement?.querySelector('.hex-input'),
        backgroundDisabled: document.querySelector('[data-target="dark-background-disabled"]')?.parentElement?.querySelector('.hex-input'),
        borderDefault: document.querySelector('[data-target="dark-border-default"]')?.parentElement?.querySelector('.hex-input'),
        borderPressed: document.querySelector('[data-target="dark-border-pressed"]')?.parentElement?.querySelector('.hex-input'),
        borderDisabled: document.querySelector('[data-target="dark-border-disabled"]')?.parentElement?.querySelector('.hex-input')
      };
    },
    
    setupEventListeners() {
      Object.entries(this._domCache.lightInputs).forEach(([key, input]) => {
        if (input) {
          input.addEventListener('input', () => {
            this.generateAndApplyPalette(); // 즉시 실시간 적용!
          });
        }
      });
      Object.entries(this._domCache.darkInputs).forEach(([key, input]) => {
        if (input) {
          input.addEventListener('input', () => {
            this.generateAndApplyPalette(); // 즉시 실시간 적용!
          });
        }
      });
      document.querySelectorAll('.hex-input').forEach(hexInput => {
        hexInput.addEventListener('input', (e) => {
          const colorInput = e.target.previousElementSibling;
          if (colorInput && colorInput.type === 'color') {
            const hexValue = e.target.value.replace('#', '').substring(0, 6);
            if (hexValue.length === 6) {
              colorInput.value = '#' + hexValue;
              this.updatePreview();
              this.generateAndApplyPalette(); // 즉시 실시간 적용!
            }
          }
        });
      });
      document.querySelectorAll('input[type="color"]').forEach(colorInput => {
        colorInput.addEventListener('input', (e) => {
          const hexInput = e.target.nextElementSibling;
          if (hexInput && hexInput.classList.contains('hex-input')) {
            const alpha = e.target.id.includes('disabled') && e.target.id.includes('background') ? '00' : 'FF';
            hexInput.value = e.target.value + alpha;
            this.generateAndApplyPalette(); // 즉시 실시간 적용!
          }
        });
      });
      if (this._domCache.resetBtn) {
        this._domCache.resetBtn.addEventListener('click', () => {
          this.resetToDefaults();
        });
      }
    },
    
    
    generateAndApplyPalette() {
      const root = document.documentElement;
      
      // Light 테마 CSS 변수 업데이트 (9개)
      const lightMappings = {
        'contentDefault': '--custom-content-color-default',
        'contentPressed': '--custom-content-color-pressed', 
        'contentDisabled': '--custom-content-color-disabled',
        'backgroundDefault': '--custom-background-color-default',
        'backgroundPressed': '--custom-background-color-pressed',
        'backgroundDisabled': '--custom-background-color-disabled',
        'borderDefault': '--custom-border-color-default',
        'borderPressed': '--custom-border-color-pressed',
        'borderDisabled': '--custom-border-color-disabled'
      };
      
      Object.entries(lightMappings).forEach(([inputKey, cssVar]) => {
        const input = this._domCache.lightInputs[inputKey];
        if (input?.nextElementSibling?.value) {
          root.style.setProperty(cssVar, input.nextElementSibling.value);
        }
      });
      
      // Dark 테마 CSS 변수 업데이트 (9개) - 별도 스타일 시트 필요
      const darkMappings = {
        'contentDefault': '--custom-content-color-default',
        'contentPressed': '--custom-content-color-pressed',
        'contentDisabled': '--custom-content-color-disabled', 
        'backgroundDefault': '--custom-background-color-default',
        'backgroundPressed': '--custom-background-color-pressed',
        'backgroundDisabled': '--custom-background-color-disabled',
        'borderDefault': '--custom-border-color-default',
        'borderPressed': '--custom-border-color-pressed',
        'borderDisabled': '--custom-border-color-disabled'
      };
      
      let darkCSS = '';
      Object.entries(darkMappings).forEach(([inputKey, cssVar]) => {
        const input = this._domCache.darkInputs[inputKey];
        if (input?.nextElementSibling?.value) {
          darkCSS += `  ${cssVar}: ${input.nextElementSibling.value};\n`;
        }
      });
      
      if (darkCSS) {
        AppUtils.CSSInjector.inject('custom-dark-theme', `.dark {\n${darkCSS}}`, 'Dark 테마 커스텀 변수');
      }
      
      this.applyToTestButtons();
      
      // 커스텀 팔레트 변경 후 강제 업데이트 (성능 최적화)
      setTimeout(() => {
        if (window.ButtonSystem && window.ButtonSystem.StyleManager) {
          window.ButtonSystem.StyleManager.scheduleUpdate();
        }
      }, 200);
    },
    
    applyToTestButtons() {
      const paletteName = this.CUSTOM_PALETTE_NAME;
      this._domCache.testButtons.forEach(button => {
        const classList = Array.from(button.classList);
        const excludedClasses = ['button', 'pressed', 'toggle', 'dynamic'];
        const oldPalette = classList.find(cls => !excludedClasses.includes(cls));
        if (oldPalette && oldPalette !== paletteName) {
          button.classList.remove(oldPalette);
        }
        if (!button.classList.contains(paletteName)) {
          button.classList.add(paletteName);
        }
      });
    },
    
    resetToDefaults() {
      // 동적 생성된 DOM 요소들 다시 캐시
      this._updateDynamicDOMCache();
      
      // 현재 테마 상태 확인
      const isDarkTheme = document.documentElement.classList.contains('dark');
      
      // Light 테마 기본값 (Primary1 팔레트 기반)
      const lightDefaults = {
        contentDefault: ['rgba(255, 255, 255, 1)', '#FFFFFFFF'],    // color-gray-14
        contentPressed: ['rgba(140, 83, 44, 1)', '#8C532CFF'],    // color-brown-02
        contentDisabled: ['rgba(140, 83, 44, 1)', '#8C532CFF'],   // color-brown-02
        backgroundDefault: ['rgba(164, 105, 63, 1)', '#A4693FFF'], // color-brown-03
        backgroundPressed: ['rgba(238, 220, 210, 1)', '#EEDCD2FF'], // color-brown-06
        backgroundDisabled: ['transparent', 'transparent'], // transparent
        borderDefault: ['rgba(164, 105, 63, 1)', '#A4693FFF'],     // color-brown-03
        borderPressed: ['rgba(140, 83, 44, 1)', '#8C532CFF'],     // color-brown-02
        borderDisabled: ['rgba(140, 83, 44, 1)', '#8C532CFF']     // color-brown-02
      };
      
      // Dark 테마 기본값 (Primary1 팔레트 기반)
      const darkDefaults = {
        contentDefault: ['rgba(0, 0, 0, 1)', '#000000FF'],    // color-gray-01
        contentPressed: ['rgba(255, 239, 128, 1)', '#FFEF80FF'],    // color-yellow-04
        contentDisabled: ['rgba(255, 225, 0, 1)', '#FFE100FF'],   // color-yellow-03
        backgroundDefault: ['rgba(255, 225, 0, 1)', '#FFE100FF'], // color-yellow-03
        backgroundPressed: ['rgba(36, 31, 0, 1)', '#241F00FF'], // color-yellow-01
        backgroundDisabled: ['transparent', 'transparent'], // transparent
        borderDefault: ['rgba(255, 225, 0, 1)', '#FFE100FF'],     // color-yellow-03
        borderPressed: ['rgba(255, 239, 128, 1)', '#FFEF80FF'],     // color-yellow-04
        borderDisabled: ['rgba(255, 225, 0, 1)', '#FFE100FF']     // color-yellow-03
      };
      
      // 현재 테마에 따라 해당 기본값만 적용
      const currentDefaults = isDarkTheme ? darkDefaults : lightDefaults;
      const inputCache = isDarkTheme ? this._domCache.darkInputs : this._domCache.lightInputs;
      const themePrefix = isDarkTheme ? 'dark' : 'light';
      
      Object.entries(currentDefaults).forEach(([key, [colorValue, hexValue]]) => {
        const input = inputCache[key];
        if (input) {
          input.value = hexValue;
          
          // 3D 색상 선택기 UI 업데이트
          const targetId = `${themePrefix}-${key.replace(/([A-Z])/g, '-$1').toLowerCase()}`;
          const picker = document.querySelector(`[data-target="${targetId}"]`);
          if (picker) {
            const colorDisplay = picker.querySelector('.color-display');
            const panelHexInput = picker.querySelector('.panel-hex-input');
            if (colorDisplay) colorDisplay.style.background = hexValue;
            if (panelHexInput) panelHexInput.value = hexValue;
          }
          
          // CSS 변수 직접 업데이트
          this.CustomColorPicker.updateCSSVariable(targetId, hexValue);
          
          // input 이벤트 강제 트리거
          input.dispatchEvent(new Event('input', { bubbles: true }));
        }
      });
      
      // 3D 구체들을 기본 위치로 초기화
      this.reset3DSpheresToDefaults();
      
      // 강제로 팔레트 적용 및 버튼 업데이트
      this.generateAndApplyPalette();
      
      // 버튼 시스템 강제 업데이트
      if (typeof ButtonSystem !== 'undefined' && ButtonSystem.StyleManager) {
        ButtonSystem.StyleManager.scheduleUpdate();
      }
      
      // DOM 스타일 강제 새로고침
      requestAnimationFrame(() => {
        const customButtons = document.querySelectorAll('.button.custom');
        customButtons.forEach(button => {
          // 강제 리플로우로 스타일 재계산
          button.offsetHeight;
          const background = button.querySelector('.background.dynamic');
          if (background) {
            background.offsetHeight;
          }
        });
      });
    },
    
    // 3D 구체들을 기본 위치로 초기화하는 메서드
    reset3DSpheresToDefaults() {
      // 모든 3D 색상 선택기를 기본 위치로 초기화
      document.querySelectorAll('.color-canvas-3d').forEach((canvas, index) => {
        const picker = canvas.closest('.custom-color-picker');
        if (!picker) return;
        
        const targetId = picker.dataset.target;
        const panelHexInput = picker.querySelector('.panel-hex-input');
        
        if (panelHexInput && panelHexInput.value) {
          const hexValue = panelHexInput.value.replace('#', '').toUpperCase();
          
          // 8자리 헥스코드인 경우에만 처리
          if (hexValue.length === 8 && /^[0-9A-F]{8}$/.test(hexValue)) {
            // RGBA 직접 생성 (파싱 오버헤드 없음)
            const r = parseInt(hexValue.substr(0, 2), 16);
            const g = parseInt(hexValue.substr(2, 2), 16);
            const b = parseInt(hexValue.substr(4, 2), 16);
            
            // 구체 위치 찾기 및 이동 (통합 상태 사용)
            const position = Mechanics.colorToCoordinate('#' + hexValue.substr(0, 6));
            if (position) {
              // 통합 색구체 상태로 직접 회전
              const targetVector = Mechanics.sphericalToCartesian(1, position.theta, position.phi);
              const currentVector = [0, 0, 1]; // 기본 중심점
              
              // 회전 축과 각도 계산
              const axis = [
                currentVector[1] * targetVector[2] - currentVector[2] * targetVector[1],
                currentVector[2] * targetVector[0] - currentVector[0] * targetVector[2],
                currentVector[0] * targetVector[1] - currentVector[1] * targetVector[0]
              ];
              
              const dot = currentVector[0] * targetVector[0] + currentVector[1] * targetVector[1] + currentVector[2] * targetVector[2];
              const angle = Math.acos(Math.max(-1, Math.min(1, dot)));
              
                const normalizedAxis = Mechanics.normalize(axis);
                const targetQ = Mechanics.fromAxisAngle(normalizedAxis, angle);
                
              // 통합 상태로 직접 애니메이션 적용
                setTimeout(() => {
                  Mechanics.animateToQuaternion(
                  Mechanics.UnifiedSphereState, 
                    targetQ, 
                    canvas
                  );
                }, index * 100); // 각 구체마다 100ms씩 지연
            }
          }
        }
      });
      
      // 통합 색구체 상태도 기본값으로 초기화
      Mechanics.UnifiedSphereState.Q = [1, 0, 0, 0];
      Mechanics.UnifiedSphereState.selectedColor = Topology.COORDINATE_SYSTEM.POLAR_COLORS.NORTH_POLE;
    }
  };
