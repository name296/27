# 🚀 배포 가이드

## GitHub 저장소 생성 및 연결

### 1. GitHub에서 새 저장소 생성
1. [GitHub](https://github.com)에 로그인
2. **New Repository** 클릭
3. 저장소 이름 입력 (예: `button-component-system`)
4. **Public** 선택 (GitHub Pages 무료 사용)
5. **Create repository** 클릭

### 2. 로컬과 GitHub 연결
```bash
# 원격 저장소 추가
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git

# 메인 브랜치로 푸시
git push -u origin main
```

### 3. GitHub Pages 설정
1. 저장소 → **Settings** 탭
2. 왼쪽 메뉴에서 **Pages** 클릭
3. **Source**: "GitHub Actions" 선택
4. 저장

## ✨ CI/CD 파이프라인 기능

### 🔄 자동 배포
- `main` 브랜치에 push 시 자동 배포
- Pull Request 시 미리보기 빌드

### 🔍 품질 검사
- **HTML 유효성**: W3C 표준 준수 확인
- **CSS 린트**: 스타일 품질 검사
- **접근성**: axe-core로 WCAG 준수 확인
- **성능**: Lighthouse로 성능 측정

### 📊 성능 기준
- **Performance**: 90% 이상
- **Accessibility**: 95% 이상  
- **Best Practices**: 90% 이상
- **SEO**: 90% 이상

## 🌐 배포 URL
배포 완료 후: `https://YOUR_USERNAME.github.io/YOUR_REPO_NAME`

## 🛠️ 로컬 개발
```bash
# 로컬 서버 실행
python -m http.server 8000
# 또는
npx serve .
```

브라우저에서 `http://localhost:8000` 접속
