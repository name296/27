/* ==============================
  🌐 통합 위상 시스템 모듈
  ============================== */

export const Topology = {
  // 공통 좌표계 상수
  COORDINATE_SYSTEM: {
    // 구면 좌표계 (3D 구체 표면)
    SPHERICAL: {
      NORTH_POLE: { theta: 0, phi: 0 },
      SOUTH_POLE: { theta: Math.PI, phi: 0 },
      EQUATOR: { theta: Math.PI/2, phi: 0 }
    },
    
    // 직교 좌표계 (3D 공간)
    CARTESIAN: {
      ORIGIN: { x: 0, y: 0, z: 0 },
      NORTH_POLE: { x: 0, y: 0, z: 1 },
      NORTH_POLE: { x: 0, y: 0, z: -1 }
    },
    
    // 구체 극점 색상 정의
    POLAR_COLORS: {
      NORTH_POLE: { r: 255, g: 255, b: 255 },
      SOUTH_POLE: { r: 0, g: 0, b: 0 }
    },

    // 화면 좌표계 (2D 평면)
    SCREEN: {
      CENTER: { x: 0, y: 0 },
      UNIT_RADIUS: 1
    },
  },

  // 구면좌표 → 표면색상 / 구간없음
  calculateColor(theta, phi) {
    const hue = ((phi + Math.PI) / (2 * Math.PI)) * 360;
    const h6 = Math.floor(hue / 60) % 6;
    const f = (hue % 60) / 60;
    
    const getHueColor = () => {
      switch(h6) {
        case 0: return { r: 255, g: Math.round(f * 255), b: 0 };
        case 1: return { r: Math.round((1-f) * 255), g: 255, b: 0 };
        case 2: return { r: 0, g: 255, b: Math.round(f * 255) };
        case 3: return { r: 0, g: Math.round((1-f) * 255), b: 255 };
        case 4: return { r: Math.round(f * 255), g: 0, b: 255 };
        case 5: return { r: 255, g: 0, b: Math.round((1-f) * 255) };
      }
    };
    
    const thetaDeg = theta * 180 / Math.PI;
    const lightnessRatio = thetaDeg < 90 ? 1.0 - ((thetaDeg - 3) / 84) * 0.5 : 0.5 - ((thetaDeg - 93) / 84) * 0.5;
    const { r: baseR, g: baseG, b: baseB } = getHueColor();
    const totalSaturation = Math.sin(theta);
    const gray = Math.round(lightnessRatio * 255);
    
    return {
      r: Math.round(gray + (baseR - gray) * totalSaturation),
      g: Math.round(gray + (baseG - gray) * totalSaturation),
      b: Math.round(gray + (baseB - gray) * totalSaturation)
    };
  },

  // 구면좌표 → 색상 / 구간있음
  calculateColor2(theta, phi) {
    const thetaDeg = theta * 180 / Math.PI;
    const isPolarRegion = (thetaDeg < 3 || thetaDeg > 177);
    const isEquatorRegion = (Math.abs(thetaDeg - 90) < 3);
    
    if (isPolarRegion) {
      return thetaDeg < 3 ? this.COORDINATE_SYSTEM.POLAR_COLORS.NORTH_POLE : this.COORDINATE_SYSTEM.POLAR_COLORS.SOUTH_POLE;
    }
    
    const hue = ((phi + Math.PI) / (2 * Math.PI)) * 360;
    const h6 = Math.floor(hue / 60) % 6;
    const f = (hue % 60) / 60;
    
    const getHueColor = () => {
      switch(h6) {
        case 0: return { r: 255, g: Math.round(f * 255), b: 0 };
        case 1: return { r: Math.round((1-f) * 255), g: 255, b: 0 };
        case 2: return { r: 0, g: 255, b: Math.round(f * 255) };
        case 3: return { r: 0, g: Math.round((1-f) * 255), b: 255 };
        case 4: return { r: Math.round(f * 255), g: 0, b: 255 };
        case 5: return { r: 255, g: 0, b: Math.round((1-f) * 255) };
      }
    };
    
    if (isEquatorRegion) {
      return getHueColor();
    }
    
    const lightnessRatio = thetaDeg < 90 ? 1.0 - ((thetaDeg - 3) / 84) * 0.5 : 0.5 - ((thetaDeg - 93) / 84) * 0.5;
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

