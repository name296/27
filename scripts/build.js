// 빌드 스크립트
// set-base-path.js를 먼저 실행하여 BASE_PATH와 NODE_ENV 설정
// 그 다음 bun build 실행 + 정적 파일 복사

import './set-base-path.js';
import { build } from 'bun';
import { cpSync, mkdirSync, readFileSync, writeFileSync, rmSync } from 'fs';

// set-base-path.js가 환경 변수를 설정했으므로, 그 값을 사용
const nodeEnv = process.env.NODE_ENV || 'production';
const basePath = process.env.BASE_PATH || '';

console.log('🏗️  Building for GitHub Pages...');
console.log(`   BASE_PATH: ${basePath || '(none)'}`);
console.log(`   NODE_ENV: ${nodeEnv}`);

// dist 폴더 초기화
try {
  rmSync('./dist', { recursive: true, force: true });
  console.log('🗑️  Cleaned dist folder');
} catch (error) {
  // 폴더가 없는 경우 무시
}

mkdirSync('./dist', { recursive: true });

// 1. JavaScript 빌드
console.log('📦 Building JavaScript...');
await build({
  entrypoints: ['src/index.js'],
  outdir: 'dist',
  target: 'browser',
  format: 'esm',
  minify: true,
  sourcemap: 'external',
  define: {
    'process.env.NODE_ENV': JSON.stringify(nodeEnv),
    'process.env.BASE_PATH': JSON.stringify(basePath)
  }
});

// 2. public 폴더 복사
console.log('📁 Copying public folder...');
cpSync('./public', './dist/public', { recursive: true });

// 3. index.html 복사 및 경로 수정
console.log('📄 Processing index.html...');
let html = readFileSync('./index.html', 'utf8');

// 경로를 BASE_PATH 포함하도록 수정
const distPath = basePath ? `${basePath}/dist/index.js` : '/dist/index.js';
html = html.replace('/dist/index.js', distPath);

writeFileSync('./dist/index.html', html);

// 4. 404.html 생성 (SPA 라우팅을 위해 - 필요시)
console.log('📄 Creating 404.html...');
writeFileSync('./dist/404.html', html);

console.log('✅ Build complete!');
console.log('📦 Output directory: ./dist');
console.log('🚀 Deploy the ./dist folder to GitHub Pages');

