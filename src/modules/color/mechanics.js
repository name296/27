/* ==============================
  🌍 역학 시스템 모듈
  ============================== */

import { Topology } from './topology.js';
import { ColorConverter } from './converter.js';

export const Mechanics = {
  UnifiedSphereState: {
    dragging: false,
    v0: null,
    Q: [1, 0, 0, 0],
    last: [0, 0],
    zoom: 1.0,
    selectedColor: { r: 0, g: 0, b: 0 },
    isDragging: false
  },

  initializeColorSphere(selector = '#color-sphere-canvas', onUpdate = null) {
    const canvas = document.querySelector(selector);
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    this.RenderColorSphere(ctx, this.UnifiedSphereState);
    
    this.setupCanvasInteraction(canvas, this.UnifiedSphereState, onUpdate);
    this.setupZoomSlider(this.UnifiedSphereState, canvas);
    this.setupColorInfoUpdate(this.UnifiedSphereState, canvas);
  },

  setupZoomSlider(sphereState, canvas) {
    const zoomSlider = document.getElementById('zoom-slider');
    const zoomValue = document.querySelector('.zoom-value');
    
    if (!zoomSlider || !zoomValue) return;
    
    zoomSlider.addEventListener('input', (e) => {
      sphereState.zoom = parseFloat(e.target.value);
      this.RenderColorSphere(canvas.getContext('2d'), sphereState);
      zoomValue.textContent = `${Math.round(sphereState.zoom * 100)}%`;
    });
    
    zoomSlider.value = sphereState.zoom;
    zoomValue.textContent = `${Math.round(sphereState.zoom * 100)}%`;
  },

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
  },

  cartesianToSpherical(x, y, z) {
    const r = Math.sqrt(x * x + y * y + z * z);
    return { r, theta: Math.acos(Math.max(-1, Math.min(1, z / r))), phi: Math.atan2(y, x) };
  },
  
  sphericalToCartesian(r, theta, phi) {
    return { x: r * Math.sin(theta) * Math.cos(phi), y: r * Math.sin(theta) * Math.sin(phi), z: r * Math.cos(theta) };
  },
  
  screenToSphericalSurface(screenX, screenY, radius) {
    if (Math.sqrt(screenX * screenX + screenY * screenY) > radius) return null;    
    const cartesian = { x: screenX/radius, y: screenY/radius, z: Math.sqrt(radius * radius - screenX * screenX - screenY * screenY)/radius };
    return { screen: { x: screenX, y: screenY }, cartesian, spherical: this.cartesianToSpherical(cartesian.x, cartesian.y, cartesian.z) };
  },

  mouseClickToSphericalCoordinates(screenX, screenY, canvas) {
    const rect = canvas.getBoundingClientRect();
    return this.screenToSphericalSurface(screenX - rect.width / 2, screenY - rect.height / 2, Math.min(rect.width, rect.height) / 2);
  },

  colorToCoordinate(hexColor) {
    for (let theta = 0; theta <= Math.PI; theta += 0.05) {
      for (let phi = -Math.PI; phi <= Math.PI; phi += 0.05) {
        const color = Topology.calculateColor(theta, phi);
        if (chroma.rgb(color.r, color.g, color.b).hex() === chroma(hexColor).hex()) return { theta, phi };
      }
    }
  },

  normalize(v) {
    const length = Math.sqrt(v.reduce((sum, val) => sum + val * val, 0));
    if (length === 0) throw new Error('영벡터는 정규화할 수 없습니다');
    return v.map(val => val / length);
  },
  
  fromAxisAngle(axis, angle) {
    const s = Math.sin(angle * 0.5);
    return [axis[0] * s, axis[1] * s, axis[2] * s, Math.cos(angle * 0.5)];
  },
  
  multiply(q1, q2) {
    return [
      q1[3] * q2[0] + q1[0] * q2[3] + q1[1] * q2[2] - q1[2] * q2[1],
      q1[3] * q2[1] - q1[0] * q2[2] + q1[1] * q2[3] + q1[2] * q2[0],
      q1[3] * q2[2] + q1[0] * q2[1] - q1[1] * q2[0] + q1[2] * q2[3],
      q1[3] * q2[3] - q1[0] * q2[0] - q1[1] * q2[1] - q1[2] * q2[2]
    ];
  },
  
  rotateVector(q, v) {
    return this.multiply(this.multiply(q, [v[0], v[1], v[2], 0]), [-q[0], -q[1], -q[2], q[3]]).slice(0, 3);
  },
  
  slerp(q1, q2, t) {
    const dot = q1[0] * q2[0] + q1[1] * q2[1] + q1[2] * q2[2] + q1[3] * q2[3];
    const theta0 = Math.acos(Math.abs(dot));
    const theta = theta0 * t;
    const sinTheta0 = Math.sin(theta0);
    const s0 = Math.cos(theta) - dot * Math.sin(theta) / sinTheta0;
    const s1 = Math.sin(theta) / sinTheta0;
    return [s0 * q1[0] + s1 * q2[0], s0 * q1[1] + s1 * q2[1], s0 * q1[2] + s1 * q2[2], s0 * q1[3] + s1 * q2[3]];
  },
  
  fromDragRotation(dx, dy, sensitivity = 0.005) {
    return Math.sqrt(dx * dx + dy * dy) * sensitivity < 1e-6 ? [1, 0, 0, 0] : this.fromAxisAngle(this.normalize([dy, -dx, 0]), Math.sqrt(dx * dx + dy * dy) * sensitivity);
  },
  
  fromClickRotation(screenX, screenY) {
    return Math.sqrt(screenX * screenX + screenY * screenY) * Math.PI * 0.5 < 1e-6 ? [1, 0, 0, 0] : this.fromAxisAngle(this.normalize([screenY, -screenX, 0]), Math.sqrt(screenX * screenX + screenY * screenY) * Math.PI * 0.5);
  },
  
  RenderColorSphere(ctx, sphereState) {
    const width = ctx.canvas.width;
    const height = ctx.canvas.height;
    const centerX = width / 2;
    const centerY = height / 2;
    const radius = (Math.min(width, height) / 2 - 20) * sphereState.zoom;
    
    ctx.clearRect(0, 0, width, height);
    
    const imageData = ctx.createImageData(width, height);
    const pixels = imageData.data;
    
    for (let py = 0; py < height; py++) {
      for (let px = 0; px < width; px++) {
        const dx = px - centerX;
        const dy = py - centerY;
        const d2 = dx * dx + dy * dy;
        
        if (d2 <= radius * radius) {
          const z = Math.sqrt(radius * radius - d2);
          const v = [dx / radius, dy / radius, z / radius];
          const rotated = this.rotateVector(sphereState.Q, v);
          const spherical = this.cartesianToSpherical(rotated[0], rotated[1], rotated[2]);
          const color = Topology.calculateColor(spherical.theta, spherical.phi);
          
          const index = (py * width + px) * 4;
          pixels[index] = color.r;
          pixels[index + 1] = color.g;
          pixels[index + 2] = color.b;
          pixels[index + 3] = 255;
        }
      }
    }
    
    ctx.putImageData(imageData, 0, 0);
    
    const centerPoint = this.rotateVector(sphereState.Q, [0, 0, 1]);
    const spherical = this.cartesianToSpherical(centerPoint[0], centerPoint[1], centerPoint[2]);
    sphereState.selectedColor = Topology.calculateColor(spherical.theta, spherical.phi);
    
    ctx.beginPath();
    ctx.arc(centerX, centerY, 10, 0, Math.PI * 2);
    ctx.strokeStyle = 'rgba(255, 0, 225, 1)';
    ctx.lineWidth = 3;
    ctx.stroke();
  },
  
  setupCanvasInteraction(canvas, sphereState, onUpdate) {
    let lastTime = 0;
    const throttle = 16;
    
    const handleMove = (x, y) => {
      const now = Date.now();
      if (now - lastTime < throttle) return;
      lastTime = now;
      
      if (!sphereState.dragging) return;
      
      const dx = x - sphereState.last[0];
      const dy = y - sphereState.last[1];
      
      const dragQ = this.fromDragRotation(dx, dy);
      sphereState.Q = this.multiply(dragQ, sphereState.Q);
      
      this.RenderColorSphere(canvas.getContext('2d'), sphereState);
      
      sphereState.last = [x, y];
      
      if (onUpdate) onUpdate(sphereState.selectedColor);
    };
    
    canvas.addEventListener('mousedown', (e) => {
      sphereState.dragging = true;
      const rect = canvas.getBoundingClientRect();
      sphereState.last = [e.clientX - rect.left, e.clientY - rect.top];
    });
    
    canvas.addEventListener('mousemove', (e) => {
      if (!sphereState.dragging) return;
      const rect = canvas.getBoundingClientRect();
      handleMove(e.clientX - rect.left, e.clientY - rect.top);
    });
    
    canvas.addEventListener('mouseup', () => {
      sphereState.dragging = false;
    });
    
    canvas.addEventListener('mouseleave', () => {
      sphereState.dragging = false;
    });
    
    canvas.addEventListener('click', (e) => {
      const rect = canvas.getBoundingClientRect();
      const clickX = e.clientX - rect.left;
      const clickY = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      
      const dx = clickX - centerX;
      const dy = clickY - centerY;
      const distance = Math.sqrt(dx * dx + dy * dy);
      const radius = (Math.min(rect.width, rect.height) / 2 - 20) * sphereState.zoom;
      
      if (distance <= radius) {
        const clickQ = this.fromClickRotation(dx / radius, dy / radius);
        const targetQ = this.multiply(clickQ, sphereState.Q);
        
        const startQ = [...sphereState.Q];
        const startTime = Date.now();
        const duration = 300;
        
        const animate = () => {
          const elapsed = Date.now() - startTime;
          const progress = Math.min(elapsed / duration, 1);
          const t = progress < 0.5 ? 2 * progress * progress : 1 - Math.pow(-2 * progress + 2, 2) / 2;
          
          sphereState.Q = this.slerp(startQ, targetQ, t);
          this.RenderColorSphere(canvas.getContext('2d'), sphereState);
          
          if (onUpdate) onUpdate(sphereState.selectedColor);
          
          if (progress < 1) requestAnimationFrame(animate);
        };
        requestAnimationFrame(animate);
      }
    });
  }
};

