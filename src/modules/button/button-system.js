/* ==============================
  🔘 버튼 시스템 - 통합 모듈
  ============================== */

import { BUTTON_CONSTANTS } from './constants.js';
import { PaletteManager } from './palette-manager.js';
import { StyleManager } from './style-manager.js';

export const ButtonSystem = {
  CONSTANTS: BUTTON_CONSTANTS,
  
  state: {
    styleCache: new WeakMap()
  },
  
  PaletteManager,
  StyleManager,
  
  async init() {
    console.log('🔘 [ButtonSystem] 초기화 시작');
    const initStart = performance.now();
    
    // 1단계: SVG 로딩 및 DOM 주입
    console.log('  ├─ 1단계: SVG 로딩 및 DOM 주입');
    const svgStart = performance.now();
    await window.AppUtils.SVGLoader.loadAndInject();
    console.log(`  ✅ SVG 로딩 완료 (${(performance.now() - svgStart).toFixed(2)}ms)`);
    
    // 2단계: 토글 버튼 구조 준비
    console.log('  ├─ 2단계: 토글 버튼 구조 준비');
    await this.StyleManager.setupIconInjection();
    console.log('  ✅ 토글 버튼 준비 완료');
    
    // 3단계: 팔레트 CSS 생성
    console.log('  ├─ 3단계: 팔레트 CSS 생성');
    this.PaletteManager.generateCSS();
    console.log('  ✅ 팔레트 CSS 생성 완료');
    
    // 4단계: 동적 스타일 적용
    console.log('  ├─ 4단계: 동적 스타일 적용');
    this.StyleManager.applyDynamicStyles();
    console.log('  ✅ 동적 스타일 적용 완료');
    
    // 5단계: 자동 업데이트 매니저 설정
    console.log('  ├─ 5단계: 자동 업데이트 매니저 설정');
    this.StyleManager.setupUpdateManager();
    console.log('  ✅ 업데이트 매니저 설정 완료');
    
    const initEnd = performance.now();
    console.log(`🎉 [ButtonSystem] 초기화 완료 (총 ${(initEnd - initStart).toFixed(2)}ms)`);
  }
};
