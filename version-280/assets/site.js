const menuButton = document.querySelector(".menu-toggle");
const mobilePanel = document.querySelector(".mobile-panel");

if (menuButton && mobilePanel) {
  menuButton.addEventListener("click", () => {
    const isOpen = mobilePanel.hasAttribute("hidden");
    if (isOpen) {
      mobilePanel.removeAttribute("hidden");
      menuButton.setAttribute("aria-expanded", "true");
      menuButton.textContent = "×";
    } else {
      mobilePanel.setAttribute("hidden", "");
      menuButton.setAttribute("aria-expanded", "false");
      menuButton.textContent = "☰";
    }
  });
}

const carousel = document.querySelector("[data-hero-carousel]");

if (carousel) {
  const slides = [...carousel.querySelectorAll(".hero-slide")];
  const dots = [...carousel.querySelectorAll(".hero-dot")];
  let active = Math.max(0, slides.findIndex((slide) => slide.classList.contains("is-active")));

  const showSlide = (index) => {
    active = (index + slides.length) % slides.length;
    slides.forEach((slide, slideIndex) => {
      slide.classList.toggle("is-active", slideIndex === active);
    });
    dots.forEach((dot, dotIndex) => {
      dot.classList.toggle("is-active", dotIndex === active);
    });
  };

  dots.forEach((dot, index) => {
    dot.addEventListener("click", () => showSlide(index));
  });

  if (slides.length > 1) {
    window.setInterval(() => showSlide(active + 1), 5200);
  }
}

const normalize = (value) => String(value || "").trim().toLowerCase();

const applyQueryToSearchInput = () => {
  const params = new URLSearchParams(window.location.search);
  const query = params.get("q");
  const input = document.querySelector(".filter-input");
  if (query && input) {
    input.value = query;
  }
};

const initFilters = () => {
  const bars = [...document.querySelectorAll("[data-filter-bar]")];
  bars.forEach((bar) => {
    const section = bar.closest(".content-section") || document;
    const cards = [...section.querySelectorAll(".movie-card")];
    const empty = section.querySelector(".empty-state");
    const input = bar.querySelector(".filter-input");
    const region = bar.querySelector(".filter-region");
    const type = bar.querySelector(".filter-type");
    const year = bar.querySelector(".filter-year");

    const update = () => {
      const keyword = normalize(input && input.value);
      const regionValue = normalize(region && region.value);
      const typeValue = normalize(type && type.value);
      const yearValue = normalize(year && year.value);
      let visibleCount = 0;

      cards.forEach((card) => {
        const haystack = normalize([
          card.dataset.title,
          card.dataset.region,
          card.dataset.type,
          card.dataset.year,
          card.dataset.genre,
          card.dataset.tags,
          card.textContent
        ].join(" "));
        const matchesKeyword = !keyword || haystack.includes(keyword);
        const matchesRegion = !regionValue || normalize(card.dataset.region) === regionValue;
        const matchesType = !typeValue || normalize(card.dataset.type) === typeValue;
        const matchesYear = !yearValue || normalize(card.dataset.year) === yearValue;
        const isVisible = matchesKeyword && matchesRegion && matchesType && matchesYear;
        card.hidden = !isVisible;
        if (isVisible) {
          visibleCount += 1;
        }
      });

      if (empty) {
        empty.hidden = visibleCount !== 0;
      }
    };

    [input, region, type, year].forEach((control) => {
      if (control) {
        control.addEventListener("input", update);
        control.addEventListener("change", update);
      }
    });

    update();
  });
};

applyQueryToSearchInput();
initFilters();
