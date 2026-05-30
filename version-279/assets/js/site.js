(function () {
  function qs(selector, root) {
    return (root || document).querySelector(selector);
  }

  function qsa(selector, root) {
    return Array.prototype.slice.call((root || document).querySelectorAll(selector));
  }

  function normalize(value) {
    return String(value || "").toLowerCase().trim();
  }

  function initMobileNav() {
    var toggle = qs(".mobile-toggle");
    var nav = qs(".mobile-nav");
    if (!toggle || !nav) {
      return;
    }
    toggle.addEventListener("click", function () {
      nav.classList.toggle("open");
    });
  }

  function initHero() {
    var slides = qsa("[data-hero-slide]");
    var dots = qsa("[data-hero-dot]");
    if (!slides.length) {
      return;
    }
    var index = 0;
    var timer;

    function show(next) {
      index = (next + slides.length) % slides.length;
      slides.forEach(function (slide, i) {
        slide.classList.toggle("active", i === index);
      });
      dots.forEach(function (dot, i) {
        dot.classList.toggle("active", i === index);
      });
    }

    function play() {
      window.clearInterval(timer);
      timer = window.setInterval(function () {
        show(index + 1);
      }, 5200);
    }

    dots.forEach(function (dot) {
      dot.addEventListener("click", function () {
        show(Number(dot.getAttribute("data-hero-dot")) || 0);
        play();
      });
    });

    var prev = qs("[data-hero-prev]");
    var next = qs("[data-hero-next]");
    if (prev) {
      prev.addEventListener("click", function () {
        show(index - 1);
        play();
      });
    }
    if (next) {
      next.addEventListener("click", function () {
        show(index + 1);
        play();
      });
    }
    play();
  }

  function initTabs() {
    var tabRoot = qs("[data-tabs]");
    if (!tabRoot) {
      return;
    }
    var buttons = qsa("[data-tab]", tabRoot);
    var panels = qsa("[data-panel]");
    buttons.forEach(function (button) {
      button.addEventListener("click", function () {
        var key = button.getAttribute("data-tab");
        buttons.forEach(function (item) {
          item.classList.toggle("active", item === button);
        });
        panels.forEach(function (panel) {
          panel.classList.toggle("active", panel.getAttribute("data-panel") === key);
        });
      });
    });
  }

  function applyFilter(root) {
    var input = qs("[data-local-search]", root);
    var cards = qsa(".movie-card", document);
    var activeYear = "all";
    var activeType = "all";
    var activeCategory = "all";

    function refresh() {
      var query = normalize(input ? input.value : "");
      cards.forEach(function (card) {
        var text = normalize(card.getAttribute("data-search"));
        var year = card.getAttribute("data-year") || "";
        var type = card.getAttribute("data-type") || "";
        var category = card.getAttribute("data-category") || "";
        var ok = true;
        if (query && text.indexOf(query) === -1) {
          ok = false;
        }
        if (activeYear !== "all" && year !== activeYear) {
          ok = false;
        }
        if (activeType !== "all" && type !== activeType) {
          ok = false;
        }
        if (activeCategory !== "all" && category !== activeCategory) {
          ok = false;
        }
        card.classList.toggle("hidden-by-filter", !ok);
      });
    }

    if (input) {
      var params = new URLSearchParams(window.location.search);
      var q = params.get("q");
      if (q) {
        input.value = q;
      }
      input.addEventListener("input", refresh);
    }

    qsa("[data-filter-year]", root).forEach(function (button) {
      button.addEventListener("click", function () {
        activeYear = button.getAttribute("data-filter-year") || "all";
        qsa("[data-filter-year]", root).forEach(function (item) {
          item.classList.toggle("active", item === button);
        });
        refresh();
      });
    });

    qsa("[data-filter-type]", root).forEach(function (button) {
      button.addEventListener("click", function () {
        activeType = button.getAttribute("data-filter-type") || "all";
        qsa("[data-filter-type]", root).forEach(function (item) {
          item.classList.toggle("active", item === button);
        });
        refresh();
      });
    });

    qsa("[data-filter-category]", root).forEach(function (button) {
      button.addEventListener("click", function () {
        activeCategory = button.getAttribute("data-filter-category") || "all";
        qsa("[data-filter-category]", root).forEach(function (item) {
          item.classList.toggle("active", item === button);
        });
        refresh();
      });
    });

    refresh();
  }

  function initFilters() {
    qsa("[data-filter-root]").forEach(applyFilter);
  }

  function initSearchForms() {
    qsa(".search-form").forEach(function (form) {
      form.addEventListener("submit", function (event) {
        var input = qs("input[name='q']", form);
        if (!input || !input.value.trim()) {
          event.preventDefault();
          window.location.href = "./search.html";
        }
      });
    });
  }

  function setupPlayer(videoId, overlayId, source) {
    var video = document.getElementById(videoId);
    var overlay = document.getElementById(overlayId);
    if (!video || !overlay || !source) {
      return;
    }
    var attached = false;
    var hlsInstance = null;

    function attach() {
      if (attached) {
        return;
      }
      attached = true;
      if (video.canPlayType("application/vnd.apple.mpegurl")) {
        video.src = source;
      } else if (window.Hls && window.Hls.isSupported()) {
        hlsInstance = new window.Hls({
          enableWorker: true,
          lowLatencyMode: true
        });
        hlsInstance.loadSource(source);
        hlsInstance.attachMedia(video);
      } else {
        video.src = source;
      }
      video.setAttribute("controls", "controls");
    }

    function play() {
      attach();
      overlay.classList.add("is-hidden");
      var promise = video.play();
      if (promise && typeof promise.catch === "function") {
        promise.catch(function () {
          overlay.classList.remove("is-hidden");
        });
      }
    }

    overlay.addEventListener("click", play);
    video.addEventListener("click", function () {
      if (video.paused) {
        play();
      }
    });
    window.addEventListener("pagehide", function () {
      if (hlsInstance && typeof hlsInstance.destroy === "function") {
        hlsInstance.destroy();
      }
    });
  }

  document.addEventListener("DOMContentLoaded", function () {
    initMobileNav();
    initHero();
    initTabs();
    initFilters();
    initSearchForms();
  });

  window.MovieSite = {
    setupPlayer: setupPlayer
  };
})();
