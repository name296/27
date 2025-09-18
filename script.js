/* 버튼 컴포넌트 시스템 - 시스테매틱 모듈 구조 */
/* ==============================
  📋 시스템 정보
  ============================== */
/* 
  📋 시스템 정보
  프로젝트: 버튼 컴포넌트 시스템 v1.0.0
  목적: 동적 팔레트 시스템과 3D 색상 선택기
  아키텍처: 모듈형 시스템 (CSSOM + 3D Graphics)
  
  🏗️ 모듈 구조:
  ├── ColorSystem: 색상 변환 (RGB ↔ HSV ↔ HSL ↔ HEX)
  ├── SphericalDynamics: 구면 역학 (좌표계 + 회전 + 상호작용)
  ├── ColorSphereSystem: 색상 구체 (구면좌표 → RGB 매핑 + 렌더링)
  ├── AppUtils: 공통 유틸리티 (SVG, CSS 주입)
  ├── ButtonSystem: 버튼 컴포넌트 관리
  └── CustomPaletteManager: 커스텀 팔레트 UI
  
  🔗 종속성: index.html ↔ style.css ↔ script.js
*/

/* ==============================
  🎨 색상 시스템 모듈
  ============================== */

// 색상 시스템 공통 모듈
const ColorSystem = {
  // 8자리 헥스코드 변환
  rgbaToHex(r, g, b, a = 255) {
    const clamp = (value) => Math.max(0, Math.min(255, Math.round(value)));
    return "#" + 
      clamp(r).toString(16).padStart(2, '0').toUpperCase() +
      clamp(g).toString(16).padStart(2, '0').toUpperCase() +
      clamp(b).toString(16).padStart(2, '0').toUpperCase() +
      clamp(a).toString(16).padStart(2, '0').toUpperCase();
  },
  
  // 8자리 헥스코드 파싱
  hexToRgba(hex) {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})?/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16),
      a: result[4] ? parseInt(result[4], 16) : 255
    } : { r: 0, g: 0, b: 0, a: 255 };
  },
  
  // HSV → RGB 변환
  hsvToRgb(h, s, v) {
    h = h % 360;
    if (h < 0) h += 360;
    s /= 100;
    v /= 100;
    
    const c = v * s;
    const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
    const m = v - c;
    
    let r, g, b;
    if (h < 60) { r = c; g = x; b = 0; }
    else if (h < 120) { r = x; g = c; b = 0; }
    else if (h < 180) { r = 0; g = c; b = x; }
    else if (h < 240) { r = 0; g = x; b = c; }
    else if (h < 300) { r = x; g = 0; b = c; }
    else { r = c; g = 0; b = x; }
    
    return {
      r: Math.round((r + m) * 255),
      g: Math.round((g + m) * 255),
      b: Math.round((b + m) * 255)
    };
  },
  
  // RGB → HSL 변환
  rgbToHsl(r, g, b) {
    r /= 255; g /= 255; b /= 255;
    const max = Math.max(r, g, b), min = Math.min(r, g, b);
    let h, s, l = (max + min) / 2;
    
    if (max === min) {
      h = s = 0; // 무채색
    } else {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      switch (max) {
        case r: h = (g - b) / d + (g < b ? 6 : 0); break;
        case g: h = (b - r) / d + 2; break;
        case b: h = (r - g) / d + 4; break;
      }
      h /= 6;
    }
    
    return {
      h: Math.round(h * 360),
      s: Math.round(s * 100),
      l: Math.round(l * 100)
    };
  },
  
  // HSL → RGB 변환
  hslToRgb(h, s, l) {
    h /= 360; s /= 100; l /= 100;
    
    const hue2rgb = (p, q, t) => {
      if (t < 0) t += 1;
      if (t > 1) t -= 1;
      if (t < 1/6) return p + (q - p) * 6 * t;
      if (t < 1/2) return q;
      if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
      return p;
    };
    
    let r, g, b;
    if (s === 0) {
      r = g = b = l; // 무채색
    } else {
      const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
      const p = 2 * l - q;
      r = hue2rgb(p, q, h + 1/3);
      g = hue2rgb(p, q, h);
      b = hue2rgb(p, q, h - 1/3);
    }
    
    return {
      r: Math.round(r * 255),
      g: Math.round(g * 255),
      b: Math.round(b * 255)
    };
  }
};

/* ==============================
  🌍 구면 역학 시스템 모듈
  ============================== */

// 구면 역학 시스템 (구면좌표계 + 3D 회전 + 상호작용)
const SphericalDynamics = {
  // ========================================
  // 🔄 쿼터니언 회전 시스템
  // ========================================
  
  // 범용 정규화 (3D 벡터 또는 4D 쿼터니언)
  normalize(v) {
    const length = Math.sqrt(v.reduce((sum, val) => sum + val * val, 0));
    if (length === 0) {
      // 기본값: 3D는 [0,0,1], 4D는 [0,0,0,1]
      return v.length === 3 ? [0, 0, 1] : [0, 0, 0, 1];
    }
    return v.map(val => val / length);
  },
  
  // 축-각도에서 쿼터니언 생성
  fromAxisAngle(axis, angle) {
    const halfAngle = angle * 0.5;
    const s = Math.sin(halfAngle);
    return [axis[0] * s, axis[1] * s, axis[2] * s, Math.cos(halfAngle)];
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
    const qv = [v[0], v[1], v[2], 0];
    const qConj = [-q[0], -q[1], -q[2], q[3]];
    const temp = this.multiply(q, qv);
    const result = this.multiply(temp, qConj);
    return [result[0], result[1], result[2]];
  },
  
  // SLERP (구면 선형 보간)
  slerp(q1, q2, t) {
    let dot = q1[0] * q2[0] + q1[1] * q2[1] + q1[2] * q2[2] + q1[3] * q2[3];
    
    if (dot < 0.0) {
      q2 = [-q2[0], -q2[1], -q2[2], -q2[3]];
      dot = -dot;
    }
    
    if (dot > 0.9995) {
      return this.normalize([
        q1[0] + t * (q2[0] - q1[0]),
        q1[1] + t * (q2[1] - q1[1]),
        q1[2] + t * (q2[2] - q1[2]),
        q1[3] + t * (q2[3] - q1[3])
      ]);
    }
    
    const theta0 = Math.acos(Math.abs(dot));
    const theta = theta0 * t;
    const sinTheta0 = Math.sin(theta0);
    const sinTheta = Math.sin(theta);
    
    const s0 = Math.cos(theta) - dot * sinTheta / sinTheta0;
    const s1 = sinTheta / sinTheta0;
    
    return [
      s0 * q1[0] + s1 * q2[0],
      s0 * q1[1] + s1 * q2[1],
      s0 * q1[2] + s1 * q2[2],
      s0 * q1[3] + s1 * q2[3]
    ];
  },
  
  // 클릭 좌표에서 회전 계산 (드래그와 동일한 좌표계)
  fromClickRotation(screenX, screenY) {
    // 드래그와 동일한 방식: 클릭 거리에 비례한 회전
    const distance = Math.sqrt(screenX * screenX + screenY * screenY);
    const angle = distance * Math.PI * 0.5; // 클릭 거리에 비례
    
    if (angle < 1e-6) return [1, 0, 0, 0]; // 단위 쿼터니언
    
    // 드래그와 동일한 축 계산 방식
    const axis = this.normalize([screenY, -screenX, 0]);
    return this.fromAxisAngle(axis, angle);
  },
  
  // 드래그 회전 계산 (트랙볼 방식)
  fromDragRotation(dx, dy, sensitivity = 0.005) {
    const angle = Math.sqrt(dx * dx + dy * dy) * sensitivity;
    if (angle < 1e-6) return [1, 0, 0, 0]; // 단위 쿼터니언
    
    const axis = this.normalize([dy, -dx, 0]); // 범용 정규화
    return this.fromAxisAngle(axis, angle);
  },
  
  // ========================================
  // 📐 구면좌표계 시스템
  // ========================================
  
  // 직교좌표 → 구면좌표 변환
  cartesianToSpherical(x, y, z) {
    const r = Math.sqrt(x * x + y * y + z * z);
    const theta = Math.acos(Math.max(-1, Math.min(1, z / r))); // 위도각 (0 ~ π)
    const phi = Math.atan2(y, x); // 경도각 (-π ~ π)
    return { r, theta, phi };
  },
  
  // 구면좌표 → 직교좌표 변환
  sphericalToCartesian(r, theta, phi) {
    const x = r * Math.sin(theta) * Math.cos(phi);
    const y = r * Math.sin(theta) * Math.sin(phi);
    const z = r * Math.cos(theta);
    return { x, y, z };
  },
  
  // 8자리 헥스코드에서 구면좌표 찾기
  findPosition(hexColor) {
    const rgba = ColorSystem.hexToRgba(hexColor);
    const targetHex = ColorSystem.rgbaToHex(rgba.r, rgba.g, rgba.b, 255).substr(0, 7);
    
    // 구체 전체 검색
    for (let theta = 0; theta <= Math.PI; theta += 0.05) {
      for (let phi = -Math.PI; phi <= Math.PI; phi += 0.05) {
        const color = ColorSphereSystem.calculateColor(theta, phi);
        const testHex = ColorSystem.rgbaToHex(color.r, color.g, color.b, 255).substr(0, 7);
        
        if (testHex === targetHex) {
          return { theta, phi };
        }
      }
    }
    
    return { theta: 0, phi: 0 }; // 못 찾으면 북극
  },
  
  // ========================================
  // 🎮 3D 구체 상호작용 시스템
  // ========================================
  
  // 3D 캔버스 상호작용 설정
  setupCanvasInteraction(canvas, sphereState, onUpdate) {
    let renderPending = false;
    let dragStartPos = null;
    let hasDragged = false;
    
    // pointerdown: 드래그 시작
    canvas.addEventListener('pointerdown', (e) => {
      sphereState.dragging = true;
      sphereState.last = [e.clientX, e.clientY];
      sphereState.isDragging = true;
      dragStartPos = [e.clientX, e.clientY];
      hasDragged = false;
      canvas.setPointerCapture(e.pointerId);
      canvas.style.cursor = 'grabbing';
    });
    
    // pointermove: 회전
    canvas.addEventListener('pointermove', (e) => {
      if (!sphereState.dragging) return;
      
      const dx = e.clientX - sphereState.last[0];
      const dy = e.clientY - sphereState.last[1];
      sphereState.last = [e.clientX, e.clientY];
      
      // 드래그 감지
      if (!hasDragged && dragStartPos) {
        const dragDistance = Math.hypot(e.clientX - dragStartPos[0], e.clientY - dragStartPos[1]);
        if (dragDistance > 3) {
          hasDragged = true;
        }
      }
      
      // 회전 적용
      const s = 0.45 * Math.min(canvas.clientWidth, canvas.clientHeight);
      const sensitivity = 1 / s;
      const dq = this.fromDragRotation(dx, dy, sensitivity);
      
      if (dq[0] !== 1) {
        sphereState.Q = this.multiply(sphereState.Q, dq);
      }
      
      // 중심점 색상 업데이트
      if (onUpdate) onUpdate(canvas);
      
      // 렌더링 스로틀링
      if (!renderPending) {
        renderPending = true;
        requestAnimationFrame(() => {
          const ctx = canvas.getContext('2d');
          ColorSphereSystem.render3D(ctx, sphereState);
          renderPending = false;
        });
      }
    });
    
    // pointerup: 드래그 종료
    canvas.addEventListener('pointerup', (e) => {
      sphereState.dragging = false;
      sphereState.isDragging = false;
      canvas.releasePointerCapture(e.pointerId);
      canvas.style.cursor = 'grab';
      
      // 고화질 최종 렌더링
      requestAnimationFrame(() => {
        const ctx = canvas.getContext('2d');
        const currentAlpha = this.getCurrentAlpha(canvas);
        ColorSphereSystem.render3D(ctx, sphereState, currentAlpha);
      });
    });
    
    // click: 플래그 초기화
    canvas.addEventListener('click', (e) => {
      hasDragged = false;
      dragStartPos = null;
    });
    
    // wheel: 알파 조절
    canvas.addEventListener('wheel', (e) => {
      e.preventDefault();
      
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
      }
    });
    },
  
  // 부드러운 쿼터니언 애니메이션
  animateToQuaternion(sphereState, targetQ, canvas) {
    const startQ = [...sphereState.Q];
    const duration = 200;
    const startTime = Date.now();
    
    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const easeProgress = 1 - Math.pow(1 - progress, 3);
      
      sphereState.Q = this.slerp(startQ, targetQ, easeProgress);
      
      // 구체 다시 그리기
      if (canvas) {
        const ctx = canvas.getContext('2d');
        ColorSphereSystem.render3D(ctx, sphereState);
      }
      
      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };
    
    requestAnimationFrame(animate);
  }
};

/* ==============================
  🎨 색상 구체 시스템 모듈
  ============================== */

// 색상 구체 시스템 (구면좌표 → RGB 매핑 + 3D 렌더링)
const ColorSphereSystem = {
  // ========================================
  // 🎨 색상 매핑 시스템
  // ========================================
  
  // 구면좌표에서 색상 계산
  calculateColor(theta, phi) {
    // 정확한 구간 설정: 극지방 6도 (좌우 3도씩), 적도 6도
    const thetaDeg = theta * 180 / Math.PI;
    const isPolarRegion = (thetaDeg < 3 || thetaDeg > 177); // 0°~3°, 177°~180°
    const isEquatorRegion = (Math.abs(thetaDeg - 90) < 3); // 87° ~ 93°
    
    let r, g, b;
    
    if (isPolarRegion) {
      // 극지방: 완전한 순백/순흑
      const value = thetaDeg < 3 ? 255 : 0; // 북극=백색, 남극=흑색
      r = g = b = value;
    } else if (isEquatorRegion) {
      // 적도 띠: 순색 (명도=50% 고정)
      const hue = ((phi + Math.PI) / (2 * Math.PI)) * 360;
      const h6 = Math.floor(hue / 60) % 6;
      const f = (hue % 60) / 60;
      
      switch(h6) {
        case 0: r = 255; g = Math.round(f * 255); b = 0; break;
        case 1: r = Math.round((1-f) * 255); g = 255; b = 0; break;
        case 2: r = 0; g = 255; b = Math.round(f * 255); break;
        case 3: r = 0; g = Math.round((1-f) * 255); b = 255; break;
        case 4: r = Math.round(f * 255); g = 0; b = 255; break;
        case 5: r = 255; g = 0; b = Math.round((1-f) * 255); break;
      }
    } else {
      // 그라데이션 영역: 극점과 적도 완전 제외 (3°~87°, 93°~177°)
      const hue = ((phi + Math.PI) / (2 * Math.PI)) * 360;
      const h6 = Math.floor(hue / 60) % 6;
      const f = (hue % 60) / 60;
      
      // 기본 순색 계산
      let baseR, baseG, baseB;
      switch(h6) {
        case 0: baseR = 255; baseG = Math.round(f * 255); baseB = 0; break;
        case 1: baseR = Math.round((1-f) * 255); baseG = 255; baseB = 0; break;
        case 2: baseR = 0; baseG = 255; baseB = Math.round(f * 255); break;
        case 3: baseR = 0; baseG = Math.round((1-f) * 255); baseB = 255; break;
        case 4: baseR = Math.round(f * 255); baseG = 0; baseB = 255; break;
        case 5: baseR = 255; baseG = 0; baseB = Math.round((1-f) * 255); break;
      }
      
      // 그라데이션 영역에서만 명도 스케일링 적용
      let lightnessRatio;
      if (thetaDeg >= 3 && thetaDeg <= 87) {
        // 북반구 그라데이션: 3°~87° → 100%~50% 명도
        lightnessRatio = 1.0 - ((thetaDeg - 3) / (87 - 3)) * 0.5;
      } else if (thetaDeg >= 93 && thetaDeg <= 177) {
        // 남반구 그라데이션: 93°~177° → 50%~0% 명도  
        lightnessRatio = 0.5 - ((thetaDeg - 93) / (177 - 93)) * 0.5;
      } else {
        // 극점/적도 경계: 가장 가까운 구간의 경계값
        if (thetaDeg < 90) {
          lightnessRatio = 0.5; // 적도 경계 (87°~93° 사이)
        } else {
          lightnessRatio = 0.5; // 적도 경계 (87°~93° 사이)
        }
      }
      
      // 채도와 명도 적용
      const totalSaturation = Math.sin(theta);
      const gray = Math.round(lightnessRatio * 255);
      r = Math.round(gray + (baseR - gray) * totalSaturation);
      g = Math.round(gray + (baseG - gray) * totalSaturation);
      b = Math.round(gray + (baseB - gray) * totalSaturation);
    }
    
    return { r, g, b };
  },
  
  // ========================================
  // 🖼️ 3D 렌더링 시스템
  // ========================================
  
  // 3D 구체 렌더링
  render3D(ctx, sphereState) {
    const width = ctx.canvas.width;
    const height = ctx.canvas.height;
    const centerX = width / 2;
    const centerY = height / 2;
    const baseRadius = Math.min(width, height) / 2 - 20;
    const radius = baseRadius * sphereState.zoom;
    
    // 캔버스 초기화
    ctx.clearRect(0, 0, width, height);
    
    // 3D 색상구체 렌더링
    const imageData = ctx.createImageData(width, height);
    const data = imageData.data;
    
    // 반지름의 제곱 (성능 최적화)
    const radiusSquared = radius * radius;
    const invRadius = 1 / radius;
    
    // 픽셀 처리 최적화 (드래그 중에는 해상도 낮춤)
    const pixelStep = sphereState.isDragging ? 2 : 1;
    
    for (let y = 0; y < height; y += pixelStep) {
      for (let x = 0; x < width; x += pixelStep) {
        const dx = x - centerX;
        const dy = y - centerY;
        const distanceSquared = dx * dx + dy * dy;
        
        if (distanceSquared <= radiusSquared) {
          // 3D 구체 좌표
          const screenX = dx * invRadius;
          const screenY = dy * invRadius;
          const screenZ = Math.sqrt(Math.max(0, 1 - screenX * screenX - screenY * screenY));
          
          // 쿼터니언으로 3D 회전 적용
          const rotatedVector = SphericalDynamics.rotateVector(sphereState.Q, [screenX, screenY, screenZ]);
          const [rotatedX, rotatedY, rotatedZ] = rotatedVector;
          
          // 3D 좌표를 구면 좌표로 변환
          const phi = Math.atan2(rotatedY, rotatedX);
          const theta = Math.acos(Math.max(-1, Math.min(1, rotatedZ)));
          
          // ColorSphereSystem으로 색상 계산
          const color = this.calculateColor(theta, phi);
          const { r, g, b } = color;
          
          // 픽셀 채우기
          for (let py = y; py < Math.min(y + pixelStep, height); py++) {
            for (let px = x; px < Math.min(x + pixelStep, width); px++) {
              const index = (py * width + px) * 4;
              data[index] = r;
              data[index + 1] = g;
              data[index + 2] = b;
              data[index + 3] = 255;
            }
          }
        }
      }
    }
    
    ctx.putImageData(imageData, 0, 0);
    
    // 중심점 표시 (항상 불투명)
    if (sphereState.selectedColor) {
      const { r, g, b } = sphereState.selectedColor;
      ctx.fillStyle = `rgb(${r}, ${g}, ${b})`;
      ctx.beginPath();
      ctx.arc(centerX, centerY, 4, 0, 2 * Math.PI);
      ctx.fill();
      
      // 대비되는 테두리 (2px)
      const brightness = (r * 0.299 + g * 0.587 + b * 0.114);
      ctx.strokeStyle = brightness > 127 ? 'rgba(0,0,0,0.8)' : 'rgba(255,255,255,0.8)';
      ctx.lineWidth = 2;
      ctx.stroke();
    }
  }
};

/* ==============================
  🛠️ 공통 유틸리티 모듈
  ============================== */

const AppUtils = {
  SVGLoader: {
    async loadSvg(path, selector) {
      const response = await fetch(path);
      const svgMarkup = await response.text();
      document.querySelectorAll(selector).forEach(target => { target.innerHTML = svgMarkup; });
      return svgMarkup;
    },
    
    async loadAllIcons() {
      const iconPromise = this.loadSvg('icon.svg', '.content.icon');
      const selectedIconPromise = this.loadSvg('selected.svg', '.content.icon.pressed')
        .then(svg => { ButtonSystem.state.iconSelectedSvgContent = svg; });
      
              await Promise.all([iconPromise, selectedIconPromise]);
    }
  },
  
  CSSInjector: {
    inject(id, content, description = '') {
      const existingStyle = document.getElementById(id);
      if (existingStyle) existingStyle.remove();
      
      const styleElement = document.createElement('style');
      styleElement.id = id;
      styleElement.textContent = content;
              document.head.appendChild(styleElement);
    }
  }
};

/* ==============================
  🔘 버튼 시스템 코어 모듈
  ============================== */

const ButtonSystem = {
  CONSTANTS: {
    BASE: 0.03125,
    get BACKGROUND_BORDER_RADIUS() { return this.BASE; },
    get BUTTON_BORDER_RADIUS() { return 2 * this.BACKGROUND_BORDER_RADIUS; },
    get BACKGROUND_OUTLINE_WIDTH() { return this.BASE; },
    get BUTTON_PADDING() { return this.BACKGROUND_OUTLINE_WIDTH; },
    get BUTTON_OUTLINE_WIDTH() { return 3 * this.BACKGROUND_OUTLINE_WIDTH; },
    get BUTTON_OUTLINE_OFFSET() { return -1 * this.BACKGROUND_OUTLINE_WIDTH; },
    get SELECTED_ICON_SIZE() { return 4 * this.BASE; }
  },
  
  state: {
    iconSelectedSvgContent: null,
    styleCache: new WeakMap()
  },
  
  PaletteManager: {
    
    generateCSS() {
      const buttons = document.querySelectorAll('.button');
      const discoveredPalettes = new Set();
      
      buttons.forEach(button => {
        const classList = Array.from(button.classList);
        const palette = classList.find(cls => !['button', 'pressed', 'toggle', 'dynamic'].includes(cls));
        if (palette) discoveredPalettes.add(palette);
      });
      
      let lightThemeCSS = '', darkThemeCSS = '', selectorsCSS = '';
      
      discoveredPalettes.forEach(palette => {
        const isExisting = ['primary1', 'primary2', 'primary3', 'secondary1', 'secondary2', 'secondary3', 'custom'].includes(palette);
        
        [
          { name: 'default', selector: '', disabled: false },
          { name: 'pressed', selector: '.pressed:not(.toggle)', disabled: false },
          { name: 'pressed', selector: '.pressed.toggle', disabled: false },
          { name: 'disabled', selector: '[aria-disabled="true"]', disabled: true }
        ].forEach(({name: state, selector: stateSelector, disabled}) => {
          const baseSelector = palette === 'primary1' && state === 'default' && !disabled ? `&${stateSelector}` : null;
          const paletteSelector = `&.${palette}${stateSelector}`;
          
          if (baseSelector) {
            selectorsCSS += `
    ${baseSelector} {
      & .background.dynamic {
        background: var(--${palette}-background-color-${state});
        outline-color: var(--${palette}-border-color-${state});
        outline-style: var(--border-style-default);
        
        & .content {
          color: var(--${palette}-content-color-${state});
        }
      }
    }`;
          }
          
          // Primary3, Secondary3는 이중 배경 시스템 사용
          const backgroundProperty = (palette === 'primary3' || palette === 'secondary3') 
            ? `var(--${palette}-background1-color-${state})` 
            : `var(--${palette}-background-color-${state})`;
          
          selectorsCSS += `
    ${paletteSelector} {
      & .background.dynamic {
        background: ${backgroundProperty};
        outline-color: var(--${palette}-border-color-${state});
        ${state === 'default' ? 'outline-style: var(--border-style-default);' : ''}
        ${state === 'pressed' ? 'outline-style: var(--border-style-pressed); outline-width: var(--border-style-pressed);' : ''}
        ${state === 'disabled' ? 'outline-style: var(--border-style-disabled);' : ''}
        
        & .content {
          color: var(--${palette}-content-color-${state});
        }
      }
      ${state === 'pressed' ? '&.toggle { & .content.icon.pressed { display: var(--content-icon-display-pressed-toggle); } }' : ''}
      ${disabled ? 'cursor: var(--button-cursor-disabled);' : ''}
    }`;
        });
        
        if (!isExisting) {
          // CSS에서 --custom-* 변수를 복사하여 새 팔레트 생성
          const customProperties = [
            'content-color-default', 'content-color-pressed', 'content-color-disabled',
            'background-color-default', 'background-color-pressed', 'background-color-disabled',
            'border-color-default', 'border-color-pressed', 'border-color-disabled'
          ];
          
          customProperties.forEach(property => {
            lightThemeCSS += `  --${palette}-${property}: var(--custom-${property});\n`;
            darkThemeCSS += `  --${palette}-${property}: var(--custom-${property});\n`;
          });
        }
      });
      
      const cssContent = `
/* HTML 클래스 기반 수정자 시스템 - CSS 상속 활용 */
${lightThemeCSS ? `:root {\n${lightThemeCSS}}` : ''}

${darkThemeCSS ? `.dark {\n${darkThemeCSS}}` : ''}

@layer components {
  .button {${selectorsCSS}
  }
}
`;
      
      AppUtils.CSSInjector.inject('palette-system-styles', cssContent, '팔레트 시스템');
      return discoveredPalettes;
    }
  },
  
  StyleManager: {
    // 상태 변경 후 명도대비 업데이트 (공통 함수)
    scheduleContrastUpdate() {
      // 렌더링 완료 후 실행하는 Promise 기반 방식
      this.waitForRenderCompletion().then(() => {
        this.updateButtonLabelsWithContrast();
      });
    },
    
    // 렌더링 완료 대기 함수
    async waitForRenderCompletion() {
      return new Promise((resolve) => {
        // 1. 다음 프레임 대기 (레이아웃 단계)
        requestAnimationFrame(() => {
          // 2. 그 다음 프레임 대기 (페인트 단계)
          requestAnimationFrame(() => {
            // 3. 추가 안정화 대기
            setTimeout(() => {
              resolve();
            }, 16); // 1프레임(16.67ms) 추가 대기
          });
        });
      });
    },
    
    // 모든 버튼 상태 변경을 감지하는 통합 이벤트 매니저
    setupContrastUpdateManager() {
      // MutationObserver로 클래스 및 스타일 변경 감지
      const observer = new MutationObserver((mutations) => {
        let needsUpdate = false;
        
        mutations.forEach(mutation => {
          const target = mutation.target;
          
          // 버튼 클래스 변경 감지
          if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
            if (target.classList.contains('button')) {
              needsUpdate = true;
            }
          }
          
          // CSS 변수 변경 감지 (documentElement의 style 속성)
          if (mutation.type === 'attributes' && mutation.attributeName === 'style') {
            if (target === document.documentElement) {
              needsUpdate = true;
            }
          }
        });
        
        if (needsUpdate) {
          this.scheduleContrastUpdate();
        }
      });
      
      // 모든 버튼의 클래스 변경 감지
      document.querySelectorAll('.button').forEach(button => {
        observer.observe(button, {
          attributes: true,
          attributeFilter: ['class']
        });
      });
      
      // documentElement의 CSS 변수 변경 감지
      observer.observe(document.documentElement, {
        attributes: true,
        attributeFilter: ['style']
              });
      return observer;
    },
    
    // 명도대비 계산 함수 (WCAG 2.1 표준)
    calculateContrast(color1, color2) {
      // RGB 값 추출 (다양한 색상 형식 지원)
      const getRGB = (color) => {
        // 빈 문자열이나 null 처리
        if (!color || color === 'transparent') {
          return [255, 255, 255]; // 기본값: 흰색
        }
        
        // hex 색상 처리 (#RRGGBBAA 또는 #RRGGBB)
        if (color.startsWith('#')) {
          const hex = color.replace('#', '');
          if (hex.length >= 6) {
            return [
              parseInt(hex.substr(0, 2), 16),
              parseInt(hex.substr(2, 2), 16),
              parseInt(hex.substr(4, 2), 16)
            ];
          }
        }
        
        // rgb/rgba 색상 처리 (소수점 포함)
        const rgbMatch = color.match(/rgba?\(\s*(\d+(?:\.\d+)?)\s*,\s*(\d+(?:\.\d+)?)\s*,\s*(\d+(?:\.\d+)?)/);
        if (rgbMatch) {
          return [
            Math.round(parseFloat(rgbMatch[1])),
            Math.round(parseFloat(rgbMatch[2])),
            Math.round(parseFloat(rgbMatch[3]))
          ];
        }
        
        // 기본값 반환 (파싱 실패시)
        return [128, 128, 128]; // 회색
      };
      
      // 상대 휘도 계산 (WCAG 2.1 표준 공식)
      const getLuminance = (r, g, b) => {
        const [rs, gs, bs] = [r, g, b].map(c => {
          c = c / 255;
          return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
        });
        return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
      };
      
      const [r1, g1, b1] = getRGB(color1);
      const [r2, g2, b2] = getRGB(color2);
      
      const lum1 = getLuminance(r1, g1, b1);
      const lum2 = getLuminance(r2, g2, b2);
      
      // WCAG 2.1 명도대비 공식: (밝은 색 + 0.05) / (어두운 색 + 0.05)
      // 값이 클수록 대비가 높음 (1:1 ~ 21:1)
      const brightest = Math.max(lum1, lum2);
      const darkest = Math.min(lum1, lum2);
      const contrastRatio = (brightest + 0.05) / (darkest + 0.05);
      
      return contrastRatio;
    },
    
    updateButtonLabelsWithContrast() {
      const allButtons = document.querySelectorAll('.button');
      
      allButtons.forEach(button => {
        const background = button.querySelector('.background.dynamic');
        const content = button.querySelector('.content');
        const label = button.querySelector('.content.label');
        
        if (background && content && label) {
          // 스타일 재계산 강제 후 최종값 가져오기
          background.offsetHeight; // 강제 리플로우
          content.offsetHeight;    // 강제 리플로우
          
          const backgroundStyle = getComputedStyle(background);
          const contentStyle = getComputedStyle(content);
          const backgroundColor = backgroundStyle.backgroundColor;
          const textColor = contentStyle.color;
          
          const contrast = this.calculateContrast(textColor, backgroundColor);
          const contrastRatio = contrast.toFixed(2);
          
          // 기존 라벨에서 대비값 부분 제거
          let labelText = label.innerHTML.split('<br>')[0];
          
          // 간단하게 숫자만 표시 (소숫점 두 자리)
          label.innerHTML = `${labelText}<br>${contrastRatio}`;
        }
      });
    },
    
    applyDynamicStyles() {
      const allButtons = document.querySelectorAll('.button');
      if (allButtons.length === 0) return;
      
      let processedCount = 0;
      
      for (const button of allButtons) {
        const background = button.querySelector(".background");
        if (!background) continue;

        const rect = button.getBoundingClientRect();
        const minSide = Math.min(rect.width, rect.height);

        const buttonPadding = minSide * ButtonSystem.CONSTANTS.BUTTON_PADDING;
        const buttonBorderRadius = minSide * ButtonSystem.CONSTANTS.BUTTON_BORDER_RADIUS;
        const buttonOutlineWidth = minSide * ButtonSystem.CONSTANTS.BUTTON_OUTLINE_WIDTH;
        const buttonOutlineOffset = minSide * ButtonSystem.CONSTANTS.BUTTON_OUTLINE_OFFSET;
        const backgroundBorderRadius = minSide * ButtonSystem.CONSTANTS.BACKGROUND_BORDER_RADIUS;
        const backgroundOutlineWidth = minSide * ButtonSystem.CONSTANTS.BACKGROUND_OUTLINE_WIDTH;
        const iconSelectedSize = minSide * ButtonSystem.CONSTANTS.SELECTED_ICON_SIZE;

        const cached = ButtonSystem.state.styleCache.get(button) || {};
        const needsUpdate = (
          (cached.minSide || 0) !== minSide || (cached.buttonPadding || 0) !== buttonPadding ||
          (cached.buttonBorderRadius || 0) !== buttonBorderRadius || (cached.buttonOutlineWidth || 0) !== buttonOutlineWidth ||
          (cached.buttonOutlineOffset || 0) !== buttonOutlineOffset || (cached.backgroundBorderRadius || 0) !== backgroundBorderRadius ||
          (cached.backgroundOutlineWidth || 0) !== backgroundOutlineWidth || (cached.iconSelectedSize || 0) !== iconSelectedSize
        );

        if (!needsUpdate) continue;

        button.style.padding = `${buttonPadding}px`;
        button.style.borderRadius = `${buttonBorderRadius}px`;
        button.style.outlineWidth = `${buttonOutlineWidth}px`;
        button.style.outlineOffset = `${buttonOutlineOffset}px`;

        background.style.borderRadius = `${backgroundBorderRadius}px`;
        background.style.outlineWidth = `${backgroundOutlineWidth}px`;

        const iconPressed = button.querySelector('.content.icon.pressed');
        if (iconPressed) {
          iconPressed.style.width = `${iconSelectedSize}px`;
          iconPressed.style.height = `${iconSelectedSize}px`;
          iconPressed.style.top = `${buttonPadding}px`;
          iconPressed.style.right = `${buttonPadding}px`;
        }

        ButtonSystem.state.styleCache.set(button, {
          minSide, buttonPadding, buttonBorderRadius, buttonOutlineWidth, buttonOutlineOffset,
          backgroundBorderRadius, backgroundOutlineWidth, iconSelectedSize
        });
        
        processedCount++;
      }
      
      
      
      // 명도대비 라벨 업데이트
      this.updateButtonLabelsWithContrast();
    },
    
    async setupIconInjection() {
      // 렌더링 완료 후 안정된 상태에서 아이콘 주입
      await this.waitForRenderCompletion();
      
      const allButtons = document.querySelectorAll('.button');
      
      for (const button of allButtons) {
        const background = button.querySelector('.background');
        if (!background) continue;
        
        const isToggleButton = button.classList.contains('toggle');
        
        if (isToggleButton && !background.querySelector('.content.icon.pressed')) {
          const iconPressedSpan = document.createElement('span');
          iconPressedSpan.className = 'content icon pressed';
          
          // SVG 로딩 완료 확인 후 주입
                      if (ButtonSystem.state.iconSelectedSvgContent) {
              iconPressedSpan.innerHTML = ButtonSystem.state.iconSelectedSvgContent;
            }
          
          const iconEl = background.querySelector('.content.icon');
          if (iconEl && iconEl.parentNode) background.insertBefore(iconPressedSpan, iconEl);
          else background.insertBefore(iconPressedSpan, background.firstChild);
        }
      }
      
      for (const button of allButtons) {
        const isToggleButton = button.classList.contains('toggle');
        const isInitiallyPressed = button.classList.contains('pressed');
        
        if (isToggleButton) {
          button.dataset.isToggleButton = 'true';
          button.setAttribute('aria-pressed', isInitiallyPressed ? 'true' : 'false');
        }
              }
    }
  },
  
  async init() {
    // 1단계: SVG 로딩 완료 대기
    await AppUtils.SVGLoader.loadAllIcons();
    
    // 2단계: 아이콘 주입 완료 대기  
    await this.StyleManager.setupIconInjection();
    
    // 3단계: 팔레트 CSS 생성
    this.PaletteManager.generateCSS();
    
    // 4단계: 동적 스타일 적용
    this.StyleManager.applyDynamicStyles();
    
    // 5단계: 명도대비 자동 업데이트 매니저 설정
    this.StyleManager.setupContrastUpdateManager();
  }
};

window.addEventListener('DOMContentLoaded', async () => {
  /* ==============================
    🌌 전역 상태 관리자들
    ============================== */
  
  const ThemeManager = {
    THEMES: { LIGHT: 'light', DARK: 'dark' },
    STORAGE_KEY: 'theme-mode',
    MANUAL_MODE_KEY: 'manual-theme-mode',
    _domCache: { html: null, toggleButton: null, toggleLabel: null, liveRegion: null },
    currentTheme: 'light',
    isManualMode: false,
    
    init() {
      this._initDOMCache();
      this.loadSettings();
      this.setupEventListeners();
      this.applyCurrentState();
      this.syncToggleButton();
    },
    
    _initDOMCache() {
      this._domCache.html = document.documentElement;
      this._domCache.html.classList.remove('no-js');
      this._domCache.html.classList.add('js');
      this._domCache.toggleButton = document.querySelector('.theme-toggle');
      if (this._domCache.toggleButton) {
        this._domCache.toggleLabel = this._domCache.toggleButton.querySelector('.label');
      }
      this._domCache.liveRegion = document.getElementById('theme-announcer');
    },
    
    loadSettings() {
      const savedTheme = localStorage.getItem(this.STORAGE_KEY);
      const savedManualMode = localStorage.getItem(this.MANUAL_MODE_KEY);
      this.isManualMode = savedManualMode === 'true';
      if (this.isManualMode) {
        this.currentTheme = savedTheme === this.THEMES.DARK ? this.THEMES.DARK : this.THEMES.LIGHT;
      } else {
        this.currentTheme = this.THEMES.LIGHT;
      }
    },
    
    applyCurrentState() {
      const html = this._domCache.html;
      if (this.currentTheme === this.THEMES.DARK) {
        html.classList.add('dark');
      } else {
        html.classList.remove('dark');
      }
      if (this.isManualMode) {
        html.classList.add('manual-theme-mode');
      } else {
        html.classList.remove('manual-theme-mode');
      }
    },
    
    saveSettings() {
      localStorage.setItem(this.STORAGE_KEY, this.currentTheme);
      localStorage.setItem(this.MANUAL_MODE_KEY, this.isManualMode.toString());
    },
    
    syncToggleButton() {
      const toggleButton = this._domCache.toggleButton;
      if (toggleButton) {
        const isDarkTheme = this.currentTheme === this.THEMES.DARK;
        toggleButton.setAttribute('aria-pressed', isDarkTheme.toString());
        const label = this._domCache.toggleLabel;
        if (label) {
          label.innerHTML = isDarkTheme ? 'Light<br>테마' : 'Dark<br>테마';
        }
      }
    },
    
    toggle() {
      this.currentTheme = this.currentTheme === this.THEMES.LIGHT ? this.THEMES.DARK : this.THEMES.LIGHT;
      this.isManualMode = true;
      this.applyCurrentState();
      this.saveSettings();
      this.syncToggleButton();
      this.announceChange();
    },
    
    announceChange() {
      const themeLabel = this.currentTheme === this.THEMES.DARK ? 'Dark 테마' : 'Light 테마';
      const message = `${themeLabel}로 전환되었습니다.`;
      let liveRegion = this._domCache.liveRegion;
      if (!liveRegion) {
        liveRegion = document.createElement('div');
        liveRegion.id = 'theme-announcer';
        liveRegion.setAttribute('aria-live', 'polite');
        liveRegion.setAttribute('aria-atomic', 'true');
        liveRegion.style.position = 'absolute';
        liveRegion.style.left = '-10000px';
        liveRegion.style.width = '1px';
        liveRegion.style.height = '1px';
        liveRegion.style.overflow = 'hidden';
        document.body.appendChild(liveRegion);
        this._domCache.liveRegion = liveRegion;
      }
      liveRegion.textContent = message;
    },
    
    setupEventListeners() {
      const toggleButton = document.querySelector('.theme-toggle');
      if (toggleButton) {
        toggleButton.addEventListener('click', () => this.toggle());
      }
      document.addEventListener('keydown', (e) => {
        if (e.ctrlKey && e.altKey && e.key.toLowerCase() === 'h') {
          e.preventDefault();
          this.toggle();
        }
      });
    }
  };

  const LargeTextManager = {
    MODES: { DEFAULT: 'default', LARGE: 'large' },
    STORAGE_KEY: 'large-mode',
    _domCache: { html: null, toggleButton: null, toggleLabel: null, liveRegion: null },
    currentMode: 'default',
    
    init() {
      this._initDOMCache();
      this.loadSettings();
      this.setupEventListeners();
      this.applyCurrentState();
      this.syncToggleButton();
    },
    
    _initDOMCache() {
      this._domCache.html = document.documentElement;
      this._domCache.toggleButton = document.querySelector('.large-toggle');
      if (this._domCache.toggleButton) {
        this._domCache.toggleLabel = this._domCache.toggleButton.querySelector('.label');
      }
      this._domCache.liveRegion = document.getElementById('large-announcer');
    },
    
    loadSettings() {
      const savedMode = localStorage.getItem(this.STORAGE_KEY);
      this.currentMode = savedMode === this.MODES.LARGE ? this.MODES.LARGE : this.MODES.DEFAULT;
    },
    
    applyCurrentState() {
      const html = this._domCache.html;
      if (this.currentMode === this.MODES.LARGE) {
        html.classList.add('large');
      } else {
        html.classList.remove('large');
      }
    },
    
    saveSettings() {
      localStorage.setItem(this.STORAGE_KEY, this.currentMode);
    },
    
    syncToggleButton() {
      const toggleButton = this._domCache.toggleButton;
      if (toggleButton) {
        const isLargeMode = this.currentMode === this.MODES.LARGE;
        toggleButton.setAttribute('aria-pressed', isLargeMode.toString());
        const label = this._domCache.toggleLabel;
        if (label) {
          label.innerHTML = isLargeMode ? '기본<br>글씨' : '큰글씨<br>모드';
        }
      }
    },
    
    toggle() {
      this.currentMode = this.currentMode === this.MODES.DEFAULT ? this.MODES.LARGE : this.MODES.DEFAULT;
      this.applyCurrentState();
      this.saveSettings();
      this.syncToggleButton();
      this.announceChange();
    },
    
    announceChange() {
      const modeLabel = this.currentMode === this.MODES.LARGE ? '큰글씨 모드' : '기본 글씨 크기';
      const message = `${modeLabel}로 전환되었습니다.`;
      let liveRegion = this._domCache.liveRegion;
      if (!liveRegion) {
        liveRegion = document.createElement('div');
        liveRegion.id = 'large-announcer';
        liveRegion.setAttribute('aria-live', 'polite');
        liveRegion.setAttribute('aria-atomic', 'true');
        liveRegion.style.position = 'absolute';
        liveRegion.style.left = '-10000px';
        liveRegion.style.width = '1px';
        liveRegion.style.height = '1px';
        liveRegion.style.overflow = 'hidden';
        document.body.appendChild(liveRegion);
        this._domCache.liveRegion = liveRegion;
      }
      liveRegion.textContent = message;
    },
    
    setupEventListeners() {
      const toggleButton = document.querySelector('.large-toggle');
      if (toggleButton) {
        toggleButton.addEventListener('click', () => this.toggle());
      }
      document.addEventListener('keydown', (e) => {
        if (e.ctrlKey && e.altKey && e.key.toLowerCase() === 'l') {
          e.preventDefault();
          this.toggle();
        }
      });
    }
  };
  
  const SizeControlManager = {
    DEFAULT_WIDTH: 256,
    DEFAULT_HEIGHT: 256,
    _domCache: { widthSlider: null, heightSlider: null, widthValue: null, heightValue: null, resetButton: null, allButtons: null },
    currentWidth: 256,
    currentHeight: 256,
    
    init() {
      this._initDOMCache();
      this.setupEventListeners();
      this.updateDisplay();
    },
    
    _initDOMCache() {
      this._domCache.widthSlider = document.querySelector('.button-width');
      this._domCache.heightSlider = document.querySelector('.button-height');
      this._domCache.widthValue = document.querySelector('.width-value');
      this._domCache.heightValue = document.querySelector('.height-value');
      this._domCache.resetButton = document.querySelector('.scaling.reset');
      this._domCache.allButtons = document.querySelectorAll('.button');
    },
    
    setupEventListeners() {
      if (this._domCache.widthSlider) {
        this._domCache.widthSlider.addEventListener('input', (e) => {
          this.currentWidth = parseInt(e.target.value);
          this.updateButtonSizes();
          this.updateDisplay();
        });
      }
      if (this._domCache.heightSlider) {
        this._domCache.heightSlider.addEventListener('input', (e) => {
          this.currentHeight = parseInt(e.target.value);
          this.updateButtonSizes();
          this.updateDisplay();
        });
      }
      if (this._domCache.resetButton) {
        this._domCache.resetButton.addEventListener('click', () => {
          this.resetToDefault();
        });
      }
    },
    
    updateButtonSizes() {
      this._domCache.allButtons.forEach(button => {
        button.style.width = `${this.currentWidth}px`;
        button.style.height = `${this.currentHeight}px`;
      });
      if (typeof ButtonSystem !== 'undefined' && ButtonSystem.StyleManager) {
        requestAnimationFrame(() => {
          ButtonSystem.StyleManager.applyDynamicStyles();
        });
      }
    },
    
    updateDisplay() {
      if (this._domCache.widthValue) {
        this._domCache.widthValue.textContent = `${this.currentWidth}px`;
      }
      if (this._domCache.heightValue) {
        this._domCache.heightValue.textContent = `${this.currentHeight}px`;
      }
    },
    
    resetToDefault() {
      this.currentWidth = this.DEFAULT_WIDTH;
      this.currentHeight = this.DEFAULT_HEIGHT;
      if (this._domCache.widthSlider) {
        this._domCache.widthSlider.value = this.currentWidth;
      }
      if (this._domCache.heightSlider) {
        this._domCache.heightSlider.value = this.currentHeight;
      }
      this.updateButtonSizes();
      this.updateDisplay();
    }
  };

/* ==============================
  🎛️ 커스텀 팔레트 시스템 모듈
  ============================== */

  const CustomPaletteManager = {
    CUSTOM_PALETTE_NAME: 'custom',
    _domCache: { lightInputs: {}, darkInputs: {}, resetBtn: null, testButtons: null },
    currentPalette: { name: 'custom' },
    
/* ==============================
  🌈 3D 색상 선택기 모듈
  ============================== */

      CustomColorPicker: {
        // 3D 구체 상태 관리 (쿼터니언 기반)
        sphereState: {
          dragging: false,
          v0: null,
          Q: [1, 0, 0, 0],  // 쿼터니언 [w, x, y, z]
          last: [0, 0],     // 마지막 포인터 위치
          zoom: 1.0,
          selectedColor: { h: 0, s: 50, l: 50 },
          isDragging: false
        },
      
      // ========================================
      // 🚀 초기화 시스템
      // ========================================
      
      init() {
        this.generateLightThemePickers();
        this.generateDarkThemePickers();
        this.setupColorDisplays();
        this.setup3DCanvasInteraction();
        this.setupHexInputs();
      },
      
      // ========================================
      // 🎨 UI 생성 시스템
      // ========================================
      
      generateLightThemePickers() {
        const lightContainer = document.getElementById('light-color-pickers');
        if (!lightContainer) return;
        
        const lightPickers = [
          { id: 'light-content-default', label: '콘텐츠(기본)', color: '#FFFFFF', hex: '#FFFFFFFF', hue: 0, alpha: 255 },
          { id: 'light-content-pressed', label: '콘텐츠(눌림)', color: '#8C532C', hex: '#8C532CFF', hue: 25, alpha: 255 },
          { id: 'light-content-disabled', label: '콘텐츠(비활성)', color: '#8C532C', hex: '#8C532CFF', hue: 25, alpha: 255 },
          { id: 'light-background-default', label: '배경(기본)', color: '#A4693F', hex: '#A4693FFF', hue: 25, alpha: 255 },
          { id: 'light-background-pressed', label: '배경(눌림)', color: '#EEDCD2', hex: '#EEDCD2FF', hue: 25, alpha: 255 },
          { id: 'light-background-disabled', label: '배경(비활성)', color: 'transparent', hex: '#00000000', hue: 0, alpha: 0 },
          { id: 'light-border-default', label: '테두리(기본)', color: '#A4693F', hex: '#A4693FFF', hue: 25, alpha: 255 },
          { id: 'light-border-pressed', label: '테두리(눌림)', color: '#8C532C', hex: '#8C532CFF', hue: 25, alpha: 255 },
          { id: 'light-border-disabled', label: '테두리(비활성)', color: '#8C532C', hex: '#8C532CFF', hue: 25, alpha: 255 }
        ];
        
        lightPickers.forEach(picker => {
          const html = `
            <div class="palette-input-group">
              <label for="${picker.id}">${picker.label}:</label>
              <div class="custom-color-picker" data-target="${picker.id}">
                <div class="color-display" style="background: ${picker.color}"></div>
                <div class="color-picker-panel">
                  <div class="canvas-container">
                    <canvas class="color-canvas-3d" width="600" height="600"></canvas>
                    <div class="sphere-info">
                      <small>🌐 3D 색상 구체 | 드래그: 회전 | 휠: 알파 조절</small>
                    </div>
                  </div>
                  <div class="color-input-group">
                    <label>색상 코드</label>
                    <input type="text" class="panel-hex-input" value="${picker.hex}" maxlength="9" placeholder="#RRGGBBAA">
                  </div>
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
          { id: 'dark-content-default', label: '콘텐츠(기본)', color: '#000000', hex: '#000000FF', hue: 0, alpha: 255 },
          { id: 'dark-content-pressed', label: '콘텐츠(눌림)', color: '#FFEF80', hex: '#FFEF80FF', hue: 54, alpha: 255 },
          { id: 'dark-content-disabled', label: '콘텐츠(비활성)', color: '#FFE100', hex: '#FFE100FF', hue: 54, alpha: 255 },
          { id: 'dark-background-default', label: '배경(기본)', color: '#FFE100', hex: '#FFE100FF', hue: 54, alpha: 255 },
          { id: 'dark-background-pressed', label: '배경(눌림)', color: '#241F00', hex: '#241F00FF', hue: 54, alpha: 255 },
          { id: 'dark-background-disabled', label: '배경(비활성)', color: 'transparent', hex: '#00000000', hue: 0, alpha: 0 },
          { id: 'dark-border-default', label: '테두리(기본)', color: '#FFE100', hex: '#FFE100FF', hue: 54, alpha: 255 },
          { id: 'dark-border-pressed', label: '테두리(눌림)', color: '#FFEF80', hex: '#FFEF80FF', hue: 54, alpha: 255 },
          { id: 'dark-border-disabled', label: '테두리(비활성)', color: '#FFE100', hex: '#FFE100FF', hue: 54, alpha: 255 }
        ];
        
        darkPickers.forEach(picker => {
          const html = `
            <div class="palette-input-group">
              <label for="${picker.id}">${picker.label}:</label>
              <div class="custom-color-picker" data-target="${picker.id}">
                <div class="color-display" style="background: ${picker.color}"></div>
                <div class="color-picker-panel">
                  <div class="canvas-container">
                    <canvas class="color-canvas-3d" width="600" height="600"></canvas>
                    <div class="sphere-info">
                      <small>🌐 3D 색상 구체 | 드래그: 회전 | 휠: 알파 조절</small>
                    </div>
                  </div>
                  <div class="color-input-group">
                    <label>색상 코드</label>
                    <input type="text" class="panel-hex-input" value="${picker.hex}" maxlength="9" placeholder="#RRGGBBAA">
                  </div>
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
          const ctx = canvas3D.getContext('2d');
          ColorSphereSystem.render3D(ctx, this.sphereState);
        }
      },
      
      // 구체 렌더링은 ColorSphereSystem.render3D로 이관됨
      
      setup3DCanvasInteraction() {
        // SphericalDynamics로 상호작용 설정
        const handleCanvasSetup = (canvas) => {
          SphericalDynamics.setupCanvasInteraction(
            canvas, 
            this.sphereState, 
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
            
            // 쿼터니언으로 회전 적용
            const rotatedVector = SphericalDynamics.rotateVector(this.sphereState.Q, [screenX, screenY, screenZ]);
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
          const color = ColorSphereSystem.calculateColor(theta, phi);
          const { r, g, b } = color;
            
            // 8자리 헥스코드로 직접 처리
            this.sphereState.selectedColor = { r, g, b, hue };
            
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
            const hexColor = ColorSystem.rgbaToHex(r, g, b, alpha);
            
            this.updateColorInputs(targetId, rgb, alpha, hexColor);
            
            // 구체 다시 그리기 (선택점 업데이트, 투명도 반영)
            const ctx = canvas.getContext('2d');
            ColorSphereSystem.render3D(ctx, this.sphereState);
          }
        };
        
        this.selectColorAt3D = selectColorAt3D;
        

        
        // 뷰포트 중심점 색상 실시간 업데이트
        this.updateCenterColorRealtime = (canvas) => {
          // 화면 중심점 (0, 0, 1) 3D 구체 표면
          const screenX = 0;  // 중심점
          const screenY = 0;  // 중심점  
          const screenZ = 1;  // 3D 구체 앞면
          
          // 쿼터니언으로 회전 적용
          const rotatedVector = SphericalDynamics.rotateVector(this.sphereState.Q, [screenX, screenY, screenZ]);
          const [rotatedX, rotatedY, rotatedZ] = rotatedVector;
          
          // 3D 좌표를 구면 좌표로 변환
          const phi = Math.atan2(rotatedY, rotatedX);  // 경도 (-π ~ π)
          const theta = Math.acos(Math.max(-1, Math.min(1, rotatedZ)));  // 위도 (0 ~ π)

          
          // 중심점도 직접 RGB 헥스코드 스케일링 (캘리브레이션)
          let hue = ((phi + Math.PI) / (2 * Math.PI)) * 360;
          if (hue >= 360) hue = 0;
          
          const lightnessRatio = ((Math.PI - theta) / Math.PI); // 0(남극)~1(북극)
          // 기본 순색 계산
          const h6 = Math.floor(hue / 60) % 6;
          const f = (hue % 60) / 60;
          let baseR, baseG, baseB;
          
          switch(h6) {
            case 0: baseR = 255; baseG = Math.round(f * 255); baseB = 0; break;
            case 1: baseR = Math.round((1-f) * 255); baseG = 255; baseB = 0; break;
            case 2: baseR = 0; baseG = 255; baseB = Math.round(f * 255); break;
            case 3: baseR = 0; baseG = Math.round((1-f) * 255); baseB = 255; break;
            case 4: baseR = Math.round(f * 255); baseG = 0; baseB = 255; break;
            case 5: baseR = 255; baseG = 0; baseB = Math.round((1-f) * 255); break;
          }
          
          // 위도에 따른 채도 계산 (적도에서 최대, 극지방에서 0)
          const saturationByLatitude = Math.sin(theta);  // 적도(θ=π/2)에서 1, 극지방에서 0
          const totalSaturation = saturationByLatitude;  // 중심점이므로 거리 요소 제외
          
          // 명도와 채도 동시 적용
          const gray = Math.round(lightnessRatio * 255);
          const r = Math.round(gray + (baseR - gray) * totalSaturation);
          const g = Math.round(gray + (baseG - gray) * totalSaturation);
          const b = Math.round(gray + (baseB - gray) * totalSaturation);
          
          // 8자리 헥스코드로 직접 처리
          this.sphereState.selectedColor = { r, g, b, hue };
          
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
          const hexColor = ColorSystem.rgbaToHex(r, g, b, alpha);
          
          // UI 업데이트 (드래그 시 실시간 입력값 변경)
          requestAnimationFrame(() => {
            this.updateColorInputs(targetId, rgb, alpha, hexColor);
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
          const rgb = ColorSystem.hsvToRgb(hue, saturation, value);
          const hexColor = ColorSystem.rgbaToHex(rgb.r, rgb.g, rgb.b, alpha);
          
          this.updateColorInputs(targetId, rgb, alpha, hexColor);
        };
        
        document.querySelectorAll('.color-canvas-3d').forEach(canvas => {
          handleCanvasSetup(canvas);
          
          // 휠 이벤트 (알파 조절)
          canvas.addEventListener('wheel', (e) => {
            e.preventDefault();
            
            const picker = canvas.closest('.custom-color-picker');
            const panelHexInput = picker.querySelector('.panel-hex-input');
            
            if (panelHexInput) {
              const currentHex = panelHexInput.value.replace('#', '');
              let currentAlpha = 255; // 기본값
              
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
                ColorSphereSystem.render3D(ctx3d, canvas3d.className);
              }
              
              // CSS 변수 및 UI 업데이트
              this.updateColorInputs(targetId, {r, g, b}, a, fullHex);
              

            }
          });
        });
            },
      
      // ========================================
      // 🔄 상태 업데이트 시스템
      // ========================================
      
      updateColorInputs(targetId, rgb, alpha, hexColor) {
        const picker = document.querySelector(`[data-target="${targetId}"]`);
        const hexInput = picker?.parentElement?.querySelector('.hex-input');
        const panelHexInput = picker?.querySelector('.panel-hex-input');
        const display = picker?.querySelector('.color-display');
        
        // 외부 hex 입력 업데이트
        if (hexInput) hexInput.value = hexColor;
        
        // 패널 내 hex 입력 업데이트
        if (panelHexInput) panelHexInput.value = hexColor;
        
        // 컬러 디스플레이 업데이트
        if (display) display.style.background = hexColor;
        
        // 실시간 CSS 변수 업데이트
        this.updateCSSVariable(targetId, hexColor);
        
        // 버튼 적용 및 명도대비 업데이트
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
          
        }
      },



      
      rgbToHsl(r, g, b) {
        r /= 255; g /= 255; b /= 255;
        const max = Math.max(r, g, b), min = Math.min(r, g, b);
        let h, s, l = (max + min) / 2;
        
        if (max === min) {
          h = s = 0;
        } else {
          const d = max - min;
          s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
          switch (max) {
            case r: h = (g - b) / d + (g < b ? 6 : 0); break;
            case g: h = (b - r) / d + 2; break;
            case b: h = (r - g) / d + 4; break;
          }
          h /= 6;
        }
        
        return { h: h * 360, s: s * 100, l: l * 100 };
      },
      
      hslToRgb(h, s, l) {
        // 입력값 정규화 및 범위 보정
        h = ((h % 360) + 360) % 360;  // 0-360 범위로 정규화
        s = Math.max(0, Math.min(100, s)) / 100;  // 0-1 범위로 정규화
        l = Math.max(0, Math.min(100, l)) / 100;  // 0-1 범위로 정규화
        
        // HSL to RGB 정확한 변환 공식
        const c = (1 - Math.abs(2 * l - 1)) * s;
        const x = c * (1 - Math.abs((h / 60) % 2 - 1));
        const m = l - c / 2;
        
        let r = 0, g = 0, b = 0;
        
        if (h >= 0 && h < 60) {
          r = c; g = x; b = 0;
        } else if (h >= 60 && h < 120) {
          r = x; g = c; b = 0;
        } else if (h >= 120 && h < 180) {
          r = 0; g = c; b = x;
        } else if (h >= 180 && h < 240) {
          r = 0; g = x; b = c;
        } else if (h >= 240 && h < 300) {
          r = x; g = 0; b = c;
        } else if (h >= 300 && h < 360) {
          r = c; g = 0; b = x;
        }
        
        // 0-255 범위로 변환 (정확한 반올림)
        return {
          r: Math.max(0, Math.min(255, Math.round((r + m) * 255))),
          g: Math.max(0, Math.min(255, Math.round((g + m) * 255))),
          b: Math.max(0, Math.min(255, Math.round((b + m) * 255)))
        };
      }
    },
    
    init() {
      this._initDOMCache();
      this.CustomColorPicker.init();
      
      // 동적 생성 완료 후 DOM 캐시 업데이트
      setTimeout(() => {
        this._updateDynamicDOMCache();
        this.setupEventListeners();
        this.generateAndApplyPalette();
      }, 200);
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
      
      // 커스텀 팔레트 변경 후 명도대비 강제 업데이트
      ButtonSystem.StyleManager.scheduleContrastUpdate();
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
      
      // Light 테마 기본값 (Primary1 팔레트 기반)
      const lightDefaults = {
        contentDefault: ['#FFFFFF', '#FFFFFFFF'],    // color-gray-14
        contentPressed: ['#8C532C', '#8C532CFF'],    // color-brown-02
        contentDisabled: ['#8C532C', '#8C532CFF'],   // color-brown-02
        backgroundDefault: ['#A4693F', '#A4693FFF'], // color-brown-03
        backgroundPressed: ['#EEDCD2', '#EEDCD2FF'], // color-brown-06
        backgroundDisabled: ['transparent', '#00000000'], // transparent
        borderDefault: ['#A4693F', '#A4693FFF'],     // color-brown-03
        borderPressed: ['#8C532C', '#8C532CFF'],     // color-brown-02
        borderDisabled: ['#8C532C', '#8C532CFF']     // color-brown-02
      };
      
      Object.entries(lightDefaults).forEach(([key, [colorValue, hexValue]]) => {
        const input = this._domCache.lightInputs[key];
        if (input) {
          input.value = hexValue; // hex 입력에는 hex 값 직접 설정
          
          // 3D 색상 선택기 UI 업데이트
          const targetId = `light-${key.replace(/([A-Z])/g, '-$1').toLowerCase()}`;
          const picker = document.querySelector(`[data-target="${targetId}"]`);
          if (picker) {
            const colorDisplay = picker.querySelector('.color-display');
            const panelHexInput = picker.querySelector('.panel-hex-input');
            if (colorDisplay) colorDisplay.style.background = hexValue;
            if (panelHexInput) panelHexInput.value = hexValue;
          }
        }
      });
      
      // Dark 테마 기본값 (Primary1 팔레트 기반)
      const darkDefaults = {
        contentDefault: ['#000000', '#000000FF'],    // color-gray-01
        contentPressed: ['#FFEF80', '#FFEF80FF'],    // color-yellow-04
        contentDisabled: ['#FFE100', '#FFE100FF'],   // color-yellow-03
        backgroundDefault: ['#FFE100', '#FFE100FF'], // color-yellow-03
        backgroundPressed: ['#241F00', '#241F00FF'], // color-yellow-01
        backgroundDisabled: ['transparent', '#00000000'], // transparent
        borderDefault: ['#FFE100', '#FFE100FF'],     // color-yellow-03
        borderPressed: ['#FFEF80', '#FFEF80FF'],     // color-yellow-04
        borderDisabled: ['#FFE100', '#FFE100FF']     // color-yellow-03
      };
      
      Object.entries(darkDefaults).forEach(([key, [colorValue, hexValue]]) => {
        const input = this._domCache.darkInputs[key];
        if (input) {
          input.value = hexValue; // hex 입력에는 hex 값 직접 설정
          
          // 3D 색상 선택기 UI 업데이트
          const targetId = `dark-${key.replace(/([A-Z])/g, '-$1').toLowerCase()}`;
          const picker = document.querySelector(`[data-target="${targetId}"]`);
          if (picker) {
            const colorDisplay = picker.querySelector('.color-display');
            const panelHexInput = picker.querySelector('.panel-hex-input');
            if (colorDisplay) colorDisplay.style.background = hexValue;
            if (panelHexInput) panelHexInput.value = hexValue;
          }
        }
      });
      
      // 3D 구체들을 기본 위치로 초기화
      this.reset3DSpheresToDefaults();
      
      // 모든 hex 입력에 input 이벤트 트리거 (실시간 업데이트)
      Object.values(this._domCache.lightInputs).forEach(input => {
        if (input) input.dispatchEvent(new Event('input', { bubbles: true }));
      });
      Object.values(this._domCache.darkInputs).forEach(input => {
        if (input) input.dispatchEvent(new Event('input', { bubbles: true }));
      });
      
      setTimeout(() => this.generateAndApplyPalette(), 100);
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
            const r = parseInt(hexValue.substr(0, 2), 16);
            const g = parseInt(hexValue.substr(2, 2), 16);
            const b = parseInt(hexValue.substr(4, 2), 16);
            
            // 구체 위치 찾기 및 이동
            const position = SphericalDynamics.findPosition('#' + hexValue.substr(0, 6));
            if (position) {
              // 각 구체마다 독립적인 sphereState 생성 (기존 상태 복사)
              const independentSphereState = {
                dragging: false,
                v0: null,
                Q: [1, 0, 0, 0], // 기본 쿼터니언으로 초기화
                last: [0, 0],
                zoom: this.CustomColorPicker.sphereState.zoom,
                selectedColor: { r, g, b },
                isDragging: false
              };
              
              // 해당 위치로 구체 회전 계산
              const targetVector = SphericalDynamics.sphericalToCartesian(1, position.theta, position.phi);
              const currentVector = [0, 0, 1]; // 기본 중심점
              
              // 회전 축과 각도 계산
              const axis = [
                currentVector[1] * targetVector[2] - currentVector[2] * targetVector[1],
                currentVector[2] * targetVector[0] - currentVector[0] * targetVector[2],
                currentVector[0] * targetVector[1] - currentVector[1] * targetVector[0]
              ];
              
              const dot = currentVector[0] * targetVector[0] + currentVector[1] * targetVector[1] + currentVector[2] * targetVector[2];
              const angle = Math.acos(Math.max(-1, Math.min(1, dot)));
              
              if (angle > 0.01) { // 의미있는 회전이 필요한 경우
                const normalizedAxis = SphericalDynamics.normalize(axis);
                const targetQ = SphericalDynamics.fromAxisAngle(normalizedAxis, angle);
                
                // 독립적인 상태로 애니메이션 (지연 시간 추가로 순차 실행)
                setTimeout(() => {
                  SphericalDynamics.animateToQuaternion(
                    independentSphereState, 
                    targetQ, 
                    canvas
                  );
                }, index * 100); // 각 구체마다 100ms씩 지연
              } else {
                // 회전이 필요 없는 경우 즉시 렌더링
                setTimeout(() => {
                  const ctx = canvas.getContext('2d');
                  ColorSphereSystem.render3D(ctx, independentSphereState);
                }, index * 50);
              }
            }
          }
        }
      });
      
      // 공유 sphereState도 기본값으로 초기화
      this.CustomColorPicker.sphereState.Q = [1, 0, 0, 0];
      this.CustomColorPicker.sphereState.selectedColor = { r: 255, g: 0, b: 0 };
    }
  };

/* ==============================
  🚀 시스템 초기화 및 무결성 검증
  ============================== */
  
  // HTML 구조 검증
  const requiredElements = ['#main-header', '#main-content', '#control-panel', '#demo-area'];
  const missingElements = requiredElements.filter(selector => !document.querySelector(selector));
  if (missingElements.length > 0) {
    console.error('❌ HTML 구조 오류 - 누락된 요소:', missingElements);
  }
  
  // CSS 변수 검증
  const testElement = document.createElement('div');
  document.body.appendChild(testElement);
  const computedStyle = getComputedStyle(testElement);
  const criticalVars = ['--primary1-background-color-default', '--color-system-01', '--font-family'];
  const missingVars = criticalVars.filter(varName => !computedStyle.getPropertyValue(varName));
  document.body.removeChild(testElement);
  if (missingVars.length > 0) {
    console.error('❌ CSS 변수 오류 - 누락된 변수:', missingVars);
  }
  
  // Manager 초기화 (종속성 순서)
  try {
    ThemeManager.init();
    LargeTextManager.init();
    SizeControlManager.init();
    CustomPaletteManager.init();
    await ButtonSystem.init();
  } catch (error) {
    console.error('❌ 시스템 초기화 실패:', error);
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
        
        // 상태 변경 후 명도대비 업데이트
        ButtonSystem.StyleManager.scheduleContrastUpdate();
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
});