(function () {
  function $(selector, root) {
    return (root || document).querySelector(selector);
  }

  function $all(selector, root) {
    return Array.prototype.slice.call((root || document).querySelectorAll(selector));
  }

  function esc(value) {
    return String(value || "").replace(/[&<>"']/g, function (char) {
      return {
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        "\"": "&quot;",
        "'": "&#39;"
      }[char];
    });
  }

  function normalize(value) {
    return String(value || "").trim().toLowerCase();
  }

  $all("[data-menu-toggle]").forEach(function (button) {
    button.addEventListener("click", function () {
      var menu = $("[data-nav-menu]");
      if (menu) {
        menu.classList.toggle("open");
      }
    });
  });

  var hero = $("[data-hero]");
  if (hero) {
    var slides = $all("[data-hero-slide]", hero);
    var dots = $all("[data-hero-dot]", hero);
    var active = 0;
    var timer = null;
    var show = function (index) {
      active = (index + slides.length) % slides.length;
      slides.forEach(function (slide, i) {
        slide.classList.toggle("active", i === active);
      });
      dots.forEach(function (dot, i) {
        dot.classList.toggle("active", i === active);
      });
    };
    var start = function () {
      timer = window.setInterval(function () {
        show(active + 1);
      }, 5200);
    };
    dots.forEach(function (dot, i) {
      dot.addEventListener("click", function () {
        if (timer) {
          window.clearInterval(timer);
        }
        show(i);
        start();
      });
    });
    if (slides.length > 1) {
      start();
    }
  }

  var searchPanel = $("#searchPanel");
  if (searchPanel && Array.isArray(window.moviesIndex)) {
    var keyword = $("#searchKeyword");
    var filterType = $("#filterType");
    var filterRegion = $("#filterRegion");
    var filterYear = $("#filterYear");
    var results = $("#searchResults");
    var status = $("#searchStatus");
    var params = new URLSearchParams(window.location.search);

    function fillSelect(select, values) {
      values.forEach(function (value) {
        var option = document.createElement("option");
        option.value = value;
        option.textContent = value;
        select.appendChild(option);
      });
    }

    fillSelect(filterType, Array.from(new Set(window.moviesIndex.map(function (movie) { return movie.type; }).filter(Boolean))).sort());
    fillSelect(filterRegion, Array.from(new Set(window.moviesIndex.map(function (movie) { return movie.region; }).filter(Boolean))).sort());
    fillSelect(filterYear, Array.from(new Set(window.moviesIndex.map(function (movie) { return movie.year; }).filter(Boolean))).sort().reverse());

    keyword.value = params.get("q") || "";
    filterType.value = params.get("type") || "";
    filterRegion.value = params.get("region") || "";
    filterYear.value = params.get("year") || "";

    function card(movie) {
      var tags = (movie.tags || []).slice(0, 3).join(", ");
      return [
        "<article class=\"poster-card\"><a class=\"poster-link\" href=\"" + esc(movie.url) + "\">",
        "<figure class=\"poster-frame\"><img src=\"" + esc(movie.cover) + "\" alt=\"" + esc(movie.title) + "\" loading=\"lazy\"><figcaption>" + esc(movie.one_line) + "</figcaption><span class=\"quality-badge\">高清</span></figure>",
        "<div class=\"poster-info\"><h3>" + esc(movie.title) + "</h3><p>" + esc(movie.one_line) + "</p>",
        "<div class=\"poster-meta\"><span>" + esc(movie.year) + "</span><span>" + esc(movie.region) + "</span><span>" + esc(movie.category) + "</span></div>",
        "<div class=\"tag-row\"><span>" + esc(tags || movie.genre) + "</span></div></div></a></article>"
      ].join("");
    }

    function render() {
      var q = normalize(keyword.value);
      var type = filterType.value;
      var region = filterRegion.value;
      var year = filterYear.value;
      var list = window.moviesIndex.filter(function (movie) {
        var haystack = normalize([movie.title, movie.region, movie.type, movie.year, movie.genre, movie.one_line, (movie.tags || []).join(" ")].join(" "));
        return (!q || haystack.indexOf(q) !== -1) && (!type || movie.type === type) && (!region || movie.region === region) && (!year || movie.year === year);
      }).slice(0, 120);
      if (results) {
        results.innerHTML = list.map(card).join("");
      }
      if (status) {
        status.textContent = list.length ? "为你找到相关影片" : "没有找到匹配影片";
      }
    }

    searchPanel.addEventListener("submit", function (event) {
      event.preventDefault();
      render();
    });

    [keyword, filterType, filterRegion, filterYear].forEach(function (node) {
      node.addEventListener("input", render);
      node.addEventListener("change", render);
    });

    render();
  }
})();
