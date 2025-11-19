var __esm = (fn, res) => () => (fn && (res = fn(fn = 0)), res);

// src/app.js
var exports_app = {};
var ColorConverter3, Topology3, Mechanics3, AppUtils2, ButtonSystem3, ThemeManager2, LargeTextManager2, SizeControlManager2, CustomPaletteManager2, initializeApp = async () => {
  const requiredElements = ["#main-header", "#main-content", "#control-panel", "#demo-area"];
  const missingElements = requiredElements.filter((selector) => !document.querySelector(selector));
  if (missingElements.length > 0) {}
  const testElement = document.createElement("div");
  document.body.appendChild(testElement);
  const computedStyle = getComputedStyle(testElement);
  const criticalVars = ["--primary1-background-color-default", "--color-system-01", "--font-family"];
  const missingVars = criticalVars.filter((varName) => !computedStyle.getPropertyValue(varName));
  document.body.removeChild(testElement);
  if (missingVars.length > 0) {}
  try {
    ThemeManager2.init();
    LargeTextManager2.init();
    SizeControlManager2.init();
    CustomPaletteManager2.init();
    await ButtonSystem3.init();
  } catch (error) {
    throw error;
  }
  let resizeScheduled = false;
  window.addEventListener("resize", () => {
    if (resizeScheduled)
      return;
    resizeScheduled = true;
    requestAnimationFrame(() => {
      ButtonSystem3.StyleManager.applyDynamicStyles();
      resizeScheduled = false;
    });
  });
  document.addEventListener("click", (event) => {
    const button = event.target?.closest?.(".button");
    if (!button || button.getAttribute("aria-disabled") === "true" || button.dataset.isToggleButton !== "true")
      return;
    const wasPressed = button.classList.contains("pressed");
    const iconPressed = button.querySelector(".content.icon.pressed");
    if (wasPressed) {
      if (iconPressed)
        iconPressed.style.display = "none";
      requestAnimationFrame(() => {
        button.classList.remove("pressed");
        button.setAttribute("aria-pressed", "false");
        if (iconPressed)
          iconPressed.style.removeProperty("display");
      });
    } else {
      if (iconPressed)
        iconPressed.style.removeProperty("display");
      button.classList.add("pressed");
      button.setAttribute("aria-pressed", "true");
      ButtonSystem3.StyleManager.scheduleContrastUpdate();
    }
  }, false);
  const blockDisabledButtonEvents = (event) => {
    const disabledButton = event.target?.closest?.('.button[aria-disabled="true"]');
    if (disabledButton) {
      event.preventDefault();
      event.stopPropagation();
      if (typeof event.stopImmediatePropagation === "function")
        event.stopImmediatePropagation();
      return true;
    }
    return false;
  };
  document.addEventListener("click", blockDisabledButtonEvents, true);
  document.addEventListener("keydown", (event) => {
    const disabledButton = event.target?.closest?.('.button[aria-disabled="true"]');
    if (disabledButton && (event.key === " " || event.key === "Enter" || event.key === "NumpadEnter")) {
      event.preventDefault();
      event.stopPropagation();
      return;
    }
    const enabledButton = event.target?.closest?.(".button");
    if (enabledButton && enabledButton.getAttribute("aria-disabled") !== "true") {
      if (event.key === "Enter" || event.key === "NumpadEnter" || event.key === " ") {
        event.preventDefault();
        event.stopPropagation();
        const isToggleButton = enabledButton.classList.contains("toggle");
        if (isToggleButton) {
          const clickEvent = new MouseEvent("click", {
            bubbles: true,
            cancelable: true,
            button: 0
          });
          enabledButton.dispatchEvent(clickEvent);
        } else {
          enabledButton.classList.add("pressed");
          setTimeout(() => {
            enabledButton.classList.remove("pressed");
            const clickEvent = new MouseEvent("click", {
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
  document.addEventListener("keydown", (event) => {
    const focusedButton = document.activeElement;
    const isArrowKey = ["ArrowDown", "ArrowUp", "ArrowRight", "ArrowLeft", "Home", "End"].includes(event.key);
    if ((!focusedButton || !focusedButton.classList.contains("button")) && isArrowKey) {
      event.preventDefault();
      const firstButton = document.querySelector(".button");
      if (firstButton) {
        firstButton.focus();
      }
      return;
    }
    if (!focusedButton || !focusedButton.classList.contains("button")) {
      return;
    }
    let targetButton = null;
    const allButtons = Array.from(document.querySelectorAll(".button")).filter((btn) => btn.offsetParent !== null);
    switch (event.key) {
      case "ArrowRight":
        event.preventDefault();
        const currentIndex = allButtons.indexOf(focusedButton);
        const nextIndex = (currentIndex + 1) % allButtons.length;
        targetButton = allButtons[nextIndex];
        break;
      case "ArrowLeft":
        event.preventDefault();
        const currentIndex2 = allButtons.indexOf(focusedButton);
        const prevIndex = currentIndex2 === 0 ? allButtons.length - 1 : currentIndex2 - 1;
        targetButton = allButtons[prevIndex];
        break;
      case "ArrowDown":
        event.preventDefault();
        const currentContainer = focusedButton.closest(".showcase");
        const currentIndexForDown = allButtons.indexOf(focusedButton);
        for (let i = 1;i < allButtons.length; i++) {
          const nextIndex2 = (currentIndexForDown + i) % allButtons.length;
          const nextButton = allButtons[nextIndex2];
          const nextContainer = nextButton.closest(".showcase");
          if (nextContainer !== currentContainer) {
            targetButton = nextButton;
            break;
          }
        }
        break;
      case "ArrowUp":
        event.preventDefault();
        const currentContainerUp = focusedButton.closest(".showcase");
        const currentIndexUp = allButtons.indexOf(focusedButton);
        for (let i = 1;i < allButtons.length; i++) {
          const prevIndex2 = (currentIndexUp - i + allButtons.length) % allButtons.length;
          const prevButton = allButtons[prevIndex2];
          const prevContainer = prevButton.closest(".showcase");
          if (prevContainer !== currentContainerUp) {
            const buttonsInPrevContainer = allButtons.filter((btn) => btn.closest(".showcase") === prevContainer);
            targetButton = buttonsInPrevContainer[0];
            break;
          }
        }
        break;
      case "Home":
        event.preventDefault();
        targetButton = allButtons[0];
        break;
      case "End":
        event.preventDefault();
        targetButton = allButtons[allButtons.length - 1];
        break;
    }
    if (targetButton) {
      targetButton.focus();
    }
  }, true);
  document.addEventListener("mousedown", (event) => {
    const button = event.target?.closest?.(".button");
    if (button && button.getAttribute("aria-disabled") !== "true" && !button.classList.contains("toggle")) {
      button.classList.add("pressed");
    }
  }, true);
  document.addEventListener("mouseup", (event) => {
    const button = event.target?.closest?.(".button");
    if (button && button.classList.contains("pressed") && !button.classList.contains("toggle")) {
      button.classList.remove("pressed");
      ButtonSystem3.StyleManager.scheduleContrastUpdate();
    }
  }, true);
  document.addEventListener("mouseleave", (event) => {
    if (event.target && typeof event.target.closest === "function") {
      const button = event.target?.closest?.(".button");
      if (button && button.classList.contains("pressed") && !button.classList.contains("toggle")) {
        button.classList.remove("pressed");
        ButtonSystem3.StyleManager.scheduleUpdate();
      }
    }
  }, true);
  document.addEventListener("touchstart", (event) => {
    const button = event.target?.closest?.(".button");
    if (button && button.getAttribute("aria-disabled") !== "true" && !button.classList.contains("toggle")) {
      button.classList.add("pressed");
    }
  }, { passive: true });
  document.addEventListener("touchend", (event) => {
    const button = event.target?.closest?.(".button");
    if (button && button.classList.contains("pressed") && !button.classList.contains("toggle")) {
      button.classList.remove("pressed");
      ButtonSystem3.StyleManager.scheduleContrastUpdate();
    }
  }, { passive: true });
  document.addEventListener("touchcancel", (event) => {
    const button = event.target?.closest?.(".button");
    if (button && button.classList.contains("pressed") && !button.classList.contains("toggle")) {
      button.classList.remove("pressed");
      ButtonSystem3.StyleManager.scheduleContrastUpdate();
    }
  }, { passive: true });
  window.AppUtils = AppUtils2;
  window.ButtonSystem = ButtonSystem3;
  window.ThemeManager = ThemeManager2;
  window.LargeTextManager = LargeTextManager2;
  window.SizeControlManager = SizeControlManager2;
  window.CustomPaletteManager = CustomPaletteManager2;
};
var init_app = __esm(() => {
  ({ ColorConverter: ColorConverter3, Topology: Topology3, Mechanics: Mechanics3, AppUtils: AppUtils2, ButtonSystem: ButtonSystem3, ThemeManager: ThemeManager2, LargeTextManager: LargeTextManager2, SizeControlManager: SizeControlManager2, CustomPaletteManager: CustomPaletteManager2 } = window);
  if (document.readyState === "loading") {
    window.addEventListener("DOMContentLoaded", initializeApp);
  } else {
    initializeApp();
  }
});

// src/modules/color/converter.js
var ColorConverter2 = {
  rgbaToHex(r, g, b, a = 255) {
    return chroma.rgb(r, g, b).alpha(a / 255).hex("rgba").toUpperCase();
  },
  rgba(r, g, b, a = 255) {
    return { r, g, b, a };
  },
  hexToRgba(hex) {
    const color = chroma(hex);
    const rgb = color.rgb();
    return {
      r: rgb[0],
      g: rgb[1],
      b: rgb[2],
      a: Math.round(color.alpha() * 255)
    };
  },
  hsvToRgb(h, s, v) {
    const rgb = chroma.hsv(h, s, v).rgb();
    return {
      r: rgb[0],
      g: rgb[1],
      b: rgb[2]
    };
  },
  hsvToHex(h, s, v, a = 255) {
    return chroma.hsv(h, s, v).alpha(a / 255).hex("rgba").toUpperCase();
  },
  rgbToHsl(r, g, b) {
    const hsl = chroma.rgb(r, g, b).hsl();
    return {
      h: Math.round(hsl[0] || 0),
      s: Math.round(hsl[1] * 100),
      l: Math.round(hsl[2] * 100)
    };
  },
  hslToRgb(h, s, l) {
    const rgb = chroma.hsl(h, s, l).rgb();
    return {
      r: rgb[0],
      g: rgb[1],
      b: rgb[2]
    };
  },
  hslToHex(h, s, l, a = 255) {
    return chroma.hsl(h, s, l).alpha(a / 255).hex("rgba").toUpperCase();
  }
};

// src/modules/color/topology.js
var Topology2 = {
  COORDINATE_SYSTEM: {
    SPHERICAL: {
      NORTH_POLE: { theta: 0, phi: 0 },
      SOUTH_POLE: { theta: Math.PI, phi: 0 },
      EQUATOR: { theta: Math.PI / 2, phi: 0 }
    },
    CARTESIAN: {
      ORIGIN: { x: 0, y: 0, z: 0 },
      NORTH_POLE: { x: 0, y: 0, z: 1 },
      SOUTH_POLE: { x: 0, y: 0, z: -1 }
    },
    POLAR_COLORS: {
      NORTH_POLE: { r: 255, g: 255, b: 255 },
      SOUTH_POLE: { r: 0, g: 0, b: 0 }
    },
    SCREEN: {
      CENTER: { x: 0, y: 0 },
      UNIT_RADIUS: 1
    }
  },
  calculateColor(theta, phi) {
    const hue = (phi + Math.PI) / (2 * Math.PI) * 360;
    const h6 = Math.floor(hue / 60) % 6;
    const f = hue % 60 / 60;
    const getHueColor = () => {
      switch (h6) {
        case 0:
          return { r: 255, g: Math.round(f * 255), b: 0 };
        case 1:
          return { r: Math.round((1 - f) * 255), g: 255, b: 0 };
        case 2:
          return { r: 0, g: 255, b: Math.round(f * 255) };
        case 3:
          return { r: 0, g: Math.round((1 - f) * 255), b: 255 };
        case 4:
          return { r: Math.round(f * 255), g: 0, b: 255 };
        case 5:
          return { r: 255, g: 0, b: Math.round((1 - f) * 255) };
      }
    };
    const thetaDeg = theta * 180 / Math.PI;
    const lightnessRatio = thetaDeg < 90 ? 1 - (thetaDeg - 3) / 84 * 0.5 : 0.5 - (thetaDeg - 93) / 84 * 0.5;
    const { r: baseR, g: baseG, b: baseB } = getHueColor();
    const totalSaturation = Math.sin(theta);
    const gray = Math.round(lightnessRatio * 255);
    return {
      r: Math.round(gray + (baseR - gray) * totalSaturation),
      g: Math.round(gray + (baseG - gray) * totalSaturation),
      b: Math.round(gray + (baseB - gray) * totalSaturation)
    };
  },
  calculateColor2(theta, phi) {
    const thetaDeg = theta * 180 / Math.PI;
    const isPolarRegion = thetaDeg < 3 || thetaDeg > 177;
    const isEquatorRegion = Math.abs(thetaDeg - 90) < 3;
    if (isPolarRegion) {
      return thetaDeg < 3 ? this.COORDINATE_SYSTEM.POLAR_COLORS.NORTH_POLE : this.COORDINATE_SYSTEM.POLAR_COLORS.SOUTH_POLE;
    }
    const hue = (phi + Math.PI) / (2 * Math.PI) * 360;
    const h6 = Math.floor(hue / 60) % 6;
    const f = hue % 60 / 60;
    const getHueColor = () => {
      switch (h6) {
        case 0:
          return { r: 255, g: Math.round(f * 255), b: 0 };
        case 1:
          return { r: Math.round((1 - f) * 255), g: 255, b: 0 };
        case 2:
          return { r: 0, g: 255, b: Math.round(f * 255) };
        case 3:
          return { r: 0, g: Math.round((1 - f) * 255), b: 255 };
        case 4:
          return { r: Math.round(f * 255), g: 0, b: 255 };
        case 5:
          return { r: 255, g: 0, b: Math.round((1 - f) * 255) };
      }
    };
    if (isEquatorRegion) {
      return getHueColor();
    }
    const lightnessRatio = thetaDeg < 90 ? 1 - (thetaDeg - 3) / 84 * 0.5 : 0.5 - (thetaDeg - 93) / 84 * 0.5;
    const { r: baseR, g: baseG, b: baseB } = getHueColor();
    const totalSaturation = Math.sin(theta);
    const gray = Math.round(lightnessRatio * 255);
    return {
      r: Math.round(gray + (baseR - gray) * totalSaturation),
      g: Math.round(gray + (baseG - gray) * totalSaturation),
      b: Math.round(gray + (baseB - gray) * totalSaturation)
    };
  }
};

// src/modules/ui/color-sphere-ui.js
var ColorSphereUI = {
  setupZoomSlider(sphereState, canvas) {
    const zoomSlider = document.getElementById("zoom-slider");
    const zoomValue = document.querySelector(".zoom-value");
    if (!zoomSlider || !zoomValue)
      return;
    zoomSlider.addEventListener("input", (e) => {
      sphereState.zoom = parseFloat(e.target.value);
      window.Mechanics.RenderColorSphere(canvas.getContext("2d"), sphereState);
      zoomValue.textContent = `${Math.round(sphereState.zoom * 100)}%`;
    });
    zoomSlider.value = sphereState.zoom;
    zoomValue.textContent = `${Math.round(sphereState.zoom * 100)}%`;
  },
  setupColorInfoUpdate(sphereState, canvas) {
    const colorHex = document.querySelector(".color-hex");
    const colorRgb = document.querySelector(".color-rgb");
    const colorHsl = document.querySelector(".color-hsl");
    if (!colorHex || !colorRgb || !colorHsl)
      return;
    const updateColorInfo = () => {
      const hex = `#${sphereState.selectedColor.r.toString(16).padStart(2, "0")}${sphereState.selectedColor.g.toString(16).padStart(2, "0")}${sphereState.selectedColor.b.toString(16).padStart(2, "0")}`.toUpperCase();
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

// src/modules/color/mechanics.js
var Mechanics2 = {
  UnifiedSphereState: {
    dragging: false,
    v0: null,
    Q: [1, 0, 0, 0],
    last: [0, 0],
    zoom: 1,
    selectedColor: { r: 0, g: 0, b: 0 },
    isDragging: false
  },
  initializeColorSphere(selector = "#color-sphere-canvas", onUpdate = null) {
    const canvas = document.querySelector(selector);
    if (!canvas)
      return;
    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    this.RenderColorSphere(ctx, this.UnifiedSphereState);
    this.setupCanvasInteraction(canvas, this.UnifiedSphereState, onUpdate);
    ColorSphereUI.setupZoomSlider(this.UnifiedSphereState, canvas);
    ColorSphereUI.setupColorInfoUpdate(this.UnifiedSphereState, canvas);
  },
  cartesianToSpherical(x, y, z) {
    const r = Math.sqrt(x * x + y * y + z * z);
    return { r, theta: Math.acos(Math.max(-1, Math.min(1, z / r))), phi: Math.atan2(y, x) };
  },
  sphericalToCartesian(r, theta, phi) {
    return { x: r * Math.sin(theta) * Math.cos(phi), y: r * Math.sin(theta) * Math.sin(phi), z: r * Math.cos(theta) };
  },
  screenToSphericalSurface(screenX, screenY, radius) {
    if (Math.sqrt(screenX * screenX + screenY * screenY) > radius)
      return null;
    const cartesian = { x: screenX / radius, y: screenY / radius, z: Math.sqrt(radius * radius - screenX * screenX - screenY * screenY) / radius };
    return { screen: { x: screenX, y: screenY }, cartesian, spherical: this.cartesianToSpherical(cartesian.x, cartesian.y, cartesian.z) };
  },
  mouseClickToSphericalCoordinates(screenX, screenY, canvas) {
    const rect = canvas.getBoundingClientRect();
    return this.screenToSphericalSurface(screenX - rect.width / 2, screenY - rect.height / 2, Math.min(rect.width, rect.height) / 2);
  },
  colorToCoordinate(hexColor) {
    for (let theta = 0;theta <= Math.PI; theta += 0.05) {
      for (let phi = -Math.PI;phi <= Math.PI; phi += 0.05) {
        const color = Topology2.calculateColor(theta, phi);
        if (chroma.rgb(color.r, color.g, color.b).hex() === chroma(hexColor).hex())
          return { theta, phi };
      }
    }
  },
  normalize(v) {
    const length = Math.sqrt(v.reduce((sum, val) => sum + val * val, 0));
    if (length === 0)
      throw new Error("영벡터는 정규화할 수 없습니다");
    return v.map((val) => val / length);
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
    return Math.sqrt(dx * dx + dy * dy) * sensitivity < 0.000001 ? [1, 0, 0, 0] : this.fromAxisAngle(this.normalize([dy, -dx, 0]), Math.sqrt(dx * dx + dy * dy) * sensitivity);
  },
  fromClickRotation(screenX, screenY) {
    return Math.sqrt(screenX * screenX + screenY * screenY) * Math.PI * 0.5 < 0.000001 ? [1, 0, 0, 0] : this.fromAxisAngle(this.normalize([screenY, -screenX, 0]), Math.sqrt(screenX * screenX + screenY * screenY) * Math.PI * 0.5);
  },
  RenderColorSphere(ctx, sphereState) {
    const width = ctx.canvas.width;
    const height = ctx.canvas.height;
    const centerX = width / 2;
    const centerY = height / 2;
    const radius = (Math.min(width, height) / 2 - 20) * sphereState.zoom;
    ctx.clearRect(0, 0, width, height);
    const imageData = ctx.createImageData(width, height);
    const data = imageData.data;
    for (let y = 0;y < height; y++) {
      for (let x = 0;x < width; x++) {
        const dx = x - centerX;
        const dy = y - centerY;
        if (dx * dx + dy * dy <= radius * radius) {
          const screenX = dx / radius;
          const screenY = dy / radius;
          const screenZ = Math.sqrt(Math.max(0, 1 - screenX * screenX - screenY * screenY));
          const rotatedVector = this.rotateVector(sphereState.Q, [screenX, screenY, screenZ]);
          const color = Topology2.calculateColor(Math.acos(Math.max(-1, Math.min(1, rotatedVector[2]))), Math.atan2(rotatedVector[1], rotatedVector[0]));
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
      const brightness = r * 0.299 + g * 0.587 + b * 0.114;
      ctx.strokeStyle = brightness > 127 ? "rgba(0,0,0,0.8)" : "rgba(255,255,255,0.8)";
      ctx.lineWidth = 2;
      ctx.stroke();
    }
  },
  setupCanvasInteraction(canvas, sphereState, onUpdate) {
    let dragStartPos = null;
    let hasDragged = false;
    let ctx = canvas.getContext("2d");
    canvas.addEventListener("pointerdown", (e) => {
      e.preventDefault();
      e.stopPropagation();
      sphereState.dragging = true;
      sphereState.last = [e.clientX, e.clientY];
      sphereState.isDragging = true;
      dragStartPos = [e.clientX, e.clientY];
      hasDragged = false;
      canvas.setPointerCapture(e.pointerId);
      canvas.style.cursor = "grabbing";
    }, { passive: false });
    canvas.addEventListener("pointermove", (e) => {
      if (!sphereState.dragging)
        return;
      e.preventDefault();
      e.stopPropagation();
      const dx = e.clientX - sphereState.last[0];
      const dy = e.clientY - sphereState.last[1];
      sphereState.last = [e.clientX, e.clientY];
      if (!hasDragged && dragStartPos) {
        if (Math.hypot(e.clientX - dragStartPos[0], e.clientY - dragStartPos[1]) > 3)
          hasDragged = true;
      }
      const dq = this.fromDragRotation(dx, dy, 1 / (0.45 * Math.min(canvas.clientWidth, canvas.clientHeight)));
      if (dq[0] !== 1) {
        sphereState.Q = this.multiply(sphereState.Q, dq);
      }
      if (onUpdate)
        onUpdate(canvas);
      this.RenderColorSphere(ctx, sphereState);
    });
    canvas.addEventListener("pointerup", (e) => {
      e.preventDefault();
      e.stopPropagation();
      sphereState.dragging = false;
      sphereState.isDragging = false;
      canvas.releasePointerCapture(e.pointerId);
      canvas.style.cursor = "grab";
      requestAnimationFrame(() => {
        this.RenderColorSphere(ctx, sphereState);
      });
    });
    canvas.addEventListener("click", (e) => {
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
    canvas.addEventListener("wheel", (e) => {
      e.preventDefault();
      e.stopPropagation();
      const picker = canvas.closest(".custom-color-picker");
      if (!picker)
        return;
      const panelHexInput = picker.querySelector(".panel-hex-input");
      if (!panelHexInput)
        return;
      const currentHex = panelHexInput.value.replace("#", "");
      if (currentHex.length >= 6) {
        let alpha = currentHex.length === 8 ? parseInt(currentHex.substr(6, 2), 16) : 255;
        const alphaChange = e.deltaY > 0 ? -4 : 4;
        alpha = Math.max(0, Math.min(255, alpha + alphaChange));
        const newHex = currentHex.substr(0, 6) + alpha.toString(16).padStart(2, "0").toUpperCase();
        panelHexInput.value = "#" + newHex;
        panelHexInput.dispatchEvent(new Event("input", { bubbles: true }));
        setTimeout(() => {
          if (window.ButtonSystem && window.ButtonSystem.StyleManager) {
            window.ButtonSystem.StyleManager.scheduleUpdate();
          }
        }, 100);
      }
    });
  },
  animateToQuaternion(sphereState, targetQ, canvas) {
    const startQ = [...sphereState.Q];
    const startTime = performance.now();
    const ctx = canvas.getContext("2d");
    const animate = (currentTime) => {
      const progress = Math.min((currentTime - startTime) / 1000, 1);
      sphereState.Q = this.slerp(startQ, targetQ, 1 - Math.pow(1 - progress, 3));
      this.RenderColorSphere(ctx, sphereState);
      if (progress < 1)
        requestAnimationFrame(animate);
    };
    requestAnimationFrame(animate);
  }
};

// src/assets/icons/index.js
var iconPaths = {
  add: "add.svg",
  "arrow-left": "arrow-left.svg",
  "arrow-right": "arrow-right.svg",
  cancel: "cancel.svg",
  contrast: "contrast.svg",
  delete: "delete.svg",
  done: "done.svg",
  exit: "exit.svg",
  extention: "extention.svg",
  favicon: "favicon.svg",
  help: "help.svg",
  home: "home.svg",
  info: "info.svg",
  large: "large.svg",
  lowpos: "lowpos.svg",
  minus: "minus.svg",
  ok: "ok.svg",
  order: "order.svg",
  pay: "pay.svg",
  placeholder: "placeholder.svg",
  plus: "plus.svg",
  print: "print.svg",
  reset: "reset.svg",
  restart: "restart.svg",
  "soldout-large": "soldout-large.svg",
  "soldout-small": "soldout-small.svg",
  step: "step.svg",
  takein: "takein.svg",
  takeout: "takeout.svg",
  time: "time.svg",
  toggle: "toggle.svg",
  volume: "volume.svg",
  warning: "warning.svg"
};
var iconSelectors = {
  default: ".content.icon:not(.pressed)",
  toggle: ".content.icon.pressed",
  contrast: '[data-icon="contrast"]',
  large: '[data-icon="large"]'
};
function getSelector(iconKey) {
  return iconSelectors[iconKey] || `[data-icon="${iconKey}"]`;
}
function getIconPath(iconKey) {
  const filename = iconPaths[iconKey];
  if (!filename) {
    console.warn(`⚠️ Icon "${iconKey}" not found in iconPaths, using placeholder`);
    return "src/assets/icons/placeholder.svg";
  }
  return `src/assets/icons/${filename}`;
}
function createIconMap() {
  const map = {};
  for (const [key, filename] of Object.entries(iconPaths)) {
    if (key === "placeholder" && map["default"])
      continue;
    map[key] = {
      path: getIconPath(key),
      selector: getSelector(key)
    };
  }
  return map;
}
var fallbackIcon = "placeholder";

// src/modules/utils/svg-loader.js
var SVGLoader = {
  cache: new Map,
  get iconMap() {
    return createIconMap();
  },
  convertToCurrentColor(svgMarkup) {
    return svgMarkup.replace(/fill="(?!none|transparent)[^"]*"/gi, 'fill="currentColor"').replace(/stroke="(?!none|transparent)[^"]*"/gi, 'stroke="currentColor"').replace(/fill='(?!none|transparent)[^']*'/gi, "fill='currentColor'").replace(/stroke='(?!none|transparent)[^']*'/gi, "stroke='currentColor'").replace(/fill:\s*(?!none|transparent)[^;}\s]+/gi, "fill: currentColor").replace(/stroke:\s*(?!none|transparent)[^;}\s]+/gi, "stroke: currentColor");
  },
  async preloadAllIcons() {
    const loadPromises = Object.entries(this.iconMap).map(async ([key, config]) => {
      try {
        const response = await fetch(config.path);
        if (!response.ok)
          throw new Error(`SVG not found: ${config.path}`);
        const svgMarkup = await response.text();
        this.cache.set(key, svgMarkup);
        console.log(`✅ Loaded ${key} icon`);
      } catch (error) {
        console.warn(`⚠️ Failed to load ${key} icon from ${config.path}, using fallback`);
        try {
          const fallbackPath = getIconPath(fallbackIcon);
          const fallback = await fetch(fallbackPath);
          if (fallback.ok) {
            this.cache.set(key, await fallback.text());
          } else {
            this.cache.set(key, "");
          }
        } catch (fallbackError) {
          console.error(`❌ Fallback also failed for ${key}`);
          this.cache.set(key, "");
        }
      }
    });
    await Promise.all(loadPromises);
  },
  injectAllIcons() {
    Object.entries(this.iconMap).forEach(([key, config]) => {
      const svgMarkup = this.cache.get(key);
      if (!svgMarkup) {
        console.warn(`⚠️ No cached SVG for ${key}`);
        return;
      }
      const processedSvg = this.convertToCurrentColor(svgMarkup);
      const targets = document.querySelectorAll(config.selector);
      if (targets.length === 0) {
        console.log(`ℹ️ No elements found for selector: ${config.selector}`);
      }
      targets.forEach((el) => {
        el.innerHTML = processedSvg;
      });
    });
    console.log("✅ All icons injected to DOM (converted to currentColor)");
  },
  async loadAndInject() {
    await this.preloadAllIcons();
    this.injectAllIcons();
  },
  getCached(key, convertColor = true) {
    const svg = this.cache.get(key) || "";
    return convertColor ? this.convertToCurrentColor(svg) : svg;
  }
};

// src/modules/utils/css-injector.js
var CSSInjector = {
  inject(id, content, description = "") {
    const existingStyle = document.getElementById(id);
    if (existingStyle)
      existingStyle.remove();
    const styleElement = document.createElement("style");
    styleElement.id = id;
    styleElement.textContent = content;
    document.head.appendChild(styleElement);
  }
};

// src/modules/button/constants.js
var BUTTON_CONSTANTS = {
  BASE: 0.03125,
  get BACKGROUND_BORDER_RADIUS() {
    return this.BASE;
  },
  get BUTTON_BORDER_RADIUS() {
    return 2 * this.BACKGROUND_BORDER_RADIUS;
  },
  get BACKGROUND_OUTLINE_WIDTH() {
    return this.BASE;
  },
  get BUTTON_PADDING() {
    return this.BACKGROUND_OUTLINE_WIDTH;
  },
  get BUTTON_OUTLINE_WIDTH() {
    return 3 * this.BACKGROUND_OUTLINE_WIDTH;
  },
  get BUTTON_OUTLINE_OFFSET() {
    return -1 * this.BACKGROUND_OUTLINE_WIDTH;
  },
  get SELECTED_ICON_SIZE() {
    return 4 * this.BASE;
  }
};

// src/modules/button/palette-manager.js
var PaletteManager = {
  generateCSS() {
    const buttons = document.querySelectorAll(".button");
    const discoveredPalettes = new Set;
    buttons.forEach((button) => {
      const classList = Array.from(button.classList);
      const palette = classList.find((cls) => !["button", "pressed", "toggle", "dynamic"].includes(cls));
      if (palette)
        discoveredPalettes.add(palette);
    });
    let lightThemeCSS = "", darkThemeCSS = "", selectorsCSS = "";
    discoveredPalettes.forEach((palette) => {
      const isExisting = ["primary1", "primary2", "primary3", "secondary1", "secondary2", "secondary3", "custom"].includes(palette);
      [
        { name: "default", selector: "", disabled: false },
        { name: "pressed", selector: ".pressed:not(.toggle)", disabled: false },
        { name: "pressed", selector: ".pressed.toggle", disabled: false },
        { name: "disabled", selector: '[aria-disabled="true"]', disabled: true }
      ].forEach(({ name: state, selector: stateSelector, disabled }) => {
        const baseSelector = palette === "primary1" && state === "default" && !disabled ? `&${stateSelector}` : null;
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
        const backgroundProperty = palette === "primary3" || palette === "secondary3" ? `var(--${palette}-background1-color-${state})` : `var(--${palette}-background-color-${state})`;
        selectorsCSS += `
    ${paletteSelector} {
      & .background.dynamic {
        background: ${backgroundProperty};
        outline-color: var(--${palette}-border-color-${state});
        ${state === "default" ? "outline-style: var(--border-style-default);" : ""}
        ${state === "pressed" ? "outline-style: var(--border-style-pressed); outline-width: var(--border-style-pressed);" : ""}
        ${state === "disabled" ? "outline-style: var(--border-style-disabled);" : ""}
        
        & .content {
          color: var(--${palette}-content-color-${state});
        }
      }
      ${state === "pressed" ? "&.toggle { & .content.icon.pressed { display: var(--content-icon-display-pressed-toggle); } }" : ""}
      ${disabled ? "cursor: var(--button-cursor-disabled);" : ""}
    }`;
      });
      if (!isExisting) {
        const customProperties = [
          "content-color-default",
          "content-color-pressed",
          "content-color-disabled",
          "background-color-default",
          "background-color-pressed",
          "background-color-disabled",
          "border-color-default",
          "border-color-pressed",
          "border-color-disabled"
        ];
        customProperties.forEach((property) => {
          lightThemeCSS += `  --${palette}-${property}: var(--custom-${property});
`;
          darkThemeCSS += `  --${palette}-${property}: var(--custom-${property});
`;
        });
      }
    });
    const cssContent = `
/* HTML 클래스 기반 수정자 시스템 - CSS 상속 활용 */
${lightThemeCSS ? `:root {
${lightThemeCSS}}` : ""}

${darkThemeCSS ? `.dark {
${darkThemeCSS}}` : ""}

@layer components {
  .button {${selectorsCSS}
  }
}
`;
    window.AppUtils.CSSInjector.inject("palette-system-styles", cssContent, "팔레트 시스템");
    return discoveredPalettes;
  }
};

// src/modules/button/style-manager.js
var StyleManager = {
  scheduleUpdate() {
    this.waitForRenderCompletion().then(() => {
      this.updateButtonLabels();
    });
  },
  async waitForRenderCompletion() {
    return new Promise((resolve) => {
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          setTimeout(() => {
            resolve();
          }, 16);
        });
      });
    });
  },
  setupUpdateManager() {
    const observer = new MutationObserver((mutations) => {
      let needsUpdate = false;
      mutations.forEach((mutation) => {
        const target = mutation.target;
        if (mutation.type === "attributes" && mutation.attributeName === "class") {
          if (target.classList.contains("button")) {
            needsUpdate = true;
          }
        }
        if (mutation.type === "attributes" && mutation.attributeName === "style") {
          if (target === document.documentElement) {
            needsUpdate = true;
          }
        }
      });
      if (needsUpdate) {
        this.scheduleUpdate();
      }
    });
    document.querySelectorAll(".button").forEach((button) => {
      observer.observe(button, {
        attributes: true,
        attributeFilter: ["class"]
      });
    });
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["style"]
    });
    return observer;
  },
  calculateContrastRGBA(r1, g1, b1, r2, g2, b2) {
    const getLuminance = (r, g, b) => {
      const [rs, gs, bs] = [r, g, b].map((c) => {
        c = c / 255;
        return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
      });
      return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
    };
    const lum1 = getLuminance(r1, g1, b1);
    const lum2 = getLuminance(r2, g2, b2);
    const brightest = Math.max(lum1, lum2);
    const darkest = Math.min(lum1, lum2);
    const contrastRatio = (brightest + 0.05) / (darkest + 0.05);
    return contrastRatio;
  },
  calculateContrast(color1, color2) {
    const getRGB = (color) => {
      if (!color || color === "transparent") {
        throw new Error("유효하지 않은 색상 값입니다");
      }
      const rgbaMatch = color.match(/rgba?\(\s*(\d+(?:\.\d+)?)\s*,\s*(\d+(?:\.\d+)?)\s*,\s*(\d+(?:\.\d+)?)/);
      if (rgbaMatch) {
        return [
          Math.round(parseFloat(rgbaMatch[1])),
          Math.round(parseFloat(rgbaMatch[2])),
          Math.round(parseFloat(rgbaMatch[3]))
        ];
      }
      if (color.startsWith("#")) {
        const hex = color.replace("#", "");
        if (hex.length >= 6) {
          return [
            parseInt(hex.substr(0, 2), 16),
            parseInt(hex.substr(2, 2), 16),
            parseInt(hex.substr(4, 2), 16)
          ];
        }
      }
      throw new Error(`색상 파싱 실패: ${color}`);
    };
    const [r1, g1, b1] = getRGB(color1);
    const [r2, g2, b2] = getRGB(color2);
    return this.calculateContrastRGBA(r1, g1, b1, r2, g2, b2);
  },
  updateButtonLabels() {
    const allButtons = document.querySelectorAll(".button");
    allButtons.forEach((button) => {
      const background = button.querySelector(".background.dynamic");
      const content = button.querySelector(".content");
      const label = button.querySelector(".content.label");
      if (background && content && label) {
        background.offsetHeight;
        content.offsetHeight;
        const backgroundStyle = getComputedStyle(background);
        const contentStyle = getComputedStyle(content);
        const backgroundColor = backgroundStyle.backgroundColor;
        const textColor = contentStyle.color;
        const contrast = this.calculateContrast(textColor, backgroundColor);
        const contrastRatio = contrast.toFixed(2);
        let labelText = label.innerHTML.split("<br>")[0];
        label.innerHTML = `${labelText}<br>${contrastRatio}`;
      }
    });
  },
  applyDynamicStyles() {
    const allButtons = document.querySelectorAll(".button");
    if (allButtons.length === 0)
      return;
    let processedCount = 0;
    for (const button of allButtons) {
      const background = button.querySelector(".background");
      if (!background)
        continue;
      const rect = button.getBoundingClientRect();
      const minSide = Math.min(rect.width, rect.height);
      const buttonPadding = minSide * window.ButtonSystem.CONSTANTS.BUTTON_PADDING;
      const buttonBorderRadius = minSide * window.ButtonSystem.CONSTANTS.BUTTON_BORDER_RADIUS;
      const buttonOutlineWidth = minSide * window.ButtonSystem.CONSTANTS.BUTTON_OUTLINE_WIDTH;
      const buttonOutlineOffset = minSide * window.ButtonSystem.CONSTANTS.BUTTON_OUTLINE_OFFSET;
      const backgroundBorderRadius = minSide * window.ButtonSystem.CONSTANTS.BACKGROUND_BORDER_RADIUS;
      const backgroundOutlineWidth = minSide * window.ButtonSystem.CONSTANTS.BACKGROUND_OUTLINE_WIDTH;
      const iconSelectedSize = minSide * window.ButtonSystem.CONSTANTS.SELECTED_ICON_SIZE;
      const cached = window.ButtonSystem.state.styleCache.get(button) || {};
      const needsUpdate = (cached.minSide || 0) !== minSide || (cached.buttonPadding || 0) !== buttonPadding || (cached.buttonBorderRadius || 0) !== buttonBorderRadius || (cached.buttonOutlineWidth || 0) !== buttonOutlineWidth || (cached.buttonOutlineOffset || 0) !== buttonOutlineOffset || (cached.backgroundBorderRadius || 0) !== backgroundBorderRadius || (cached.backgroundOutlineWidth || 0) !== backgroundOutlineWidth || (cached.iconSelectedSize || 0) !== iconSelectedSize;
      if (!needsUpdate)
        continue;
      button.style.padding = `${buttonPadding}px`;
      button.style.borderRadius = `${buttonBorderRadius}px`;
      button.style.outlineWidth = `${buttonOutlineWidth}px`;
      button.style.outlineOffset = `${buttonOutlineOffset}px`;
      background.style.borderRadius = `${backgroundBorderRadius}px`;
      background.style.outlineWidth = `${backgroundOutlineWidth}px`;
      const iconPressed = button.querySelector(".content.icon.pressed");
      if (iconPressed) {
        iconPressed.style.width = `${iconSelectedSize}px`;
        iconPressed.style.height = `${iconSelectedSize}px`;
        iconPressed.style.top = `${buttonPadding}px`;
        iconPressed.style.right = `${buttonPadding}px`;
      }
      window.ButtonSystem.state.styleCache.set(button, {
        minSide,
        buttonPadding,
        buttonBorderRadius,
        buttonOutlineWidth,
        buttonOutlineOffset,
        backgroundBorderRadius,
        backgroundOutlineWidth,
        iconSelectedSize
      });
      processedCount++;
    }
    this.updateButtonLabels();
  },
  async setupIconInjection() {
    await this.waitForRenderCompletion();
    const allButtons = document.querySelectorAll(".button");
    for (const button of allButtons) {
      const background = button.querySelector(".background");
      if (!background)
        continue;
      const isToggleButton = button.classList.contains("toggle");
      if (isToggleButton) {
        let iconPressedSpan = background.querySelector(".content.icon.pressed");
        if (!iconPressedSpan) {
          iconPressedSpan = document.createElement("span");
          iconPressedSpan.className = "content icon pressed";
          const iconEl = background.querySelector(".content.icon:not(.pressed)");
          if (iconEl && iconEl.parentNode) {
            background.insertBefore(iconPressedSpan, iconEl);
          } else {
            background.insertBefore(iconPressedSpan, background.firstChild);
          }
        }
      }
    }
    for (const button of allButtons) {
      const isToggleButton = button.classList.contains("toggle");
      const isInitiallyPressed = button.classList.contains("pressed");
      if (isToggleButton) {
        button.dataset.isToggleButton = "true";
        button.setAttribute("aria-pressed", isInitiallyPressed ? "true" : "false");
      }
    }
  },
  scheduleContrastUpdate() {
    this.scheduleUpdate();
  }
};

// src/modules/button/button-system.js
var ButtonSystem2 = {
  CONSTANTS: BUTTON_CONSTANTS,
  state: {
    styleCache: new WeakMap
  },
  PaletteManager,
  StyleManager,
  async init() {
    console.log("\uD83D\uDD18 [ButtonSystem] 초기화 시작");
    const initStart = performance.now();
    console.log("  ├─ 1단계: SVG 로딩 및 DOM 주입");
    const svgStart = performance.now();
    await window.AppUtils.SVGLoader.loadAndInject();
    console.log(`  ✅ SVG 로딩 완료 (${(performance.now() - svgStart).toFixed(2)}ms)`);
    console.log("  ├─ 2단계: 토글 버튼 구조 준비");
    await this.StyleManager.setupIconInjection();
    console.log("  ✅ 토글 버튼 준비 완료");
    console.log("  ├─ 3단계: 팔레트 CSS 생성");
    this.PaletteManager.generateCSS();
    console.log("  ✅ 팔레트 CSS 생성 완료");
    console.log("  ├─ 4단계: 동적 스타일 적용");
    this.StyleManager.applyDynamicStyles();
    console.log("  ✅ 동적 스타일 적용 완료");
    console.log("  ├─ 5단계: 자동 업데이트 매니저 설정");
    this.StyleManager.setupUpdateManager();
    console.log("  ✅ 업데이트 매니저 설정 완료");
    const initEnd = performance.now();
    console.log(`\uD83C\uDF89 [ButtonSystem] 초기화 완료 (총 ${(initEnd - initStart).toFixed(2)}ms)`);
  }
};

// src/modules/managers/theme-manager.js
var ThemeManager = {
  THEMES: { LIGHT: "light", DARK: "dark" },
  STORAGE_KEY: "theme-mode",
  MANUAL_MODE_KEY: "manual-theme-mode",
  _domCache: { html: null, toggleButton: null, toggleLabel: null, liveRegion: null },
  currentTheme: "light",
  isManualMode: false,
  init() {
    console.log("\uD83C\uDFA8 [ThemeManager] 초기화 시작");
    this._initDOMCache();
    this.loadSettings();
    console.log("  ├─ 현재 테마:", this.currentTheme, "| 수동 모드:", this.isManualMode);
    this.setupEventListeners();
    this.applyCurrentState();
    this.syncToggleButton();
    console.log("✅ [ThemeManager] 초기화 완료");
  },
  _initDOMCache() {
    this._domCache.html = document.documentElement;
    this._domCache.html.classList.remove("no-js");
    this._domCache.html.classList.add("js");
    this._domCache.toggleButton = document.querySelector(".theme-toggle");
    if (this._domCache.toggleButton) {
      this._domCache.toggleLabel = this._domCache.toggleButton.querySelector(".label");
    }
    this._domCache.liveRegion = document.getElementById("theme-announcer");
  },
  loadSettings() {
    const savedTheme = localStorage.getItem(this.STORAGE_KEY);
    const savedManualMode = localStorage.getItem(this.MANUAL_MODE_KEY);
    this.isManualMode = savedManualMode === "true";
    if (this.isManualMode) {
      this.currentTheme = savedTheme === this.THEMES.DARK ? this.THEMES.DARK : this.THEMES.LIGHT;
    } else {
      this.currentTheme = this.THEMES.LIGHT;
    }
  },
  applyCurrentState() {
    const html = this._domCache.html;
    if (this.currentTheme === this.THEMES.DARK) {
      html.classList.add("dark");
    } else {
      html.classList.remove("dark");
    }
    if (this.isManualMode) {
      html.classList.add("manual-theme-mode");
    } else {
      html.classList.remove("manual-theme-mode");
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
      toggleButton.setAttribute("aria-pressed", isDarkTheme.toString());
      const label = this._domCache.toggleLabel;
      if (label) {
        label.innerHTML = isDarkTheme ? "Light<br>테마" : "Dark<br>테마";
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
    const themeLabel = this.currentTheme === this.THEMES.DARK ? "Dark 테마" : "Light 테마";
    const message = `${themeLabel}로 전환되었습니다.`;
    let liveRegion = this._domCache.liveRegion;
    if (!liveRegion) {
      liveRegion = document.createElement("div");
      liveRegion.id = "theme-announcer";
      liveRegion.setAttribute("aria-live", "polite");
      liveRegion.setAttribute("aria-atomic", "true");
      liveRegion.style.position = "absolute";
      liveRegion.style.left = "-10000px";
      liveRegion.style.width = "1px";
      liveRegion.style.height = "1px";
      liveRegion.style.overflow = "hidden";
      document.body.appendChild(liveRegion);
      this._domCache.liveRegion = liveRegion;
    }
    liveRegion.textContent = message;
  },
  setupEventListeners() {
    const toggleButton = document.querySelector(".theme-toggle");
    if (toggleButton) {
      toggleButton.addEventListener("click", () => this.toggle());
    }
    document.addEventListener("keydown", (e) => {
      if (e.ctrlKey && e.altKey && e.key.toLowerCase() === "h") {
        e.preventDefault();
        this.toggle();
      }
    });
  }
};

// src/modules/managers/large-mode-manager.js
var LargeTextManager = {
  MODES: { DEFAULT: "default", LARGE: "large" },
  STORAGE_KEY: "large-mode",
  _domCache: { html: null, toggleButton: null, toggleLabel: null, liveRegion: null },
  currentMode: "default",
  init() {
    console.log("\uD83D\uDCCF [LargeTextManager] 초기화 시작");
    this._initDOMCache();
    this.loadSettings();
    console.log("  ├─ 현재 모드:", this.currentMode);
    this.setupEventListeners();
    this.applyCurrentState();
    this.syncToggleButton();
    console.log("✅ [LargeTextManager] 초기화 완료");
  },
  _initDOMCache() {
    this._domCache.html = document.documentElement;
    this._domCache.toggleButton = document.querySelector(".large-toggle");
    if (this._domCache.toggleButton) {
      this._domCache.toggleLabel = this._domCache.toggleButton.querySelector(".label");
    }
    this._domCache.liveRegion = document.getElementById("large-announcer");
  },
  loadSettings() {
    const savedMode = localStorage.getItem(this.STORAGE_KEY);
    this.currentMode = savedMode === this.MODES.LARGE ? this.MODES.LARGE : this.MODES.DEFAULT;
  },
  applyCurrentState() {
    const html = this._domCache.html;
    if (this.currentMode === this.MODES.LARGE) {
      html.classList.add("large");
    } else {
      html.classList.remove("large");
    }
  },
  saveSettings() {
    localStorage.setItem(this.STORAGE_KEY, this.currentMode);
  },
  syncToggleButton() {
    const toggleButton = this._domCache.toggleButton;
    if (toggleButton) {
      const isLargeMode = this.currentMode === this.MODES.LARGE;
      toggleButton.setAttribute("aria-pressed", isLargeMode.toString());
      const label = this._domCache.toggleLabel;
      if (label) {
        label.innerHTML = isLargeMode ? "기본<br>글씨" : "큰글씨<br>모드";
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
    const modeLabel = this.currentMode === this.MODES.LARGE ? "큰글씨 모드" : "기본 글씨 크기";
    const message = `${modeLabel}로 전환되었습니다.`;
    let liveRegion = this._domCache.liveRegion;
    if (!liveRegion) {
      liveRegion = document.createElement("div");
      liveRegion.id = "large-announcer";
      liveRegion.setAttribute("aria-live", "polite");
      liveRegion.setAttribute("aria-atomic", "true");
      liveRegion.style.position = "absolute";
      liveRegion.style.left = "-10000px";
      liveRegion.style.width = "1px";
      liveRegion.style.height = "1px";
      liveRegion.style.overflow = "hidden";
      document.body.appendChild(liveRegion);
      this._domCache.liveRegion = liveRegion;
    }
    liveRegion.textContent = message;
  },
  setupEventListeners() {
    const toggleButton = document.querySelector(".large-toggle");
    if (toggleButton) {
      toggleButton.addEventListener("click", () => this.toggle());
    }
    document.addEventListener("keydown", (e) => {
      if (e.ctrlKey && e.altKey && e.key.toLowerCase() === "l") {
        e.preventDefault();
        this.toggle();
      }
    });
  }
};

// src/modules/managers/size-control-manager.js
var SizeControlManager = {
  DEFAULT_WIDTH: 256,
  DEFAULT_HEIGHT: 256,
  _domCache: { widthSlider: null, heightSlider: null, widthValue: null, heightValue: null, resetButton: null, allButtons: null },
  currentWidth: 256,
  currentHeight: 256,
  init() {
    console.log("\uD83D\uDCD0 [SizeControlManager] 초기화 시작");
    this._initDOMCache();
    this.setupEventListeners();
    this.updateDisplay();
    console.log("  ├─ 기본 크기:", `${this.currentWidth}x${this.currentHeight}px`);
    console.log("✅ [SizeControlManager] 초기화 완료");
  },
  _initDOMCache() {
    this._domCache.widthSlider = document.querySelector(".button-width");
    this._domCache.heightSlider = document.querySelector(".button-height");
    this._domCache.widthValue = document.querySelector(".width-value");
    this._domCache.heightValue = document.querySelector(".height-value");
    this._domCache.resetButton = document.querySelector(".scaling.reset");
    this._domCache.allButtons = document.querySelectorAll(".button");
  },
  setupEventListeners() {
    if (this._domCache.widthSlider) {
      this._domCache.widthSlider.addEventListener("input", (e) => {
        this.currentWidth = parseInt(e.target.value);
        this.updateButtonSizes();
        this.updateDisplay();
      });
    }
    if (this._domCache.heightSlider) {
      this._domCache.heightSlider.addEventListener("input", (e) => {
        this.currentHeight = parseInt(e.target.value);
        this.updateButtonSizes();
        this.updateDisplay();
      });
    }
    if (this._domCache.resetButton) {
      this._domCache.resetButton.addEventListener("click", () => {
        this.resetToDefault();
      });
    }
  },
  updateButtonSizes() {
    this._domCache.allButtons.forEach((button) => {
      button.style.width = `${this.currentWidth}px`;
      button.style.height = `${this.currentHeight}px`;
    });
    if (typeof ButtonSystem !== "undefined" && ButtonSystem.StyleManager) {
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

// src/modules/managers/custom-palette-manager.js
var CustomPaletteManager = {
  CUSTOM_PALETTE_NAME: "custom",
  _domCache: { lightInputs: {}, darkInputs: {}, resetBtn: null, testButtons: null },
  currentPalette: { name: "custom" },
  CustomColorPicker: {
    get sphereState() {
      return Mechanics.UnifiedSphereState;
    },
    init() {
      console.log("  ├─ [CustomColorPicker] 초기화 시작");
      this.generateLightThemePickers();
      console.log("    ✅ Light 테마 피커 생성");
      this.generateDarkThemePickers();
      console.log("    ✅ Dark 테마 피커 생성");
      this.setupColorDisplays();
      console.log("    ✅ 컬러 디스플레이 설정");
      this.setup3DCanvasInteraction();
      console.log("    ✅ 3D 캔버스 인터랙션 설정");
      this.setupHexInputs();
      console.log("    ✅ Hex 입력 설정");
    },
    generateLightThemePickers() {
      const lightContainer = document.getElementById("light-color-pickers");
      if (!lightContainer) {
        console.warn("⚠️ [CustomColorPicker] light-color-pickers 요소를 찾을 수 없음");
        return;
      }
      console.log("    ├─ light-color-pickers 찾음:", lightContainer);
      const lightPickers = [
        { id: "light-content-default", label: "콘텐츠(기본)", color: "rgba(255, 255, 255, 1)", hex: "#FFFFFFFF", hue: 0, alpha: 255 },
        { id: "light-content-pressed", label: "콘텐츠(눌림)", color: "rgba(140, 83, 44, 1)", hex: "#8C532CFF", hue: 25, alpha: 255 },
        { id: "light-content-disabled", label: "콘텐츠(비활성)", color: "rgba(140, 83, 44, 1)", hex: "#8C532CFF", hue: 25, alpha: 255 },
        { id: "light-background-default", label: "배경(기본)", color: "rgba(164, 105, 63, 1)", hex: "#A4693FFF", hue: 25, alpha: 255 },
        { id: "light-background-pressed", label: "배경(눌림)", color: "rgba(238, 220, 210, 1)", hex: "#EEDCD2FF", hue: 25, alpha: 255 },
        { id: "light-background-disabled", label: "배경(비활성)", color: "transparent", hex: "#00000000", hue: 0, alpha: 0 },
        { id: "light-border-default", label: "테두리(기본)", color: "rgba(164, 105, 63, 1)", hex: "#A4693FFF", hue: 25, alpha: 255 },
        { id: "light-border-pressed", label: "테두리(눌림)", color: "rgba(140, 83, 44, 1)", hex: "#8C532CFF", hue: 25, alpha: 255 },
        { id: "light-border-disabled", label: "테두리(비활성)", color: "rgba(140, 83, 44, 1)", hex: "#8C532CFF", hue: 25, alpha: 255 }
      ];
      lightPickers.forEach((picker) => {
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
                      <small>\uD83C\uDF10 3D 색상 구체 | 드래그: 회전 | 휠: 알파 조절</small>
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
      const darkContainer = document.getElementById("dark-color-pickers");
      if (!darkContainer)
        return;
      const darkPickers = [
        { id: "dark-content-default", label: "콘텐츠(기본)", color: "rgba(0, 0, 0, 1)", hex: "#000000FF", hue: 0, alpha: 255 },
        { id: "dark-content-pressed", label: "콘텐츠(눌림)", color: "rgba(255, 239, 128, 1)", hex: "#FFEF80FF", hue: 54, alpha: 255 },
        { id: "dark-content-disabled", label: "콘텐츠(비활성)", color: "rgba(255, 225, 0, 1)", hex: "#FFE100FF", hue: 54, alpha: 255 },
        { id: "dark-background-default", label: "배경(기본)", color: "rgba(255, 225, 0, 1)", hex: "#FFE100FF", hue: 54, alpha: 255 },
        { id: "dark-background-pressed", label: "배경(눌림)", color: "rgba(36, 31, 0, 1)", hex: "#241F00FF", hue: 54, alpha: 255 },
        { id: "dark-background-disabled", label: "배경(비활성)", color: "transparent", hex: "#00000000", hue: 0, alpha: 0 },
        { id: "dark-border-default", label: "테두리(기본)", color: "rgba(255, 225, 0, 1)", hex: "#FFE100FF", hue: 54, alpha: 255 },
        { id: "dark-border-pressed", label: "테두리(눌림)", color: "rgba(255, 239, 128, 1)", hex: "#FFEF80FF", hue: 54, alpha: 255 },
        { id: "dark-border-disabled", label: "테두리(비활성)", color: "rgba(255, 225, 0, 1)", hex: "#FFE100FF", hue: 54, alpha: 255 }
      ];
      darkPickers.forEach((picker) => {
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
                      <small>\uD83C\uDF10 3D 색상 구체 | 드래그: 회전 | 휠: 알파 조절</small>
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
    setupColorDisplays() {
      document.querySelectorAll(".color-display").forEach((display) => {
        display.addEventListener("click", (e) => {
          const picker = e.target.closest(".custom-color-picker");
          const panel = picker.querySelector(".color-picker-panel");
          document.querySelectorAll(".color-picker-panel").forEach((p) => p.classList.remove("active"));
          panel.classList.toggle("active");
          if (panel.classList.contains("active")) {
            this.initialize3DCanvas(picker);
            const hexInput = picker.parentElement.querySelector(".hex-input");
            if (hexInput && hexInput.value) {
              const hexValue = hexInput.value.replace("#", "").toUpperCase();
              if (hexValue.length === 8 && /^[0-9A-F]{8}$/.test(hexValue)) {
                const r = parseInt(hexValue.substr(0, 2), 16);
                const g = parseInt(hexValue.substr(2, 2), 16);
                const b = parseInt(hexValue.substr(4, 2), 16);
              }
            }
          }
        });
      });
      document.addEventListener("click", (e) => {
        if (!e.target.closest(".custom-color-picker")) {
          document.querySelectorAll(".color-picker-panel").forEach((panel) => {
            panel.classList.remove("active");
          });
        }
      });
    },
    initialize3DCanvas(picker) {
      const canvas3D = picker.querySelector(".color-canvas-3d");
      if (canvas3D) {
        const ctx = canvas3D.getContext("2d");
        ctx.clearRect(0, 0, canvas3D.width, canvas3D.height);
        Mechanics.RenderColorSphere(ctx, Mechanics.UnifiedSphereState);
        Mechanics.setupCanvasInteraction(canvas3D, Mechanics.UnifiedSphereState, (canvas) => this.updateCenterColorRealtime(canvas));
      }
    },
    setup3DCanvasInteraction() {
      const handleCanvasSetup = (canvas) => {
        Mechanics.setupCanvasInteraction(canvas, Mechanics.UnifiedSphereState, (canvas2) => this.updateCenterColorRealtime(canvas2));
      };
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
          const screenX = dx / radius;
          const screenY = dy / radius;
          const screenZ = Math.sqrt(Math.max(0, 1 - screenX * screenX - screenY * screenY));
          const rotatedVector = Mechanics.rotateVector(Mechanics.UnifiedSphereState.Q, [screenX, screenY, screenZ]);
          const [rotatedX, rotatedY, rotatedZ] = rotatedVector;
          const phi = Math.atan2(rotatedY, rotatedX);
          const theta = Math.acos(Math.max(-1, Math.min(1, rotatedZ)));
          let hue = (phi + Math.PI) / (2 * Math.PI) * 360;
          if (hue >= 360)
            hue = 0;
          const radialFactor = distance / radius;
          const lightnessRatio = (Math.PI - theta) / Math.PI;
          const color = Topology.calculateColor(theta, phi);
          const { r, g, b } = color;
          Mechanics.UnifiedSphereState.selectedColor = { r, g, b, hue };
          const picker = canvas.closest(".custom-color-picker");
          const targetId = picker.dataset.target;
          const panelHexInput = picker.querySelector(".panel-hex-input");
          let alpha = 255;
          if (panelHexInput && panelHexInput.value) {
            const currentHex = panelHexInput.value.replace("#", "");
            if (currentHex.length === 8) {
              alpha = parseInt(currentHex.substr(6, 2), 16);
            }
          }
          const rgb = { r, g, b };
          const hexColor = ColorConverter.rgbaToHex(r, g, b, alpha);
          this.updateColorInputs(targetId, rgb, alpha, hexColor);
          this.updateSelectedColorInfo(rgb, alpha, hexColor);
          this.updateSelectedColorInfo(rgb, alpha, hexColor);
        }
      };
      this.selectColorAt3D = selectColorAt3D;
      this.updateCenterColorRealtime = (canvas) => {
        const screenX = 0;
        const screenY = 0;
        const screenZ = 1;
        const rotatedVector = Mechanics.rotateVector(Mechanics.UnifiedSphereState.Q, [screenX, screenY, screenZ]);
        const [rotatedX, rotatedY, rotatedZ] = rotatedVector;
        const phi = Math.atan2(rotatedY, rotatedX);
        const theta = Math.acos(Math.max(-1, Math.min(1, rotatedZ)));
        const color = Topology.calculateColor(theta, phi);
        const { r, g, b } = color;
        Mechanics.UnifiedSphereState.selectedColor = { r, g, b };
        const picker = canvas.closest(".custom-color-picker");
        if (!picker)
          return;
        const targetId = picker.dataset.target;
        const panelHexInput = picker.querySelector(".panel-hex-input");
        let alpha = 255;
        if (panelHexInput && panelHexInput.value) {
          const currentHex = panelHexInput.value.replace("#", "");
          if (currentHex.length === 8) {
            alpha = parseInt(currentHex.substr(6, 2), 16);
          }
        }
        const rgb = { r, g, b };
        const hexColor = ColorConverter.rgbaToHex(r, g, b, alpha);
        requestAnimationFrame(() => {
          this.updateColorInputs(targetId, rgb, alpha, hexColor);
          this.updateSelectedColorInfo(rgb, alpha, hexColor);
          this.updateSelectedColorInfo(rgb, alpha, hexColor);
        });
      };
      const handle2DColorSelect = (e, canvas) => {
        const rect = canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const saturation = Math.max(0, Math.min(100, x / rect.width * 100));
        const value = Math.max(0, Math.min(100, (1 - y / rect.height) * 100));
        const picker = canvas.closest(".custom-color-picker");
        const hueSlider = picker.querySelector(".hue-slider");
        const alphaSlider = picker.querySelector(".alpha-slider");
        const targetId = picker.dataset.target;
        const hue = parseInt(hueSlider?.value || 0);
        const alpha = parseInt(alphaSlider?.value || 255);
        const rgb = ColorConverter.hsvToRgb(hue, saturation, value);
        const hexColor = ColorConverter.rgbaToHex(rgb.r, rgb.g, rgb.b, alpha);
        this.updateColorInputs(targetId, rgb, alpha, hexColor);
        this.updateSelectedColorInfo(rgb, alpha, hexColor);
      };
      document.querySelectorAll(".color-canvas-3d").forEach((canvas) => {
        handleCanvasSetup(canvas);
        canvas.addEventListener("wheel", (e) => {
          e.preventDefault();
          e.stopPropagation();
          const picker = canvas.closest(".custom-color-picker");
          const panelHexInput = picker.querySelector(".panel-hex-input");
          if (panelHexInput) {
            const currentHex = panelHexInput.value.replace("#", "");
            let currentAlpha = 255;
            if (!currentHex || currentHex.length < 6) {
              throw new Error("유효하지 않은 헥스 색상입니다");
            }
            if (currentHex.length === 8) {
              currentAlpha = parseInt(currentHex.substr(6, 2), 16);
            } else if (currentHex.length === 6) {
              currentAlpha = 255;
            }
            const alphaChange = e.deltaY > 0 ? -4 : 4;
            const newAlpha = Math.max(0, Math.min(255, currentAlpha + alphaChange));
            if (currentHex.length >= 6) {
              const rgb = currentHex.substr(0, 6);
              const newHex = "#" + rgb + newAlpha.toString(16).padStart(2, "0").toUpperCase();
              const targetId = picker.dataset.target;
              const r = parseInt(rgb.substr(0, 2), 16);
              const g = parseInt(rgb.substr(2, 2), 16);
              const b = parseInt(rgb.substr(4, 2), 16);
              this.updateColorInputs(targetId, { r, g, b }, newAlpha, newHex);
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
    setupHexInputs() {
      document.querySelectorAll(".panel-hex-input").forEach((hexInput) => {
        hexInput.addEventListener("input", (e) => {
          const hexValue = e.target.value.replace("#", "").toUpperCase();
          if (hexValue.length === 8 && /^[0-9A-F]{8}$/.test(hexValue)) {
            const r = parseInt(hexValue.substr(0, 2), 16);
            const g = parseInt(hexValue.substr(2, 2), 16);
            const b = parseInt(hexValue.substr(4, 2), 16);
            const a = parseInt(hexValue.substr(6, 2), 16);
            const picker = e.target.closest(".custom-color-picker");
            const targetId = picker.dataset.target;
            const fullHex = "#" + hexValue;
            const canvas3d = picker.querySelector(".color-canvas-3d");
            if (canvas3d) {
              const ctx3d = canvas3d.getContext("2d");
              Mechanics.RenderColorSphere(ctx3d, canvas3d.className);
            }
            this.updateColorInputs(targetId, { r, g, b }, a, fullHex);
            this.updateSelectedColorInfo({ r, g, b }, a, fullHex);
          }
        });
      });
    },
    updateSelectedColorInfo(rgb, alpha, hexColor) {
      document.querySelectorAll(".color-picker-panel .picker-color-preview").forEach((preview) => {
        preview.style.background = hexColor;
      });
      const colorPreview = document.getElementById("selected-color-preview");
      if (colorPreview) {
        colorPreview.style.background = hexColor;
      }
      document.querySelectorAll(".color-picker-panel #selected-color-hex").forEach((hex) => {
        hex.textContent = hexColor;
      });
      document.querySelectorAll(".color-picker-panel #selected-color-rgb").forEach((rgbEl) => {
        rgbEl.textContent = `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`;
      });
      document.querySelectorAll(".color-picker-panel #selected-color-hsl").forEach((hslEl) => {
        const hslValue = ColorConverter.rgbToHsl(rgb.r, rgb.g, rgb.b);
        hslEl.textContent = `hsl(${Math.round(hslValue.h)}, ${Math.round(hslValue.s)}%, ${Math.round(hslValue.l)}%)`;
      });
      const colorHex = document.getElementById("selected-color-hex");
      const colorRgb = document.getElementById("selected-color-rgb");
      const colorHsl = document.getElementById("selected-color-hsl");
      if (colorHex)
        colorHex.textContent = hexColor;
      if (colorRgb)
        colorRgb.textContent = `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`;
      if (colorHsl) {
        const hsl = ColorConverter.rgbToHsl(rgb.r, rgb.g, rgb.b);
        colorHsl.textContent = `hsl(${Math.round(hsl.h)}, ${Math.round(hsl.s)}%, ${Math.round(hsl.l)}%)`;
      }
    },
    updateColorInputs(targetId, rgb, alpha, hexColor) {
      const picker = document.querySelector(`[data-target="${targetId}"]`);
      const hexInput = picker?.parentElement?.querySelector(".hex-input");
      const panelHexInput = picker?.querySelector(".panel-hex-input");
      const display = picker?.querySelector(".color-display");
      if (hexInput)
        hexInput.value = hexColor;
      if (panelHexInput)
        panelHexInput.value = hexColor;
      if (display)
        display.style.background = hexColor;
      this.updateCSSVariable(targetId, hexColor);
      if (typeof CustomPaletteManager !== "undefined") {
        CustomPaletteManager.generateAndApplyPalette();
      }
    },
    updateCSSVariable(inputId, hexColor) {
      const root = document.documentElement;
      const variableMap = {
        "light-content-default": "--custom-content-color-default",
        "light-content-pressed": "--custom-content-color-pressed",
        "light-content-disabled": "--custom-content-color-disabled",
        "light-background-default": "--custom-background-color-default",
        "light-background-pressed": "--custom-background-color-pressed",
        "light-background-disabled": "--custom-background-color-disabled",
        "light-border-default": "--custom-border-color-default",
        "light-border-pressed": "--custom-border-color-pressed",
        "light-border-disabled": "--custom-border-color-disabled",
        "dark-content-default": "--custom-content-color-default",
        "dark-content-pressed": "--custom-content-color-pressed",
        "dark-content-disabled": "--custom-content-color-disabled",
        "dark-background-default": "--custom-background-color-default",
        "dark-background-pressed": "--custom-background-color-pressed",
        "dark-background-disabled": "--custom-background-color-disabled",
        "dark-border-default": "--custom-border-color-default",
        "dark-border-pressed": "--custom-border-color-pressed",
        "dark-border-disabled": "--custom-border-color-disabled"
      };
      const cssVariable = variableMap[inputId];
      if (cssVariable) {
        if (inputId.startsWith("light-")) {
          root.style.setProperty(cssVariable, hexColor);
        } else if (inputId.startsWith("dark-")) {
          AppUtils.CSSInjector.inject("custom-dark-variable", `.dark { ${cssVariable}: ${hexColor}; }`, "Dark 커스텀 변수");
        }
        setTimeout(() => {
          if (window.ButtonSystem && window.ButtonSystem.StyleManager) {
            window.ButtonSystem.StyleManager.scheduleUpdate();
          }
        }, 100);
      }
    }
  },
  init() {
    console.log("\uD83C\uDFA8 [CustomPaletteManager] 초기화 시작");
    this._initDOMCache();
    console.log("  ├─ CustomColorPicker 초기화 중...");
    this.CustomColorPicker.init();
    console.log("  ✅ CustomColorPicker 초기화 완료");
    setTimeout(() => {
      this._updateDynamicDOMCache();
      this.setupEventListeners();
      this.generateAndApplyPalette();
    }, 500);
  },
  _initDOMCache() {
    this._domCache.resetBtn = document.querySelector(".palette-reset-btn");
    this._domCache.testButtons = document.querySelectorAll(".button.custom");
    this._domCache.lightInputs = {};
    this._domCache.darkInputs = {};
  },
  _updateDynamicDOMCache() {
    this._domCache.lightInputs = {
      contentDefault: document.querySelector('[data-target="light-content-default"]')?.parentElement?.querySelector(".hex-input"),
      contentPressed: document.querySelector('[data-target="light-content-pressed"]')?.parentElement?.querySelector(".hex-input"),
      contentDisabled: document.querySelector('[data-target="light-content-disabled"]')?.parentElement?.querySelector(".hex-input"),
      backgroundDefault: document.querySelector('[data-target="light-background-default"]')?.parentElement?.querySelector(".hex-input"),
      backgroundPressed: document.querySelector('[data-target="light-background-pressed"]')?.parentElement?.querySelector(".hex-input"),
      backgroundDisabled: document.querySelector('[data-target="light-background-disabled"]')?.parentElement?.querySelector(".hex-input"),
      borderDefault: document.querySelector('[data-target="light-border-default"]')?.parentElement?.querySelector(".hex-input"),
      borderPressed: document.querySelector('[data-target="light-border-pressed"]')?.parentElement?.querySelector(".hex-input"),
      borderDisabled: document.querySelector('[data-target="light-border-disabled"]')?.parentElement?.querySelector(".hex-input")
    };
    this._domCache.darkInputs = {
      contentDefault: document.querySelector('[data-target="dark-content-default"]')?.parentElement?.querySelector(".hex-input"),
      contentPressed: document.querySelector('[data-target="dark-content-pressed"]')?.parentElement?.querySelector(".hex-input"),
      contentDisabled: document.querySelector('[data-target="dark-content-disabled"]')?.parentElement?.querySelector(".hex-input"),
      backgroundDefault: document.querySelector('[data-target="dark-background-default"]')?.parentElement?.querySelector(".hex-input"),
      backgroundPressed: document.querySelector('[data-target="dark-background-pressed"]')?.parentElement?.querySelector(".hex-input"),
      backgroundDisabled: document.querySelector('[data-target="dark-background-disabled"]')?.parentElement?.querySelector(".hex-input"),
      borderDefault: document.querySelector('[data-target="dark-border-default"]')?.parentElement?.querySelector(".hex-input"),
      borderPressed: document.querySelector('[data-target="dark-border-pressed"]')?.parentElement?.querySelector(".hex-input"),
      borderDisabled: document.querySelector('[data-target="dark-border-disabled"]')?.parentElement?.querySelector(".hex-input")
    };
  },
  setupEventListeners() {
    Object.entries(this._domCache.lightInputs).forEach(([key, input]) => {
      if (input) {
        input.addEventListener("input", () => {
          this.generateAndApplyPalette();
        });
      }
    });
    Object.entries(this._domCache.darkInputs).forEach(([key, input]) => {
      if (input) {
        input.addEventListener("input", () => {
          this.generateAndApplyPalette();
        });
      }
    });
    document.querySelectorAll(".hex-input").forEach((hexInput) => {
      hexInput.addEventListener("input", (e) => {
        const colorInput = e.target.previousElementSibling;
        if (colorInput && colorInput.type === "color") {
          const hexValue = e.target.value.replace("#", "").substring(0, 6);
          if (hexValue.length === 6) {
            colorInput.value = "#" + hexValue;
            this.updatePreview();
            this.generateAndApplyPalette();
          }
        }
      });
    });
    document.querySelectorAll('input[type="color"]').forEach((colorInput) => {
      colorInput.addEventListener("input", (e) => {
        const hexInput = e.target.nextElementSibling;
        if (hexInput && hexInput.classList.contains("hex-input")) {
          const alpha = e.target.id.includes("disabled") && e.target.id.includes("background") ? "00" : "FF";
          hexInput.value = e.target.value + alpha;
          this.generateAndApplyPalette();
        }
      });
    });
    if (this._domCache.resetBtn) {
      this._domCache.resetBtn.addEventListener("click", () => {
        this.resetToDefaults();
      });
    }
  },
  generateAndApplyPalette() {
    const root = document.documentElement;
    const lightMappings = {
      contentDefault: "--custom-content-color-default",
      contentPressed: "--custom-content-color-pressed",
      contentDisabled: "--custom-content-color-disabled",
      backgroundDefault: "--custom-background-color-default",
      backgroundPressed: "--custom-background-color-pressed",
      backgroundDisabled: "--custom-background-color-disabled",
      borderDefault: "--custom-border-color-default",
      borderPressed: "--custom-border-color-pressed",
      borderDisabled: "--custom-border-color-disabled"
    };
    Object.entries(lightMappings).forEach(([inputKey, cssVar]) => {
      const input = this._domCache.lightInputs[inputKey];
      if (input?.nextElementSibling?.value) {
        root.style.setProperty(cssVar, input.nextElementSibling.value);
      }
    });
    const darkMappings = {
      contentDefault: "--custom-content-color-default",
      contentPressed: "--custom-content-color-pressed",
      contentDisabled: "--custom-content-color-disabled",
      backgroundDefault: "--custom-background-color-default",
      backgroundPressed: "--custom-background-color-pressed",
      backgroundDisabled: "--custom-background-color-disabled",
      borderDefault: "--custom-border-color-default",
      borderPressed: "--custom-border-color-pressed",
      borderDisabled: "--custom-border-color-disabled"
    };
    let darkCSS = "";
    Object.entries(darkMappings).forEach(([inputKey, cssVar]) => {
      const input = this._domCache.darkInputs[inputKey];
      if (input?.nextElementSibling?.value) {
        darkCSS += `  ${cssVar}: ${input.nextElementSibling.value};
`;
      }
    });
    if (darkCSS) {
      AppUtils.CSSInjector.inject("custom-dark-theme", `.dark {
${darkCSS}}`, "Dark 테마 커스텀 변수");
    }
    this.applyToTestButtons();
    setTimeout(() => {
      if (window.ButtonSystem && window.ButtonSystem.StyleManager) {
        window.ButtonSystem.StyleManager.scheduleUpdate();
      }
    }, 200);
  },
  applyToTestButtons() {
    const paletteName = this.CUSTOM_PALETTE_NAME;
    this._domCache.testButtons.forEach((button) => {
      const classList = Array.from(button.classList);
      const excludedClasses = ["button", "pressed", "toggle", "dynamic"];
      const oldPalette = classList.find((cls) => !excludedClasses.includes(cls));
      if (oldPalette && oldPalette !== paletteName) {
        button.classList.remove(oldPalette);
      }
      if (!button.classList.contains(paletteName)) {
        button.classList.add(paletteName);
      }
    });
  },
  resetToDefaults() {
    this._updateDynamicDOMCache();
    const isDarkTheme = document.documentElement.classList.contains("dark");
    const lightDefaults = {
      contentDefault: ["rgba(255, 255, 255, 1)", "#FFFFFFFF"],
      contentPressed: ["rgba(140, 83, 44, 1)", "#8C532CFF"],
      contentDisabled: ["rgba(140, 83, 44, 1)", "#8C532CFF"],
      backgroundDefault: ["rgba(164, 105, 63, 1)", "#A4693FFF"],
      backgroundPressed: ["rgba(238, 220, 210, 1)", "#EEDCD2FF"],
      backgroundDisabled: ["transparent", "transparent"],
      borderDefault: ["rgba(164, 105, 63, 1)", "#A4693FFF"],
      borderPressed: ["rgba(140, 83, 44, 1)", "#8C532CFF"],
      borderDisabled: ["rgba(140, 83, 44, 1)", "#8C532CFF"]
    };
    const darkDefaults = {
      contentDefault: ["rgba(0, 0, 0, 1)", "#000000FF"],
      contentPressed: ["rgba(255, 239, 128, 1)", "#FFEF80FF"],
      contentDisabled: ["rgba(255, 225, 0, 1)", "#FFE100FF"],
      backgroundDefault: ["rgba(255, 225, 0, 1)", "#FFE100FF"],
      backgroundPressed: ["rgba(36, 31, 0, 1)", "#241F00FF"],
      backgroundDisabled: ["transparent", "transparent"],
      borderDefault: ["rgba(255, 225, 0, 1)", "#FFE100FF"],
      borderPressed: ["rgba(255, 239, 128, 1)", "#FFEF80FF"],
      borderDisabled: ["rgba(255, 225, 0, 1)", "#FFE100FF"]
    };
    const currentDefaults = isDarkTheme ? darkDefaults : lightDefaults;
    const inputCache = isDarkTheme ? this._domCache.darkInputs : this._domCache.lightInputs;
    const themePrefix = isDarkTheme ? "dark" : "light";
    Object.entries(currentDefaults).forEach(([key, [colorValue, hexValue]]) => {
      const input = inputCache[key];
      if (input) {
        input.value = hexValue;
        const targetId = `${themePrefix}-${key.replace(/([A-Z])/g, "-$1").toLowerCase()}`;
        const picker = document.querySelector(`[data-target="${targetId}"]`);
        if (picker) {
          const colorDisplay = picker.querySelector(".color-display");
          const panelHexInput = picker.querySelector(".panel-hex-input");
          if (colorDisplay)
            colorDisplay.style.background = hexValue;
          if (panelHexInput)
            panelHexInput.value = hexValue;
        }
        this.CustomColorPicker.updateCSSVariable(targetId, hexValue);
        input.dispatchEvent(new Event("input", { bubbles: true }));
      }
    });
    this.reset3DSpheresToDefaults();
    this.generateAndApplyPalette();
    if (typeof ButtonSystem !== "undefined" && ButtonSystem.StyleManager) {
      ButtonSystem.StyleManager.scheduleUpdate();
    }
    requestAnimationFrame(() => {
      const customButtons = document.querySelectorAll(".button.custom");
      customButtons.forEach((button) => {
        button.offsetHeight;
        const background = button.querySelector(".background.dynamic");
        if (background) {
          background.offsetHeight;
        }
      });
    });
  },
  reset3DSpheresToDefaults() {
    document.querySelectorAll(".color-canvas-3d").forEach((canvas, index) => {
      const picker = canvas.closest(".custom-color-picker");
      if (!picker)
        return;
      const targetId = picker.dataset.target;
      const panelHexInput = picker.querySelector(".panel-hex-input");
      if (panelHexInput && panelHexInput.value) {
        const hexValue = panelHexInput.value.replace("#", "").toUpperCase();
        if (hexValue.length === 8 && /^[0-9A-F]{8}$/.test(hexValue)) {
          const r = parseInt(hexValue.substr(0, 2), 16);
          const g = parseInt(hexValue.substr(2, 2), 16);
          const b = parseInt(hexValue.substr(4, 2), 16);
          const position = Mechanics.colorToCoordinate("#" + hexValue.substr(0, 6));
          if (position) {
            const targetVector = Mechanics.sphericalToCartesian(1, position.theta, position.phi);
            const currentVector = [0, 0, 1];
            const axis = [
              currentVector[1] * targetVector[2] - currentVector[2] * targetVector[1],
              currentVector[2] * targetVector[0] - currentVector[0] * targetVector[2],
              currentVector[0] * targetVector[1] - currentVector[1] * targetVector[0]
            ];
            const dot = currentVector[0] * targetVector[0] + currentVector[1] * targetVector[1] + currentVector[2] * targetVector[2];
            const angle = Math.acos(Math.max(-1, Math.min(1, dot)));
            const normalizedAxis = Mechanics.normalize(axis);
            const targetQ = Mechanics.fromAxisAngle(normalizedAxis, angle);
            setTimeout(() => {
              Mechanics.animateToQuaternion(Mechanics.UnifiedSphereState, targetQ, canvas);
            }, index * 100);
          }
        }
      }
    });
    Mechanics.UnifiedSphereState.Q = [1, 0, 0, 0];
    Mechanics.UnifiedSphereState.selectedColor = Topology.COORDINATE_SYSTEM.POLAR_COLORS.NORTH_POLE;
  }
};

// src/index.js
console.log("\uD83D\uDCE6 [index.js] ES6 모듈 로딩 시작");
var moduleLoadStart = performance.now();
var moduleLoadEnd = performance.now();
console.log(`✅ [index.js] 모든 모듈 import 완료 (${(moduleLoadEnd - moduleLoadStart).toFixed(2)}ms)`);
console.log("\uD83D\uDCE4 [index.js] window 객체로 export 시작...");
window.ColorConverter = ColorConverter2;
window.Topology = Topology2;
window.Mechanics = Mechanics2;
window.AppUtils = { SVGLoader, CSSInjector };
window.ButtonSystem = ButtonSystem2;
window.ThemeManager = ThemeManager;
window.LargeTextManager = LargeTextManager;
window.SizeControlManager = SizeControlManager;
window.CustomPaletteManager = CustomPaletteManager;
window.ColorSphereUI = ColorSphereUI;
window.BUTTON_CONSTANTS = BUTTON_CONSTANTS;
console.log("✅ [index.js] 전역 export 완료");
console.log("\uD83D\uDCE5 [index.js] Chroma.js 로드 시작...");
var loadChroma = async () => {
  const CDN_URL = "https://cdn.jsdelivr.net/npm/chroma-js@2.4.2/chroma.min.js";
  const LOCAL_URL = "./src/lib/chroma.min.js";
  return new Promise((resolve, reject) => {
    const chromaScript = document.createElement("script");
    chromaScript.src = CDN_URL;
    console.log("\uD83C\uDF10 [index.js] CDN에서 로드 시도:", CDN_URL);
    chromaScript.onload = () => {
      console.log("✅ [index.js] CDN에서 Chroma.js 로드 성공");
      resolve("cdn");
    };
    chromaScript.onerror = () => {
      console.warn("⚠️ [index.js] CDN 로드 실패, 로컬 파일 시도...");
      const fallbackScript = document.createElement("script");
      fallbackScript.src = LOCAL_URL;
      console.log("\uD83D\uDCBE [index.js] 로컬 캐시에서 로드 시도:", LOCAL_URL);
      fallbackScript.onload = () => {
        console.log("✅ [index.js] 로컬 캐시에서 Chroma.js 로드 성공");
        resolve("local");
      };
      fallbackScript.onerror = () => {
        console.error("❌ [index.js] 로컬 파일도 로드 실패");
        reject(new Error("Chroma.js 로드 실패 (CDN & 로컬 모두 실패)"));
      };
      document.head.appendChild(fallbackScript);
    };
    document.head.appendChild(chromaScript);
  });
};
loadChroma().then(async (source) => {
  const chromaLoadTime = performance.now();
  console.log(`✅ [index.js] Chroma.js 로드 완료 (${source.toUpperCase()}) (${chromaLoadTime.toFixed(2)}ms)`);
  console.log("\uD83D\uDD0D [index.js] chroma 버전:", window.chroma?.version || "unknown");
  console.log("\uD83D\uDCE5 [index.js] app.js 로드 시작...");
  const appLoadStart = performance.now();
  try {
    await Promise.resolve().then(() => (init_app(), exports_app));
    const appLoadEnd = performance.now();
    console.log(`✅ [index.js] app.js 로드 완료 (${(appLoadEnd - appLoadStart).toFixed(2)}ms)`);
    console.log("\uD83C\uDF89 [index.js] 전체 시스템 로드 완료");
  } catch (error) {
    console.error("❌ [index.js] app.js 로드 실패:", error);
    throw error;
  }
}).catch((error) => {
  console.error("❌ [index.js] Chroma.js 로드 실패:", error);
  alert("Chroma.js 라이브러리를 로드할 수 없습니다.");
});

//# debugId=DEE63197095E0B4F64756E2164756E21
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsiLi5cXHNyY1xcYXBwLmpzIiwgIi4uXFxzcmNcXG1vZHVsZXNcXGNvbG9yXFxjb252ZXJ0ZXIuanMiLCAiLi5cXHNyY1xcbW9kdWxlc1xcY29sb3JcXHRvcG9sb2d5LmpzIiwgIi4uXFxzcmNcXG1vZHVsZXNcXHVpXFxjb2xvci1zcGhlcmUtdWkuanMiLCAiLi5cXHNyY1xcbW9kdWxlc1xcY29sb3JcXG1lY2hhbmljcy5qcyIsICIuLlxcc3JjXFxhc3NldHNcXGljb25zXFxpbmRleC5qcyIsICIuLlxcc3JjXFxtb2R1bGVzXFx1dGlsc1xcc3ZnLWxvYWRlci5qcyIsICIuLlxcc3JjXFxtb2R1bGVzXFx1dGlsc1xcY3NzLWluamVjdG9yLmpzIiwgIi4uXFxzcmNcXG1vZHVsZXNcXGJ1dHRvblxcY29uc3RhbnRzLmpzIiwgIi4uXFxzcmNcXG1vZHVsZXNcXGJ1dHRvblxccGFsZXR0ZS1tYW5hZ2VyLmpzIiwgIi4uXFxzcmNcXG1vZHVsZXNcXGJ1dHRvblxcc3R5bGUtbWFuYWdlci5qcyIsICIuLlxcc3JjXFxtb2R1bGVzXFxidXR0b25cXGJ1dHRvbi1zeXN0ZW0uanMiLCAiLi5cXHNyY1xcbW9kdWxlc1xcbWFuYWdlcnNcXHRoZW1lLW1hbmFnZXIuanMiLCAiLi5cXHNyY1xcbW9kdWxlc1xcbWFuYWdlcnNcXGxhcmdlLW1vZGUtbWFuYWdlci5qcyIsICIuLlxcc3JjXFxtb2R1bGVzXFxtYW5hZ2Vyc1xcc2l6ZS1jb250cm9sLW1hbmFnZXIuanMiLCAiLi5cXHNyY1xcbW9kdWxlc1xcbWFuYWdlcnNcXGN1c3RvbS1wYWxldHRlLW1hbmFnZXIuanMiLCAiLi5cXHNyY1xcaW5kZXguanMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbCiAgICAiLyogPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XHJcbiAg8J+TpiDrqqjrk4ggSW1wb3J0XHJcbiAgPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09ICovXHJcbmNvbnN0IHsgQ29sb3JDb252ZXJ0ZXIsIFRvcG9sb2d5LCBNZWNoYW5pY3MsIEFwcFV0aWxzLCBCdXR0b25TeXN0ZW0sIFRoZW1lTWFuYWdlciwgTGFyZ2VUZXh0TWFuYWdlciwgU2l6ZUNvbnRyb2xNYW5hZ2VyLCBDdXN0b21QYWxldHRlTWFuYWdlciB9ID0gd2luZG93O1xyXG5cclxuLyogPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XHJcbiAg8J+agCDsi5zsiqTthZwg7LSI6riw7ZmUIOuwjyDrrLTqsrDshLEg6rKA7KadXHJcbiAgPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09ICovXHJcblxyXG5jb25zdCBpbml0aWFsaXplQXBwID0gYXN5bmMgKCkgPT4ge1xyXG4gIC8vIEhUTUwg6rWs7KGwIOqygOymnVxyXG4gIGNvbnN0IHJlcXVpcmVkRWxlbWVudHMgPSBbJyNtYWluLWhlYWRlcicsICcjbWFpbi1jb250ZW50JywgJyNjb250cm9sLXBhbmVsJywgJyNkZW1vLWFyZWEnXTtcclxuICBjb25zdCBtaXNzaW5nRWxlbWVudHMgPSByZXF1aXJlZEVsZW1lbnRzLmZpbHRlcihzZWxlY3RvciA9PiAhZG9jdW1lbnQucXVlcnlTZWxlY3RvcihzZWxlY3RvcikpO1xyXG4gIGlmIChtaXNzaW5nRWxlbWVudHMubGVuZ3RoID4gMCkge1xyXG4gICAgLy8gSFRNTCDqtazsobAg7Jik66WYIOqwkOyngOuQqFxyXG4gIH1cclxuICBcclxuICAvLyBDU1Mg67OA7IiYIOqygOymnVxyXG4gIGNvbnN0IHRlc3RFbGVtZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XHJcbiAgZG9jdW1lbnQuYm9keS5hcHBlbmRDaGlsZCh0ZXN0RWxlbWVudCk7XHJcbiAgY29uc3QgY29tcHV0ZWRTdHlsZSA9IGdldENvbXB1dGVkU3R5bGUodGVzdEVsZW1lbnQpO1xyXG4gIGNvbnN0IGNyaXRpY2FsVmFycyA9IFsnLS1wcmltYXJ5MS1iYWNrZ3JvdW5kLWNvbG9yLWRlZmF1bHQnLCAnLS1jb2xvci1zeXN0ZW0tMDEnLCAnLS1mb250LWZhbWlseSddO1xyXG4gIGNvbnN0IG1pc3NpbmdWYXJzID0gY3JpdGljYWxWYXJzLmZpbHRlcih2YXJOYW1lID0+ICFjb21wdXRlZFN0eWxlLmdldFByb3BlcnR5VmFsdWUodmFyTmFtZSkpO1xyXG4gIGRvY3VtZW50LmJvZHkucmVtb3ZlQ2hpbGQodGVzdEVsZW1lbnQpO1xyXG4gIGlmIChtaXNzaW5nVmFycy5sZW5ndGggPiAwKSB7XHJcbiAgICAvLyBDU1Mg67OA7IiYIOyYpOulmCDqsJDsp4DrkKhcclxuICB9XHJcbiAgXHJcbiAgLy8gTWFuYWdlciDstIjquLDtmZQgKOyiheyGjeyEsSDsiJzshJwpXHJcbiAgdHJ5IHtcclxuICAgIFRoZW1lTWFuYWdlci5pbml0KCk7XHJcbiAgICBMYXJnZVRleHRNYW5hZ2VyLmluaXQoKTtcclxuICAgIFNpemVDb250cm9sTWFuYWdlci5pbml0KCk7XHJcbiAgICBDdXN0b21QYWxldHRlTWFuYWdlci5pbml0KCk7XHJcbiAgICBhd2FpdCBCdXR0b25TeXN0ZW0uaW5pdCgpO1xyXG4gIH0gY2F0Y2ggKGVycm9yKSB7XHJcbiAgICAvLyDsi5zsiqTthZwg7LSI6riw7ZmUIOyLpO2MqFxyXG4gICAgdGhyb3cgZXJyb3I7XHJcbiAgfVxyXG4gIFxyXG4vKiA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cclxuICDwn46uIOq4gOuhnOuyjCDsnbTrsqTtirgg7Iuc7Iqk7YWcXHJcbiAgPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09ICovXHJcblxyXG4gIC8vIOyciOuPhOyasCDrpqzsgqzsnbTspogg7IucIOuyhO2KvCDsiqTtg4Dsnbwg7J6s6rOE7IKwICjsk7DroZzti4Drp4EpXHJcbiAgbGV0IHJlc2l6ZVNjaGVkdWxlZCA9IGZhbHNlO1xyXG4gIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKFwicmVzaXplXCIsICgpID0+IHtcclxuICAgIGlmIChyZXNpemVTY2hlZHVsZWQpIHJldHVybjtcclxuICAgIHJlc2l6ZVNjaGVkdWxlZCA9IHRydWU7XHJcbiAgICByZXF1ZXN0QW5pbWF0aW9uRnJhbWUoKCkgPT4ge1xyXG4gICAgICBCdXR0b25TeXN0ZW0uU3R5bGVNYW5hZ2VyLmFwcGx5RHluYW1pY1N0eWxlcygpO1xyXG4gICAgICByZXNpemVTY2hlZHVsZWQgPSBmYWxzZTtcclxuICAgIH0pO1xyXG4gIH0pO1xyXG5cclxuICAvLyDthqDquIAg67KE7Yq8IO2BtOumrSDsspjrpqxcclxuICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIChldmVudCkgPT4ge1xyXG4gICAgY29uc3QgYnV0dG9uID0gZXZlbnQudGFyZ2V0Py5jbG9zZXN0Py4oJy5idXR0b24nKTtcclxuICAgIGlmICghYnV0dG9uIHx8IGJ1dHRvbi5nZXRBdHRyaWJ1dGUoJ2FyaWEtZGlzYWJsZWQnKSA9PT0gJ3RydWUnIHx8IFxyXG4gICAgICAgIGJ1dHRvbi5kYXRhc2V0LmlzVG9nZ2xlQnV0dG9uICE9PSAndHJ1ZScpIHJldHVybjtcclxuXHJcbiAgICBjb25zdCB3YXNQcmVzc2VkID0gYnV0dG9uLmNsYXNzTGlzdC5jb250YWlucygncHJlc3NlZCcpO1xyXG4gICAgY29uc3QgaWNvblByZXNzZWQgPSBidXR0b24ucXVlcnlTZWxlY3RvcignLmNvbnRlbnQuaWNvbi5wcmVzc2VkJyk7XHJcblxyXG4gICAgaWYgKHdhc1ByZXNzZWQpIHtcclxuICAgICAgaWYgKGljb25QcmVzc2VkKSBpY29uUHJlc3NlZC5zdHlsZS5kaXNwbGF5ID0gJ25vbmUnO1xyXG4gICAgICByZXF1ZXN0QW5pbWF0aW9uRnJhbWUoKCkgPT4ge1xyXG4gICAgICAgIGJ1dHRvbi5jbGFzc0xpc3QucmVtb3ZlKCdwcmVzc2VkJyk7XHJcbiAgICAgICAgYnV0dG9uLnNldEF0dHJpYnV0ZSgnYXJpYS1wcmVzc2VkJywgJ2ZhbHNlJyk7XHJcbiAgICAgICAgaWYgKGljb25QcmVzc2VkKSBpY29uUHJlc3NlZC5zdHlsZS5yZW1vdmVQcm9wZXJ0eSgnZGlzcGxheScpO1xyXG4gICAgICB9KTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIGlmIChpY29uUHJlc3NlZCkgaWNvblByZXNzZWQuc3R5bGUucmVtb3ZlUHJvcGVydHkoJ2Rpc3BsYXknKTtcclxuICAgICAgYnV0dG9uLmNsYXNzTGlzdC5hZGQoJ3ByZXNzZWQnKTtcclxuICAgICAgYnV0dG9uLnNldEF0dHJpYnV0ZSgnYXJpYS1wcmVzc2VkJywgJ3RydWUnKTtcclxuICAgICAgXHJcbiAgICAgIC8vIOyDge2DnCDrs4Dqsr0g7ZuEIOuqheuPhOuMgOu5hCDsl4XrjbDsnbTtirhcclxuICAgICAgQnV0dG9uU3lzdGVtLlN0eWxlTWFuYWdlci5zY2hlZHVsZUNvbnRyYXN0VXBkYXRlKCk7XHJcbiAgICB9XHJcbiAgfSwgZmFsc2UpO1xyXG5cclxuICAvLyDruYTtmZzshLEg67KE7Yq8IOydtOuypO2KuCDssKjri6hcclxuICBjb25zdCBibG9ja0Rpc2FibGVkQnV0dG9uRXZlbnRzID0gKGV2ZW50KSA9PiB7XHJcbiAgICBjb25zdCBkaXNhYmxlZEJ1dHRvbiA9IGV2ZW50LnRhcmdldD8uY2xvc2VzdD8uKCcuYnV0dG9uW2FyaWEtZGlzYWJsZWQ9XCJ0cnVlXCJdJyk7XHJcbiAgICBpZiAoZGlzYWJsZWRCdXR0b24pIHtcclxuICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcclxuICAgICAgZXZlbnQuc3RvcFByb3BhZ2F0aW9uKCk7XHJcbiAgICAgIGlmICh0eXBlb2YgZXZlbnQuc3RvcEltbWVkaWF0ZVByb3BhZ2F0aW9uID09PSAnZnVuY3Rpb24nKSBldmVudC5zdG9wSW1tZWRpYXRlUHJvcGFnYXRpb24oKTtcclxuICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICB9XHJcbiAgICByZXR1cm4gZmFsc2U7XHJcbiAgfTtcclxuXHJcbiAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBibG9ja0Rpc2FibGVkQnV0dG9uRXZlbnRzLCB0cnVlKTtcclxuXHJcbiAgLy8g7YKk67O065OcIOyeheugpSDsspjrpqwgKOu5hO2ZnOyEsSDrsoTtirwpXHJcbiAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcigna2V5ZG93bicsIChldmVudCkgPT4ge1xyXG4gICAgY29uc3QgZGlzYWJsZWRCdXR0b24gPSBldmVudC50YXJnZXQ/LmNsb3Nlc3Q/LignLmJ1dHRvblthcmlhLWRpc2FibGVkPVwidHJ1ZVwiXScpO1xyXG4gICAgaWYgKGRpc2FibGVkQnV0dG9uICYmIChldmVudC5rZXkgPT09ICcgJyB8fCBldmVudC5rZXkgPT09ICdFbnRlcicgfHwgZXZlbnQua2V5ID09PSAnTnVtcGFkRW50ZXInKSkge1xyXG4gICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xyXG4gICAgICBldmVudC5zdG9wUHJvcGFnYXRpb24oKTtcclxuICAgICAgcmV0dXJuO1xyXG4gICAgfVxyXG5cclxuICAgIGNvbnN0IGVuYWJsZWRCdXR0b24gPSBldmVudC50YXJnZXQ/LmNsb3Nlc3Q/LignLmJ1dHRvbicpO1xyXG4gICAgaWYgKGVuYWJsZWRCdXR0b24gJiYgZW5hYmxlZEJ1dHRvbi5nZXRBdHRyaWJ1dGUoJ2FyaWEtZGlzYWJsZWQnKSAhPT0gJ3RydWUnKSB7XHJcbiAgICAgIGlmIChldmVudC5rZXkgPT09ICdFbnRlcicgfHwgZXZlbnQua2V5ID09PSAnTnVtcGFkRW50ZXInIHx8IGV2ZW50LmtleSA9PT0gJyAnKSB7XHJcbiAgICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcclxuICAgICAgICBldmVudC5zdG9wUHJvcGFnYXRpb24oKTtcclxuICAgICAgICBcclxuICAgICAgICBjb25zdCBpc1RvZ2dsZUJ1dHRvbiA9IGVuYWJsZWRCdXR0b24uY2xhc3NMaXN0LmNvbnRhaW5zKCd0b2dnbGUnKTtcclxuICAgICAgICBcclxuICAgICAgICBpZiAoaXNUb2dnbGVCdXR0b24pIHtcclxuICAgICAgICAgIGNvbnN0IGNsaWNrRXZlbnQgPSBuZXcgTW91c2VFdmVudCgnY2xpY2snLCB7XHJcbiAgICAgICAgICAgIGJ1YmJsZXM6IHRydWUsXHJcbiAgICAgICAgICAgIGNhbmNlbGFibGU6IHRydWUsXHJcbiAgICAgICAgICAgIGJ1dHRvbjogMFxyXG4gICAgICAgICAgfSk7XHJcbiAgICAgICAgICBlbmFibGVkQnV0dG9uLmRpc3BhdGNoRXZlbnQoY2xpY2tFdmVudCk7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgIGVuYWJsZWRCdXR0b24uY2xhc3NMaXN0LmFkZCgncHJlc3NlZCcpO1xyXG4gICAgICAgIHNldFRpbWVvdXQoKCkgPT4ge1xyXG4gICAgICAgICAgZW5hYmxlZEJ1dHRvbi5jbGFzc0xpc3QucmVtb3ZlKCdwcmVzc2VkJyk7XHJcbiAgICAgICAgICBjb25zdCBjbGlja0V2ZW50ID0gbmV3IE1vdXNlRXZlbnQoJ2NsaWNrJywge1xyXG4gICAgICAgICAgICBidWJibGVzOiB0cnVlLFxyXG4gICAgICAgICAgICBjYW5jZWxhYmxlOiB0cnVlLFxyXG4gICAgICAgICAgICBidXR0b246IDBcclxuICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgZW5hYmxlZEJ1dHRvbi5kaXNwYXRjaEV2ZW50KGNsaWNrRXZlbnQpO1xyXG4gICAgICAgIH0sIDEwMCk7XHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgfSwgdHJ1ZSk7XHJcblxyXG4gIC8vIOuwqe2Wpe2CpCDrhKTruYTqsozsnbTshZggKOy0iOygkCDsnbTrj5kpXHJcbiAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcigna2V5ZG93bicsIChldmVudCkgPT4ge1xyXG4gICAgY29uc3QgZm9jdXNlZEJ1dHRvbiA9IGRvY3VtZW50LmFjdGl2ZUVsZW1lbnQ7XHJcbiAgICBjb25zdCBpc0Fycm93S2V5ID0gWydBcnJvd0Rvd24nLCAnQXJyb3dVcCcsICdBcnJvd1JpZ2h0JywgJ0Fycm93TGVmdCcsICdIb21lJywgJ0VuZCddLmluY2x1ZGVzKGV2ZW50LmtleSk7XHJcbiAgICBcclxuICAgIGlmICgoIWZvY3VzZWRCdXR0b24gfHwgIWZvY3VzZWRCdXR0b24uY2xhc3NMaXN0LmNvbnRhaW5zKCdidXR0b24nKSkgJiYgaXNBcnJvd0tleSkge1xyXG4gICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xyXG4gICAgICBjb25zdCBmaXJzdEJ1dHRvbiA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5idXR0b24nKTtcclxuICAgICAgaWYgKGZpcnN0QnV0dG9uKSB7XHJcbiAgICAgICAgZmlyc3RCdXR0b24uZm9jdXMoKTtcclxuICAgICAgfVxyXG4gICAgICByZXR1cm47XHJcbiAgICB9XHJcblxyXG4gICAgaWYgKCFmb2N1c2VkQnV0dG9uIHx8ICFmb2N1c2VkQnV0dG9uLmNsYXNzTGlzdC5jb250YWlucygnYnV0dG9uJykpIHtcclxuICAgICAgcmV0dXJuO1xyXG4gICAgfVxyXG5cclxuICAgIGxldCB0YXJnZXRCdXR0b24gPSBudWxsO1xyXG4gICAgY29uc3QgYWxsQnV0dG9ucyA9IEFycmF5LmZyb20oZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgnLmJ1dHRvbicpKS5maWx0ZXIoYnRuID0+IFxyXG4gICAgICBidG4ub2Zmc2V0UGFyZW50ICE9PSBudWxsXHJcbiAgICApO1xyXG5cclxuICAgIHN3aXRjaCAoZXZlbnQua2V5KSB7XHJcbiAgICAgIGNhc2UgJ0Fycm93UmlnaHQnOlxyXG4gICAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XHJcbiAgICAgICAgY29uc3QgY3VycmVudEluZGV4ID0gYWxsQnV0dG9ucy5pbmRleE9mKGZvY3VzZWRCdXR0b24pO1xyXG4gICAgICAgIGNvbnN0IG5leHRJbmRleCA9IChjdXJyZW50SW5kZXggKyAxKSAlIGFsbEJ1dHRvbnMubGVuZ3RoO1xyXG4gICAgICAgIHRhcmdldEJ1dHRvbiA9IGFsbEJ1dHRvbnNbbmV4dEluZGV4XTtcclxuICAgICAgICBicmVhaztcclxuICAgICAgICBcclxuICAgICAgY2FzZSAnQXJyb3dMZWZ0JzpcclxuICAgICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xyXG4gICAgICAgIGNvbnN0IGN1cnJlbnRJbmRleDIgPSBhbGxCdXR0b25zLmluZGV4T2YoZm9jdXNlZEJ1dHRvbik7XHJcbiAgICAgICAgY29uc3QgcHJldkluZGV4ID0gY3VycmVudEluZGV4MiA9PT0gMCA/IGFsbEJ1dHRvbnMubGVuZ3RoIC0gMSA6IGN1cnJlbnRJbmRleDIgLSAxO1xyXG4gICAgICAgIHRhcmdldEJ1dHRvbiA9IGFsbEJ1dHRvbnNbcHJldkluZGV4XTtcclxuICAgICAgICBicmVhaztcclxuXHJcbiAgICAgIGNhc2UgJ0Fycm93RG93bic6XHJcbiAgICAgICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xyXG4gICAgICAgIGNvbnN0IGN1cnJlbnRDb250YWluZXIgPSBmb2N1c2VkQnV0dG9uLmNsb3Nlc3QoJy5zaG93Y2FzZScpO1xyXG4gICAgICAgIGNvbnN0IGN1cnJlbnRJbmRleEZvckRvd24gPSBhbGxCdXR0b25zLmluZGV4T2YoZm9jdXNlZEJ1dHRvbik7XHJcbiAgICAgICAgXHJcbiAgICAgICAgZm9yIChsZXQgaSA9IDE7IGkgPCBhbGxCdXR0b25zLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICBjb25zdCBuZXh0SW5kZXggPSAoY3VycmVudEluZGV4Rm9yRG93biArIGkpICUgYWxsQnV0dG9ucy5sZW5ndGg7XHJcbiAgICAgICAgICBjb25zdCBuZXh0QnV0dG9uID0gYWxsQnV0dG9uc1tuZXh0SW5kZXhdO1xyXG4gICAgICAgICAgY29uc3QgbmV4dENvbnRhaW5lciA9IG5leHRCdXR0b24uY2xvc2VzdCgnLnNob3djYXNlJyk7XHJcbiAgICAgICAgICBcclxuICAgICAgICAgIGlmIChuZXh0Q29udGFpbmVyICE9PSBjdXJyZW50Q29udGFpbmVyKSB7XHJcbiAgICAgICAgICAgIHRhcmdldEJ1dHRvbiA9IG5leHRCdXR0b247XHJcbiAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgXHJcbiAgICAgIGNhc2UgJ0Fycm93VXAnOlxyXG4gICAgICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcclxuICAgICAgICBjb25zdCBjdXJyZW50Q29udGFpbmVyVXAgPSBmb2N1c2VkQnV0dG9uLmNsb3Nlc3QoJy5zaG93Y2FzZScpO1xyXG4gICAgICAgIGNvbnN0IGN1cnJlbnRJbmRleFVwID0gYWxsQnV0dG9ucy5pbmRleE9mKGZvY3VzZWRCdXR0b24pO1xyXG4gICAgICAgIFxyXG4gICAgICAgIGZvciAobGV0IGkgPSAxOyBpIDwgYWxsQnV0dG9ucy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgY29uc3QgcHJldkluZGV4ID0gKGN1cnJlbnRJbmRleFVwIC0gaSArIGFsbEJ1dHRvbnMubGVuZ3RoKSAlIGFsbEJ1dHRvbnMubGVuZ3RoO1xyXG4gICAgICAgICAgY29uc3QgcHJldkJ1dHRvbiA9IGFsbEJ1dHRvbnNbcHJldkluZGV4XTtcclxuICAgICAgICAgIGNvbnN0IHByZXZDb250YWluZXIgPSBwcmV2QnV0dG9uLmNsb3Nlc3QoJy5zaG93Y2FzZScpO1xyXG4gICAgICAgICAgXHJcbiAgICAgICAgICBpZiAocHJldkNvbnRhaW5lciAhPT0gY3VycmVudENvbnRhaW5lclVwKSB7XHJcbiAgICAgICAgICAgIGNvbnN0IGJ1dHRvbnNJblByZXZDb250YWluZXIgPSBhbGxCdXR0b25zLmZpbHRlcihidG4gPT4gYnRuLmNsb3Nlc3QoJy5zaG93Y2FzZScpID09PSBwcmV2Q29udGFpbmVyKTtcclxuICAgICAgICAgICAgdGFyZ2V0QnV0dG9uID0gYnV0dG9uc0luUHJldkNvbnRhaW5lclswXTtcclxuICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgXHJcbiAgICAgIGNhc2UgJ0hvbWUnOlxyXG4gICAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XHJcbiAgICAgICAgdGFyZ2V0QnV0dG9uID0gYWxsQnV0dG9uc1swXTtcclxuICAgICAgICBicmVhaztcclxuICAgICAgICBcclxuICAgICAgY2FzZSAnRW5kJzpcclxuICAgICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xyXG4gICAgICAgIHRhcmdldEJ1dHRvbiA9IGFsbEJ1dHRvbnNbYWxsQnV0dG9ucy5sZW5ndGggLSAxXTtcclxuICAgICAgICBicmVhaztcclxuICAgIH1cclxuXHJcbiAgICBpZiAodGFyZ2V0QnV0dG9uKSB7XHJcbiAgICAgIHRhcmdldEJ1dHRvbi5mb2N1cygpO1xyXG4gICAgfVxyXG4gIH0sIHRydWUpO1xyXG5cclxuICAvLyDrp4jsmrDsiqQg64uk7Jq0IC0gcHJlc3NlZCDsg4Htg5wg7LaU6rCAXHJcbiAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignbW91c2Vkb3duJywgKGV2ZW50KSA9PiB7XHJcbiAgICBjb25zdCBidXR0b24gPSBldmVudC50YXJnZXQ/LmNsb3Nlc3Q/LignLmJ1dHRvbicpO1xyXG4gICAgaWYgKGJ1dHRvbiAmJiBidXR0b24uZ2V0QXR0cmlidXRlKCdhcmlhLWRpc2FibGVkJykgIT09ICd0cnVlJyAmJiAhYnV0dG9uLmNsYXNzTGlzdC5jb250YWlucygndG9nZ2xlJykpIHtcclxuICAgICAgYnV0dG9uLmNsYXNzTGlzdC5hZGQoJ3ByZXNzZWQnKTtcclxuICAgIH1cclxuICB9LCB0cnVlKTtcclxuXHJcbiAgLy8g66eI7Jqw7IqkIOyXhSAtIHByZXNzZWQg7IOB7YOcIOygnOqxsCDrsI8g66qF64+E64yA67mEIOyXheuNsOydtO2KuFxyXG4gIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNldXAnLCAoZXZlbnQpID0+IHtcclxuICAgIGNvbnN0IGJ1dHRvbiA9IGV2ZW50LnRhcmdldD8uY2xvc2VzdD8uKCcuYnV0dG9uJyk7XHJcbiAgICBpZiAoYnV0dG9uICYmIGJ1dHRvbi5jbGFzc0xpc3QuY29udGFpbnMoJ3ByZXNzZWQnKSAmJiAhYnV0dG9uLmNsYXNzTGlzdC5jb250YWlucygndG9nZ2xlJykpIHtcclxuICAgICAgYnV0dG9uLmNsYXNzTGlzdC5yZW1vdmUoJ3ByZXNzZWQnKTtcclxuICAgICAgXHJcbiAgICAgIC8vIOyDge2DnCDrs4Dqsr0g7ZuEIOuqheuPhOuMgOu5hCDsl4XrjbDsnbTtirhcclxuICAgICAgQnV0dG9uU3lzdGVtLlN0eWxlTWFuYWdlci5zY2hlZHVsZUNvbnRyYXN0VXBkYXRlKCk7XHJcbiAgICB9XHJcbiAgfSwgdHJ1ZSk7XHJcblxyXG4gIC8vIOuniOyasOyKpCDsmIHsl60g67KX7Ja064KoIC0gcHJlc3NlZCDsg4Htg5wg7KCc6rGwXHJcbiAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignbW91c2VsZWF2ZScsIChldmVudCkgPT4ge1xyXG4gICAgaWYgKGV2ZW50LnRhcmdldCAmJiB0eXBlb2YgZXZlbnQudGFyZ2V0LmNsb3Nlc3QgPT09ICdmdW5jdGlvbicpIHtcclxuICAgICAgY29uc3QgYnV0dG9uID0gZXZlbnQudGFyZ2V0Py5jbG9zZXN0Py4oJy5idXR0b24nKTtcclxuICAgICAgaWYgKGJ1dHRvbiAmJiBidXR0b24uY2xhc3NMaXN0LmNvbnRhaW5zKCdwcmVzc2VkJykgJiYgIWJ1dHRvbi5jbGFzc0xpc3QuY29udGFpbnMoJ3RvZ2dsZScpKSB7XHJcbiAgICAgIGJ1dHRvbi5jbGFzc0xpc3QucmVtb3ZlKCdwcmVzc2VkJyk7XHJcbiAgICAgICAgXHJcbiAgICAgIC8vIOyDge2DnCDrs4Dqsr0g7ZuEIOyXheuNsOydtO2KuFxyXG4gICAgICBCdXR0b25TeXN0ZW0uU3R5bGVNYW5hZ2VyLnNjaGVkdWxlVXBkYXRlKCk7XHJcbiAgICAgIH1cclxuICAgIH1cclxuICB9LCB0cnVlKTtcclxuXHJcbiAgLy8g7YSw7LmYIOyLnOyekSAtIHByZXNzZWQg7IOB7YOcIOy2lOqwgFxyXG4gIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ3RvdWNoc3RhcnQnLCAoZXZlbnQpID0+IHtcclxuICAgIGNvbnN0IGJ1dHRvbiA9IGV2ZW50LnRhcmdldD8uY2xvc2VzdD8uKCcuYnV0dG9uJyk7XHJcbiAgICBpZiAoYnV0dG9uICYmIGJ1dHRvbi5nZXRBdHRyaWJ1dGUoJ2FyaWEtZGlzYWJsZWQnKSAhPT0gJ3RydWUnICYmICFidXR0b24uY2xhc3NMaXN0LmNvbnRhaW5zKCd0b2dnbGUnKSkge1xyXG4gICAgICBidXR0b24uY2xhc3NMaXN0LmFkZCgncHJlc3NlZCcpO1xyXG4gICAgfVxyXG4gIH0sIHsgcGFzc2l2ZTogdHJ1ZSB9KTtcclxuXHJcbiAgLy8g7YSw7LmYIOyiheujjCAtIHByZXNzZWQg7IOB7YOcIOygnOqxsFxyXG4gIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ3RvdWNoZW5kJywgKGV2ZW50KSA9PiB7XHJcbiAgICBjb25zdCBidXR0b24gPSBldmVudC50YXJnZXQ/LmNsb3Nlc3Q/LignLmJ1dHRvbicpO1xyXG4gICAgaWYgKGJ1dHRvbiAmJiBidXR0b24uY2xhc3NMaXN0LmNvbnRhaW5zKCdwcmVzc2VkJykgJiYgIWJ1dHRvbi5jbGFzc0xpc3QuY29udGFpbnMoJ3RvZ2dsZScpKSB7XHJcbiAgICAgIGJ1dHRvbi5jbGFzc0xpc3QucmVtb3ZlKCdwcmVzc2VkJyk7XHJcbiAgICAgIFxyXG4gICAgICAvLyDsg4Htg5wg67OA6rK9IO2bhCDrqoXrj4TrjIDruYQg7JeF642w7J207Yq4XHJcbiAgICAgIEJ1dHRvblN5c3RlbS5TdHlsZU1hbmFnZXIuc2NoZWR1bGVDb250cmFzdFVwZGF0ZSgpO1xyXG4gICAgfVxyXG4gIH0sIHsgcGFzc2l2ZTogdHJ1ZSB9KTtcclxuXHJcbiAgLy8g7YSw7LmYIOy3qOyGjCAtIHByZXNzZWQg7IOB7YOcIOygnOqxsFxyXG4gIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ3RvdWNoY2FuY2VsJywgKGV2ZW50KSA9PiB7XHJcbiAgICBjb25zdCBidXR0b24gPSBldmVudC50YXJnZXQ/LmNsb3Nlc3Q/LignLmJ1dHRvbicpO1xyXG4gICAgaWYgKGJ1dHRvbiAmJiBidXR0b24uY2xhc3NMaXN0LmNvbnRhaW5zKCdwcmVzc2VkJykgJiYgIWJ1dHRvbi5jbGFzc0xpc3QuY29udGFpbnMoJ3RvZ2dsZScpKSB7XHJcbiAgICAgIGJ1dHRvbi5jbGFzc0xpc3QucmVtb3ZlKCdwcmVzc2VkJyk7XHJcbiAgICAgIFxyXG4gICAgICAvLyDsg4Htg5wg67OA6rK9IO2bhCDrqoXrj4TrjIDruYQg7JeF642w7J207Yq4XHJcbiAgICAgIEJ1dHRvblN5c3RlbS5TdHlsZU1hbmFnZXIuc2NoZWR1bGVDb250cmFzdFVwZGF0ZSgpO1xyXG4gICAgfVxyXG4gIH0sIHsgcGFzc2l2ZTogdHJ1ZSB9KTtcclxuXHJcbiAgLy8g7KCE7JetIOqwneyytCDrhbjstpwgKOuUlOuyhOq5hSDrsI8g7ZWY7JyEIO2YuO2ZmOyEsSlcclxuICB3aW5kb3cuQXBwVXRpbHMgPSBBcHBVdGlscztcclxuICB3aW5kb3cuQnV0dG9uU3lzdGVtID0gQnV0dG9uU3lzdGVtO1xyXG4gIHdpbmRvdy5UaGVtZU1hbmFnZXIgPSBUaGVtZU1hbmFnZXI7XHJcbiAgd2luZG93LkxhcmdlVGV4dE1hbmFnZXIgPSBMYXJnZVRleHRNYW5hZ2VyO1xyXG4gIHdpbmRvdy5TaXplQ29udHJvbE1hbmFnZXIgPSBTaXplQ29udHJvbE1hbmFnZXI7XHJcbiAgd2luZG93LkN1c3RvbVBhbGV0dGVNYW5hZ2VyID0gQ3VzdG9tUGFsZXR0ZU1hbmFnZXI7XHJcbn07XHJcblxyXG4vLyBET00g66Gc65OcIOyZhOujjCDtm4Qg7LSI6riw7ZmUIOyLpO2WiVxyXG5pZiAoZG9jdW1lbnQucmVhZHlTdGF0ZSA9PT0gJ2xvYWRpbmcnKSB7XHJcbiAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ0RPTUNvbnRlbnRMb2FkZWQnLCBpbml0aWFsaXplQXBwKTtcclxufSBlbHNlIHtcclxuICBpbml0aWFsaXplQXBwKCk7XHJcbn1cclxuIiwKICAgICIvKiA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cclxuICDwn46oIOyDieyDgSDsu6jrsoTthLAg66qo65OIXHJcbiAgPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09ICovXHJcblxyXG5leHBvcnQgY29uc3QgQ29sb3JDb252ZXJ0ZXIgPSB7XHJcbiAgLy8gOOyekOumrCDtl6XsiqTsvZTrk5wg67OA7ZmYXHJcbiAgcmdiYVRvSGV4KHIsIGcsIGIsIGEgPSAyNTUpIHtcclxuICAgIHJldHVybiBjaHJvbWEucmdiKHIsIGcsIGIpLmFscGhhKGEgLyAyNTUpLmhleCgncmdiYScpLnRvVXBwZXJDYXNlKCk7XHJcbiAgfSxcclxuICAvLyBSR0JBIOyngeygkSDsg53shLEgKO2MjOyLsSDsmKTrsoTtl6Trk5wg7JeG7J2MKVxyXG4gIHJnYmEociwgZywgYiwgYSA9IDI1NSkge1xyXG4gICAgcmV0dXJuIHsgciwgZywgYiwgYSB9O1xyXG4gIH0sXHJcbiAgLy8gOOyekOumrCDtl6XsiqTsvZTrk5wg7YyM7IuxXHJcbiAgaGV4VG9SZ2JhKGhleCkge1xyXG4gICAgY29uc3QgY29sb3IgPSBjaHJvbWEoaGV4KTtcclxuICAgIGNvbnN0IHJnYiA9IGNvbG9yLnJnYigpO1xyXG4gICAgcmV0dXJuIHtcclxuICAgICAgcjogcmdiWzBdLFxyXG4gICAgICBnOiByZ2JbMV0sXHJcbiAgICAgIGI6IHJnYlsyXSxcclxuICAgICAgYTogTWF0aC5yb3VuZChjb2xvci5hbHBoYSgpICogMjU1KVxyXG4gICAgfTtcclxuICB9LFxyXG4gIC8vIEhTViDihpIgUkdCIOuzgO2ZmFxyXG4gIGhzdlRvUmdiKGgsIHMsIHYpIHtcclxuICAgIGNvbnN0IHJnYiA9IGNocm9tYS5oc3YoaCwgcywgdikucmdiKCk7XHJcbiAgICByZXR1cm4ge1xyXG4gICAgICByOiByZ2JbMF0sXHJcbiAgICAgIGc6IHJnYlsxXSxcclxuICAgICAgYjogcmdiWzJdXHJcbiAgICB9O1xyXG4gIH0sXHJcbiAgLy8gSFNWIOKGkiA47J6Q66asIO2XpeyKpOy9lOuTnCDrs4DtmZhcclxuICBoc3ZUb0hleChoLCBzLCB2LCBhID0gMjU1KSB7XHJcbiAgICByZXR1cm4gY2hyb21hLmhzdihoLCBzLCB2KS5hbHBoYShhIC8gMjU1KS5oZXgoJ3JnYmEnKS50b1VwcGVyQ2FzZSgpO1xyXG4gIH0sXHJcbiAgLy8gUkdCIOKGkiBIU0wg67OA7ZmYXHJcbiAgcmdiVG9Ic2wociwgZywgYikge1xyXG4gICAgY29uc3QgaHNsID0gY2hyb21hLnJnYihyLCBnLCBiKS5oc2woKTtcclxuICAgIHJldHVybiB7XHJcbiAgICAgIGg6IE1hdGgucm91bmQoaHNsWzBdIHx8IDApLFxyXG4gICAgICBzOiBNYXRoLnJvdW5kKGhzbFsxXSAqIDEwMCksXHJcbiAgICAgIGw6IE1hdGgucm91bmQoaHNsWzJdICogMTAwKVxyXG4gICAgfTtcclxuICB9LFxyXG4gIC8vIEhTTCDihpIgUkdCIOuzgO2ZmFxyXG4gIGhzbFRvUmdiKGgsIHMsIGwpIHtcclxuICAgIGNvbnN0IHJnYiA9IGNocm9tYS5oc2woaCwgcywgbCkucmdiKCk7XHJcbiAgICByZXR1cm4ge1xyXG4gICAgICByOiByZ2JbMF0sXHJcbiAgICAgIGc6IHJnYlsxXSxcclxuICAgICAgYjogcmdiWzJdXHJcbiAgICB9O1xyXG4gIH0sXHJcbiAgLy8gSFNMIOKGkiA47J6Q66asIO2XpeyKpOy9lOuTnCDrs4DtmZhcclxuICBoc2xUb0hleChoLCBzLCBsLCBhID0gMjU1KSB7XHJcbiAgICByZXR1cm4gY2hyb21hLmhzbChoLCBzLCBsKS5hbHBoYShhIC8gMjU1KS5oZXgoJ3JnYmEnKS50b1VwcGVyQ2FzZSgpO1xyXG4gIH1cclxufTtcclxuIiwKICAgICIvKiA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cclxuICDwn4yQIO2Gte2VqSDsnITsg4Eg7Iuc7Iqk7YWcIOuqqOuTiFxyXG4gID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PSAqL1xyXG5cclxuZXhwb3J0IGNvbnN0IFRvcG9sb2d5ID0ge1xyXG4gIC8vIOyijO2RnOqzhCDsg4HsiJgg7KCV7J2YXHJcbiAgQ09PUkRJTkFURV9TWVNURU06IHtcclxuICAgIFNQSEVSSUNBTDoge1xyXG4gICAgICBOT1JUSF9QT0xFOiB7IHRoZXRhOiAwLCBwaGk6IDAgfSxcclxuICAgICAgU09VVEhfUE9MRTogeyB0aGV0YTogTWF0aC5QSSwgcGhpOiAwIH0sXHJcbiAgICAgIEVRVUFUT1I6IHsgdGhldGE6IE1hdGguUEkvMiwgcGhpOiAwIH1cclxuICAgIH0sXHJcbiAgICBcclxuICAgIENBUlRFU0lBTjoge1xyXG4gICAgICBPUklHSU46IHsgeDogMCwgeTogMCwgejogMCB9LFxyXG4gICAgICBOT1JUSF9QT0xFOiB7IHg6IDAsIHk6IDAsIHo6IDEgfSxcclxuICAgICAgU09VVEhfUE9MRTogeyB4OiAwLCB5OiAwLCB6OiAtMSB9XHJcbiAgICB9LFxyXG4gICAgXHJcbiAgICBQT0xBUl9DT0xPUlM6IHtcclxuICAgICAgTk9SVEhfUE9MRTogeyByOiAyNTUsIGc6IDI1NSwgYjogMjU1IH0sXHJcbiAgICAgIFNPVVRIX1BPTEU6IHsgcjogMCwgZzogMCwgYjogMCB9XHJcbiAgICB9LFxyXG5cclxuICAgIFNDUkVFTjoge1xyXG4gICAgICBDRU5URVI6IHsgeDogMCwgeTogMCB9LFxyXG4gICAgICBVTklUX1JBRElVUzogMVxyXG4gICAgfSxcclxuICB9LFxyXG5cclxuICAvLyDqtazrqbQg7KKM7ZGcKHRoZXRhLCBwaGkpIOKGkiBSR0Ig7IOJ7IOBIOqzhOyCsFxyXG4gIGNhbGN1bGF0ZUNvbG9yKHRoZXRhLCBwaGkpIHtcclxuICAgIGNvbnN0IGh1ZSA9ICgocGhpICsgTWF0aC5QSSkgLyAoMiAqIE1hdGguUEkpKSAqIDM2MDtcclxuICAgIGNvbnN0IGg2ID0gTWF0aC5mbG9vcihodWUgLyA2MCkgJSA2O1xyXG4gICAgY29uc3QgZiA9IChodWUgJSA2MCkgLyA2MDtcclxuICAgIFxyXG4gICAgY29uc3QgZ2V0SHVlQ29sb3IgPSAoKSA9PiB7XHJcbiAgICAgIHN3aXRjaChoNikge1xyXG4gICAgICAgIGNhc2UgMDogcmV0dXJuIHsgcjogMjU1LCBnOiBNYXRoLnJvdW5kKGYgKiAyNTUpLCBiOiAwIH07XHJcbiAgICAgICAgY2FzZSAxOiByZXR1cm4geyByOiBNYXRoLnJvdW5kKCgxLWYpICogMjU1KSwgZzogMjU1LCBiOiAwIH07XHJcbiAgICAgICAgY2FzZSAyOiByZXR1cm4geyByOiAwLCBnOiAyNTUsIGI6IE1hdGgucm91bmQoZiAqIDI1NSkgfTtcclxuICAgICAgICBjYXNlIDM6IHJldHVybiB7IHI6IDAsIGc6IE1hdGgucm91bmQoKDEtZikgKiAyNTUpLCBiOiAyNTUgfTtcclxuICAgICAgICBjYXNlIDQ6IHJldHVybiB7IHI6IE1hdGgucm91bmQoZiAqIDI1NSksIGc6IDAsIGI6IDI1NSB9O1xyXG4gICAgICAgIGNhc2UgNTogcmV0dXJuIHsgcjogMjU1LCBnOiAwLCBiOiBNYXRoLnJvdW5kKCgxLWYpICogMjU1KSB9O1xyXG4gICAgICB9XHJcbiAgICB9O1xyXG4gICAgXHJcbiAgICBjb25zdCB0aGV0YURlZyA9IHRoZXRhICogMTgwIC8gTWF0aC5QSTtcclxuICAgIGNvbnN0IGxpZ2h0bmVzc1JhdGlvID0gdGhldGFEZWcgPCA5MCA/IDEuMCAtICgodGhldGFEZWcgLSAzKSAvIDg0KSAqIDAuNSA6IDAuNSAtICgodGhldGFEZWcgLSA5MykgLyA4NCkgKiAwLjU7XHJcbiAgICBjb25zdCB7IHI6IGJhc2VSLCBnOiBiYXNlRywgYjogYmFzZUIgfSA9IGdldEh1ZUNvbG9yKCk7XHJcbiAgICBjb25zdCB0b3RhbFNhdHVyYXRpb24gPSBNYXRoLnNpbih0aGV0YSk7XHJcbiAgICBjb25zdCBncmF5ID0gTWF0aC5yb3VuZChsaWdodG5lc3NSYXRpbyAqIDI1NSk7XHJcbiAgICBcclxuICAgIHJldHVybiB7XHJcbiAgICAgIHI6IE1hdGgucm91bmQoZ3JheSArIChiYXNlUiAtIGdyYXkpICogdG90YWxTYXR1cmF0aW9uKSxcclxuICAgICAgZzogTWF0aC5yb3VuZChncmF5ICsgKGJhc2VHIC0gZ3JheSkgKiB0b3RhbFNhdHVyYXRpb24pLFxyXG4gICAgICBiOiBNYXRoLnJvdW5kKGdyYXkgKyAoYmFzZUIgLSBncmF5KSAqIHRvdGFsU2F0dXJhdGlvbilcclxuICAgIH07XHJcbiAgfSxcclxuXHJcbiAgLy8g64yA7LK0IOyDieyDgSDqs4TsgrAgKOq3ueyngOuwqSDrsI8g7KCB64+EIOy1nOygge2ZlClcclxuICBjYWxjdWxhdGVDb2xvcjIodGhldGEsIHBoaSkge1xyXG4gICAgY29uc3QgdGhldGFEZWcgPSB0aGV0YSAqIDE4MCAvIE1hdGguUEk7XHJcbiAgICBjb25zdCBpc1BvbGFyUmVnaW9uID0gKHRoZXRhRGVnIDwgMyB8fCB0aGV0YURlZyA+IDE3Nyk7XHJcbiAgICBjb25zdCBpc0VxdWF0b3JSZWdpb24gPSAoTWF0aC5hYnModGhldGFEZWcgLSA5MCkgPCAzKTtcclxuICAgIFxyXG4gICAgaWYgKGlzUG9sYXJSZWdpb24pIHtcclxuICAgICAgcmV0dXJuIHRoZXRhRGVnIDwgMyA/IHRoaXMuQ09PUkRJTkFURV9TWVNURU0uUE9MQVJfQ09MT1JTLk5PUlRIX1BPTEUgOiB0aGlzLkNPT1JESU5BVEVfU1lTVEVNLlBPTEFSX0NPTE9SUy5TT1VUSF9QT0xFO1xyXG4gICAgfVxyXG4gICAgXHJcbiAgICBjb25zdCBodWUgPSAoKHBoaSArIE1hdGguUEkpIC8gKDIgKiBNYXRoLlBJKSkgKiAzNjA7XHJcbiAgICBjb25zdCBoNiA9IE1hdGguZmxvb3IoaHVlIC8gNjApICUgNjtcclxuICAgIGNvbnN0IGYgPSAoaHVlICUgNjApIC8gNjA7XHJcbiAgICBcclxuICAgIGNvbnN0IGdldEh1ZUNvbG9yID0gKCkgPT4ge1xyXG4gICAgICBzd2l0Y2goaDYpIHtcclxuICAgICAgICBjYXNlIDA6IHJldHVybiB7IHI6IDI1NSwgZzogTWF0aC5yb3VuZChmICogMjU1KSwgYjogMCB9O1xyXG4gICAgICAgIGNhc2UgMTogcmV0dXJuIHsgcjogTWF0aC5yb3VuZCgoMS1mKSAqIDI1NSksIGc6IDI1NSwgYjogMCB9O1xyXG4gICAgICAgIGNhc2UgMjogcmV0dXJuIHsgcjogMCwgZzogMjU1LCBiOiBNYXRoLnJvdW5kKGYgKiAyNTUpIH07XHJcbiAgICAgICAgY2FzZSAzOiByZXR1cm4geyByOiAwLCBnOiBNYXRoLnJvdW5kKCgxLWYpICogMjU1KSwgYjogMjU1IH07XHJcbiAgICAgICAgY2FzZSA0OiByZXR1cm4geyByOiBNYXRoLnJvdW5kKGYgKiAyNTUpLCBnOiAwLCBiOiAyNTUgfTtcclxuICAgICAgICBjYXNlIDU6IHJldHVybiB7IHI6IDI1NSwgZzogMCwgYjogTWF0aC5yb3VuZCgoMS1mKSAqIDI1NSkgfTtcclxuICAgICAgfVxyXG4gICAgfTtcclxuICAgIFxyXG4gICAgaWYgKGlzRXF1YXRvclJlZ2lvbikge1xyXG4gICAgICByZXR1cm4gZ2V0SHVlQ29sb3IoKTtcclxuICAgIH1cclxuICAgIFxyXG4gICAgY29uc3QgbGlnaHRuZXNzUmF0aW8gPSB0aGV0YURlZyA8IDkwID8gMS4wIC0gKCh0aGV0YURlZyAtIDMpIC8gODQpICogMC41IDogMC41IC0gKCh0aGV0YURlZyAtIDkzKSAvIDg0KSAqIDAuNTtcclxuICAgIGNvbnN0IHsgcjogYmFzZVIsIGc6IGJhc2VHLCBiOiBiYXNlQiB9ID0gZ2V0SHVlQ29sb3IoKTtcclxuICAgIGNvbnN0IHRvdGFsU2F0dXJhdGlvbiA9IE1hdGguc2luKHRoZXRhKTtcclxuICAgIGNvbnN0IGdyYXkgPSBNYXRoLnJvdW5kKGxpZ2h0bmVzc1JhdGlvICogMjU1KTtcclxuICAgIFxyXG4gICAgcmV0dXJuIHtcclxuICAgICAgcjogTWF0aC5yb3VuZChncmF5ICsgKGJhc2VSIC0gZ3JheSkgKiB0b3RhbFNhdHVyYXRpb24pLFxyXG4gICAgICBnOiBNYXRoLnJvdW5kKGdyYXkgKyAoYmFzZUcgLSBncmF5KSAqIHRvdGFsU2F0dXJhdGlvbiksXHJcbiAgICAgIGI6IE1hdGgucm91bmQoZ3JheSArIChiYXNlQiAtIGdyYXkpICogdG90YWxTYXR1cmF0aW9uKVxyXG4gICAgfTtcclxuICB9XHJcbn07XHJcbiIsCiAgICAiLyogPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XHJcbiAg8J+OqCDsg4nsg4Eg6rWs7LK0IFVJIOy7qO2KuOuhpOufrFxyXG4gID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PSAqL1xyXG5cclxuZXhwb3J0IGNvbnN0IENvbG9yU3BoZXJlVUkgPSB7XHJcbiAgLy8g7ZmV64yAL+y2leyGjCDsiqzrnbzsnbTrjZQg7ISk7KCVXHJcbiAgc2V0dXBab29tU2xpZGVyKHNwaGVyZVN0YXRlLCBjYW52YXMpIHtcclxuICAgIGNvbnN0IHpvb21TbGlkZXIgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnem9vbS1zbGlkZXInKTtcclxuICAgIGNvbnN0IHpvb21WYWx1ZSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy56b29tLXZhbHVlJyk7XHJcbiAgICBcclxuICAgIGlmICghem9vbVNsaWRlciB8fCAhem9vbVZhbHVlKSByZXR1cm47XHJcbiAgICBcclxuICAgIHpvb21TbGlkZXIuYWRkRXZlbnRMaXN0ZW5lcignaW5wdXQnLCAoZSkgPT4ge1xyXG4gICAgICBzcGhlcmVTdGF0ZS56b29tID0gcGFyc2VGbG9hdChlLnRhcmdldC52YWx1ZSk7XHJcbiAgICAgIC8vIE1lY2hhbmljc+uKlCB3aW5kb3fsl5DshJwg6rCA7KC47Ji0XHJcbiAgICAgIHdpbmRvdy5NZWNoYW5pY3MuUmVuZGVyQ29sb3JTcGhlcmUoY2FudmFzLmdldENvbnRleHQoJzJkJyksIHNwaGVyZVN0YXRlKTtcclxuICAgICAgem9vbVZhbHVlLnRleHRDb250ZW50ID0gYCR7TWF0aC5yb3VuZChzcGhlcmVTdGF0ZS56b29tICogMTAwKX0lYDtcclxuICAgIH0pO1xyXG4gICAgXHJcbiAgICB6b29tU2xpZGVyLnZhbHVlID0gc3BoZXJlU3RhdGUuem9vbTtcclxuICAgIHpvb21WYWx1ZS50ZXh0Q29udGVudCA9IGAke01hdGgucm91bmQoc3BoZXJlU3RhdGUuem9vbSAqIDEwMCl9JWA7XHJcbiAgfSxcclxuXHJcbiAgLy8g7IOJ7IOBIOygleuztCDsl4XrjbDsnbTtirgg7ISk7KCVXHJcbiAgc2V0dXBDb2xvckluZm9VcGRhdGUoc3BoZXJlU3RhdGUsIGNhbnZhcykge1xyXG4gICAgY29uc3QgY29sb3JIZXggPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuY29sb3ItaGV4Jyk7XHJcbiAgICBjb25zdCBjb2xvclJnYiA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5jb2xvci1yZ2InKTtcclxuICAgIGNvbnN0IGNvbG9ySHNsID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLmNvbG9yLWhzbCcpO1xyXG4gICAgXHJcbiAgICBpZiAoIWNvbG9ySGV4IHx8ICFjb2xvclJnYiB8fCAhY29sb3JIc2wpIHJldHVybjtcclxuICAgIFxyXG4gICAgY29uc3QgdXBkYXRlQ29sb3JJbmZvID0gKCkgPT4ge1xyXG4gICAgICBjb25zdCBoZXggPSBgIyR7c3BoZXJlU3RhdGUuc2VsZWN0ZWRDb2xvci5yLnRvU3RyaW5nKDE2KS5wYWRTdGFydCgyLCAnMCcpfSR7c3BoZXJlU3RhdGUuc2VsZWN0ZWRDb2xvci5nLnRvU3RyaW5nKDE2KS5wYWRTdGFydCgyLCAnMCcpfSR7c3BoZXJlU3RhdGUuc2VsZWN0ZWRDb2xvci5iLnRvU3RyaW5nKDE2KS5wYWRTdGFydCgyLCAnMCcpfWAudG9VcHBlckNhc2UoKTtcclxuICAgICAgY29uc3QgcmdiID0gYHJnYigke3NwaGVyZVN0YXRlLnNlbGVjdGVkQ29sb3Iucn0sICR7c3BoZXJlU3RhdGUuc2VsZWN0ZWRDb2xvci5nfSwgJHtzcGhlcmVTdGF0ZS5zZWxlY3RlZENvbG9yLmJ9KWA7XHJcbiAgICAgIGNvbnN0IGhzbFN0cmluZyA9IGBoc2woJHtNYXRoLnJvdW5kKChzcGhlcmVTdGF0ZS5zZWxlY3RlZENvbG9yLnIgKyBzcGhlcmVTdGF0ZS5zZWxlY3RlZENvbG9yLmcgKyBzcGhlcmVTdGF0ZS5zZWxlY3RlZENvbG9yLmIpIC8gMyAqIDM2MCAvIDI1NSl9LCA1MCUsIDUwJSlgO1xyXG4gICAgICBcclxuICAgICAgY29sb3JIZXgudGV4dENvbnRlbnQgPSBoZXg7XHJcbiAgICAgIGNvbG9yUmdiLnRleHRDb250ZW50ID0gcmdiO1xyXG4gICAgICBjb2xvckhzbC50ZXh0Q29udGVudCA9IGhzbFN0cmluZztcclxuICAgIH07XHJcbiAgICBcclxuICAgIHVwZGF0ZUNvbG9ySW5mbygpO1xyXG4gICAgXHJcbiAgICBzZXRJbnRlcnZhbCgoKSA9PiB7XHJcbiAgICAgIGlmIChzcGhlcmVTdGF0ZS5zZWxlY3RlZENvbG9yKSB7XHJcbiAgICAgICAgdXBkYXRlQ29sb3JJbmZvKCk7XHJcbiAgICAgIH1cclxuICAgIH0sIDEwMCk7XHJcbiAgfVxyXG59O1xyXG5cclxuIiwKICAgICIvKiA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cclxuICDwn4yNIOyXre2VmSDsi5zsiqTthZwg66qo65OIXHJcbiAgPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09ICovXHJcblxyXG5pbXBvcnQgeyBUb3BvbG9neSB9IGZyb20gJy4vdG9wb2xvZ3kuanMnO1xyXG5pbXBvcnQgeyBDb2xvclNwaGVyZVVJIH0gZnJvbSAnLi4vdWkvY29sb3Itc3BoZXJlLXVpLmpzJztcclxuXHJcbmV4cG9ydCBjb25zdCBNZWNoYW5pY3MgPSB7XHJcbiAgLy8g7KCE7JetIO2Gte2VqSDsg4nqtazssrQg7IOB7YOcXHJcbiAgVW5pZmllZFNwaGVyZVN0YXRlOiB7XHJcbiAgICBkcmFnZ2luZzogZmFsc2UsXHJcbiAgICB2MDogbnVsbCxcclxuICAgIFE6IFsxLCAwLCAwLCAwXSwgIC8vIOu2geq3ueygkCDspJHsi6wg7KCV66CsXHJcbiAgICBsYXN0OiBbMCwgMF0sXHJcbiAgICB6b29tOiAxLjAsXHJcbiAgICBzZWxlY3RlZENvbG9yOiB7IHI6IDAsIGc6IDAsIGI6IDAgfSwgIC8vIOugjOuNlOungSDsg4nqtazssrTsnZgg7ZGc66m0IOykkeyLrOygkCDsg4nsg4FcclxuICAgIGlzRHJhZ2dpbmc6IGZhbHNlXHJcbiAgfSxcclxuXHJcbiAgLy8g7IOJ6rWs7LK0IOy0iOq4sO2ZlCDtlajsiJhcclxuICBpbml0aWFsaXplQ29sb3JTcGhlcmUoc2VsZWN0b3IgPSAnI2NvbG9yLXNwaGVyZS1jYW52YXMnLCBvblVwZGF0ZSA9IG51bGwpIHtcclxuICAgIGNvbnN0IGNhbnZhcyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3Ioc2VsZWN0b3IpO1xyXG4gICAgaWYgKCFjYW52YXMpIHJldHVybjtcclxuICAgIFxyXG4gICAgY29uc3QgY3R4ID0gY2FudmFzLmdldENvbnRleHQoJzJkJyk7XHJcbiAgICBjdHguY2xlYXJSZWN0KDAsIDAsIGNhbnZhcy53aWR0aCwgY2FudmFzLmhlaWdodCk7XHJcbiAgICB0aGlzLlJlbmRlckNvbG9yU3BoZXJlKGN0eCwgdGhpcy5VbmlmaWVkU3BoZXJlU3RhdGUpO1xyXG4gICAgXHJcbiAgICB0aGlzLnNldHVwQ2FudmFzSW50ZXJhY3Rpb24oY2FudmFzLCB0aGlzLlVuaWZpZWRTcGhlcmVTdGF0ZSwgb25VcGRhdGUpO1xyXG4gICAgQ29sb3JTcGhlcmVVSS5zZXR1cFpvb21TbGlkZXIodGhpcy5VbmlmaWVkU3BoZXJlU3RhdGUsIGNhbnZhcyk7XHJcbiAgICBDb2xvclNwaGVyZVVJLnNldHVwQ29sb3JJbmZvVXBkYXRlKHRoaXMuVW5pZmllZFNwaGVyZVN0YXRlLCBjYW52YXMpO1xyXG4gIH0sXHJcblxyXG4gIC8vIOyngeq1kOyijO2RnCDihpIg6rWs66m07KKM7ZGcIOuzgO2ZmFxyXG4gIGNhcnRlc2lhblRvU3BoZXJpY2FsKHgsIHksIHopIHtcclxuICAgIGNvbnN0IHIgPSBNYXRoLnNxcnQoeCAqIHggKyB5ICogeSArIHogKiB6KTtcclxuICAgIHJldHVybiB7IHIsIHRoZXRhOiBNYXRoLmFjb3MoTWF0aC5tYXgoLTEsIE1hdGgubWluKDEsIHogLyByKSkpLCBwaGk6IE1hdGguYXRhbjIoeSwgeCkgfTtcclxuICB9LFxyXG4gIFxyXG4gIC8vIOq1rOuptOyijO2RnCDihpIg7KeB6rWQ7KKM7ZGcIOuzgO2ZmFxyXG4gIHNwaGVyaWNhbFRvQ2FydGVzaWFuKHIsIHRoZXRhLCBwaGkpIHtcclxuICAgIHJldHVybiB7IHg6IHIgKiBNYXRoLnNpbih0aGV0YSkgKiBNYXRoLmNvcyhwaGkpLCB5OiByICogTWF0aC5zaW4odGhldGEpICogTWF0aC5zaW4ocGhpKSwgejogciAqIE1hdGguY29zKHRoZXRhKSB9O1xyXG4gIH0sXHJcbiAgXHJcbiAgLy8g7ZmU66m07KKM7ZGcIOKGkiDqtazrqbTtkZzrqbQg7KKM7ZGcIOuzgO2ZmFxyXG4gIHNjcmVlblRvU3BoZXJpY2FsU3VyZmFjZShzY3JlZW5YLCBzY3JlZW5ZLCByYWRpdXMpIHtcclxuICAgIGlmIChNYXRoLnNxcnQoc2NyZWVuWCAqIHNjcmVlblggKyBzY3JlZW5ZICogc2NyZWVuWSkgPiByYWRpdXMpIHJldHVybiBudWxsOyAgICBcclxuICAgIGNvbnN0IGNhcnRlc2lhbiA9IHsgeDogc2NyZWVuWC9yYWRpdXMsIHk6IHNjcmVlblkvcmFkaXVzLCB6OiBNYXRoLnNxcnQocmFkaXVzICogcmFkaXVzIC0gc2NyZWVuWCAqIHNjcmVlblggLSBzY3JlZW5ZICogc2NyZWVuWSkvcmFkaXVzIH07XHJcbiAgICByZXR1cm4geyBzY3JlZW46IHsgeDogc2NyZWVuWCwgeTogc2NyZWVuWSB9LCBjYXJ0ZXNpYW4sIHNwaGVyaWNhbDogdGhpcy5jYXJ0ZXNpYW5Ub1NwaGVyaWNhbChjYXJ0ZXNpYW4ueCwgY2FydGVzaWFuLnksIGNhcnRlc2lhbi56KSB9O1xyXG4gIH0sXHJcblxyXG4gIC8vIOuniOyasOyKpCDtgbTrpq0g4oaSIOq1rOuptCDsooztkZxcclxuICBtb3VzZUNsaWNrVG9TcGhlcmljYWxDb29yZGluYXRlcyhzY3JlZW5YLCBzY3JlZW5ZLCBjYW52YXMpIHtcclxuICAgIGNvbnN0IHJlY3QgPSBjYW52YXMuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7XHJcbiAgICByZXR1cm4gdGhpcy5zY3JlZW5Ub1NwaGVyaWNhbFN1cmZhY2Uoc2NyZWVuWCAtIHJlY3Qud2lkdGggLyAyLCBzY3JlZW5ZIC0gcmVjdC5oZWlnaHQgLyAyLCBNYXRoLm1pbihyZWN0LndpZHRoLCByZWN0LmhlaWdodCkgLyAyKTtcclxuICB9LFxyXG5cclxuICAvLyDsg4nsg4Eg4oaSIOq1rOuptCDsooztkZwg67OA7ZmYXHJcbiAgY29sb3JUb0Nvb3JkaW5hdGUoaGV4Q29sb3IpIHtcclxuICAgIGZvciAobGV0IHRoZXRhID0gMDsgdGhldGEgPD0gTWF0aC5QSTsgdGhldGEgKz0gMC4wNSkge1xyXG4gICAgICBmb3IgKGxldCBwaGkgPSAtTWF0aC5QSTsgcGhpIDw9IE1hdGguUEk7IHBoaSArPSAwLjA1KSB7XHJcbiAgICAgICAgY29uc3QgY29sb3IgPSBUb3BvbG9neS5jYWxjdWxhdGVDb2xvcih0aGV0YSwgcGhpKTtcclxuICAgICAgICBpZiAoY2hyb21hLnJnYihjb2xvci5yLCBjb2xvci5nLCBjb2xvci5iKS5oZXgoKSA9PT0gY2hyb21hKGhleENvbG9yKS5oZXgoKSkgcmV0dXJuIHsgdGhldGEsIHBoaSB9O1xyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgfSxcclxuXHJcbiAgLy8g67Kh7YSwIOygleq3nO2ZlFxyXG4gIG5vcm1hbGl6ZSh2KSB7XHJcbiAgICBjb25zdCBsZW5ndGggPSBNYXRoLnNxcnQodi5yZWR1Y2UoKHN1bSwgdmFsKSA9PiBzdW0gKyB2YWwgKiB2YWwsIDApKTtcclxuICAgIGlmIChsZW5ndGggPT09IDApIHRocm93IG5ldyBFcnJvcign7JiB67Kh7YSw64qUIOygleq3nO2ZlO2VoCDsiJgg7JeG7Iq164uI64ukJyk7XHJcbiAgICByZXR1cm4gdi5tYXAodmFsID0+IHZhbCAvIGxlbmd0aCk7XHJcbiAgfSxcclxuICBcclxuICAvLyDstpXqs7wg6rCB64+E66Gc67aA7YSwIOy/vO2EsOuLiOyWuCDsg53shLFcclxuICBmcm9tQXhpc0FuZ2xlKGF4aXMsIGFuZ2xlKSB7XHJcbiAgICBjb25zdCBzID0gTWF0aC5zaW4oYW5nbGUgKiAwLjUpO1xyXG4gICAgcmV0dXJuIFtheGlzWzBdICogcywgYXhpc1sxXSAqIHMsIGF4aXNbMl0gKiBzLCBNYXRoLmNvcyhhbmdsZSAqIDAuNSldO1xyXG4gIH0sXHJcbiAgXHJcbiAgLy8g7L+87YSw64uI7Ja4IOqzseyFiFxyXG4gIG11bHRpcGx5KHExLCBxMikge1xyXG4gICAgcmV0dXJuIFtcclxuICAgICAgcTFbM10gKiBxMlswXSArIHExWzBdICogcTJbM10gKyBxMVsxXSAqIHEyWzJdIC0gcTFbMl0gKiBxMlsxXSxcclxuICAgICAgcTFbM10gKiBxMlsxXSAtIHExWzBdICogcTJbMl0gKyBxMVsxXSAqIHEyWzNdICsgcTFbMl0gKiBxMlswXSxcclxuICAgICAgcTFbM10gKiBxMlsyXSArIHExWzBdICogcTJbMV0gLSBxMVsxXSAqIHEyWzBdICsgcTFbMl0gKiBxMlszXSxcclxuICAgICAgcTFbM10gKiBxMlszXSAtIHExWzBdICogcTJbMF0gLSBxMVsxXSAqIHEyWzFdIC0gcTFbMl0gKiBxMlsyXVxyXG4gICAgXTtcclxuICB9LFxyXG4gIFxyXG4gIC8vIOy/vO2EsOuLiOyWuOycvOuhnCDrsqHthLAg7ZqM7KCEXHJcbiAgcm90YXRlVmVjdG9yKHEsIHYpIHtcclxuICAgIHJldHVybiB0aGlzLm11bHRpcGx5KHRoaXMubXVsdGlwbHkocSwgW3ZbMF0sIHZbMV0sIHZbMl0sIDBdKSwgWy1xWzBdLCAtcVsxXSwgLXFbMl0sIHFbM11dKS5zbGljZSgwLCAzKTtcclxuICB9LFxyXG4gIFxyXG4gIC8vIOq1rOuptCDshKDtmJUg67O06rCEIChTTEVSUClcclxuICBzbGVycChxMSwgcTIsIHQpIHtcclxuICAgIGNvbnN0IGRvdCA9IHExWzBdICogcTJbMF0gKyBxMVsxXSAqIHEyWzFdICsgcTFbMl0gKiBxMlsyXSArIHExWzNdICogcTJbM107XHJcbiAgICBjb25zdCB0aGV0YTAgPSBNYXRoLmFjb3MoTWF0aC5hYnMoZG90KSk7XHJcbiAgICBjb25zdCB0aGV0YSA9IHRoZXRhMCAqIHQ7XHJcbiAgICBjb25zdCBzaW5UaGV0YTAgPSBNYXRoLnNpbih0aGV0YTApO1xyXG4gICAgY29uc3QgczAgPSBNYXRoLmNvcyh0aGV0YSkgLSBkb3QgKiBNYXRoLnNpbih0aGV0YSkgLyBzaW5UaGV0YTA7XHJcbiAgICBjb25zdCBzMSA9IE1hdGguc2luKHRoZXRhKSAvIHNpblRoZXRhMDtcclxuICAgIHJldHVybiBbczAgKiBxMVswXSArIHMxICogcTJbMF0sIHMwICogcTFbMV0gKyBzMSAqIHEyWzFdLCBzMCAqIHExWzJdICsgczEgKiBxMlsyXSwgczAgKiBxMVszXSArIHMxICogcTJbM11dO1xyXG4gIH0sXHJcbiAgXHJcbiAgLy8g65Oc656Y6re4IO2ajOyghCDqs4TsgrBcclxuICBmcm9tRHJhZ1JvdGF0aW9uKGR4LCBkeSwgc2Vuc2l0aXZpdHkgPSAwLjAwNSkge1xyXG4gICAgcmV0dXJuIE1hdGguc3FydChkeCAqIGR4ICsgZHkgKiBkeSkgKiBzZW5zaXRpdml0eSA8IDFlLTYgPyBbMSwgMCwgMCwgMF0gOiB0aGlzLmZyb21BeGlzQW5nbGUodGhpcy5ub3JtYWxpemUoW2R5LCAtZHgsIDBdKSwgTWF0aC5zcXJ0KGR4ICogZHggKyBkeSAqIGR5KSAqIHNlbnNpdGl2aXR5KTtcclxuICB9LFxyXG4gIFxyXG4gIC8vIO2BtOumrSDtmozsoIQg6rOE7IKwXHJcbiAgZnJvbUNsaWNrUm90YXRpb24oc2NyZWVuWCwgc2NyZWVuWSkge1xyXG4gICAgcmV0dXJuIE1hdGguc3FydChzY3JlZW5YICogc2NyZWVuWCArIHNjcmVlblkgKiBzY3JlZW5ZKSAqIE1hdGguUEkgKiAwLjUgPCAxZS02ID8gWzEsIDAsIDAsIDBdIDogdGhpcy5mcm9tQXhpc0FuZ2xlKHRoaXMubm9ybWFsaXplKFtzY3JlZW5ZLCAtc2NyZWVuWCwgMF0pLCBNYXRoLnNxcnQoc2NyZWVuWCAqIHNjcmVlblggKyBzY3JlZW5ZICogc2NyZWVuWSkgKiBNYXRoLlBJICogMC41KTtcclxuICB9LFxyXG4gIFxyXG4gIC8vIDNEIOq1rOyytCDroIzrjZTrp4FcclxuICBSZW5kZXJDb2xvclNwaGVyZShjdHgsIHNwaGVyZVN0YXRlKSB7XHJcbiAgICBjb25zdCB3aWR0aCA9IGN0eC5jYW52YXMud2lkdGg7XHJcbiAgICBjb25zdCBoZWlnaHQgPSBjdHguY2FudmFzLmhlaWdodDtcclxuICAgIGNvbnN0IGNlbnRlclggPSB3aWR0aCAvIDI7XHJcbiAgICBjb25zdCBjZW50ZXJZID0gaGVpZ2h0IC8gMjtcclxuICAgIGNvbnN0IHJhZGl1cyA9IChNYXRoLm1pbih3aWR0aCwgaGVpZ2h0KSAvIDIgLSAyMCkgKiBzcGhlcmVTdGF0ZS56b29tO1xyXG4gICAgXHJcbiAgICBjdHguY2xlYXJSZWN0KDAsIDAsIHdpZHRoLCBoZWlnaHQpO1xyXG4gICAgXHJcbiAgICBjb25zdCBpbWFnZURhdGEgPSBjdHguY3JlYXRlSW1hZ2VEYXRhKHdpZHRoLCBoZWlnaHQpO1xyXG4gICAgY29uc3QgZGF0YSA9IGltYWdlRGF0YS5kYXRhO1xyXG4gICAgXHJcbiAgICBmb3IgKGxldCB5ID0gMDsgeSA8IGhlaWdodDsgeSsrKSB7XHJcbiAgICAgIGZvciAobGV0IHggPSAwOyB4IDwgd2lkdGg7IHgrKykge1xyXG4gICAgICAgIGNvbnN0IGR4ID0geCAtIGNlbnRlclg7XHJcbiAgICAgICAgY29uc3QgZHkgPSB5IC0gY2VudGVyWTtcclxuICAgICAgICBcclxuICAgICAgICBpZiAoZHggKiBkeCArIGR5ICogZHkgPD0gcmFkaXVzICogcmFkaXVzKSB7XHJcbiAgICAgICAgICBjb25zdCBzY3JlZW5YID0gZHggLyByYWRpdXM7XHJcbiAgICAgICAgICBjb25zdCBzY3JlZW5ZID0gZHkgLyByYWRpdXM7XHJcbiAgICAgICAgICBjb25zdCBzY3JlZW5aID0gTWF0aC5zcXJ0KE1hdGgubWF4KDAsIDEgLSBzY3JlZW5YICogc2NyZWVuWCAtIHNjcmVlblkgKiBzY3JlZW5ZKSk7XHJcbiAgICAgICAgICBcclxuICAgICAgICAgIGNvbnN0IHJvdGF0ZWRWZWN0b3IgPSB0aGlzLnJvdGF0ZVZlY3RvcihzcGhlcmVTdGF0ZS5RLCBbc2NyZWVuWCwgc2NyZWVuWSwgc2NyZWVuWl0pO1xyXG4gICAgICAgICAgY29uc3QgY29sb3IgPSBUb3BvbG9neS5jYWxjdWxhdGVDb2xvcihNYXRoLmFjb3MoTWF0aC5tYXgoLTEsIE1hdGgubWluKDEsIHJvdGF0ZWRWZWN0b3JbMl0pKSksIE1hdGguYXRhbjIocm90YXRlZFZlY3RvclsxXSwgcm90YXRlZFZlY3RvclswXSkpO1xyXG4gICAgICAgICAgXHJcbiAgICAgICAgICBjb25zdCBpbmRleCA9ICh5ICogd2lkdGggKyB4KSAqIDQ7XHJcbiAgICAgICAgICBkYXRhW2luZGV4XSA9IGNvbG9yLnI7XHJcbiAgICAgICAgICBkYXRhW2luZGV4ICsgMV0gPSBjb2xvci5nO1xyXG4gICAgICAgICAgZGF0YVtpbmRleCArIDJdID0gY29sb3IuYjtcclxuICAgICAgICAgIGRhdGFbaW5kZXggKyAzXSA9IDI1NTtcclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuICAgIH1cclxuICAgIFxyXG4gICAgY3R4LnB1dEltYWdlRGF0YShpbWFnZURhdGEsIDAsIDApO1xyXG4gICAgXHJcbiAgICBpZiAoc3BoZXJlU3RhdGUuc2VsZWN0ZWRDb2xvcikge1xyXG4gICAgICBjb25zdCB7IHIsIGcsIGIgfSA9IHNwaGVyZVN0YXRlLnNlbGVjdGVkQ29sb3I7XHJcbiAgICAgIGN0eC5maWxsU3R5bGUgPSBgcmdiKCR7cn0sICR7Z30sICR7Yn0pYDtcclxuICAgICAgY3R4LmJlZ2luUGF0aCgpO1xyXG4gICAgICBjdHguYXJjKGNlbnRlclgsIGNlbnRlclksIDQsIDAsIDIgKiBNYXRoLlBJKTtcclxuICAgICAgY3R4LmZpbGwoKTtcclxuICAgICAgXHJcbiAgICAgIGNvbnN0IGJyaWdodG5lc3MgPSAociAqIDAuMjk5ICsgZyAqIDAuNTg3ICsgYiAqIDAuMTE0KTtcclxuICAgICAgY3R4LnN0cm9rZVN0eWxlID0gYnJpZ2h0bmVzcyA+IDEyNyA/ICdyZ2JhKDAsMCwwLDAuOCknIDogJ3JnYmEoMjU1LDI1NSwyNTUsMC44KSc7XHJcbiAgICAgIGN0eC5saW5lV2lkdGggPSAyO1xyXG4gICAgICBjdHguc3Ryb2tlKCk7XHJcbiAgICB9XHJcbiAgfSxcclxuICBcclxuICAvLyAzRCDsupTrsoTsiqQg7IOB7Zi47J6R7JqpIOyEpOyglSAo65Oc656Y6re4LCDtgbTrpq0sIO2coClcclxuICBzZXR1cENhbnZhc0ludGVyYWN0aW9uKGNhbnZhcywgc3BoZXJlU3RhdGUsIG9uVXBkYXRlKSB7XHJcbiAgICBsZXQgZHJhZ1N0YXJ0UG9zID0gbnVsbDtcclxuICAgIGxldCBoYXNEcmFnZ2VkID0gZmFsc2U7XHJcbiAgICBsZXQgY3R4ID0gY2FudmFzLmdldENvbnRleHQoJzJkJyk7XHJcbiAgICBcclxuICAgIGNhbnZhcy5hZGRFdmVudExpc3RlbmVyKCdwb2ludGVyZG93bicsIChlKSA9PiB7XHJcbiAgICAgIGUucHJldmVudERlZmF1bHQoKTtcclxuICAgICAgZS5zdG9wUHJvcGFnYXRpb24oKTtcclxuICAgICAgc3BoZXJlU3RhdGUuZHJhZ2dpbmcgPSB0cnVlO1xyXG4gICAgICBzcGhlcmVTdGF0ZS5sYXN0ID0gW2UuY2xpZW50WCwgZS5jbGllbnRZXTtcclxuICAgICAgc3BoZXJlU3RhdGUuaXNEcmFnZ2luZyA9IHRydWU7XHJcbiAgICAgIGRyYWdTdGFydFBvcyA9IFtlLmNsaWVudFgsIGUuY2xpZW50WV07XHJcbiAgICAgIGhhc0RyYWdnZWQgPSBmYWxzZTtcclxuICAgICAgY2FudmFzLnNldFBvaW50ZXJDYXB0dXJlKGUucG9pbnRlcklkKTtcclxuICAgICAgY2FudmFzLnN0eWxlLmN1cnNvciA9ICdncmFiYmluZyc7XHJcbiAgICB9LCB7IHBhc3NpdmU6IGZhbHNlIH0pO1xyXG4gICAgXHJcbiAgICBjYW52YXMuYWRkRXZlbnRMaXN0ZW5lcigncG9pbnRlcm1vdmUnLCAoZSkgPT4ge1xyXG4gICAgICBpZiAoIXNwaGVyZVN0YXRlLmRyYWdnaW5nKSByZXR1cm47XHJcbiAgICAgIFxyXG4gICAgICBlLnByZXZlbnREZWZhdWx0KCk7XHJcbiAgICAgIGUuc3RvcFByb3BhZ2F0aW9uKCk7XHJcbiAgICAgIGNvbnN0IGR4ID0gZS5jbGllbnRYIC0gc3BoZXJlU3RhdGUubGFzdFswXTtcclxuICAgICAgY29uc3QgZHkgPSBlLmNsaWVudFkgLSBzcGhlcmVTdGF0ZS5sYXN0WzFdO1xyXG4gICAgICBzcGhlcmVTdGF0ZS5sYXN0ID0gW2UuY2xpZW50WCwgZS5jbGllbnRZXTtcclxuICAgICAgXHJcbiAgICAgIGlmICghaGFzRHJhZ2dlZCAmJiBkcmFnU3RhcnRQb3MpIHtcclxuICAgICAgICBpZiAoTWF0aC5oeXBvdChlLmNsaWVudFggLSBkcmFnU3RhcnRQb3NbMF0sIGUuY2xpZW50WSAtIGRyYWdTdGFydFBvc1sxXSkgPiAzKSBoYXNEcmFnZ2VkID0gdHJ1ZTtcclxuICAgICAgfVxyXG4gICAgICBcclxuICAgICAgY29uc3QgZHEgPSB0aGlzLmZyb21EcmFnUm90YXRpb24oZHgsIGR5LCAxIC8gKDAuNDUgKiBNYXRoLm1pbihjYW52YXMuY2xpZW50V2lkdGgsIGNhbnZhcy5jbGllbnRIZWlnaHQpKSk7XHJcbiAgICAgIFxyXG4gICAgICBpZiAoZHFbMF0gIT09IDEpIHtcclxuICAgICAgICBzcGhlcmVTdGF0ZS5RID0gdGhpcy5tdWx0aXBseShzcGhlcmVTdGF0ZS5RLCBkcSk7XHJcbiAgICAgIH1cclxuICAgICAgXHJcbiAgICAgIGlmIChvblVwZGF0ZSkgb25VcGRhdGUoY2FudmFzKTtcclxuICAgICAgXHJcbiAgICAgIHRoaXMuUmVuZGVyQ29sb3JTcGhlcmUoY3R4LCBzcGhlcmVTdGF0ZSk7XHJcbiAgICB9KTtcclxuICAgIFxyXG4gICAgY2FudmFzLmFkZEV2ZW50TGlzdGVuZXIoJ3BvaW50ZXJ1cCcsIChlKSA9PiB7XHJcbiAgICAgIGUucHJldmVudERlZmF1bHQoKTtcclxuICAgICAgZS5zdG9wUHJvcGFnYXRpb24oKTtcclxuICAgICAgc3BoZXJlU3RhdGUuZHJhZ2dpbmcgPSBmYWxzZTtcclxuICAgICAgc3BoZXJlU3RhdGUuaXNEcmFnZ2luZyA9IGZhbHNlO1xyXG4gICAgICBjYW52YXMucmVsZWFzZVBvaW50ZXJDYXB0dXJlKGUucG9pbnRlcklkKTtcclxuICAgICAgY2FudmFzLnN0eWxlLmN1cnNvciA9ICdncmFiJztcclxuICAgICAgXHJcbiAgICAgIHJlcXVlc3RBbmltYXRpb25GcmFtZSgoKSA9PiB7XHJcbiAgICAgICAgdGhpcy5SZW5kZXJDb2xvclNwaGVyZShjdHgsIHNwaGVyZVN0YXRlKTtcclxuICAgICAgfSk7XHJcbiAgICB9KTtcclxuICAgIFxyXG4gICAgY2FudmFzLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKGUpID0+IHtcclxuICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xyXG4gICAgICBlLnN0b3BQcm9wYWdhdGlvbigpO1xyXG4gICAgICBpZiAoIWhhc0RyYWdnZWQpIHtcclxuICAgICAgICBjb25zdCByZWN0ID0gY2FudmFzLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO1xyXG4gICAgICAgIGNvbnN0IHggPSBlLmNsaWVudFggLSByZWN0LmxlZnQ7XHJcbiAgICAgICAgY29uc3QgeSA9IGUuY2xpZW50WSAtIHJlY3QudG9wO1xyXG4gICAgICAgIFxyXG4gICAgICAgIGNvbnN0IGNvb3JkaW5hdGVzID0gdGhpcy5tb3VzZUNsaWNrVG9TcGhlcmljYWxDb29yZGluYXRlcyh4LCB5LCBjYW52YXMpO1xyXG4gICAgICAgIGlmIChjb29yZGluYXRlcykge1xyXG4gICAgICAgICAgY29uc3QgdGFyZ2V0VmVjdG9yID0gW2Nvb3JkaW5hdGVzLmNhcnRlc2lhbi54LCBjb29yZGluYXRlcy5jYXJ0ZXNpYW4ueSwgY29vcmRpbmF0ZXMuY2FydGVzaWFuLnpdO1xyXG4gICAgICAgICAgY29uc3QgY3VycmVudFZlY3RvciA9IFswLCAwLCAxXTtcclxuICAgICAgICAgIFxyXG4gICAgICAgICAgY29uc3QgYXhpcyA9IFtcclxuICAgICAgICAgICAgY3VycmVudFZlY3RvclsxXSAqIHRhcmdldFZlY3RvclsyXSAtIGN1cnJlbnRWZWN0b3JbMl0gKiB0YXJnZXRWZWN0b3JbMV0sXHJcbiAgICAgICAgICAgIGN1cnJlbnRWZWN0b3JbMl0gKiB0YXJnZXRWZWN0b3JbMF0gLSBjdXJyZW50VmVjdG9yWzBdICogdGFyZ2V0VmVjdG9yWzJdLFxyXG4gICAgICAgICAgICBjdXJyZW50VmVjdG9yWzBdICogdGFyZ2V0VmVjdG9yWzFdIC0gY3VycmVudFZlY3RvclsxXSAqIHRhcmdldFZlY3RvclswXVxyXG4gICAgICAgICAgXTtcclxuICAgICAgICAgIFxyXG4gICAgICAgICAgY29uc3QgYW5nbGUgPSBNYXRoLmFjb3MoTWF0aC5tYXgoLTEsIE1hdGgubWluKDEsIGN1cnJlbnRWZWN0b3JbMF0gKiB0YXJnZXRWZWN0b3JbMF0gKyBjdXJyZW50VmVjdG9yWzFdICogdGFyZ2V0VmVjdG9yWzFdICsgY3VycmVudFZlY3RvclsyXSAqIHRhcmdldFZlY3RvclsyXSkpKTtcclxuICAgICAgICAgIFxyXG4gICAgICAgICAgaWYgKGFuZ2xlID4gMC4wMSkge1xyXG4gICAgICAgICAgICB0aGlzLmFuaW1hdGVUb1F1YXRlcm5pb24oc3BoZXJlU3RhdGUsIHRoaXMuZnJvbUF4aXNBbmdsZSh0aGlzLm5vcm1hbGl6ZShheGlzKSwgYW5nbGUpLCBjYW52YXMpO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG4gICAgICBcclxuICAgICAgaGFzRHJhZ2dlZCA9IGZhbHNlO1xyXG4gICAgICBkcmFnU3RhcnRQb3MgPSBudWxsO1xyXG4gICAgfSk7XHJcbiAgICBcclxuICAgIGNhbnZhcy5hZGRFdmVudExpc3RlbmVyKCd3aGVlbCcsIChlKSA9PiB7XHJcbiAgICAgIGUucHJldmVudERlZmF1bHQoKTtcclxuICAgICAgZS5zdG9wUHJvcGFnYXRpb24oKTtcclxuICAgICAgXHJcbiAgICAgIGNvbnN0IHBpY2tlciA9IGNhbnZhcy5jbG9zZXN0KCcuY3VzdG9tLWNvbG9yLXBpY2tlcicpO1xyXG4gICAgICBpZiAoIXBpY2tlcikgcmV0dXJuO1xyXG4gICAgICBcclxuICAgICAgY29uc3QgcGFuZWxIZXhJbnB1dCA9IHBpY2tlci5xdWVyeVNlbGVjdG9yKCcucGFuZWwtaGV4LWlucHV0Jyk7XHJcbiAgICAgIGlmICghcGFuZWxIZXhJbnB1dCkgcmV0dXJuO1xyXG4gICAgICBcclxuICAgICAgY29uc3QgY3VycmVudEhleCA9IHBhbmVsSGV4SW5wdXQudmFsdWUucmVwbGFjZSgnIycsICcnKTtcclxuICAgICAgaWYgKGN1cnJlbnRIZXgubGVuZ3RoID49IDYpIHtcclxuICAgICAgICBsZXQgYWxwaGEgPSBjdXJyZW50SGV4Lmxlbmd0aCA9PT0gOCA/IHBhcnNlSW50KGN1cnJlbnRIZXguc3Vic3RyKDYsIDIpLCAxNikgOiAyNTU7XHJcbiAgICAgICAgXHJcbiAgICAgICAgY29uc3QgYWxwaGFDaGFuZ2UgPSBlLmRlbHRhWSA+IDAgPyAtNCA6IDQ7XHJcbiAgICAgICAgYWxwaGEgPSBNYXRoLm1heCgwLCBNYXRoLm1pbigyNTUsIGFscGhhICsgYWxwaGFDaGFuZ2UpKTtcclxuICAgICAgICBcclxuICAgICAgICBjb25zdCBuZXdIZXggPSBjdXJyZW50SGV4LnN1YnN0cigwLCA2KSArIGFscGhhLnRvU3RyaW5nKDE2KS5wYWRTdGFydCgyLCAnMCcpLnRvVXBwZXJDYXNlKCk7XHJcbiAgICAgICAgcGFuZWxIZXhJbnB1dC52YWx1ZSA9ICcjJyArIG5ld0hleDtcclxuICAgICAgICBcclxuICAgICAgICBwYW5lbEhleElucHV0LmRpc3BhdGNoRXZlbnQobmV3IEV2ZW50KCdpbnB1dCcsIHsgYnViYmxlczogdHJ1ZSB9KSk7XHJcbiAgICAgICAgXHJcbiAgICAgICAgc2V0VGltZW91dCgoKSA9PiB7XHJcbiAgICAgICAgICBpZiAod2luZG93LkJ1dHRvblN5c3RlbSAmJiB3aW5kb3cuQnV0dG9uU3lzdGVtLlN0eWxlTWFuYWdlcikge1xyXG4gICAgICAgICAgICB3aW5kb3cuQnV0dG9uU3lzdGVtLlN0eWxlTWFuYWdlci5zY2hlZHVsZVVwZGF0ZSgpO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH0sIDEwMCk7XHJcbiAgICAgIH1cclxuICAgIH0pO1xyXG4gIH0sXHJcbiAgXHJcbiAgLy8g7YG066atIO2ajOyghCDslaDri4jrqZTsnbTshZggKOu2gOuTnOufrOyatCDsoITtmZgpXHJcbiAgYW5pbWF0ZVRvUXVhdGVybmlvbihzcGhlcmVTdGF0ZSwgdGFyZ2V0USwgY2FudmFzKSB7XHJcbiAgICBjb25zdCBzdGFydFEgPSBbLi4uc3BoZXJlU3RhdGUuUV07XHJcbiAgICBjb25zdCBzdGFydFRpbWUgPSBwZXJmb3JtYW5jZS5ub3coKTtcclxuICAgIGNvbnN0IGN0eCA9IGNhbnZhcy5nZXRDb250ZXh0KCcyZCcpO1xyXG4gICAgXHJcbiAgICBjb25zdCBhbmltYXRlID0gKGN1cnJlbnRUaW1lKSA9PiB7XHJcbiAgICAgIGNvbnN0IHByb2dyZXNzID0gTWF0aC5taW4oKGN1cnJlbnRUaW1lIC0gc3RhcnRUaW1lKSAvIDEwMDAsIDEpO1xyXG4gICAgICBzcGhlcmVTdGF0ZS5RID0gdGhpcy5zbGVycChzdGFydFEsIHRhcmdldFEsIDEgLSBNYXRoLnBvdygxIC0gcHJvZ3Jlc3MsIDMpKTtcclxuICAgICAgdGhpcy5SZW5kZXJDb2xvclNwaGVyZShjdHgsIHNwaGVyZVN0YXRlKTtcclxuICAgICAgaWYgKHByb2dyZXNzIDwgMSkgcmVxdWVzdEFuaW1hdGlvbkZyYW1lKGFuaW1hdGUpO1xyXG4gICAgfTtcclxuICAgIHJlcXVlc3RBbmltYXRpb25GcmFtZShhbmltYXRlKTtcclxuICB9XHJcbn07XHJcbiIsCiAgICAiLyogPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gIPCfjqgg7JWE7J207L2YIOykkeyVmSDqtIDrpqwg7Iuc7Iqk7YWcXG4gIOyekOuPmSDsg53shLHrkKggLSDsp4HsoJEg7IiY7KCV7ZWY7KeAIOuniOyEuOyalCFcbiAg7Iqk7YGs66a97Yq4OiBucG0gcnVuIHVwZGF0ZS1pY29uc1xuICA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0gKi9cblxuLy8g7JWE7J207L2YIOqyveuhnCDsoJXsnZggKOyekOuPmSDsg53shLHrkKgpXG5leHBvcnQgY29uc3QgaWNvblBhdGhzID0ge1xuICBcImFkZFwiOiBcImFkZC5zdmdcIixcbiAgXCJhcnJvdy1sZWZ0XCI6IFwiYXJyb3ctbGVmdC5zdmdcIixcbiAgXCJhcnJvdy1yaWdodFwiOiBcImFycm93LXJpZ2h0LnN2Z1wiLFxuICBcImNhbmNlbFwiOiBcImNhbmNlbC5zdmdcIixcbiAgXCJjb250cmFzdFwiOiBcImNvbnRyYXN0LnN2Z1wiLFxuICBcImRlbGV0ZVwiOiBcImRlbGV0ZS5zdmdcIixcbiAgXCJkb25lXCI6IFwiZG9uZS5zdmdcIixcbiAgXCJleGl0XCI6IFwiZXhpdC5zdmdcIixcbiAgXCJleHRlbnRpb25cIjogXCJleHRlbnRpb24uc3ZnXCIsXG4gIFwiZmF2aWNvblwiOiBcImZhdmljb24uc3ZnXCIsXG4gIFwiaGVscFwiOiBcImhlbHAuc3ZnXCIsXG4gIFwiaG9tZVwiOiBcImhvbWUuc3ZnXCIsXG4gIFwiaW5mb1wiOiBcImluZm8uc3ZnXCIsXG4gIFwibGFyZ2VcIjogXCJsYXJnZS5zdmdcIixcbiAgXCJsb3dwb3NcIjogXCJsb3dwb3Muc3ZnXCIsXG4gIFwibWludXNcIjogXCJtaW51cy5zdmdcIixcbiAgXCJva1wiOiBcIm9rLnN2Z1wiLFxuICBcIm9yZGVyXCI6IFwib3JkZXIuc3ZnXCIsXG4gIFwicGF5XCI6IFwicGF5LnN2Z1wiLFxuICBcInBsYWNlaG9sZGVyXCI6IFwicGxhY2Vob2xkZXIuc3ZnXCIsXG4gIFwicGx1c1wiOiBcInBsdXMuc3ZnXCIsXG4gIFwicHJpbnRcIjogXCJwcmludC5zdmdcIixcbiAgXCJyZXNldFwiOiBcInJlc2V0LnN2Z1wiLFxuICBcInJlc3RhcnRcIjogXCJyZXN0YXJ0LnN2Z1wiLFxuICBcInNvbGRvdXQtbGFyZ2VcIjogXCJzb2xkb3V0LWxhcmdlLnN2Z1wiLFxuICBcInNvbGRvdXQtc21hbGxcIjogXCJzb2xkb3V0LXNtYWxsLnN2Z1wiLFxuICBcInN0ZXBcIjogXCJzdGVwLnN2Z1wiLFxuICBcInRha2VpblwiOiBcInRha2Vpbi5zdmdcIixcbiAgXCJ0YWtlb3V0XCI6IFwidGFrZW91dC5zdmdcIixcbiAgXCJ0aW1lXCI6IFwidGltZS5zdmdcIixcbiAgXCJ0b2dnbGVcIjogXCJ0b2dnbGUuc3ZnXCIsXG4gIFwidm9sdW1lXCI6IFwidm9sdW1lLnN2Z1wiLFxuICBcIndhcm5pbmdcIjogXCJ3YXJuaW5nLnN2Z1wiXG59O1xuXG4vLyDshKDtg53snpAg66e17ZWRICjtirnsiJjtlZwg6rK97Jqw66eMIOygleydmCwg64KY66i47KeA64qUIOq4sOuzuCDshKDtg53snpAg7IKs7JqpKVxuZXhwb3J0IGNvbnN0IGljb25TZWxlY3RvcnMgPSB7XG4gIGRlZmF1bHQ6ICcuY29udGVudC5pY29uOm5vdCgucHJlc3NlZCknLFxuICB0b2dnbGU6ICcuY29udGVudC5pY29uLnByZXNzZWQnLFxuICBjb250cmFzdDogJ1tkYXRhLWljb249XCJjb250cmFzdFwiXScsXG4gIGxhcmdlOiAnW2RhdGEtaWNvbj1cImxhcmdlXCJdJ1xufTtcblxuLy8g6riw67O4IOyEoO2DneyekCDsg53shLEg7ZWo7IiYXG5leHBvcnQgZnVuY3Rpb24gZ2V0U2VsZWN0b3IoaWNvbktleSkge1xuICByZXR1cm4gaWNvblNlbGVjdG9yc1tpY29uS2V5XSB8fCBgW2RhdGEtaWNvbj1cIiR7aWNvbktleX1cIl1gO1xufVxuXG4vLyDsoITssrQg6rK966GcIOyDneyEsSDtlajsiJhcbmV4cG9ydCBmdW5jdGlvbiBnZXRJY29uUGF0aChpY29uS2V5KSB7XG4gIGNvbnN0IGZpbGVuYW1lID0gaWNvblBhdGhzW2ljb25LZXldO1xuICBpZiAoIWZpbGVuYW1lKSB7XG4gICAgY29uc29sZS53YXJuKGDimqDvuI8gSWNvbiBcIiR7aWNvbktleX1cIiBub3QgZm91bmQgaW4gaWNvblBhdGhzLCB1c2luZyBwbGFjZWhvbGRlcmApO1xuICAgIHJldHVybiAnc3JjL2Fzc2V0cy9pY29ucy9wbGFjZWhvbGRlci5zdmcnO1xuICB9XG4gIHJldHVybiBgc3JjL2Fzc2V0cy9pY29ucy8ke2ZpbGVuYW1lfWA7XG59XG5cbi8vIGljb25NYXAg7IOd7ISxIO2VqOyImFxuZXhwb3J0IGZ1bmN0aW9uIGNyZWF0ZUljb25NYXAoKSB7XG4gIGNvbnN0IG1hcCA9IHt9O1xuICBcbiAgZm9yIChjb25zdCBba2V5LCBmaWxlbmFtZV0gb2YgT2JqZWN0LmVudHJpZXMoaWNvblBhdGhzKSkge1xuICAgIC8vIGRlZmF1bHTsmYAgcGxhY2Vob2xkZXLripQg7KSR67O165CY66+A66GcIHBsYWNlaG9sZGVyIOygnOyZuFxuICAgIGlmIChrZXkgPT09ICdwbGFjZWhvbGRlcicgJiYgbWFwWydkZWZhdWx0J10pIGNvbnRpbnVlO1xuICAgIFxuICAgIG1hcFtrZXldID0ge1xuICAgICAgcGF0aDogZ2V0SWNvblBhdGgoa2V5KSxcbiAgICAgIHNlbGVjdG9yOiBnZXRTZWxlY3RvcihrZXkpXG4gICAgfTtcbiAgfVxuICBcbiAgcmV0dXJuIG1hcDtcbn1cblxuLy8g7Y+067CxIOyVhOydtOy9mFxuZXhwb3J0IGNvbnN0IGZhbGxiYWNrSWNvbiA9ICdwbGFjZWhvbGRlcic7XG5cbi8qID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICDwn5OKIOuplO2DgOuNsOydtO2EsFxuICA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0gKi9cbi8vIOy0nSDslYTsnbTsvZgg6rCc7IiYOiAzM1xuLy8g7IOd7ISxIOydvOyLnDogMjAyNS0xMS0xOVQxMTo1MTowMC4yODBaXG5cblxuXG4vLyDslYTsnbTsvZgg66qp66GdOiBhZGQsIGFycm93LWxlZnQsIGFycm93LXJpZ2h0LCBjYW5jZWwsIGNvbnRyYXN0LCBkZWxldGUsIGRvbmUsIGV4aXQsIGV4dGVudGlvbiwgZmF2aWNvbiwgaGVscCwgaG9tZSwgaW5mbywgbGFyZ2UsIGxvd3BvcywgbWludXMsIG9rLCBvcmRlciwgcGF5LCBwbGFjZWhvbGRlciwgcGx1cywgcHJpbnQsIHJlc2V0LCByZXN0YXJ0LCBzb2xkb3V0LWxhcmdlLCBzb2xkb3V0LXNtYWxsLCBzdGVwLCB0YWtlaW4sIHRha2VvdXQsIHRpbWUsIHRvZ2dsZSwgdm9sdW1lLCB3YXJuaW5nXG4iLAogICAgIi8qID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxyXG4gIPCfjqggU1ZHIOuhnOuNlCDrqqjrk4hcclxuICA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0gKi9cclxuXHJcbmltcG9ydCB7IGNyZWF0ZUljb25NYXAsIGdldEljb25QYXRoLCBmYWxsYmFja0ljb24gfSBmcm9tICcuLi8uLi9hc3NldHMvaWNvbnMvaW5kZXguanMnO1xyXG5cclxuZXhwb3J0IGNvbnN0IFNWR0xvYWRlciA9IHtcclxuICBjYWNoZTogbmV3IE1hcCgpLFxyXG4gIFxyXG4gIGdldCBpY29uTWFwKCkge1xyXG4gICAgcmV0dXJuIGNyZWF0ZUljb25NYXAoKTtcclxuICB9LFxyXG4gIFxyXG4gIGNvbnZlcnRUb0N1cnJlbnRDb2xvcihzdmdNYXJrdXApIHtcclxuICAgIHJldHVybiBzdmdNYXJrdXBcclxuICAgICAgLnJlcGxhY2UoL2ZpbGw9XCIoPyFub25lfHRyYW5zcGFyZW50KVteXCJdKlwiL2dpLCAnZmlsbD1cImN1cnJlbnRDb2xvclwiJylcclxuICAgICAgLnJlcGxhY2UoL3N0cm9rZT1cIig/IW5vbmV8dHJhbnNwYXJlbnQpW15cIl0qXCIvZ2ksICdzdHJva2U9XCJjdXJyZW50Q29sb3JcIicpXHJcbiAgICAgIC5yZXBsYWNlKC9maWxsPScoPyFub25lfHRyYW5zcGFyZW50KVteJ10qJy9naSwgXCJmaWxsPSdjdXJyZW50Q29sb3InXCIpXHJcbiAgICAgIC5yZXBsYWNlKC9zdHJva2U9Jyg/IW5vbmV8dHJhbnNwYXJlbnQpW14nXSonL2dpLCBcInN0cm9rZT0nY3VycmVudENvbG9yJ1wiKVxyXG4gICAgICAucmVwbGFjZSgvZmlsbDpcXHMqKD8hbm9uZXx0cmFuc3BhcmVudClbXjt9XFxzXSsvZ2ksICdmaWxsOiBjdXJyZW50Q29sb3InKVxyXG4gICAgICAucmVwbGFjZSgvc3Ryb2tlOlxccyooPyFub25lfHRyYW5zcGFyZW50KVteO31cXHNdKy9naSwgJ3N0cm9rZTogY3VycmVudENvbG9yJyk7XHJcbiAgfSxcclxuICBcclxuICBhc3luYyBwcmVsb2FkQWxsSWNvbnMoKSB7XHJcbiAgICBjb25zdCBsb2FkUHJvbWlzZXMgPSBPYmplY3QuZW50cmllcyh0aGlzLmljb25NYXApLm1hcChhc3luYyAoW2tleSwgY29uZmlnXSkgPT4ge1xyXG4gICAgICB0cnkge1xyXG4gICAgICAgIGNvbnN0IHJlc3BvbnNlID0gYXdhaXQgZmV0Y2goY29uZmlnLnBhdGgpO1xyXG4gICAgICAgIGlmICghcmVzcG9uc2Uub2spIHRocm93IG5ldyBFcnJvcihgU1ZHIG5vdCBmb3VuZDogJHtjb25maWcucGF0aH1gKTtcclxuICAgICAgICBjb25zdCBzdmdNYXJrdXAgPSBhd2FpdCByZXNwb25zZS50ZXh0KCk7XHJcbiAgICAgICAgdGhpcy5jYWNoZS5zZXQoa2V5LCBzdmdNYXJrdXApO1xyXG4gICAgICAgIGNvbnNvbGUubG9nKGDinIUgTG9hZGVkICR7a2V5fSBpY29uYCk7XHJcbiAgICAgIH0gY2F0Y2ggKGVycm9yKSB7XHJcbiAgICAgICAgY29uc29sZS53YXJuKGDimqDvuI8gRmFpbGVkIHRvIGxvYWQgJHtrZXl9IGljb24gZnJvbSAke2NvbmZpZy5wYXRofSwgdXNpbmcgZmFsbGJhY2tgKTtcclxuICAgICAgICB0cnkge1xyXG4gICAgICAgICAgY29uc3QgZmFsbGJhY2tQYXRoID0gZ2V0SWNvblBhdGgoZmFsbGJhY2tJY29uKTtcclxuICAgICAgICAgIGNvbnN0IGZhbGxiYWNrID0gYXdhaXQgZmV0Y2goZmFsbGJhY2tQYXRoKTtcclxuICAgICAgICAgIGlmIChmYWxsYmFjay5vaykge1xyXG4gICAgICAgICAgICB0aGlzLmNhY2hlLnNldChrZXksIGF3YWl0IGZhbGxiYWNrLnRleHQoKSk7XHJcbiAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICB0aGlzLmNhY2hlLnNldChrZXksICcnKTtcclxuICAgICAgICAgIH1cclxuICAgICAgICB9IGNhdGNoIChmYWxsYmFja0Vycm9yKSB7XHJcbiAgICAgICAgICBjb25zb2xlLmVycm9yKGDinYwgRmFsbGJhY2sgYWxzbyBmYWlsZWQgZm9yICR7a2V5fWApO1xyXG4gICAgICAgICAgdGhpcy5jYWNoZS5zZXQoa2V5LCAnJyk7XHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcbiAgICB9KTtcclxuICAgIFxyXG4gICAgYXdhaXQgUHJvbWlzZS5hbGwobG9hZFByb21pc2VzKTtcclxuICB9LFxyXG4gIFxyXG4gIGluamVjdEFsbEljb25zKCkge1xyXG4gICAgT2JqZWN0LmVudHJpZXModGhpcy5pY29uTWFwKS5mb3JFYWNoKChba2V5LCBjb25maWddKSA9PiB7XHJcbiAgICAgIGNvbnN0IHN2Z01hcmt1cCA9IHRoaXMuY2FjaGUuZ2V0KGtleSk7XHJcbiAgICAgIGlmICghc3ZnTWFya3VwKSB7XHJcbiAgICAgICAgY29uc29sZS53YXJuKGDimqDvuI8gTm8gY2FjaGVkIFNWRyBmb3IgJHtrZXl9YCk7XHJcbiAgICAgICAgcmV0dXJuO1xyXG4gICAgICB9XHJcbiAgICAgIFxyXG4gICAgICBjb25zdCBwcm9jZXNzZWRTdmcgPSB0aGlzLmNvbnZlcnRUb0N1cnJlbnRDb2xvcihzdmdNYXJrdXApO1xyXG4gICAgICBcclxuICAgICAgY29uc3QgdGFyZ2V0cyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoY29uZmlnLnNlbGVjdG9yKTtcclxuICAgICAgaWYgKHRhcmdldHMubGVuZ3RoID09PSAwKSB7XHJcbiAgICAgICAgY29uc29sZS5sb2coYOKEue+4jyBObyBlbGVtZW50cyBmb3VuZCBmb3Igc2VsZWN0b3I6ICR7Y29uZmlnLnNlbGVjdG9yfWApO1xyXG4gICAgICB9XHJcbiAgICAgIFxyXG4gICAgICB0YXJnZXRzLmZvckVhY2goZWwgPT4ge1xyXG4gICAgICAgIGVsLmlubmVySFRNTCA9IHByb2Nlc3NlZFN2ZztcclxuICAgICAgfSk7XHJcbiAgICB9KTtcclxuICAgIFxyXG4gICAgY29uc29sZS5sb2coJ+KchSBBbGwgaWNvbnMgaW5qZWN0ZWQgdG8gRE9NIChjb252ZXJ0ZWQgdG8gY3VycmVudENvbG9yKScpO1xyXG4gIH0sXHJcbiAgXHJcbiAgYXN5bmMgbG9hZEFuZEluamVjdCgpIHtcclxuICAgIGF3YWl0IHRoaXMucHJlbG9hZEFsbEljb25zKCk7XHJcbiAgICB0aGlzLmluamVjdEFsbEljb25zKCk7XHJcbiAgfSxcclxuICBcclxuICBnZXRDYWNoZWQoa2V5LCBjb252ZXJ0Q29sb3IgPSB0cnVlKSB7XHJcbiAgICBjb25zdCBzdmcgPSB0aGlzLmNhY2hlLmdldChrZXkpIHx8ICcnO1xyXG4gICAgcmV0dXJuIGNvbnZlcnRDb2xvciA/IHRoaXMuY29udmVydFRvQ3VycmVudENvbG9yKHN2ZykgOiBzdmc7XHJcbiAgfVxyXG59O1xyXG4iLAogICAgIi8qID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxyXG4gIPCfkokgQ1NTIOyduOygne2EsCDrqqjrk4hcclxuICA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0gKi9cclxuXHJcbmV4cG9ydCBjb25zdCBDU1NJbmplY3RvciA9IHtcclxuICBpbmplY3QoaWQsIGNvbnRlbnQsIGRlc2NyaXB0aW9uID0gJycpIHtcclxuICAgIGNvbnN0IGV4aXN0aW5nU3R5bGUgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChpZCk7XHJcbiAgICBpZiAoZXhpc3RpbmdTdHlsZSkgZXhpc3RpbmdTdHlsZS5yZW1vdmUoKTtcclxuICAgIFxyXG4gICAgY29uc3Qgc3R5bGVFbGVtZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnc3R5bGUnKTtcclxuICAgIHN0eWxlRWxlbWVudC5pZCA9IGlkO1xyXG4gICAgc3R5bGVFbGVtZW50LnRleHRDb250ZW50ID0gY29udGVudDtcclxuICAgIGRvY3VtZW50LmhlYWQuYXBwZW5kQ2hpbGQoc3R5bGVFbGVtZW50KTtcclxuICB9XHJcbn07XHJcbiIsCiAgICAiLyogPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XHJcbiAg8J+UmCDrsoTtirwg7Iuc7Iqk7YWcIOyDgeyImFxyXG4gID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PSAqL1xyXG5cclxuZXhwb3J0IGNvbnN0IEJVVFRPTl9DT05TVEFOVFMgPSB7XHJcbiAgQkFTRTogMC4wMzEyNSxcclxuICBnZXQgQkFDS0dST1VORF9CT1JERVJfUkFESVVTKCkgeyByZXR1cm4gdGhpcy5CQVNFOyB9LFxyXG4gIGdldCBCVVRUT05fQk9SREVSX1JBRElVUygpIHsgcmV0dXJuIDIgKiB0aGlzLkJBQ0tHUk9VTkRfQk9SREVSX1JBRElVUzsgfSxcclxuICBnZXQgQkFDS0dST1VORF9PVVRMSU5FX1dJRFRIKCkgeyByZXR1cm4gdGhpcy5CQVNFOyB9LFxyXG4gIGdldCBCVVRUT05fUEFERElORygpIHsgcmV0dXJuIHRoaXMuQkFDS0dST1VORF9PVVRMSU5FX1dJRFRIOyB9LFxyXG4gIGdldCBCVVRUT05fT1VUTElORV9XSURUSCgpIHsgcmV0dXJuIDMgKiB0aGlzLkJBQ0tHUk9VTkRfT1VUTElORV9XSURUSDsgfSxcclxuICBnZXQgQlVUVE9OX09VVExJTkVfT0ZGU0VUKCkgeyByZXR1cm4gLTEgKiB0aGlzLkJBQ0tHUk9VTkRfT1VUTElORV9XSURUSDsgfSxcclxuICBnZXQgU0VMRUNURURfSUNPTl9TSVpFKCkgeyByZXR1cm4gNCAqIHRoaXMuQkFTRTsgfVxyXG59O1xyXG4iLAogICAgIi8qID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxyXG4gIPCfjqgg7YyU66CI7Yq4IOq0gOumrOyekFxyXG4gID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PSAqL1xyXG5cclxuZXhwb3J0IGNvbnN0IFBhbGV0dGVNYW5hZ2VyID0ge1xyXG4gIGdlbmVyYXRlQ1NTKCkge1xyXG4gICAgY29uc3QgYnV0dG9ucyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJy5idXR0b24nKTtcclxuICAgIGNvbnN0IGRpc2NvdmVyZWRQYWxldHRlcyA9IG5ldyBTZXQoKTtcclxuICAgIFxyXG4gICAgYnV0dG9ucy5mb3JFYWNoKGJ1dHRvbiA9PiB7XHJcbiAgICAgIGNvbnN0IGNsYXNzTGlzdCA9IEFycmF5LmZyb20oYnV0dG9uLmNsYXNzTGlzdCk7XHJcbiAgICAgIGNvbnN0IHBhbGV0dGUgPSBjbGFzc0xpc3QuZmluZChjbHMgPT4gIVsnYnV0dG9uJywgJ3ByZXNzZWQnLCAndG9nZ2xlJywgJ2R5bmFtaWMnXS5pbmNsdWRlcyhjbHMpKTtcclxuICAgICAgaWYgKHBhbGV0dGUpIGRpc2NvdmVyZWRQYWxldHRlcy5hZGQocGFsZXR0ZSk7XHJcbiAgICB9KTtcclxuICAgIFxyXG4gICAgbGV0IGxpZ2h0VGhlbWVDU1MgPSAnJywgZGFya1RoZW1lQ1NTID0gJycsIHNlbGVjdG9yc0NTUyA9ICcnO1xyXG4gICAgXHJcbiAgICBkaXNjb3ZlcmVkUGFsZXR0ZXMuZm9yRWFjaChwYWxldHRlID0+IHtcclxuICAgICAgY29uc3QgaXNFeGlzdGluZyA9IFsncHJpbWFyeTEnLCAncHJpbWFyeTInLCAncHJpbWFyeTMnLCAnc2Vjb25kYXJ5MScsICdzZWNvbmRhcnkyJywgJ3NlY29uZGFyeTMnLCAnY3VzdG9tJ10uaW5jbHVkZXMocGFsZXR0ZSk7XHJcbiAgICAgIFxyXG4gICAgICBbXHJcbiAgICAgICAgeyBuYW1lOiAnZGVmYXVsdCcsIHNlbGVjdG9yOiAnJywgZGlzYWJsZWQ6IGZhbHNlIH0sXHJcbiAgICAgICAgeyBuYW1lOiAncHJlc3NlZCcsIHNlbGVjdG9yOiAnLnByZXNzZWQ6bm90KC50b2dnbGUpJywgZGlzYWJsZWQ6IGZhbHNlIH0sXHJcbiAgICAgICAgeyBuYW1lOiAncHJlc3NlZCcsIHNlbGVjdG9yOiAnLnByZXNzZWQudG9nZ2xlJywgZGlzYWJsZWQ6IGZhbHNlIH0sXHJcbiAgICAgICAgeyBuYW1lOiAnZGlzYWJsZWQnLCBzZWxlY3RvcjogJ1thcmlhLWRpc2FibGVkPVwidHJ1ZVwiXScsIGRpc2FibGVkOiB0cnVlIH1cclxuICAgICAgXS5mb3JFYWNoKCh7bmFtZTogc3RhdGUsIHNlbGVjdG9yOiBzdGF0ZVNlbGVjdG9yLCBkaXNhYmxlZH0pID0+IHtcclxuICAgICAgICBjb25zdCBiYXNlU2VsZWN0b3IgPSBwYWxldHRlID09PSAncHJpbWFyeTEnICYmIHN0YXRlID09PSAnZGVmYXVsdCcgJiYgIWRpc2FibGVkID8gYCYke3N0YXRlU2VsZWN0b3J9YCA6IG51bGw7XHJcbiAgICAgICAgY29uc3QgcGFsZXR0ZVNlbGVjdG9yID0gYCYuJHtwYWxldHRlfSR7c3RhdGVTZWxlY3Rvcn1gO1xyXG4gICAgICAgIFxyXG4gICAgICAgIGlmIChiYXNlU2VsZWN0b3IpIHtcclxuICAgICAgICAgIHNlbGVjdG9yc0NTUyArPSBgXHJcbiAgICAke2Jhc2VTZWxlY3Rvcn0ge1xyXG4gICAgICAmIC5iYWNrZ3JvdW5kLmR5bmFtaWMge1xyXG4gICAgICAgIGJhY2tncm91bmQ6IHZhcigtLSR7cGFsZXR0ZX0tYmFja2dyb3VuZC1jb2xvci0ke3N0YXRlfSk7XHJcbiAgICAgICAgb3V0bGluZS1jb2xvcjogdmFyKC0tJHtwYWxldHRlfS1ib3JkZXItY29sb3ItJHtzdGF0ZX0pO1xyXG4gICAgICAgIG91dGxpbmUtc3R5bGU6IHZhcigtLWJvcmRlci1zdHlsZS1kZWZhdWx0KTtcclxuICAgICAgICBcclxuICAgICAgICAmIC5jb250ZW50IHtcclxuICAgICAgICAgIGNvbG9yOiB2YXIoLS0ke3BhbGV0dGV9LWNvbnRlbnQtY29sb3ItJHtzdGF0ZX0pO1xyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG4gICAgfWA7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIFxyXG4gICAgICAgIGNvbnN0IGJhY2tncm91bmRQcm9wZXJ0eSA9IChwYWxldHRlID09PSAncHJpbWFyeTMnIHx8IHBhbGV0dGUgPT09ICdzZWNvbmRhcnkzJykgXHJcbiAgICAgICAgICA/IGB2YXIoLS0ke3BhbGV0dGV9LWJhY2tncm91bmQxLWNvbG9yLSR7c3RhdGV9KWAgXHJcbiAgICAgICAgICA6IGB2YXIoLS0ke3BhbGV0dGV9LWJhY2tncm91bmQtY29sb3ItJHtzdGF0ZX0pYDtcclxuICAgICAgICBcclxuICAgICAgICBzZWxlY3RvcnNDU1MgKz0gYFxyXG4gICAgJHtwYWxldHRlU2VsZWN0b3J9IHtcclxuICAgICAgJiAuYmFja2dyb3VuZC5keW5hbWljIHtcclxuICAgICAgICBiYWNrZ3JvdW5kOiAke2JhY2tncm91bmRQcm9wZXJ0eX07XHJcbiAgICAgICAgb3V0bGluZS1jb2xvcjogdmFyKC0tJHtwYWxldHRlfS1ib3JkZXItY29sb3ItJHtzdGF0ZX0pO1xyXG4gICAgICAgICR7c3RhdGUgPT09ICdkZWZhdWx0JyA/ICdvdXRsaW5lLXN0eWxlOiB2YXIoLS1ib3JkZXItc3R5bGUtZGVmYXVsdCk7JyA6ICcnfVxyXG4gICAgICAgICR7c3RhdGUgPT09ICdwcmVzc2VkJyA/ICdvdXRsaW5lLXN0eWxlOiB2YXIoLS1ib3JkZXItc3R5bGUtcHJlc3NlZCk7IG91dGxpbmUtd2lkdGg6IHZhcigtLWJvcmRlci1zdHlsZS1wcmVzc2VkKTsnIDogJyd9XHJcbiAgICAgICAgJHtzdGF0ZSA9PT0gJ2Rpc2FibGVkJyA/ICdvdXRsaW5lLXN0eWxlOiB2YXIoLS1ib3JkZXItc3R5bGUtZGlzYWJsZWQpOycgOiAnJ31cclxuICAgICAgICBcclxuICAgICAgICAmIC5jb250ZW50IHtcclxuICAgICAgICAgIGNvbG9yOiB2YXIoLS0ke3BhbGV0dGV9LWNvbnRlbnQtY29sb3ItJHtzdGF0ZX0pO1xyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG4gICAgICAke3N0YXRlID09PSAncHJlc3NlZCcgPyAnJi50b2dnbGUgeyAmIC5jb250ZW50Lmljb24ucHJlc3NlZCB7IGRpc3BsYXk6IHZhcigtLWNvbnRlbnQtaWNvbi1kaXNwbGF5LXByZXNzZWQtdG9nZ2xlKTsgfSB9JyA6ICcnfVxyXG4gICAgICAke2Rpc2FibGVkID8gJ2N1cnNvcjogdmFyKC0tYnV0dG9uLWN1cnNvci1kaXNhYmxlZCk7JyA6ICcnfVxyXG4gICAgfWA7XHJcbiAgICAgIH0pO1xyXG4gICAgICBcclxuICAgICAgaWYgKCFpc0V4aXN0aW5nKSB7XHJcbiAgICAgICAgY29uc3QgY3VzdG9tUHJvcGVydGllcyA9IFtcclxuICAgICAgICAgICdjb250ZW50LWNvbG9yLWRlZmF1bHQnLCAnY29udGVudC1jb2xvci1wcmVzc2VkJywgJ2NvbnRlbnQtY29sb3ItZGlzYWJsZWQnLFxyXG4gICAgICAgICAgJ2JhY2tncm91bmQtY29sb3ItZGVmYXVsdCcsICdiYWNrZ3JvdW5kLWNvbG9yLXByZXNzZWQnLCAnYmFja2dyb3VuZC1jb2xvci1kaXNhYmxlZCcsXHJcbiAgICAgICAgICAnYm9yZGVyLWNvbG9yLWRlZmF1bHQnLCAnYm9yZGVyLWNvbG9yLXByZXNzZWQnLCAnYm9yZGVyLWNvbG9yLWRpc2FibGVkJ1xyXG4gICAgICAgIF07XHJcbiAgICAgICAgXHJcbiAgICAgICAgY3VzdG9tUHJvcGVydGllcy5mb3JFYWNoKHByb3BlcnR5ID0+IHtcclxuICAgICAgICAgIGxpZ2h0VGhlbWVDU1MgKz0gYCAgLS0ke3BhbGV0dGV9LSR7cHJvcGVydHl9OiB2YXIoLS1jdXN0b20tJHtwcm9wZXJ0eX0pO1xcbmA7XHJcbiAgICAgICAgICBkYXJrVGhlbWVDU1MgKz0gYCAgLS0ke3BhbGV0dGV9LSR7cHJvcGVydHl9OiB2YXIoLS1jdXN0b20tJHtwcm9wZXJ0eX0pO1xcbmA7XHJcbiAgICAgICAgfSk7XHJcbiAgICAgIH1cclxuICAgIH0pO1xyXG4gICAgXHJcbiAgICBjb25zdCBjc3NDb250ZW50ID0gYFxyXG4vKiBIVE1MIO2BtOuemOyKpCDquLDrsJgg7IiY7KCV7J6QIOyLnOyKpO2FnCAtIENTUyDsg4Hsho0g7Zmc7JqpICovXHJcbiR7bGlnaHRUaGVtZUNTUyA/IGA6cm9vdCB7XFxuJHtsaWdodFRoZW1lQ1NTfX1gIDogJyd9XHJcblxyXG4ke2RhcmtUaGVtZUNTUyA/IGAuZGFyayB7XFxuJHtkYXJrVGhlbWVDU1N9fWAgOiAnJ31cclxuXHJcbkBsYXllciBjb21wb25lbnRzIHtcclxuICAuYnV0dG9uIHske3NlbGVjdG9yc0NTU31cclxuICB9XHJcbn1cclxuYDtcclxuICAgIFxyXG4gICAgd2luZG93LkFwcFV0aWxzLkNTU0luamVjdG9yLmluamVjdCgncGFsZXR0ZS1zeXN0ZW0tc3R5bGVzJywgY3NzQ29udGVudCwgJ+2MlOugiO2KuCDsi5zsiqTthZwnKTtcclxuICAgIHJldHVybiBkaXNjb3ZlcmVkUGFsZXR0ZXM7XHJcbiAgfVxyXG59O1xyXG4iLAogICAgIi8qID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxyXG4gIPCfjqgg67KE7Yq8IOyKpO2DgOydvCDqtIDrpqzsnpBcclxuICA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0gKi9cclxuXHJcbmV4cG9ydCBjb25zdCBTdHlsZU1hbmFnZXIgPSB7XHJcbiAgc2NoZWR1bGVVcGRhdGUoKSB7XHJcbiAgICB0aGlzLndhaXRGb3JSZW5kZXJDb21wbGV0aW9uKCkudGhlbigoKSA9PiB7XHJcbiAgICAgIHRoaXMudXBkYXRlQnV0dG9uTGFiZWxzKCk7XHJcbiAgICB9KTtcclxuICB9LFxyXG4gIFxyXG4gIGFzeW5jIHdhaXRGb3JSZW5kZXJDb21wbGV0aW9uKCkge1xyXG4gICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlKSA9PiB7XHJcbiAgICAgIHJlcXVlc3RBbmltYXRpb25GcmFtZSgoKSA9PiB7XHJcbiAgICAgICAgcmVxdWVzdEFuaW1hdGlvbkZyYW1lKCgpID0+IHtcclxuICAgICAgICAgIHNldFRpbWVvdXQoKCkgPT4ge1xyXG4gICAgICAgICAgICByZXNvbHZlKCk7XHJcbiAgICAgICAgICB9LCAxNik7XHJcbiAgICAgICAgfSk7XHJcbiAgICAgIH0pO1xyXG4gICAgfSk7XHJcbiAgfSxcclxuICBcclxuICBzZXR1cFVwZGF0ZU1hbmFnZXIoKSB7XHJcbiAgICBjb25zdCBvYnNlcnZlciA9IG5ldyBNdXRhdGlvbk9ic2VydmVyKChtdXRhdGlvbnMpID0+IHtcclxuICAgICAgbGV0IG5lZWRzVXBkYXRlID0gZmFsc2U7XHJcbiAgICAgIFxyXG4gICAgICBtdXRhdGlvbnMuZm9yRWFjaChtdXRhdGlvbiA9PiB7XHJcbiAgICAgICAgY29uc3QgdGFyZ2V0ID0gbXV0YXRpb24udGFyZ2V0O1xyXG4gICAgICAgIFxyXG4gICAgICAgIGlmIChtdXRhdGlvbi50eXBlID09PSAnYXR0cmlidXRlcycgJiYgbXV0YXRpb24uYXR0cmlidXRlTmFtZSA9PT0gJ2NsYXNzJykge1xyXG4gICAgICAgICAgaWYgKHRhcmdldC5jbGFzc0xpc3QuY29udGFpbnMoJ2J1dHRvbicpKSB7XHJcbiAgICAgICAgICAgIG5lZWRzVXBkYXRlID0gdHJ1ZTtcclxuICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgXHJcbiAgICAgICAgaWYgKG11dGF0aW9uLnR5cGUgPT09ICdhdHRyaWJ1dGVzJyAmJiBtdXRhdGlvbi5hdHRyaWJ1dGVOYW1lID09PSAnc3R5bGUnKSB7XHJcbiAgICAgICAgICBpZiAodGFyZ2V0ID09PSBkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQpIHtcclxuICAgICAgICAgICAgbmVlZHNVcGRhdGUgPSB0cnVlO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgfSk7XHJcbiAgICAgIFxyXG4gICAgICBpZiAobmVlZHNVcGRhdGUpIHtcclxuICAgICAgICB0aGlzLnNjaGVkdWxlVXBkYXRlKCk7XHJcbiAgICAgIH1cclxuICAgIH0pO1xyXG4gICAgXHJcbiAgICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCcuYnV0dG9uJykuZm9yRWFjaChidXR0b24gPT4ge1xyXG4gICAgICBvYnNlcnZlci5vYnNlcnZlKGJ1dHRvbiwge1xyXG4gICAgICAgIGF0dHJpYnV0ZXM6IHRydWUsXHJcbiAgICAgICAgYXR0cmlidXRlRmlsdGVyOiBbJ2NsYXNzJ11cclxuICAgICAgfSk7XHJcbiAgICB9KTtcclxuICAgIFxyXG4gICAgb2JzZXJ2ZXIub2JzZXJ2ZShkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQsIHtcclxuICAgICAgYXR0cmlidXRlczogdHJ1ZSxcclxuICAgICAgYXR0cmlidXRlRmlsdGVyOiBbJ3N0eWxlJ11cclxuICAgIH0pO1xyXG4gICAgcmV0dXJuIG9ic2VydmVyO1xyXG4gIH0sXHJcbiAgXHJcbiAgY2FsY3VsYXRlQ29udHJhc3RSR0JBKHIxLCBnMSwgYjEsIHIyLCBnMiwgYjIpIHtcclxuICAgIGNvbnN0IGdldEx1bWluYW5jZSA9IChyLCBnLCBiKSA9PiB7XHJcbiAgICAgIGNvbnN0IFtycywgZ3MsIGJzXSA9IFtyLCBnLCBiXS5tYXAoYyA9PiB7XHJcbiAgICAgICAgYyA9IGMgLyAyNTU7XHJcbiAgICAgICAgcmV0dXJuIGMgPD0gMC4wMzkyOCA/IGMgLyAxMi45MiA6IE1hdGgucG93KChjICsgMC4wNTUpIC8gMS4wNTUsIDIuNCk7XHJcbiAgICAgIH0pO1xyXG4gICAgICByZXR1cm4gMC4yMTI2ICogcnMgKyAwLjcxNTIgKiBncyArIDAuMDcyMiAqIGJzO1xyXG4gICAgfTtcclxuICAgIFxyXG4gICAgY29uc3QgbHVtMSA9IGdldEx1bWluYW5jZShyMSwgZzEsIGIxKTtcclxuICAgIGNvbnN0IGx1bTIgPSBnZXRMdW1pbmFuY2UocjIsIGcyLCBiMik7XHJcbiAgICBcclxuICAgIGNvbnN0IGJyaWdodGVzdCA9IE1hdGgubWF4KGx1bTEsIGx1bTIpO1xyXG4gICAgY29uc3QgZGFya2VzdCA9IE1hdGgubWluKGx1bTEsIGx1bTIpO1xyXG4gICAgY29uc3QgY29udHJhc3RSYXRpbyA9IChicmlnaHRlc3QgKyAwLjA1KSAvIChkYXJrZXN0ICsgMC4wNSk7XHJcbiAgICBcclxuICAgIHJldHVybiBjb250cmFzdFJhdGlvO1xyXG4gIH0sXHJcblxyXG4gIGNhbGN1bGF0ZUNvbnRyYXN0KGNvbG9yMSwgY29sb3IyKSB7XHJcbiAgICBjb25zdCBnZXRSR0IgPSAoY29sb3IpID0+IHtcclxuICAgICAgaWYgKCFjb2xvciB8fCBjb2xvciA9PT0gJ3RyYW5zcGFyZW50Jykge1xyXG4gICAgICAgIHRocm93IG5ldyBFcnJvcign7Jyg7Zqo7ZWY7KeAIOyViuydgCDsg4nsg4Eg6rCS7J6F64uI64ukJyk7XHJcbiAgICAgIH1cclxuICAgICAgXHJcbiAgICAgIGNvbnN0IHJnYmFNYXRjaCA9IGNvbG9yLm1hdGNoKC9yZ2JhP1xcKFxccyooXFxkKyg/OlxcLlxcZCspPylcXHMqLFxccyooXFxkKyg/OlxcLlxcZCspPylcXHMqLFxccyooXFxkKyg/OlxcLlxcZCspPykvKTtcclxuICAgICAgaWYgKHJnYmFNYXRjaCkge1xyXG4gICAgICAgIHJldHVybiBbXHJcbiAgICAgICAgICBNYXRoLnJvdW5kKHBhcnNlRmxvYXQocmdiYU1hdGNoWzFdKSksXHJcbiAgICAgICAgICBNYXRoLnJvdW5kKHBhcnNlRmxvYXQocmdiYU1hdGNoWzJdKSksXHJcbiAgICAgICAgICBNYXRoLnJvdW5kKHBhcnNlRmxvYXQocmdiYU1hdGNoWzNdKSlcclxuICAgICAgICBdO1xyXG4gICAgICB9XHJcbiAgICAgIFxyXG4gICAgICBpZiAoY29sb3Iuc3RhcnRzV2l0aCgnIycpKSB7XHJcbiAgICAgICAgY29uc3QgaGV4ID0gY29sb3IucmVwbGFjZSgnIycsICcnKTtcclxuICAgICAgICBpZiAoaGV4Lmxlbmd0aCA+PSA2KSB7XHJcbiAgICAgICAgICByZXR1cm4gW1xyXG4gICAgICAgICAgICBwYXJzZUludChoZXguc3Vic3RyKDAsIDIpLCAxNiksXHJcbiAgICAgICAgICAgIHBhcnNlSW50KGhleC5zdWJzdHIoMiwgMiksIDE2KSxcclxuICAgICAgICAgICAgcGFyc2VJbnQoaGV4LnN1YnN0cig0LCAyKSwgMTYpXHJcbiAgICAgICAgICBdO1xyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG4gICAgICBcclxuICAgICAgdGhyb3cgbmV3IEVycm9yKGDsg4nsg4Eg7YyM7IuxIOyLpO2MqDogJHtjb2xvcn1gKTtcclxuICAgIH07XHJcbiAgICBcclxuICAgIGNvbnN0IFtyMSwgZzEsIGIxXSA9IGdldFJHQihjb2xvcjEpO1xyXG4gICAgY29uc3QgW3IyLCBnMiwgYjJdID0gZ2V0UkdCKGNvbG9yMik7XHJcbiAgICBcclxuICAgIHJldHVybiB0aGlzLmNhbGN1bGF0ZUNvbnRyYXN0UkdCQShyMSwgZzEsIGIxLCByMiwgZzIsIGIyKTtcclxuICB9LFxyXG4gIFxyXG4gIHVwZGF0ZUJ1dHRvbkxhYmVscygpIHtcclxuICAgIGNvbnN0IGFsbEJ1dHRvbnMgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCcuYnV0dG9uJyk7XHJcbiAgICBcclxuICAgIGFsbEJ1dHRvbnMuZm9yRWFjaChidXR0b24gPT4ge1xyXG4gICAgICBjb25zdCBiYWNrZ3JvdW5kID0gYnV0dG9uLnF1ZXJ5U2VsZWN0b3IoJy5iYWNrZ3JvdW5kLmR5bmFtaWMnKTtcclxuICAgICAgY29uc3QgY29udGVudCA9IGJ1dHRvbi5xdWVyeVNlbGVjdG9yKCcuY29udGVudCcpO1xyXG4gICAgICBjb25zdCBsYWJlbCA9IGJ1dHRvbi5xdWVyeVNlbGVjdG9yKCcuY29udGVudC5sYWJlbCcpO1xyXG4gICAgICBcclxuICAgICAgaWYgKGJhY2tncm91bmQgJiYgY29udGVudCAmJiBsYWJlbCkge1xyXG4gICAgICAgIGJhY2tncm91bmQub2Zmc2V0SGVpZ2h0O1xyXG4gICAgICAgIGNvbnRlbnQub2Zmc2V0SGVpZ2h0O1xyXG4gICAgICAgIFxyXG4gICAgICAgIGNvbnN0IGJhY2tncm91bmRTdHlsZSA9IGdldENvbXB1dGVkU3R5bGUoYmFja2dyb3VuZCk7XHJcbiAgICAgICAgY29uc3QgY29udGVudFN0eWxlID0gZ2V0Q29tcHV0ZWRTdHlsZShjb250ZW50KTtcclxuICAgICAgICBjb25zdCBiYWNrZ3JvdW5kQ29sb3IgPSBiYWNrZ3JvdW5kU3R5bGUuYmFja2dyb3VuZENvbG9yO1xyXG4gICAgICAgIGNvbnN0IHRleHRDb2xvciA9IGNvbnRlbnRTdHlsZS5jb2xvcjtcclxuICAgICAgICBcclxuICAgICAgICBjb25zdCBjb250cmFzdCA9IHRoaXMuY2FsY3VsYXRlQ29udHJhc3QodGV4dENvbG9yLCBiYWNrZ3JvdW5kQ29sb3IpO1xyXG4gICAgICAgIGNvbnN0IGNvbnRyYXN0UmF0aW8gPSBjb250cmFzdC50b0ZpeGVkKDIpO1xyXG4gICAgICAgIFxyXG4gICAgICAgIGxldCBsYWJlbFRleHQgPSBsYWJlbC5pbm5lckhUTUwuc3BsaXQoJzxicj4nKVswXTtcclxuICAgICAgICBsYWJlbC5pbm5lckhUTUwgPSBgJHtsYWJlbFRleHR9PGJyPiR7Y29udHJhc3RSYXRpb31gO1xyXG4gICAgICB9XHJcbiAgICB9KTtcclxuICB9LFxyXG4gIFxyXG4gIGFwcGx5RHluYW1pY1N0eWxlcygpIHtcclxuICAgIGNvbnN0IGFsbEJ1dHRvbnMgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCcuYnV0dG9uJyk7XHJcbiAgICBpZiAoYWxsQnV0dG9ucy5sZW5ndGggPT09IDApIHJldHVybjtcclxuICAgIFxyXG4gICAgbGV0IHByb2Nlc3NlZENvdW50ID0gMDtcclxuICAgIFxyXG4gICAgZm9yIChjb25zdCBidXR0b24gb2YgYWxsQnV0dG9ucykge1xyXG4gICAgICBjb25zdCBiYWNrZ3JvdW5kID0gYnV0dG9uLnF1ZXJ5U2VsZWN0b3IoXCIuYmFja2dyb3VuZFwiKTtcclxuICAgICAgaWYgKCFiYWNrZ3JvdW5kKSBjb250aW51ZTtcclxuXHJcbiAgICAgIGNvbnN0IHJlY3QgPSBidXR0b24uZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7XHJcbiAgICAgIGNvbnN0IG1pblNpZGUgPSBNYXRoLm1pbihyZWN0LndpZHRoLCByZWN0LmhlaWdodCk7XHJcblxyXG4gICAgICBjb25zdCBidXR0b25QYWRkaW5nID0gbWluU2lkZSAqIHdpbmRvdy5CdXR0b25TeXN0ZW0uQ09OU1RBTlRTLkJVVFRPTl9QQURESU5HO1xyXG4gICAgICBjb25zdCBidXR0b25Cb3JkZXJSYWRpdXMgPSBtaW5TaWRlICogd2luZG93LkJ1dHRvblN5c3RlbS5DT05TVEFOVFMuQlVUVE9OX0JPUkRFUl9SQURJVVM7XHJcbiAgICAgIGNvbnN0IGJ1dHRvbk91dGxpbmVXaWR0aCA9IG1pblNpZGUgKiB3aW5kb3cuQnV0dG9uU3lzdGVtLkNPTlNUQU5UUy5CVVRUT05fT1VUTElORV9XSURUSDtcclxuICAgICAgY29uc3QgYnV0dG9uT3V0bGluZU9mZnNldCA9IG1pblNpZGUgKiB3aW5kb3cuQnV0dG9uU3lzdGVtLkNPTlNUQU5UUy5CVVRUT05fT1VUTElORV9PRkZTRVQ7XHJcbiAgICAgIGNvbnN0IGJhY2tncm91bmRCb3JkZXJSYWRpdXMgPSBtaW5TaWRlICogd2luZG93LkJ1dHRvblN5c3RlbS5DT05TVEFOVFMuQkFDS0dST1VORF9CT1JERVJfUkFESVVTO1xyXG4gICAgICBjb25zdCBiYWNrZ3JvdW5kT3V0bGluZVdpZHRoID0gbWluU2lkZSAqIHdpbmRvdy5CdXR0b25TeXN0ZW0uQ09OU1RBTlRTLkJBQ0tHUk9VTkRfT1VUTElORV9XSURUSDtcclxuICAgICAgY29uc3QgaWNvblNlbGVjdGVkU2l6ZSA9IG1pblNpZGUgKiB3aW5kb3cuQnV0dG9uU3lzdGVtLkNPTlNUQU5UUy5TRUxFQ1RFRF9JQ09OX1NJWkU7XHJcblxyXG4gICAgICBjb25zdCBjYWNoZWQgPSB3aW5kb3cuQnV0dG9uU3lzdGVtLnN0YXRlLnN0eWxlQ2FjaGUuZ2V0KGJ1dHRvbikgfHwge307XHJcbiAgICAgIGNvbnN0IG5lZWRzVXBkYXRlID0gKFxyXG4gICAgICAgIChjYWNoZWQubWluU2lkZSB8fCAwKSAhPT0gbWluU2lkZSB8fCAoY2FjaGVkLmJ1dHRvblBhZGRpbmcgfHwgMCkgIT09IGJ1dHRvblBhZGRpbmcgfHxcclxuICAgICAgICAoY2FjaGVkLmJ1dHRvbkJvcmRlclJhZGl1cyB8fCAwKSAhPT0gYnV0dG9uQm9yZGVyUmFkaXVzIHx8IChjYWNoZWQuYnV0dG9uT3V0bGluZVdpZHRoIHx8IDApICE9PSBidXR0b25PdXRsaW5lV2lkdGggfHxcclxuICAgICAgICAoY2FjaGVkLmJ1dHRvbk91dGxpbmVPZmZzZXQgfHwgMCkgIT09IGJ1dHRvbk91dGxpbmVPZmZzZXQgfHwgKGNhY2hlZC5iYWNrZ3JvdW5kQm9yZGVyUmFkaXVzIHx8IDApICE9PSBiYWNrZ3JvdW5kQm9yZGVyUmFkaXVzIHx8XHJcbiAgICAgICAgKGNhY2hlZC5iYWNrZ3JvdW5kT3V0bGluZVdpZHRoIHx8IDApICE9PSBiYWNrZ3JvdW5kT3V0bGluZVdpZHRoIHx8IChjYWNoZWQuaWNvblNlbGVjdGVkU2l6ZSB8fCAwKSAhPT0gaWNvblNlbGVjdGVkU2l6ZVxyXG4gICAgICApO1xyXG5cclxuICAgICAgaWYgKCFuZWVkc1VwZGF0ZSkgY29udGludWU7XHJcblxyXG4gICAgICBidXR0b24uc3R5bGUucGFkZGluZyA9IGAke2J1dHRvblBhZGRpbmd9cHhgO1xyXG4gICAgICBidXR0b24uc3R5bGUuYm9yZGVyUmFkaXVzID0gYCR7YnV0dG9uQm9yZGVyUmFkaXVzfXB4YDtcclxuICAgICAgYnV0dG9uLnN0eWxlLm91dGxpbmVXaWR0aCA9IGAke2J1dHRvbk91dGxpbmVXaWR0aH1weGA7XHJcbiAgICAgIGJ1dHRvbi5zdHlsZS5vdXRsaW5lT2Zmc2V0ID0gYCR7YnV0dG9uT3V0bGluZU9mZnNldH1weGA7XHJcblxyXG4gICAgICBiYWNrZ3JvdW5kLnN0eWxlLmJvcmRlclJhZGl1cyA9IGAke2JhY2tncm91bmRCb3JkZXJSYWRpdXN9cHhgO1xyXG4gICAgICBiYWNrZ3JvdW5kLnN0eWxlLm91dGxpbmVXaWR0aCA9IGAke2JhY2tncm91bmRPdXRsaW5lV2lkdGh9cHhgO1xyXG5cclxuICAgICAgY29uc3QgaWNvblByZXNzZWQgPSBidXR0b24ucXVlcnlTZWxlY3RvcignLmNvbnRlbnQuaWNvbi5wcmVzc2VkJyk7XHJcbiAgICAgIGlmIChpY29uUHJlc3NlZCkge1xyXG4gICAgICAgIGljb25QcmVzc2VkLnN0eWxlLndpZHRoID0gYCR7aWNvblNlbGVjdGVkU2l6ZX1weGA7XHJcbiAgICAgICAgaWNvblByZXNzZWQuc3R5bGUuaGVpZ2h0ID0gYCR7aWNvblNlbGVjdGVkU2l6ZX1weGA7XHJcbiAgICAgICAgaWNvblByZXNzZWQuc3R5bGUudG9wID0gYCR7YnV0dG9uUGFkZGluZ31weGA7XHJcbiAgICAgICAgaWNvblByZXNzZWQuc3R5bGUucmlnaHQgPSBgJHtidXR0b25QYWRkaW5nfXB4YDtcclxuICAgICAgfVxyXG5cclxuICAgICAgd2luZG93LkJ1dHRvblN5c3RlbS5zdGF0ZS5zdHlsZUNhY2hlLnNldChidXR0b24sIHtcclxuICAgICAgICBtaW5TaWRlLCBidXR0b25QYWRkaW5nLCBidXR0b25Cb3JkZXJSYWRpdXMsIGJ1dHRvbk91dGxpbmVXaWR0aCwgYnV0dG9uT3V0bGluZU9mZnNldCxcclxuICAgICAgICBiYWNrZ3JvdW5kQm9yZGVyUmFkaXVzLCBiYWNrZ3JvdW5kT3V0bGluZVdpZHRoLCBpY29uU2VsZWN0ZWRTaXplXHJcbiAgICAgIH0pO1xyXG4gICAgICBcclxuICAgICAgcHJvY2Vzc2VkQ291bnQrKztcclxuICAgIH1cclxuICAgIFxyXG4gICAgdGhpcy51cGRhdGVCdXR0b25MYWJlbHMoKTtcclxuICB9LFxyXG4gIFxyXG4gIGFzeW5jIHNldHVwSWNvbkluamVjdGlvbigpIHtcclxuICAgIGF3YWl0IHRoaXMud2FpdEZvclJlbmRlckNvbXBsZXRpb24oKTtcclxuICAgIFxyXG4gICAgY29uc3QgYWxsQnV0dG9ucyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJy5idXR0b24nKTtcclxuICAgIFxyXG4gICAgZm9yIChjb25zdCBidXR0b24gb2YgYWxsQnV0dG9ucykge1xyXG4gICAgICBjb25zdCBiYWNrZ3JvdW5kID0gYnV0dG9uLnF1ZXJ5U2VsZWN0b3IoJy5iYWNrZ3JvdW5kJyk7XHJcbiAgICAgIGlmICghYmFja2dyb3VuZCkgY29udGludWU7XHJcbiAgICAgIFxyXG4gICAgICBjb25zdCBpc1RvZ2dsZUJ1dHRvbiA9IGJ1dHRvbi5jbGFzc0xpc3QuY29udGFpbnMoJ3RvZ2dsZScpO1xyXG4gICAgICBcclxuICAgICAgaWYgKGlzVG9nZ2xlQnV0dG9uKSB7XHJcbiAgICAgICAgbGV0IGljb25QcmVzc2VkU3BhbiA9IGJhY2tncm91bmQucXVlcnlTZWxlY3RvcignLmNvbnRlbnQuaWNvbi5wcmVzc2VkJyk7XHJcbiAgICAgICAgXHJcbiAgICAgICAgaWYgKCFpY29uUHJlc3NlZFNwYW4pIHtcclxuICAgICAgICAgIGljb25QcmVzc2VkU3BhbiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3NwYW4nKTtcclxuICAgICAgICAgIGljb25QcmVzc2VkU3Bhbi5jbGFzc05hbWUgPSAnY29udGVudCBpY29uIHByZXNzZWQnO1xyXG4gICAgICAgICAgXHJcbiAgICAgICAgICBjb25zdCBpY29uRWwgPSBiYWNrZ3JvdW5kLnF1ZXJ5U2VsZWN0b3IoJy5jb250ZW50Lmljb246bm90KC5wcmVzc2VkKScpO1xyXG4gICAgICAgICAgaWYgKGljb25FbCAmJiBpY29uRWwucGFyZW50Tm9kZSkge1xyXG4gICAgICAgICAgICBiYWNrZ3JvdW5kLmluc2VydEJlZm9yZShpY29uUHJlc3NlZFNwYW4sIGljb25FbCk7XHJcbiAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICBiYWNrZ3JvdW5kLmluc2VydEJlZm9yZShpY29uUHJlc3NlZFNwYW4sIGJhY2tncm91bmQuZmlyc3RDaGlsZCk7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgICBcclxuICAgIGZvciAoY29uc3QgYnV0dG9uIG9mIGFsbEJ1dHRvbnMpIHtcclxuICAgICAgY29uc3QgaXNUb2dnbGVCdXR0b24gPSBidXR0b24uY2xhc3NMaXN0LmNvbnRhaW5zKCd0b2dnbGUnKTtcclxuICAgICAgY29uc3QgaXNJbml0aWFsbHlQcmVzc2VkID0gYnV0dG9uLmNsYXNzTGlzdC5jb250YWlucygncHJlc3NlZCcpO1xyXG4gICAgICBcclxuICAgICAgaWYgKGlzVG9nZ2xlQnV0dG9uKSB7XHJcbiAgICAgICAgYnV0dG9uLmRhdGFzZXQuaXNUb2dnbGVCdXR0b24gPSAndHJ1ZSc7XHJcbiAgICAgICAgYnV0dG9uLnNldEF0dHJpYnV0ZSgnYXJpYS1wcmVzc2VkJywgaXNJbml0aWFsbHlQcmVzc2VkID8gJ3RydWUnIDogJ2ZhbHNlJyk7XHJcbiAgICAgIH1cclxuICAgIH1cclxuICB9LFxyXG4gIFxyXG4gIHNjaGVkdWxlQ29udHJhc3RVcGRhdGUoKSB7XHJcbiAgICB0aGlzLnNjaGVkdWxlVXBkYXRlKCk7XHJcbiAgfVxyXG59O1xyXG4iLAogICAgIi8qID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxyXG4gIPCflJgg67KE7Yq8IOyLnOyKpO2FnCAtIO2Gte2VqSDrqqjrk4hcclxuICA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0gKi9cclxuXHJcbmltcG9ydCB7IEJVVFRPTl9DT05TVEFOVFMgfSBmcm9tICcuL2NvbnN0YW50cy5qcyc7XHJcbmltcG9ydCB7IFBhbGV0dGVNYW5hZ2VyIH0gZnJvbSAnLi9wYWxldHRlLW1hbmFnZXIuanMnO1xyXG5pbXBvcnQgeyBTdHlsZU1hbmFnZXIgfSBmcm9tICcuL3N0eWxlLW1hbmFnZXIuanMnO1xyXG5cclxuZXhwb3J0IGNvbnN0IEJ1dHRvblN5c3RlbSA9IHtcclxuICBDT05TVEFOVFM6IEJVVFRPTl9DT05TVEFOVFMsXHJcbiAgXHJcbiAgc3RhdGU6IHtcclxuICAgIHN0eWxlQ2FjaGU6IG5ldyBXZWFrTWFwKClcclxuICB9LFxyXG4gIFxyXG4gIFBhbGV0dGVNYW5hZ2VyLFxyXG4gIFN0eWxlTWFuYWdlcixcclxuICBcclxuICBhc3luYyBpbml0KCkge1xyXG4gICAgY29uc29sZS5sb2coJ/CflJggW0J1dHRvblN5c3RlbV0g7LSI6riw7ZmUIOyLnOyekScpO1xyXG4gICAgY29uc3QgaW5pdFN0YXJ0ID0gcGVyZm9ybWFuY2Uubm93KCk7XHJcbiAgICBcclxuICAgIC8vIDHri6jqs4Q6IFNWRyDroZzrlKkg67CPIERPTSDso7zsnoVcclxuICAgIGNvbnNvbGUubG9nKCcgIOKUnOKUgCAx64uo6rOEOiBTVkcg66Gc65SpIOuwjyBET00g7KO87J6FJyk7XHJcbiAgICBjb25zdCBzdmdTdGFydCA9IHBlcmZvcm1hbmNlLm5vdygpO1xyXG4gICAgYXdhaXQgd2luZG93LkFwcFV0aWxzLlNWR0xvYWRlci5sb2FkQW5kSW5qZWN0KCk7XHJcbiAgICBjb25zb2xlLmxvZyhgICDinIUgU1ZHIOuhnOuUqSDsmYTro4wgKCR7KHBlcmZvcm1hbmNlLm5vdygpIC0gc3ZnU3RhcnQpLnRvRml4ZWQoMil9bXMpYCk7XHJcbiAgICBcclxuICAgIC8vIDLri6jqs4Q6IO2GoOq4gCDrsoTtirwg6rWs7KGwIOykgOu5hFxyXG4gICAgY29uc29sZS5sb2coJyAg4pSc4pSAIDLri6jqs4Q6IO2GoOq4gCDrsoTtirwg6rWs7KGwIOykgOu5hCcpO1xyXG4gICAgYXdhaXQgdGhpcy5TdHlsZU1hbmFnZXIuc2V0dXBJY29uSW5qZWN0aW9uKCk7XHJcbiAgICBjb25zb2xlLmxvZygnICDinIUg7Yag6riAIOuyhO2KvCDspIDruYQg7JmE66OMJyk7XHJcbiAgICBcclxuICAgIC8vIDPri6jqs4Q6IO2MlOugiO2KuCBDU1Mg7IOd7ISxXHJcbiAgICBjb25zb2xlLmxvZygnICDilJzilIAgM+uLqOqzhDog7YyU66CI7Yq4IENTUyDsg53shLEnKTtcclxuICAgIHRoaXMuUGFsZXR0ZU1hbmFnZXIuZ2VuZXJhdGVDU1MoKTtcclxuICAgIGNvbnNvbGUubG9nKCcgIOKchSDtjJTroIjtirggQ1NTIOyDneyEsSDsmYTro4wnKTtcclxuICAgIFxyXG4gICAgLy8gNOuLqOqzhDog64+Z7KCBIOyKpO2DgOydvCDsoIHsmqlcclxuICAgIGNvbnNvbGUubG9nKCcgIOKUnOKUgCA064uo6rOEOiDrj5nsoIEg7Iqk7YOA7J28IOyggeyaqScpO1xyXG4gICAgdGhpcy5TdHlsZU1hbmFnZXIuYXBwbHlEeW5hbWljU3R5bGVzKCk7XHJcbiAgICBjb25zb2xlLmxvZygnICDinIUg64+Z7KCBIOyKpO2DgOydvCDsoIHsmqkg7JmE66OMJyk7XHJcbiAgICBcclxuICAgIC8vIDXri6jqs4Q6IOyekOuPmSDsl4XrjbDsnbTtirgg66ek64uI7KCAIOyEpOyglVxyXG4gICAgY29uc29sZS5sb2coJyAg4pSc4pSAIDXri6jqs4Q6IOyekOuPmSDsl4XrjbDsnbTtirgg66ek64uI7KCAIOyEpOyglScpO1xyXG4gICAgdGhpcy5TdHlsZU1hbmFnZXIuc2V0dXBVcGRhdGVNYW5hZ2VyKCk7XHJcbiAgICBjb25zb2xlLmxvZygnICDinIUg7JeF642w7J207Yq4IOunpOuLiOyggCDshKTsoJUg7JmE66OMJyk7XHJcbiAgICBcclxuICAgIGNvbnN0IGluaXRFbmQgPSBwZXJmb3JtYW5jZS5ub3coKTtcclxuICAgIGNvbnNvbGUubG9nKGDwn46JIFtCdXR0b25TeXN0ZW1dIOy0iOq4sO2ZlCDsmYTro4wgKOy0nSAkeyhpbml0RW5kIC0gaW5pdFN0YXJ0KS50b0ZpeGVkKDIpfW1zKWApO1xyXG4gIH1cclxufTtcclxuIiwKICAgICIvKiA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cclxuICDwn46oIO2FjOuniCDqtIDrpqzsnpBcclxuICA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0gKi9cclxuXHJcbmV4cG9ydCBjb25zdCBUaGVtZU1hbmFnZXIgPSB7XHJcbiAgVEhFTUVTOiB7IExJR0hUOiAnbGlnaHQnLCBEQVJLOiAnZGFyaycgfSxcclxuICBTVE9SQUdFX0tFWTogJ3RoZW1lLW1vZGUnLFxyXG4gIE1BTlVBTF9NT0RFX0tFWTogJ21hbnVhbC10aGVtZS1tb2RlJyxcclxuICBfZG9tQ2FjaGU6IHsgaHRtbDogbnVsbCwgdG9nZ2xlQnV0dG9uOiBudWxsLCB0b2dnbGVMYWJlbDogbnVsbCwgbGl2ZVJlZ2lvbjogbnVsbCB9LFxyXG4gIGN1cnJlbnRUaGVtZTogJ2xpZ2h0JyxcclxuICBpc01hbnVhbE1vZGU6IGZhbHNlLFxyXG4gIFxyXG4gIGluaXQoKSB7XHJcbiAgICBjb25zb2xlLmxvZygn8J+OqCBbVGhlbWVNYW5hZ2VyXSDstIjquLDtmZQg7Iuc7J6RJyk7XHJcbiAgICB0aGlzLl9pbml0RE9NQ2FjaGUoKTtcclxuICAgIHRoaXMubG9hZFNldHRpbmdzKCk7XHJcbiAgICBjb25zb2xlLmxvZygnICDilJzilIAg7ZiE7J6sIO2FjOuniDonLCB0aGlzLmN1cnJlbnRUaGVtZSwgJ3wg7IiY64+ZIOuqqOuTnDonLCB0aGlzLmlzTWFudWFsTW9kZSk7XHJcbiAgICB0aGlzLnNldHVwRXZlbnRMaXN0ZW5lcnMoKTtcclxuICAgIHRoaXMuYXBwbHlDdXJyZW50U3RhdGUoKTtcclxuICAgIHRoaXMuc3luY1RvZ2dsZUJ1dHRvbigpO1xyXG4gICAgY29uc29sZS5sb2coJ+KchSBbVGhlbWVNYW5hZ2VyXSDstIjquLDtmZQg7JmE66OMJyk7XHJcbiAgfSxcclxuICBcclxuICBfaW5pdERPTUNhY2hlKCkge1xyXG4gICAgdGhpcy5fZG9tQ2FjaGUuaHRtbCA9IGRvY3VtZW50LmRvY3VtZW50RWxlbWVudDtcclxuICAgIHRoaXMuX2RvbUNhY2hlLmh0bWwuY2xhc3NMaXN0LnJlbW92ZSgnbm8tanMnKTtcclxuICAgIHRoaXMuX2RvbUNhY2hlLmh0bWwuY2xhc3NMaXN0LmFkZCgnanMnKTtcclxuICAgIHRoaXMuX2RvbUNhY2hlLnRvZ2dsZUJ1dHRvbiA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy50aGVtZS10b2dnbGUnKTtcclxuICAgIGlmICh0aGlzLl9kb21DYWNoZS50b2dnbGVCdXR0b24pIHtcclxuICAgICAgdGhpcy5fZG9tQ2FjaGUudG9nZ2xlTGFiZWwgPSB0aGlzLl9kb21DYWNoZS50b2dnbGVCdXR0b24ucXVlcnlTZWxlY3RvcignLmxhYmVsJyk7XHJcbiAgICB9XHJcbiAgICB0aGlzLl9kb21DYWNoZS5saXZlUmVnaW9uID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3RoZW1lLWFubm91bmNlcicpO1xyXG4gIH0sXHJcbiAgXHJcbiAgbG9hZFNldHRpbmdzKCkge1xyXG4gICAgY29uc3Qgc2F2ZWRUaGVtZSA9IGxvY2FsU3RvcmFnZS5nZXRJdGVtKHRoaXMuU1RPUkFHRV9LRVkpO1xyXG4gICAgY29uc3Qgc2F2ZWRNYW51YWxNb2RlID0gbG9jYWxTdG9yYWdlLmdldEl0ZW0odGhpcy5NQU5VQUxfTU9ERV9LRVkpO1xyXG4gICAgdGhpcy5pc01hbnVhbE1vZGUgPSBzYXZlZE1hbnVhbE1vZGUgPT09ICd0cnVlJztcclxuICAgIGlmICh0aGlzLmlzTWFudWFsTW9kZSkge1xyXG4gICAgICB0aGlzLmN1cnJlbnRUaGVtZSA9IHNhdmVkVGhlbWUgPT09IHRoaXMuVEhFTUVTLkRBUksgPyB0aGlzLlRIRU1FUy5EQVJLIDogdGhpcy5USEVNRVMuTElHSFQ7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICB0aGlzLmN1cnJlbnRUaGVtZSA9IHRoaXMuVEhFTUVTLkxJR0hUO1xyXG4gICAgfVxyXG4gIH0sXHJcbiAgXHJcbiAgYXBwbHlDdXJyZW50U3RhdGUoKSB7XHJcbiAgICBjb25zdCBodG1sID0gdGhpcy5fZG9tQ2FjaGUuaHRtbDtcclxuICAgIGlmICh0aGlzLmN1cnJlbnRUaGVtZSA9PT0gdGhpcy5USEVNRVMuREFSSykge1xyXG4gICAgICBodG1sLmNsYXNzTGlzdC5hZGQoJ2RhcmsnKTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIGh0bWwuY2xhc3NMaXN0LnJlbW92ZSgnZGFyaycpO1xyXG4gICAgfVxyXG4gICAgaWYgKHRoaXMuaXNNYW51YWxNb2RlKSB7XHJcbiAgICAgIGh0bWwuY2xhc3NMaXN0LmFkZCgnbWFudWFsLXRoZW1lLW1vZGUnKTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIGh0bWwuY2xhc3NMaXN0LnJlbW92ZSgnbWFudWFsLXRoZW1lLW1vZGUnKTtcclxuICAgIH1cclxuICB9LFxyXG4gIFxyXG4gIHNhdmVTZXR0aW5ncygpIHtcclxuICAgIGxvY2FsU3RvcmFnZS5zZXRJdGVtKHRoaXMuU1RPUkFHRV9LRVksIHRoaXMuY3VycmVudFRoZW1lKTtcclxuICAgIGxvY2FsU3RvcmFnZS5zZXRJdGVtKHRoaXMuTUFOVUFMX01PREVfS0VZLCB0aGlzLmlzTWFudWFsTW9kZS50b1N0cmluZygpKTtcclxuICB9LFxyXG4gIFxyXG4gIHN5bmNUb2dnbGVCdXR0b24oKSB7XHJcbiAgICBjb25zdCB0b2dnbGVCdXR0b24gPSB0aGlzLl9kb21DYWNoZS50b2dnbGVCdXR0b247XHJcbiAgICBpZiAodG9nZ2xlQnV0dG9uKSB7XHJcbiAgICAgIGNvbnN0IGlzRGFya1RoZW1lID0gdGhpcy5jdXJyZW50VGhlbWUgPT09IHRoaXMuVEhFTUVTLkRBUks7XHJcbiAgICAgIHRvZ2dsZUJ1dHRvbi5zZXRBdHRyaWJ1dGUoJ2FyaWEtcHJlc3NlZCcsIGlzRGFya1RoZW1lLnRvU3RyaW5nKCkpO1xyXG4gICAgICBjb25zdCBsYWJlbCA9IHRoaXMuX2RvbUNhY2hlLnRvZ2dsZUxhYmVsO1xyXG4gICAgICBpZiAobGFiZWwpIHtcclxuICAgICAgICBsYWJlbC5pbm5lckhUTUwgPSBpc0RhcmtUaGVtZSA/ICdMaWdodDxicj7thYzrp4gnIDogJ0Rhcms8YnI+7YWM66eIJztcclxuICAgICAgfVxyXG4gICAgfVxyXG4gIH0sXHJcbiAgXHJcbiAgdG9nZ2xlKCkge1xyXG4gICAgdGhpcy5jdXJyZW50VGhlbWUgPSB0aGlzLmN1cnJlbnRUaGVtZSA9PT0gdGhpcy5USEVNRVMuTElHSFQgPyB0aGlzLlRIRU1FUy5EQVJLIDogdGhpcy5USEVNRVMuTElHSFQ7XHJcbiAgICB0aGlzLmlzTWFudWFsTW9kZSA9IHRydWU7XHJcbiAgICB0aGlzLmFwcGx5Q3VycmVudFN0YXRlKCk7XHJcbiAgICB0aGlzLnNhdmVTZXR0aW5ncygpO1xyXG4gICAgdGhpcy5zeW5jVG9nZ2xlQnV0dG9uKCk7XHJcbiAgICB0aGlzLmFubm91bmNlQ2hhbmdlKCk7XHJcbiAgfSxcclxuICBcclxuICBhbm5vdW5jZUNoYW5nZSgpIHtcclxuICAgIGNvbnN0IHRoZW1lTGFiZWwgPSB0aGlzLmN1cnJlbnRUaGVtZSA9PT0gdGhpcy5USEVNRVMuREFSSyA/ICdEYXJrIO2FjOuniCcgOiAnTGlnaHQg7YWM66eIJztcclxuICAgIGNvbnN0IG1lc3NhZ2UgPSBgJHt0aGVtZUxhYmVsfeuhnCDsoITtmZjrkJjsl4jsirXri4jri6QuYDtcclxuICAgIGxldCBsaXZlUmVnaW9uID0gdGhpcy5fZG9tQ2FjaGUubGl2ZVJlZ2lvbjtcclxuICAgIGlmICghbGl2ZVJlZ2lvbikge1xyXG4gICAgICBsaXZlUmVnaW9uID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XHJcbiAgICAgIGxpdmVSZWdpb24uaWQgPSAndGhlbWUtYW5ub3VuY2VyJztcclxuICAgICAgbGl2ZVJlZ2lvbi5zZXRBdHRyaWJ1dGUoJ2FyaWEtbGl2ZScsICdwb2xpdGUnKTtcclxuICAgICAgbGl2ZVJlZ2lvbi5zZXRBdHRyaWJ1dGUoJ2FyaWEtYXRvbWljJywgJ3RydWUnKTtcclxuICAgICAgbGl2ZVJlZ2lvbi5zdHlsZS5wb3NpdGlvbiA9ICdhYnNvbHV0ZSc7XHJcbiAgICAgIGxpdmVSZWdpb24uc3R5bGUubGVmdCA9ICctMTAwMDBweCc7XHJcbiAgICAgIGxpdmVSZWdpb24uc3R5bGUud2lkdGggPSAnMXB4JztcclxuICAgICAgbGl2ZVJlZ2lvbi5zdHlsZS5oZWlnaHQgPSAnMXB4JztcclxuICAgICAgbGl2ZVJlZ2lvbi5zdHlsZS5vdmVyZmxvdyA9ICdoaWRkZW4nO1xyXG4gICAgICBkb2N1bWVudC5ib2R5LmFwcGVuZENoaWxkKGxpdmVSZWdpb24pO1xyXG4gICAgICB0aGlzLl9kb21DYWNoZS5saXZlUmVnaW9uID0gbGl2ZVJlZ2lvbjtcclxuICAgIH1cclxuICAgIGxpdmVSZWdpb24udGV4dENvbnRlbnQgPSBtZXNzYWdlO1xyXG4gIH0sXHJcbiAgXHJcbiAgc2V0dXBFdmVudExpc3RlbmVycygpIHtcclxuICAgIGNvbnN0IHRvZ2dsZUJ1dHRvbiA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy50aGVtZS10b2dnbGUnKTtcclxuICAgIGlmICh0b2dnbGVCdXR0b24pIHtcclxuICAgICAgdG9nZ2xlQnV0dG9uLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKCkgPT4gdGhpcy50b2dnbGUoKSk7XHJcbiAgICB9XHJcbiAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdrZXlkb3duJywgKGUpID0+IHtcclxuICAgICAgaWYgKGUuY3RybEtleSAmJiBlLmFsdEtleSAmJiBlLmtleS50b0xvd2VyQ2FzZSgpID09PSAnaCcpIHtcclxuICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XHJcbiAgICAgICAgdGhpcy50b2dnbGUoKTtcclxuICAgICAgfVxyXG4gICAgfSk7XHJcbiAgfVxyXG59O1xyXG4iLAogICAgIi8qID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxyXG4gIPCfk48g7YGw6riA7JSoIOuqqOuTnCDqtIDrpqzsnpBcclxuICA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0gKi9cclxuXHJcbmV4cG9ydCBjb25zdCBMYXJnZVRleHRNYW5hZ2VyID0ge1xyXG4gIE1PREVTOiB7IERFRkFVTFQ6ICdkZWZhdWx0JywgTEFSR0U6ICdsYXJnZScgfSxcclxuICBTVE9SQUdFX0tFWTogJ2xhcmdlLW1vZGUnLFxyXG4gIF9kb21DYWNoZTogeyBodG1sOiBudWxsLCB0b2dnbGVCdXR0b246IG51bGwsIHRvZ2dsZUxhYmVsOiBudWxsLCBsaXZlUmVnaW9uOiBudWxsIH0sXHJcbiAgY3VycmVudE1vZGU6ICdkZWZhdWx0JyxcclxuICBcclxuICBpbml0KCkge1xyXG4gICAgY29uc29sZS5sb2coJ/Cfk48gW0xhcmdlVGV4dE1hbmFnZXJdIOy0iOq4sO2ZlCDsi5zsnpEnKTtcclxuICAgIHRoaXMuX2luaXRET01DYWNoZSgpO1xyXG4gICAgdGhpcy5sb2FkU2V0dGluZ3MoKTtcclxuICAgIGNvbnNvbGUubG9nKCcgIOKUnOKUgCDtmITsnqwg66qo65OcOicsIHRoaXMuY3VycmVudE1vZGUpO1xyXG4gICAgdGhpcy5zZXR1cEV2ZW50TGlzdGVuZXJzKCk7XHJcbiAgICB0aGlzLmFwcGx5Q3VycmVudFN0YXRlKCk7XHJcbiAgICB0aGlzLnN5bmNUb2dnbGVCdXR0b24oKTtcclxuICAgIGNvbnNvbGUubG9nKCfinIUgW0xhcmdlVGV4dE1hbmFnZXJdIOy0iOq4sO2ZlCDsmYTro4wnKTtcclxuICB9LFxyXG4gIFxyXG4gIF9pbml0RE9NQ2FjaGUoKSB7XHJcbiAgICB0aGlzLl9kb21DYWNoZS5odG1sID0gZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50O1xyXG4gICAgdGhpcy5fZG9tQ2FjaGUudG9nZ2xlQnV0dG9uID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLmxhcmdlLXRvZ2dsZScpO1xyXG4gICAgaWYgKHRoaXMuX2RvbUNhY2hlLnRvZ2dsZUJ1dHRvbikge1xyXG4gICAgICB0aGlzLl9kb21DYWNoZS50b2dnbGVMYWJlbCA9IHRoaXMuX2RvbUNhY2hlLnRvZ2dsZUJ1dHRvbi5xdWVyeVNlbGVjdG9yKCcubGFiZWwnKTtcclxuICAgIH1cclxuICAgIHRoaXMuX2RvbUNhY2hlLmxpdmVSZWdpb24gPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnbGFyZ2UtYW5ub3VuY2VyJyk7XHJcbiAgfSxcclxuICBcclxuICBsb2FkU2V0dGluZ3MoKSB7XHJcbiAgICBjb25zdCBzYXZlZE1vZGUgPSBsb2NhbFN0b3JhZ2UuZ2V0SXRlbSh0aGlzLlNUT1JBR0VfS0VZKTtcclxuICAgIHRoaXMuY3VycmVudE1vZGUgPSBzYXZlZE1vZGUgPT09IHRoaXMuTU9ERVMuTEFSR0UgPyB0aGlzLk1PREVTLkxBUkdFIDogdGhpcy5NT0RFUy5ERUZBVUxUO1xyXG4gIH0sXHJcbiAgXHJcbiAgYXBwbHlDdXJyZW50U3RhdGUoKSB7XHJcbiAgICBjb25zdCBodG1sID0gdGhpcy5fZG9tQ2FjaGUuaHRtbDtcclxuICAgIGlmICh0aGlzLmN1cnJlbnRNb2RlID09PSB0aGlzLk1PREVTLkxBUkdFKSB7XHJcbiAgICAgIGh0bWwuY2xhc3NMaXN0LmFkZCgnbGFyZ2UnKTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIGh0bWwuY2xhc3NMaXN0LnJlbW92ZSgnbGFyZ2UnKTtcclxuICAgIH1cclxuICB9LFxyXG4gIFxyXG4gIHNhdmVTZXR0aW5ncygpIHtcclxuICAgIGxvY2FsU3RvcmFnZS5zZXRJdGVtKHRoaXMuU1RPUkFHRV9LRVksIHRoaXMuY3VycmVudE1vZGUpO1xyXG4gIH0sXHJcbiAgXHJcbiAgc3luY1RvZ2dsZUJ1dHRvbigpIHtcclxuICAgIGNvbnN0IHRvZ2dsZUJ1dHRvbiA9IHRoaXMuX2RvbUNhY2hlLnRvZ2dsZUJ1dHRvbjtcclxuICAgIGlmICh0b2dnbGVCdXR0b24pIHtcclxuICAgICAgY29uc3QgaXNMYXJnZU1vZGUgPSB0aGlzLmN1cnJlbnRNb2RlID09PSB0aGlzLk1PREVTLkxBUkdFO1xyXG4gICAgICB0b2dnbGVCdXR0b24uc2V0QXR0cmlidXRlKCdhcmlhLXByZXNzZWQnLCBpc0xhcmdlTW9kZS50b1N0cmluZygpKTtcclxuICAgICAgY29uc3QgbGFiZWwgPSB0aGlzLl9kb21DYWNoZS50b2dnbGVMYWJlbDtcclxuICAgICAgaWYgKGxhYmVsKSB7XHJcbiAgICAgICAgbGFiZWwuaW5uZXJIVE1MID0gaXNMYXJnZU1vZGUgPyAn6riw67O4PGJyPuq4gOyUqCcgOiAn7YGw6riA7JSoPGJyPuuqqOuTnCc7XHJcbiAgICAgIH1cclxuICAgIH1cclxuICB9LFxyXG4gIFxyXG4gIHRvZ2dsZSgpIHtcclxuICAgIHRoaXMuY3VycmVudE1vZGUgPSB0aGlzLmN1cnJlbnRNb2RlID09PSB0aGlzLk1PREVTLkRFRkFVTFQgPyB0aGlzLk1PREVTLkxBUkdFIDogdGhpcy5NT0RFUy5ERUZBVUxUO1xyXG4gICAgdGhpcy5hcHBseUN1cnJlbnRTdGF0ZSgpO1xyXG4gICAgdGhpcy5zYXZlU2V0dGluZ3MoKTtcclxuICAgIHRoaXMuc3luY1RvZ2dsZUJ1dHRvbigpO1xyXG4gICAgdGhpcy5hbm5vdW5jZUNoYW5nZSgpO1xyXG4gIH0sXHJcbiAgXHJcbiAgYW5ub3VuY2VDaGFuZ2UoKSB7XHJcbiAgICBjb25zdCBtb2RlTGFiZWwgPSB0aGlzLmN1cnJlbnRNb2RlID09PSB0aGlzLk1PREVTLkxBUkdFID8gJ+2BsOq4gOyUqCDrqqjrk5wnIDogJ+q4sOuzuCDquIDslKgg7YGs6riwJztcclxuICAgIGNvbnN0IG1lc3NhZ2UgPSBgJHttb2RlTGFiZWx966GcIOyghO2ZmOuQmOyXiOyKteuLiOuLpC5gO1xyXG4gICAgbGV0IGxpdmVSZWdpb24gPSB0aGlzLl9kb21DYWNoZS5saXZlUmVnaW9uO1xyXG4gICAgaWYgKCFsaXZlUmVnaW9uKSB7XHJcbiAgICAgIGxpdmVSZWdpb24gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcclxuICAgICAgbGl2ZVJlZ2lvbi5pZCA9ICdsYXJnZS1hbm5vdW5jZXInO1xyXG4gICAgICBsaXZlUmVnaW9uLnNldEF0dHJpYnV0ZSgnYXJpYS1saXZlJywgJ3BvbGl0ZScpO1xyXG4gICAgICBsaXZlUmVnaW9uLnNldEF0dHJpYnV0ZSgnYXJpYS1hdG9taWMnLCAndHJ1ZScpO1xyXG4gICAgICBsaXZlUmVnaW9uLnN0eWxlLnBvc2l0aW9uID0gJ2Fic29sdXRlJztcclxuICAgICAgbGl2ZVJlZ2lvbi5zdHlsZS5sZWZ0ID0gJy0xMDAwMHB4JztcclxuICAgICAgbGl2ZVJlZ2lvbi5zdHlsZS53aWR0aCA9ICcxcHgnO1xyXG4gICAgICBsaXZlUmVnaW9uLnN0eWxlLmhlaWdodCA9ICcxcHgnO1xyXG4gICAgICBsaXZlUmVnaW9uLnN0eWxlLm92ZXJmbG93ID0gJ2hpZGRlbic7XHJcbiAgICAgIGRvY3VtZW50LmJvZHkuYXBwZW5kQ2hpbGQobGl2ZVJlZ2lvbik7XHJcbiAgICAgIHRoaXMuX2RvbUNhY2hlLmxpdmVSZWdpb24gPSBsaXZlUmVnaW9uO1xyXG4gICAgfVxyXG4gICAgbGl2ZVJlZ2lvbi50ZXh0Q29udGVudCA9IG1lc3NhZ2U7XHJcbiAgfSxcclxuICBcclxuICBzZXR1cEV2ZW50TGlzdGVuZXJzKCkge1xyXG4gICAgY29uc3QgdG9nZ2xlQnV0dG9uID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLmxhcmdlLXRvZ2dsZScpO1xyXG4gICAgaWYgKHRvZ2dsZUJ1dHRvbikge1xyXG4gICAgICB0b2dnbGVCdXR0b24uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoKSA9PiB0aGlzLnRvZ2dsZSgpKTtcclxuICAgIH1cclxuICAgIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ2tleWRvd24nLCAoZSkgPT4ge1xyXG4gICAgICBpZiAoZS5jdHJsS2V5ICYmIGUuYWx0S2V5ICYmIGUua2V5LnRvTG93ZXJDYXNlKCkgPT09ICdsJykge1xyXG4gICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcclxuICAgICAgICB0aGlzLnRvZ2dsZSgpO1xyXG4gICAgICB9XHJcbiAgICB9KTtcclxuICB9XHJcbn07XHJcbiIsCiAgICAiLyogPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XHJcbiAg8J+TkCDtgazquLAg7KGw7KCIIOq0gOumrOyekFxyXG4gID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PSAqL1xyXG5cclxuZXhwb3J0IGNvbnN0IFNpemVDb250cm9sTWFuYWdlciA9IHtcclxuICBERUZBVUxUX1dJRFRIOiAyNTYsXHJcbiAgREVGQVVMVF9IRUlHSFQ6IDI1NixcclxuICBfZG9tQ2FjaGU6IHsgd2lkdGhTbGlkZXI6IG51bGwsIGhlaWdodFNsaWRlcjogbnVsbCwgd2lkdGhWYWx1ZTogbnVsbCwgaGVpZ2h0VmFsdWU6IG51bGwsIHJlc2V0QnV0dG9uOiBudWxsLCBhbGxCdXR0b25zOiBudWxsIH0sXHJcbiAgY3VycmVudFdpZHRoOiAyNTYsXHJcbiAgY3VycmVudEhlaWdodDogMjU2LFxyXG4gIFxyXG4gIGluaXQoKSB7XHJcbiAgICBjb25zb2xlLmxvZygn8J+TkCBbU2l6ZUNvbnRyb2xNYW5hZ2VyXSDstIjquLDtmZQg7Iuc7J6RJyk7XHJcbiAgICB0aGlzLl9pbml0RE9NQ2FjaGUoKTtcclxuICAgIHRoaXMuc2V0dXBFdmVudExpc3RlbmVycygpO1xyXG4gICAgdGhpcy51cGRhdGVEaXNwbGF5KCk7XHJcbiAgICBjb25zb2xlLmxvZygnICDilJzilIAg6riw67O4IO2BrOq4sDonLCBgJHt0aGlzLmN1cnJlbnRXaWR0aH14JHt0aGlzLmN1cnJlbnRIZWlnaHR9cHhgKTtcclxuICAgIGNvbnNvbGUubG9nKCfinIUgW1NpemVDb250cm9sTWFuYWdlcl0g7LSI6riw7ZmUIOyZhOujjCcpO1xyXG4gIH0sXHJcbiAgXHJcbiAgX2luaXRET01DYWNoZSgpIHtcclxuICAgIHRoaXMuX2RvbUNhY2hlLndpZHRoU2xpZGVyID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLmJ1dHRvbi13aWR0aCcpO1xyXG4gICAgdGhpcy5fZG9tQ2FjaGUuaGVpZ2h0U2xpZGVyID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLmJ1dHRvbi1oZWlnaHQnKTtcclxuICAgIHRoaXMuX2RvbUNhY2hlLndpZHRoVmFsdWUgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcud2lkdGgtdmFsdWUnKTtcclxuICAgIHRoaXMuX2RvbUNhY2hlLmhlaWdodFZhbHVlID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLmhlaWdodC12YWx1ZScpO1xyXG4gICAgdGhpcy5fZG9tQ2FjaGUucmVzZXRCdXR0b24gPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuc2NhbGluZy5yZXNldCcpO1xyXG4gICAgdGhpcy5fZG9tQ2FjaGUuYWxsQnV0dG9ucyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJy5idXR0b24nKTtcclxuICB9LFxyXG4gIFxyXG4gIHNldHVwRXZlbnRMaXN0ZW5lcnMoKSB7XHJcbiAgICBpZiAodGhpcy5fZG9tQ2FjaGUud2lkdGhTbGlkZXIpIHtcclxuICAgICAgdGhpcy5fZG9tQ2FjaGUud2lkdGhTbGlkZXIuYWRkRXZlbnRMaXN0ZW5lcignaW5wdXQnLCAoZSkgPT4ge1xyXG4gICAgICAgIHRoaXMuY3VycmVudFdpZHRoID0gcGFyc2VJbnQoZS50YXJnZXQudmFsdWUpO1xyXG4gICAgICAgIHRoaXMudXBkYXRlQnV0dG9uU2l6ZXMoKTtcclxuICAgICAgICB0aGlzLnVwZGF0ZURpc3BsYXkoKTtcclxuICAgICAgfSk7XHJcbiAgICB9XHJcbiAgICBpZiAodGhpcy5fZG9tQ2FjaGUuaGVpZ2h0U2xpZGVyKSB7XHJcbiAgICAgIHRoaXMuX2RvbUNhY2hlLmhlaWdodFNsaWRlci5hZGRFdmVudExpc3RlbmVyKCdpbnB1dCcsIChlKSA9PiB7XHJcbiAgICAgICAgdGhpcy5jdXJyZW50SGVpZ2h0ID0gcGFyc2VJbnQoZS50YXJnZXQudmFsdWUpO1xyXG4gICAgICAgIHRoaXMudXBkYXRlQnV0dG9uU2l6ZXMoKTtcclxuICAgICAgICB0aGlzLnVwZGF0ZURpc3BsYXkoKTtcclxuICAgICAgfSk7XHJcbiAgICB9XHJcbiAgICBpZiAodGhpcy5fZG9tQ2FjaGUucmVzZXRCdXR0b24pIHtcclxuICAgICAgdGhpcy5fZG9tQ2FjaGUucmVzZXRCdXR0b24uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoKSA9PiB7XHJcbiAgICAgICAgdGhpcy5yZXNldFRvRGVmYXVsdCgpO1xyXG4gICAgICB9KTtcclxuICAgIH1cclxuICB9LFxyXG4gIFxyXG4gIHVwZGF0ZUJ1dHRvblNpemVzKCkge1xyXG4gICAgdGhpcy5fZG9tQ2FjaGUuYWxsQnV0dG9ucy5mb3JFYWNoKGJ1dHRvbiA9PiB7XHJcbiAgICAgIGJ1dHRvbi5zdHlsZS53aWR0aCA9IGAke3RoaXMuY3VycmVudFdpZHRofXB4YDtcclxuICAgICAgYnV0dG9uLnN0eWxlLmhlaWdodCA9IGAke3RoaXMuY3VycmVudEhlaWdodH1weGA7XHJcbiAgICB9KTtcclxuICAgIGlmICh0eXBlb2YgQnV0dG9uU3lzdGVtICE9PSAndW5kZWZpbmVkJyAmJiBCdXR0b25TeXN0ZW0uU3R5bGVNYW5hZ2VyKSB7XHJcbiAgICAgIHJlcXVlc3RBbmltYXRpb25GcmFtZSgoKSA9PiB7XHJcbiAgICAgICAgQnV0dG9uU3lzdGVtLlN0eWxlTWFuYWdlci5hcHBseUR5bmFtaWNTdHlsZXMoKTtcclxuICAgICAgfSk7XHJcbiAgICB9XHJcbiAgfSxcclxuICBcclxuICB1cGRhdGVEaXNwbGF5KCkge1xyXG4gICAgaWYgKHRoaXMuX2RvbUNhY2hlLndpZHRoVmFsdWUpIHtcclxuICAgICAgdGhpcy5fZG9tQ2FjaGUud2lkdGhWYWx1ZS50ZXh0Q29udGVudCA9IGAke3RoaXMuY3VycmVudFdpZHRofXB4YDtcclxuICAgIH1cclxuICAgIGlmICh0aGlzLl9kb21DYWNoZS5oZWlnaHRWYWx1ZSkge1xyXG4gICAgICB0aGlzLl9kb21DYWNoZS5oZWlnaHRWYWx1ZS50ZXh0Q29udGVudCA9IGAke3RoaXMuY3VycmVudEhlaWdodH1weGA7XHJcbiAgICB9XHJcbiAgfSxcclxuICBcclxuICByZXNldFRvRGVmYXVsdCgpIHtcclxuICAgIHRoaXMuY3VycmVudFdpZHRoID0gdGhpcy5ERUZBVUxUX1dJRFRIO1xyXG4gICAgdGhpcy5jdXJyZW50SGVpZ2h0ID0gdGhpcy5ERUZBVUxUX0hFSUdIVDtcclxuICAgIGlmICh0aGlzLl9kb21DYWNoZS53aWR0aFNsaWRlcikge1xyXG4gICAgICB0aGlzLl9kb21DYWNoZS53aWR0aFNsaWRlci52YWx1ZSA9IHRoaXMuY3VycmVudFdpZHRoO1xyXG4gICAgfVxyXG4gICAgaWYgKHRoaXMuX2RvbUNhY2hlLmhlaWdodFNsaWRlcikge1xyXG4gICAgICB0aGlzLl9kb21DYWNoZS5oZWlnaHRTbGlkZXIudmFsdWUgPSB0aGlzLmN1cnJlbnRIZWlnaHQ7XHJcbiAgICB9XHJcbiAgICB0aGlzLnVwZGF0ZUJ1dHRvblNpemVzKCk7XHJcbiAgICB0aGlzLnVwZGF0ZURpc3BsYXkoKTtcclxuICB9XHJcbn07XHJcbiIsCiAgICAiLyogPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XHJcbiAgP+ugkyDogIzjhbzrkqo/woAgP+u2vuyghT8/5oS/woDnlLHRiuyYhFxyXG4gID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PSAqL1xyXG5cclxuZXhwb3J0IFxyXG4gIGNvbnN0IEN1c3RvbVBhbGV0dGVNYW5hZ2VyID0ge1xyXG4gICAgQ1VTVE9NX1BBTEVUVEVfTkFNRTogJ2N1c3RvbScsXHJcbiAgICBfZG9tQ2FjaGU6IHsgbGlnaHRJbnB1dHM6IHt9LCBkYXJrSW5wdXRzOiB7fSwgcmVzZXRCdG46IG51bGwsIHRlc3RCdXR0b25zOiBudWxsIH0sXHJcbiAgICBjdXJyZW50UGFsZXR0ZTogeyBuYW1lOiAnY3VzdG9tJyB9LFxyXG4gICAgXHJcbi8qID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxyXG4gIPCfjIggM0Qg7IOJ7IOBIOyEoO2Dneq4sCDrqqjrk4hcclxuICA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0gKi9cclxuXHJcbiAgICAgIEN1c3RvbUNvbG9yUGlja2VyOiB7XHJcbiAgICAgIC8vIO2Gte2VqSDsg4nqtazssrQg7IOB7YOcIOyCrOyaqSAo67OE64+EIOyDge2DnCDsoJzqsbApXHJcbiAgICAgIGdldCBzcGhlcmVTdGF0ZSgpIHtcclxuICAgICAgICByZXR1cm4gTWVjaGFuaWNzLlVuaWZpZWRTcGhlcmVTdGF0ZTtcclxuICAgICAgfSxcclxuICAgICAgXHJcbiAgICAgIC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cclxuICAgICAgLy8g8J+agCDstIjquLDtmZQg7Iuc7Iqk7YWcXHJcbiAgICAgIC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cclxuICAgICAgXHJcbiAgICAgIGluaXQoKSB7XHJcbiAgICAgICAgY29uc29sZS5sb2coJyAg4pSc4pSAIFtDdXN0b21Db2xvclBpY2tlcl0g7LSI6riw7ZmUIOyLnOyekScpO1xyXG4gICAgICAgIHRoaXMuZ2VuZXJhdGVMaWdodFRoZW1lUGlja2VycygpO1xyXG4gICAgICAgIGNvbnNvbGUubG9nKCcgICAg4pyFIExpZ2h0IO2FjOuniCDtlLzsu6Qg7IOd7ISxJyk7XHJcbiAgICAgICAgdGhpcy5nZW5lcmF0ZURhcmtUaGVtZVBpY2tlcnMoKTtcclxuICAgICAgICBjb25zb2xlLmxvZygnICAgIOKchSBEYXJrIO2FjOuniCDtlLzsu6Qg7IOd7ISxJyk7XHJcbiAgICAgICAgdGhpcy5zZXR1cENvbG9yRGlzcGxheXMoKTtcclxuICAgICAgICBjb25zb2xlLmxvZygnICAgIOKchSDsu6zrn6wg65SU7Iqk7ZSM66CI7J20IOyEpOyglScpO1xyXG4gICAgICAgIHRoaXMuc2V0dXAzRENhbnZhc0ludGVyYWN0aW9uKCk7XHJcbiAgICAgICAgY29uc29sZS5sb2coJyAgICDinIUgM0Qg7LqU67KE7IqkIOyduO2EsOuemeyFmCDshKTsoJUnKTtcclxuICAgICAgICB0aGlzLnNldHVwSGV4SW5wdXRzKCk7XHJcbiAgICAgICAgY29uc29sZS5sb2coJyAgICDinIUgSGV4IOyeheugpSDshKTsoJUnKTtcclxuICAgICAgfSxcclxuICAgICAgXHJcbiAgICAgIC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cclxuICAgICAgLy8g8J+OqCBVSSDsg53shLEg7Iuc7Iqk7YWcXHJcbiAgICAgIC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cclxuICAgICAgXHJcbiAgICAgIGdlbmVyYXRlTGlnaHRUaGVtZVBpY2tlcnMoKSB7XHJcbiAgICAgICAgY29uc3QgbGlnaHRDb250YWluZXIgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnbGlnaHQtY29sb3ItcGlja2VycycpO1xyXG4gICAgICAgIGlmICghbGlnaHRDb250YWluZXIpIHtcclxuICAgICAgICAgIGNvbnNvbGUud2Fybign4pqg77iPIFtDdXN0b21Db2xvclBpY2tlcl0gbGlnaHQtY29sb3ItcGlja2VycyDsmpTshozrpbwg7LC+7J2EIOyImCDsl4bsnYwnKTtcclxuICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcbiAgICAgICAgY29uc29sZS5sb2coJyAgICDilJzilIAgbGlnaHQtY29sb3ItcGlja2VycyDssL7snYw6JywgbGlnaHRDb250YWluZXIpO1xyXG4gICAgICAgIFxyXG4gICAgICAgIGNvbnN0IGxpZ2h0UGlja2VycyA9IFtcclxuICAgICAgICAgIHsgaWQ6ICdsaWdodC1jb250ZW50LWRlZmF1bHQnLCBsYWJlbDogJ+y9mO2FkOy4oCjquLDrs7gpJywgY29sb3I6ICdyZ2JhKDI1NSwgMjU1LCAyNTUsIDEpJywgaGV4OiAnI0ZGRkZGRkZGJywgaHVlOiAwLCBhbHBoYTogMjU1IH0sXHJcbiAgICAgICAgICB7IGlkOiAnbGlnaHQtY29udGVudC1wcmVzc2VkJywgbGFiZWw6ICfsvZjthZDsuKAo64iM66a8KScsIGNvbG9yOiAncmdiYSgxNDAsIDgzLCA0NCwgMSknLCBoZXg6ICcjOEM1MzJDRkYnLCBodWU6IDI1LCBhbHBoYTogMjU1IH0sXHJcbiAgICAgICAgICB7IGlkOiAnbGlnaHQtY29udGVudC1kaXNhYmxlZCcsIGxhYmVsOiAn7L2Y7YWQ7LigKOu5hO2ZnOyEsSknLCBjb2xvcjogJ3JnYmEoMTQwLCA4MywgNDQsIDEpJywgaGV4OiAnIzhDNTMyQ0ZGJywgaHVlOiAyNSwgYWxwaGE6IDI1NSB9LFxyXG4gICAgICAgICAgeyBpZDogJ2xpZ2h0LWJhY2tncm91bmQtZGVmYXVsdCcsIGxhYmVsOiAn67Cw6rK9KOq4sOuzuCknLCBjb2xvcjogJ3JnYmEoMTY0LCAxMDUsIDYzLCAxKScsIGhleDogJyNBNDY5M0ZGRicsIGh1ZTogMjUsIGFscGhhOiAyNTUgfSxcclxuICAgICAgICAgIHsgaWQ6ICdsaWdodC1iYWNrZ3JvdW5kLXByZXNzZWQnLCBsYWJlbDogJ+uwsOqyvSjriIzrprwpJywgY29sb3I6ICdyZ2JhKDIzOCwgMjIwLCAyMTAsIDEpJywgaGV4OiAnI0VFRENEMkZGJywgaHVlOiAyNSwgYWxwaGE6IDI1NSB9LFxyXG4gICAgICAgICAgeyBpZDogJ2xpZ2h0LWJhY2tncm91bmQtZGlzYWJsZWQnLCBsYWJlbDogJ+uwsOqyvSjruYTtmZzshLEpJywgY29sb3I6ICd0cmFuc3BhcmVudCcsIGhleDogJyMwMDAwMDAwMCcsIGh1ZTogMCwgYWxwaGE6IDAgfSxcclxuICAgICAgICAgIHsgaWQ6ICdsaWdodC1ib3JkZXItZGVmYXVsdCcsIGxhYmVsOiAn7YWM65GQ66asKOq4sOuzuCknLCBjb2xvcjogJ3JnYmEoMTY0LCAxMDUsIDYzLCAxKScsIGhleDogJyNBNDY5M0ZGRicsIGh1ZTogMjUsIGFscGhhOiAyNTUgfSxcclxuICAgICAgICAgIHsgaWQ6ICdsaWdodC1ib3JkZXItcHJlc3NlZCcsIGxhYmVsOiAn7YWM65GQ66asKOuIjOumvCknLCBjb2xvcjogJ3JnYmEoMTQwLCA4MywgNDQsIDEpJywgaGV4OiAnIzhDNTMyQ0ZGJywgaHVlOiAyNSwgYWxwaGE6IDI1NSB9LFxyXG4gICAgICAgICAgeyBpZDogJ2xpZ2h0LWJvcmRlci1kaXNhYmxlZCcsIGxhYmVsOiAn7YWM65GQ66asKOu5hO2ZnOyEsSknLCBjb2xvcjogJ3JnYmEoMTQwLCA4MywgNDQsIDEpJywgaGV4OiAnIzhDNTMyQ0ZGJywgaHVlOiAyNSwgYWxwaGE6IDI1NSB9XHJcbiAgICAgICAgXTtcclxuICAgICAgICBcclxuICAgICAgICBsaWdodFBpY2tlcnMuZm9yRWFjaChwaWNrZXIgPT4ge1xyXG4gICAgICAgICAgY29uc3QgaHRtbCA9IGBcclxuICAgICAgICAgICAgPGRpdiBjbGFzcz1cInBhbGV0dGUtaW5wdXQtZ3JvdXBcIj5cclxuICAgICAgICAgICAgICA8bGFiZWwgZm9yPVwiJHtwaWNrZXIuaWR9XCI+JHtwaWNrZXIubGFiZWx9OjwvbGFiZWw+XHJcbiAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cImN1c3RvbS1jb2xvci1waWNrZXJcIiBkYXRhLXRhcmdldD1cIiR7cGlja2VyLmlkfVwiPlxyXG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cImNvbG9yLWRpc3BsYXlcIiBzdHlsZT1cImJhY2tncm91bmQ6ICR7cGlja2VyLmNvbG9yfVwiPjwvZGl2PlxyXG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cImNvbG9yLXBpY2tlci1wYW5lbFwiPlxyXG4gICAgICAgICAgICAgICAgICA8IS0tIOyDieyDgeq1rOyytCDsupTrsoTsiqQgLS0+XHJcbiAgICAgICAgICAgICAgICAgIDxjYW52YXMgaWQ9XCJjb2xvci1zcGhlcmUtY2FudmFzXCIgY2xhc3M9XCJjb2xvci1jYW52YXMtM2RcIiB3aWR0aD1cIjQwMFwiIGhlaWdodD1cIjQwMFwiIGFyaWEtbGFiZWw9XCIzRCDsg4nsg4Eg6rWs7LK0IOyEoO2Dneq4sFwiPjwvY2FudmFzPlxyXG4gICAgICAgICAgICAgICAgICBcclxuICAgICAgICAgICAgICAgICAgPCEtLSDsg4nsg4Eg7KCV67O0IO2RnOyLnCAtLT5cclxuICAgICAgICAgICAgICAgICAgPHNlY3Rpb24gY2xhc3M9XCJjb2xvci1pbmZvXCI+XHJcbiAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cInBpY2tlci1jb2xvci1kaXNwbGF5XCI+XHJcbiAgICAgICAgICAgICAgICAgICAgICA8aDM+7ISg7YOd65CcIOyDieyDgTwvaDM+XHJcbiAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwicGlja2VyLWNvbG9yLXByZXZpZXctY29udGFpbmVyXCI+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJwaWNrZXItY29sb3ItcHJldmlld1wiIGlkPVwic2VsZWN0ZWQtY29sb3ItcHJldmlld1wiPjwvZGl2PlxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwicGlja2VyLWNvbG9yLWRldGFpbHNcIj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgPHA+SEVYOiA8c3BhbiBpZD1cInNlbGVjdGVkLWNvbG9yLWhleFwiPiNGRkZGRkY8L3NwYW4+PC9wPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8cD5SR0I6IDxzcGFuIGlkPVwic2VsZWN0ZWQtY29sb3ItcmdiXCI+cmdiKDI1NSwgMjU1LCAyNTUpPC9zcGFuPjwvcD5cclxuICAgICAgICAgICAgICAgICAgICAgICAgPHA+SFNMOiA8c3BhbiBpZD1cInNlbGVjdGVkLWNvbG9yLWhzbFwiPmhzbCgwLCAwJSwgMTAwJSk8L3NwYW4+PC9wPlxyXG4gICAgICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgICAgICAgICBcclxuICAgICAgICAgICAgICAgICAgICA8IS0tIO2ZleuMgC/stpXshowg7Luo7Yq466GkIC0tPlxyXG4gICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJwaWNrZXItem9vbS1jb250cm9sc1wiPlxyXG4gICAgICAgICAgICAgICAgICAgICAgPGgzPuq1rOyytCDtgazquLAg7KGw7KCIPC9oMz5cclxuICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJzY2FsaW5nIHpvb21cIj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgPGxhYmVsIGZvcj1cInpvb20tc2xpZGVyXCI+7ZmV64yAL+y2leyGjDo8L2xhYmVsPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8aW5wdXQgXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgdHlwZT1cInJhbmdlXCIgXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgaWQ9XCJ6b29tLXNsaWRlclwiIFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgIG1pbj1cIjAuMVwiIFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgIG1heD1cIjMuMFwiIFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgIHN0ZXA9XCIwLjFcIiBcclxuICAgICAgICAgICAgICAgICAgICAgICAgICB2YWx1ZT1cIjEuMFwiXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgYXJpYS1sYWJlbD1cIuyDieyDgSDqtazssrQg7ZmV64yAL+y2leyGjCAoMTAlIH4gMzAwJSlcIlxyXG4gICAgICAgICAgICAgICAgICAgICAgICA+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDxzcGFuIGNsYXNzPVwic2l6ZSB2YWx1ZSB6b29tLXZhbHVlXCI+MTAwJTwvc3Bhbj5cclxuICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICAgICAgICAgIFxyXG4gICAgICAgICAgICAgICAgICAgIDwhLS0g7IOJ7IOBIOy9lOuTnCDsnoXroKUgLS0+XHJcbiAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJwaWNrZXItY29sb3ItaW5wdXQtZ3JvdXBcIj5cclxuICAgICAgICAgICAgICAgICAgICA8bGFiZWw+7IOJ7IOBIOy9lOuTnDwvbGFiZWw+XHJcbiAgICAgICAgICAgICAgICAgICAgPGlucHV0IHR5cGU9XCJ0ZXh0XCIgY2xhc3M9XCJwYW5lbC1oZXgtaW5wdXRcIiB2YWx1ZT1cIiR7cGlja2VyLmhleH1cIiBtYXhsZW5ndGg9XCI5XCIgcGxhY2Vob2xkZXI9XCIjUlJHR0JCQUFcIj5cclxuICAgICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICAgICAgICAgXHJcbiAgICAgICAgICAgICAgICAgICAgPCEtLSDqtazssrQg7KCV67O0IC0tPlxyXG4gICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJwaWNrZXItc3BoZXJlLWluZm9cIj5cclxuICAgICAgICAgICAgICAgICAgICAgIDxzbWFsbD7wn4yQIDNEIOyDieyDgSDqtazssrQgfCDrk5zrnpjqt7g6IO2ajOyghCB8IO2coDog7JWM7YyMIOyhsOygiDwvc21hbGw+XHJcbiAgICAgICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICAgICAgIDwvc2VjdGlvbj5cclxuICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICAgIDxpbnB1dCB0eXBlPVwidGV4dFwiIGNsYXNzPVwiaGV4LWlucHV0XCIgdmFsdWU9XCIke3BpY2tlci5oZXh9XCI+XHJcbiAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgYDtcclxuICAgICAgICAgIGxpZ2h0Q29udGFpbmVyLmlubmVySFRNTCArPSBodG1sO1xyXG4gICAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgfSxcclxuICAgICAgXHJcbiAgICAgIGdlbmVyYXRlRGFya1RoZW1lUGlja2VycygpIHtcclxuICAgICAgICBjb25zdCBkYXJrQ29udGFpbmVyID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2RhcmstY29sb3ItcGlja2VycycpO1xyXG4gICAgICAgIGlmICghZGFya0NvbnRhaW5lcikgcmV0dXJuO1xyXG4gICAgICAgIFxyXG4gICAgICAgIGNvbnN0IGRhcmtQaWNrZXJzID0gW1xyXG4gICAgICAgICAgeyBpZDogJ2RhcmstY29udGVudC1kZWZhdWx0JywgbGFiZWw6ICfsvZjthZDsuKAo6riw67O4KScsIGNvbG9yOiAncmdiYSgwLCAwLCAwLCAxKScsIGhleDogJyMwMDAwMDBGRicsIGh1ZTogMCwgYWxwaGE6IDI1NSB9LFxyXG4gICAgICAgICAgeyBpZDogJ2RhcmstY29udGVudC1wcmVzc2VkJywgbGFiZWw6ICfsvZjthZDsuKAo64iM66a8KScsIGNvbG9yOiAncmdiYSgyNTUsIDIzOSwgMTI4LCAxKScsIGhleDogJyNGRkVGODBGRicsIGh1ZTogNTQsIGFscGhhOiAyNTUgfSxcclxuICAgICAgICAgIHsgaWQ6ICdkYXJrLWNvbnRlbnQtZGlzYWJsZWQnLCBsYWJlbDogJ+y9mO2FkOy4oCjruYTtmZzshLEpJywgY29sb3I6ICdyZ2JhKDI1NSwgMjI1LCAwLCAxKScsIGhleDogJyNGRkUxMDBGRicsIGh1ZTogNTQsIGFscGhhOiAyNTUgfSxcclxuICAgICAgICAgIHsgaWQ6ICdkYXJrLWJhY2tncm91bmQtZGVmYXVsdCcsIGxhYmVsOiAn67Cw6rK9KOq4sOuzuCknLCBjb2xvcjogJ3JnYmEoMjU1LCAyMjUsIDAsIDEpJywgaGV4OiAnI0ZGRTEwMEZGJywgaHVlOiA1NCwgYWxwaGE6IDI1NSB9LFxyXG4gICAgICAgICAgeyBpZDogJ2RhcmstYmFja2dyb3VuZC1wcmVzc2VkJywgbGFiZWw6ICfrsLDqsr0o64iM66a8KScsIGNvbG9yOiAncmdiYSgzNiwgMzEsIDAsIDEpJywgaGV4OiAnIzI0MUYwMEZGJywgaHVlOiA1NCwgYWxwaGE6IDI1NSB9LFxyXG4gICAgICAgICAgeyBpZDogJ2RhcmstYmFja2dyb3VuZC1kaXNhYmxlZCcsIGxhYmVsOiAn67Cw6rK9KOu5hO2ZnOyEsSknLCBjb2xvcjogJ3RyYW5zcGFyZW50JywgaGV4OiAnIzAwMDAwMDAwJywgaHVlOiAwLCBhbHBoYTogMCB9LFxyXG4gICAgICAgICAgeyBpZDogJ2RhcmstYm9yZGVyLWRlZmF1bHQnLCBsYWJlbDogJ+2FjOuRkOumrCjquLDrs7gpJywgY29sb3I6ICdyZ2JhKDI1NSwgMjI1LCAwLCAxKScsIGhleDogJyNGRkUxMDBGRicsIGh1ZTogNTQsIGFscGhhOiAyNTUgfSxcclxuICAgICAgICAgIHsgaWQ6ICdkYXJrLWJvcmRlci1wcmVzc2VkJywgbGFiZWw6ICfthYzrkZDrpqwo64iM66a8KScsIGNvbG9yOiAncmdiYSgyNTUsIDIzOSwgMTI4LCAxKScsIGhleDogJyNGRkVGODBGRicsIGh1ZTogNTQsIGFscGhhOiAyNTUgfSxcclxuICAgICAgICAgIHsgaWQ6ICdkYXJrLWJvcmRlci1kaXNhYmxlZCcsIGxhYmVsOiAn7YWM65GQ66asKOu5hO2ZnOyEsSknLCBjb2xvcjogJ3JnYmEoMjU1LCAyMjUsIDAsIDEpJywgaGV4OiAnI0ZGRTEwMEZGJywgaHVlOiA1NCwgYWxwaGE6IDI1NSB9XHJcbiAgICAgICAgXTtcclxuICAgICAgICBcclxuICAgICAgICBkYXJrUGlja2Vycy5mb3JFYWNoKHBpY2tlciA9PiB7XHJcbiAgICAgICAgICBjb25zdCBodG1sID0gYFxyXG4gICAgICAgICAgICA8ZGl2IGNsYXNzPVwicGFsZXR0ZS1pbnB1dC1ncm91cFwiPlxyXG4gICAgICAgICAgICAgIDxsYWJlbCBmb3I9XCIke3BpY2tlci5pZH1cIj4ke3BpY2tlci5sYWJlbH06PC9sYWJlbD5cclxuICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwiY3VzdG9tLWNvbG9yLXBpY2tlclwiIGRhdGEtdGFyZ2V0PVwiJHtwaWNrZXIuaWR9XCI+XHJcbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwiY29sb3ItZGlzcGxheVwiIHN0eWxlPVwiYmFja2dyb3VuZDogJHtwaWNrZXIuY29sb3J9XCI+PC9kaXY+XHJcbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwiY29sb3ItcGlja2VyLXBhbmVsXCI+XHJcbiAgICAgICAgICAgICAgICAgIDwhLS0g7IOJ7IOB6rWs7LK0IOy6lOuyhOyKpCAtLT5cclxuICAgICAgICAgICAgICAgICAgPGNhbnZhcyBpZD1cImNvbG9yLXNwaGVyZS1jYW52YXNcIiBjbGFzcz1cImNvbG9yLWNhbnZhcy0zZFwiIHdpZHRoPVwiNDAwXCIgaGVpZ2h0PVwiNDAwXCIgYXJpYS1sYWJlbD1cIjNEIOyDieyDgSDqtazssrQg7ISg7YOd6riwXCI+PC9jYW52YXM+XHJcbiAgICAgICAgICAgICAgICAgIFxyXG4gICAgICAgICAgICAgICAgICA8IS0tIOyDieyDgSDsoJXrs7Qg7ZGc7IucIC0tPlxyXG4gICAgICAgICAgICAgICAgICA8c2VjdGlvbiBjbGFzcz1cImNvbG9yLWluZm9cIj5cclxuICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwicGlja2VyLWNvbG9yLWRpc3BsYXlcIj5cclxuICAgICAgICAgICAgICAgICAgICAgIDxoMz7shKDtg53rkJwg7IOJ7IOBPC9oMz5cclxuICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJwaWNrZXItY29sb3ItcHJldmlldy1jb250YWluZXJcIj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cInBpY2tlci1jb2xvci1wcmV2aWV3XCIgaWQ9XCJzZWxlY3RlZC1jb2xvci1wcmV2aWV3XCI+PC9kaXY+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJwaWNrZXItY29sb3ItZGV0YWlsc1wiPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8cD5IRVg6IDxzcGFuIGlkPVwic2VsZWN0ZWQtY29sb3ItaGV4XCI+I0ZGRkZGRjwvc3Bhbj48L3A+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDxwPlJHQjogPHNwYW4gaWQ9XCJzZWxlY3RlZC1jb2xvci1yZ2JcIj5yZ2IoMjU1LCAyNTUsIDI1NSk8L3NwYW4+PC9wPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8cD5IU0w6IDxzcGFuIGlkPVwic2VsZWN0ZWQtY29sb3ItaHNsXCI+aHNsKDAsIDAlLCAxMDAlKTwvc3Bhbj48L3A+XHJcbiAgICAgICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICAgICAgICAgIFxyXG4gICAgICAgICAgICAgICAgICAgIDwhLS0g7ZmV64yAL+y2leyGjCDsu6jtirjroaQgLS0+XHJcbiAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cInBpY2tlci16b29tLWNvbnRyb2xzXCI+XHJcbiAgICAgICAgICAgICAgICAgICAgICA8aDM+6rWs7LK0IO2BrOq4sCDsobDsoIg8L2gzPlxyXG4gICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cInNjYWxpbmcgem9vbVwiPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8bGFiZWwgZm9yPVwiem9vbS1zbGlkZXJcIj7tmZXrjIAv7LaV7IaMOjwvbGFiZWw+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDxpbnB1dCBcclxuICAgICAgICAgICAgICAgICAgICAgICAgICB0eXBlPVwicmFuZ2VcIiBcclxuICAgICAgICAgICAgICAgICAgICAgICAgICBpZD1cInpvb20tc2xpZGVyXCIgXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgbWluPVwiMC4xXCIgXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgbWF4PVwiMy4wXCIgXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgc3RlcD1cIjAuMVwiIFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgIHZhbHVlPVwiMS4wXCJcclxuICAgICAgICAgICAgICAgICAgICAgICAgICBhcmlhLWxhYmVsPVwi7IOJ7IOBIOq1rOyytCDtmZXrjIAv7LaV7IaMICgxMCUgfiAzMDAlKVwiXHJcbiAgICAgICAgICAgICAgICAgICAgICAgID5cclxuICAgICAgICAgICAgICAgICAgICAgICAgPHNwYW4gY2xhc3M9XCJzaXplIHZhbHVlIHpvb20tdmFsdWVcIj4xMDAlPC9zcGFuPlxyXG4gICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICAgICAgICAgXHJcbiAgICAgICAgICAgICAgICAgICAgPCEtLSDsg4nsg4Eg7L2U65OcIOyeheugpSAtLT5cclxuICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cInBpY2tlci1jb2xvci1pbnB1dC1ncm91cFwiPlxyXG4gICAgICAgICAgICAgICAgICAgIDxsYWJlbD7sg4nsg4Eg7L2U65OcPC9sYWJlbD5cclxuICAgICAgICAgICAgICAgICAgICA8aW5wdXQgdHlwZT1cInRleHRcIiBjbGFzcz1cInBhbmVsLWhleC1pbnB1dFwiIHZhbHVlPVwiJHtwaWNrZXIuaGV4fVwiIG1heGxlbmd0aD1cIjlcIiBwbGFjZWhvbGRlcj1cIiNSUkdHQkJBQVwiPlxyXG4gICAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgICAgICAgICBcclxuICAgICAgICAgICAgICAgICAgICA8IS0tIOq1rOyytCDsoJXrs7QgLS0+XHJcbiAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cInBpY2tlci1zcGhlcmUtaW5mb1wiPlxyXG4gICAgICAgICAgICAgICAgICAgICAgPHNtYWxsPvCfjJAgM0Qg7IOJ7IOBIOq1rOyytCB8IOuTnOuemOq3uDog7ZqM7KCEIHwg7ZygOiDslYztjIwg7KGw7KCIPC9zbWFsbD5cclxuICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgICAgICAgPC9zZWN0aW9uPlxyXG4gICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICAgPGlucHV0IHR5cGU9XCJ0ZXh0XCIgY2xhc3M9XCJoZXgtaW5wdXRcIiB2YWx1ZT1cIiR7cGlja2VyLmhleH1cIj5cclxuICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICBgO1xyXG4gICAgICAgICAgZGFya0NvbnRhaW5lci5pbm5lckhUTUwgKz0gaHRtbDtcclxuICAgICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgIH0sXHJcbiAgICAgIFxyXG4gICAgICAvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XHJcbiAgICAgIC8vIPCfjpvvuI8g7IOB7Zi47J6R7JqpIOyEpOyglSDsi5zsiqTthZxcclxuICAgICAgLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxyXG4gICAgICBcclxuICAgICAgc2V0dXBDb2xvckRpc3BsYXlzKCkge1xyXG4gICAgICAgIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJy5jb2xvci1kaXNwbGF5JykuZm9yRWFjaChkaXNwbGF5ID0+IHtcclxuICAgICAgICAgIGRpc3BsYXkuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoZSkgPT4ge1xyXG4gICAgICAgICAgICBjb25zdCBwaWNrZXIgPSBlLnRhcmdldC5jbG9zZXN0KCcuY3VzdG9tLWNvbG9yLXBpY2tlcicpO1xyXG4gICAgICAgICAgICBjb25zdCBwYW5lbCA9IHBpY2tlci5xdWVyeVNlbGVjdG9yKCcuY29sb3ItcGlja2VyLXBhbmVsJyk7XHJcbiAgICAgICAgICAgIFxyXG4gICAgICAgICAgICAvLyDri6Trpbgg7Yyo64SQ65OkIOuLq+q4sFxyXG4gICAgICAgICAgICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCcuY29sb3ItcGlja2VyLXBhbmVsJykuZm9yRWFjaChwID0+IHAuY2xhc3NMaXN0LnJlbW92ZSgnYWN0aXZlJykpO1xyXG4gICAgICAgICAgICBcclxuICAgICAgICAgICAgLy8g7ZiE7J6sIO2MqOuEkCDthqDquIBcclxuICAgICAgICAgICAgcGFuZWwuY2xhc3NMaXN0LnRvZ2dsZSgnYWN0aXZlJyk7XHJcbiAgICAgICAgICAgIFxyXG4gICAgICAgICAgICBpZiAocGFuZWwuY2xhc3NMaXN0LmNvbnRhaW5zKCdhY3RpdmUnKSkge1xyXG4gICAgICAgICAgICAgIC8vIDNEIOy6lOuyhOyKpCDstIjquLDtmZQg7ZuEIOyDieyDgSDsnbTrj5lcclxuICAgICAgICAgICAgICB0aGlzLmluaXRpYWxpemUzRENhbnZhcyhwaWNrZXIpO1xyXG4gICAgICAgICAgICAgIFxyXG4gICAgICAgICAgICAgIC8vIO2MlOugiO2KuCDsl7TrprQg65WMIO2YhOyerCDsnoXroKXqsJLsl5Ag7ZW064u57ZWY64qUIOyDieyDgeydhCDspJHsi6zsoJDsnLzroZwg7J2064+ZXHJcbiAgICAgICAgICAgICAgY29uc3QgaGV4SW5wdXQgPSBwaWNrZXIucGFyZW50RWxlbWVudC5xdWVyeVNlbGVjdG9yKCcuaGV4LWlucHV0Jyk7XHJcbiAgICAgICAgICAgICAgaWYgKGhleElucHV0ICYmIGhleElucHV0LnZhbHVlKSB7XHJcbiAgICAgICAgICAgICAgICBjb25zdCBoZXhWYWx1ZSA9IGhleElucHV0LnZhbHVlLnJlcGxhY2UoJyMnLCAnJykudG9VcHBlckNhc2UoKTtcclxuICAgICAgICAgICAgICAgIFxyXG4gICAgICAgICAgICAgICAgLy8gOOyekOumrCDtl6XsiqTsvZTrk5zrp4wg7ZmV7J24ICjsmYTsoIQg7J6F66Cl7Iuc7JeQ66eMKVxyXG4gICAgICAgICAgICAgICAgaWYgKGhleFZhbHVlLmxlbmd0aCA9PT0gOCAmJiAvXlswLTlBLUZdezh9JC8udGVzdChoZXhWYWx1ZSkpIHtcclxuICAgICAgICAgICAgICAgICAgLy8gUkdCQSDsp4HsoJEg7IOd7ISxICjtjIzsi7Eg7Jik67KE7Zek65OcIOyXhuydjClcclxuICAgICAgICAgICAgICAgICAgY29uc3QgciA9IHBhcnNlSW50KGhleFZhbHVlLnN1YnN0cigwLCAyKSwgMTYpO1xyXG4gICAgICAgICAgICAgICAgICBjb25zdCBnID0gcGFyc2VJbnQoaGV4VmFsdWUuc3Vic3RyKDIsIDIpLCAxNik7XHJcbiAgICAgICAgICAgICAgICAgIGNvbnN0IGIgPSBwYXJzZUludChoZXhWYWx1ZS5zdWJzdHIoNCwgMiksIDE2KTtcclxuICAgICAgICAgICAgICAgICAgXHJcbiAgICAgICAgICAgICAgICAgIC8vIOy6lOuyhOyKpCDstIjquLDtmZQg7JmE66OMIO2bhCDsg4nsg4Eg7J2064+ZICjsnoXroKXqsJIg67OA6rK9IOyXhuydtCDqtazssrTrp4wg7ZqM7KCEKVxyXG5cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgIH0pO1xyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIFxyXG4gICAgICAgIC8vIOyZuOu2gCDtgbTrpq0g7IucIO2MqOuEkCDri6vquLBcclxuICAgICAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIChlKSA9PiB7XHJcbiAgICAgICAgICBpZiAoIWUudGFyZ2V0LmNsb3Nlc3QoJy5jdXN0b20tY29sb3ItcGlja2VyJykpIHtcclxuICAgICAgICAgICAgZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgnLmNvbG9yLXBpY2tlci1wYW5lbCcpLmZvckVhY2gocGFuZWwgPT4ge1xyXG4gICAgICAgICAgICAgIHBhbmVsLmNsYXNzTGlzdC5yZW1vdmUoJ2FjdGl2ZScpO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuICAgICAgfSxcclxuICAgICAgXHJcbiAgICAgIGluaXRpYWxpemUzRENhbnZhcyhwaWNrZXIpIHtcclxuICAgICAgICBjb25zdCBjYW52YXMzRCA9IHBpY2tlci5xdWVyeVNlbGVjdG9yKCcuY29sb3ItY2FudmFzLTNkJyk7XHJcbiAgICAgICAgaWYgKGNhbnZhczNEKSB7XHJcbiAgICAgICAgICAvLyDthrXtlakg7IOJ6rWs7LK0IOyDge2DnOuhnCDstIjquLDtmZRcclxuICAgICAgICAgIGNvbnN0IGN0eCA9IGNhbnZhczNELmdldENvbnRleHQoJzJkJyk7XHJcbiAgICAgICAgICBjdHguY2xlYXJSZWN0KDAsIDAsIGNhbnZhczNELndpZHRoLCBjYW52YXMzRC5oZWlnaHQpO1xyXG4gICAgICAgICAgXHJcbiAgICAgICAgICAvLyDqtazssrQg66CM642U66eBXHJcbiAgICAgICAgICBNZWNoYW5pY3MuUmVuZGVyQ29sb3JTcGhlcmUoY3R4LCBNZWNoYW5pY3MuVW5pZmllZFNwaGVyZVN0YXRlKTtcclxuICAgICAgICAgIFxyXG4gICAgICAgICAgLy8g7Ya17ZWpIOyDge2DnOuhnCDsnbjthLDrnpnshZgg7ISk7KCVXHJcbiAgICAgICAgICBNZWNoYW5pY3Muc2V0dXBDYW52YXNJbnRlcmFjdGlvbihcclxuICAgICAgICAgICAgY2FudmFzM0QsIFxyXG4gICAgICAgICAgICBNZWNoYW5pY3MuVW5pZmllZFNwaGVyZVN0YXRlLCBcclxuICAgICAgICAgICAgKGNhbnZhcykgPT4gdGhpcy51cGRhdGVDZW50ZXJDb2xvclJlYWx0aW1lKGNhbnZhcylcclxuICAgICAgICAgICk7XHJcbiAgICAgICAgfVxyXG4gICAgICB9LFxyXG4gICAgICBcclxuICAgICAgc2V0dXAzRENhbnZhc0ludGVyYWN0aW9uKCkge1xyXG4gICAgICAgIC8vIO2Gte2VqSDsg4nqtazssrQg7IOB7YOc66GcIOyDge2YuOyekeyaqSDshKTsoJVcclxuICAgICAgICBjb25zdCBoYW5kbGVDYW52YXNTZXR1cCA9IChjYW52YXMpID0+IHtcclxuICAgICAgICAgIE1lY2hhbmljcy5zZXR1cENhbnZhc0ludGVyYWN0aW9uKFxyXG4gICAgICAgICAgICBjYW52YXMsIFxyXG4gICAgICAgICAgICBNZWNoYW5pY3MuVW5pZmllZFNwaGVyZVN0YXRlLCBcclxuICAgICAgICAgICAgKGNhbnZhcykgPT4gdGhpcy51cGRhdGVDZW50ZXJDb2xvclJlYWx0aW1lKGNhbnZhcylcclxuICAgICAgICAgICk7XHJcbiAgICAgICAgfTtcclxuICAgICAgICBcclxuICAgICAgICAvLyAzRCDqtazssrTsl5DshJwg7IOJ7IOBIOyEoO2DnSAo7L+87YSw64uI7Ja4IOq4sOuwmClcclxuICAgICAgICBjb25zdCBzZWxlY3RDb2xvckF0M0QgPSAoZSwgY2FudmFzKSA9PiB7XHJcbiAgICAgICAgICBjb25zdCByZWN0ID0gY2FudmFzLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO1xyXG4gICAgICAgICAgY29uc3QgeCA9IGUuY2xpZW50WCAtIHJlY3QubGVmdDtcclxuICAgICAgICAgIGNvbnN0IHkgPSBlLmNsaWVudFkgLSByZWN0LnRvcDtcclxuICAgICAgICAgIGNvbnN0IGNlbnRlclggPSByZWN0LndpZHRoIC8gMjtcclxuICAgICAgICAgIGNvbnN0IGNlbnRlclkgPSByZWN0LmhlaWdodCAvIDI7XHJcbiAgICAgICAgICBjb25zdCByYWRpdXMgPSAoTWF0aC5taW4ocmVjdC53aWR0aCwgcmVjdC5oZWlnaHQpIC8gMiAtIDIwKSAqIHRoaXMuc3BoZXJlU3RhdGUuem9vbTtcclxuICAgICAgICAgIFxyXG4gICAgICAgICAgY29uc3QgZHggPSB4IC0gY2VudGVyWDtcclxuICAgICAgICAgIGNvbnN0IGR5ID0geSAtIGNlbnRlclk7XHJcbiAgICAgICAgICBjb25zdCBkaXN0YW5jZSA9IE1hdGguc3FydChkeCAqIGR4ICsgZHkgKiBkeSk7XHJcbiAgICAgICAgICBcclxuICAgICAgICAgIGlmIChkaXN0YW5jZSA8PSByYWRpdXMpIHtcclxuICAgICAgICAgICAgLy8gM0Qg6rWs7LK0IOyijO2RnCAo7J2M7JiBIO2aqOqzvOuKlCDsl4bsp4Drp4wg6rWs7KGw64qUIDNEKVxyXG4gICAgICAgICAgICBjb25zdCBzY3JlZW5YID0gZHggLyByYWRpdXM7XHJcbiAgICAgICAgICAgIGNvbnN0IHNjcmVlblkgPSBkeSAvIHJhZGl1cztcclxuICAgICAgICAgICAgY29uc3Qgc2NyZWVuWiA9IE1hdGguc3FydChNYXRoLm1heCgwLCAxIC0gc2NyZWVuWCAqIHNjcmVlblggLSBzY3JlZW5ZICogc2NyZWVuWSkpOyAgLy8gM0Qg6rWs7LK0IOqzoeuptFxyXG4gICAgICAgICAgICBcclxuICAgICAgICAgICAgLy8g7L+87YSw64uI7Ja47Jy866GcIO2ajOyghCDsoIHsmqkgKO2Gte2VqSDsg4Htg5wg7IKs7JqpKVxyXG4gICAgICAgICAgICBjb25zdCByb3RhdGVkVmVjdG9yID0gTWVjaGFuaWNzLnJvdGF0ZVZlY3RvcihNZWNoYW5pY3MuVW5pZmllZFNwaGVyZVN0YXRlLlEsIFtzY3JlZW5YLCBzY3JlZW5ZLCBzY3JlZW5aXSk7XHJcbiAgICAgICAgICAgIGNvbnN0IFtyb3RhdGVkWCwgcm90YXRlZFksIHJvdGF0ZWRaXSA9IHJvdGF0ZWRWZWN0b3I7XHJcbiAgICAgICAgICAgIFxyXG4gICAgICAgICAgICAvLyDqtazrqbQg7KKM7ZGc66GcIOuzgO2ZmFxyXG4gICAgICAgICAgICBjb25zdCBwaGkgPSBNYXRoLmF0YW4yKHJvdGF0ZWRZLCByb3RhdGVkWCk7XHJcbiAgICAgICAgICAgIGNvbnN0IHRoZXRhID0gTWF0aC5hY29zKE1hdGgubWF4KC0xLCBNYXRoLm1pbigxLCByb3RhdGVkWikpKTtcclxuICAgICAgICAgICAgXHJcbiAgICAgICAgICAgIC8vIOyngeygkSBSR0Ig7Zel7Iqk7L2U65OcIOyKpOy8gOydvOungSAo7LqY66as67iM66CI7J207IWYKVxyXG4gICAgICAgICAgICBsZXQgaHVlID0gKChwaGkgKyBNYXRoLlBJKSAvICgyICogTWF0aC5QSSkpICogMzYwOyAgLy8gMC0zNjDrj4RcclxuICAgICAgICAgICAgaWYgKGh1ZSA+PSAzNjApIGh1ZSA9IDA7XHJcbiAgICAgICAgICAgIFxyXG4gICAgICAgICAgICBjb25zdCByYWRpYWxGYWN0b3IgPSBkaXN0YW5jZSAvIHJhZGl1czsgIC8vIDB+MVxyXG4gICAgICAgICAgICBjb25zdCBsaWdodG5lc3NSYXRpbyA9ICgoTWF0aC5QSSAtIHRoZXRhKSAvIE1hdGguUEkpOyAvLyAwKOuCqOq3uSl+MSjrtoHqt7kpXHJcbiAgICAgICAgICAgICAgICAgICAgICAvLyBTcGhlcmljYWxTeXN0ZW0g66qo65OIIOyCrOyaqSAo7Ya17ZWp65CcIOyDieyDgSDqs4TsgrApXHJcbiAgICAgICAgICBjb25zdCBjb2xvciA9IFRvcG9sb2d5LmNhbGN1bGF0ZUNvbG9yKHRoZXRhLCBwaGkpO1xyXG4gICAgICAgICAgY29uc3QgeyByLCBnLCBiIH0gPSBjb2xvcjtcclxuICAgICAgICAgICAgXHJcbiAgICAgICAgICAgIC8vIDjsnpDrpqwg7Zel7Iqk7L2U65Oc66GcIOyngeygkSDsspjrpqwgKO2Gte2VqSDsg4Htg5wg7IKs7JqpKVxyXG4gICAgICAgICAgICBNZWNoYW5pY3MuVW5pZmllZFNwaGVyZVN0YXRlLnNlbGVjdGVkQ29sb3IgPSB7IHIsIGcsIGIsIGh1ZSB9O1xyXG4gICAgICAgICAgICBcclxuICAgICAgICAgICAgY29uc3QgcGlja2VyID0gY2FudmFzLmNsb3Nlc3QoJy5jdXN0b20tY29sb3ItcGlja2VyJyk7XHJcbiAgICAgICAgICAgIGNvbnN0IHRhcmdldElkID0gcGlja2VyLmRhdGFzZXQudGFyZ2V0O1xyXG4gICAgICAgICAgICBjb25zdCBwYW5lbEhleElucHV0ID0gcGlja2VyLnF1ZXJ5U2VsZWN0b3IoJy5wYW5lbC1oZXgtaW5wdXQnKTtcclxuICAgICAgICAgICAgXHJcbiAgICAgICAgICAgIC8vIO2YhOyerCDslYztjIzqsJIg7Jyg7KeAXHJcbiAgICAgICAgICAgIGxldCBhbHBoYSA9IDI1NTtcclxuICAgICAgICAgICAgaWYgKHBhbmVsSGV4SW5wdXQgJiYgcGFuZWxIZXhJbnB1dC52YWx1ZSkge1xyXG4gICAgICAgICAgICAgIGNvbnN0IGN1cnJlbnRIZXggPSBwYW5lbEhleElucHV0LnZhbHVlLnJlcGxhY2UoJyMnLCAnJyk7XHJcbiAgICAgICAgICAgICAgaWYgKGN1cnJlbnRIZXgubGVuZ3RoID09PSA4KSB7XHJcbiAgICAgICAgICAgICAgICBhbHBoYSA9IHBhcnNlSW50KGN1cnJlbnRIZXguc3Vic3RyKDYsIDIpLCAxNik7XHJcbiAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIFxyXG4gICAgICAgICAgICBjb25zdCByZ2IgPSB7IHIsIGcsIGIgfTtcclxuICAgICAgICAgICAgY29uc3QgaGV4Q29sb3IgPSBDb2xvckNvbnZlcnRlci5yZ2JhVG9IZXgociwgZywgYiwgYWxwaGEpO1xyXG4gICAgICAgICAgICBcclxuICAgICAgICAgICAgdGhpcy51cGRhdGVDb2xvcklucHV0cyh0YXJnZXRJZCwgcmdiLCBhbHBoYSwgaGV4Q29sb3IpO1xyXG4gICAgICAgICAgdGhpcy51cGRhdGVTZWxlY3RlZENvbG9ySW5mbyhyZ2IsIGFscGhhLCBoZXhDb2xvcik7XHJcbiAgICAgICAgICAgIHRoaXMudXBkYXRlU2VsZWN0ZWRDb2xvckluZm8ocmdiLCBhbHBoYSwgaGV4Q29sb3IpO1xyXG4gICAgICAgICAgICBcclxuICAgICAgICAgICAgLy8g6rWs7LK0IOuLpOyLnCDqt7jrpqzquLAgKOyEoO2DneygkCDsl4XrjbDsnbTtirgsIO2IrOuqheuPhCDrsJjsmIEpIC0g7Ya17ZWpIOyDge2DnCDsgqzsmqkgKOugjOuNlOungeydgCBzZXR1cENhbnZhc0ludGVyYWN0aW9u7JeQ7IScIOyymOumrClcclxuICAgICAgICAgIH1cclxuICAgICAgICB9O1xyXG4gICAgICAgIFxyXG4gICAgICAgIHRoaXMuc2VsZWN0Q29sb3JBdDNEID0gc2VsZWN0Q29sb3JBdDNEO1xyXG4gICAgICAgIFxyXG5cclxuICAgICAgICBcclxuICAgICAgICAvLyDrt7Dtj6ztirgg7KSR7Ius7KCQIOyDieyDgSDsi6Tsi5zqsIQg7JeF642w7J207Yq4XHJcbiAgICAgICAgdGhpcy51cGRhdGVDZW50ZXJDb2xvclJlYWx0aW1lID0gKGNhbnZhcykgPT4ge1xyXG4gICAgICAgICAgLy8g7ZmU66m0IOykkeyLrOygkCAoMCwgMCwgMSkgM0Qg6rWs7LK0IO2RnOuptFxyXG4gICAgICAgICAgY29uc3Qgc2NyZWVuWCA9IDA7ICAvLyDspJHsi6zsoJBcclxuICAgICAgICAgIGNvbnN0IHNjcmVlblkgPSAwOyAgLy8g7KSR7Ius7KCQICBcclxuICAgICAgICAgIGNvbnN0IHNjcmVlblogPSAxOyAgLy8g6rWs7LK0IO2RnOuptCAoeiA9IDEpXHJcbiAgICAgICAgICBcclxuICAgICAgICAgIC8vIOy/vO2EsOuLiOyWuOycvOuhnCDtmozsoIQg7KCB7JqpICjthrXtlakg7IOB7YOcIOyCrOyaqSlcclxuICAgICAgICAgIGNvbnN0IHJvdGF0ZWRWZWN0b3IgPSBNZWNoYW5pY3Mucm90YXRlVmVjdG9yKE1lY2hhbmljcy5VbmlmaWVkU3BoZXJlU3RhdGUuUSwgW3NjcmVlblgsIHNjcmVlblksIHNjcmVlblpdKTtcclxuICAgICAgICAgIGNvbnN0IFtyb3RhdGVkWCwgcm90YXRlZFksIHJvdGF0ZWRaXSA9IHJvdGF0ZWRWZWN0b3I7XHJcbiAgICAgICAgICBcclxuICAgICAgICAgIC8vIDNEIOyijO2RnOulvCDqtazrqbQg7KKM7ZGc66GcIOuzgO2ZmFxyXG4gICAgICAgICAgY29uc3QgcGhpID0gTWF0aC5hdGFuMihyb3RhdGVkWSwgcm90YXRlZFgpOyAgLy8g6rK964+EICgtz4AgfiDPgClcclxuICAgICAgICAgIGNvbnN0IHRoZXRhID0gTWF0aC5hY29zKE1hdGgubWF4KC0xLCBNYXRoLm1pbigxLCByb3RhdGVkWikpKTsgIC8vIOychOuPhCAoMCB+IM+AKVxyXG5cclxuICAgICAgICAgIC8vIOugjOuNlOungeqzvCDrj5nsnbztlZwg7IOJ7IOBIOqzhOyCsCDsgqzsmqlcclxuICAgICAgICAgIGNvbnN0IGNvbG9yID0gVG9wb2xvZ3kuY2FsY3VsYXRlQ29sb3IodGhldGEsIHBoaSk7XHJcbiAgICAgICAgICBjb25zdCB7IHIsIGcsIGIgfSA9IGNvbG9yO1xyXG4gICAgICAgICAgXHJcbiAgICAgICAgICAvLyA47J6Q66asIO2XpeyKpOy9lOuTnOuhnCDsp4HsoJEg7LKY66asICjthrXtlakg7IOB7YOcIOyCrOyaqSlcclxuICAgICAgICAgIE1lY2hhbmljcy5VbmlmaWVkU3BoZXJlU3RhdGUuc2VsZWN0ZWRDb2xvciA9IHsgciwgZywgYiB9O1xyXG4gICAgICAgICAgXHJcbiAgICAgICAgICAvLyDsu6zrn6ztlLzsu6Qg6rWs7LK064+EIO2ajOyghCDsg4Htg5wg64+Z6riw7ZmUICjroIzrjZTrp4HsnYAgc2V0dXBDYW52YXNJbnRlcmFjdGlvbuyXkOyEnCDsspjrpqwpXHJcbiAgICAgICAgICBcclxuICAgICAgICAgIGNvbnN0IHBpY2tlciA9IGNhbnZhcy5jbG9zZXN0KCcuY3VzdG9tLWNvbG9yLXBpY2tlcicpO1xyXG4gICAgICAgICAgaWYgKCFwaWNrZXIpIHJldHVybjtcclxuICAgICAgICAgIFxyXG4gICAgICAgICAgY29uc3QgdGFyZ2V0SWQgPSBwaWNrZXIuZGF0YXNldC50YXJnZXQ7XHJcbiAgICAgICAgICBjb25zdCBwYW5lbEhleElucHV0ID0gcGlja2VyLnF1ZXJ5U2VsZWN0b3IoJy5wYW5lbC1oZXgtaW5wdXQnKTtcclxuICAgICAgICAgIFxyXG4gICAgICAgICAgLy8g7ZiE7J6sIOyVjO2MjOqwkiDsnKDsp4BcclxuICAgICAgICAgIGxldCBhbHBoYSA9IDI1NTtcclxuICAgICAgICAgIGlmIChwYW5lbEhleElucHV0ICYmIHBhbmVsSGV4SW5wdXQudmFsdWUpIHtcclxuICAgICAgICAgICAgY29uc3QgY3VycmVudEhleCA9IHBhbmVsSGV4SW5wdXQudmFsdWUucmVwbGFjZSgnIycsICcnKTtcclxuICAgICAgICAgICAgaWYgKGN1cnJlbnRIZXgubGVuZ3RoID09PSA4KSB7XHJcbiAgICAgICAgICAgICAgYWxwaGEgPSBwYXJzZUludChjdXJyZW50SGV4LnN1YnN0cig2LCAyKSwgMTYpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgICBcclxuICAgICAgICAgIGNvbnN0IHJnYiA9IHsgciwgZywgYiB9O1xyXG4gICAgICAgICAgY29uc3QgaGV4Q29sb3IgPSBDb2xvckNvbnZlcnRlci5yZ2JhVG9IZXgociwgZywgYiwgYWxwaGEpO1xyXG4gICAgICAgICAgXHJcbiAgICAgICAgICAvLyBVSSDsl4XrjbDsnbTtirggKOuTnOuemOq3uCDsi5wg7Iuk7Iuc6rCEIOyeheugpeqwkiDrs4Dqsr0pXHJcbiAgICAgICAgICByZXF1ZXN0QW5pbWF0aW9uRnJhbWUoKCkgPT4ge1xyXG4gICAgICAgICAgICB0aGlzLnVwZGF0ZUNvbG9ySW5wdXRzKHRhcmdldElkLCByZ2IsIGFscGhhLCBoZXhDb2xvcik7XHJcbiAgICAgICAgICB0aGlzLnVwZGF0ZVNlbGVjdGVkQ29sb3JJbmZvKHJnYiwgYWxwaGEsIGhleENvbG9yKTtcclxuICAgICAgICAgICAgdGhpcy51cGRhdGVTZWxlY3RlZENvbG9ySW5mbyhyZ2IsIGFscGhhLCBoZXhDb2xvcik7XHJcbiAgICAgICAgICB9KTtcclxuICAgICAgICB9O1xyXG4gICAgICAgIFxyXG4gICAgICAgIC8vIDJEIOy6lOuyhOyKpCDsg4nsg4Eg7ISg7YOdXHJcbiAgICAgICAgY29uc3QgaGFuZGxlMkRDb2xvclNlbGVjdCA9IChlLCBjYW52YXMpID0+IHtcclxuICAgICAgICAgIGNvbnN0IHJlY3QgPSBjYW52YXMuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7XHJcbiAgICAgICAgICBjb25zdCB4ID0gZS5jbGllbnRYIC0gcmVjdC5sZWZ0O1xyXG4gICAgICAgICAgY29uc3QgeSA9IGUuY2xpZW50WSAtIHJlY3QudG9wO1xyXG4gICAgICAgICAgY29uc3Qgc2F0dXJhdGlvbiA9IE1hdGgubWF4KDAsIE1hdGgubWluKDEwMCwgKHggLyByZWN0LndpZHRoKSAqIDEwMCkpO1xyXG4gICAgICAgICAgY29uc3QgdmFsdWUgPSBNYXRoLm1heCgwLCBNYXRoLm1pbigxMDAsICgxIC0geSAvIHJlY3QuaGVpZ2h0KSAqIDEwMCkpO1xyXG4gICAgICAgICAgXHJcbiAgICAgICAgICBjb25zdCBwaWNrZXIgPSBjYW52YXMuY2xvc2VzdCgnLmN1c3RvbS1jb2xvci1waWNrZXInKTtcclxuICAgICAgICAgIGNvbnN0IGh1ZVNsaWRlciA9IHBpY2tlci5xdWVyeVNlbGVjdG9yKCcuaHVlLXNsaWRlcicpO1xyXG4gICAgICAgICAgY29uc3QgYWxwaGFTbGlkZXIgPSBwaWNrZXIucXVlcnlTZWxlY3RvcignLmFscGhhLXNsaWRlcicpO1xyXG4gICAgICAgICAgY29uc3QgdGFyZ2V0SWQgPSBwaWNrZXIuZGF0YXNldC50YXJnZXQ7XHJcbiAgICAgICAgICBcclxuICAgICAgICAgIGNvbnN0IGh1ZSA9IHBhcnNlSW50KGh1ZVNsaWRlcj8udmFsdWUgfHwgMCk7XHJcbiAgICAgICAgICBjb25zdCBhbHBoYSA9IHBhcnNlSW50KGFscGhhU2xpZGVyPy52YWx1ZSB8fCAyNTUpO1xyXG4gICAgICAgICAgY29uc3QgcmdiID0gQ29sb3JDb252ZXJ0ZXIuaHN2VG9SZ2IoaHVlLCBzYXR1cmF0aW9uLCB2YWx1ZSk7XHJcbiAgICAgICAgICBjb25zdCBoZXhDb2xvciA9IENvbG9yQ29udmVydGVyLnJnYmFUb0hleChyZ2IuciwgcmdiLmcsIHJnYi5iLCBhbHBoYSk7XHJcbiAgICAgICAgICBcclxuICAgICAgICAgIHRoaXMudXBkYXRlQ29sb3JJbnB1dHModGFyZ2V0SWQsIHJnYiwgYWxwaGEsIGhleENvbG9yKTtcclxuICAgICAgICAgIHRoaXMudXBkYXRlU2VsZWN0ZWRDb2xvckluZm8ocmdiLCBhbHBoYSwgaGV4Q29sb3IpO1xyXG4gICAgICAgIH07XHJcbiAgICAgICAgXHJcbiAgICAgICAgZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgnLmNvbG9yLWNhbnZhcy0zZCcpLmZvckVhY2goY2FudmFzID0+IHtcclxuICAgICAgICAgIGhhbmRsZUNhbnZhc1NldHVwKGNhbnZhcyk7XHJcbiAgICAgICAgICBcclxuICAgICAgICAgIC8vIO2coCDsnbTrsqTtirggKOyVjO2MjCDsobDsoIgpXHJcbiAgICAgICAgICBjYW52YXMuYWRkRXZlbnRMaXN0ZW5lcignd2hlZWwnLCAoZSkgPT4ge1xyXG4gICAgICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XHJcbiAgICAgICAgICAgIGUuc3RvcFByb3BhZ2F0aW9uKCk7XHJcbiAgICAgICAgICAgIFxyXG4gICAgICAgICAgICBjb25zdCBwaWNrZXIgPSBjYW52YXMuY2xvc2VzdCgnLmN1c3RvbS1jb2xvci1waWNrZXInKTtcclxuICAgICAgICAgICAgY29uc3QgcGFuZWxIZXhJbnB1dCA9IHBpY2tlci5xdWVyeVNlbGVjdG9yKCcucGFuZWwtaGV4LWlucHV0Jyk7XHJcbiAgICAgICAgICAgIFxyXG4gICAgICAgICAgICBpZiAocGFuZWxIZXhJbnB1dCkge1xyXG4gICAgICAgICAgICAgIGNvbnN0IGN1cnJlbnRIZXggPSBwYW5lbEhleElucHV0LnZhbHVlLnJlcGxhY2UoJyMnLCAnJyk7XHJcbiAgICAgICAgICAgICAgbGV0IGN1cnJlbnRBbHBoYSA9IDI1NTtcclxuICAgICAgICAgICAgICBcclxuICAgICAgICAgICAgICAvLyDslYztjIzqsJLsnbQg7JeG7Jy866m0IOyYiOyZuCDrsJzsg51cclxuICAgICAgICAgICAgICBpZiAoIWN1cnJlbnRIZXggfHwgY3VycmVudEhleC5sZW5ndGggPCA2KSB7XHJcbiAgICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ+ycoO2aqO2VmOyngCDslYrsnYAg7Zel7IqkIOyDieyDgeyeheuLiOuLpCcpO1xyXG4gICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICBcclxuICAgICAgICAgICAgICAvLyDtmITsnqwg7JWM7YyM6rCSIOy2lOy2nCAoOOyekOumrCBoZXjsnbgg6rK97JqwKVxyXG4gICAgICAgICAgICAgIGlmIChjdXJyZW50SGV4Lmxlbmd0aCA9PT0gOCkge1xyXG4gICAgICAgICAgICAgICAgY3VycmVudEFscGhhID0gcGFyc2VJbnQoY3VycmVudEhleC5zdWJzdHIoNiwgMiksIDE2KTtcclxuICAgICAgICAgICAgICB9IGVsc2UgaWYgKGN1cnJlbnRIZXgubGVuZ3RoID09PSA2KSB7XHJcbiAgICAgICAgICAgICAgICBjdXJyZW50QWxwaGEgPSAyNTU7XHJcbiAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgIFxyXG4gICAgICAgICAgICAgIC8vIO2coCDsl4U6IOyVjO2MjCDspp3qsIAsIO2coCDri6TsmrQ6IOyVjO2MjCDqsJDshowgKMKxNOyUqSlcclxuICAgICAgICAgICAgICBjb25zdCBhbHBoYUNoYW5nZSA9IGUuZGVsdGFZID4gMCA/IC00IDogNDtcclxuICAgICAgICAgICAgICBjb25zdCBuZXdBbHBoYSA9IE1hdGgubWF4KDAsIE1hdGgubWluKDI1NSwgY3VycmVudEFscGhhICsgYWxwaGFDaGFuZ2UpKTtcclxuICAgICAgICAgICAgICBcclxuICAgICAgICAgICAgICAvLyDtmITsnqwg7IOJ7IOB7JeQIOyDiCDslYztjIwg7KCB7JqpXHJcbiAgICAgICAgICAgICAgaWYgKGN1cnJlbnRIZXgubGVuZ3RoID49IDYpIHtcclxuICAgICAgICAgICAgICAgIGNvbnN0IHJnYiA9IGN1cnJlbnRIZXguc3Vic3RyKDAsIDYpO1xyXG4gICAgICAgICAgICAgICAgY29uc3QgbmV3SGV4ID0gJyMnICsgcmdiICsgbmV3QWxwaGEudG9TdHJpbmcoMTYpLnBhZFN0YXJ0KDIsICcwJykudG9VcHBlckNhc2UoKTtcclxuICAgICAgICAgICAgICAgIFxyXG4gICAgICAgICAgICAgICAgY29uc3QgdGFyZ2V0SWQgPSBwaWNrZXIuZGF0YXNldC50YXJnZXQ7XHJcbiAgICAgICAgICAgICAgICBjb25zdCByID0gcGFyc2VJbnQocmdiLnN1YnN0cigwLCAyKSwgMTYpO1xyXG4gICAgICAgICAgICAgICAgY29uc3QgZyA9IHBhcnNlSW50KHJnYi5zdWJzdHIoMiwgMiksIDE2KTtcclxuICAgICAgICAgICAgICAgIGNvbnN0IGIgPSBwYXJzZUludChyZ2Iuc3Vic3RyKDQsIDIpLCAxNik7XHJcbiAgICAgICAgICAgICAgICBcclxuICAgICAgICAgICAgICAgIHRoaXMudXBkYXRlQ29sb3JJbnB1dHModGFyZ2V0SWQsIHtyLCBnLCBifSwgbmV3QWxwaGEsIG5ld0hleCk7XHJcbiAgICAgICAgICAgICAgICBcclxuICAgICAgICAgICAgICAgIC8vIO2IrOuqheuPhCDrs4DtmZQg7ZuEIOyXheuNsOydtO2KuCAo7ISx64qlIOy1nOygge2ZlClcclxuICAgICAgICAgICAgICAgIHNldFRpbWVvdXQoKCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICBpZiAod2luZG93LkJ1dHRvblN5c3RlbSAmJiB3aW5kb3cuQnV0dG9uU3lzdGVtLlN0eWxlTWFuYWdlcikge1xyXG4gICAgICAgICAgICAgICAgICAgIHdpbmRvdy5CdXR0b25TeXN0ZW0uU3R5bGVNYW5hZ2VyLnNjaGVkdWxlVXBkYXRlKCk7XHJcbiAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH0sIDEwMCk7XHJcbiAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICB9KTtcclxuICAgICAgICB9KTtcclxuICAgICAgfSxcclxuICAgICAgXHJcbiAgICAgIC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cclxuICAgICAgLy8g8J+TnSDsnoXroKUg7LKY66asIOyLnOyKpO2FnFxyXG4gICAgICAvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XHJcbiAgICAgIFxyXG4gICAgICBzZXR1cEhleElucHV0cygpIHtcclxuICAgICAgICAvLyDtjKjrhJAg64K0IEhleCDsnoXroKUgLSA47J6Q66asIO2XpeyKpOy9lOuTnCDsspjrpqxcclxuICAgICAgICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCcucGFuZWwtaGV4LWlucHV0JykuZm9yRWFjaChoZXhJbnB1dCA9PiB7XHJcbiAgICAgICAgICBoZXhJbnB1dC5hZGRFdmVudExpc3RlbmVyKCdpbnB1dCcsIChlKSA9PiB7XHJcbiAgICAgICAgICAgIGNvbnN0IGhleFZhbHVlID0gZS50YXJnZXQudmFsdWUucmVwbGFjZSgnIycsICcnKS50b1VwcGVyQ2FzZSgpO1xyXG4gICAgICAgICAgICBcclxuICAgICAgICAgICAgLy8gOOyekOumrCDtl6XsiqTsvZTrk5zrp4wg6rKA7KadICgjUlJHR0JCQUEg7JmE7KCEIOyeheugpeyLnOyXkOunjClcclxuICAgICAgICAgICAgaWYgKGhleFZhbHVlLmxlbmd0aCA9PT0gOCAmJiAvXlswLTlBLUZdezh9JC8udGVzdChoZXhWYWx1ZSkpIHtcclxuICAgICAgICAgICAgICAvLyBSR0JBIOyngeygkSDsg53shLEgKO2MjOyLsSDsmKTrsoTtl6Trk5wg7JeG7J2MKVxyXG4gICAgICAgICAgICAgIGNvbnN0IHIgPSBwYXJzZUludChoZXhWYWx1ZS5zdWJzdHIoMCwgMiksIDE2KTtcclxuICAgICAgICAgICAgICBjb25zdCBnID0gcGFyc2VJbnQoaGV4VmFsdWUuc3Vic3RyKDIsIDIpLCAxNik7XHJcbiAgICAgICAgICAgICAgY29uc3QgYiA9IHBhcnNlSW50KGhleFZhbHVlLnN1YnN0cig0LCAyKSwgMTYpO1xyXG4gICAgICAgICAgICAgIGNvbnN0IGEgPSBwYXJzZUludChoZXhWYWx1ZS5zdWJzdHIoNiwgMiksIDE2KTsgLy8gOOyekOumrOyXkOyEnCDslYztjIzqsJIg7LaU7LacXHJcbiAgICAgICAgICAgICAgXHJcbiAgICAgICAgICAgICAgY29uc3QgcGlja2VyID0gZS50YXJnZXQuY2xvc2VzdCgnLmN1c3RvbS1jb2xvci1waWNrZXInKTtcclxuICAgICAgICAgICAgICBjb25zdCB0YXJnZXRJZCA9IHBpY2tlci5kYXRhc2V0LnRhcmdldDtcclxuICAgICAgICAgICAgICBjb25zdCBmdWxsSGV4ID0gJyMnICsgaGV4VmFsdWU7IC8vIDjsnpDrpqwg6re464yA66GcIOyCrOyaqVxyXG4gICAgICAgICAgICAgIFxyXG4gICAgICAgICAgICAgIC8vIOyDieyDgSDsl4XrjbDsnbTtirggKOyKrOudvOydtOuNlCDsl4bsnYwpXHJcbiAgICAgICAgICAgICAgXHJcbiAgICAgICAgICAgICAgLy8gM0Qg7LqU67KE7IqkIOyXheuNsOydtO2KuFxyXG4gICAgICAgICAgICAgIGNvbnN0IGNhbnZhczNkID0gcGlja2VyLnF1ZXJ5U2VsZWN0b3IoJy5jb2xvci1jYW52YXMtM2QnKTtcclxuICAgICAgICAgICAgICBpZiAoY2FudmFzM2QpIHtcclxuICAgICAgICAgICAgICAgIGNvbnN0IGN0eDNkID0gY2FudmFzM2QuZ2V0Q29udGV4dCgnMmQnKTtcclxuICAgICAgICAgICAgICAgIE1lY2hhbmljcy5SZW5kZXJDb2xvclNwaGVyZShjdHgzZCwgY2FudmFzM2QuY2xhc3NOYW1lKTtcclxuICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgXHJcbiAgICAgICAgICAgICAgLy8gQ1NTIOuzgOyImCDrsI8gVUkg7JeF642w7J207Yq4XHJcbiAgICAgICAgICAgICAgdGhpcy51cGRhdGVDb2xvcklucHV0cyh0YXJnZXRJZCwge3IsIGcsIGJ9LCBhLCBmdWxsSGV4KTtcclxuICAgICAgICAgICAgICBcclxuICAgICAgICAgICAgICAvLyDshKDtg53rkJwg7IOJ7IOBIOygleuztCDsl4XrjbDsnbTtirhcclxuICAgICAgICAgICAgICB0aGlzLnVwZGF0ZVNlbGVjdGVkQ29sb3JJbmZvKHtyLCBnLCBifSwgYSwgZnVsbEhleCk7XHJcblxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICB9KTtcclxuICAgICAgICB9KTtcclxuICAgICAgICAgICAgfSxcclxuICAgICAgXHJcbiAgICAgIC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cclxuICAgICAgLy8g8J+UhCDsg4Htg5wg7JeF642w7J207Yq4IOyLnOyKpO2FnFxyXG4gICAgICAvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XHJcbiAgICAgIFxyXG4gICAgICB1cGRhdGVTZWxlY3RlZENvbG9ySW5mbyhyZ2IsIGFscGhhLCBoZXhDb2xvcikge1xyXG4gICAgICAgIC8vIOyEoO2DneuQnCDsg4nsg4Eg66+466as67O06riwIOyXheuNsOydtO2KuCAo66qo65OgIGNvbG9yLXBpY2tlci1wYW5lbCDrgrTsnZggcHJldmlldylcclxuICAgICAgICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCcuY29sb3ItcGlja2VyLXBhbmVsIC5waWNrZXItY29sb3ItcHJldmlldycpLmZvckVhY2gocHJldmlldyA9PiB7XHJcbiAgICAgICAgICBwcmV2aWV3LnN0eWxlLmJhY2tncm91bmQgPSBoZXhDb2xvcjtcclxuICAgICAgICB9KTtcclxuICAgICAgICBcclxuICAgICAgICAvLyDshKDtg53rkJwg7IOJ7IOBIOuvuOumrOuztOq4sCDsl4XrjbDsnbTtirggKGluZGV4Lmh0bWzsnZgg7KCV7KCBIOyalOyGjClcclxuICAgICAgICBjb25zdCBjb2xvclByZXZpZXcgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnc2VsZWN0ZWQtY29sb3ItcHJldmlldycpO1xyXG4gICAgICAgIGlmIChjb2xvclByZXZpZXcpIHtcclxuICAgICAgICAgIGNvbG9yUHJldmlldy5zdHlsZS5iYWNrZ3JvdW5kID0gaGV4Q29sb3I7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIFxyXG4gICAgICAgIC8vIOyDieyDgSDsoJXrs7Qg7YWN7Iqk7Yq4IOyXheuNsOydtO2KuCAo66qo65OgIGNvbG9yLXBpY2tlci1wYW5lbCDrgrTsnZgg7JqU7IaM65OkKVxyXG4gICAgICAgIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJy5jb2xvci1waWNrZXItcGFuZWwgI3NlbGVjdGVkLWNvbG9yLWhleCcpLmZvckVhY2goaGV4ID0+IHtcclxuICAgICAgICAgIGhleC50ZXh0Q29udGVudCA9IGhleENvbG9yO1xyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJy5jb2xvci1waWNrZXItcGFuZWwgI3NlbGVjdGVkLWNvbG9yLXJnYicpLmZvckVhY2gocmdiRWwgPT4ge1xyXG4gICAgICAgICAgcmdiRWwudGV4dENvbnRlbnQgPSBgcmdiKCR7cmdiLnJ9LCAke3JnYi5nfSwgJHtyZ2IuYn0pYDtcclxuICAgICAgICB9KTtcclxuICAgICAgICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCcuY29sb3ItcGlja2VyLXBhbmVsICNzZWxlY3RlZC1jb2xvci1oc2wnKS5mb3JFYWNoKGhzbEVsID0+IHtcclxuICAgICAgICAgIGNvbnN0IGhzbFZhbHVlID0gQ29sb3JDb252ZXJ0ZXIucmdiVG9Ic2wocmdiLnIsIHJnYi5nLCByZ2IuYik7XHJcbiAgICAgICAgICBoc2xFbC50ZXh0Q29udGVudCA9IGBoc2woJHtNYXRoLnJvdW5kKGhzbFZhbHVlLmgpfSwgJHtNYXRoLnJvdW5kKGhzbFZhbHVlLnMpfSUsICR7TWF0aC5yb3VuZChoc2xWYWx1ZS5sKX0lKWA7XHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgXHJcbiAgICAgICAgLy8gaW5kZXguaHRtbOydmCDsoJXsoIEg7JqU7IaM65Ok64+EIOyXheuNsOydtO2KuFxyXG4gICAgICAgIGNvbnN0IGNvbG9ySGV4ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3NlbGVjdGVkLWNvbG9yLWhleCcpO1xyXG4gICAgICAgIGNvbnN0IGNvbG9yUmdiID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3NlbGVjdGVkLWNvbG9yLXJnYicpO1xyXG4gICAgICAgIGNvbnN0IGNvbG9ySHNsID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3NlbGVjdGVkLWNvbG9yLWhzbCcpO1xyXG4gICAgICAgIFxyXG4gICAgICAgIGlmIChjb2xvckhleCkgY29sb3JIZXgudGV4dENvbnRlbnQgPSBoZXhDb2xvcjtcclxuICAgICAgICBpZiAoY29sb3JSZ2IpIGNvbG9yUmdiLnRleHRDb250ZW50ID0gYHJnYigke3JnYi5yfSwgJHtyZ2IuZ30sICR7cmdiLmJ9KWA7XHJcbiAgICAgICAgaWYgKGNvbG9ySHNsKSB7XHJcbiAgICAgICAgICBjb25zdCBoc2wgPSBDb2xvckNvbnZlcnRlci5yZ2JUb0hzbChyZ2IuciwgcmdiLmcsIHJnYi5iKTtcclxuICAgICAgICAgIGNvbG9ySHNsLnRleHRDb250ZW50ID0gYGhzbCgke01hdGgucm91bmQoaHNsLmgpfSwgJHtNYXRoLnJvdW5kKGhzbC5zKX0lLCAke01hdGgucm91bmQoaHNsLmwpfSUpYDtcclxuICAgICAgICB9XHJcbiAgICAgIH0sXHJcbiAgICAgIFxyXG4gICAgICB1cGRhdGVDb2xvcklucHV0cyh0YXJnZXRJZCwgcmdiLCBhbHBoYSwgaGV4Q29sb3IpIHtcclxuICAgICAgICBjb25zdCBwaWNrZXIgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKGBbZGF0YS10YXJnZXQ9XCIke3RhcmdldElkfVwiXWApO1xyXG4gICAgICAgIGNvbnN0IGhleElucHV0ID0gcGlja2VyPy5wYXJlbnRFbGVtZW50Py5xdWVyeVNlbGVjdG9yKCcuaGV4LWlucHV0Jyk7XHJcbiAgICAgICAgY29uc3QgcGFuZWxIZXhJbnB1dCA9IHBpY2tlcj8ucXVlcnlTZWxlY3RvcignLnBhbmVsLWhleC1pbnB1dCcpO1xyXG4gICAgICAgIGNvbnN0IGRpc3BsYXkgPSBwaWNrZXI/LnF1ZXJ5U2VsZWN0b3IoJy5jb2xvci1kaXNwbGF5Jyk7XHJcbiAgICAgICAgXHJcbiAgICAgICAgLy8g7Jm467aAIGhleCDsnoXroKUg7JeF642w7J207Yq4XHJcbiAgICAgICAgaWYgKGhleElucHV0KSBoZXhJbnB1dC52YWx1ZSA9IGhleENvbG9yO1xyXG4gICAgICAgIFxyXG4gICAgICAgIC8vIO2MqOuEkCDrgrQgaGV4IOyeheugpSDsl4XrjbDsnbTtirhcclxuICAgICAgICBpZiAocGFuZWxIZXhJbnB1dCkgcGFuZWxIZXhJbnB1dC52YWx1ZSA9IGhleENvbG9yO1xyXG4gICAgICAgIFxyXG4gICAgICAgIC8vIOyEoO2DneuQnCDsg4nsg4Eg7KCV67O064qUIHVwZGF0ZVNlbGVjdGVkQ29sb3JJbmZv7JeQ7IScIOyymOumrFxyXG4gICAgICAgIFxyXG4gICAgICAgIC8vIOy7rOufrCDrlJTsiqTtlIzroIjsnbQg7JeF642w7J207Yq4XHJcbiAgICAgICAgaWYgKGRpc3BsYXkpIGRpc3BsYXkuc3R5bGUuYmFja2dyb3VuZCA9IGhleENvbG9yO1xyXG4gICAgICAgIFxyXG4gICAgICAgIC8vIOyLpOyLnOqwhCBDU1Mg67OA7IiYIOyXheuNsOydtO2KuFxyXG4gICAgICAgIHRoaXMudXBkYXRlQ1NTVmFyaWFibGUodGFyZ2V0SWQsIGhleENvbG9yKTtcclxuICAgICAgICBcclxuICAgICAgICAvLyDrsoTtirwg7KCB7JqpIOuwjyDsl4XrjbDsnbTtirhcclxuICAgICAgICBpZiAodHlwZW9mIEN1c3RvbVBhbGV0dGVNYW5hZ2VyICE9PSAndW5kZWZpbmVkJykge1xyXG4gICAgICAgICAgQ3VzdG9tUGFsZXR0ZU1hbmFnZXIuZ2VuZXJhdGVBbmRBcHBseVBhbGV0dGUoKTtcclxuICAgICAgICB9XHJcbiAgICAgIH0sXHJcbiAgICAgIFxyXG4gICAgICB1cGRhdGVDU1NWYXJpYWJsZShpbnB1dElkLCBoZXhDb2xvcikge1xyXG4gICAgICAgIGNvbnN0IHJvb3QgPSBkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQ7XHJcbiAgICAgICAgXHJcbiAgICAgICAgLy8gaW5wdXQgSUTrpbwgQ1NTIOuzgOyImOuqheycvOuhnCDrp6TtlZEgKExpZ2h0ICsgRGFyaylcclxuICAgICAgICBjb25zdCB2YXJpYWJsZU1hcCA9IHtcclxuICAgICAgICAgIC8vIExpZ2h0IO2FjOuniFxyXG4gICAgICAgICAgJ2xpZ2h0LWNvbnRlbnQtZGVmYXVsdCc6ICctLWN1c3RvbS1jb250ZW50LWNvbG9yLWRlZmF1bHQnLFxyXG4gICAgICAgICAgJ2xpZ2h0LWNvbnRlbnQtcHJlc3NlZCc6ICctLWN1c3RvbS1jb250ZW50LWNvbG9yLXByZXNzZWQnLFxyXG4gICAgICAgICAgJ2xpZ2h0LWNvbnRlbnQtZGlzYWJsZWQnOiAnLS1jdXN0b20tY29udGVudC1jb2xvci1kaXNhYmxlZCcsXHJcbiAgICAgICAgICAnbGlnaHQtYmFja2dyb3VuZC1kZWZhdWx0JzogJy0tY3VzdG9tLWJhY2tncm91bmQtY29sb3ItZGVmYXVsdCcsXHJcbiAgICAgICAgICAnbGlnaHQtYmFja2dyb3VuZC1wcmVzc2VkJzogJy0tY3VzdG9tLWJhY2tncm91bmQtY29sb3ItcHJlc3NlZCcsXHJcbiAgICAgICAgICAnbGlnaHQtYmFja2dyb3VuZC1kaXNhYmxlZCc6ICctLWN1c3RvbS1iYWNrZ3JvdW5kLWNvbG9yLWRpc2FibGVkJyxcclxuICAgICAgICAgICdsaWdodC1ib3JkZXItZGVmYXVsdCc6ICctLWN1c3RvbS1ib3JkZXItY29sb3ItZGVmYXVsdCcsXHJcbiAgICAgICAgICAnbGlnaHQtYm9yZGVyLXByZXNzZWQnOiAnLS1jdXN0b20tYm9yZGVyLWNvbG9yLXByZXNzZWQnLFxyXG4gICAgICAgICAgJ2xpZ2h0LWJvcmRlci1kaXNhYmxlZCc6ICctLWN1c3RvbS1ib3JkZXItY29sb3ItZGlzYWJsZWQnLFxyXG4gICAgICAgICAgLy8gRGFyayDthYzrp4ggKOuzhOuPhCBDU1Mg7KO87J6FIO2VhOyalClcclxuICAgICAgICAgICdkYXJrLWNvbnRlbnQtZGVmYXVsdCc6ICctLWN1c3RvbS1jb250ZW50LWNvbG9yLWRlZmF1bHQnLFxyXG4gICAgICAgICAgJ2RhcmstY29udGVudC1wcmVzc2VkJzogJy0tY3VzdG9tLWNvbnRlbnQtY29sb3ItcHJlc3NlZCcsXHJcbiAgICAgICAgICAnZGFyay1jb250ZW50LWRpc2FibGVkJzogJy0tY3VzdG9tLWNvbnRlbnQtY29sb3ItZGlzYWJsZWQnLFxyXG4gICAgICAgICAgJ2RhcmstYmFja2dyb3VuZC1kZWZhdWx0JzogJy0tY3VzdG9tLWJhY2tncm91bmQtY29sb3ItZGVmYXVsdCcsXHJcbiAgICAgICAgICAnZGFyay1iYWNrZ3JvdW5kLXByZXNzZWQnOiAnLS1jdXN0b20tYmFja2dyb3VuZC1jb2xvci1wcmVzc2VkJyxcclxuICAgICAgICAgICdkYXJrLWJhY2tncm91bmQtZGlzYWJsZWQnOiAnLS1jdXN0b20tYmFja2dyb3VuZC1jb2xvci1kaXNhYmxlZCcsXHJcbiAgICAgICAgICAnZGFyay1ib3JkZXItZGVmYXVsdCc6ICctLWN1c3RvbS1ib3JkZXItY29sb3ItZGVmYXVsdCcsXHJcbiAgICAgICAgICAnZGFyay1ib3JkZXItcHJlc3NlZCc6ICctLWN1c3RvbS1ib3JkZXItY29sb3ItcHJlc3NlZCcsXHJcbiAgICAgICAgICAnZGFyay1ib3JkZXItZGlzYWJsZWQnOiAnLS1jdXN0b20tYm9yZGVyLWNvbG9yLWRpc2FibGVkJ1xyXG4gICAgICAgIH07XHJcbiAgICAgICAgXHJcbiAgICAgICAgY29uc3QgY3NzVmFyaWFibGUgPSB2YXJpYWJsZU1hcFtpbnB1dElkXTtcclxuICAgICAgICBpZiAoY3NzVmFyaWFibGUpIHtcclxuICAgICAgICAgIGlmIChpbnB1dElkLnN0YXJ0c1dpdGgoJ2xpZ2h0LScpKSB7XHJcbiAgICAgICAgICAgIC8vIExpZ2h0IO2FjOuniDogcm9vdOyXkCDsp4HsoJEg7KCB7JqpXHJcbiAgICAgICAgICAgIHJvb3Quc3R5bGUuc2V0UHJvcGVydHkoY3NzVmFyaWFibGUsIGhleENvbG9yKTtcclxuICAgICAgICAgIH0gZWxzZSBpZiAoaW5wdXRJZC5zdGFydHNXaXRoKCdkYXJrLScpKSB7XHJcbiAgICAgICAgICAgIC8vIERhcmsg7YWM66eIOiAuZGFyayDtgbTrnpjsiqTsl5Ag7KCB7JqpIChDU1Mg7KO87J6FKVxyXG4gICAgICAgICAgICBBcHBVdGlscy5DU1NJbmplY3Rvci5pbmplY3QoJ2N1c3RvbS1kYXJrLXZhcmlhYmxlJywgYC5kYXJrIHsgJHtjc3NWYXJpYWJsZX06ICR7aGV4Q29sb3J9OyB9YCwgJ0Rhcmsg7Luk7Iqk7YWAIOuzgOyImCcpO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgICAgXHJcbiAgICAgICAgICAvLyBDU1Mg67OA7IiYIOyXheuNsOydtO2KuCDtm4Qg7JeF642w7J207Yq4ICjshLHriqUg7LWc7KCB7ZmUKVxyXG4gICAgICAgICAgc2V0VGltZW91dCgoKSA9PiB7XHJcbiAgICAgICAgICAgIGlmICh3aW5kb3cuQnV0dG9uU3lzdGVtICYmIHdpbmRvdy5CdXR0b25TeXN0ZW0uU3R5bGVNYW5hZ2VyKSB7XHJcbiAgICAgICAgICAgICAgd2luZG93LkJ1dHRvblN5c3RlbS5TdHlsZU1hbmFnZXIuc2NoZWR1bGVVcGRhdGUoKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgfSwgMTAwKTtcclxuICAgICAgICB9XHJcbiAgICAgIH0sXHJcbiAgICB9LFxyXG4gICAgXHJcbiAgICBpbml0KCkge1xyXG4gICAgICBjb25zb2xlLmxvZygn8J+OqCBbQ3VzdG9tUGFsZXR0ZU1hbmFnZXJdIOy0iOq4sO2ZlCDsi5zsnpEnKTtcclxuICAgICAgdGhpcy5faW5pdERPTUNhY2hlKCk7XHJcbiAgICAgIFxyXG4gICAgICAvLyBDdXN0b21Db2xvclBpY2tlcuuKlCDsponsi5wg7LSI6riw7ZmUICjtjIzroIjtirgg67KE7Yq8IOyDneyEsSlcclxuICAgICAgY29uc29sZS5sb2coJyAg4pSc4pSAIEN1c3RvbUNvbG9yUGlja2VyIOy0iOq4sO2ZlCDspJEuLi4nKTtcclxuICAgICAgdGhpcy5DdXN0b21Db2xvclBpY2tlci5pbml0KCk7XHJcbiAgICAgIGNvbnNvbGUubG9nKCcgIOKchSBDdXN0b21Db2xvclBpY2tlciDstIjquLDtmZQg7JmE66OMJyk7XHJcbiAgICAgIFxyXG4gICAgICAvLyDrj5nsoIEg7IOd7ISxIOyZhOujjCDtm4QgRE9NIOy6kOyLnCDsl4XrjbDsnbTtirggKOuNlCDquLQg64yA6riwIOyLnOqwhClcclxuICAgICAgc2V0VGltZW91dCgoKSA9PiB7XHJcbiAgICAgICAgdGhpcy5fdXBkYXRlRHluYW1pY0RPTUNhY2hlKCk7XHJcbiAgICAgICAgdGhpcy5zZXR1cEV2ZW50TGlzdGVuZXJzKCk7XHJcbiAgICAgICAgdGhpcy5nZW5lcmF0ZUFuZEFwcGx5UGFsZXR0ZSgpO1xyXG4gICAgICB9LCA1MDApOyAvLyAyMDBtcyDihpIgNTAwbXProZwg7Kad6rCAXHJcbiAgICB9LFxyXG4gICAgXHJcbiAgICBfaW5pdERPTUNhY2hlKCkge1xyXG4gICAgICAvLyDsoJXsoIEg7JqU7IaM65Ok66eMIOuovOyggCDsupDsi5xcclxuICAgICAgdGhpcy5fZG9tQ2FjaGUucmVzZXRCdG4gPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcucGFsZXR0ZS1yZXNldC1idG4nKTtcclxuICAgICAgdGhpcy5fZG9tQ2FjaGUudGVzdEJ1dHRvbnMgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCcuYnV0dG9uLmN1c3RvbScpO1xyXG4gICAgICBcclxuICAgICAgLy8g64+Z7KCBIOyDneyEsSDsmpTshozrk6TsnYAg64KY7KSR7JeQIOy6kOyLnFxyXG4gICAgICB0aGlzLl9kb21DYWNoZS5saWdodElucHV0cyA9IHt9O1xyXG4gICAgICB0aGlzLl9kb21DYWNoZS5kYXJrSW5wdXRzID0ge307XHJcbiAgICB9LFxyXG4gICAgXHJcbiAgICAvLyDrj5nsoIEg7IOd7ISx65CcIOyalOyGjOuTpOydhCDsupDsi5ztlZjripQg66mU7ISc65OcXHJcbiAgICBfdXBkYXRlRHluYW1pY0RPTUNhY2hlKCkge1xyXG4gICAgICB0aGlzLl9kb21DYWNoZS5saWdodElucHV0cyA9IHtcclxuICAgICAgICBjb250ZW50RGVmYXVsdDogZG9jdW1lbnQucXVlcnlTZWxlY3RvcignW2RhdGEtdGFyZ2V0PVwibGlnaHQtY29udGVudC1kZWZhdWx0XCJdJyk/LnBhcmVudEVsZW1lbnQ/LnF1ZXJ5U2VsZWN0b3IoJy5oZXgtaW5wdXQnKSxcclxuICAgICAgICBjb250ZW50UHJlc3NlZDogZG9jdW1lbnQucXVlcnlTZWxlY3RvcignW2RhdGEtdGFyZ2V0PVwibGlnaHQtY29udGVudC1wcmVzc2VkXCJdJyk/LnBhcmVudEVsZW1lbnQ/LnF1ZXJ5U2VsZWN0b3IoJy5oZXgtaW5wdXQnKSxcclxuICAgICAgICBjb250ZW50RGlzYWJsZWQ6IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJ1tkYXRhLXRhcmdldD1cImxpZ2h0LWNvbnRlbnQtZGlzYWJsZWRcIl0nKT8ucGFyZW50RWxlbWVudD8ucXVlcnlTZWxlY3RvcignLmhleC1pbnB1dCcpLFxyXG4gICAgICAgIGJhY2tncm91bmREZWZhdWx0OiBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCdbZGF0YS10YXJnZXQ9XCJsaWdodC1iYWNrZ3JvdW5kLWRlZmF1bHRcIl0nKT8ucGFyZW50RWxlbWVudD8ucXVlcnlTZWxlY3RvcignLmhleC1pbnB1dCcpLFxyXG4gICAgICAgIGJhY2tncm91bmRQcmVzc2VkOiBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCdbZGF0YS10YXJnZXQ9XCJsaWdodC1iYWNrZ3JvdW5kLXByZXNzZWRcIl0nKT8ucGFyZW50RWxlbWVudD8ucXVlcnlTZWxlY3RvcignLmhleC1pbnB1dCcpLFxyXG4gICAgICAgIGJhY2tncm91bmREaXNhYmxlZDogZG9jdW1lbnQucXVlcnlTZWxlY3RvcignW2RhdGEtdGFyZ2V0PVwibGlnaHQtYmFja2dyb3VuZC1kaXNhYmxlZFwiXScpPy5wYXJlbnRFbGVtZW50Py5xdWVyeVNlbGVjdG9yKCcuaGV4LWlucHV0JyksXHJcbiAgICAgICAgYm9yZGVyRGVmYXVsdDogZG9jdW1lbnQucXVlcnlTZWxlY3RvcignW2RhdGEtdGFyZ2V0PVwibGlnaHQtYm9yZGVyLWRlZmF1bHRcIl0nKT8ucGFyZW50RWxlbWVudD8ucXVlcnlTZWxlY3RvcignLmhleC1pbnB1dCcpLFxyXG4gICAgICAgIGJvcmRlclByZXNzZWQ6IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJ1tkYXRhLXRhcmdldD1cImxpZ2h0LWJvcmRlci1wcmVzc2VkXCJdJyk/LnBhcmVudEVsZW1lbnQ/LnF1ZXJ5U2VsZWN0b3IoJy5oZXgtaW5wdXQnKSxcclxuICAgICAgICBib3JkZXJEaXNhYmxlZDogZG9jdW1lbnQucXVlcnlTZWxlY3RvcignW2RhdGEtdGFyZ2V0PVwibGlnaHQtYm9yZGVyLWRpc2FibGVkXCJdJyk/LnBhcmVudEVsZW1lbnQ/LnF1ZXJ5U2VsZWN0b3IoJy5oZXgtaW5wdXQnKVxyXG4gICAgICB9O1xyXG4gICAgICB0aGlzLl9kb21DYWNoZS5kYXJrSW5wdXRzID0ge1xyXG4gICAgICAgIGNvbnRlbnREZWZhdWx0OiBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCdbZGF0YS10YXJnZXQ9XCJkYXJrLWNvbnRlbnQtZGVmYXVsdFwiXScpPy5wYXJlbnRFbGVtZW50Py5xdWVyeVNlbGVjdG9yKCcuaGV4LWlucHV0JyksXHJcbiAgICAgICAgY29udGVudFByZXNzZWQ6IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJ1tkYXRhLXRhcmdldD1cImRhcmstY29udGVudC1wcmVzc2VkXCJdJyk/LnBhcmVudEVsZW1lbnQ/LnF1ZXJ5U2VsZWN0b3IoJy5oZXgtaW5wdXQnKSxcclxuICAgICAgICBjb250ZW50RGlzYWJsZWQ6IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJ1tkYXRhLXRhcmdldD1cImRhcmstY29udGVudC1kaXNhYmxlZFwiXScpPy5wYXJlbnRFbGVtZW50Py5xdWVyeVNlbGVjdG9yKCcuaGV4LWlucHV0JyksXHJcbiAgICAgICAgYmFja2dyb3VuZERlZmF1bHQ6IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJ1tkYXRhLXRhcmdldD1cImRhcmstYmFja2dyb3VuZC1kZWZhdWx0XCJdJyk/LnBhcmVudEVsZW1lbnQ/LnF1ZXJ5U2VsZWN0b3IoJy5oZXgtaW5wdXQnKSxcclxuICAgICAgICBiYWNrZ3JvdW5kUHJlc3NlZDogZG9jdW1lbnQucXVlcnlTZWxlY3RvcignW2RhdGEtdGFyZ2V0PVwiZGFyay1iYWNrZ3JvdW5kLXByZXNzZWRcIl0nKT8ucGFyZW50RWxlbWVudD8ucXVlcnlTZWxlY3RvcignLmhleC1pbnB1dCcpLFxyXG4gICAgICAgIGJhY2tncm91bmREaXNhYmxlZDogZG9jdW1lbnQucXVlcnlTZWxlY3RvcignW2RhdGEtdGFyZ2V0PVwiZGFyay1iYWNrZ3JvdW5kLWRpc2FibGVkXCJdJyk/LnBhcmVudEVsZW1lbnQ/LnF1ZXJ5U2VsZWN0b3IoJy5oZXgtaW5wdXQnKSxcclxuICAgICAgICBib3JkZXJEZWZhdWx0OiBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCdbZGF0YS10YXJnZXQ9XCJkYXJrLWJvcmRlci1kZWZhdWx0XCJdJyk/LnBhcmVudEVsZW1lbnQ/LnF1ZXJ5U2VsZWN0b3IoJy5oZXgtaW5wdXQnKSxcclxuICAgICAgICBib3JkZXJQcmVzc2VkOiBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCdbZGF0YS10YXJnZXQ9XCJkYXJrLWJvcmRlci1wcmVzc2VkXCJdJyk/LnBhcmVudEVsZW1lbnQ/LnF1ZXJ5U2VsZWN0b3IoJy5oZXgtaW5wdXQnKSxcclxuICAgICAgICBib3JkZXJEaXNhYmxlZDogZG9jdW1lbnQucXVlcnlTZWxlY3RvcignW2RhdGEtdGFyZ2V0PVwiZGFyay1ib3JkZXItZGlzYWJsZWRcIl0nKT8ucGFyZW50RWxlbWVudD8ucXVlcnlTZWxlY3RvcignLmhleC1pbnB1dCcpXHJcbiAgICAgIH07XHJcbiAgICB9LFxyXG4gICAgXHJcbiAgICBzZXR1cEV2ZW50TGlzdGVuZXJzKCkge1xyXG4gICAgICBPYmplY3QuZW50cmllcyh0aGlzLl9kb21DYWNoZS5saWdodElucHV0cykuZm9yRWFjaCgoW2tleSwgaW5wdXRdKSA9PiB7XHJcbiAgICAgICAgaWYgKGlucHV0KSB7XHJcbiAgICAgICAgICBpbnB1dC5hZGRFdmVudExpc3RlbmVyKCdpbnB1dCcsICgpID0+IHtcclxuICAgICAgICAgICAgdGhpcy5nZW5lcmF0ZUFuZEFwcGx5UGFsZXR0ZSgpOyAvLyDsponsi5wg7Iuk7Iuc6rCEIOyggeyaqSFcclxuICAgICAgICAgIH0pO1xyXG4gICAgICAgIH1cclxuICAgICAgfSk7XHJcbiAgICAgIE9iamVjdC5lbnRyaWVzKHRoaXMuX2RvbUNhY2hlLmRhcmtJbnB1dHMpLmZvckVhY2goKFtrZXksIGlucHV0XSkgPT4ge1xyXG4gICAgICAgIGlmIChpbnB1dCkge1xyXG4gICAgICAgICAgaW5wdXQuYWRkRXZlbnRMaXN0ZW5lcignaW5wdXQnLCAoKSA9PiB7XHJcbiAgICAgICAgICAgIHRoaXMuZ2VuZXJhdGVBbmRBcHBseVBhbGV0dGUoKTsgLy8g7KaJ7IucIOyLpOyLnOqwhCDsoIHsmqkhXHJcbiAgICAgICAgICB9KTtcclxuICAgICAgICB9XHJcbiAgICAgIH0pO1xyXG4gICAgICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCcuaGV4LWlucHV0JykuZm9yRWFjaChoZXhJbnB1dCA9PiB7XHJcbiAgICAgICAgaGV4SW5wdXQuYWRkRXZlbnRMaXN0ZW5lcignaW5wdXQnLCAoZSkgPT4ge1xyXG4gICAgICAgICAgY29uc3QgY29sb3JJbnB1dCA9IGUudGFyZ2V0LnByZXZpb3VzRWxlbWVudFNpYmxpbmc7XHJcbiAgICAgICAgICBpZiAoY29sb3JJbnB1dCAmJiBjb2xvcklucHV0LnR5cGUgPT09ICdjb2xvcicpIHtcclxuICAgICAgICAgICAgY29uc3QgaGV4VmFsdWUgPSBlLnRhcmdldC52YWx1ZS5yZXBsYWNlKCcjJywgJycpLnN1YnN0cmluZygwLCA2KTtcclxuICAgICAgICAgICAgaWYgKGhleFZhbHVlLmxlbmd0aCA9PT0gNikge1xyXG4gICAgICAgICAgICAgIGNvbG9ySW5wdXQudmFsdWUgPSAnIycgKyBoZXhWYWx1ZTtcclxuICAgICAgICAgICAgICB0aGlzLnVwZGF0ZVByZXZpZXcoKTtcclxuICAgICAgICAgICAgICB0aGlzLmdlbmVyYXRlQW5kQXBwbHlQYWxldHRlKCk7IC8vIOymieyLnCDsi6Tsi5zqsIQg7KCB7JqpIVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcbiAgICAgIH0pO1xyXG4gICAgICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCdpbnB1dFt0eXBlPVwiY29sb3JcIl0nKS5mb3JFYWNoKGNvbG9ySW5wdXQgPT4ge1xyXG4gICAgICAgIGNvbG9ySW5wdXQuYWRkRXZlbnRMaXN0ZW5lcignaW5wdXQnLCAoZSkgPT4ge1xyXG4gICAgICAgICAgY29uc3QgaGV4SW5wdXQgPSBlLnRhcmdldC5uZXh0RWxlbWVudFNpYmxpbmc7XHJcbiAgICAgICAgICBpZiAoaGV4SW5wdXQgJiYgaGV4SW5wdXQuY2xhc3NMaXN0LmNvbnRhaW5zKCdoZXgtaW5wdXQnKSkge1xyXG4gICAgICAgICAgICBjb25zdCBhbHBoYSA9IGUudGFyZ2V0LmlkLmluY2x1ZGVzKCdkaXNhYmxlZCcpICYmIGUudGFyZ2V0LmlkLmluY2x1ZGVzKCdiYWNrZ3JvdW5kJykgPyAnMDAnIDogJ0ZGJztcclxuICAgICAgICAgICAgaGV4SW5wdXQudmFsdWUgPSBlLnRhcmdldC52YWx1ZSArIGFscGhhO1xyXG4gICAgICAgICAgICB0aGlzLmdlbmVyYXRlQW5kQXBwbHlQYWxldHRlKCk7IC8vIOymieyLnCDsi6Tsi5zqsIQg7KCB7JqpIVxyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG4gICAgICB9KTtcclxuICAgICAgaWYgKHRoaXMuX2RvbUNhY2hlLnJlc2V0QnRuKSB7XHJcbiAgICAgICAgdGhpcy5fZG9tQ2FjaGUucmVzZXRCdG4uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoKSA9PiB7XHJcbiAgICAgICAgICB0aGlzLnJlc2V0VG9EZWZhdWx0cygpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgICB9XHJcbiAgICB9LFxyXG4gICAgXHJcbiAgICBcclxuICAgIGdlbmVyYXRlQW5kQXBwbHlQYWxldHRlKCkge1xyXG4gICAgICBjb25zdCByb290ID0gZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50O1xyXG4gICAgICBcclxuICAgICAgLy8gTGlnaHQg7YWM66eIIENTUyDrs4DsiJgg7JeF642w7J207Yq4ICg56rCcKVxyXG4gICAgICBjb25zdCBsaWdodE1hcHBpbmdzID0ge1xyXG4gICAgICAgICdjb250ZW50RGVmYXVsdCc6ICctLWN1c3RvbS1jb250ZW50LWNvbG9yLWRlZmF1bHQnLFxyXG4gICAgICAgICdjb250ZW50UHJlc3NlZCc6ICctLWN1c3RvbS1jb250ZW50LWNvbG9yLXByZXNzZWQnLCBcclxuICAgICAgICAnY29udGVudERpc2FibGVkJzogJy0tY3VzdG9tLWNvbnRlbnQtY29sb3ItZGlzYWJsZWQnLFxyXG4gICAgICAgICdiYWNrZ3JvdW5kRGVmYXVsdCc6ICctLWN1c3RvbS1iYWNrZ3JvdW5kLWNvbG9yLWRlZmF1bHQnLFxyXG4gICAgICAgICdiYWNrZ3JvdW5kUHJlc3NlZCc6ICctLWN1c3RvbS1iYWNrZ3JvdW5kLWNvbG9yLXByZXNzZWQnLFxyXG4gICAgICAgICdiYWNrZ3JvdW5kRGlzYWJsZWQnOiAnLS1jdXN0b20tYmFja2dyb3VuZC1jb2xvci1kaXNhYmxlZCcsXHJcbiAgICAgICAgJ2JvcmRlckRlZmF1bHQnOiAnLS1jdXN0b20tYm9yZGVyLWNvbG9yLWRlZmF1bHQnLFxyXG4gICAgICAgICdib3JkZXJQcmVzc2VkJzogJy0tY3VzdG9tLWJvcmRlci1jb2xvci1wcmVzc2VkJyxcclxuICAgICAgICAnYm9yZGVyRGlzYWJsZWQnOiAnLS1jdXN0b20tYm9yZGVyLWNvbG9yLWRpc2FibGVkJ1xyXG4gICAgICB9O1xyXG4gICAgICBcclxuICAgICAgT2JqZWN0LmVudHJpZXMobGlnaHRNYXBwaW5ncykuZm9yRWFjaCgoW2lucHV0S2V5LCBjc3NWYXJdKSA9PiB7XHJcbiAgICAgICAgY29uc3QgaW5wdXQgPSB0aGlzLl9kb21DYWNoZS5saWdodElucHV0c1tpbnB1dEtleV07XHJcbiAgICAgICAgaWYgKGlucHV0Py5uZXh0RWxlbWVudFNpYmxpbmc/LnZhbHVlKSB7XHJcbiAgICAgICAgICByb290LnN0eWxlLnNldFByb3BlcnR5KGNzc1ZhciwgaW5wdXQubmV4dEVsZW1lbnRTaWJsaW5nLnZhbHVlKTtcclxuICAgICAgICB9XHJcbiAgICAgIH0pO1xyXG4gICAgICBcclxuICAgICAgLy8gRGFyayDthYzrp4ggQ1NTIOuzgOyImCDsl4XrjbDsnbTtirggKDnqsJwpIC0g67OE64+EIOyKpO2DgOydvCDsi5ztirgg7ZWE7JqUXHJcbiAgICAgIGNvbnN0IGRhcmtNYXBwaW5ncyA9IHtcclxuICAgICAgICAnY29udGVudERlZmF1bHQnOiAnLS1jdXN0b20tY29udGVudC1jb2xvci1kZWZhdWx0JyxcclxuICAgICAgICAnY29udGVudFByZXNzZWQnOiAnLS1jdXN0b20tY29udGVudC1jb2xvci1wcmVzc2VkJyxcclxuICAgICAgICAnY29udGVudERpc2FibGVkJzogJy0tY3VzdG9tLWNvbnRlbnQtY29sb3ItZGlzYWJsZWQnLCBcclxuICAgICAgICAnYmFja2dyb3VuZERlZmF1bHQnOiAnLS1jdXN0b20tYmFja2dyb3VuZC1jb2xvci1kZWZhdWx0JyxcclxuICAgICAgICAnYmFja2dyb3VuZFByZXNzZWQnOiAnLS1jdXN0b20tYmFja2dyb3VuZC1jb2xvci1wcmVzc2VkJyxcclxuICAgICAgICAnYmFja2dyb3VuZERpc2FibGVkJzogJy0tY3VzdG9tLWJhY2tncm91bmQtY29sb3ItZGlzYWJsZWQnLFxyXG4gICAgICAgICdib3JkZXJEZWZhdWx0JzogJy0tY3VzdG9tLWJvcmRlci1jb2xvci1kZWZhdWx0JyxcclxuICAgICAgICAnYm9yZGVyUHJlc3NlZCc6ICctLWN1c3RvbS1ib3JkZXItY29sb3ItcHJlc3NlZCcsXHJcbiAgICAgICAgJ2JvcmRlckRpc2FibGVkJzogJy0tY3VzdG9tLWJvcmRlci1jb2xvci1kaXNhYmxlZCdcclxuICAgICAgfTtcclxuICAgICAgXHJcbiAgICAgIGxldCBkYXJrQ1NTID0gJyc7XHJcbiAgICAgIE9iamVjdC5lbnRyaWVzKGRhcmtNYXBwaW5ncykuZm9yRWFjaCgoW2lucHV0S2V5LCBjc3NWYXJdKSA9PiB7XHJcbiAgICAgICAgY29uc3QgaW5wdXQgPSB0aGlzLl9kb21DYWNoZS5kYXJrSW5wdXRzW2lucHV0S2V5XTtcclxuICAgICAgICBpZiAoaW5wdXQ/Lm5leHRFbGVtZW50U2libGluZz8udmFsdWUpIHtcclxuICAgICAgICAgIGRhcmtDU1MgKz0gYCAgJHtjc3NWYXJ9OiAke2lucHV0Lm5leHRFbGVtZW50U2libGluZy52YWx1ZX07XFxuYDtcclxuICAgICAgICB9XHJcbiAgICAgIH0pO1xyXG4gICAgICBcclxuICAgICAgaWYgKGRhcmtDU1MpIHtcclxuICAgICAgICBBcHBVdGlscy5DU1NJbmplY3Rvci5pbmplY3QoJ2N1c3RvbS1kYXJrLXRoZW1lJywgYC5kYXJrIHtcXG4ke2RhcmtDU1N9fWAsICdEYXJrIO2FjOuniCDsu6TsiqTthYAg67OA7IiYJyk7XHJcbiAgICAgIH1cclxuICAgICAgXHJcbiAgICAgIHRoaXMuYXBwbHlUb1Rlc3RCdXR0b25zKCk7XHJcbiAgICAgIFxyXG4gICAgICAvLyDsu6TsiqTthYAg7YyU66CI7Yq4IOuzgOqyvSDtm4Qg6rCV7KCcIOyXheuNsOydtO2KuCAo7ISx64qlIOy1nOygge2ZlClcclxuICAgICAgc2V0VGltZW91dCgoKSA9PiB7XHJcbiAgICAgICAgaWYgKHdpbmRvdy5CdXR0b25TeXN0ZW0gJiYgd2luZG93LkJ1dHRvblN5c3RlbS5TdHlsZU1hbmFnZXIpIHtcclxuICAgICAgICAgIHdpbmRvdy5CdXR0b25TeXN0ZW0uU3R5bGVNYW5hZ2VyLnNjaGVkdWxlVXBkYXRlKCk7XHJcbiAgICAgICAgfVxyXG4gICAgICB9LCAyMDApO1xyXG4gICAgfSxcclxuICAgIFxyXG4gICAgYXBwbHlUb1Rlc3RCdXR0b25zKCkge1xyXG4gICAgICBjb25zdCBwYWxldHRlTmFtZSA9IHRoaXMuQ1VTVE9NX1BBTEVUVEVfTkFNRTtcclxuICAgICAgdGhpcy5fZG9tQ2FjaGUudGVzdEJ1dHRvbnMuZm9yRWFjaChidXR0b24gPT4ge1xyXG4gICAgICAgIGNvbnN0IGNsYXNzTGlzdCA9IEFycmF5LmZyb20oYnV0dG9uLmNsYXNzTGlzdCk7XHJcbiAgICAgICAgY29uc3QgZXhjbHVkZWRDbGFzc2VzID0gWydidXR0b24nLCAncHJlc3NlZCcsICd0b2dnbGUnLCAnZHluYW1pYyddO1xyXG4gICAgICAgIGNvbnN0IG9sZFBhbGV0dGUgPSBjbGFzc0xpc3QuZmluZChjbHMgPT4gIWV4Y2x1ZGVkQ2xhc3Nlcy5pbmNsdWRlcyhjbHMpKTtcclxuICAgICAgICBpZiAob2xkUGFsZXR0ZSAmJiBvbGRQYWxldHRlICE9PSBwYWxldHRlTmFtZSkge1xyXG4gICAgICAgICAgYnV0dG9uLmNsYXNzTGlzdC5yZW1vdmUob2xkUGFsZXR0ZSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmICghYnV0dG9uLmNsYXNzTGlzdC5jb250YWlucyhwYWxldHRlTmFtZSkpIHtcclxuICAgICAgICAgIGJ1dHRvbi5jbGFzc0xpc3QuYWRkKHBhbGV0dGVOYW1lKTtcclxuICAgICAgICB9XHJcbiAgICAgIH0pO1xyXG4gICAgfSxcclxuICAgIFxyXG4gICAgcmVzZXRUb0RlZmF1bHRzKCkge1xyXG4gICAgICAvLyDrj5nsoIEg7IOd7ISx65CcIERPTSDsmpTshozrk6Qg64uk7IucIOy6kOyLnFxyXG4gICAgICB0aGlzLl91cGRhdGVEeW5hbWljRE9NQ2FjaGUoKTtcclxuICAgICAgXHJcbiAgICAgIC8vIO2YhOyerCDthYzrp4gg7IOB7YOcIO2ZleyduFxyXG4gICAgICBjb25zdCBpc0RhcmtUaGVtZSA9IGRvY3VtZW50LmRvY3VtZW50RWxlbWVudC5jbGFzc0xpc3QuY29udGFpbnMoJ2RhcmsnKTtcclxuICAgICAgXHJcbiAgICAgIC8vIExpZ2h0IO2FjOuniCDquLDrs7jqsJIgKFByaW1hcnkxIO2MlOugiO2KuCDquLDrsJgpXHJcbiAgICAgIGNvbnN0IGxpZ2h0RGVmYXVsdHMgPSB7XHJcbiAgICAgICAgY29udGVudERlZmF1bHQ6IFsncmdiYSgyNTUsIDI1NSwgMjU1LCAxKScsICcjRkZGRkZGRkYnXSwgICAgLy8gY29sb3ItZ3JheS0xNFxyXG4gICAgICAgIGNvbnRlbnRQcmVzc2VkOiBbJ3JnYmEoMTQwLCA4MywgNDQsIDEpJywgJyM4QzUzMkNGRiddLCAgICAvLyBjb2xvci1icm93bi0wMlxyXG4gICAgICAgIGNvbnRlbnREaXNhYmxlZDogWydyZ2JhKDE0MCwgODMsIDQ0LCAxKScsICcjOEM1MzJDRkYnXSwgICAvLyBjb2xvci1icm93bi0wMlxyXG4gICAgICAgIGJhY2tncm91bmREZWZhdWx0OiBbJ3JnYmEoMTY0LCAxMDUsIDYzLCAxKScsICcjQTQ2OTNGRkYnXSwgLy8gY29sb3ItYnJvd24tMDNcclxuICAgICAgICBiYWNrZ3JvdW5kUHJlc3NlZDogWydyZ2JhKDIzOCwgMjIwLCAyMTAsIDEpJywgJyNFRURDRDJGRiddLCAvLyBjb2xvci1icm93bi0wNlxyXG4gICAgICAgIGJhY2tncm91bmREaXNhYmxlZDogWyd0cmFuc3BhcmVudCcsICd0cmFuc3BhcmVudCddLCAvLyB0cmFuc3BhcmVudFxyXG4gICAgICAgIGJvcmRlckRlZmF1bHQ6IFsncmdiYSgxNjQsIDEwNSwgNjMsIDEpJywgJyNBNDY5M0ZGRiddLCAgICAgLy8gY29sb3ItYnJvd24tMDNcclxuICAgICAgICBib3JkZXJQcmVzc2VkOiBbJ3JnYmEoMTQwLCA4MywgNDQsIDEpJywgJyM4QzUzMkNGRiddLCAgICAgLy8gY29sb3ItYnJvd24tMDJcclxuICAgICAgICBib3JkZXJEaXNhYmxlZDogWydyZ2JhKDE0MCwgODMsIDQ0LCAxKScsICcjOEM1MzJDRkYnXSAgICAgLy8gY29sb3ItYnJvd24tMDJcclxuICAgICAgfTtcclxuICAgICAgXHJcbiAgICAgIC8vIERhcmsg7YWM66eIIOq4sOuzuOqwkiAoUHJpbWFyeTEg7YyU66CI7Yq4IOq4sOuwmClcclxuICAgICAgY29uc3QgZGFya0RlZmF1bHRzID0ge1xyXG4gICAgICAgIGNvbnRlbnREZWZhdWx0OiBbJ3JnYmEoMCwgMCwgMCwgMSknLCAnIzAwMDAwMEZGJ10sICAgIC8vIGNvbG9yLWdyYXktMDFcclxuICAgICAgICBjb250ZW50UHJlc3NlZDogWydyZ2JhKDI1NSwgMjM5LCAxMjgsIDEpJywgJyNGRkVGODBGRiddLCAgICAvLyBjb2xvci15ZWxsb3ctMDRcclxuICAgICAgICBjb250ZW50RGlzYWJsZWQ6IFsncmdiYSgyNTUsIDIyNSwgMCwgMSknLCAnI0ZGRTEwMEZGJ10sICAgLy8gY29sb3IteWVsbG93LTAzXHJcbiAgICAgICAgYmFja2dyb3VuZERlZmF1bHQ6IFsncmdiYSgyNTUsIDIyNSwgMCwgMSknLCAnI0ZGRTEwMEZGJ10sIC8vIGNvbG9yLXllbGxvdy0wM1xyXG4gICAgICAgIGJhY2tncm91bmRQcmVzc2VkOiBbJ3JnYmEoMzYsIDMxLCAwLCAxKScsICcjMjQxRjAwRkYnXSwgLy8gY29sb3IteWVsbG93LTAxXHJcbiAgICAgICAgYmFja2dyb3VuZERpc2FibGVkOiBbJ3RyYW5zcGFyZW50JywgJ3RyYW5zcGFyZW50J10sIC8vIHRyYW5zcGFyZW50XHJcbiAgICAgICAgYm9yZGVyRGVmYXVsdDogWydyZ2JhKDI1NSwgMjI1LCAwLCAxKScsICcjRkZFMTAwRkYnXSwgICAgIC8vIGNvbG9yLXllbGxvdy0wM1xyXG4gICAgICAgIGJvcmRlclByZXNzZWQ6IFsncmdiYSgyNTUsIDIzOSwgMTI4LCAxKScsICcjRkZFRjgwRkYnXSwgICAgIC8vIGNvbG9yLXllbGxvdy0wNFxyXG4gICAgICAgIGJvcmRlckRpc2FibGVkOiBbJ3JnYmEoMjU1LCAyMjUsIDAsIDEpJywgJyNGRkUxMDBGRiddICAgICAvLyBjb2xvci15ZWxsb3ctMDNcclxuICAgICAgfTtcclxuICAgICAgXHJcbiAgICAgIC8vIO2YhOyerCDthYzrp4jsl5Ag65Sw6528IO2VtOuLuSDquLDrs7jqsJLrp4wg7KCB7JqpXHJcbiAgICAgIGNvbnN0IGN1cnJlbnREZWZhdWx0cyA9IGlzRGFya1RoZW1lID8gZGFya0RlZmF1bHRzIDogbGlnaHREZWZhdWx0cztcclxuICAgICAgY29uc3QgaW5wdXRDYWNoZSA9IGlzRGFya1RoZW1lID8gdGhpcy5fZG9tQ2FjaGUuZGFya0lucHV0cyA6IHRoaXMuX2RvbUNhY2hlLmxpZ2h0SW5wdXRzO1xyXG4gICAgICBjb25zdCB0aGVtZVByZWZpeCA9IGlzRGFya1RoZW1lID8gJ2RhcmsnIDogJ2xpZ2h0JztcclxuICAgICAgXHJcbiAgICAgIE9iamVjdC5lbnRyaWVzKGN1cnJlbnREZWZhdWx0cykuZm9yRWFjaCgoW2tleSwgW2NvbG9yVmFsdWUsIGhleFZhbHVlXV0pID0+IHtcclxuICAgICAgICBjb25zdCBpbnB1dCA9IGlucHV0Q2FjaGVba2V5XTtcclxuICAgICAgICBpZiAoaW5wdXQpIHtcclxuICAgICAgICAgIGlucHV0LnZhbHVlID0gaGV4VmFsdWU7XHJcbiAgICAgICAgICBcclxuICAgICAgICAgIC8vIDNEIOyDieyDgSDshKDtg53quLAgVUkg7JeF642w7J207Yq4XHJcbiAgICAgICAgICBjb25zdCB0YXJnZXRJZCA9IGAke3RoZW1lUHJlZml4fS0ke2tleS5yZXBsYWNlKC8oW0EtWl0pL2csICctJDEnKS50b0xvd2VyQ2FzZSgpfWA7XHJcbiAgICAgICAgICBjb25zdCBwaWNrZXIgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKGBbZGF0YS10YXJnZXQ9XCIke3RhcmdldElkfVwiXWApO1xyXG4gICAgICAgICAgaWYgKHBpY2tlcikge1xyXG4gICAgICAgICAgICBjb25zdCBjb2xvckRpc3BsYXkgPSBwaWNrZXIucXVlcnlTZWxlY3RvcignLmNvbG9yLWRpc3BsYXknKTtcclxuICAgICAgICAgICAgY29uc3QgcGFuZWxIZXhJbnB1dCA9IHBpY2tlci5xdWVyeVNlbGVjdG9yKCcucGFuZWwtaGV4LWlucHV0Jyk7XHJcbiAgICAgICAgICAgIGlmIChjb2xvckRpc3BsYXkpIGNvbG9yRGlzcGxheS5zdHlsZS5iYWNrZ3JvdW5kID0gaGV4VmFsdWU7XHJcbiAgICAgICAgICAgIGlmIChwYW5lbEhleElucHV0KSBwYW5lbEhleElucHV0LnZhbHVlID0gaGV4VmFsdWU7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgICBcclxuICAgICAgICAgIC8vIENTUyDrs4DsiJgg7KeB7KCRIOyXheuNsOydtO2KuFxyXG4gICAgICAgICAgdGhpcy5DdXN0b21Db2xvclBpY2tlci51cGRhdGVDU1NWYXJpYWJsZSh0YXJnZXRJZCwgaGV4VmFsdWUpO1xyXG4gICAgICAgICAgXHJcbiAgICAgICAgICAvLyBpbnB1dCDsnbTrsqTtirgg6rCV7KCcIO2KuOumrOqxsFxyXG4gICAgICAgICAgaW5wdXQuZGlzcGF0Y2hFdmVudChuZXcgRXZlbnQoJ2lucHV0JywgeyBidWJibGVzOiB0cnVlIH0pKTtcclxuICAgICAgICB9XHJcbiAgICAgIH0pO1xyXG4gICAgICBcclxuICAgICAgLy8gM0Qg6rWs7LK065Ok7J2EIOq4sOuzuCDsnITsuZjroZwg7LSI6riw7ZmUXHJcbiAgICAgIHRoaXMucmVzZXQzRFNwaGVyZXNUb0RlZmF1bHRzKCk7XHJcbiAgICAgIFxyXG4gICAgICAvLyDqsJXsoJzroZwg7YyU66CI7Yq4IOyggeyaqSDrsI8g67KE7Yq8IOyXheuNsOydtO2KuFxyXG4gICAgICB0aGlzLmdlbmVyYXRlQW5kQXBwbHlQYWxldHRlKCk7XHJcbiAgICAgIFxyXG4gICAgICAvLyDrsoTtirwg7Iuc7Iqk7YWcIOqwleygnCDsl4XrjbDsnbTtirhcclxuICAgICAgaWYgKHR5cGVvZiBCdXR0b25TeXN0ZW0gIT09ICd1bmRlZmluZWQnICYmIEJ1dHRvblN5c3RlbS5TdHlsZU1hbmFnZXIpIHtcclxuICAgICAgICBCdXR0b25TeXN0ZW0uU3R5bGVNYW5hZ2VyLnNjaGVkdWxlVXBkYXRlKCk7XHJcbiAgICAgIH1cclxuICAgICAgXHJcbiAgICAgIC8vIERPTSDsiqTtg4Dsnbwg6rCV7KCcIOyDiOuhnOqzoOy5qFxyXG4gICAgICByZXF1ZXN0QW5pbWF0aW9uRnJhbWUoKCkgPT4ge1xyXG4gICAgICAgIGNvbnN0IGN1c3RvbUJ1dHRvbnMgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCcuYnV0dG9uLmN1c3RvbScpO1xyXG4gICAgICAgIGN1c3RvbUJ1dHRvbnMuZm9yRWFjaChidXR0b24gPT4ge1xyXG4gICAgICAgICAgLy8g6rCV7KCcIOumrO2UjOuhnOyasOuhnCDsiqTtg4Dsnbwg7J6s6rOE7IKwXHJcbiAgICAgICAgICBidXR0b24ub2Zmc2V0SGVpZ2h0O1xyXG4gICAgICAgICAgY29uc3QgYmFja2dyb3VuZCA9IGJ1dHRvbi5xdWVyeVNlbGVjdG9yKCcuYmFja2dyb3VuZC5keW5hbWljJyk7XHJcbiAgICAgICAgICBpZiAoYmFja2dyb3VuZCkge1xyXG4gICAgICAgICAgICBiYWNrZ3JvdW5kLm9mZnNldEhlaWdodDtcclxuICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuICAgICAgfSk7XHJcbiAgICB9LFxyXG4gICAgXHJcbiAgICAvLyAzRCDqtazssrTrk6TsnYQg6riw67O4IOychOy5mOuhnCDstIjquLDtmZTtlZjripQg66mU7ISc65OcXHJcbiAgICByZXNldDNEU3BoZXJlc1RvRGVmYXVsdHMoKSB7XHJcbiAgICAgIC8vIOuqqOuToCAzRCDsg4nsg4Eg7ISg7YOd6riw66W8IOq4sOuzuCDsnITsuZjroZwg7LSI6riw7ZmUXHJcbiAgICAgIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJy5jb2xvci1jYW52YXMtM2QnKS5mb3JFYWNoKChjYW52YXMsIGluZGV4KSA9PiB7XHJcbiAgICAgICAgY29uc3QgcGlja2VyID0gY2FudmFzLmNsb3Nlc3QoJy5jdXN0b20tY29sb3ItcGlja2VyJyk7XHJcbiAgICAgICAgaWYgKCFwaWNrZXIpIHJldHVybjtcclxuICAgICAgICBcclxuICAgICAgICBjb25zdCB0YXJnZXRJZCA9IHBpY2tlci5kYXRhc2V0LnRhcmdldDtcclxuICAgICAgICBjb25zdCBwYW5lbEhleElucHV0ID0gcGlja2VyLnF1ZXJ5U2VsZWN0b3IoJy5wYW5lbC1oZXgtaW5wdXQnKTtcclxuICAgICAgICBcclxuICAgICAgICBpZiAocGFuZWxIZXhJbnB1dCAmJiBwYW5lbEhleElucHV0LnZhbHVlKSB7XHJcbiAgICAgICAgICBjb25zdCBoZXhWYWx1ZSA9IHBhbmVsSGV4SW5wdXQudmFsdWUucmVwbGFjZSgnIycsICcnKS50b1VwcGVyQ2FzZSgpO1xyXG4gICAgICAgICAgXHJcbiAgICAgICAgICAvLyA47J6Q66asIO2XpeyKpOy9lOuTnOyduCDqsr3smrDsl5Drp4wg7LKY66asXHJcbiAgICAgICAgICBpZiAoaGV4VmFsdWUubGVuZ3RoID09PSA4ICYmIC9eWzAtOUEtRl17OH0kLy50ZXN0KGhleFZhbHVlKSkge1xyXG4gICAgICAgICAgICAvLyBSR0JBIOyngeygkSDsg53shLEgKO2MjOyLsSDsmKTrsoTtl6Trk5wg7JeG7J2MKVxyXG4gICAgICAgICAgICBjb25zdCByID0gcGFyc2VJbnQoaGV4VmFsdWUuc3Vic3RyKDAsIDIpLCAxNik7XHJcbiAgICAgICAgICAgIGNvbnN0IGcgPSBwYXJzZUludChoZXhWYWx1ZS5zdWJzdHIoMiwgMiksIDE2KTtcclxuICAgICAgICAgICAgY29uc3QgYiA9IHBhcnNlSW50KGhleFZhbHVlLnN1YnN0cig0LCAyKSwgMTYpO1xyXG4gICAgICAgICAgICBcclxuICAgICAgICAgICAgLy8g6rWs7LK0IOychOy5mCDssL7quLAg67CPIOydtOuPmSAo7Ya17ZWpIOyDge2DnCDsgqzsmqkpXHJcbiAgICAgICAgICAgIGNvbnN0IHBvc2l0aW9uID0gTWVjaGFuaWNzLmNvbG9yVG9Db29yZGluYXRlKCcjJyArIGhleFZhbHVlLnN1YnN0cigwLCA2KSk7XHJcbiAgICAgICAgICAgIGlmIChwb3NpdGlvbikge1xyXG4gICAgICAgICAgICAgIC8vIO2Gte2VqSDsg4nqtazssrQg7IOB7YOc66GcIOyngeygkSDtmozsoIRcclxuICAgICAgICAgICAgICBjb25zdCB0YXJnZXRWZWN0b3IgPSBNZWNoYW5pY3Muc3BoZXJpY2FsVG9DYXJ0ZXNpYW4oMSwgcG9zaXRpb24udGhldGEsIHBvc2l0aW9uLnBoaSk7XHJcbiAgICAgICAgICAgICAgY29uc3QgY3VycmVudFZlY3RvciA9IFswLCAwLCAxXTsgLy8g6riw67O4IOykkeyLrOygkFxyXG4gICAgICAgICAgICAgIFxyXG4gICAgICAgICAgICAgIC8vIO2ajOyghCDstpXqs7wg6rCB64+EIOqzhOyCsFxyXG4gICAgICAgICAgICAgIGNvbnN0IGF4aXMgPSBbXHJcbiAgICAgICAgICAgICAgICBjdXJyZW50VmVjdG9yWzFdICogdGFyZ2V0VmVjdG9yWzJdIC0gY3VycmVudFZlY3RvclsyXSAqIHRhcmdldFZlY3RvclsxXSxcclxuICAgICAgICAgICAgICAgIGN1cnJlbnRWZWN0b3JbMl0gKiB0YXJnZXRWZWN0b3JbMF0gLSBjdXJyZW50VmVjdG9yWzBdICogdGFyZ2V0VmVjdG9yWzJdLFxyXG4gICAgICAgICAgICAgICAgY3VycmVudFZlY3RvclswXSAqIHRhcmdldFZlY3RvclsxXSAtIGN1cnJlbnRWZWN0b3JbMV0gKiB0YXJnZXRWZWN0b3JbMF1cclxuICAgICAgICAgICAgICBdO1xyXG4gICAgICAgICAgICAgIFxyXG4gICAgICAgICAgICAgIGNvbnN0IGRvdCA9IGN1cnJlbnRWZWN0b3JbMF0gKiB0YXJnZXRWZWN0b3JbMF0gKyBjdXJyZW50VmVjdG9yWzFdICogdGFyZ2V0VmVjdG9yWzFdICsgY3VycmVudFZlY3RvclsyXSAqIHRhcmdldFZlY3RvclsyXTtcclxuICAgICAgICAgICAgICBjb25zdCBhbmdsZSA9IE1hdGguYWNvcyhNYXRoLm1heCgtMSwgTWF0aC5taW4oMSwgZG90KSkpO1xyXG4gICAgICAgICAgICAgIFxyXG4gICAgICAgICAgICAgICAgY29uc3Qgbm9ybWFsaXplZEF4aXMgPSBNZWNoYW5pY3Mubm9ybWFsaXplKGF4aXMpO1xyXG4gICAgICAgICAgICAgICAgY29uc3QgdGFyZ2V0USA9IE1lY2hhbmljcy5mcm9tQXhpc0FuZ2xlKG5vcm1hbGl6ZWRBeGlzLCBhbmdsZSk7XHJcbiAgICAgICAgICAgICAgICBcclxuICAgICAgICAgICAgICAvLyDthrXtlakg7IOB7YOc66GcIOyngeygkSDslaDri4jrqZTsnbTshZgg7KCB7JqpXHJcbiAgICAgICAgICAgICAgICBzZXRUaW1lb3V0KCgpID0+IHtcclxuICAgICAgICAgICAgICAgICAgTWVjaGFuaWNzLmFuaW1hdGVUb1F1YXRlcm5pb24oXHJcbiAgICAgICAgICAgICAgICAgIE1lY2hhbmljcy5VbmlmaWVkU3BoZXJlU3RhdGUsIFxyXG4gICAgICAgICAgICAgICAgICAgIHRhcmdldFEsIFxyXG4gICAgICAgICAgICAgICAgICAgIGNhbnZhc1xyXG4gICAgICAgICAgICAgICAgICApO1xyXG4gICAgICAgICAgICAgICAgfSwgaW5kZXggKiAxMDApOyAvLyDqsIEg6rWs7LK066eI64ukIDEwMG1z7JSpIOyngOyXsFxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICB9KTtcclxuICAgICAgXHJcbiAgICAgIC8vIO2Gte2VqSDsg4nqtazssrQg7IOB7YOc64+EIOq4sOuzuOqwkuycvOuhnCDstIjquLDtmZRcclxuICAgICAgTWVjaGFuaWNzLlVuaWZpZWRTcGhlcmVTdGF0ZS5RID0gWzEsIDAsIDAsIDBdO1xyXG4gICAgICBNZWNoYW5pY3MuVW5pZmllZFNwaGVyZVN0YXRlLnNlbGVjdGVkQ29sb3IgPSBUb3BvbG9neS5DT09SRElOQVRFX1NZU1RFTS5QT0xBUl9DT0xPUlMuTk9SVEhfUE9MRTtcclxuICAgIH1cclxuICB9O1xyXG4iLAogICAgIi8qID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxyXG4gIPCfmoAg7JWg7ZSM66as7LyA7J207IWYIOynhOyeheygkCAtIEVTNiDrqqjrk4hcclxuICA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0gKi9cclxuXHJcbmNvbnNvbGUubG9nKCfwn5OmIFtpbmRleC5qc10gRVM2IOuqqOuTiCDroZzrlKkg7Iuc7J6RJyk7XHJcbmNvbnN0IG1vZHVsZUxvYWRTdGFydCA9IHBlcmZvcm1hbmNlLm5vdygpO1xyXG5cclxuLy8g7ZW17IusIOuqqOuTiCBJbXBvcnRcclxuaW1wb3J0IHsgQ29sb3JDb252ZXJ0ZXIgfSBmcm9tICcuL21vZHVsZXMvY29sb3IvY29udmVydGVyLmpzJztcclxuaW1wb3J0IHsgVG9wb2xvZ3kgfSBmcm9tICcuL21vZHVsZXMvY29sb3IvdG9wb2xvZ3kuanMnO1xyXG5pbXBvcnQgeyBNZWNoYW5pY3MgfSBmcm9tICcuL21vZHVsZXMvY29sb3IvbWVjaGFuaWNzLmpzJztcclxuaW1wb3J0IHsgU1ZHTG9hZGVyIH0gZnJvbSAnLi9tb2R1bGVzL3V0aWxzL3N2Zy1sb2FkZXIuanMnO1xyXG5pbXBvcnQgeyBDU1NJbmplY3RvciB9IGZyb20gJy4vbW9kdWxlcy91dGlscy9jc3MtaW5qZWN0b3IuanMnO1xyXG5pbXBvcnQgeyBCVVRUT05fQ09OU1RBTlRTIH0gZnJvbSAnLi9tb2R1bGVzL2J1dHRvbi9jb25zdGFudHMuanMnO1xyXG5pbXBvcnQgeyBQYWxldHRlTWFuYWdlciB9IGZyb20gJy4vbW9kdWxlcy9idXR0b24vcGFsZXR0ZS1tYW5hZ2VyLmpzJztcclxuaW1wb3J0IHsgU3R5bGVNYW5hZ2VyIH0gZnJvbSAnLi9tb2R1bGVzL2J1dHRvbi9zdHlsZS1tYW5hZ2VyLmpzJztcclxuaW1wb3J0IHsgQnV0dG9uU3lzdGVtIH0gZnJvbSAnLi9tb2R1bGVzL2J1dHRvbi9idXR0b24tc3lzdGVtLmpzJztcclxuaW1wb3J0IHsgVGhlbWVNYW5hZ2VyIH0gZnJvbSAnLi9tb2R1bGVzL21hbmFnZXJzL3RoZW1lLW1hbmFnZXIuanMnO1xyXG5pbXBvcnQgeyBMYXJnZVRleHRNYW5hZ2VyIH0gZnJvbSAnLi9tb2R1bGVzL21hbmFnZXJzL2xhcmdlLW1vZGUtbWFuYWdlci5qcyc7XHJcbmltcG9ydCB7IFNpemVDb250cm9sTWFuYWdlciB9IGZyb20gJy4vbW9kdWxlcy9tYW5hZ2Vycy9zaXplLWNvbnRyb2wtbWFuYWdlci5qcyc7XHJcbmltcG9ydCB7IEN1c3RvbVBhbGV0dGVNYW5hZ2VyIH0gZnJvbSAnLi9tb2R1bGVzL21hbmFnZXJzL2N1c3RvbS1wYWxldHRlLW1hbmFnZXIuanMnO1xyXG5pbXBvcnQgeyBDb2xvclNwaGVyZVVJIH0gZnJvbSAnLi9tb2R1bGVzL3VpL2NvbG9yLXNwaGVyZS11aS5qcyc7XHJcbmltcG9ydCB7IGNyZWF0ZUljb25NYXAsIGdldEljb25QYXRoLCBmYWxsYmFja0ljb24gfSBmcm9tICcuL2Fzc2V0cy9pY29ucy9pbmRleC5qcyc7XHJcblxyXG5jb25zdCBtb2R1bGVMb2FkRW5kID0gcGVyZm9ybWFuY2Uubm93KCk7XHJcbmNvbnNvbGUubG9nKGDinIUgW2luZGV4LmpzXSDrqqjrk6Ag66qo65OIIGltcG9ydCDsmYTro4wgKCR7KG1vZHVsZUxvYWRFbmQgLSBtb2R1bGVMb2FkU3RhcnQpLnRvRml4ZWQoMil9bXMpYCk7XHJcblxyXG4vLyDsoITsl60gRXhwb3J0XHJcbmNvbnNvbGUubG9nKCfwn5OkIFtpbmRleC5qc10gd2luZG93IOqwneyytOuhnCBleHBvcnQg7Iuc7J6RLi4uJyk7XHJcbndpbmRvdy5Db2xvckNvbnZlcnRlciA9IENvbG9yQ29udmVydGVyO1xyXG53aW5kb3cuVG9wb2xvZ3kgPSBUb3BvbG9neTtcclxud2luZG93Lk1lY2hhbmljcyA9IE1lY2hhbmljcztcclxud2luZG93LkFwcFV0aWxzID0geyBTVkdMb2FkZXIsIENTU0luamVjdG9yIH07XHJcbndpbmRvdy5CdXR0b25TeXN0ZW0gPSBCdXR0b25TeXN0ZW07XHJcbndpbmRvdy5UaGVtZU1hbmFnZXIgPSBUaGVtZU1hbmFnZXI7XHJcbndpbmRvdy5MYXJnZVRleHRNYW5hZ2VyID0gTGFyZ2VUZXh0TWFuYWdlcjtcclxud2luZG93LlNpemVDb250cm9sTWFuYWdlciA9IFNpemVDb250cm9sTWFuYWdlcjtcclxud2luZG93LkN1c3RvbVBhbGV0dGVNYW5hZ2VyID0gQ3VzdG9tUGFsZXR0ZU1hbmFnZXI7XHJcbndpbmRvdy5Db2xvclNwaGVyZVVJID0gQ29sb3JTcGhlcmVVSTtcclxud2luZG93LkJVVFRPTl9DT05TVEFOVFMgPSBCVVRUT05fQ09OU1RBTlRTO1xyXG5cclxuY29uc29sZS5sb2coJ+KchSBbaW5kZXguanNdIOyghOyXrSBleHBvcnQg7JmE66OMJyk7XHJcblxyXG4vLyBDaHJvbWEuanMg66Gc65OcIChDRE4g7Jqw7ISgICsg66Gc7LusIO2PtOuwsSlcclxuY29uc29sZS5sb2coJ/Cfk6UgW2luZGV4LmpzXSBDaHJvbWEuanMg66Gc65OcIOyLnOyekS4uLicpO1xyXG5cclxuY29uc3QgbG9hZENocm9tYSA9IGFzeW5jICgpID0+IHtcclxuICBjb25zdCBDRE5fVVJMID0gJ2h0dHBzOi8vY2RuLmpzZGVsaXZyLm5ldC9ucG0vY2hyb21hLWpzQDIuNC4yL2Nocm9tYS5taW4uanMnO1xyXG4gIGNvbnN0IExPQ0FMX1VSTCA9ICcuL3NyYy9saWIvY2hyb21hLm1pbi5qcyc7XHJcbiAgXHJcbiAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcclxuICAgIGNvbnN0IGNocm9tYVNjcmlwdCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3NjcmlwdCcpO1xyXG4gICAgXHJcbiAgICBjaHJvbWFTY3JpcHQuc3JjID0gQ0ROX1VSTDtcclxuICAgIGNvbnNvbGUubG9nKCfwn4yQIFtpbmRleC5qc10gQ0RO7JeQ7IScIOuhnOuTnCDsi5zrj4Q6JywgQ0ROX1VSTCk7XHJcbiAgICBcclxuICAgIGNocm9tYVNjcmlwdC5vbmxvYWQgPSAoKSA9PiB7XHJcbiAgICAgIGNvbnNvbGUubG9nKCfinIUgW2luZGV4LmpzXSBDRE7sl5DshJwgQ2hyb21hLmpzIOuhnOuTnCDshLHqs7UnKTtcclxuICAgICAgcmVzb2x2ZSgnY2RuJyk7XHJcbiAgICB9O1xyXG4gICAgXHJcbiAgICBjaHJvbWFTY3JpcHQub25lcnJvciA9ICgpID0+IHtcclxuICAgICAgY29uc29sZS53YXJuKCfimqDvuI8gW2luZGV4LmpzXSBDRE4g66Gc65OcIOyLpO2MqCwg66Gc7LusIO2MjOydvCDsi5zrj4QuLi4nKTtcclxuICAgICAgXHJcbiAgICAgIGNvbnN0IGZhbGxiYWNrU2NyaXB0ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnc2NyaXB0Jyk7XHJcbiAgICAgIGZhbGxiYWNrU2NyaXB0LnNyYyA9IExPQ0FMX1VSTDtcclxuICAgICAgY29uc29sZS5sb2coJ/Cfkr4gW2luZGV4LmpzXSDroZzsu6wg7LqQ7Iuc7JeQ7IScIOuhnOuTnCDsi5zrj4Q6JywgTE9DQUxfVVJMKTtcclxuICAgICAgXHJcbiAgICAgIGZhbGxiYWNrU2NyaXB0Lm9ubG9hZCA9ICgpID0+IHtcclxuICAgICAgICBjb25zb2xlLmxvZygn4pyFIFtpbmRleC5qc10g66Gc7LusIOy6kOyLnOyXkOyEnCBDaHJvbWEuanMg66Gc65OcIOyEseqztScpO1xyXG4gICAgICAgIHJlc29sdmUoJ2xvY2FsJyk7XHJcbiAgICAgIH07XHJcbiAgICAgIFxyXG4gICAgICBmYWxsYmFja1NjcmlwdC5vbmVycm9yID0gKCkgPT4ge1xyXG4gICAgICAgIGNvbnNvbGUuZXJyb3IoJ+KdjCBbaW5kZXguanNdIOuhnOy7rCDtjIzsnbzrj4Qg66Gc65OcIOyLpO2MqCcpO1xyXG4gICAgICAgIHJlamVjdChuZXcgRXJyb3IoJ0Nocm9tYS5qcyDroZzrk5wg7Iuk7YyoIChDRE4gJiDroZzsu6wg66qo65GQIOyLpO2MqCknKSk7XHJcbiAgICAgIH07XHJcbiAgICAgIFxyXG4gICAgICBkb2N1bWVudC5oZWFkLmFwcGVuZENoaWxkKGZhbGxiYWNrU2NyaXB0KTtcclxuICAgIH07XHJcbiAgICBcclxuICAgIGRvY3VtZW50LmhlYWQuYXBwZW5kQ2hpbGQoY2hyb21hU2NyaXB0KTtcclxuICB9KTtcclxufTtcclxuXHJcbmxvYWRDaHJvbWEoKS50aGVuKGFzeW5jIChzb3VyY2UpID0+IHtcclxuICBjb25zdCBjaHJvbWFMb2FkVGltZSA9IHBlcmZvcm1hbmNlLm5vdygpO1xyXG4gIGNvbnNvbGUubG9nKGDinIUgW2luZGV4LmpzXSBDaHJvbWEuanMg66Gc65OcIOyZhOujjCAoJHtzb3VyY2UudG9VcHBlckNhc2UoKX0pICgke2Nocm9tYUxvYWRUaW1lLnRvRml4ZWQoMil9bXMpYCk7XHJcbiAgY29uc29sZS5sb2coJ/CflI0gW2luZGV4LmpzXSBjaHJvbWEg67KE7KCEOicsIHdpbmRvdy5jaHJvbWE/LnZlcnNpb24gfHwgJ3Vua25vd24nKTtcclxuICBcclxuICBjb25zb2xlLmxvZygn8J+TpSBbaW5kZXguanNdIGFwcC5qcyDroZzrk5wg7Iuc7J6RLi4uJyk7XHJcbiAgY29uc3QgYXBwTG9hZFN0YXJ0ID0gcGVyZm9ybWFuY2Uubm93KCk7XHJcbiAgdHJ5IHtcclxuICAgIGF3YWl0IGltcG9ydCgnLi9hcHAuanMnKTtcclxuICAgIGNvbnN0IGFwcExvYWRFbmQgPSBwZXJmb3JtYW5jZS5ub3coKTtcclxuICAgIGNvbnNvbGUubG9nKGDinIUgW2luZGV4LmpzXSBhcHAuanMg66Gc65OcIOyZhOujjCAoJHsoYXBwTG9hZEVuZCAtIGFwcExvYWRTdGFydCkudG9GaXhlZCgyKX1tcylgKTtcclxuICAgIGNvbnNvbGUubG9nKCfwn46JIFtpbmRleC5qc10g7KCE7LK0IOyLnOyKpO2FnCDroZzrk5wg7JmE66OMJyk7XHJcbiAgfSBjYXRjaCAoZXJyb3IpIHtcclxuICAgIGNvbnNvbGUuZXJyb3IoJ+KdjCBbaW5kZXguanNdIGFwcC5qcyDroZzrk5wg7Iuk7YyoOicsIGVycm9yKTtcclxuICAgIHRocm93IGVycm9yO1xyXG4gIH1cclxufSkuY2F0Y2goZXJyb3IgPT4ge1xyXG4gIGNvbnNvbGUuZXJyb3IoJ+KdjCBbaW5kZXguanNdIENocm9tYS5qcyDroZzrk5wg7Iuk7YyoOicsIGVycm9yKTtcclxuICBhbGVydCgnQ2hyb21hLmpzIOudvOydtOu4jOufrOumrOulvCDroZzrk5ztlaAg7IiYIOyXhuyKteuLiOuLpC4nKTtcclxufSk7XHJcbiIKICBdLAogICJtYXBwaW5ncyI6ICI7Ozs7SUFHUSxpQkFBZ0IsV0FBVSxZQUFXLFdBQVUsZUFBYyxlQUFjLG1CQUFrQixxQkFBb0IsdUJBTW5ILGdCQUFnQixZQUFZO0FBQUEsRUFFaEMsTUFBTSxtQkFBbUIsQ0FBQyxnQkFBZ0IsaUJBQWlCLGtCQUFrQixZQUFZO0FBQUEsRUFDekYsTUFBTSxrQkFBa0IsaUJBQWlCLE9BQU8sY0FBWSxDQUFDLFNBQVMsY0FBYyxRQUFRLENBQUM7QUFBQSxFQUM3RixJQUFJLGdCQUFnQixTQUFTLEdBQUcsQ0FFaEM7QUFBQSxFQUdBLE1BQU0sY0FBYyxTQUFTLGNBQWMsS0FBSztBQUFBLEVBQ2hELFNBQVMsS0FBSyxZQUFZLFdBQVc7QUFBQSxFQUNyQyxNQUFNLGdCQUFnQixpQkFBaUIsV0FBVztBQUFBLEVBQ2xELE1BQU0sZUFBZSxDQUFDLHVDQUF1QyxxQkFBcUIsZUFBZTtBQUFBLEVBQ2pHLE1BQU0sY0FBYyxhQUFhLE9BQU8sYUFBVyxDQUFDLGNBQWMsaUJBQWlCLE9BQU8sQ0FBQztBQUFBLEVBQzNGLFNBQVMsS0FBSyxZQUFZLFdBQVc7QUFBQSxFQUNyQyxJQUFJLFlBQVksU0FBUyxHQUFHLENBRTVCO0FBQUEsRUFHQSxJQUFJO0FBQUEsSUFDRixjQUFhLEtBQUs7QUFBQSxJQUNsQixrQkFBaUIsS0FBSztBQUFBLElBQ3RCLG9CQUFtQixLQUFLO0FBQUEsSUFDeEIsc0JBQXFCLEtBQUs7QUFBQSxJQUMxQixNQUFNLGNBQWEsS0FBSztBQUFBLElBQ3hCLE9BQU8sT0FBTztBQUFBLElBRWQsTUFBTTtBQUFBO0FBQUEsRUFRUixJQUFJLGtCQUFrQjtBQUFBLEVBQ3RCLE9BQU8saUJBQWlCLFVBQVUsTUFBTTtBQUFBLElBQ3RDLElBQUk7QUFBQSxNQUFpQjtBQUFBLElBQ3JCLGtCQUFrQjtBQUFBLElBQ2xCLHNCQUFzQixNQUFNO0FBQUEsTUFDMUIsY0FBYSxhQUFhLG1CQUFtQjtBQUFBLE1BQzdDLGtCQUFrQjtBQUFBLEtBQ25CO0FBQUEsR0FDRjtBQUFBLEVBR0QsU0FBUyxpQkFBaUIsU0FBUyxDQUFDLFVBQVU7QUFBQSxJQUM1QyxNQUFNLFNBQVMsTUFBTSxRQUFRLFVBQVUsU0FBUztBQUFBLElBQ2hELElBQUksQ0FBQyxVQUFVLE9BQU8sYUFBYSxlQUFlLE1BQU0sVUFDcEQsT0FBTyxRQUFRLG1CQUFtQjtBQUFBLE1BQVE7QUFBQSxJQUU5QyxNQUFNLGFBQWEsT0FBTyxVQUFVLFNBQVMsU0FBUztBQUFBLElBQ3RELE1BQU0sY0FBYyxPQUFPLGNBQWMsdUJBQXVCO0FBQUEsSUFFaEUsSUFBSSxZQUFZO0FBQUEsTUFDZCxJQUFJO0FBQUEsUUFBYSxZQUFZLE1BQU0sVUFBVTtBQUFBLE1BQzdDLHNCQUFzQixNQUFNO0FBQUEsUUFDMUIsT0FBTyxVQUFVLE9BQU8sU0FBUztBQUFBLFFBQ2pDLE9BQU8sYUFBYSxnQkFBZ0IsT0FBTztBQUFBLFFBQzNDLElBQUk7QUFBQSxVQUFhLFlBQVksTUFBTSxlQUFlLFNBQVM7QUFBQSxPQUM1RDtBQUFBLElBQ0gsRUFBTztBQUFBLE1BQ0wsSUFBSTtBQUFBLFFBQWEsWUFBWSxNQUFNLGVBQWUsU0FBUztBQUFBLE1BQzNELE9BQU8sVUFBVSxJQUFJLFNBQVM7QUFBQSxNQUM5QixPQUFPLGFBQWEsZ0JBQWdCLE1BQU07QUFBQSxNQUcxQyxjQUFhLGFBQWEsdUJBQXVCO0FBQUE7QUFBQSxLQUVsRCxLQUFLO0FBQUEsRUFHUixNQUFNLDRCQUE0QixDQUFDLFVBQVU7QUFBQSxJQUMzQyxNQUFNLGlCQUFpQixNQUFNLFFBQVEsVUFBVSwrQkFBK0I7QUFBQSxJQUM5RSxJQUFJLGdCQUFnQjtBQUFBLE1BQ2xCLE1BQU0sZUFBZTtBQUFBLE1BQ3JCLE1BQU0sZ0JBQWdCO0FBQUEsTUFDdEIsSUFBSSxPQUFPLE1BQU0sNkJBQTZCO0FBQUEsUUFBWSxNQUFNLHlCQUF5QjtBQUFBLE1BQ3pGLE9BQU87QUFBQSxJQUNUO0FBQUEsSUFDQSxPQUFPO0FBQUE7QUFBQSxFQUdULFNBQVMsaUJBQWlCLFNBQVMsMkJBQTJCLElBQUk7QUFBQSxFQUdsRSxTQUFTLGlCQUFpQixXQUFXLENBQUMsVUFBVTtBQUFBLElBQzlDLE1BQU0saUJBQWlCLE1BQU0sUUFBUSxVQUFVLCtCQUErQjtBQUFBLElBQzlFLElBQUksbUJBQW1CLE1BQU0sUUFBUSxPQUFPLE1BQU0sUUFBUSxXQUFXLE1BQU0sUUFBUSxnQkFBZ0I7QUFBQSxNQUNqRyxNQUFNLGVBQWU7QUFBQSxNQUNyQixNQUFNLGdCQUFnQjtBQUFBLE1BQ3RCO0FBQUEsSUFDRjtBQUFBLElBRUEsTUFBTSxnQkFBZ0IsTUFBTSxRQUFRLFVBQVUsU0FBUztBQUFBLElBQ3ZELElBQUksaUJBQWlCLGNBQWMsYUFBYSxlQUFlLE1BQU0sUUFBUTtBQUFBLE1BQzNFLElBQUksTUFBTSxRQUFRLFdBQVcsTUFBTSxRQUFRLGlCQUFpQixNQUFNLFFBQVEsS0FBSztBQUFBLFFBQzdFLE1BQU0sZUFBZTtBQUFBLFFBQ3JCLE1BQU0sZ0JBQWdCO0FBQUEsUUFFdEIsTUFBTSxpQkFBaUIsY0FBYyxVQUFVLFNBQVMsUUFBUTtBQUFBLFFBRWhFLElBQUksZ0JBQWdCO0FBQUEsVUFDbEIsTUFBTSxhQUFhLElBQUksV0FBVyxTQUFTO0FBQUEsWUFDekMsU0FBUztBQUFBLFlBQ1QsWUFBWTtBQUFBLFlBQ1osUUFBUTtBQUFBLFVBQ1YsQ0FBQztBQUFBLFVBQ0QsY0FBYyxjQUFjLFVBQVU7QUFBQSxRQUN4QyxFQUFPO0FBQUEsVUFDTCxjQUFjLFVBQVUsSUFBSSxTQUFTO0FBQUEsVUFDdkMsV0FBVyxNQUFNO0FBQUEsWUFDZixjQUFjLFVBQVUsT0FBTyxTQUFTO0FBQUEsWUFDeEMsTUFBTSxhQUFhLElBQUksV0FBVyxTQUFTO0FBQUEsY0FDekMsU0FBUztBQUFBLGNBQ1QsWUFBWTtBQUFBLGNBQ1osUUFBUTtBQUFBLFlBQ1YsQ0FBQztBQUFBLFlBQ0QsY0FBYyxjQUFjLFVBQVU7QUFBQSxhQUNyQyxHQUFHO0FBQUE7QUFBQSxNQUVSO0FBQUEsSUFDRjtBQUFBLEtBQ0MsSUFBSTtBQUFBLEVBR1AsU0FBUyxpQkFBaUIsV0FBVyxDQUFDLFVBQVU7QUFBQSxJQUM5QyxNQUFNLGdCQUFnQixTQUFTO0FBQUEsSUFDL0IsTUFBTSxhQUFhLENBQUMsYUFBYSxXQUFXLGNBQWMsYUFBYSxRQUFRLEtBQUssRUFBRSxTQUFTLE1BQU0sR0FBRztBQUFBLElBRXhHLEtBQUssQ0FBQyxpQkFBaUIsQ0FBQyxjQUFjLFVBQVUsU0FBUyxRQUFRLE1BQU0sWUFBWTtBQUFBLE1BQ2pGLE1BQU0sZUFBZTtBQUFBLE1BQ3JCLE1BQU0sY0FBYyxTQUFTLGNBQWMsU0FBUztBQUFBLE1BQ3BELElBQUksYUFBYTtBQUFBLFFBQ2YsWUFBWSxNQUFNO0FBQUEsTUFDcEI7QUFBQSxNQUNBO0FBQUEsSUFDRjtBQUFBLElBRUEsSUFBSSxDQUFDLGlCQUFpQixDQUFDLGNBQWMsVUFBVSxTQUFTLFFBQVEsR0FBRztBQUFBLE1BQ2pFO0FBQUEsSUFDRjtBQUFBLElBRUEsSUFBSSxlQUFlO0FBQUEsSUFDbkIsTUFBTSxhQUFhLE1BQU0sS0FBSyxTQUFTLGlCQUFpQixTQUFTLENBQUMsRUFBRSxPQUFPLFNBQ3pFLElBQUksaUJBQWlCLElBQ3ZCO0FBQUEsSUFFQSxRQUFRLE1BQU07QUFBQSxXQUNQO0FBQUEsUUFDSCxNQUFNLGVBQWU7QUFBQSxRQUNyQixNQUFNLGVBQWUsV0FBVyxRQUFRLGFBQWE7QUFBQSxRQUNyRCxNQUFNLGFBQWEsZUFBZSxLQUFLLFdBQVc7QUFBQSxRQUNsRCxlQUFlLFdBQVc7QUFBQSxRQUMxQjtBQUFBLFdBRUc7QUFBQSxRQUNILE1BQU0sZUFBZTtBQUFBLFFBQ3JCLE1BQU0sZ0JBQWdCLFdBQVcsUUFBUSxhQUFhO0FBQUEsUUFDdEQsTUFBTSxZQUFZLGtCQUFrQixJQUFJLFdBQVcsU0FBUyxJQUFJLGdCQUFnQjtBQUFBLFFBQ2hGLGVBQWUsV0FBVztBQUFBLFFBQzFCO0FBQUEsV0FFRztBQUFBLFFBQ0QsTUFBTSxlQUFlO0FBQUEsUUFDdkIsTUFBTSxtQkFBbUIsY0FBYyxRQUFRLFdBQVc7QUFBQSxRQUMxRCxNQUFNLHNCQUFzQixXQUFXLFFBQVEsYUFBYTtBQUFBLFFBRTVELFNBQVMsSUFBSSxFQUFHLElBQUksV0FBVyxRQUFRLEtBQUs7QUFBQSxVQUMxQyxNQUFNLGNBQWEsc0JBQXNCLEtBQUssV0FBVztBQUFBLFVBQ3pELE1BQU0sYUFBYSxXQUFXO0FBQUEsVUFDOUIsTUFBTSxnQkFBZ0IsV0FBVyxRQUFRLFdBQVc7QUFBQSxVQUVwRCxJQUFJLGtCQUFrQixrQkFBa0I7QUFBQSxZQUN0QyxlQUFlO0FBQUEsWUFDZjtBQUFBLFVBQ0Y7QUFBQSxRQUNGO0FBQUEsUUFDRTtBQUFBLFdBRUM7QUFBQSxRQUNELE1BQU0sZUFBZTtBQUFBLFFBQ3ZCLE1BQU0scUJBQXFCLGNBQWMsUUFBUSxXQUFXO0FBQUEsUUFDNUQsTUFBTSxpQkFBaUIsV0FBVyxRQUFRLGFBQWE7QUFBQSxRQUV2RCxTQUFTLElBQUksRUFBRyxJQUFJLFdBQVcsUUFBUSxLQUFLO0FBQUEsVUFDMUMsTUFBTSxjQUFhLGlCQUFpQixJQUFJLFdBQVcsVUFBVSxXQUFXO0FBQUEsVUFDeEUsTUFBTSxhQUFhLFdBQVc7QUFBQSxVQUM5QixNQUFNLGdCQUFnQixXQUFXLFFBQVEsV0FBVztBQUFBLFVBRXBELElBQUksa0JBQWtCLG9CQUFvQjtBQUFBLFlBQ3hDLE1BQU0seUJBQXlCLFdBQVcsT0FBTyxTQUFPLElBQUksUUFBUSxXQUFXLE1BQU0sYUFBYTtBQUFBLFlBQ2xHLGVBQWUsdUJBQXVCO0FBQUEsWUFDdEM7QUFBQSxVQUNGO0FBQUEsUUFDRjtBQUFBLFFBQ0U7QUFBQSxXQUVDO0FBQUEsUUFDSCxNQUFNLGVBQWU7QUFBQSxRQUNyQixlQUFlLFdBQVc7QUFBQSxRQUMxQjtBQUFBLFdBRUc7QUFBQSxRQUNILE1BQU0sZUFBZTtBQUFBLFFBQ3JCLGVBQWUsV0FBVyxXQUFXLFNBQVM7QUFBQSxRQUM5QztBQUFBO0FBQUEsSUFHSixJQUFJLGNBQWM7QUFBQSxNQUNoQixhQUFhLE1BQU07QUFBQSxJQUNyQjtBQUFBLEtBQ0MsSUFBSTtBQUFBLEVBR1AsU0FBUyxpQkFBaUIsYUFBYSxDQUFDLFVBQVU7QUFBQSxJQUNoRCxNQUFNLFNBQVMsTUFBTSxRQUFRLFVBQVUsU0FBUztBQUFBLElBQ2hELElBQUksVUFBVSxPQUFPLGFBQWEsZUFBZSxNQUFNLFVBQVUsQ0FBQyxPQUFPLFVBQVUsU0FBUyxRQUFRLEdBQUc7QUFBQSxNQUNyRyxPQUFPLFVBQVUsSUFBSSxTQUFTO0FBQUEsSUFDaEM7QUFBQSxLQUNDLElBQUk7QUFBQSxFQUdQLFNBQVMsaUJBQWlCLFdBQVcsQ0FBQyxVQUFVO0FBQUEsSUFDOUMsTUFBTSxTQUFTLE1BQU0sUUFBUSxVQUFVLFNBQVM7QUFBQSxJQUNoRCxJQUFJLFVBQVUsT0FBTyxVQUFVLFNBQVMsU0FBUyxLQUFLLENBQUMsT0FBTyxVQUFVLFNBQVMsUUFBUSxHQUFHO0FBQUEsTUFDMUYsT0FBTyxVQUFVLE9BQU8sU0FBUztBQUFBLE1BR2pDLGNBQWEsYUFBYSx1QkFBdUI7QUFBQSxJQUNuRDtBQUFBLEtBQ0MsSUFBSTtBQUFBLEVBR1AsU0FBUyxpQkFBaUIsY0FBYyxDQUFDLFVBQVU7QUFBQSxJQUNqRCxJQUFJLE1BQU0sVUFBVSxPQUFPLE1BQU0sT0FBTyxZQUFZLFlBQVk7QUFBQSxNQUM5RCxNQUFNLFNBQVMsTUFBTSxRQUFRLFVBQVUsU0FBUztBQUFBLE1BQ2hELElBQUksVUFBVSxPQUFPLFVBQVUsU0FBUyxTQUFTLEtBQUssQ0FBQyxPQUFPLFVBQVUsU0FBUyxRQUFRLEdBQUc7QUFBQSxRQUM1RixPQUFPLFVBQVUsT0FBTyxTQUFTO0FBQUEsUUFHakMsY0FBYSxhQUFhLGVBQWU7QUFBQSxNQUN6QztBQUFBLElBQ0Y7QUFBQSxLQUNDLElBQUk7QUFBQSxFQUdQLFNBQVMsaUJBQWlCLGNBQWMsQ0FBQyxVQUFVO0FBQUEsSUFDakQsTUFBTSxTQUFTLE1BQU0sUUFBUSxVQUFVLFNBQVM7QUFBQSxJQUNoRCxJQUFJLFVBQVUsT0FBTyxhQUFhLGVBQWUsTUFBTSxVQUFVLENBQUMsT0FBTyxVQUFVLFNBQVMsUUFBUSxHQUFHO0FBQUEsTUFDckcsT0FBTyxVQUFVLElBQUksU0FBUztBQUFBLElBQ2hDO0FBQUEsS0FDQyxFQUFFLFNBQVMsS0FBSyxDQUFDO0FBQUEsRUFHcEIsU0FBUyxpQkFBaUIsWUFBWSxDQUFDLFVBQVU7QUFBQSxJQUMvQyxNQUFNLFNBQVMsTUFBTSxRQUFRLFVBQVUsU0FBUztBQUFBLElBQ2hELElBQUksVUFBVSxPQUFPLFVBQVUsU0FBUyxTQUFTLEtBQUssQ0FBQyxPQUFPLFVBQVUsU0FBUyxRQUFRLEdBQUc7QUFBQSxNQUMxRixPQUFPLFVBQVUsT0FBTyxTQUFTO0FBQUEsTUFHakMsY0FBYSxhQUFhLHVCQUF1QjtBQUFBLElBQ25EO0FBQUEsS0FDQyxFQUFFLFNBQVMsS0FBSyxDQUFDO0FBQUEsRUFHcEIsU0FBUyxpQkFBaUIsZUFBZSxDQUFDLFVBQVU7QUFBQSxJQUNsRCxNQUFNLFNBQVMsTUFBTSxRQUFRLFVBQVUsU0FBUztBQUFBLElBQ2hELElBQUksVUFBVSxPQUFPLFVBQVUsU0FBUyxTQUFTLEtBQUssQ0FBQyxPQUFPLFVBQVUsU0FBUyxRQUFRLEdBQUc7QUFBQSxNQUMxRixPQUFPLFVBQVUsT0FBTyxTQUFTO0FBQUEsTUFHakMsY0FBYSxhQUFhLHVCQUF1QjtBQUFBLElBQ25EO0FBQUEsS0FDQyxFQUFFLFNBQVMsS0FBSyxDQUFDO0FBQUEsRUFHcEIsT0FBTyxXQUFXO0FBQUEsRUFDbEIsT0FBTyxlQUFlO0FBQUEsRUFDdEIsT0FBTyxlQUFlO0FBQUEsRUFDdEIsT0FBTyxtQkFBbUI7QUFBQSxFQUMxQixPQUFPLHFCQUFxQjtBQUFBLEVBQzVCLE9BQU8sdUJBQXVCO0FBQUE7QUFBQTtBQUFBLEdBalMxQixFQUFFLGlDQUFnQixxQkFBVSx1QkFBVyxxQkFBVSw2QkFBYyw2QkFBYyxxQ0FBa0IseUNBQW9CLGdEQUF5QjtBQUFBLEVBcVNsSixJQUFJLFNBQVMsZUFBZSxXQUFXO0FBQUEsSUFDckMsT0FBTyxpQkFBaUIsb0JBQW9CLGFBQWE7QUFBQSxFQUMzRCxFQUFPO0FBQUEsSUFDTCxjQUFjO0FBQUE7QUFBQTs7O0FDdlNULElBQU0sa0JBQWlCO0FBQUEsRUFFNUIsU0FBUyxDQUFDLEdBQUcsR0FBRyxHQUFHLElBQUksS0FBSztBQUFBLElBQzFCLE9BQU8sT0FBTyxJQUFJLEdBQUcsR0FBRyxDQUFDLEVBQUUsTUFBTSxJQUFJLEdBQUcsRUFBRSxJQUFJLE1BQU0sRUFBRSxZQUFZO0FBQUE7QUFBQSxFQUdwRSxJQUFJLENBQUMsR0FBRyxHQUFHLEdBQUcsSUFBSSxLQUFLO0FBQUEsSUFDckIsT0FBTyxFQUFFLEdBQUcsR0FBRyxHQUFHLEVBQUU7QUFBQTtBQUFBLEVBR3RCLFNBQVMsQ0FBQyxLQUFLO0FBQUEsSUFDYixNQUFNLFFBQVEsT0FBTyxHQUFHO0FBQUEsSUFDeEIsTUFBTSxNQUFNLE1BQU0sSUFBSTtBQUFBLElBQ3RCLE9BQU87QUFBQSxNQUNMLEdBQUcsSUFBSTtBQUFBLE1BQ1AsR0FBRyxJQUFJO0FBQUEsTUFDUCxHQUFHLElBQUk7QUFBQSxNQUNQLEdBQUcsS0FBSyxNQUFNLE1BQU0sTUFBTSxJQUFJLEdBQUc7QUFBQSxJQUNuQztBQUFBO0FBQUEsRUFHRixRQUFRLENBQUMsR0FBRyxHQUFHLEdBQUc7QUFBQSxJQUNoQixNQUFNLE1BQU0sT0FBTyxJQUFJLEdBQUcsR0FBRyxDQUFDLEVBQUUsSUFBSTtBQUFBLElBQ3BDLE9BQU87QUFBQSxNQUNMLEdBQUcsSUFBSTtBQUFBLE1BQ1AsR0FBRyxJQUFJO0FBQUEsTUFDUCxHQUFHLElBQUk7QUFBQSxJQUNUO0FBQUE7QUFBQSxFQUdGLFFBQVEsQ0FBQyxHQUFHLEdBQUcsR0FBRyxJQUFJLEtBQUs7QUFBQSxJQUN6QixPQUFPLE9BQU8sSUFBSSxHQUFHLEdBQUcsQ0FBQyxFQUFFLE1BQU0sSUFBSSxHQUFHLEVBQUUsSUFBSSxNQUFNLEVBQUUsWUFBWTtBQUFBO0FBQUEsRUFHcEUsUUFBUSxDQUFDLEdBQUcsR0FBRyxHQUFHO0FBQUEsSUFDaEIsTUFBTSxNQUFNLE9BQU8sSUFBSSxHQUFHLEdBQUcsQ0FBQyxFQUFFLElBQUk7QUFBQSxJQUNwQyxPQUFPO0FBQUEsTUFDTCxHQUFHLEtBQUssTUFBTSxJQUFJLE1BQU0sQ0FBQztBQUFBLE1BQ3pCLEdBQUcsS0FBSyxNQUFNLElBQUksS0FBSyxHQUFHO0FBQUEsTUFDMUIsR0FBRyxLQUFLLE1BQU0sSUFBSSxLQUFLLEdBQUc7QUFBQSxJQUM1QjtBQUFBO0FBQUEsRUFHRixRQUFRLENBQUMsR0FBRyxHQUFHLEdBQUc7QUFBQSxJQUNoQixNQUFNLE1BQU0sT0FBTyxJQUFJLEdBQUcsR0FBRyxDQUFDLEVBQUUsSUFBSTtBQUFBLElBQ3BDLE9BQU87QUFBQSxNQUNMLEdBQUcsSUFBSTtBQUFBLE1BQ1AsR0FBRyxJQUFJO0FBQUEsTUFDUCxHQUFHLElBQUk7QUFBQSxJQUNUO0FBQUE7QUFBQSxFQUdGLFFBQVEsQ0FBQyxHQUFHLEdBQUcsR0FBRyxJQUFJLEtBQUs7QUFBQSxJQUN6QixPQUFPLE9BQU8sSUFBSSxHQUFHLEdBQUcsQ0FBQyxFQUFFLE1BQU0sSUFBSSxHQUFHLEVBQUUsSUFBSSxNQUFNLEVBQUUsWUFBWTtBQUFBO0FBRXRFOzs7QUN2RE8sSUFBTSxZQUFXO0FBQUEsRUFFdEIsbUJBQW1CO0FBQUEsSUFDakIsV0FBVztBQUFBLE1BQ1QsWUFBWSxFQUFFLE9BQU8sR0FBRyxLQUFLLEVBQUU7QUFBQSxNQUMvQixZQUFZLEVBQUUsT0FBTyxLQUFLLElBQUksS0FBSyxFQUFFO0FBQUEsTUFDckMsU0FBUyxFQUFFLE9BQU8sS0FBSyxLQUFHLEdBQUcsS0FBSyxFQUFFO0FBQUEsSUFDdEM7QUFBQSxJQUVBLFdBQVc7QUFBQSxNQUNULFFBQVEsRUFBRSxHQUFHLEdBQUcsR0FBRyxHQUFHLEdBQUcsRUFBRTtBQUFBLE1BQzNCLFlBQVksRUFBRSxHQUFHLEdBQUcsR0FBRyxHQUFHLEdBQUcsRUFBRTtBQUFBLE1BQy9CLFlBQVksRUFBRSxHQUFHLEdBQUcsR0FBRyxHQUFHLEdBQUcsR0FBRztBQUFBLElBQ2xDO0FBQUEsSUFFQSxjQUFjO0FBQUEsTUFDWixZQUFZLEVBQUUsR0FBRyxLQUFLLEdBQUcsS0FBSyxHQUFHLElBQUk7QUFBQSxNQUNyQyxZQUFZLEVBQUUsR0FBRyxHQUFHLEdBQUcsR0FBRyxHQUFHLEVBQUU7QUFBQSxJQUNqQztBQUFBLElBRUEsUUFBUTtBQUFBLE1BQ04sUUFBUSxFQUFFLEdBQUcsR0FBRyxHQUFHLEVBQUU7QUFBQSxNQUNyQixhQUFhO0FBQUEsSUFDZjtBQUFBLEVBQ0Y7QUFBQSxFQUdBLGNBQWMsQ0FBQyxPQUFPLEtBQUs7QUFBQSxJQUN6QixNQUFNLE9BQVEsTUFBTSxLQUFLLE9BQU8sSUFBSSxLQUFLLE1BQU87QUFBQSxJQUNoRCxNQUFNLEtBQUssS0FBSyxNQUFNLE1BQU0sRUFBRSxJQUFJO0FBQUEsSUFDbEMsTUFBTSxJQUFLLE1BQU0sS0FBTTtBQUFBLElBRXZCLE1BQU0sY0FBYyxNQUFNO0FBQUEsTUFDeEIsUUFBTztBQUFBLGFBQ0E7QUFBQSxVQUFHLE9BQU8sRUFBRSxHQUFHLEtBQUssR0FBRyxLQUFLLE1BQU0sSUFBSSxHQUFHLEdBQUcsR0FBRyxFQUFFO0FBQUEsYUFDakQ7QUFBQSxVQUFHLE9BQU8sRUFBRSxHQUFHLEtBQUssT0FBTyxJQUFFLEtBQUssR0FBRyxHQUFHLEdBQUcsS0FBSyxHQUFHLEVBQUU7QUFBQSxhQUNyRDtBQUFBLFVBQUcsT0FBTyxFQUFFLEdBQUcsR0FBRyxHQUFHLEtBQUssR0FBRyxLQUFLLE1BQU0sSUFBSSxHQUFHLEVBQUU7QUFBQSxhQUNqRDtBQUFBLFVBQUcsT0FBTyxFQUFFLEdBQUcsR0FBRyxHQUFHLEtBQUssT0FBTyxJQUFFLEtBQUssR0FBRyxHQUFHLEdBQUcsSUFBSTtBQUFBLGFBQ3JEO0FBQUEsVUFBRyxPQUFPLEVBQUUsR0FBRyxLQUFLLE1BQU0sSUFBSSxHQUFHLEdBQUcsR0FBRyxHQUFHLEdBQUcsSUFBSTtBQUFBLGFBQ2pEO0FBQUEsVUFBRyxPQUFPLEVBQUUsR0FBRyxLQUFLLEdBQUcsR0FBRyxHQUFHLEtBQUssT0FBTyxJQUFFLEtBQUssR0FBRyxFQUFFO0FBQUE7QUFBQTtBQUFBLElBSTlELE1BQU0sV0FBVyxRQUFRLE1BQU0sS0FBSztBQUFBLElBQ3BDLE1BQU0saUJBQWlCLFdBQVcsS0FBSyxLQUFRLFdBQVcsS0FBSyxLQUFNLE1BQU0sT0FBUSxXQUFXLE1BQU0sS0FBTTtBQUFBLElBQzFHLFFBQVEsR0FBRyxPQUFPLEdBQUcsT0FBTyxHQUFHLFVBQVUsWUFBWTtBQUFBLElBQ3JELE1BQU0sa0JBQWtCLEtBQUssSUFBSSxLQUFLO0FBQUEsSUFDdEMsTUFBTSxPQUFPLEtBQUssTUFBTSxpQkFBaUIsR0FBRztBQUFBLElBRTVDLE9BQU87QUFBQSxNQUNMLEdBQUcsS0FBSyxNQUFNLFFBQVEsUUFBUSxRQUFRLGVBQWU7QUFBQSxNQUNyRCxHQUFHLEtBQUssTUFBTSxRQUFRLFFBQVEsUUFBUSxlQUFlO0FBQUEsTUFDckQsR0FBRyxLQUFLLE1BQU0sUUFBUSxRQUFRLFFBQVEsZUFBZTtBQUFBLElBQ3ZEO0FBQUE7QUFBQSxFQUlGLGVBQWUsQ0FBQyxPQUFPLEtBQUs7QUFBQSxJQUMxQixNQUFNLFdBQVcsUUFBUSxNQUFNLEtBQUs7QUFBQSxJQUNwQyxNQUFNLGdCQUFpQixXQUFXLEtBQUssV0FBVztBQUFBLElBQ2xELE1BQU0sa0JBQW1CLEtBQUssSUFBSSxXQUFXLEVBQUUsSUFBSTtBQUFBLElBRW5ELElBQUksZUFBZTtBQUFBLE1BQ2pCLE9BQU8sV0FBVyxJQUFJLEtBQUssa0JBQWtCLGFBQWEsYUFBYSxLQUFLLGtCQUFrQixhQUFhO0FBQUEsSUFDN0c7QUFBQSxJQUVBLE1BQU0sT0FBUSxNQUFNLEtBQUssT0FBTyxJQUFJLEtBQUssTUFBTztBQUFBLElBQ2hELE1BQU0sS0FBSyxLQUFLLE1BQU0sTUFBTSxFQUFFLElBQUk7QUFBQSxJQUNsQyxNQUFNLElBQUssTUFBTSxLQUFNO0FBQUEsSUFFdkIsTUFBTSxjQUFjLE1BQU07QUFBQSxNQUN4QixRQUFPO0FBQUEsYUFDQTtBQUFBLFVBQUcsT0FBTyxFQUFFLEdBQUcsS0FBSyxHQUFHLEtBQUssTUFBTSxJQUFJLEdBQUcsR0FBRyxHQUFHLEVBQUU7QUFBQSxhQUNqRDtBQUFBLFVBQUcsT0FBTyxFQUFFLEdBQUcsS0FBSyxPQUFPLElBQUUsS0FBSyxHQUFHLEdBQUcsR0FBRyxLQUFLLEdBQUcsRUFBRTtBQUFBLGFBQ3JEO0FBQUEsVUFBRyxPQUFPLEVBQUUsR0FBRyxHQUFHLEdBQUcsS0FBSyxHQUFHLEtBQUssTUFBTSxJQUFJLEdBQUcsRUFBRTtBQUFBLGFBQ2pEO0FBQUEsVUFBRyxPQUFPLEVBQUUsR0FBRyxHQUFHLEdBQUcsS0FBSyxPQUFPLElBQUUsS0FBSyxHQUFHLEdBQUcsR0FBRyxJQUFJO0FBQUEsYUFDckQ7QUFBQSxVQUFHLE9BQU8sRUFBRSxHQUFHLEtBQUssTUFBTSxJQUFJLEdBQUcsR0FBRyxHQUFHLEdBQUcsR0FBRyxJQUFJO0FBQUEsYUFDakQ7QUFBQSxVQUFHLE9BQU8sRUFBRSxHQUFHLEtBQUssR0FBRyxHQUFHLEdBQUcsS0FBSyxPQUFPLElBQUUsS0FBSyxHQUFHLEVBQUU7QUFBQTtBQUFBO0FBQUEsSUFJOUQsSUFBSSxpQkFBaUI7QUFBQSxNQUNuQixPQUFPLFlBQVk7QUFBQSxJQUNyQjtBQUFBLElBRUEsTUFBTSxpQkFBaUIsV0FBVyxLQUFLLEtBQVEsV0FBVyxLQUFLLEtBQU0sTUFBTSxPQUFRLFdBQVcsTUFBTSxLQUFNO0FBQUEsSUFDMUcsUUFBUSxHQUFHLE9BQU8sR0FBRyxPQUFPLEdBQUcsVUFBVSxZQUFZO0FBQUEsSUFDckQsTUFBTSxrQkFBa0IsS0FBSyxJQUFJLEtBQUs7QUFBQSxJQUN0QyxNQUFNLE9BQU8sS0FBSyxNQUFNLGlCQUFpQixHQUFHO0FBQUEsSUFFNUMsT0FBTztBQUFBLE1BQ0wsR0FBRyxLQUFLLE1BQU0sUUFBUSxRQUFRLFFBQVEsZUFBZTtBQUFBLE1BQ3JELEdBQUcsS0FBSyxNQUFNLFFBQVEsUUFBUSxRQUFRLGVBQWU7QUFBQSxNQUNyRCxHQUFHLEtBQUssTUFBTSxRQUFRLFFBQVEsUUFBUSxlQUFlO0FBQUEsSUFDdkQ7QUFBQTtBQUVKOzs7QUNoR08sSUFBTSxnQkFBZ0I7QUFBQSxFQUUzQixlQUFlLENBQUMsYUFBYSxRQUFRO0FBQUEsSUFDbkMsTUFBTSxhQUFhLFNBQVMsZUFBZSxhQUFhO0FBQUEsSUFDeEQsTUFBTSxZQUFZLFNBQVMsY0FBYyxhQUFhO0FBQUEsSUFFdEQsSUFBSSxDQUFDLGNBQWMsQ0FBQztBQUFBLE1BQVc7QUFBQSxJQUUvQixXQUFXLGlCQUFpQixTQUFTLENBQUMsTUFBTTtBQUFBLE1BQzFDLFlBQVksT0FBTyxXQUFXLEVBQUUsT0FBTyxLQUFLO0FBQUEsTUFFNUMsT0FBTyxVQUFVLGtCQUFrQixPQUFPLFdBQVcsSUFBSSxHQUFHLFdBQVc7QUFBQSxNQUN2RSxVQUFVLGNBQWMsR0FBRyxLQUFLLE1BQU0sWUFBWSxPQUFPLEdBQUc7QUFBQSxLQUM3RDtBQUFBLElBRUQsV0FBVyxRQUFRLFlBQVk7QUFBQSxJQUMvQixVQUFVLGNBQWMsR0FBRyxLQUFLLE1BQU0sWUFBWSxPQUFPLEdBQUc7QUFBQTtBQUFBLEVBSTlELG9CQUFvQixDQUFDLGFBQWEsUUFBUTtBQUFBLElBQ3hDLE1BQU0sV0FBVyxTQUFTLGNBQWMsWUFBWTtBQUFBLElBQ3BELE1BQU0sV0FBVyxTQUFTLGNBQWMsWUFBWTtBQUFBLElBQ3BELE1BQU0sV0FBVyxTQUFTLGNBQWMsWUFBWTtBQUFBLElBRXBELElBQUksQ0FBQyxZQUFZLENBQUMsWUFBWSxDQUFDO0FBQUEsTUFBVTtBQUFBLElBRXpDLE1BQU0sa0JBQWtCLE1BQU07QUFBQSxNQUM1QixNQUFNLE1BQU0sSUFBSSxZQUFZLGNBQWMsRUFBRSxTQUFTLEVBQUUsRUFBRSxTQUFTLEdBQUcsR0FBRyxJQUFJLFlBQVksY0FBYyxFQUFFLFNBQVMsRUFBRSxFQUFFLFNBQVMsR0FBRyxHQUFHLElBQUksWUFBWSxjQUFjLEVBQUUsU0FBUyxFQUFFLEVBQUUsU0FBUyxHQUFHLEdBQUcsSUFBSSxZQUFZO0FBQUEsTUFDaE4sTUFBTSxNQUFNLE9BQU8sWUFBWSxjQUFjLE1BQU0sWUFBWSxjQUFjLE1BQU0sWUFBWSxjQUFjO0FBQUEsTUFDN0csTUFBTSxZQUFZLE9BQU8sS0FBSyxPQUFPLFlBQVksY0FBYyxJQUFJLFlBQVksY0FBYyxJQUFJLFlBQVksY0FBYyxLQUFLLElBQUksTUFBTSxHQUFHO0FBQUEsTUFFN0ksU0FBUyxjQUFjO0FBQUEsTUFDdkIsU0FBUyxjQUFjO0FBQUEsTUFDdkIsU0FBUyxjQUFjO0FBQUE7QUFBQSxJQUd6QixnQkFBZ0I7QUFBQSxJQUVoQixZQUFZLE1BQU07QUFBQSxNQUNoQixJQUFJLFlBQVksZUFBZTtBQUFBLFFBQzdCLGdCQUFnQjtBQUFBLE1BQ2xCO0FBQUEsT0FDQyxHQUFHO0FBQUE7QUFFVjs7O0FDMUNPLElBQU0sYUFBWTtBQUFBLEVBRXZCLG9CQUFvQjtBQUFBLElBQ2xCLFVBQVU7QUFBQSxJQUNWLElBQUk7QUFBQSxJQUNKLEdBQUcsQ0FBQyxHQUFHLEdBQUcsR0FBRyxDQUFDO0FBQUEsSUFDZCxNQUFNLENBQUMsR0FBRyxDQUFDO0FBQUEsSUFDWCxNQUFNO0FBQUEsSUFDTixlQUFlLEVBQUUsR0FBRyxHQUFHLEdBQUcsR0FBRyxHQUFHLEVBQUU7QUFBQSxJQUNsQyxZQUFZO0FBQUEsRUFDZDtBQUFBLEVBR0EscUJBQXFCLENBQUMsV0FBVyx3QkFBd0IsV0FBVyxNQUFNO0FBQUEsSUFDeEUsTUFBTSxTQUFTLFNBQVMsY0FBYyxRQUFRO0FBQUEsSUFDOUMsSUFBSSxDQUFDO0FBQUEsTUFBUTtBQUFBLElBRWIsTUFBTSxNQUFNLE9BQU8sV0FBVyxJQUFJO0FBQUEsSUFDbEMsSUFBSSxVQUFVLEdBQUcsR0FBRyxPQUFPLE9BQU8sT0FBTyxNQUFNO0FBQUEsSUFDL0MsS0FBSyxrQkFBa0IsS0FBSyxLQUFLLGtCQUFrQjtBQUFBLElBRW5ELEtBQUssdUJBQXVCLFFBQVEsS0FBSyxvQkFBb0IsUUFBUTtBQUFBLElBQ3JFLGNBQWMsZ0JBQWdCLEtBQUssb0JBQW9CLE1BQU07QUFBQSxJQUM3RCxjQUFjLHFCQUFxQixLQUFLLG9CQUFvQixNQUFNO0FBQUE7QUFBQSxFQUlwRSxvQkFBb0IsQ0FBQyxHQUFHLEdBQUcsR0FBRztBQUFBLElBQzVCLE1BQU0sSUFBSSxLQUFLLEtBQUssSUFBSSxJQUFJLElBQUksSUFBSSxJQUFJLENBQUM7QUFBQSxJQUN6QyxPQUFPLEVBQUUsR0FBRyxPQUFPLEtBQUssS0FBSyxLQUFLLElBQUksSUFBSSxLQUFLLElBQUksR0FBRyxJQUFJLENBQUMsQ0FBQyxDQUFDLEdBQUcsS0FBSyxLQUFLLE1BQU0sR0FBRyxDQUFDLEVBQUU7QUFBQTtBQUFBLEVBSXhGLG9CQUFvQixDQUFDLEdBQUcsT0FBTyxLQUFLO0FBQUEsSUFDbEMsT0FBTyxFQUFFLEdBQUcsSUFBSSxLQUFLLElBQUksS0FBSyxJQUFJLEtBQUssSUFBSSxHQUFHLEdBQUcsR0FBRyxJQUFJLEtBQUssSUFBSSxLQUFLLElBQUksS0FBSyxJQUFJLEdBQUcsR0FBRyxHQUFHLElBQUksS0FBSyxJQUFJLEtBQUssRUFBRTtBQUFBO0FBQUEsRUFJbEgsd0JBQXdCLENBQUMsU0FBUyxTQUFTLFFBQVE7QUFBQSxJQUNqRCxJQUFJLEtBQUssS0FBSyxVQUFVLFVBQVUsVUFBVSxPQUFPLElBQUk7QUFBQSxNQUFRLE9BQU87QUFBQSxJQUN0RSxNQUFNLFlBQVksRUFBRSxHQUFHLFVBQVEsUUFBUSxHQUFHLFVBQVEsUUFBUSxHQUFHLEtBQUssS0FBSyxTQUFTLFNBQVMsVUFBVSxVQUFVLFVBQVUsT0FBTyxJQUFFLE9BQU87QUFBQSxJQUN2SSxPQUFPLEVBQUUsUUFBUSxFQUFFLEdBQUcsU0FBUyxHQUFHLFFBQVEsR0FBRyxXQUFXLFdBQVcsS0FBSyxxQkFBcUIsVUFBVSxHQUFHLFVBQVUsR0FBRyxVQUFVLENBQUMsRUFBRTtBQUFBO0FBQUEsRUFJdEksZ0NBQWdDLENBQUMsU0FBUyxTQUFTLFFBQVE7QUFBQSxJQUN6RCxNQUFNLE9BQU8sT0FBTyxzQkFBc0I7QUFBQSxJQUMxQyxPQUFPLEtBQUsseUJBQXlCLFVBQVUsS0FBSyxRQUFRLEdBQUcsVUFBVSxLQUFLLFNBQVMsR0FBRyxLQUFLLElBQUksS0FBSyxPQUFPLEtBQUssTUFBTSxJQUFJLENBQUM7QUFBQTtBQUFBLEVBSWpJLGlCQUFpQixDQUFDLFVBQVU7QUFBQSxJQUMxQixTQUFTLFFBQVEsRUFBRyxTQUFTLEtBQUssSUFBSSxTQUFTLE1BQU07QUFBQSxNQUNuRCxTQUFTLE1BQU0sQ0FBQyxLQUFLLEdBQUksT0FBTyxLQUFLLElBQUksT0FBTyxNQUFNO0FBQUEsUUFDcEQsTUFBTSxRQUFRLFVBQVMsZUFBZSxPQUFPLEdBQUc7QUFBQSxRQUNoRCxJQUFJLE9BQU8sSUFBSSxNQUFNLEdBQUcsTUFBTSxHQUFHLE1BQU0sQ0FBQyxFQUFFLElBQUksTUFBTSxPQUFPLFFBQVEsRUFBRSxJQUFJO0FBQUEsVUFBRyxPQUFPLEVBQUUsT0FBTyxJQUFJO0FBQUEsTUFDbEc7QUFBQSxJQUNGO0FBQUE7QUFBQSxFQUlGLFNBQVMsQ0FBQyxHQUFHO0FBQUEsSUFDWCxNQUFNLFNBQVMsS0FBSyxLQUFLLEVBQUUsT0FBTyxDQUFDLEtBQUssUUFBUSxNQUFNLE1BQU0sS0FBSyxDQUFDLENBQUM7QUFBQSxJQUNuRSxJQUFJLFdBQVc7QUFBQSxNQUFHLE1BQU0sSUFBSSxNQUFNLGtCQUFpQjtBQUFBLElBQ25ELE9BQU8sRUFBRSxJQUFJLFNBQU8sTUFBTSxNQUFNO0FBQUE7QUFBQSxFQUlsQyxhQUFhLENBQUMsTUFBTSxPQUFPO0FBQUEsSUFDekIsTUFBTSxJQUFJLEtBQUssSUFBSSxRQUFRLEdBQUc7QUFBQSxJQUM5QixPQUFPLENBQUMsS0FBSyxLQUFLLEdBQUcsS0FBSyxLQUFLLEdBQUcsS0FBSyxLQUFLLEdBQUcsS0FBSyxJQUFJLFFBQVEsR0FBRyxDQUFDO0FBQUE7QUFBQSxFQUl0RSxRQUFRLENBQUMsSUFBSSxJQUFJO0FBQUEsSUFDZixPQUFPO0FBQUEsTUFDTCxHQUFHLEtBQUssR0FBRyxLQUFLLEdBQUcsS0FBSyxHQUFHLEtBQUssR0FBRyxLQUFLLEdBQUcsS0FBSyxHQUFHLEtBQUssR0FBRztBQUFBLE1BQzNELEdBQUcsS0FBSyxHQUFHLEtBQUssR0FBRyxLQUFLLEdBQUcsS0FBSyxHQUFHLEtBQUssR0FBRyxLQUFLLEdBQUcsS0FBSyxHQUFHO0FBQUEsTUFDM0QsR0FBRyxLQUFLLEdBQUcsS0FBSyxHQUFHLEtBQUssR0FBRyxLQUFLLEdBQUcsS0FBSyxHQUFHLEtBQUssR0FBRyxLQUFLLEdBQUc7QUFBQSxNQUMzRCxHQUFHLEtBQUssR0FBRyxLQUFLLEdBQUcsS0FBSyxHQUFHLEtBQUssR0FBRyxLQUFLLEdBQUcsS0FBSyxHQUFHLEtBQUssR0FBRztBQUFBLElBQzdEO0FBQUE7QUFBQSxFQUlGLFlBQVksQ0FBQyxHQUFHLEdBQUc7QUFBQSxJQUNqQixPQUFPLEtBQUssU0FBUyxLQUFLLFNBQVMsR0FBRyxDQUFDLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxFQUFFLElBQUksQ0FBQyxFQUFFLElBQUksQ0FBQyxFQUFFLElBQUksRUFBRSxFQUFFLENBQUMsRUFBRSxNQUFNLEdBQUcsQ0FBQztBQUFBO0FBQUEsRUFJdkcsS0FBSyxDQUFDLElBQUksSUFBSSxHQUFHO0FBQUEsSUFDZixNQUFNLE1BQU0sR0FBRyxLQUFLLEdBQUcsS0FBSyxHQUFHLEtBQUssR0FBRyxLQUFLLEdBQUcsS0FBSyxHQUFHLEtBQUssR0FBRyxLQUFLLEdBQUc7QUFBQSxJQUN2RSxNQUFNLFNBQVMsS0FBSyxLQUFLLEtBQUssSUFBSSxHQUFHLENBQUM7QUFBQSxJQUN0QyxNQUFNLFFBQVEsU0FBUztBQUFBLElBQ3ZCLE1BQU0sWUFBWSxLQUFLLElBQUksTUFBTTtBQUFBLElBQ2pDLE1BQU0sS0FBSyxLQUFLLElBQUksS0FBSyxJQUFJLE1BQU0sS0FBSyxJQUFJLEtBQUssSUFBSTtBQUFBLElBQ3JELE1BQU0sS0FBSyxLQUFLLElBQUksS0FBSyxJQUFJO0FBQUEsSUFDN0IsT0FBTyxDQUFDLEtBQUssR0FBRyxLQUFLLEtBQUssR0FBRyxJQUFJLEtB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T0FBTyxRQUFRLFdBQVcsU0FBUztBQUFBLEVBRTFFLFFBQVEsSUFBSSx5Q0FBOEI7QUFBQSxFQUMxQyxNQUFNLGVBQWUsWUFBWSxJQUFJO0FBQUEsRUFDckMsSUFBSTtBQUFBLElBQ0Y7QUFBQSxJQUNBLE1BQU0sYUFBYSxZQUFZLElBQUk7QUFBQSxJQUNuQyxRQUFRLElBQUksK0JBQThCLGFBQWEsY0FBYyxRQUFRLENBQUMsTUFBTTtBQUFBLElBQ3BGLFFBQVEsSUFBSSxzQ0FBMkI7QUFBQSxJQUN2QyxPQUFPLE9BQU87QUFBQSxJQUNkLFFBQVEsTUFBTSw4QkFBNkIsS0FBSztBQUFBLElBQ2hELE1BQU07QUFBQTtBQUFBLENBRVQsRUFBRSxNQUFNLFdBQVM7QUFBQSxFQUNoQixRQUFRLE1BQU0saUNBQWdDLEtBQUs7QUFBQSxFQUNuRCxNQUFNLDhCQUE2QjtBQUFBLENBQ3BDOyIsCiAgImRlYnVnSWQiOiAiREVFNjMxOTcwOTVFMEI0RjY0NzU2RTIxNjQ3NTZFMjEiLAogICJuYW1lcyI6IFtdCn0=
