window.SITE_DATA = {
  portfolio: {
    hero: {
      eyebrow: "PORTFOLIO",
      title: ["프로젝트를", "하나씩 정리하는", "공간입니다."],
      lead: "공개 가능한 프로젝트 요약만 이곳에 둡니다.",
      link: {
        label: "View projects →",
        href: "#projects"
      }
    },
    projects: [
      {
        number: "01",
        title: "프로젝트 제목",
        summary: "프로젝트 설명을 여기에 작성합니다.",
        meta: "Category · Stack · Role",
        href: "#",
        todo: true,
        linkLabel: "View case study →"
      }
    ],
    journey: [
      {
        date: "YYYY",
        type: "STATUS",
        text: "현재 단계나 이력을 작성합니다."
      }
    ],
    archiveBoundary: {
      summary: "GitHub Pages 에는 공개 가능한 요약만 남기고, 원문과 내부 자료는 Notion 에 보관합니다.",
      items: [
        {
          label: "PUBLIC",
          text: "프로젝트 요약, 공개 가능한 학습 목차, 비민감 회고"
        },
        {
          label: "NOTION",
          text: "실험 로그, 운영 메모, 원본 문서, PDF, 내부 체크리스트"
        }
      ]
    },
    archive: [
      {
        date: "Private",
        type: "NOTION",
        text: "내부 자료는 Notion 에 보관합니다.",
        result: "Ready",
        href: "#",
        todo: true
      }
    ],
    documents: [
      {
        meta: "Private · Document",
        title: "문서 제목",
        summary: "문서 요약을 여기에 작성합니다.",
        href: "#",
        todo: true,
        linkLabel: "Notion 예정 →"
      }
    ]
  },
  study: {
    hero: {
      eyebrow: "STUDY LOG",
      title: ["학습 기록을", "하나씩 채우는", "공간입니다."],
      lead: "공개 가능한 학습 목차와 일부 정리글만 이곳에 둡니다.",
      stats: [
        {
          value: "0",
          label: "NOTES"
        },
        {
          value: "YYYY.MM",
          label: "LAST UPDATED"
        }
      ]
    },
    topics: [
      {
        number: "0 notes",
        title: "주제 제목",
        summary: "학습 주제 설명을 여기에 작성합니다.",
        meta: "준비 중",
        href: "#",
        todo: true,
        linkLabel: "Browse series →"
      }
    ],
    queue: "준비 중 · 여기에 앞으로 정리할 주제를 적습니다.",
    notes: [
      {
        date: "YYYY.MM",
        type: "TOPIC",
        text: "노트 제목",
        level: "-",
        href: "#",
        todo: true
      }
    ],
    reading: [
      {
        title: "읽는 책 제목",
        progress: "-"
      }
    ]
  }
};
