# Engineering Archive

조형우의 개인 Engineering Archive. Portfolio / Study 두 모드를 한 사이트에서 전환합니다.

GitHub Pages 정적 사이트이며 빌드 도구를 쓰지 않습니다. 파일을 고치고 push 하면 반영됩니다.

---

## 구조

```
/
├─ index.html                    HOME (Portfolio / Study)
├─ .nojekyll                     Jekyll 빌드 비활성화
│
├─ assets/
│  ├─ css/style.css              디자인 전부
│  ├─ js/components.js           공통 헤더 · 푸터
│  ├─ js/app.js                  모드 · 테마 전환
│  ├─ favicon.svg
│  ├─ images/                    이미지
│  └─ files/                     PDF 등
│
├─ projects/                     프로젝트 상세
├─ study/                        학습 시리즈
├─ archive/                      실험 · 엔지니어링 노트
└─ documents/                    문서
```

---

## 어디를 고치면 되는가

| 바꾸고 싶은 것 | 고칠 파일 | 위치 |
|---|---|---|
| 색상, 폰트, 여백 | `assets/css/style.css` | `:root` 블록 |
| 헤더 nav 항목 | `assets/js/components.js` | `navPortfolio` / `navStudy` 배열 |
| 푸터 소개, 링크 | `assets/js/components.js` | `profile` 객체 |
| HOME 내용 | `index.html` | 각 `<section>` |

헤더와 푸터는 모든 페이지가 `components.js` 하나를 공유합니다. 한 곳만 고치면 전체에 반영됩니다.

---

## 페이지 추가하기

기존 상세 페이지를 복사해 쓰는 것이 가장 빠릅니다.

```
projects/electrician.html   프로젝트 상세 템플릿
study/java.html             학습 시리즈 템플릿
```

새 페이지에는 이 두 줄이 필요합니다. 하위 폴더면 `../`를 씁니다.

```html
<div id="site-header" data-home="false"></div>
<script src="../assets/js/components.js"></script>
```

```html
<div id="site-footer"></div>
<script src="../assets/js/app.js"></script>
```

`data-home="false"` 이면 모드 스위치가 나오지 않습니다. HOME 에서만 `true` 입니다.

---

## UI 문법

두 가지만 씁니다.

**Card** — 프로젝트, 학습 주제
```html
<a class="card" href="...">
  <span class="card-number">01</span>
  <h3>제목</h3>
  <p>설명</p>
  <small>Tag · Tag</small>
  <span class="card-link">View case study →</span>
</a>
```

**List** — 저니, 아카이브, 문서, 노트, 읽는 책
```html
<a class="list-item" href="...">
  <span class="col-a">날짜</span>
  <span class="col-b">유형</span>
  <p class="col-c">제목</p>
  <span class="col-d">결과</span>
</a>
```

문서처럼 여러 줄이 필요하면 `list-item is-block` 을 씁니다.

---

## 규칙

- 아직 링크가 없는 곳에는 `href="#" data-todo` 를 씁니다. 실제 주소를 넣을 때 `data-todo` 도 함께 지웁니다.
- 진행 막대는 실제 진행률이나 의미 있는 구성비가 있을 때만 씁니다. 분모를 임의로 만들지 않고, 아래 텍스트로 의미를 함께 적습니다.
- 카드는 최대 6개. 준비 중인 항목은 빈 카드 대신 하단 텍스트 목록으로 둡니다.
- 이미지 없이도 성립하는 구조를 유지합니다. 이미지는 상세 페이지 중심으로 씁니다.
- 이미지에는 `alt` 를 붙이고, 원본 대신 웹용 크기로 올립니다.

---

## 배포 전 확인

- [ ] `assets/js/components.js` 의 이메일 주소 교체
- [ ] 상세 페이지 수치와 기간이 사실과 맞는지 확인
- [ ] `assets/images/og.png` 추가 후 `og:image` 연결 (1200×630)
- [ ] 남아 있는 `data-todo` 링크 정리

---

## 로컬 확인

파일을 더블클릭해도 동작합니다. 서버로 보려면

```bash
python3 -m http.server 8000
```
