/* ==============================
  ?? ?좏뵆由ъ??댁뀡 吏꾩엯??- 紐⑤뱢 ?듯빀
  ============================== */

console.log('?벀 [index.js] ES6 紐⑤뱢 濡쒕뵫 ?쒖옉');
const moduleLoadStart = performance.now();

// ?듭떖 紐⑤뱢 Import
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
import { createIconMap, getIconPath, fallbackIcon } from '../svg/icon/index.js';

const moduleLoadEnd = performance.now();
console.log(`??[index.js] 紐⑤뱺 紐⑤뱢 import ?꾨즺 (${(moduleLoadEnd - moduleLoadStart).toFixed(2)}ms)`);

// ?꾩뿭 Export
console.log('?뱾 [index.js] window 媛앹껜濡?export ?쒖옉...');
window.ColorConverter = ColorConverter;
window.Topology = Topology;
window.Mechanics = Mechanics;
window.AppUtils = { SVGLoader, CSSInjector };
window.ButtonSystem = ButtonSystem;
window.ThemeManager = ThemeManager;
window.LargeTextManager = LargeTextManager;
window.SizeControlManager = SizeControlManager;
window.CustomPaletteManager = CustomPaletteManager;
window.BUTTON_CONSTANTS = BUTTON_CONSTANTS;
window.PaletteManager = PaletteManager;
window.StyleManager = StyleManager;
window.createIconMap = createIconMap;
window.getIconPath = getIconPath;
window.fallbackIcon = fallbackIcon;

console.log('??[index.js] ?꾩뿭 export ?꾨즺');
console.log('?벀 [index.js] Export??紐⑤뱢:', Object.keys({
  ColorConverter, Topology, Mechanics, AppUtils, ButtonSystem, 
  ThemeManager, LargeTextManager, SizeControlManager, BUTTON_CONSTANTS
}));

// Chroma.js 濡쒕뱶 (CDN ?곗꽑 + 濡쒖뺄 ?대갚)
console.log('?뱿 [index.js] Chroma.js 濡쒕뱶 ?쒖옉...');

const loadChroma = async () => {
  const CDN_URL = 'https://cdn.jsdelivr.net/npm/chroma-js@2.4.2/chroma.min.js';
  const LOCAL_URL = './src/lib/chroma.min.js';
  
  return new Promise((resolve, reject) => {
    const chromaScript = document.createElement('script');
    
    // CDN ?쒕룄
    chromaScript.src = CDN_URL;
    console.log('?뙋 [index.js] CDN?먯꽌 濡쒕뱶 ?쒕룄:', CDN_URL);
    
    chromaScript.onload = () => {
      console.log('??[index.js] CDN?먯꽌 Chroma.js 濡쒕뱶 ?깃났');
      resolve('cdn');
    };
    
    chromaScript.onerror = () => {
      console.warn('?좑툘 [index.js] CDN 濡쒕뱶 ?ㅽ뙣, 濡쒖뺄 ?뚯씪 ?쒕룄...');
      
      // 濡쒖뺄 ?대갚
      const fallbackScript = document.createElement('script');
      fallbackScript.src = LOCAL_URL;
      console.log('?뮶 [index.js] 濡쒖뺄 罹먯떆?먯꽌 濡쒕뱶 ?쒕룄:', LOCAL_URL);
      
      fallbackScript.onload = () => {
        console.log('??[index.js] 濡쒖뺄 罹먯떆?먯꽌 Chroma.js 濡쒕뱶 ?깃났');
        resolve('local');
      };
      
      fallbackScript.onerror = () => {
        console.error('??[index.js] 濡쒖뺄 ?뚯씪??濡쒕뱶 ?ㅽ뙣');
        reject(new Error('Chroma.js 濡쒕뱶 ?ㅽ뙣 (CDN & 濡쒖뺄 紐⑤몢 ?ㅽ뙣)'));
      };
      
      document.head.appendChild(fallbackScript);
    };
    
    document.head.appendChild(chromaScript);
  });
};

// Chroma.js 濡쒕뱶 諛??좏뵆由ъ??댁뀡 ?쒖옉
loadChroma().then(async (source) => {
  const chromaLoadTime = performance.now();
  console.log(`??[index.js] Chroma.js 濡쒕뱶 ?꾨즺 (${source.toUpperCase()}) (${chromaLoadTime.toFixed(2)}ms)`);
  console.log('?뵇 [index.js] chroma 踰꾩쟾:', window.chroma?.version || 'unknown');
  console.log('?뵇 [index.js] chroma 媛앹껜:', typeof window.chroma);
  
  // app.js ?숈쟻 import (CustomPaletteManager ?ы븿)
  console.log('?뱿 [index.js] app.js 濡쒕뱶 ?쒖옉...');
  const appLoadStart = performance.now();
  try {
    const appModule = await import('./app.js');
    const appLoadEnd = performance.now();
    console.log(`??[index.js] app.js 濡쒕뱶 ?꾨즺 (${(appLoadEnd - appLoadStart).toFixed(2)}ms)`);
    console.log('?럦 [index.js] ?꾩껜 ?쒖뒪??濡쒕뱶 ?꾨즺');
  } catch (error) {
    console.error('??[index.js] app.js 濡쒕뱶 ?ㅽ뙣:', error);
    console.error('?ㅽ깮 異붿쟻:', error.stack);
    throw error;
  }
}).catch(error => {
  console.error('??[index.js] Chroma.js 濡쒕뱶 ?ㅽ뙣:', error);
  alert('Chroma.js ?쇱씠釉뚮윭由щ? 濡쒕뱶?????놁뒿?덈떎. ?명꽣???곌껐???뺤씤?섏꽭??');
});

