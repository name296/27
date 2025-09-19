# 🎨 버튼 컴포넌트 시스템

> **접근성 중심의 현대적 버튼 컴포넌트 시스템**  
> 다양한 상태와 팔레트를 지원하며, WCAG 2.1 AA 기준을 완벽 준수합니다.

[![Chrome](https://img.shields.io/badge/Chrome-Latest-4285F4?style=flat-square&logo=google-chrome&logoColor=white)](https://www.google.com/chrome/)
[![CSS3](https://img.shields.io/badge/CSS3-Modern-1572B6?style=flat-square&logo=css3&logoColor=white)](https://developer.mozilla.org/en-US/docs/Web/CSS)
[![JavaScript](https://img.shields.io/badge/JavaScript-ES6+-F7DF1E?style=flat-square&logo=javascript&logoColor=black)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
[![Accessibility](https://img.shields.io/badge/A11y-WCAG%202.1%20AA-00A86B?style=flat-square&logo=accessibility&logoColor=white)](https://www.w3.org/WAI/WCAG21/quickref/)

---

## 🎯 주요 특징

### 🎨 **테마 시스템**

- ✨ **Light 테마**: 밝은 배경 기반의 기본 테마
- 🌙 **Dark 테마**: 어두운 배경 기반의 접근성 최적화 테마
- ⚡ **실시간 전환**: 버튼 클릭 또는 키보드 단축키로 즉시 전환
- 💾 **설정 유지**: 로컬 스토리지를 통한 사용자 설정 저장

### 🔍 **명도대비 분석 시스템**

- 📊 **실시간 분석**: 렌더링된 색상 기반 정확한 명도대비 계산
- 🎯 **WCAG 준수**: AA/AAA 기준 자동 검사
- 🔍 **다중 요소**: 텍스트, 아이콘, 테두리 색상 모두 분석
- ⚡ **성능 최적화**: 복잡한 CSS 계산 없이 렌더링된 색상만 사용
- 📈 **요약 리포트**: 전체 버튼의 접근성 준수율 제공

### 📏 **큰글씨 모드**

- 📎 **기본 모드**: 표준 크기 (2.5rem 기준)
- 🔍 **큰글씨 모드**: 1.2배 확대 (3rem 기준)
- 🎯 **일관성 유지**: 텍스트와 아이콘이 동일한 비율로 확대
- ⚙️ **독립적 동작**: 테마와 무관하게 작동

### 🔘 **버튼 시스템**

#### **버튼 타입**

| 타입 | 설명 | 상태 전환 |
|------|------|----------|
| 🔘 **기본 버튼** | 일반적인 액션 버튼 | 기본 ↔ 눌림 |
| 🔄 **토글 버튼** | 선택/비선택 상태 버튼 | 기본 ↔ 선택 |
| ⛔ **비활성 버튼** | 상호작용 불가 버튼 | 고정 상태 |

#### **버튼 상태**

| 상태 | 설명 | 적용 범위 |
|------|------|----------|
| 🟦 **기본 상태** | 버튼의 기본 모습 | 모든 버튼 |
| 🔴 **눌림 상태** | 기본 버튼이 눌린 상태 | 기본 버튼 |
| 🟡 **선택 상태** | 토글 버튼이 선택된 상태 | 토글 버튼 |
| ⚫ **비활성 상태** | 상호작용이 불가능한 상태 | 비활성 버튼 |
| 🔵 **초점 상태** | 키보드 초점이 있는 상태 | 모든 버튼 (복합) |
| 🟣 **호버 상태** | 마우스 오버 상태 | 모든 버튼 (복합) |

### 🎨 **색상 팔레트**

| 팔레트 | Light 테마 | Dark 테마 | 설명 |
|---------|------------|-----------|------|
| 🎨 **Primary1** | 브라운 계열 | 옐로우 계열 | 메인 브랜드 색상 |
| 🎨 **Primary2** | Gray + 브라운 | Gray + 옐로우 | 변형 브랜드 색상 |
| 🎨 **Primary3** | 이중 배경 + 그라데이션 | 이중 배경 + 그라데이션 | 고급 그라데이션 효과 |
| 🔘 **Secondary1** | Gray 진한색 | Gray 진한색 | 보조 색상 (진한) |
| 🔘 **Secondary2** | Gray 연한색 | Gray 연한색 | 보조 색상 (연한) |
| 🔘 **Secondary3** | 이중 배경 (아이콘) | 이중 배경 (아이콘) | 아이콘 전용 배경 |
| 🎛️ **Custom** | 사용자 정의 | 사용자 정의 | 3D 색상 선택기 |

---

## 🚀 기술 스택

### 🎨 **CSS**

- 🆕 **현대 CSS 기능**: Nesting, CSS 변수, calc()
- 📚 **CSS 계층**: @layer 구조화 관리 (reset, tokens, components, utilities)
- 🎛️ **네스팅 최적화**: 논리적 그룹핑 구조
- 🎯 **디자인 토큰**: CSS 변수 기반 시스템
- 📐 **패딩 + 갭**: 마진 대신 gap 사용
- ⚖️ **Space-Evenly**: 균등 분배 레이아웃

### ⚡ **JavaScript**

- 🧩 **모듈화 설계**: Manager 클래스 분리
- 🎮 **이벤트 관리**: 키보드, 마우스 지원
- 💾 **상태 관리**: 로컬 스토리지 연동
- ♿ **접근성**: ARIA 속성 동적 관리
- 🔄 **실시간 업데이트**: 테마/크기 전환

### 📝 **HTML**

- 🏗️ **시맨틱 마크업**: HTML5 요소 활용
- ♿ **접근성 최적화**: ARIA, 스킵 링크
- 📊 **구조화 콘텐츠**: 논리적 계층 구조
- 🔍 **SEO 최적화**: 메타 태그, 구조화 데이터
- 📱 **반응형**: 모바일 친화적 설계

---

## 🎮 사용법

### ⌨️ **키보드 조작 (향상된 네비게이션)**

| 키 | 기능 | 동작 방식 |
|---|------|---------|
| `Tab` | 표준 초점 이동 | 브라우저 기본 탭 순서 |
| `↑` `↓` | **컨테이너 간 이동** | showcase 섹션 간 점프 (루프) |
| `←` `→` | **전체 버튼 순환** | 모든 버튼을 순서대로 순환 |
| `Enter` / `Space` | 버튼 활성화 | 토글/일반 버튼 구분 처리 |
| `Home` / `End` | 처음/끝 이동 | 전체 버튼 중 첫/마지막 |
| `Ctrl+Alt+H` | 테마 전환 | Light ↔ Dark 테마 |
| `Ctrl+Alt+L` | 큰글씨 모드 | 기본 ↔ 1.2배 확대 |

### 🖱️ **마우스 조작**

| 동작 | 기능 |
|------|------|
| **클릭** | 기본: 눌림 상태<br>토글: 선택 상태 전환 |
| **호버** | 마우스 오버 시 호버 상태 표시 |
| **포커스** | 클릭 시 키보드 초점 이동 |

---

## 🏗️ 아키텍처

### 📐 **CSS 아키텍처**

#### **계층 구조 (@layer)**

```css
@layer reset, tokens, components, utilities;
```

- **reset**: 브라우저 기본 스타일 초기화
- **tokens**: 디자인 토큰 (색상, 크기, 타이포그래피)
- **components**: 컴포넌트 스타일 (.showcase, .button)
- **utilities**: 유틸리티 클래스

#### **디자인 토큰 시스템**

```css
:root {
  /* 기본 원시 값들 */
  --base-unit: 1rem;
  --font-size-base: 2.5rem;
  --font-size-scale: 1;
  
  /* 계산된 값들 */
  --font-size: calc(var(--font-size-base) * var(--font-size-scale));
  --icon-size: var(--font-size);
  
  /* Light 테마 색상 */
  --page-bg-primary: rgba(250, 250, 250, 1);
  --page-text-primary: rgba(37, 37, 37, 1);
}

.dark {
  /* Dark 테마 색상만 재정의 */
  --page-bg-primary: rgba(31, 31, 31, 1);
  --page-text-primary: rgba(255, 255, 255, 1);
}

.large {
  /* 큰글씨 모드 크기만 재정의 */
  --font-size-scale: 1.2;
}
```

### ⚡ **JavaScript 모듈 구조**

```javascript
// 테마 관리
const ThemeManager = {
  THEMES: { LIGHT: 'light', DARK: 'dark' },
  toggle(), applyCurrentState(), saveSettings()
};

// 큰글씨 모드 관리  
const LargeTextManager = {
  MODES: { DEFAULT: 'default', LARGE: 'large' },
  toggle(), applyCurrentState(), saveSettings()
};

// 버튼 크기 조절 (데모용)
const SizeControlManager = {
  updateButtonSizes(), resetToDefault()
};

// 키보드 네비게이션
const KeyboardNavigation = {
  getAllButtons(), getCurrentShowcase(),
  getNextButtonGroup(), getPreviousButtonGroup()
};
```

---

## 🎨 디자인 토큰

### 📏 **스케일링 단위**

- `--unit-xs`: 4px (테두리, 작은 간격)
- `--unit-sm`: 8px (작은 여백)
- `--unit-md`: 16px (기본 간격)
- `--unit-lg`: 24px (큰 간격)
- `--unit-xl`: 32px (섹션 간격)
- `--unit-2xl`: 48px (큰 섹션 간격)

### 📝 **타이포그래피**

- `--font-size-base`: 2.5rem (기준 크기)
- `--font-size-scale`: 1 (기본) / 1.2 (큰글씨)
- `--font-size`: 계산된 기본 크기
- `--font-size-xl`: 1.125배 크기
- `--font-size-lg`: 0.72배 크기
- `--font-size-md`: 0.52배 크기

### 🌈 **색상 시스템**

#### 🎨 **원시 색상 팔레트 (--color-* 네이밍)**

**Brown 계열 (6개)**
- `--color-brown-01`: `rgba(76, 63, 55, 1)` (가장 어두운 브라운)
- `--color-brown-02`: `rgba(140, 83, 44, 1)` (어두운 브라운)
- `--color-brown-03`: `rgba(164, 105, 63, 1)` (기본 브라운)
- `--color-brown-04`: `rgba(196, 137, 95, 1)` (밝은 브라운)
- `--color-brown-05`: `rgba(235, 155, 99, 1)` (매우 밝은 브라운)
- `--color-brown-06`: `rgba(238, 220, 210, 1)` (가장 밝은 브라운)

**Yellow 계열 (4개)**
- `--color-yellow-01`: `rgba(36, 31, 0, 1)` (가장 어두운 옐로우)
- `--color-yellow-02`: `rgba(128, 112, 0, 1)` (어두운 옐로우)
- `--color-yellow-03`: `rgba(255, 225, 0, 1)` (기본 옐로우)
- `--color-yellow-04`: `rgba(255, 239, 128, 1)` (밝은 옐로우)

**Gray 계열 (14개)**
- `--color-gray-01` ~ `--color-gray-14`: `rgba(0, 0, 0, 1)` ~ `rgba(255, 255, 255, 1)`

**System 계열 (5개)**
- `--color-system-01`: `rgba(255, 0, 225, 1)` (포인트 핑크)
- `--color-system-02`: `rgba(184, 26, 0, 1)` (에러 빨강)
- `--color-system-03`: `rgba(117, 18, 0, 1)` (경고 어두운 빨강)
- `--color-system-04`: `rgba(255, 72, 0, 1)` (경고 주황)
- `--color-system-05`: `rgba(0, 0, 0, 0.6)` (투명 검정, 60% 불투명도)

#### 🏗️ **이중 배경 시스템**

**Primary3**: 그라데이션 배경
- `background1`: 기본 배경 레이어
- `background2`: 그라데이션 레이어 (g000~g100 단계)

**Secondary3**: 아이콘 배경
- `background1`: 기본 버튼 배경
- `background2`: 아이콘 전용 배경

---

## ♿ 접근성 기능

### ⌨️ **키보드 접근성**

- **완전한 키보드 네비게이션**: 모든 기능을 키보드로 조작 가능
- **루프 네비게이션**: 수직/수평 방향 모두 끝에서 처음으로 순환
- **그룹 기반 이동**: 상하 방향키로 showcase 그룹 간 이동
- **시각적 포커스 표시**: 명확한 포커스 링 표시

### 🔊 **스크린 리더 지원**

- **ARIA 속성**: 버튼 상태와 역할 명시
- **Live Region**: 상태 변경 시 음성 안내
- **의미있는 라벨**: 모든 상호작용 요소에 명확한 설명

### 👁️ **시각적 접근성**

- **충분한 색상 대비**: WCAG 2.1 AA 기준 준수 (4.5:1 이상)
- **큰글씨 모드**: 시각 장애인을 위한 텍스트 확대
- **명확한 상태 표시**: 색상 외에도 아이콘으로 상태 구분

---

## 🌐 브라우저 지원

### 🎯 **주요 지원 브라우저**

- **Chrome**: 최신 버전 (권장 및 프로젝트 타겟)

### 🆕 **사용된 현대 CSS 기능**

- **CSS Nesting**: 중첩된 선택자
- **CSS 변수**: 동적 테마 시스템
- **Flexbox**: Space-Evenly 레이아웃 시스템
- **CSS calc()**: 동적 계산
- **CSS @layer**: 스타일 계층 관리

---

## 📁 파일 구조

```
📦 버튼 컴포넌트 시스템 v1.0.0 (2025-09-18 업데이트)
├── 📄 index.html          # 메인 HTML (463줄) - 6개 팔레트 + 시맨틱 구조
├── 🎨 style.css           # 통합 CSS (970줄) - 이중 배경 시스템 + CSSOM 연동
├── ⚡ script.js           # JavaScript (2,370줄) - 3D 색상 선택기 + 동적 CSSOM
├── 🖼️ icon.svg            # 기본 아이콘 (HTML 종속성)
├── ✅ selected.svg        # 선택 상태 아이콘 (JS 종속성)
├── 🔖 favicon.ico         # 파비콘 (HTML preload)
├── 🎭 PretendardGOV-*.otf # 폰트 파일들 (CSS 종속성)
└── 📚 README.md           # 프로젝트 문서 (전체 파일 연동)

🔗 파일 간 종속성:
   HTML → CSS (--color-* 변수, 6개 팔레트 클래스)
   HTML → JS (DOM 클래스 네이밍 → CSSOM 동적 조작) 
   CSS → JS (--color-* 변수 토큰 → 동적 스타일 생성)
   MD → ALL (완전한 시스템 문서화)
   
💡 CSSOM 동적 조작 시스템:
   - JavaScript가 DOM 클래스를 스캔하여 CSS 자동 생성
   - Primary3/Secondary3 이중 배경 시스템 지원
   - transparent 키워드로 투명도 표준화
   - 25개 원시 색상 + 6개 완전한 팔레트
```

---

## 🔧 개발 가이드

### 🔧 **파일 간 종속성 가이드**

#### **새로운 버튼 팔레트 추가**

1. **🎨 CSS 변수 정의 (style.css)**
   ```css
   /* design-system layer에 추가 */
   --new-palette-background-color-default: #색상코드;
   --new-palette-contents-color-default: #색상코드;
   --new-palette-border-color-default: #색상코드;
   ```

2. **🌙 테마별 색상 (style.css)**
   ```css
   .dark {
     --new-palette-background-color-default: #다크테마색상;
   }
   ```

3. **📄 HTML 클래스 적용 (index.html)**
   ```html
   <button class="button new-palette">새 팔레트 버튼</button>
   ```

4. **⚡ JavaScript 자동 감지 (script.js)**
   ```javascript
   // PaletteManager.generateCSS()가 자동으로 감지하여 CSS 생성
   ```

### 🌙 **새로운 테마 추가**

1. **CSS에서 새 테마 클래스 생성**
   ```css
   .custom-theme {
     --page-bg-primary: #커스텀배경;
     --page-text-primary: #커스텀텍스트;
   }
   ```

2. **JavaScript ThemeManager에 테마 추가**
   ```javascript
   THEMES: {
     LIGHT: 'light',
     DARK: 'dark',
     CUSTOM: 'custom-theme'
   }
   ```

### ♿ **접근성 개선**

1. **ARIA 속성 추가/수정**
2. **키보드 네비게이션 테스트**
3. **스크린 리더 테스트**
4. **색상 대비 검증** (4.5:1 이상)

---

## 📊 품질 지표

### 🏆 **코드 품질**

- **린터 오류**: 0개
- **구문 오류**: 0개
- **인덴테이션**: 완벽 통일 (2스페이스)
- **주석 표기법**: 일관성 확보
- **용어 통일**: 네이밍 컨벤션 적용

### ♿ **접근성 점수**

- **WCAG 2.1 AA**: 100% 준수
- **키보드 네비게이션**: 완벽 지원
- **스크린 리더**: 완전 호환
- **색상 대비**: 4.5:1 이상

### 🔍 **명도대비 분석 사용법**

#### **기본 사용법**
```javascript
// 전체 버튼 명도대비 분석
const results = checkAllContrast();

// 특정 팔레트 분석
const primary1Results = checkPaletteContrast('primary1');

// 단일 버튼 분석
const buttonElement = document.querySelector('.button.primary1');
const result = checkContrast(buttonElement);
```

#### **고급 사용법**
```javascript
// 상세 분석
const analyzer = new ContrastAnalyzer();
const analysis = analyzer.analyzeAllButtons();
const summary = analyzer.summarizeResults(analysis);

console.log('접근성 준수율:', summary.complianceRate + '%');
console.log('WCAG 미달 버튼:', summary.nonCompliant + '개');

// 실시간 모니터링
const monitor = new ContrastMonitor();
monitor.startMonitoring(); // 실시간 모니터링 시작
monitor.stopMonitoring();  // 모니터링 중지
```

#### **개발자 도구 통합**
```javascript
// 브라우저 콘솔에서 사용 가능한 함수들
window.checkContrast(element)        // 단일 버튼 검사
window.checkAllContrast()            // 전체 버튼 검사  
window.checkPaletteContrast(palette) // 특정 팔레트 검사
```

### 🚀 **성능 (2025-09-18 CSSOM 동적 조작 시스템 + 명도대비 분석)**

- **CSS 파일**: 970 라인 (이중 배경 시스템 + 원시 색상 토큰)
- **JavaScript 파일**: 2,830+ 라인 (CSSOM 동적 조작 + 3D 색상 선택기 + 명도대비 분석)  
- **HTML 파일**: 463 라인 (6개 팔레트 + 시맨틱 구조)
- **총 프로젝트**: 4,260+ 라인 (CSSOM 동적 조작 + 명도대비 분석 시스템)
- **색상 변수**: 25개 원시 색상 + 6개 완전한 팔레트
- **투명도**: `transparent` 키워드로 완전 통일
- **아키텍처**: DOM 클래스 → JavaScript → CSSOM 동적 생성
- **명도대비**: 렌더링된 색상 기반 실시간 분석 (기존 모듈 리빌딩)

---

## 📄 라이선스

<div align="center">

**© 이강철 / 2025 / 버튼 컴포넌트 시스템 v1.0.0**

이 프로젝트는 웹 접근성 가이드라인(WCAG 2.1 AA)을 준수하며, 현대 CSS/JS 기능을 활용한 데모입니다.

---

[![Chrome](https://img.shields.io/badge/크롬%20기준-현대%20CSS/JS-4285F4?style=for-the-badge&logo=google-chrome&logoColor=white)](https://www.google.com/chrome/)
[![Accessibility](https://img.shields.io/badge/접근성-최적화-00A86B?style=for-the-badge&logo=accessibility&logoColor=white)](https://www.w3.org/WAI/WCAG21/quickref/)
[![Responsive](https://img.shields.io/badge/반응형-디자인-FF6B6B?style=for-the-badge&logo=responsive&logoColor=white)](#)

</div>