# 버튼 컴포넌트 시스템

다양한 상태와 팔레트를 지원하는 접근성 중심의 현대적 버튼 컴포넌트 시스템입니다.

## 🎯 주요 특징

### 🎨 테마 시스템
- **Light 테마**: 밝은 배경 기반의 기본 테마
- **Dark 테마**: 어두운 배경 기반의 Dark 테마
- **실시간 전환**: 버튼 클릭 또는 키보드 단축키로 즉시 전환
- **설정 유지**: 로컬 스토리지를 통한 사용자 설정 저장

### 📏 큰글씨 모드
- **기본 모드**: 표준 크기 (2.5rem 기준)
- **큰글씨 모드**: 1.2배 확대 (3rem 기준)
- **일관성 유지**: 텍스트와 아이콘이 동일한 비율로 확대
- **독립적 동작**: 테마와 무관하게 작동

### 🔘 버튼 타입 및 상태

#### 버튼 타입
- **기본 버튼**: 기본 상태 ↔ 눌림 상태
- **토글 버튼**: 기본 상태 ↔ 선택 상태  
- **비활성 버튼**: 상호작용 불가능한 비활성 상태

#### 버튼 상태
- **기본 상태**: 버튼의 기본 모습
- **눌림 상태**: 기본 버튼이 눌린 상태
- **선택 상태**: 토글 버튼이 선택된 상태
- **비활성 상태**: 상호작용이 불가능한 상태
- **초점 상태**: 모든 버튼에 복합적으로 적용
- **호버 상태**: 모든 버튼에 복합적으로 적용

### 🎨 색상 팔레트

#### Primary 팔레트
- **Primary1**: Light 테마 기본 브랜드 색상 (브라운 계열)
- **Primary2**: Light 테마 변형 색상 (Gray 조합)

#### Secondary 팔레트  
- **Secondary1**: Gray 기반 보조 색상
- **Secondary2**: Gray 변형 보조 색상

## 🚀 기술 스택

### CSS
- **현대 CSS 기능**: Nesting, CSS 변수, calc() 함수
- **CSS 계층**: @layer를 통한 구조화된 스타일 관리
- **디자인 토큰**: CSS 변수 기반 일관된 디자인 시스템
- **패딩 + 갭 방식**: 마진 대신 패딩과 gap으로 간격 제어
- **Space-Evenly 레이아웃**: justify-content로 균등한 요소 분배

### JavaScript
- **모듈화 설계**: 기능별 Manager 클래스 분리
- **이벤트 관리**: 키보드, 마우스 상호작용 지원
- **상태 관리**: 로컬 스토리지 기반 설정 유지
- **접근성**: ARIA 속성 동적 관리

### HTML
- **시맨틱 마크업**: 의미있는 HTML5 요소 사용
- **접근성 최적화**: ARIA 속성, 스킵 링크, 키보드 네비게이션
- **구조화된 콘텐츠**: 논리적 정보 계층 구조

## 🎮 사용법

### 키보드 조작
- `Tab`: 버튼 간 초점 이동
- `Enter` 또는 `Space`: 버튼 활성화
- `Ctrl+Alt+H`: 테마 전환 (Light ↔ Dark)
- `Ctrl+Alt+L`: 큰글씨 모드 전환

### 마우스 조작
- **클릭**: 기본 버튼은 눌림 상태, 토글 버튼은 선택 상태 전환
- **호버**: 마우스 오버 시 호버 상태 표시

## 🏗️ 아키텍처

### 레이아웃 시스템
현대적인 **패딩 + 갭 + Space-Evenly** 방식을 사용합니다:

```css
/* Body: 플로팅 박스 영역 확보 */
body {
  padding-left: 26rem;  /* 24rem 박스 + 2rem 여백 */
  gap: 0;  /* 섹션 간 경계 없음 */
}

/* Header & Main: 순수 Space-Evenly */
header, main {
  justify-content: space-evenly;  /* 균등 분배 */
  /* 패딩, 마진, max-width 없음 */
}

/* 쇼케이스: 통합된 컨테이너 */
.showcase {
  /* 헤더와 버튼 쇼케이스 공통 스타일 */
}
```

### CSS 변수 시스템
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
  --page-bg-primary: #FAFAFAFF;
  --page-text-primary: #252525FF;
}

.dark {
  /* Dark 테마 색상만 재정의 */
  --page-bg-primary: #1F1F1FFF;
  --page-text-primary: #FFFFFFFF;
}

.large {
  /* 큰글씨 모드 크기만 재정의 */
  --font-size-scale: 1.2;
}
```

### JavaScript 모듈 구조
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
```

## 🎨 디자인 토큰

### 스케일링 단위
- `--unit-xs`: 4px (테두리, 작은 간격)
- `--unit-sm`: 8px (작은 여백)
- `--unit-md`: 16px (기본 간격)
- `--unit-lg`: 24px (큰 간격)
- `--unit-xl`: 32px (섹션 간격)
- `--unit-2xl`: 48px (큰 섹션 간격)

### 타이포그래피
- `--font-size-base`: 2.5rem (기준 크기)
- `--font-size-scale`: 1 (기본) / 1.2 (큰글씨)
- `--font-size`: 계산된 기본 크기
- `--font-size-xl`: 1.125배 크기
- `--font-size-lg`: 0.72배 크기
- `--font-size-md`: 0.52배 크기

### 색상 시스템

#### Light 테마
- **배경**: `#FAFAFAFF` (Body), `#FFFFFFFF` (카드)
- **텍스트**: `#252525FF` (주), `#606060FF` (보조)
- **테두리**: `#DBDBDBFF` (주), `#E8E8E8FF` (보조)

#### Dark 테마
- **배경**: `#1F1F1FFF` (Body), `#252525FF` (카드)
- **텍스트**: `#FFFFFFFF` (주), `#BFBFBFFF` (보조)
- **테두리**: `#4C4C4CFF` (주), `#606060FF` (보조)

## ♿ 접근성 기능

### 키보드 접근성
- **완전한 키보드 네비게이션**: 모든 기능을 키보드로 조작 가능
- **시각적 포커스 표시**: 명확한 포커스 링 표시
- **스킵 링크**: 메인 콘텐츠와 테마 설정으로 바로 이동

### 스크린 리더 지원
- **ARIA 속성**: 버튼 상태와 역할 명시
- **Live Region**: 상태 변경 시 음성 안내
- **의미있는 라벨**: 모든 상호작용 요소에 명확한 설명

### 시각적 접근성
- **충분한 색상 대비**: WCAG 2.1 AA 기준 준수 (4.5:1 이상)
- **큰글씨 모드**: 시각 장애인을 위한 텍스트 확대
- **명확한 상태 표시**: 색상 외에도 아이콘으로 상태 구분

## 🌐 브라우저 지원

### 주요 지원 브라우저
- **Chrome**: 최신 버전 (권장 및 프로젝트 타겟)

### 사용된 현대 CSS 기능
- **CSS Nesting**: 중첩된 선택자
- **CSS 변수**: 동적 테마 시스템
- **Flexbox**: Space-Evenly 레이아웃 시스템
- **CSS calc()**: 동적 계산
- **CSS @layer**: 스타일 계층 관리

## 📁 파일 구조

```
├── index.html          # 메인 HTML 파일
├── style.css           # 통합 CSS 스타일
├── script.js           # JavaScript 기능
├── icon.svg            # 기본 아이콘
├── selected.svg        # 선택 상태 아이콘
├── favicon.ico         # 파비콘
└── README.md           # 프로젝트 문서
```

## 🔧 개발 가이드

### 새로운 버튼 팔레트 추가
1. CSS에서 색상 변수 정의
2. Light/Dark 테마별 색상 설정
3. HTML에서 클래스 적용
4. 필요시 JavaScript 상태 관리 추가

### 새로운 테마 추가
1. CSS에서 새 테마 클래스 생성
2. 페이지 UI 색상 재정의
3. JavaScript ThemeManager에 테마 추가
4. 버튼 UI 업데이트

### 접근성 개선
1. ARIA 속성 추가/수정
2. 키보드 네비게이션 테스트
3. 스크린 리더 테스트
4. 색상 대비 검증

## 📄 라이선스

© 이강철 / 2025 / 버튼 컴포넌트 시스템 v1.0.0

이 프로젝트는 웹 접근성 가이드라인(WCAG 2.1 AA)을 준수하며, 현대 CSS/JS 기능을 활용한 데모입니다.

---

**크롬 기준 현대 CSS/JS** | **접근성 최적화** | **반응형 디자인**