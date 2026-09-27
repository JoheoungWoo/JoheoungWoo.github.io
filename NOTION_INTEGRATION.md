# Notion Integration Notes

이 저장소는 public GitHub Pages 사이트입니다. Notion 은 내부 원문 저장소로 사용하고, 사이트에는 공개 가능한 요약과 링크만 둡니다.

## 기본 원칙

- GitHub Pages 에는 공개 가능한 제목, 요약, 태그, 날짜만 둔다.
- 원문, PDF, 실험 로그, 운영 메모, 체크리스트는 Notion 에 둔다.
- Notion API 토큰은 브라우저 JavaScript 에 넣지 않는다.
- 비공개 Notion 페이지 링크는 접근 권한이 있는 사람에게만 의미가 있다.

## 권장 구조

| Site section | Public site role | Notion role |
|---|---|---|
| Projects | 공개 가능한 case study | 내부 기획, 운영 로그, 원본 자료 |
| Archive | 공개 요약 인덱스 | 실험 로그, 회고, 장애 기록 |
| Documents | 문서 허브와 링크 | PDF, 설계서, 분석 문서 원문 |
| Study | 공개 가능한 목차와 일부 글 | 개인 노트, 원문 정리, 스크랩 |

## 연결 방식

### 1. 수동 링크

가장 안전합니다. Notion 에서 공개해도 되는 페이지를 고른 뒤 사이트의 `href="#" data-todo` 를 실제 URL 로 바꾸고 `data-todo` 를 제거합니다.

```html
<a href="https://www.notion.so/..." class="col-d">Notion →</a>
```

### 2. 빌드 시점 동기화

나중에 자동화가 필요하면 GitHub Actions 에 Notion token 을 secret 으로 저장하고, 공개 가능한 메타데이터만 JSON 또는 HTML 로 생성합니다.

정적 사이트에 포함해도 되는 필드 예시:

- title
- category
- public_summary
- published_at
- public_url
- visibility

정적 사이트에 포함하면 안 되는 필드 예시:

- internal_notes
- raw_logs
- server_urls
- api_keys
- private_pdf_urls
- customer_or_user_data

### 3. 브라우저 직접 호출 금지

GitHub Pages 의 `assets/js/app.js` 에서 Notion API 를 직접 호출하지 않습니다. 토큰이 노출되기 때문입니다.

## 공개 전 체크

- Notion 페이지 권한이 의도와 맞는가
- public GitHub 에 내부 PDF 나 원문이 올라가지 않았는가
- 링크 텍스트가 비공개 자료를 과하게 설명하지 않는가
- 공개 요약에 서버 주소, 비용, 토큰, 개인 정보가 포함되지 않았는가
