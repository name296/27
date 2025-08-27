# 버튼 컴포넌트 시스템

동적 스케일링, 상태 관리, 성능 최적화가 포함된 포괄적이고 접근 가능한 버튼 컴포넌트 시스템입니다.

## 🎯 개요

이 시스템은 다음과 같은 인터랙티브 버튼을 제공합니다:
- **동적 스케일링**: 뷰포트 치수 기반
- **버튼 타입**: 기본 버튼, 토글 버튼, 비활성 버튼
- **다중 상태**: 기본, 눌림, 선택, 비활성, 초점, 호버 상태
- **테마 시스템**: Light 테마, Dark 테마, Neutral 색상, Static 요소
- **접근성 준수**: ARIA 속성, 키보드 내비게이션
- **성능 최적화**: 스타일 캐싱, 일괄 업데이트
- **반응형 디자인**: 비례적 간격과 크기 조정

## 🏗️ 아키텍처

### 핵심 원칙
- **SVG 우선 주입**: 일관된 렌더링을 위해 아이콘이 스타일링보다 먼저 로드
- **비례적 스케일링**: 모든 치수가 `minSide`(너비/높이 중 작은 값)를 기준으로 스케일링
- **상태 격리**: 각 버튼 상태가 독립적으로 처리됨
- **이벤트 위임**: 캡처 단계 차단을 통한 중앙화된 이벤트 처리

### 파일 구조
```
├── index.html          # 컴포넌트 쇼케이스 및 테스트
├── style.css           # 시각적 스타일 및 상태 정의
├── script.js           # 핵심 기능 및 최적화
├── icon.svg            # 기본 버튼 아이콘
├── selected.svg        # 선택 상태 표시기
└── README.md           # 이 문서
```

## 🔧 기술적 구현

### 스케일링 시스템
```javascript
const BASE = 0.03125; // 비례적 계산을 위한 기본 단위
const minSide = Math.min(rect.width, rect.height);

// 모든 치수가 비례적으로 스케일링
const buttonPadding = minSide * BUTTON_PADDING;
const buttonBorderRadius = minSide * BUTTON_BORDER_RADIUS;
const selectedIconSize = minSide * SELECTED_ICON_SIZE;
```

### 성능 최적화
- **스타일 캐싱**: `WeakMap`으로 불필요한 스타일 업데이트 방지
- **일괄 처리**: 여러 버튼을 단일 루프에서 처리
- **RAF 일괄화**: 주입 후 스타일링에 `requestAnimationFrame` 사용
- **리사이즈 스로틀링**: 과도한 업데이트를 방지하는 디바운스된 리사이즈 핸들러

### 상태 관리
```javascript
// 버튼 상태는 CSS 클래스와 ARIA 속성을 통해 관리
button.classList.add('selected');
button.setAttribute('aria-pressed', 'true');
button.dataset.toggleSelected = 'true'; // 선택 가능한 버튼만
```

## 🎨 버튼 타입과 상태

### **버튼 타입 (3가지)**
1. **기본 버튼**: 기본 상태 ↔ 눌림 상태
2. **토글 버튼**: 기본 상태 ↔ 선택 상태
3. **비활성 버튼**: 비활성 상태 (상호작용 불가)

### **버튼 상태 (6가지)**
1. **기본 상태**: 버튼의 기본 모습
2. **눌림 상태**: 기본 버튼이 눌린 상태 (마우스/키보드)
3. **선택 상태**: 토글 버튼이 선택된 상태
4. **비활성 상태**: 상호작용이 불가능한 상태
5. **초점 상태**: 모든 버튼에 복합적으로 적용 (키보드 내비게이션)
6. **호버 상태**: 모든 버튼에 복합적으로 적용 (마우스 피드백)

### **🎨 테마 기반 색상 시스템**
- **☀️ Light 테마**: 기본 브랜드 색상 중심의 밝은 인터페이스
- **🌙 Dark 테마**: 고대비 모드, 접근성 최적화된 어두운 인터페이스  
- **⚪ Neutral 색상**: 테마에 독립적인 그레이스케일 색상
- **🎯 Static 요소**: 테마에 관계없이 일관된 포커스/호버 색상

### 테마 시스템 CSS 구조
```css
:root {
  /* 🎨 기본 색상 (테마별) */
  --color-light-300: #A4693F;    /* Light 테마 메인 */
  --color-dark-100: #FFE100;     /* Dark 테마 메인 */
  --color-neutral-500: #8C8C8C;  /* 중성 그레이 */
  --color-static-focus: #FF00E1; /* Static 포커스 */
  
  /* 🎯 의미적 토큰 */
  --theme-light-bg-primary: var(--color-light-300);
  --theme-dark-bg-primary: var(--color-dark-300);
  
  /* 🔄 현재 활성 테마 */
  --current-bg-primary: var(--theme-light-bg-primary);
  
  /* 🔘 컴포넌트 토큰 */
  --btn-primary-bg: var(--current-bg-primary);
  --btn-focus-border: var(--color-static-focus);
}

/* 🌙 Dark 테마 전환 */
.high-contrast {
  --current-bg-primary: var(--theme-dark-bg-primary);
}
```

## ♿ 접근성 기능

### ARIA 구현
- `aria-pressed`: 토글 버튼의 선택 상태 표시
- `aria-disabled`: 비활성 버튼의 비활성 상태 표시
- `aria-label`: 버튼의 접근 가능한 이름 제공
- 적절한 라벨링을 통한 시맨틱 버튼 구조

### 키보드 지원
- **Enter/Space**: 버튼 활성화 (기본 버튼은 눌림, 토글 버튼은 선택 상태 토글)
- **Tab**: 버튼 간 초점 이동
- **Ctrl+Alt+H**: 테마 전환 (Light ↔ Dark)
- **Escape**: 초점 관리 (구현 시)

### 스크린 리더 지원
- 적절한 버튼 라벨링 및 상태 발표
- SVG 내용을 통한 아이콘 설명
- ARIA 업데이트를 통한 상태 변경 전달

## 🚀 성능 기능

### **스타일 최적화**
```javascript
// 모든 변화를 정확하게 감지하여 스타일 업데이트
const needsUpdate = (
  cached.minSide !== minSide ||
  cached.buttonPadding !== buttonPadding ||
  cached.buttonBorderRadius !== buttonBorderRadius
  // ... 기타 속성들
);

if (!needsUpdate) continue;
```

### 메모리 관리
- **WeakMap 캐싱**: DOM 요소가 제거될 때 자동 정리
- **이벤트 위임**: 버튼당 단일 이벤트 리스너 대신
- **RAF 일괄화**: 부드러운 애니메이션 및 레이아웃 스래싱 감소

## 📱 반응형 동작

### 스케일링 전략
- **비례적 치수**: 모든 크기가 컨테이너와 함께 스케일링
- **뷰포트 적응**: 윈도우 리사이징에 반응
- **일관된 비율**: 모든 크기에서 디자인 비율 유지

### 브레이크포인트 고려사항
- **모바일**: 터치 친화적 크기 유지
- **데스크톱**: 호버 상태 및 정밀한 상호작용
- **고해상도**: SVG 아이콘이 모든 해상도에서 선명하게 스케일링

## 🔍 사용 예시

### 기본 버튼 (기본 상태 ↔ 눌림 상태)
```html
<button type="button" class="button" aria-label="기본 버튼">
  <div class="button-background">
    <span class="icon"></span>
    <span class="label">기본 버튼</span>
  </div>
</button>
```

### 토글 버튼 (기본 상태 ↔ 선택 상태)
```html
<button type="button" class="button selected" 
        data-toggle-selected="true" 
        aria-label="토글 버튼" 
        aria-pressed="true">
  <div class="button-background">
    <span class="selected-icon"></span>
    <span class="icon"></span>
    <span class="label">선택됨</span>
  </div>
</button>
```

### 비활성 버튼 (비활성 상태)
```html
<button type="button" class="button disabled" 
        aria-disabled="true" 
        aria-label="비활성 버튼">
  <div class="button-background">
    <span class="icon"></span>
    <span class="label">비활성</span>
  </div>
</button>
```

### 팔레트 적용 예시
```html
<!-- Primary-2 팔레트 버튼 -->
<button type="button" class="button primary-2">
  <div class="button-background">
    <span class="icon"></span>
    <span class="label">Primary-2</span>
  </div>
</button>

<!-- Secondary-1 팔레트 토글 버튼 -->
<button type="button" class="button secondary-1 selected" 
        data-toggle-selected="true" aria-pressed="true">
  <div class="button-background">
    <span class="selected-icon"></span>
    <span class="icon"></span>
    <span class="label">Secondary-1 선택</span>
  </div>
</button>
```

## 🛠️ 커스터마이징

### 🎨 테마 색상 수정
```css
:root {
  /* Light 테마 커스터마이징 */
  --color-light-300: #새로운-브랜드-색상;
  --color-light-50: #새로운-밝은-변형;
  
  /* Dark 테마 커스터마이징 */
  --color-dark-100: #새로운-고대비-색상;
  --color-dark-300: #새로운-어두운-변형;
  
  /* Static 요소 커스터마이징 */
  --color-static-focus: #새로운-포커스-색상;
  --color-static-hover: #새로운-호버-색상;
  
  /* Neutral 색상 조정 */
  --color-neutral-500: #새로운-중성-색상;
}
```

### 🔄 새 테마 추가
```css
/* Blue 테마 정의 */
--color-blue-300: #2563EB;
--theme-blue-bg-primary: var(--color-blue-300);

/* Blue 테마 클래스 */
.blue-theme {
  --current-bg-primary: var(--theme-blue-bg-primary);
  --current-text-primary: var(--color-neutral-0);
}
```

### 스케일링 조정
```javascript
const BASE = 0.03125; // 더 큰 요소를 위해 증가
const SELECTED_ICON_SIZE = 4 * BASE; // 아이콘 비율 조정
```

### 새 상태 추가
```css
.button.custom-state .button-background {
  background-color: var(--custom-bg-color);
  outline-color: var(--custom-border-color);
}
```

## 🧪 테스트

### 수동 테스트 체크리스트
- [ ] 모든 버튼 타입과 상태가 올바르게 렌더링됨
- [ ] 모든 팔레트(Primary-1, Primary-2, Secondary-1, Secondary-2)가 정상 작동함
- [ ] 기본 버튼의 기본↔눌림 상태 전환이 정상 작동함
- [ ] 토글 버튼의 기본↔선택 상태 전환이 정상 작동함
- [ ] 비활성 버튼이 상호작용을 차단함
- [ ] 키보드 내비게이션이 작동함 (Tab, Enter, Space)
- [ ] 초점 상태와 호버 상태가 모든 버튼에 복합 적용됨
- [ ] 스크린 리더가 상태를 올바르게 발표함
- [ ] 리사이즈 동작이 비율을 유지함
- [ ] 터치 상호작용이 모바일에서 작동함
- [ ] 하이 콘트라스트 모드가 정상 작동함

### 브라우저 호환성
- **최신 브라우저**: 전체 기능 지원
- **레거시 브라우저**: 우아한 성능 저하
- **모바일 브라우저**: 터치 최적화된 상호작용

## 📚 API 참조

### CSS 클래스
- `.button`: 기본 버튼 컨테이너
- `.button-background`: 시각적 배경 요소
- `.icon`: 기본 아이콘 컨테이너
- `.selected-icon`: 선택 표시기
- `.label`: 버튼 텍스트 내용

### JavaScript 함수
- `applyButtonStyles()`: 동적 스타일링 적용
- `loadSvg(path, selector)`: SVG 내용 로드 및 주입
- `findDisabledButton(event)`: 이벤트 경로에서 비활성 버튼 찾기
- `blockDisabledButtonEvents(event)`: 비활성 버튼 상호작용 방지

### 이벤트 핸들러
- **Click**: 토글 버튼의 선택 상태 토글 (기본↔선택)
- **Keydown**: 비활성 버튼 활성화 방지
- **Keyup**: Enter/Space 활성화 처리 (기본 버튼은 눌림, 토글 버튼은 선택 토글)
- **Resize**: 비례적 치수 업데이트 (모든 팔레트 적용)

## 🔮 향후 개선사항

### 계획된 기능
- **애니메이션 시스템**: 버튼 타입과 상태 간 부드러운 전환
- **추가 팔레트**: 더 많은 색상 체계 확장
- **아이콘 라이브러리**: 버튼 타입별 전용 아이콘 세트
- **폼 통합**: 네이티브 폼과 버튼 타입 연동
- **상태 프리셋**: 자주 사용되는 버튼 조합 템플릿

### 성능 개선
- **가상 스크롤링**: 대용량 버튼 목록
- **웹 워커**: 메인 스레드 외부의 무거운 계산
- **서비스 워커**: 아이콘 캐싱 및 오프라인 지원

## 📄 라이선스

이 컴포넌트 시스템은 내부 사용을 위해 설계되었으며 현대적인 웹 개발 모범 사례를 따릅니다.

---

**최종 업데이트**: 2024년 12월  
**버전**: 1.0.0  
**유지보수자**: 개발팀# TestingRepo
