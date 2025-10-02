/* ==============================
  🎨 색상 컨버터 모듈
  ============================== */

export const ColorConverter = {
  // 8자리 헥스코드 변환
  rgbaToHex(r, g, b, a = 255) {
    return chroma.rgb(r, g, b).alpha(a / 255).hex('rgba').toUpperCase();
  },
  // RGBA 직접 생성 (파싱 오버헤드 없음)
  rgba(r, g, b, a = 255) {
    return { r, g, b, a };
  },
  // 8자리 헥스코드 파싱
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
  // HSV → RGB 변환
  hsvToRgb(h, s, v) {
    const rgb = chroma.hsv(h, s, v).rgb();
    return {
      r: rgb[0],
      g: rgb[1],
      b: rgb[2]
    };
  },
  // HSV → 8자리 헥스코드 변환
  hsvToHex(h, s, v, a = 255) {
    return chroma.hsv(h, s, v).alpha(a / 255).hex('rgba').toUpperCase();
  },
  // RGB → HSL 변환
  rgbToHsl(r, g, b) {
    const hsl = chroma.rgb(r, g, b).hsl();
    return {
      h: Math.round(hsl[0] || 0),
      s: Math.round(hsl[1] * 100),
      l: Math.round(hsl[2] * 100)
    };
  },
  // HSL → RGB 변환
  hslToRgb(h, s, l) {
    const rgb = chroma.hsl(h, s, l).rgb();
    return {
      r: rgb[0],
      g: rgb[1],
      b: rgb[2]
    };
  },
  // HSL → 8자리 헥스코드 변환
  hslToHex(h, s, l, a = 255) {
    return chroma.hsl(h, s, l).alpha(a / 255).hex('rgba').toUpperCase();
  }
};

