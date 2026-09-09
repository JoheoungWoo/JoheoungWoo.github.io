/* ============================================================
   공통 헤더 / 푸터

   페이지에서는 이렇게만 쓴다.

     <div id="site-header"></div>
     <script src="./assets/js/components.js"></script>

   경로 접두사는 이 스크립트의 src 에서 자동으로 계산하므로
   하위 폴더 페이지에서도 ../assets/js/components.js 로만 부르면 된다.

   헤더나 푸터를 고칠 때는 이 파일 하나만 고친다.
============================================================ */

(function () {

  /* 루트까지의 상대 경로를 스크립트 위치에서 역산한다.
     ./assets/js/components.js  → ./
     ../assets/js/components.js → ../ */

  var src = document.currentScript.getAttribute("src");
  var root = src.replace(/assets\/js\/components\.js$/, "");


  /* 헤더 ---------------------------------------------- */
  /* nav 항목을 바꾸려면 아래 배열만 수정한다. */

  var navPortfolio = [
    ["Projects", "#projects"],
    ["Archive", "#archive"],
    ["Documents", "#documents"],
    ["About", "#about"]
  ];

  var navStudy = [
    ["Topics", "#topics"],
    ["Notes", "#notes"],
    ["Reading", "#reading"],
    ["About", "#about"]
  ];


  function navHtml(items, className, onHome) {

    var links = items.map(function (item) {

      /* 홈이 아니면 해시 앞에 홈 경로를 붙인다. */
      var href = onHome ? item[1] : root + item[1];

      return '<a href="' + href + '">' + item[0] + '</a>';
    });

    return '<nav class="nav ' + className + '">' +
      links.join("") +
      '</nav>';
  }


  function headerHtml(options) {

    var onHome = options.home === true;

    /* 상세 페이지에는 모드 스위치를 두지 않는다. */
    var controls = onHome
      ? '<div class="mode-switch">' +
          '<button data-mode="portfolio" aria-pressed="true">Portfolio</button>' +
          '<button data-mode="study" aria-pressed="false">Study</button>' +
        '</div>'
      : "";

    return '' +
      '<header class="header">' +
        '<div class="container header-inner">' +

          '<a href="' + root + '" class="brand">CH</a>' +

          navHtml(navPortfolio, "nav-portfolio", onHome) +
          navHtml(navStudy, "nav-study", onHome) +

          '<div class="header-controls">' +
            controls +
            '<button id="theme-toggle" aria-label="다크 모드 전환">Dark</button>' +
          '</div>' +

        '</div>' +
      '</header>';
  }


  /* 푸터 ---------------------------------------------- */
  /* 소개 문구와 링크는 여기만 고치면 모든 페이지에 반영된다. */

  var profile = {
    name: "조형우 · Software Engineer",
    about:
      "새로운 기술을 배우는 것보다, 실제 서비스에 적용하고 운영 가능한 " +
      "형태로 만드는 과정에 관심이 있습니다. 웹 서비스와 AI 모델, " +
      "서버 인프라를 직접 연결하며 검증하고 있습니다.",
    links: [
      ["GitHub", "https://github.com/JoheoungWoo"],
      ["Email", "mailto:YOUR_EMAIL@example.com"]   /* ← 실제 주소로 교체 */
    ]
  };


  function footerHtml() {

    var links = profile.links.map(function (item) {
      return '<a href="' + item[1] + '">' + item[0] + '</a>';
    });

    return '' +
      '<footer id="about" class="footer">' +
        '<div class="container">' +

          '<p class="eyebrow">ABOUT</p>' +
          '<h2>' + profile.name + '</h2>' +
          '<p>' + profile.about + '</p>' +

          '<nav class="footer-links">' + links.join("") + '</nav>' +

        '</div>' +
      '</footer>';
  }


  /* 삽입 ----------------------------------------------

     헤더는 자리표시자 바로 뒤에서 실행되므로 즉시 채워진다.
     화면이 한 번 비었다가 그려지는 현상이 없다.

     푸터는 문서 아래쪽에 있어 이 시점에는 아직 없다.
     파싱이 끝난 뒤에 채운다. */

  var headerSlot = document.getElementById("site-header");

  if (headerSlot) {
    headerSlot.outerHTML = headerHtml({
      home: headerSlot.dataset.home === "true"
    });
  }

  function mountFooter() {

    var footerSlot = document.getElementById("site-footer");

    if (footerSlot) {
      footerSlot.outerHTML = footerHtml();
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", mountFooter);
  } else {
    mountFooter();
  }

})();
