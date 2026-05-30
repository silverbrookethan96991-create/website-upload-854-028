(function () {
  var toggle = document.querySelector('[data-menu-toggle]');
  var mobileNav = document.querySelector('[data-mobile-nav]');

  if (toggle && mobileNav) {
    toggle.addEventListener('click', function () {
      mobileNav.classList.toggle('open');
    });
  }

  var slides = Array.prototype.slice.call(document.querySelectorAll('[data-hero-slide]'));
  var dots = Array.prototype.slice.call(document.querySelectorAll('[data-hero-dot]'));
  var heroIndex = 0;
  var heroTimer = null;

  function showHero(index) {
    if (!slides.length) {
      return;
    }
    heroIndex = (index + slides.length) % slides.length;
    slides.forEach(function (slide, i) {
      slide.classList.toggle('active', i === heroIndex);
    });
    dots.forEach(function (dot, i) {
      dot.classList.toggle('active', i === heroIndex);
    });
  }

  function startHero() {
    if (slides.length < 2) {
      return;
    }
    heroTimer = window.setInterval(function () {
      showHero(heroIndex + 1);
    }, 5200);
  }

  dots.forEach(function (dot, i) {
    dot.addEventListener('click', function () {
      if (heroTimer) {
        window.clearInterval(heroTimer);
      }
      showHero(i);
      startHero();
    });
  });

  showHero(0);
  startHero();

  var forms = Array.prototype.slice.call(document.querySelectorAll('[data-search-form]'));

  function normalize(value) {
    return String(value || '').trim().toLowerCase();
  }

  forms.forEach(function (form) {
    var input = form.querySelector('[data-search-input]');
    var year = form.querySelector('[data-year-filter]');
    var type = form.querySelector('[data-type-filter]');
    var scope = form.closest('main') || document;
    var cards = Array.prototype.slice.call(scope.querySelectorAll('[data-title]'));
    var empty = scope.querySelector('[data-no-results]');

    function applyFilter() {
      var q = normalize(input && input.value);
      var y = normalize(year && year.value);
      var t = normalize(type && type.value);
      var visible = 0;

      cards.forEach(function (card) {
        var haystack = normalize([
          card.getAttribute('data-title'),
          card.getAttribute('data-year'),
          card.getAttribute('data-type'),
          card.getAttribute('data-genre'),
          card.getAttribute('data-tags')
        ].join(' '));
        var ok = true;

        if (q && haystack.indexOf(q) === -1) {
          ok = false;
        }
        if (y && normalize(card.getAttribute('data-year')) !== y) {
          ok = false;
        }
        if (t && normalize(card.getAttribute('data-type')) !== t) {
          ok = false;
        }

        card.classList.toggle('hidden-card', !ok);
        if (ok) {
          visible += 1;
        }
      });

      if (empty) {
        empty.classList.toggle('show', visible === 0);
      }
    }

    [input, year, type].forEach(function (field) {
      if (field) {
        field.addEventListener('input', applyFilter);
        field.addEventListener('change', applyFilter);
      }
    });
  });
})();

function initMoviePlayer(streamUrl) {
  var video = document.getElementById('movieVideo');
  var overlay = document.getElementById('moviePlay');
  var hlsInstance = null;

  if (!video || !overlay || !streamUrl) {
    return;
  }

  function attachStream() {
    if (video.getAttribute('data-ready') === '1') {
      return;
    }

    if (video.canPlayType('application/vnd.apple.mpegurl')) {
      video.src = streamUrl;
    } else if (window.Hls && window.Hls.isSupported()) {
      hlsInstance = new window.Hls({
        enableWorker: true,
        lowLatencyMode: true
      });
      hlsInstance.loadSource(streamUrl);
      hlsInstance.attachMedia(video);
    } else {
      video.src = streamUrl;
    }

    video.setAttribute('data-ready', '1');
  }

  function playNow() {
    attachStream();
    overlay.classList.add('is-hidden');
    var promise = video.play();
    if (promise && typeof promise.catch === 'function') {
      promise.catch(function () {});
    }
  }

  overlay.addEventListener('click', playNow);
  video.addEventListener('play', function () {
    overlay.classList.add('is-hidden');
  });

  window.addEventListener('pagehide', function () {
    if (hlsInstance) {
      hlsInstance.destroy();
      hlsInstance = null;
    }
  });
}
