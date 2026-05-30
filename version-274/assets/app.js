(() => {
  const $ = (selector, parent = document) => parent.querySelector(selector);
  const $$ = (selector, parent = document) => Array.from(parent.querySelectorAll(selector));

  const menuButton = $('.menu-toggle');
  const mobilePanel = $('.mobile-panel');
  if (menuButton && mobilePanel) {
    menuButton.addEventListener('click', () => {
      mobilePanel.classList.toggle('open');
      menuButton.textContent = mobilePanel.classList.contains('open') ? '×' : '☰';
    });
  }

  const slides = $$('.hero-slide');
  const dots = $$('.hero-dot');
  const thumbs = $$('.hero-thumb');
  let current = 0;
  const showSlide = (index) => {
    if (!slides.length) return;
    current = (index + slides.length) % slides.length;
    slides.forEach((slide, idx) => slide.classList.toggle('active', idx === current));
    dots.forEach((dot, idx) => dot.classList.toggle('active', idx === current));
    thumbs.forEach((thumb, idx) => thumb.classList.toggle('active', idx === current));
  };
  dots.forEach((dot) => dot.addEventListener('click', () => showSlide(Number(dot.dataset.slide || 0))));
  thumbs.forEach((thumb) => thumb.addEventListener('click', () => showSlide(Number(thumb.dataset.slide || 0))));
  if (slides.length > 1) {
    window.setInterval(() => showSlide(current + 1), 5600);
  }

  const filterInputs = $$('[data-filter]');
  const cards = $$('.filter-card');
  const searchParams = new URLSearchParams(window.location.search);
  const initialQuery = searchParams.get('q') || '';
  const textInput = $('[data-filter="text"]');
  if (textInput && initialQuery) {
    textInput.value = initialQuery;
  }

  const normalize = (value) => String(value || '').trim().toLowerCase();
  const applyFilters = () => {
    if (!cards.length) return;
    const text = normalize(($('[data-filter="text"]') || {}).value);
    const category = normalize(($('[data-filter="category"]') || {}).value);
    const year = normalize(($('[data-filter="year"]') || {}).value);
    cards.forEach((card) => {
      const haystack = normalize([
        card.dataset.title,
        card.dataset.year,
        card.dataset.region,
        card.dataset.genre,
        card.dataset.category,
      ].join(' '));
      const matchText = !text || haystack.includes(text);
      const matchCategory = !category || normalize(card.dataset.category) === category;
      const matchYear = !year || normalize(card.dataset.year).includes(year);
      card.classList.toggle('hidden', !(matchText && matchCategory && matchYear));
    });
  };
  filterInputs.forEach((input) => input.addEventListener('input', applyFilters));
  filterInputs.forEach((input) => input.addEventListener('change', applyFilters));
  applyFilters();
})();
