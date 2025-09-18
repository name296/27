/**
 * 🎯 렌더링된 색상 기반 명도대비 계산 모듈
 * - 복잡한 CSS 속성 계산 없이 렌더링된 색상만 사용
 * - 정확하고 간단한 명도대비 계산
 */

class RenderedColorContrastCalculator {
  constructor() {
    this.wcagThresholds = {
      normal: { AA: 4.5, AAA: 7 },
      large: { AA: 3, AAA: 4.5 }
    };
  }

  /**
   * CSS 색상을 RGB 객체로 변환
   * @param {string} cssColor - CSS 색상 문자열
   * @returns {Object|null} RGB 객체 또는 null
   */
  parseCSSColor(cssColor) {
    if (!cssColor || cssColor === 'transparent' || cssColor === 'rgba(0, 0, 0, 0)') {
      return null;
    }

    // rgba 형식 파싱
    const rgbaMatch = cssColor.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*([\d.]+))?\)/);
    if (rgbaMatch) {
      return {
        r: parseInt(rgbaMatch[1]),
        g: parseInt(rgbaMatch[2]),
        b: parseInt(rgbaMatch[3]),
        a: rgbaMatch[4] ? parseFloat(rgbaMatch[4]) : 1
      };
    }

    // hex 형식 파싱
    if (cssColor.startsWith('#')) {
      const hex = cssColor.slice(1);
      if (hex.length === 3) {
        // #RGB 형식
        return {
          r: parseInt(hex[0] + hex[0], 16),
          g: parseInt(hex[1] + hex[1], 16),
          b: parseInt(hex[2] + hex[2], 16),
          a: 1
        };
      } else if (hex.length === 6) {
        // #RRGGBB 형식
        return {
          r: parseInt(hex.substr(0, 2), 16),
          g: parseInt(hex.substr(2, 2), 16),
          b: parseInt(hex.substr(4, 2), 16),
          a: 1
        };
      }
    }

    return null;
  }

  /**
   * 상대 휘도 계산 (WCAG 기준)
   * @param {Object} rgb - RGB 객체
   * @returns {number} 상대 휘도 값
   */
  getLuminance(rgb) {
    const [r, g, b] = [rgb.r, rgb.g, rgb.b].map(c => {
      c = c / 255;
      return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
    });

    return 0.2126 * r + 0.7152 * g + 0.0722 * b;
  }

  /**
   * 명도대비 비율 계산
   * @param {string} color1 - 첫 번째 CSS 색상
   * @param {string} color2 - 두 번째 CSS 색상
   * @returns {number|null} 명도대비 비율 또는 null
   */
  calculateContrast(color1, color2) {
    if (!color1 || !color2) return null;

    const rgb1 = this.parseCSSColor(color1);
    const rgb2 = this.parseCSSColor(color2);

    if (!rgb1 || !rgb2) return null;

    const lum1 = this.getLuminance(rgb1);
    const lum2 = this.getLuminance(rgb2);

    const lighter = Math.max(lum1, lum2);
    const darker = Math.min(lum1, lum2);

    return (lighter + 0.05) / (darker + 0.05);
  }

  /**
   * WCAG 기준 확인
   * @param {number} contrastRatio - 명도대비 비율
   * @param {string} textSize - 텍스트 크기 ('normal' 또는 'large')
   * @returns {Object} WCAG 준수 여부
   */
  checkWCAGCompliance(contrastRatio, textSize = 'normal') {
    if (!contrastRatio) return { AA: false, AAA: false, ratio: 0 };

    const thresholds = this.wcagThresholds[textSize] || this.wcagThresholds.normal;

    return {
      AA: contrastRatio >= thresholds.AA,
      AAA: contrastRatio >= thresholds.AAA,
      ratio: contrastRatio,
      thresholds: thresholds
    };
  }

  /**
   * 색상을 HEX 문자열로 변환
   * @param {string} cssColor - CSS 색상 문자열
   * @returns {string} HEX 색상 문자열
   */
  toHex(cssColor) {
    const rgb = this.parseCSSColor(cssColor);
    if (!rgb) return null;

    const toHex = (n) => {
      const hex = Math.round(n).toString(16);
      return hex.length === 1 ? '0' + hex : hex;
    };

    return `#${toHex(rgb.r)}${toHex(rgb.g)}${toHex(rgb.b)}`;
  }

  /**
   * 색상을 RGB 문자열로 변환
   * @param {string} cssColor - CSS 색상 문자열
   * @returns {string} RGB 색상 문자열
   */
  toRGB(cssColor) {
    const rgb = this.parseCSSColor(cssColor);
    if (!rgb) return null;

    return `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`;
  }
}

/**
 * 🎨 버튼 색상 추출기
 * - 현재 프로젝트의 버튼 구조에 맞춤
 * - 렌더링된 색상만 추출
 */
class ButtonColorExtractor {
  /**
   * 버튼의 렌더링된 색상들 추출
   * @param {HTMLElement} buttonElement - 버튼 요소
   * @returns {Object} 추출된 색상들
   */
  extractButtonColors(buttonElement) {
    const background = buttonElement.querySelector('.background.dynamic');
    const content = buttonElement.querySelector('.content');
    const icon = buttonElement.querySelector('.content.icon svg');

    return {
      surfaceColor: background ? getComputedStyle(background).backgroundColor : null,
      textColor: content ? getComputedStyle(content).color : null,
      iconColor: icon ? getComputedStyle(icon).fill : null,
      borderColor: background ? getComputedStyle(background).outlineColor : null
    };
  }

  /**
   * 모든 버튼의 렌더링된 색상 추출
   * @returns {Array} 모든 버튼의 색상 정보
   */
  extractAllButtonColors() {
    const buttons = document.querySelectorAll('.button');
    return Array.from(buttons).map(button => ({
      element: button,
      className: button.className,
      colors: this.extractButtonColors(button)
    }));
  }

  /**
   * 특정 팔레트의 버튼들만 추출
   * @param {string} palette - 팔레트 이름 (예: 'primary1', 'secondary2')
   * @returns {Array} 해당 팔레트의 버튼들
   */
  extractPaletteColors(palette) {
    const buttons = document.querySelectorAll(`.button.${palette}`);
    return Array.from(buttons).map(button => ({
      element: button,
      className: button.className,
      colors: this.extractButtonColors(button)
    }));
  }
}

/**
 * 🔍 명도대비 분석기
 * - 버튼의 명도대비를 종합적으로 분석
 * - WCAG 기준 자동 검사
 */
class ContrastAnalyzer {
  constructor() {
    this.calculator = new RenderedColorContrastCalculator();
    this.extractor = new ButtonColorExtractor();
  }

  /**
   * 단일 버튼의 명도대비 분석
   * @param {HTMLElement} buttonElement - 버튼 요소
   * @returns {Object} 명도대비 분석 결과
   */
  analyzeButton(buttonElement) {
    const colors = this.extractor.extractButtonColors(buttonElement);
    
    const result = {
      element: buttonElement,
      className: buttonElement.className,
      colors: colors,
      contrast: {},
      compliance: {}
    };

    // 텍스트 명도대비
    if (colors.surfaceColor && colors.textColor) {
      const textContrast = this.calculator.calculateContrast(colors.surfaceColor, colors.textColor);
      result.contrast.text = textContrast;
      result.compliance.text = this.calculator.checkWCAGCompliance(textContrast);
    }

    // 아이콘 명도대비
    if (colors.surfaceColor && colors.iconColor) {
      const iconContrast = this.calculator.calculateContrast(colors.surfaceColor, colors.iconColor);
      result.contrast.icon = iconContrast;
      result.compliance.icon = this.calculator.checkWCAGCompliance(iconContrast);
    }

    // 테두리 명도대비
    if (colors.surfaceColor && colors.borderColor) {
      const borderContrast = this.calculator.calculateContrast(colors.surfaceColor, colors.borderColor);
      result.contrast.border = borderContrast;
      result.compliance.border = this.calculator.checkWCAGCompliance(borderContrast);
    }

    return result;
  }

  /**
   * 모든 버튼의 명도대비 분석
   * @returns {Array} 모든 버튼의 분석 결과
   */
  analyzeAllButtons() {
    const buttons = document.querySelectorAll('.button');
    return Array.from(buttons).map(button => this.analyzeButton(button));
  }

  /**
   * 특정 팔레트의 명도대비 분석
   * @param {string} palette - 팔레트 이름
   * @returns {Array} 해당 팔레트의 분석 결과
   */
  analyzePalette(palette) {
    const buttons = document.querySelectorAll(`.button.${palette}`);
    return Array.from(buttons).map(button => this.analyzeButton(button));
  }

  /**
   * WCAG 기준 미달 버튼들 필터링
   * @param {Array} analysisResults - 분석 결과 배열
   * @returns {Array} WCAG 기준 미달 버튼들
   */
  filterNonCompliantButtons(analysisResults) {
    return analysisResults.filter(result => {
      const textCompliant = result.compliance.text ? result.compliance.text.AA : true;
      const iconCompliant = result.compliance.icon ? result.compliance.icon.AA : true;
      return !textCompliant || !iconCompliant;
    });
  }

  /**
   * 분석 결과 요약
   * @param {Array} analysisResults - 분석 결과 배열
   * @returns {Object} 요약 정보
   */
  summarizeResults(analysisResults) {
    const total = analysisResults.length;
    const nonCompliant = this.filterNonCompliantButtons(analysisResults).length;
    const compliant = total - nonCompliant;

    return {
      total: total,
      compliant: compliant,
      nonCompliant: nonCompliant,
      complianceRate: total > 0 ? (compliant / total * 100).toFixed(1) : 0,
      results: analysisResults
    };
  }
}

/**
 * 📊 실시간 모니터링
 * - 버튼 상태 변화 시 자동 명도대비 검사
 * - 개발자 도구 통합
 */
class ContrastMonitor {
  constructor() {
    this.analyzer = new ContrastAnalyzer();
    this.isMonitoring = false;
    this.observer = null;
  }

  /**
   * 실시간 모니터링 시작
   */
  startMonitoring() {
    if (this.isMonitoring) return;

    this.observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === 'attributes' && 
            (mutation.attributeName === 'class' || mutation.attributeName === 'style')) {
          this.checkElementContrast(mutation.target);
        }
      });
    });

    this.observer.observe(document.body, {
      attributes: true,
      subtree: true,
      attributeFilter: ['class', 'style']
    });

    this.isMonitoring = true;
    console.log('🎯 명도대비 모니터링 시작');
  }

  /**
   * 모니터링 중지
   */
  stopMonitoring() {
    if (this.observer) {
      this.observer.disconnect();
      this.observer = null;
    }
    this.isMonitoring = false;
    console.log('⏹️ 명도대비 모니터링 중지');
  }

  /**
   * 요소의 명도대비 검사
   * @param {HTMLElement} element - 검사할 요소
   */
  checkElementContrast(element) {
    if (element.classList.contains('button')) {
      const analysis = this.analyzer.analyzeButton(element);
      this.logContrastResult(analysis);
    }
  }

  /**
   * 명도대비 결과 로깅
   * @param {Object} analysis - 분석 결과
   */
  logContrastResult(analysis) {
    const textCompliant = analysis.compliance.text ? analysis.compliance.text.AA : true;
    const iconCompliant = analysis.compliance.icon ? analysis.compliance.icon.AA : true;

    if (!textCompliant || !iconCompliant) {
      console.warn('⚠️ 접근성 경고:', {
        element: analysis.className,
        textContrast: analysis.contrast.text,
        iconContrast: analysis.contrast.icon,
        textCompliant: textCompliant,
        iconCompliant: iconCompliant
      });
    }
  }
}

// 전역 인스턴스 생성
window.ContrastCalculator = new RenderedColorContrastCalculator();
window.ButtonColorExtractor = new ButtonColorExtractor();
window.ContrastAnalyzer = new ContrastAnalyzer();
window.ContrastMonitor = new ContrastMonitor();

// 자동 초기화
document.addEventListener('DOMContentLoaded', () => {
  console.log('🎯 명도대비 계산 모듈 로드 완료');
  
  // 전체 분석 실행
  const summary = window.ContrastAnalyzer.summarizeResults(
    window.ContrastAnalyzer.analyzeAllButtons()
  );
  
  console.log('📊 명도대비 분석 결과:', summary);
  
  // 실시간 모니터링 시작
  window.ContrastMonitor.startMonitoring();
});

// 개발자 도구용 헬퍼 함수
window.checkContrast = (element) => {
  if (element && element.classList.contains('button')) {
    return window.ContrastAnalyzer.analyzeButton(element);
  }
  return null;
};

window.checkAllContrast = () => {
  return window.ContrastAnalyzer.analyzeAllButtons();
};

window.checkPaletteContrast = (palette) => {
  return window.ContrastAnalyzer.analyzePalette(palette);
};

console.log('🎯 명도대비 계산 모듈 리빌딩 완료!');
console.log('사용법:');
console.log('- checkContrast(element): 단일 버튼 검사');
console.log('- checkAllContrast(): 전체 버튼 검사');
console.log('- checkPaletteContrast(palette): 특정 팔레트 검사');
