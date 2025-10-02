/* ==============================
  🌍 역학 시스템 모듈
  ============================== */

import { Topology } from './topology.js';
import { ColorSphereUI } from '../ui/color-sphere-ui.js';

export const Mechanics = {
  // 전역 통합 색구체 상태
  UnifiedSphereState: {
    dragging: false,
    v0: null,
    Q: [1, 0, 0, 0],  // 북극점 중심 정렬
    last: [0, 0],
    zoom: 1.0,
    selectedColor: { r: 0, g: 0, b: 0 },  // 렌더링 색구체의 표면 중심점 색상
    isDragging: false
  },

  // 색구체 초기화 함수
  initializeColorSphere(selector = '#color-sphere-canvas', onUpdate = null) {
    const canvas = document.querySelector(selector);
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    this.RenderColorSphere(ctx, this.UnifiedSphereState);
    
    this.setupCanvasInteraction(canvas, this.UnifiedSphereState, onUpdate);
    ColorSphereUI.setupZoomSlider(this.UnifiedSphereState, canvas);
    ColorSphereUI.setupColorInfoUpdate(this.UnifiedSphereState, canvas);
  },

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

  // 벡터 정규화
  normalize(v) {
    const length = Math.sqrt(v.reduce((sum, val) => sum + val * val, 0));
    if (length === 0) throw new Error('영벡터는 정규화할 수 없습니다');
    return v.map(val => val / length);
  },
  
  // 축과 각도로부터 쿼터니언 생성
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
  
  // 구면 선형 보간 (SLERP)
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
  
  // 3D 구체 렌더링
  RenderColorSphere(ctx, sphereState) {
    const width = ctx.canvas.width;
    const height = ctx.canvas.height;
    const centerX = width / 2;
    const centerY = height / 2;
    const radius = (Math.min(width, height) / 2 - 20) * sphereState.zoom;
    
    ctx.clearRect(0, 0, width, height);
    
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
    
    if (sphereState.selectedColor) {
      const { r, g, b } = sphereState.selectedColor;
      ctx.fillStyle = `rgb(${r}, ${g}, ${b})`;
      ctx.beginPath();
      ctx.arc(centerX, centerY, 4, 0, 2 * Math.PI);
      ctx.fill();
      
      const brightness = (r * 0.299 + g * 0.587 + b * 0.114);
      ctx.strokeStyle = brightness > 127 ? 'rgba(0,0,0,0.8)' : 'rgba(255,255,255,0.8)';
      ctx.lineWidth = 2;
      ctx.stroke();
    }
  },
  
  // 3D 캔버스 상호작용 설정 (드래그, 클릭, 휠)
  setupCanvasInteraction(canvas, sphereState, onUpdate) {
    let dragStartPos = null;
    let hasDragged = false;
    let ctx = canvas.getContext('2d');
    
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
    
    canvas.addEventListener('pointermove', (e) => {
      if (!sphereState.dragging) return;
      
      e.preventDefault();
      e.stopPropagation();
      const dx = e.clientX - sphereState.last[0];
      const dy = e.clientY - sphereState.last[1];
      sphereState.last = [e.clientX, e.clientY];
      
      if (!hasDragged && dragStartPos) {
        if (Math.hypot(e.clientX - dragStartPos[0], e.clientY - dragStartPos[1]) > 3) hasDragged = true;
      }
      
      const dq = this.fromDragRotation(dx, dy, 1 / (0.45 * Math.min(canvas.clientWidth, canvas.clientHeight)));
      
      if (dq[0] !== 1) {
        sphereState.Q = this.multiply(sphereState.Q, dq);
      }
      
      if (onUpdate) onUpdate(canvas);
      
      this.RenderColorSphere(ctx, sphereState);
    });
    
    canvas.addEventListener('pointerup', (e) => {
      e.preventDefault();
      e.stopPropagation();
      sphereState.dragging = false;
      sphereState.isDragging = false;
      canvas.releasePointerCapture(e.pointerId);
      canvas.style.cursor = 'grab';
      
      requestAnimationFrame(() => {
        this.RenderColorSphere(ctx, sphereState);
      });
    });
    
    canvas.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      if (!hasDragged) {
        const rect = canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        const coordinates = this.mouseClickToSphericalCoordinates(x, y, canvas);
        if (coordinates) {
          const targetVector = [coordinates.cartesian.x, coordinates.cartesian.y, coordinates.cartesian.z];
          const currentVector = [0, 0, 1];
          
          const axis = [
            currentVector[1] * targetVector[2] - currentVector[2] * targetVector[1],
            currentVector[2] * targetVector[0] - currentVector[0] * targetVector[2],
            currentVector[0] * targetVector[1] - currentVector[1] * targetVector[0]
          ];
          
          const angle = Math.acos(Math.max(-1, Math.min(1, currentVector[0] * targetVector[0] + currentVector[1] * targetVector[1] + currentVector[2] * targetVector[2])));
          
          if (angle > 0.01) {
            this.animateToQuaternion(sphereState, this.fromAxisAngle(this.normalize(axis), angle), canvas);
          }
        }
      }
      
      hasDragged = false;
      dragStartPos = null;
    });
    
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
        
        const alphaChange = e.deltaY > 0 ? -4 : 4;
        alpha = Math.max(0, Math.min(255, alpha + alphaChange));
        
        const newHex = currentHex.substr(0, 6) + alpha.toString(16).padStart(2, '0').toUpperCase();
        panelHexInput.value = '#' + newHex;
        
        panelHexInput.dispatchEvent(new Event('input', { bubbles: true }));
        
        setTimeout(() => {
          if (window.ButtonSystem && window.ButtonSystem.StyleManager) {
            window.ButtonSystem.StyleManager.scheduleUpdate();
          }
        }, 100);
      }
    });
  },
  
  // 클릭 회전 애니메이션 (부드러운 전환)
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
