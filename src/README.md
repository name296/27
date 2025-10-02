# src/ - JavaScript 소스 코드

## 📁 구조

```
src/
├── index.js                    # 애플리케이션 진입점
├── app.js                      # CustomPaletteManager & 초기화
├── lib/
│   └── chroma.min.js           # Chroma.js 로컬 캐시 (CDN 폴백용)
└── modules/
    ├── color/                  # 색상 처리 모듈
    │   ├── converter.js        # RGB↔HSL↔HSV↔HEX 변환
    │   ├── topology.js         # 3D 색상 구체 위상 계산
    │   └── mechanics.js        # 구체 렌더링 & 회전 시스템
    ├── utils/                  # 공통 유틸리티
    │   ├── svg-loader.js       # SVG 로딩 + currentColor 변환
    │   └── css-injector.js     # 동적 CSS 주입
    ├── button/                 # 버튼 시스템
    │   ├── constants.js        # 버튼 상수 정의
    │   ├── palette-manager.js  # 팔레트 CSS 생성
    │   ├── style-manager.js    # 동적 스타일 & 명도대비
    │   └── button-system.js    # 버튼 시스템 통합
    └── managers/               # 전역 상태 관리자
        ├── theme-manager.js    # Light/Dark 테마
        ├── large-mode-manager.js # 큰글씨 모드
        └── size-control-manager.js # 버튼 크기 조절
```

## 🔄 모듈 로딩 순서

```
1. index.html
   ↓ <script type="module" src="src/index.js">

2. src/index.js (ES6 모듈)
   ↓ import 모든 모듈
   ↓ window로 export
   ↓ Chroma.js 동적 로드

3. src/app.js (동적 import)
   ↓ window에서 모듈 가져옴
   ↓ CustomPaletteManager 정의
   ↓ 초기화 실행
```

## ✅ 완성된 모듈

### color/ - 색상 처리
| 파일 | Export | 설명 | 의존성 |
|------|--------|------|--------|
| converter.js | ColorConverter | RGB/HSL/HSV/HEX 변환 | chroma.js |
| topology.js | Topology | 구면 좌표 → 색상 계산 | - |
| mechanics.js | Mechanics | 3D 구체 렌더링 & 인터랙션 | Topology, ColorConverter |

### utils/ - 유틸리티
| 파일 | Export | 설명 | 의존성 |
|------|--------|------|--------|
| svg-loader.js | SVGLoader | SVG 파일 로딩, currentColor 변환 | svg/icon/index.js |
| css-injector.js | CSSInjector | <style> 태그 동적 주입 | - |

### button/ - 버튼 시스템
| 파일 | Export | 설명 | 의존성 |
|------|--------|------|--------|
| constants.js | BUTTON_CONSTANTS | 크기/간격 상수 | - |
| palette-manager.js | PaletteManager | 팔레트 CSS 생성 | CSSInjector |
| style-manager.js | StyleManager | 동적 스타일, 명도대비 | BUTTON_CONSTANTS |
| button-system.js | ButtonSystem | 시스템 통합 & 초기화 | PaletteManager, StyleManager |

### managers/ - 전역 관리자
| 파일 | Export | 설명 | 의존성 |
|------|--------|------|--------|
| theme-manager.js | ThemeManager | Light/Dark 테마 전환 | - |
| large-mode-manager.js | LargeTextManager | 큰글씨 모드 | - |
| size-control-manager.js | SizeControlManager | 버튼 크기 조절 | ButtonSystem (약한 의존) |

## 🎯 모듈 설계 원칙

### 1. 단일 책임 원칙 (SRP)
각 모듈은 하나의 책임만 가집니다.

### 2. 순환 의존 방지
명확한 의존성 방향 (레벨 0 → 1 → 2 → 3 → 4)

### 3. 관측성
상세한 로깅 + 성능 측정

### 4. 확장성
새 모듈 추가가 쉬움

## 📝 새 모듈 추가하기

```javascript
// 1. 모듈 생성
// src/modules/my-module.js
export const MyModule = {
  doSomething() {
    console.log('✅ [MyModule] 작동');
  }
};

// 2. index.js에서 import
import { MyModule } from './modules/my-module.js';
window.MyModule = MyModule;

// 3. 사용
// app.js 또는 다른 곳에서
const { MyModule } = window;
MyModule.doSomething();
```

## 🔍 디버깅

### 콘솔 로그 확인
```
📦 [index.js] ES6 모듈 로딩 시작
✅ [index.js] 모든 모듈 import 완료 (12.34ms)
📤 [index.js] window 객체로 export 시작...
✅ [index.js] 전역 export 완료
📥 [index.js] Chroma.js 로드 시작...
✅ [index.js] Chroma.js 로드 완료 (23.45ms)
📥 [index.js] app.js 로드 시작...
✅ [app.js] 모든 모듈 import 완료
🚀 [app.js] 애플리케이션 초기화 시작
  🎨 [ThemeManager] 초기화 완료
  📏 [LargeTextManager] 초기화 완료
  📐 [SizeControlManager] 초기화 완료
  🔘 [ButtonSystem] 초기화 완료
✅ [app.js] 모든 시스템 초기화 완료
```

### window 객체 확인
```javascript
console.log(window.ButtonSystem);
console.log(window.AppUtils.SVGLoader.cache);
```

## 🔧 유지보수

### 아이콘 관리
```bash
# 아이콘 추가/삭제 후
.\scripts\update-icons.ps1

# 출력:
# Changes:
#   + Added: 2
#   - Removed: 1
#   Total: 34 icons
```

### 모듈 업데이트
각 모듈이 독립적이므로 개별 수정 가능

## 📈 파일 크기

| 구분 | 라인 수 | 설명 |
|------|---------|------|
| **이전** | 2726줄 | 단일 파일 |
| **현재** | ~1200줄 | 15개 모듈 |
| **감소율** | 56% | 체계적 분리 |

## 🎓 학습 포인트

이 프로젝트에서 배울 수 있는 것:

1. **ES6 모듈 시스템** - import/export
2. **의존성 관리** - 순환 방지, 명확한 그래프
3. **성능 최적화** - 캐시, 병렬 로딩, 쓰로틀링
4. **자동화** - 스크립트, Git Hook, CI/CD
5. **관측성** - 로깅, 성능 측정
6. **접근성** - ARIA, 키보드 네비게이션
7. **3D 그래픽스** - 쿼터니언, 구면 좌표

## 🔗 관련 문서

- [../README.md](../README.md) - 프로젝트 전체 개요
- [scripts/README.md](../scripts/README.md) - 스크립트 사용법
- [svg/icon/index.js](../svg/icon/index.js) - 아이콘 목록 (자동 생성)

---

**Made with ❤️ by 이강철**
