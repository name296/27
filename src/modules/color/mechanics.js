import { Topology } from './topology.js';

export const Mechanics = {
  // ========================================
  // 🌍 전역 통합 색구체 상태
  // ========================================
  
  UnifiedSphereState: {
    dragging: false,
    v0: null,
    Q: [1, 0, 0, 0],  // 북극점 중심 정렬
    last: [0, 0],
    zoom: 1.0,
    selectedColor: { r: 0, g: 0, b: 0 }, // 렌더링 색구체의 표면 중심점 색상과 일치
    isDragging: false
  },

  // ========================================
  // 🚀 초기화 시스템
  // ========================================
  
  // 색구체 초기화 함수 (코드간 의존성 최적화)
  initializeColorSphere(selector = '#color-sphere-canvas', onUpdate = null) {
    const canvas = document.querySelector(selector);
    if (!canvas) return;
    
    // 렌더링 및 인터랙션 설정
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    this.RenderColorSphere(ctx, this.UnifiedSphereState);
    
    // 인터랙션 설정 (코드간 의존성 최적화)
    this.setupCanvasInteraction(canvas, this.UnifiedSphereState, onUpdate);
    
    // 확대/축소 슬라이더 설정 (코드간 의존성 최적화)
    this.setupZoomSlider(this.UnifiedSphereState, canvas);
    
    // 색상 정보 업데이트 설정 (코드간 의존성 최적화)
    this.setupColorInfoUpdate(this.UnifiedSphereState, canvas);
  },

  // 확대/축소 슬라이더 설정 함수 (코드간 의존성 최적화)
  setupZoomSlider(sphereState, canvas) {
    const zoomSlider = document.getElementById('zoom-slider');
    const zoomValue = document.querySelector('.zoom-value');
    
    if (!zoomSlider || !zoomValue) return;
    
    // 슬라이더 이벤트 리스너
    zoomSlider.addEventListener('input', (e) => {
      sphereState.zoom = parseFloat(e.target.value);
      
      // 구체 다시 그리기
      this.RenderColorSphere(canvas.getContext('2d'), sphereState);
      
      // 값 표시 업데이트
      zoomValue.textContent = `${Math.round(sphereState.zoom * 100)}%`;
    });
    
    // 초기값 설정
    zoomSlider.value = sphereState.zoom;
    zoomValue.textContent = `${Math.round(sphereState.zoom * 100)}%`;
  },

  // 색상 정보 업데이트 설정 함수 (코드간 의존성 최적화)
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
    
    // 초기 색상 설정
    updateColorInfo();
    
    // 주기적 업데이트 (100ms마다)
    setInterval(() => {
      if (sphereState.selectedColor) {
        updateColorInfo();
      }
    }, 100);
  },

  // ========================================
  // 🔄 좌표 변환 시스템
  // ========================================
  
  // 직교좌표 → 구면좌표 변환
  cartesianToSpherical(x, y, z) {
    const r = Math.sqrt(x * x + y * y + z * z);
    return { r, theta: Math.acos(Math.max(-1, Math.min(1, z / r))), phi: Math.atan2(y, x) };
  },
  
  // 구면좌표 → 직교좌표 변환
  sphericalToCartesian(r, theta, phi) {
    return { x: r * Math.sin(theta) * Math.cos(phi), y: r * Math.sin(theta) * Math.sin(phi), z: r * Math.cos(theta) };
  },
  
  // 화면좌표 → 구면표면 좌표 변환
  screenToSphericalSurface(screenX, screenY, radius) {
    if (Math.sqrt(screenX * screenX + screenY * screenY) > radius) return null;    
    const cartesian = { x: screenX/radius, y: screenY/radius, z: Math.sqrt(radius * radius - screenX * screenX - screenY * screenY)/radius };
    return { screen: { x: screenX, y: screenY }, cartesian, spherical: this.cartesianToSpherical(cartesian.x, cartesian.y, cartesian.z) };
  },

  // 마우스 클릭 → 구면 좌표
  mouseClickToSphericalCoordinates(screenX, screenY, canvas) {
    const rect = canvas.getBoundingClientRect();
    return this.screenToSphericalSurface(screenX - rect.width / 2, screenY - rect.height / 2, Math.min(rect.width, rect.height) / 2);
  },

  // 색상 → 구면 좌표 변환
  colorToCoordinate(hexColor) {
    for (let theta = 0; theta <= Math.PI; theta += 0.05) {
      for (let phi = -Math.PI; phi <= Math.PI; phi += 0.05) {
        const color = Topology.calculateColor(theta, phi);
        if (chroma.rgb(color.r, color.g, color.b).hex() === chroma(hexColor).hex()) return { theta, phi };
      }
    }
  },

  // ========================================
  // 🔄 회전 시스템
  // ========================================
  normalize(v) {
    const length = Math.sqrt(v.reduce((sum, val) => sum + val * val, 0));
    if (length === 0) throw new Error('영벡터는 정규화할 수 없습니다');
    return v.map(val => val / length);
  },
  
  // 쿼터니언 생성
  fromAxisAngle(axis, angle) {
    const s = Math.sin(angle * 0.5);
    return [axis[0] * s, axis[1] * s, axis[2] * s, Math.cos(angle * 0.5)];
  },
  
  // 쿼터니언 곱셈
  multiply(q1, q2) {
    return [
      q1[3] * q2[0] + q1[0] * q2[3] + q1[1] * q2[2] - q1[2] * q2[1],
      q1[3] * q2[1] - q1[0] * q2[2] + q1[1] * q2[3] + q1[2] * q2[0],
      q1[3] * q2[2] + q1[0] * q2[1] - q1[1] * q2[0] + q1[2] * q2[3],
      q1[3] * q2[3] - q1[0] * q2[0] - q1[1] * q2[1] - q1[2] * q2[2]
    ];
  },
  
  // 쿼터니언으로 벡터 회전
  rotateVector(q, v) {
    return this.multiply(this.multiply(q, [v[0], v[1], v[2], 0]), [-q[0], -q[1], -q[2], q[3]]).slice(0, 3);
  },
  
  // SLERP (구면 선형 보간)
  slerp(q1, q2, t) {
    const dot = q1[0] * q2[0] + q1[1] * q2[1] + q1[2] * q2[2] + q1[3] * q2[3];
    const theta0 = Math.acos(Math.abs(dot));
    const theta = theta0 * t;
    const sinTheta0 = Math.sin(theta0);
    const s0 = Math.cos(theta) - dot * Math.sin(theta) / sinTheta0;
    const s1 = Math.sin(theta) / sinTheta0;
    return [s0 * q1[0] + s1 * q2[0], s0 * q1[1] + s1 * q2[1], s0 * q1[2] + s1 * q2[2], s0 * q1[3] + s1 * q2[3]];
  },
  
  // 드래그 회전 계산
  fromDragRotation(dx, dy, sensitivity = 0.005) {
    return Math.sqrt(dx * dx + dy * dy) * sensitivity < 1e-6 ? [1, 0, 0, 0] : this.fromAxisAngle(this.normalize([dy, -dx, 0]), Math.sqrt(dx * dx + dy * dy) * sensitivity);
  },
  
  // 클릭 회전 계산
  fromClickRotation(screenX, screenY) {
    return Math.sqrt(screenX * screenX + screenY * screenY) * Math.PI * 0.5 < 1e-6 ? [1, 0, 0, 0] : this.fromAxisAngle(this.normalize([screenY, -screenX, 0]), Math.sqrt(screenX * screenX + screenY * screenY) * Math.PI * 0.5);
  },
  
  // ========================================
  // 🎨 구체 표면 렌더링
  // ========================================
  
  // 3D 구체 렌더링 (코드간 의존성 최적화)
  RenderColorSphere(ctx, sphereState) {
    const width = ctx.canvas.width;
    const height = ctx.canvas.height;
    const centerX = width / 2;
    const centerY = height / 2;
    const radius = (Math.min(width, height) / 2 - 20) * sphereState.zoom;
    
    // 캔버스 초기화
    ctx.clearRect(0, 0, width, height);
    
    // 3D 색상구체 렌더링
    const imageData = ctx.createImageData(width, height);
    const data = imageData.data;
    
    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        const dx = x - centerX;
        const dy = y - centerY;
        
        if (dx * dx + dy * dy <= radius * radius) {
          const screenX = dx / radius;
          const screenY = dy / radius;
          const screenZ = Math.sqrt(Math.max(0, 1 - screenX * screenX - screenY * screenY));
          
          const rotatedVector = this.rotateVector(sphereState.Q, [screenX, screenY, screenZ]);
          const color = Topology.calculateColor(Math.acos(Math.max(-1, Math.min(1, rotatedVector[2]))), Math.atan2(rotatedVector[1], rotatedVector[0]));
          
          const index = (y * width + x) * 4;
          data[index] = color.r;
          data[index + 1] = color.g;
          data[index + 2] = color.b;
          data[index + 3] = 255;
        }
      }
    }
    
    ctx.putImageData(imageData, 0, 0);
    
    // 중심점 표시 (변수 의존성 최적화)
    if (sphereState.selectedColor) {
      const { r, g, b } = sphereState.selectedColor;
      ctx.fillStyle = `rgb(${r}, ${g}, ${b})`;
      ctx.beginPath();
      ctx.arc(centerX, centerY, 4, 0, 2 * Math.PI);
      ctx.fill();
      
      // 대비되는 테두리 (변수 의존성 최적화)
      const brightness = (r * 0.299 + g * 0.587 + b * 0.114);
      ctx.strokeStyle = brightness > 127 ? 'rgba(0,0,0,0.8)' : 'rgba(255,255,255,0.8)';
      ctx.lineWidth = 2;
      ctx.stroke();
    }
  },
  
  // ========================================
  // 🎮 상호작용 시스템
  // ========================================
  
  // 3D 캔버스 상호작용 설정 (코드간 의존성 최적화)
  setupCanvasInteraction(canvas, sphereState, onUpdate) {
    let dragStartPos = null;
    let hasDragged = false;
    let ctx = canvas.getContext('2d');
    
    // pointerdown: 드래그 시작
    canvas.addEventListener('pointerdown', (e) => {
      e.preventDefault();
      e.stopPropagation();
      sphereState.dragging = true;
      sphereState.last = [e.clientX, e.clientY];
      sphereState.isDragging = true;
      dragStartPos = [e.clientX, e.clientY];
      hasDragged = false;
      canvas.setPointerCapture(e.pointerId);
      canvas.style.cursor = 'grabbing';
    }, { passive: false });
    
    // 드래그 회전
    canvas.addEventListener('pointermove', (e) => {
      if (!sphereState.dragging) return;
      
      e.preventDefault();
      e.stopPropagation();
      const dx = e.clientX - sphereState.last[0];
      const dy = e.clientY - sphereState.last[1];
      sphereState.last = [e.clientX, e.clientY];
      
      // 드래그 감지
      if (!hasDragged && dragStartPos) {
        if (Math.hypot(e.clientX - dragStartPos[0], e.clientY - dragStartPos[1]) > 3) hasDragged = true;
      }
      
      // 회전 적용
      const dq = this.fromDragRotation(dx, dy, 1 / (0.45 * Math.min(canvas.clientWidth, canvas.clientHeight)));
      
      if (dq[0] !== 1) {
        sphereState.Q = this.multiply(sphereState.Q, dq);
      }
      
      // 중심점 색상 업데이트
      if (onUpdate) onUpdate(canvas);
      
      // 즉시 렌더링
      this.RenderColorSphere(ctx, sphereState);
    });
    
    // pointerup: 드래그 종료
    canvas.addEventListener('pointerup', (e) => {
      e.preventDefault();
      e.stopPropagation();
      sphereState.dragging = false;
      sphereState.isDragging = false;
      canvas.releasePointerCapture(e.pointerId);
      canvas.style.cursor = 'grab';
      
      // 고화질 최종 렌더링
      requestAnimationFrame(() => {
        this.RenderColorSphere(ctx, sphereState);
      });
    });
    
    // 클릭 회전
    canvas.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      if (!hasDragged) {
        const rect = canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        // 클릭한 지점의 3D 좌표 계산
        const coordinates = this.mouseClickToSphericalCoordinates(x, y, canvas);
        if (coordinates) {
          // 클릭한 지점이 중심점이 되도록 회전 계산
          const targetVector = [coordinates.cartesian.x, coordinates.cartesian.y, coordinates.cartesian.z];
          const currentVector = [0, 0, 1]; // 현재 중심점 (북극)
          
          // 회전 축과 각도 계산
          const axis = [
            currentVector[1] * targetVector[2] - currentVector[2] * targetVector[1],
            currentVector[2] * targetVector[0] - currentVector[0] * targetVector[2],
            currentVector[0] * targetVector[1] - currentVector[1] * targetVector[0]
          ];
          
          const angle = Math.acos(Math.max(-1, Math.min(1, currentVector[0] * targetVector[0] + currentVector[1] * targetVector[1] + currentVector[2] * targetVector[2])));
          
          if (angle > 0.01) {
            // 부드러운 애니메이션으로 중심점 이동
            this.animateToQuaternion(sphereState, this.fromAxisAngle(this.normalize(axis), angle), canvas);
          }
        }
      }
      
      // 플래그 초기화
      hasDragged = false;
      dragStartPos = null;
    });
    
    // wheel: 알파 조절
    canvas.addEventListener('wheel', (e) => {
      e.preventDefault();
      e.stopPropagation();
      
      const picker = canvas.closest('.custom-color-picker');
      if (!picker) return;
      
      const panelHexInput = picker.querySelector('.panel-hex-input');
      if (!panelHexInput) return;
      
      const currentHex = panelHexInput.value.replace('#', '');
      if (currentHex.length >= 6) {
        let alpha = currentHex.length === 8 ? parseInt(currentHex.substr(6, 2), 16) : 255;
        
        // 알파값 조절
        const alphaChange = e.deltaY > 0 ? -4 : 4;
        alpha = Math.max(0, Math.min(255, alpha + alphaChange));
        
        const newHex = currentHex.substr(0, 6) + alpha.toString(16).padStart(2, '0').toUpperCase();
        panelHexInput.value = '#' + newHex;
        
        // 이벤트 트리거 (기존 방식 유지)
        panelHexInput.dispatchEvent(new Event('input', { bubbles: true }));
        
        // 투명도 변화 후 업데이트 (성능 최적화)
        setTimeout(() => {
          if (window.ButtonSystem && window.ButtonSystem.StyleManager) {
            window.ButtonSystem.StyleManager.scheduleUpdate();
          }
        }, 100);
      }
    });
    },
  // 클릭 회전 애니메이션
  animateToQuaternion(sphereState, targetQ, canvas) {
    const startQ = [...sphereState.Q];
    const startTime = performance.now();
        const ctx = canvas.getContext('2d');
    
    const animate = (currentTime) => {
      const progress = Math.min((currentTime - startTime) / 1000, 1);
      sphereState.Q = this.slerp(startQ, targetQ, 1 - Math.pow(1 - progress, 3));
      this.RenderColorSphere(ctx, sphereState);
      if (progress < 1) requestAnimationFrame(animate);
    };
    requestAnimationFrame(animate);
  }
};
