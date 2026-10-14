window.PORTFOLIO_DUMMY_DATA = {
  hero: {
    eyebrow: "포트폴리오",
    title: ["작업한 것들을", "하나씩 꺼내 보는", "기록장입니다."],
    lead: "프로젝트마다 무엇을 만들었고, 어떤 판단을 했고, 무엇을 배웠는지 짧게 남깁니다.",
    link: {
      label: "프로젝트 보기 →",
      href: "#projects"
    }
  },
  projects: [
    {
      number: "01",
      title: "학습 기록 정리 도구",
      summary: "흩어진 공부 메모를 주제별로 모아 보고, 필요한 내용만 사이트에 보여주는 구조입니다.",
      meta: "학습 · 기록 · 정적 사이트",
      category: "Web Service",
      status: "진행중",
      stack: ["HTML", "CSS", "JavaScript"],
      thumbnail: {
        label: "Study Board",
        tone: "blue"
      },
      href: "#",
      todo: true,
      linkLabel: "자세히 보기 →"
    },
    {
      number: "02",
      title: "개인 문서 허브",
      summary: "Notion에 둔 원문과 사이트에 보여줄 요약을 자연스럽게 연결하는 문서 인덱스입니다.",
      meta: "Notion · 문서 · 인덱스",
      category: "Document",
      status: "설계중",
      stack: ["Notion", "Index", "Data"],
      thumbnail: {
        label: "Docs Hub",
        tone: "dark"
      },
      href: "#",
      todo: true,
      linkLabel: "자세히 보기 →"
    },
    {
      number: "03",
      title: "정적 포트폴리오 실험",
      summary: "빌드 도구 없이 HTML, CSS, JavaScript만으로 관리 가능한 개인 사이트 구조를 실험합니다.",
      meta: "HTML · CSS · JavaScript",
      category: "Portfolio",
      status: "진행중",
      stack: ["HTML", "CSS", "JavaScript"],
      thumbnail: {
        label: "Static Site",
        tone: "green"
      },
      href: "#",
      todo: true,
      linkLabel: "자세히 보기 →"
    },
    {
      number: "04",
      title: "노트 자동 분류 흐름",
      summary: "작성한 노트를 태그, 주제, 상태별로 나눠 다음에 이어 보기 쉽게 만드는 흐름입니다.",
      meta: "분류 · 태그 · Notion",
      category: "Workflow",
      status: "예정",
      stack: ["Tags", "Notion", "Archive"],
      thumbnail: {
        label: "Note Flow",
        tone: "orange"
      },
      href: "#",
      todo: true,
      linkLabel: "자세히 보기 →"
    },
    {
      number: "05",
      title: "작업 회고 템플릿",
      summary: "프로젝트가 끝난 뒤 남길 질문과 답변 틀을 정리해 반복해서 쓰는 템플릿입니다.",
      meta: "회고 · 템플릿 · 문서화",
      category: "Template",
      status: "예정",
      stack: ["Review", "Docs", "Question"],
      thumbnail: {
        label: "Review Kit",
        tone: "gray"
      },
      href: "#",
      todo: true,
      linkLabel: "자세히 보기 →"
    },
    {
      number: "06",
      title: "사이트 데이터 분리",
      summary: "화면 구조와 내용을 분리해 데이터 파일만 고쳐도 홈 화면이 바뀌도록 정리했습니다.",
      meta: "데이터 · 구조 · 유지보수",
      category: "Structure",
      status: "완료",
      stack: ["Data", "Render", "Static"],
      thumbnail: {
        label: "Data Layer",
        tone: "violet"
      },
      href: "#",
      todo: true,
      linkLabel: "자세히 보기 →"
    }
  ],
  work: {
    profile: {
      label: "WORK BOARD",
      title: "10월 작업 현황",
      summary: "사이트 구조를 정리하고, 실제 데이터 연결 전까지 화면과 문서 기준을 맞추는 중입니다.",
      status: "정리 중",
      updated: "2026.10.06"
    },
    stats: [
      {
        label: "이번 주",
        value: "4",
        unit: "건",
        hint: "완료 또는 진행 중"
      },
      {
        label: "진행",
        value: "2",
        unit: "건",
        hint: "사이트, Notion"
      },
      {
        label: "대기",
        value: "3",
        unit: "건",
        hint: "문서 채우기"
      }
    ],
    calendar: [
      {
        date: "10.05",
        day: "월",
        title: "홈 데이터 분리",
        type: "사이트",
        status: "완료"
      },
      {
        date: "10.06",
        day: "화",
        title: "작업 보드 형태 정리",
        type: "화면",
        status: "진행"
      },
      {
        date: "10.07",
        day: "수",
        title: "Notion 데이터 항목 맞추기",
        type: "연동",
        status: "예정"
      },
      {
        date: "10.08",
        day: "목",
        title: "문서 카드 실제 내용 입력",
        type: "문서",
        status: "예정"
      }
    ],
    queue: [
      {
        title: "포트폴리오 프로젝트 실제 사례 채우기",
        meta: "우선순위 높음",
        status: "다음"
      },
      {
        title: "학습 글 목록을 Notion DB 기준으로 맞추기",
        meta: "데이터 구조 확인",
        status: "준비"
      },
      {
        title: "비공개 자료와 공개 요약의 경계 정리",
        meta: "공개 범위 검토",
        status: "보류"
      }
    ]
  },
  journey: [],
  archiveBoundary: {
    summary: "작업하다 남긴 판단, 회고, 다시 볼 메모를 짧게 모읍니다.",
    items: []
  },
  archive: [
    {
      date: "2026.10",
      type: "사이트",
      text: "홈 화면 데이터 파일을 나누고 화면 렌더링 흐름을 정리",
      result: "초안",
      href: "#",
      todo: true
    },
    {
      date: "2026.10",
      type: "문서",
      text: "사이트에 보여줄 문서와 내부에 둘 메모의 기준 정리",
      result: "정리 중",
      href: "#",
      todo: true
    },
    {
      date: "2026.10",
      type: "학습",
      text: "학습 글을 블로그 목록처럼 모아 보는 방식으로 정리",
      result: "샘플",
      href: "#",
      todo: true
    },
    {
      date: "2026.09",
      type: "회고",
      text: "작업 후 남길 질문 목록과 회고 템플릿을 준비",
      result: "초안",
      href: "#",
      todo: true
    },
    {
      date: "2026.09",
      type: "아이디어",
      text: "프로젝트 상세 페이지에서 보여줄 항목과 숨길 항목을 구분",
      result: "보류",
      href: "#",
      todo: true
    }
  ],
  documents: [
    {
      meta: "초안",
      title: "프로젝트 상세 작성 기준",
      summary: "프로젝트를 소개할 때 배경, 구현, 배운 점을 어떤 순서로 적을지 정리합니다.",
      href: "#",
      todo: true,
      linkLabel: "준비 중 →"
    },
    {
      meta: "정리 중",
      title: "학습 노트 분류 기준",
      summary: "글 목록, 시리즈, 읽는 자료를 어떻게 나눌지 정리합니다.",
      href: "#",
      todo: true,
      linkLabel: "준비 중 →"
    },
    {
      meta: "예정",
      title: "데이터 연결 메모",
      summary: "정적 데이터에서 Notion 연동으로 넘어갈 때 필요한 항목을 적어 둡니다.",
      href: "#",
      todo: true,
      linkLabel: "준비 중 →"
    }
  ]
};
