/* ============================================================
   모드(Portfolio / Study)와 테마(Light / Dark) 전환.
   선택은 localStorage 에 저장한다.
============================================================ */

(function () {

  var root = document.documentElement;

  var modeButtons =
    document.querySelectorAll(".mode-switch button");

  var themeButton =
    document.getElementById("theme-toggle");


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
        theme === "dark" ? "Light" : "Dark";
    }

    try {
      localStorage.setItem("theme", theme);
    } catch (e) {}
  }


  /* 이벤트 --------------------------------------------
     상세 페이지에는 스위치가 없을 수 있으므로 존재할 때만 연결한다. */

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


  /* 아직 목적지가 없는 링크는 이동을 막는다. */

  document
    .querySelectorAll("[data-todo]")
    .forEach(function (element) {

      element.setAttribute("aria-disabled", "true");

      element.addEventListener("click", function (event) {
        event.preventDefault();
      });
    });


  /* 초기 상태 ----------------------------------------- */

  var mode = "portfolio";
  var theme = "light";

  try {
    mode = localStorage.getItem("mode") || mode;

    theme =
      localStorage.getItem("theme") ||
      (window.matchMedia("(prefers-color-scheme: dark)").matches
        ? "dark"
        : "light");
  } catch (e) {}

  if (document.querySelector(".mode-panel")) {
    setMode(mode);
  }

  setTheme(theme);

})();
