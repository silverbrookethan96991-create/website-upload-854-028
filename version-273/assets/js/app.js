(function () {
  function ready(fn) {
    if (document.readyState !== "loading") {
      fn();
    } else {
      document.addEventListener("DOMContentLoaded", fn);
    }
  }

  function normalize(value) {
    return String(value || "")
      .toLowerCase()
      .trim();
  }

  function setupMenu() {
    var toggle = document.querySelector(".nav-toggle");
    var panel = document.querySelector(".mobile-panel");
    if (!toggle || !panel) return;
    toggle.addEventListener("click", function () {
      var open = panel.classList.toggle("is-open");
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
    });
  }

  function setupHero() {
    var carousel = document.querySelector("[data-hero-carousel]");
    if (!carousel) return;
    var slides = Array.prototype.slice.call(
      carousel.querySelectorAll(".hero-slide"),
    );
    var dots = Array.prototype.slice.call(
      carousel.querySelectorAll(".hero-dot"),
    );
    var prev = carousel.querySelector("[data-hero-prev]");
    var next = carousel.querySelector("[data-hero-next]");
    var index = Math.max(
      0,
      slides.findIndex(function (slide) {
        return slide.classList.contains("is-active");
      }),
    );
    var timer = null;

    function show(nextIndex) {
      if (!slides.length) return;
      index = (nextIndex + slides.length) % slides.length;
      slides.forEach(function (slide, slideIndex) {
        slide.classList.toggle("is-active", slideIndex === index);
      });
      dots.forEach(function (dot, dotIndex) {
        dot.classList.toggle("is-active", dotIndex === index);
      });
    }

    function start() {
      stop();
      timer = window.setInterval(function () {
        show(index + 1);
      }, 5200);
    }

    function stop() {
      if (timer) {
        window.clearInterval(timer);
        timer = null;
      }
    }

    dots.forEach(function (dot) {
      dot.addEventListener("click", function () {
        show(Number(dot.getAttribute("data-slide")) || 0);
        start();
      });
    });

    if (prev) {
      prev.addEventListener("click", function () {
        show(index - 1);
        start();
      });
    }

    if (next) {
      next.addEventListener("click", function () {
        show(index + 1);
        start();
      });
    }

    carousel.addEventListener("mouseenter", stop);
    carousel.addEventListener("mouseleave", start);
    show(index);
    start();
  }

  function setupFiltering() {
    var input = document.querySelector(".js-search-input");
    var list = document.querySelector(".js-card-list");
    if (!input || !list) return;
    var cards = Array.prototype.slice.call(
      list.querySelectorAll(".movie-card, .rank-item"),
    );
    var empty = document.querySelector(".empty-state");
    var chips = Array.prototype.slice.call(
      document.querySelectorAll(".filter-chip"),
    );
    var activeFilter = "全部";
    var params = new URLSearchParams(window.location.search);
    var initial = params.get("q");

    if (initial) {
      input.value = initial;
    }

    function matchesFilter(card, filter) {
      if (!filter || filter === "全部") return true;
      var blob = normalize(
        [
          card.getAttribute("data-kind"),
          card.getAttribute("data-region"),
          card.getAttribute("data-genre"),
          card.getAttribute("data-tags"),
          card.getAttribute("data-search"),
        ].join(" "),
      );
      return blob.indexOf(normalize(filter)) !== -1;
    }

    function apply() {
      var query = normalize(input.value);
      var visible = 0;
      cards.forEach(function (card) {
        var blob = normalize(card.getAttribute("data-search"));
        var matched =
          (!query || blob.indexOf(query) !== -1) &&
          matchesFilter(card, activeFilter);
        card.hidden = !matched;
        if (matched) visible += 1;
      });
      if (empty) {
        empty.hidden = visible !== 0;
      }
    }

    input.addEventListener("input", apply);
    chips.forEach(function (chip) {
      chip.addEventListener("click", function () {
        activeFilter = chip.getAttribute("data-filter") || "全部";
        chips.forEach(function (item) {
          item.classList.toggle("is-active", item === chip);
        });
        apply();
      });
    });
    apply();
  }

  ready(function () {
    setupMenu();
    setupHero();
    setupFiltering();
  });
})();
