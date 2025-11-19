/* ==============================
  🚀 애플리케이션 진입점 - ES6 모듈
  ============================== */

console.log('📦 [index.js] ES6 모듈 로딩 시작');
const moduleLoadStart = performance.now();

// 핵심 모듈 Import
import { ColorConverter } from './modules/color/converter.js';
import { Topology } from './modules/color/topology.js';
import { Mechanics } from './modules/color/mechanics.js';
import { SVGLoader } from './modules/utils/svg-loader.js';
import { CSSInjector } from './modules/utils/css-injector.js';
import { BUTTON_CONSTANTS } from './modules/button/constants.js';
import { PaletteManager } from './modules/button/palette-manager.js';
import { StyleManager } from './modules/button/style-manager.js';
import { ButtonSystem } from './modules/button/button-system.js';
import { ThemeManager } from './modules/managers/theme-manager.js';
import { LargeTextManager } from './modules/managers/large-mode-manager.js';
import { SizeControlManager } from './modules/managers/size-control-manager.js';
import { CustomPaletteManager } from './modules/managers/custom-palette-manager.js';
import { ColorSphereUI } from './modules/ui/color-sphere-ui.js';
import { createIconMap, getIconPath, fallbackIcon } from './assets/icons/index.js';

const moduleLoadEnd = performance.now();
console.log(`✅ [index.js] 모든 모듈 import 완료 (${(moduleLoadEnd - moduleLoadStart).toFixed(2)}ms)`);

// 전역 Export
console.log('📤 [index.js] window 객체로 export 시작...');
window.ColorConverter = ColorConverter;
window.Topology = Topology;
window.Mechanics = Mechanics;
window.AppUtils = { SVGLoader, CSSInjector };
window.ButtonSystem = ButtonSystem;
window.ThemeManager = ThemeManager;
window.LargeTextManager = LargeTextManager;
window.SizeControlManager = SizeControlManager;
window.CustomPaletteManager = CustomPaletteManager;
window.ColorSphereUI = ColorSphereUI;
window.BUTTON_CONSTANTS = BUTTON_CONSTANTS;

console.log('✅ [index.js] 전역 export 완료');

// Chroma.js 로드 (CDN 우선 + 로컬 폴백)
console.log('📥 [index.js] Chroma.js 로드 시작...');

const loadChroma = async () => {
  const CDN_URL = 'https://cdn.jsdelivr.net/npm/chroma-js@2.4.2/chroma.min.js';
  const LOCAL_URL = './src/lib/chroma.min.js';
  
  return new Promise((resolve, reject) => {
    const chromaScript = document.createElement('script');
    
    chromaScript.src = CDN_URL;
    console.log('🌐 [index.js] CDN에서 로드 시도:', CDN_URL);
    
    chromaScript.onload = () => {
      console.log('✅ [index.js] CDN에서 Chroma.js 로드 성공');
      resolve('cdn');
    };
    
    chromaScript.onerror = () => {
      console.warn('⚠️ [index.js] CDN 로드 실패, 로컬 파일 시도...');
      
      const fallbackScript = document.createElement('script');
      fallbackScript.src = LOCAL_URL;
      console.log('💾 [index.js] 로컬 캐시에서 로드 시도:', LOCAL_URL);
      
      fallbackScript.onload = () => {
        console.log('✅ [index.js] 로컬 캐시에서 Chroma.js 로드 성공');
        resolve('local');
      };
      
      fallbackScript.onerror = () => {
        console.error('❌ [index.js] 로컬 파일도 로드 실패');
        reject(new Error('Chroma.js 로드 실패 (CDN & 로컬 모두 실패)'));
      };
      
      document.head.appendChild(fallbackScript);
    };
    
    document.head.appendChild(chromaScript);
  });
};

loadChroma().then(async (source) => {
  const chromaLoadTime = performance.now();
  console.log(`✅ [index.js] Chroma.js 로드 완료 (${source.toUpperCase()}) (${chromaLoadTime.toFixed(2)}ms)`);
  console.log('🔍 [index.js] chroma 버전:', window.chroma?.version || 'unknown');
  
  console.log('📥 [index.js] app.js 로드 시작...');
  const appLoadStart = performance.now();
  try {
    await import('./app.js');
    const appLoadEnd = performance.now();
    console.log(`✅ [index.js] app.js 로드 완료 (${(appLoadEnd - appLoadStart).toFixed(2)}ms)`);
    console.log('🎉 [index.js] 전체 시스템 로드 완료');
  } catch (error) {
    console.error('❌ [index.js] app.js 로드 실패:', error);
    throw error;
  }
}).catch(error => {
  console.error('❌ [index.js] Chroma.js 로드 실패:', error);
  alert('Chroma.js 라이브러리를 로드할 수 없습니다.');
});
