/* ============================================================
   모드(Portfolio / Study), 테마 전환, 홈 데이터 렌더링.
   홈 데이터는 assets/data/*-data.js 에 둔다.
============================================================ */

(function () {

  var root = document.documentElement;

  var modeButtons =
    document.querySelectorAll(".mode-switch button");

  var themeButton =
    document.getElementById("theme-toggle");


  function escapeHtml(value) {
    return String(value || "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }

  function attr(value) {
    return escapeHtml(value || "#");
  }

  function todoAttr(item) {
    return item && item.todo ? " data-todo" : "";
  }

  function slot(name) {
    return document.querySelector('[data-render="' + name + '"]');
  }


  /* 데이터 렌더링 -------------------------------------- */

  function heroHtml(hero, withStats) {
    var title = (hero.title || [])
      .map(escapeHtml)
      .join("<br>");

    var stats = "";

    if (withStats && hero.stats) {
      stats = '<div class="stats">' +
        hero.stats.map(function (item) {
          return '<div>' +
            '<strong>' + escapeHtml(item.value) + '</strong>' +
            '<span>' + escapeHtml(item.label) + '</span>' +
          '</div>';
        }).join("") +
      '</div>';
    }

    var link = "";

    if (hero.link) {
      link = '<a href="' + attr(hero.link.href) + '" class="primary-link">' +
        escapeHtml(hero.link.label) +
      '</a>';
    }

    return '' +
      '<p class="eyebrow">' + escapeHtml(hero.eyebrow) + '</p>' +
      '<h1>' + title + '</h1>' +
      '<p class="lead">' + escapeHtml(hero.lead) + '</p>' +
      link +
      stats;
  }

  function cardHtml(item) {
    return '' +
      '<a class="card" href="' + attr(item.href) + '"' + todoAttr(item) + '>' +
        '<span class="card-number">' + escapeHtml(item.number) + '</span>' +
        '<h3>' + escapeHtml(item.title) + '</h3>' +
        '<p>' + escapeHtml(item.summary) + '</p>' +
        '<small>' + escapeHtml(item.meta) + '</small>' +
        '<span class="card-link">' + escapeHtml(item.linkLabel) + '</span>' +
      '</a>';
  }

  function rowHtml(item) {
    return '' +
      '<a class="list-item" href="' + attr(item.href) + '"' + todoAttr(item) + '>' +
        '<span class="col-a">' + escapeHtml(item.date) + '</span>' +
        '<span class="col-b">' + escapeHtml(item.type) + '</span>' +
        '<p class="col-c">' + escapeHtml(item.text) + '</p>' +
        '<span class="col-d">' + escapeHtml(item.result || item.level) + '</span>' +
      '</a>';
  }

  function postRowHtml(item) {
    var parts = String(item.date || "").split(" ");

    return rowHtml({
      date: parts[0],
      type: item.category,
      text: item.title,
      level: parts[1] || "",
      href: item.href,
      todo: item.todo
    });
  }

  function staticRowHtml(item) {
    if (item.grass) {
      return '' +
        '<div class="list-item is-block github-grass-row">' +
          '<span class="col-a">' + escapeHtml(item.date) + '</span>' +
          '<p class="col-c">' + escapeHtml(item.text) + '</p>' +
          '<img src="' + attr(item.grass) + '" alt="' + escapeHtml(item.alt) + '">' +
        '</div>';
    }

    return '' +
      '<div class="list-item">' +
        '<span class="col-a">' + escapeHtml(item.date) + '</span>' +
        '<strong class="col-b">' + escapeHtml(item.type) + '</strong>' +
        '<p class="col-c">' + escapeHtml(item.text) + '</p>' +
      '</div>';
  }

  function documentHtml(item) {
    return '' +
      '<div class="list-item is-block">' +
        '<span class="col-a">' + escapeHtml(item.meta) + '</span>' +
        '<h3 class="col-c">' + escapeHtml(item.title) + '</h3>' +
        '<p class="col-c">' + escapeHtml(item.summary) + '</p>' +
        '<a class="col-d" href="' + attr(item.href) + '"' + todoAttr(item) + '>' +
          escapeHtml(item.linkLabel) +
        '</a>' +
      '</div>';
  }

  function readingHtml(item) {
    return '' +
      '<div class="list-item">' +
        '<p class="col-c">' + escapeHtml(item.title) + '</p>' +
        '<span class="col-d">' + escapeHtml(item.progress) + '</span>' +
      '</div>';
  }

  function boundaryHtml(boundary) {
    return '' +
      '<div class="boundary">' +
        '<p>' + escapeHtml(boundary.summary) + '</p>' +
        '<dl class="boundary-grid">' +
          (boundary.items || []).map(function (item) {
            return '<div>' +
              '<dt>' + escapeHtml(item.label) + '</dt>' +
              '<dd>' + escapeHtml(item.text) + '</dd>' +
            '</div>';
          }).join("") +
        '</dl>' +
      '</div>';
  }

  function renderHome(data) {
    var portfolio = data.portfolio || {};
    var study = data.study || {};

    if (slot("portfolioHero")) {
      slot("portfolioHero").innerHTML = heroHtml(portfolio.hero || {}, false);
    }

    if (slot("projects")) {
      slot("projects").innerHTML = (portfolio.projects || []).map(cardHtml).join("");
    }

    if (slot("journey")) {
      slot("journey").innerHTML = (portfolio.journey || []).map(staticRowHtml).join("");
    }

    if (slot("archiveBoundary")) {
      slot("archiveBoundary").innerHTML = boundaryHtml(portfolio.archiveBoundary || {});
    }

    if (slot("archive")) {
      slot("archive").innerHTML = (portfolio.archive || []).map(rowHtml).join("");
    }

    if (slot("documents")) {
      slot("documents").innerHTML = (portfolio.documents || []).map(documentHtml).join("");
    }

    if (slot("studyHero")) {
      slot("studyHero").innerHTML = heroHtml(study.hero || {}, true);
    }

    if (slot("topics")) {
      slot("topics").innerHTML = (study.topics || []).map(cardHtml).join("");
    }

    if (slot("studyQueue")) {
      if (study.queue) {
        slot("studyQueue").textContent = study.queue;
      } else {
        slot("studyQueue").hidden = true;
      }
    }

    if (slot("notes")) {
      slot("notes").innerHTML =
        (study.posts || study.notes || []).slice(0, 3).map(function (item) {
          return item.category ? postRowHtml(item) : rowHtml(item);
        }).join("");
    }

    if (slot("reading")) {
      slot("reading").innerHTML = (study.reading || []).map(readingHtml).join("");
    }
  }

  function loadHomeData() {
    if (!document.body || document.body.dataset.source !== "site") {
      return Promise.resolve();
    }

    if (window.SITE_DATA) {
      renderHome(window.SITE_DATA);
      return Promise.resolve();
    }

    if (window.PORTFOLIO_DATA || window.STUDY_DATA || window.ARCHIVE_DATA) {
      renderHome({
        portfolio: Object.assign(
          {},
          window.PORTFOLIO_DATA || {},
          {
            archiveBoundary: (window.ARCHIVE_DATA || {}).boundary,
            archive: (window.ARCHIVE_DATA || {}).archive,
            documents: (window.ARCHIVE_DATA || {}).documents
          }
        ),
        study: window.STUDY_DATA || {}
      });
      return Promise.resolve();
    }

    var targets = document.querySelectorAll("[data-render]");

    targets.forEach(function (target) {
      target.innerHTML =
        '<p class="note">데이터를 불러오지 못했습니다.</p>';
      });

    return Promise.resolve();
  }


  /* 모드 ---------------------------------------------- */

  function setMode(mode) {

    root.setAttribute("data-mode", mode);

    modeButtons.forEach(function (button) {
      button.setAttribute(
        "aria-pressed",
        button.dataset.mode === mode
      );
    });

    try {
      localStorage.setItem("mode", mode);
    } catch (e) {}
  }


  /* 테마 ---------------------------------------------- */

  function setTheme(theme) {

    root.setAttribute("data-theme", theme);

    if (themeButton) {
      themeButton.textContent =
        theme === "dark" ? "밝게" : "어둡게";
    }

    try {
      localStorage.setItem("theme", theme);
    } catch (e) {}
  }


  /* 이벤트 -------------------------------------------- */

  modeButtons.forEach(function (button) {
    button.addEventListener("click", function () {
      setMode(button.dataset.mode);
      window.scrollTo({ top: 0 });
    });
  });

  if (themeButton) {
    themeButton.addEventListener("click", function () {
      setTheme(
        root.getAttribute("data-theme") === "dark"
          ? "light"
          : "dark"
      );
    });
  }


  function bindTodoLinks() {
    document
      .querySelectorAll("[data-todo]")
      .forEach(function (element) {

        element.setAttribute("aria-disabled", "true");

        if (element.dataset.todoBound === "true") {
          return;
        }

        element.dataset.todoBound = "true";

        element.addEventListener("click", function (event) {
          event.preventDefault();
        });
      });
  }


  /* 초기 상태 ----------------------------------------- */

  var mode = "portfolio";
  var theme = "light";

  try {
    if (modeButtons.length) {
      mode = localStorage.getItem("mode") || mode;
    } else {
      mode = root.getAttribute("data-mode") || mode;
    }

    theme =
      localStorage.getItem("theme") ||
      (window.matchMedia("(prefers-color-scheme: dark)").matches
        ? "dark"
        : "light");
  } catch (e) {}

  loadHomeData().then(bindTodoLinks);

  if (document.querySelector(".mode-panel") && modeButtons.length) {
    setMode(mode);
  }

  setTheme(theme);
  bindTodoLinks();

})();
