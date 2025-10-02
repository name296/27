import { Topology } from './topology.js';

export const Mechanics = {
  // ========================================
  // ?뙇 ?꾩뿭 ?듯빀 ?됯뎄泥??곹깭
  // ========================================
  
  UnifiedSphereState: {
    dragging: false,
    v0: null,
    Q: [1, 0, 0, 0],  // 遺곴레??以묒떖 ?뺣젹
    last: [0, 0],
    zoom: 1.0,
    selectedColor: { r: 0, g: 0, b: 0 }, // ?뚮뜑留??됯뎄泥댁쓽 ?쒕㈃ 以묒떖???됱긽怨??쇱튂
    isDragging: false
  },

  // ========================================
  // ?? 珥덇린???쒖뒪??
  // ========================================
  
  // ?됯뎄泥?珥덇린???⑥닔 (肄붾뱶媛??섏〈??理쒖쟻??
  initializeColorSphere(selector = '#color-sphere-canvas', onUpdate = null) {
    const canvas = document.querySelector(selector);
    if (!canvas) return;
    
    // ?뚮뜑留?諛??명꽣?숈뀡 ?ㅼ젙
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    this.RenderColorSphere(ctx, this.UnifiedSphereState);
    
    // ?명꽣?숈뀡 ?ㅼ젙 (肄붾뱶媛??섏〈??理쒖쟻??
    this.setupCanvasInteraction(canvas, this.UnifiedSphereState, onUpdate);
    
    // ?뺣?/異뺤냼 ?щ씪?대뜑 ?ㅼ젙 (肄붾뱶媛??섏〈??理쒖쟻??
    this.setupZoomSlider(this.UnifiedSphereState, canvas);
    
    // ?됱긽 ?뺣낫 ?낅뜲?댄듃 ?ㅼ젙 (肄붾뱶媛??섏〈??理쒖쟻??
    this.setupColorInfoUpdate(this.UnifiedSphereState, canvas);
  },

  // ?뺣?/異뺤냼 ?щ씪?대뜑 ?ㅼ젙 ?⑥닔 (肄붾뱶媛??섏〈??理쒖쟻??
  setupZoomSlider(sphereState, canvas) {
    const zoomSlider = document.getElementById('zoom-slider');
    const zoomValue = document.querySelector('.zoom-value');
    
    if (!zoomSlider || !zoomValue) return;
    
    // ?щ씪?대뜑 ?대깽??由ъ뒪??
    zoomSlider.addEventListener('input', (e) => {
      sphereState.zoom = parseFloat(e.target.value);
      
      // 援ъ껜 ?ㅼ떆 洹몃━湲?
      this.RenderColorSphere(canvas.getContext('2d'), sphereState);
      
      // 媛??쒖떆 ?낅뜲?댄듃
      zoomValue.textContent = `${Math.round(sphereState.zoom * 100)}%`;
    });
    
    // 珥덇린媛??ㅼ젙
    zoomSlider.value = sphereState.zoom;
    zoomValue.textContent = `${Math.round(sphereState.zoom * 100)}%`;
  },

  // ?됱긽 ?뺣낫 ?낅뜲?댄듃 ?ㅼ젙 ?⑥닔 (肄붾뱶媛??섏〈??理쒖쟻??
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
    
    // 珥덇린 ?됱긽 ?ㅼ젙
    updateColorInfo();
    
    // 二쇨린???낅뜲?댄듃 (100ms留덈떎)
    setInterval(() => {
      if (sphereState.selectedColor) {
        updateColorInfo();
      }
    }, 100);
  },

  // ========================================
  // ?봽 醫뚰몴 蹂???쒖뒪??
  // ========================================
  
  // 吏곴탳醫뚰몴 ??援щ㈃醫뚰몴 蹂??
  cartesianToSpherical(x, y, z) {
    const r = Math.sqrt(x * x + y * y + z * z);
    return { r, theta: Math.acos(Math.max(-1, Math.min(1, z / r))), phi: Math.atan2(y, x) };
  },
  
  // 援щ㈃醫뚰몴 ??吏곴탳醫뚰몴 蹂??
  sphericalToCartesian(r, theta, phi) {
    return { x: r * Math.sin(theta) * Math.cos(phi), y: r * Math.sin(theta) * Math.sin(phi), z: r * Math.cos(theta) };
  },
  
  // ?붾㈃醫뚰몴 ??援щ㈃?쒕㈃ 醫뚰몴 蹂??
  screenToSphericalSurface(screenX, screenY, radius) {
    if (Math.sqrt(screenX * screenX + screenY * screenY) > radius) return null;    
    const cartesian = { x: screenX/radius, y: screenY/radius, z: Math.sqrt(radius * radius - screenX * screenX - screenY * screenY)/radius };
    return { screen: { x: screenX, y: screenY }, cartesian, spherical: this.cartesianToSpherical(cartesian.x, cartesian.y, cartesian.z) };
  },

  // 留덉슦???대┃ ??援щ㈃ 醫뚰몴
  mouseClickToSphericalCoordinates(screenX, screenY, canvas) {
    const rect = canvas.getBoundingClientRect();
    return this.screenToSphericalSurface(screenX - rect.width / 2, screenY - rect.height / 2, Math.min(rect.width, rect.height) / 2);
  },

  // ?됱긽 ??援щ㈃ 醫뚰몴 蹂??
  colorToCoordinate(hexColor) {
    for (let theta = 0; theta <= Math.PI; theta += 0.05) {
      for (let phi = -Math.PI; phi <= Math.PI; phi += 0.05) {
        const color = Topology.calculateColor(theta, phi);
        if (chroma.rgb(color.r, color.g, color.b).hex() === chroma(hexColor).hex()) return { theta, phi };
      }
    }
  },

  // ========================================
  // ?봽 ?뚯쟾 ?쒖뒪??
  // ========================================
  normalize(v) {
    const length = Math.sqrt(v.reduce((sum, val) => sum + val * val, 0));
    if (length === 0) throw new Error('?곷깹?곕뒗 ?뺢퇋?뷀븷 ???놁뒿?덈떎');
    return v.map(val => val / length);
  },
  
  // 荑쇳꽣?덉뼵 ?앹꽦
  fromAxisAngle(axis, angle) {
    const s = Math.sin(angle * 0.5);
    return [axis[0] * s, axis[1] * s, axis[2] * s, Math.cos(angle * 0.5)];
  },
  
  // 荑쇳꽣?덉뼵 怨깆뀍
  multiply(q1, q2) {
    return [
      q1[3] * q2[0] + q1[0] * q2[3] + q1[1] * q2[2] - q1[2] * q2[1],
      q1[3] * q2[1] - q1[0] * q2[2] + q1[1] * q2[3] + q1[2] * q2[0],
      q1[3] * q2[2] + q1[0] * q2[1] - q1[1] * q2[0] + q1[2] * q2[3],
      q1[3] * q2[3] - q1[0] * q2[0] - q1[1] * q2[1] - q1[2] * q2[2]
    ];
  },
  
  // 荑쇳꽣?덉뼵?쇰줈 踰≫꽣 ?뚯쟾
  rotateVector(q, v) {
    return this.multiply(this.multiply(q, [v[0], v[1], v[2], 0]), [-q[0], -q[1], -q[2], q[3]]).slice(0, 3);
  },
  
  // SLERP (援щ㈃ ?좏삎 蹂닿컙)
  slerp(q1, q2, t) {
    const dot = q1[0] * q2[0] + q1[1] * q2[1] + q1[2] * q2[2] + q1[3] * q2[3];
    const theta0 = Math.acos(Math.abs(dot));
    const theta = theta0 * t;
    const sinTheta0 = Math.sin(theta0);
    const s0 = Math.cos(theta) - dot * Math.sin(theta) / sinTheta0;
    const s1 = Math.sin(theta) / sinTheta0;
    return [s0 * q1[0] + s1 * q2[0], s0 * q1[1] + s1 * q2[1], s0 * q1[2] + s1 * q2[2], s0 * q1[3] + s1 * q2[3]];
  },
  
  // ?쒕옒洹??뚯쟾 怨꾩궛
  fromDragRotation(dx, dy, sensitivity = 0.005) {
    return Math.sqrt(dx * dx + dy * dy) * sensitivity < 1e-6 ? [1, 0, 0, 0] : this.fromAxisAngle(this.normalize([dy, -dx, 0]), Math.sqrt(dx * dx + dy * dy) * sensitivity);
  },
  
  // ?대┃ ?뚯쟾 怨꾩궛
  fromClickRotation(screenX, screenY) {
    return Math.sqrt(screenX * screenX + screenY * screenY) * Math.PI * 0.5 < 1e-6 ? [1, 0, 0, 0] : this.fromAxisAngle(this.normalize([screenY, -screenX, 0]), Math.sqrt(screenX * screenX + screenY * screenY) * Math.PI * 0.5);
  },
  
  // ========================================
  // ?렓 援ъ껜 ?쒕㈃ ?뚮뜑留?
  // ========================================
  
  // 3D 援ъ껜 ?뚮뜑留?(肄붾뱶媛??섏〈??理쒖쟻??
  RenderColorSphere(ctx, sphereState) {
    const width = ctx.canvas.width;
    const height = ctx.canvas.height;
    const centerX = width / 2;
    const centerY = height / 2;
    const radius = (Math.min(width, height) / 2 - 20) * sphereState.zoom;
    
    // 罹붾쾭??珥덇린??
    ctx.clearRect(0, 0, width, height);
    
    // 3D ?됱긽援ъ껜 ?뚮뜑留?
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
    
    // 以묒떖???쒖떆 (蹂???섏〈??理쒖쟻??
    if (sphereState.selectedColor) {
      const { r, g, b } = sphereState.selectedColor;
      ctx.fillStyle = `rgb(${r}, ${g}, ${b})`;
      ctx.beginPath();
      ctx.arc(centerX, centerY, 4, 0, 2 * Math.PI);
      ctx.fill();
      
      // ?鍮꾨릺???뚮몢由?(蹂???섏〈??理쒖쟻??
      const brightness = (r * 0.299 + g * 0.587 + b * 0.114);
      ctx.strokeStyle = brightness > 127 ? 'rgba(0,0,0,0.8)' : 'rgba(255,255,255,0.8)';
      ctx.lineWidth = 2;
      ctx.stroke();
    }
  },
  
  // ========================================
  // ?렜 ?곹샇?묒슜 ?쒖뒪??
  // ========================================
  
  // 3D 罹붾쾭???곹샇?묒슜 ?ㅼ젙 (肄붾뱶媛??섏〈??理쒖쟻??
  setupCanvasInteraction(canvas, sphereState, onUpdate) {
    let dragStartPos = null;
    let hasDragged = false;
    let ctx = canvas.getContext('2d');
    
    // pointerdown: ?쒕옒洹??쒖옉
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
    
    // ?쒕옒洹??뚯쟾
    canvas.addEventListener('pointermove', (e) => {
      if (!sphereState.dragging) return;
      
      e.preventDefault();
      e.stopPropagation();
      const dx = e.clientX - sphereState.last[0];
      const dy = e.clientY - sphereState.last[1];
      sphereState.last = [e.clientX, e.clientY];
      
      // ?쒕옒洹?媛먯?
      if (!hasDragged && dragStartPos) {
        if (Math.hypot(e.clientX - dragStartPos[0], e.clientY - dragStartPos[1]) > 3) hasDragged = true;
      }
      
      // ?뚯쟾 ?곸슜
      const dq = this.fromDragRotation(dx, dy, 1 / (0.45 * Math.min(canvas.clientWidth, canvas.clientHeight)));
      
      if (dq[0] !== 1) {
        sphereState.Q = this.multiply(sphereState.Q, dq);
      }
      
      // 以묒떖???됱긽 ?낅뜲?댄듃
      if (onUpdate) onUpdate(canvas);
      
      // 利됱떆 ?뚮뜑留?
      this.RenderColorSphere(ctx, sphereState);
    });
    
    // pointerup: ?쒕옒洹?醫낅즺
    canvas.addEventListener('pointerup', (e) => {
      e.preventDefault();
      e.stopPropagation();
      sphereState.dragging = false;
      sphereState.isDragging = false;
      canvas.releasePointerCapture(e.pointerId);
      canvas.style.cursor = 'grab';
      
      // 怨좏솕吏?理쒖쥌 ?뚮뜑留?
      requestAnimationFrame(() => {
        this.RenderColorSphere(ctx, sphereState);
      });
    });
    
    // ?대┃ ?뚯쟾
    canvas.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      if (!hasDragged) {
        const rect = canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        // ?대┃??吏?먯쓽 3D 醫뚰몴 怨꾩궛
        const coordinates = this.mouseClickToSphericalCoordinates(x, y, canvas);
        if (coordinates) {
          // ?대┃??吏?먯씠 以묒떖?먯씠 ?섎룄濡??뚯쟾 怨꾩궛
          const targetVector = [coordinates.cartesian.x, coordinates.cartesian.y, coordinates.cartesian.z];
          const currentVector = [0, 0, 1]; // ?꾩옱 以묒떖??(遺곴레)
          
          // ?뚯쟾 異뺢낵 媛곷룄 怨꾩궛
          const axis = [
            currentVector[1] * targetVector[2] - currentVector[2] * targetVector[1],
            currentVector[2] * targetVector[0] - currentVector[0] * targetVector[2],
            currentVector[0] * targetVector[1] - currentVector[1] * targetVector[0]
          ];
          
          const angle = Math.acos(Math.max(-1, Math.min(1, currentVector[0] * targetVector[0] + currentVector[1] * targetVector[1] + currentVector[2] * targetVector[2])));
          
          if (angle > 0.01) {
            // 遺?쒕윭???좊땲硫붿씠?섏쑝濡?以묒떖???대룞
            this.animateToQuaternion(sphereState, this.fromAxisAngle(this.normalize(axis), angle), canvas);
          }
        }
      }
      
      // ?뚮옒洹?珥덇린??
      hasDragged = false;
      dragStartPos = null;
    });
    
    // wheel: ?뚰뙆 議곗젅
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
        
        // ?뚰뙆媛?議곗젅
        const alphaChange = e.deltaY > 0 ? -4 : 4;
        alpha = Math.max(0, Math.min(255, alpha + alphaChange));
        
        const newHex = currentHex.substr(0, 6) + alpha.toString(16).padStart(2, '0').toUpperCase();
        panelHexInput.value = '#' + newHex;
        
        // ?대깽???몃━嫄?(湲곗〈 諛⑹떇 ?좎?)
        panelHexInput.dispatchEvent(new Event('input', { bubbles: true }));
        
        // ?щ챸??蹂?????낅뜲?댄듃 (?깅뒫 理쒖쟻??
        setTimeout(() => {
          if (window.ButtonSystem && window.ButtonSystem.StyleManager) {
            window.ButtonSystem.StyleManager.scheduleUpdate();
          }
        }, 100);
      }
    });
    },
  // ?대┃ ?뚯쟾 ?좊땲硫붿씠??
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
