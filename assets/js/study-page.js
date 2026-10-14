/* ============================================================
   Study series page renderer.

   Individual pages keep only data-* settings. This file owns
   the shared article shell, generated data loading, and TOC.
============================================================ */

(function () {

  var shell = document.querySelector("[data-study-series]");

  if (!shell) {
    return;
  }

  var src = document.currentScript.getAttribute("src").split("?")[0];
  var root = src.replace(/assets\/js\/study-page\.js$/, "");

  var config = {
    series: shell.dataset.studySeries || "",
    category: shell.dataset.studyCategory || "",
    title: shell.dataset.studyTitle || "",
    fallbackDate: shell.dataset.studyFallbackDate || "2026.10.12"
  };

  mountLoadingShell();
  loadScripts([
    root + "assets/data/generated/study-posts-data.js?v=" + Date.now(),
    root + "assets/js/app.js?v=" + Date.now()
  ], renderStudyArticle);

  function mountLoadingShell() {
    shell.innerHTML = '' +
      '<article class="article" data-render="studyArticle">' +
        '<a class="back" href="./">← 학습 기록</a>' +
        '<p class="eyebrow">시리즈 · ' + escapeHtml(config.category).toUpperCase() + '</p>' +
        '<h1>' + escapeHtml(config.title) + '</h1>' +
        '<div class="loading-panel" role="status" aria-live="polite">' +
          '<span class="loading-bar"></span>' +
          '<p>Notion 데이터를 불러오는 중입니다.</p>' +
        '</div>' +
      '</article>' +
      '<aside class="article-toc" aria-label="글 목차" data-render="studyArticleToc">' +
        '<p>목차</p>' +
        '<span>불러오는 중</span>' +
      '</aside>';
  }

  function renderStudyArticle() {
    var article = document.querySelector('[data-render="studyArticle"]');
    var toc = document.querySelector('[data-render="studyArticleToc"]');
    var posts = window.STUDY_POSTS || [];
    var post = posts.find(function (item) {
      return item.slug === config.series || item.category === config.category;
    });
    var tocItems = [];

    if (!article || !toc) {
      return;
    }

    if (!post) {
      post = {
        category: config.category,
        title: config.title,
        summary: "아직 공개된 글이 없습니다.",
        meta: config.fallbackDate,
        children: []
      };
    }

    var body = renderNodes(post.children, 1, "notion", [], post, tocItems);
    renderHeaderSyncedAt();

    if (!body) {
      body = '' +
        '<h2 id="comment">코멘트</h2>' +
        '<p class="learned">아직 공개된 글이 없습니다.</p>';
      tocItems.push({
        id: "comment",
        title: "코멘트"
      });
    }

    article.innerHTML = '' +
      '<a class="back" href="./">← 학습 기록</a>' +
      '<p class="eyebrow">시리즈 · ' + escapeHtml(post.category).toUpperCase() + '</p>' +
      '<h1>' + escapeHtml(post.title) + '</h1>' +
      '<p class="summary">' + escapeHtml(post.summary || "아직 공개된 글이 없습니다.") + '</p>' +
      '<dl class="meta-table">' +
        '<dt>태그</dt>' +
        '<dd>' + escapeHtml(post.category) + ' · 학습</dd>' +
        '<dt>최근 수정</dt>' +
        '<dd>' + escapeHtml(String(post.meta || post.date || "").split(" ")[0]) + '</dd>' +
      '</dl>' +
      body;

    toc.innerHTML = '' +
      '<p>목차</p>' +
      tocItems.map(function (item) {
        return '<a href="#' + escapeHtml(item.id) + '">' + escapeHtml(item.title) + '</a>';
      }).join("") +
      '<span>' + escapeHtml(post.category) + ' · 학습</span>';
  }

  function renderNodes(nodes, depth, prefix, parents, post, tocItems) {
    return (nodes || []).map(function (node, index) {
      var id = nodeId(prefix, index);
      var headingLevel = Math.min(depth + 1, 4);

      if (node.type === "page") {
        var nextParents = parents.concat(node.title);

        if (depth === 1) {
          tocItems.push({
            id: id,
            title: node.title
          });
        }

        if (depth >= 2) {
          var parentPath = parents.join(" › ");

          return '' +
            '<a class="lesson-item" id="' + id + '" href="./view.html?series=' + encodeURIComponent(config.series) + '&lesson=' + encodeURIComponent(id) + '&title=' + encodeURIComponent(node.title) + '&path=' + encodeURIComponent(parentPath) + '">' +
                '<span class="lesson-date">' + escapeHtml(String(post.meta || post.date || "").split(" ")[0]) + '</span>' +
                '<strong>' + escapeHtml(node.title) + '</strong>' +
                '<span class="lesson-action"></span>' +
            '</a>';
        }

        return '' +
          '<section class="article-section">' +
            '<h' + headingLevel + ' id="' + id + '">' + escapeHtml(node.title) + '</h' + headingLevel + '>' +
            renderNodes(node.children, depth + 1, id, nextParents, post, tocItems) +
          '</section>';
      }

      if (node.type === "heading_1" || node.type === "heading_2" || node.type === "heading_3") {
        return '<p class="series-note">' + escapeHtml(node.text) + '</p>';
      }

      return '<p class="series-note">' + escapeHtml(node.text) + '</p>';
    }).join("");
  }

  function renderHeaderSyncedAt() {
    var syncedAt = document.querySelector('[data-render="headerSyncedAt"]');

    if (window.updateHeaderDataTime) {
      window.updateHeaderDataTime();
      return;
    }

    if (syncedAt) {
      syncedAt.textContent = "데이터 기준 " + (window.STUDY_POSTS_SYNCED_AT || "확인 불가");
      syncedAt.hidden = false;
    }
  }

  function loadScripts(scripts, callback) {
    loadScript(0);

    function loadScript(index) {
      var script;

      if (index >= scripts.length) {
        callback();
        return;
      }

      script = document.createElement("script");
      script.src = scripts[index];
      script.onload = function () {
        loadScript(index + 1);
      };
      script.onerror = function () {
        loadScript(index + 1);
      };
      document.body.appendChild(script);
    }
  }

  function nodeId(prefix, index) {
    return prefix + "-" + index;
  }

  function escapeHtml(value) {
    return String(value || "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }

})();
