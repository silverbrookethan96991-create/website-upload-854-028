
(function () {
  const button = document.querySelector('[data-menu-button]');
  const mobileNav = document.querySelector('[data-mobile-nav]');

  if (button && mobileNav) {
    button.addEventListener('click', function () {
      mobileNav.classList.toggle('open');
      button.textContent = mobileNav.classList.contains('open') ? '×' : '☰';
    });
  }

  document.querySelectorAll('[data-hero]').forEach(function (hero) {
    const slides = Array.from(hero.querySelectorAll('.hero-slide'));
    const dots = Array.from(hero.querySelectorAll('.hero-dot'));
    if (!slides.length) {
      return;
    }

    let current = Math.max(0, slides.findIndex(function (slide) {
      return slide.classList.contains('active');
    }));

    function show(index) {
      current = (index + slides.length) % slides.length;
      slides.forEach(function (slide, slideIndex) {
        slide.classList.toggle('active', slideIndex === current);
      });
      dots.forEach(function (dot, dotIndex) {
        dot.classList.toggle('active', dotIndex === current);
      });
    }

    dots.forEach(function (dot, index) {
      dot.addEventListener('click', function () {
        show(index);
      });
    });

    show(current);
    window.setInterval(function () {
      show(current + 1);
    }, 6200);
  });

  function normalize(value) {
    return String(value || '').trim().toLowerCase();
  }

  function bindFilter(inputSelector, cardSelector, emptySelector) {
    const input = document.querySelector(inputSelector);
    const cards = Array.from(document.querySelectorAll(cardSelector));
    const empty = document.querySelector(emptySelector);

    if (!input || !cards.length) {
      return;
    }

    function apply() {
      const value = normalize(input.value);
      let visible = 0;
      cards.forEach(function (card) {
        const haystack = normalize((card.dataset.title || '') + ' ' + (card.dataset.meta || '') + ' ' + card.textContent);
        const matched = !value || haystack.includes(value);
        card.classList.toggle('hidden-card', !matched);
        if (matched) {
          visible += 1;
        }
      });
      if (empty) {
        empty.classList.toggle('visible', visible === 0);
      }
    }

    input.addEventListener('input', apply);
    apply();
  }

  const params = new URLSearchParams(window.location.search);
  const query = params.get('q') || '';
  const globalSearchInput = document.querySelector('[data-filter-input]');
  if (globalSearchInput && query) {
    globalSearchInput.value = query;
  }

  bindFilter('[data-filter-input]', '[data-search-card]', '[data-empty-state]');
  bindFilter('[data-local-filter]', '[data-search-card]', '[data-empty-state]');
})();
