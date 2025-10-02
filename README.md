# 버튼 컴포넌트 시스템 v1.0.0

ES6 모듈 기반의 현대적인 버튼 컴포넌트 시스템입니다.

## ✨ 주요 기능

- 🎨 **동적 팔레트 시스템** - 6개 기본 팔레트 + 커스텀 팔레트
- 🌓 **테마 전환** - Light/Dark 테마 지원
- 📏 **큰글씨 모드** - 접근성 향상
- 🎯 **상태 관리** - default/pressed/disabled/pointed
- 🔘 **토글 버튼** - 지속적 선택 상태
- 📐 **동적 스케일링** - 반응형 크기 조절
- 🎨 **3D 색상 선택기** - 구체 기반 색상 선택
- ♿ **접근성** - WCAG 2.1 AA 준수
- 🚀 **ES6 모듈** - 체계적인 코드 구조

## 📁 프로젝트 구조

```
프로젝트 루트/
├── index.html                  # HTML
├── style.css                   # CSS
├── package.json                # 프로젝트 설정
├── README.md                   # 이 파일
│
├── src/                        # JavaScript 소스 코드
│   ├── index.js                # 진입점 (모듈 통합)
│   ├── app.js                  # CustomPaletteManager & 초기화
│   ├── lib/
│   │   └── chroma.min.js       # Chroma.js 로컬 캐시 (CDN 폴백)
│   └── modules/
│       ├── color/              # 색상 관련 모듈
│       │   ├── converter.js    # 색상 변환
│       │   ├── topology.js     # 3D 색상 구체 위상
│       │   └── mechanics.js    # 구체 렌더링 & 인터랙션
│       ├── utils/              # 유틸리티
│       │   ├── svg-loader.js   # SVG 로딩 + currentColor 변환
│       │   └── css-injector.js # 동적 CSS 주입
│       ├── button/             # 버튼 시스템
│       │   ├── constants.js    # 버튼 상수
│       │   ├── palette-manager.js # 팔레트 CSS 생성
│       │   ├── style-manager.js   # 동적 스타일 적용
│       │   └── button-system.js   # 버튼 시스템 통합
│       └── managers/           # 전역 매니저
│           ├── theme-manager.js    # 테마 관리
│           ├── large-mode-manager.js # 큰글씨 모드
│           └── size-control-manager.js # 크기 조절
│
├── svg/
│   ├── icon/
│   │   ├── index.js            # 아이콘 중앙 관리 (자동 생성)
│   │   └── *.svg               # 아이콘 파일들
│   ├── guide/
│   └── guide-paper/
│
├── fonts/
│   └── PretendardGOV-*.otf     # Pretendard GOV 폰트
│
├── scripts/                    # 개발 도구
│   ├── update-icons.ps1        # 아이콘 인덱스 자동 생성
│   ├── update-icons.js         # Node.js 버전
│   ├── icon-index-template.js  # 생성 템플릿
│   └── README.md               # 스크립트 설명서
│
├── .git/hooks/
│   └── pre-commit              # Git Hook (자동 아이콘 갱신)
│
└── .github/workflows/          # GitHub Actions
    ├── update-icons.yml        # 아이콘 자동 갱신
    └── check-icons.yml         # PR 검증
```

## 🚀 시작하기

### 개발 환경 설정

**필수:**
- Bun 설치: https://bun.sh

**설치:**
```bash
# 의존성 설치
bun install
```

### 개발 모드

**터미널 1 - Watch 모드 (자동 빌드):**
```bash
bun run dev
# 파일 변경 시 자동으로 dist/index.js 갱신
```

**터미널 2 - 서버:**
```bash
npm run serve
# http://localhost:8000
```

### 일회성 빌드

```bash
bun run build
# dist/index.js 생성
```

### 개발 워크플로우

**1. 아이콘 추가:**
```bash
# 1. SVG 파일 추가
svg/icon/new-icon.svg

# 2. 인덱스 갱신
.\scripts\update-icons.ps1

# 3. Git 커밋 (또는 Git Hook이 자동 실행)
git add .
git commit -m "Add new icon"
```

**2. 모듈 추가:**
   ```javascript
// src/modules/my-module.js
export const MyModule = {
  // ...
};

// src/index.js에서 import
import { MyModule } from './modules/my-module.js';
window.MyModule = MyModule;
```

## 🎯 핵심 기술

### 1. ES6 모듈 시스템
- **단일 책임 원칙** - 각 모듈이 하나의 책임
- **순환 의존 방지** - 명확한 의존성 그래프
- **Tree Shaking** - 사용하지 않는 코드 제거 가능

### 2. SVG currentColor 자동 변환
   ```javascript
// SVG 로드 시 자동으로 currentColor로 변환
fill="white" → fill="currentColor"
stroke="#000" → stroke="currentColor"

// CSS로 색상 제어 가능
.content.icon {
  color: var(--contents-color);
}
```

### 3. 캐시 기반 병렬 로딩
```javascript
// 모든 SVG를 병렬로 로드 → 캐시 저장 → 한 번에 DOM 주입
await SVGLoader.preloadAllIcons();  // 병렬
SVGLoader.injectAllIcons();         // 일괄 주입
```

### 4. 자동화 시스템
- **로컬**: Git Hook으로 커밋 시 자동 갱신
- **GitHub**: Actions로 push 시 자동 갱신
- **PR**: 검증 워크플로우로 누락 방지

## 📊 성능 최적화

| 항목 | 최적화 | 결과 |
|------|--------|------|
| 모듈 로딩 | 병렬 import | ~12ms |
| SVG 로딩 | 병렬 fetch | ~50ms |
| DOM 조작 | 일괄 주입 | 깜빡임 제거 |
| 스타일 계산 | 캐시 사용 | 불필요한 재계산 방지 |
| 이벤트 | 쓰로틀링 | 성능 향상 |

## 🔄 의존성 그래프 및 빌드 절차

### 📋 전체 실행 순서:

```
개발 단계 (로컬):
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
1. 아이콘 추가
   svg/icon/*.svg
   ↓
2. 빌드 타임 의존성 해결
   scripts/update-icons.js (Bun 실행)
   ↓
   svg/icon/index.js 자동 생성 ← 소스 코드가 됨!
   ↓
3. 모듈 번들링
   bun build src/index.js
   ↓
   모든 모듈 의존성 해결:
   ├─ svg/icon/index.js import
   ├─ src/modules/ (14개 모듈)
   ├─ Chroma.js (CDN 폴백 코드)
   └─ src/app.js
   ↓
   dist/index.js 생성 (2193줄, 93KB)
   ↓
4. 브라우저 실행
   index.html → dist/index.js
   ↓
   모든 기능 작동! ✅


배포 단계 (GitHub Actions):
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
1. git push
   ↓
2. GitHub Actions 트리거
   ↓
3. Bun 설치
   ↓
4. bun install (의존성 설치)
   ↓
5. bun run update-icons  ← 아이콘 인덱스 생성
   ↓
6. bun build             ← 모듈 번들링
   ↓
7. GitHub Pages 배포
   ↓
8. 전 세계 사용자 접근 가능! 🌍
```

### 🔗 런타임 모듈 의존성:

```
독립적 (레벨 0):
  ├─ svg/icon/index.js (scripts가 생성)
  ├─ color/converter.js
  ├─ color/topology.js
  ├─ button/constants.js
  └─ utils/css-injector.js

레벨 1:
  ├─ color/mechanics.js → Topology, ColorConverter, ui/color-sphere-ui.js
  ├─ utils/svg-loader.js → svg/icon/index.js
  ├─ ui/color-sphere-ui.js (독립적)
  ├─ managers/theme-manager.js
  ├─ managers/large-mode-manager.js
  └─ managers/size-control-manager.js

레벨 2:
  ├─ button/palette-manager.js → CSSInjector
  ├─ button/style-manager.js
  └─ ui/palette-ui-generator.js

레벨 3:
  ├─ button/button-system.js → PaletteManager, StyleManager
  └─ managers/custom-palette-manager.js

레벨 4:
  ├─ index.js → 모든 모듈 통합
  └─ app.js → ButtonSystem, 모든 매니저

레벨 5:
  └─ dist/index.js (Bun 번들 결과)
```

### 🛠️ 빌드 타임 vs 런타임:

| 단계 | 실행 환경 | 의존성 |
|------|-----------|--------|
| **scripts/** | Node.js/Bun (터미널) | 파일 시스템 접근 |
| **src/** | 모듈 시스템 | ES6 import/export |
| **dist/** | 브라우저 | 번들링된 단일 파일 |

## 🛠️ 기술 스택

- **언어**: Vanilla JavaScript (ES6+)
- **모듈**: ES6 Modules
- **CSS**: CSS Variables, Nesting, Container Queries
- **라이브러리**: Chroma.js (CDN 우선 + 로컬 폴백)
- **폰트**: Pretendard GOV
- **타겟**: Chrome (크로스 브라우저 불필요)
- **호스팅**: 정적 호스팅 (GitHub Pages, Netlify 등)

## 📦 외부 라이브러리 로딩 전략

### Chroma.js (CDN 우선 + 로컬 폴백)

**로딩 순서:**
1. 🌐 **CDN 시도**: `https://cdn.jsdelivr.net/npm/chroma-js@2.4.2/`
   - 빠른 로딩 (CDN 캐시)
   - 최신 버전 유지
   
2. 💾 **로컬 폴백**: `./src/lib/chroma.min.js`
   - CDN 실패 시 자동 전환
   - 오프라인 작동
   - 버전 고정 (메소드 추적 용이)

**장점:**
- ✅ 인터넷 있을 때: 빠른 CDN
- ✅ 인터넷 없을 때: 로컬 파일
- ✅ 버전 관리: 로컬 파일로 특정 버전 고정
- ✅ 메소드 추적: 로컬 파일 확인 가능

## 📖 문서

- [src/README.md](src/README.md) - 모듈 구조 상세 설명
- [scripts/README.md](scripts/README.md) - 스크립트 사용법

## 👨‍💻 개발

**저자**: 이강철  
**버전**: v1.0.0  
**최종 업데이트**: 2025-10-02

## 📜 라이선스

MIT License

---

## 🎉 완성!

- ✅ 2726줄 단일 파일 → 15개 체계적 모듈
- ✅ 순환 의존 방지
- ✅ 자동화 시스템 구축
- ✅ 관측성 향상
- ✅ 성능 최적화
- ✅ 모든 기능 정상 작동
