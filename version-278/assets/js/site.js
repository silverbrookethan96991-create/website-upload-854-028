const mobileToggle = document.querySelector(".mobile-toggle");
const mobileMenu = document.querySelector(".mobile-menu");

if (mobileToggle && mobileMenu) {
    mobileToggle.addEventListener("click", () => {
        mobileMenu.classList.toggle("is-open");
        mobileToggle.setAttribute("aria-expanded", mobileMenu.classList.contains("is-open") ? "true" : "false");
    });
}

const hero = document.querySelector(".hero");

if (hero) {
    const slides = Array.from(hero.querySelectorAll(".hero-slide"));
    const dots = Array.from(hero.querySelectorAll(".hero-dot"));
    let activeIndex = 0;

    const activateSlide = (index) => {
        activeIndex = index;
        slides.forEach((slide, slideIndex) => {
            slide.classList.toggle("is-active", slideIndex === index);
        });
        dots.forEach((dot, dotIndex) => {
            dot.classList.toggle("is-active", dotIndex === index);
        });
    };

    dots.forEach((dot, index) => {
        dot.addEventListener("click", () => activateSlide(index));
    });

    if (slides.length > 1) {
        setInterval(() => {
            activateSlide((activeIndex + 1) % slides.length);
        }, 5200);
    }
}

const normalize = (value) => String(value || "").trim().toLowerCase();
const searchInput = document.querySelector(".js-card-search");
const selectFilters = Array.from(document.querySelectorAll(".js-filter-select"));
const cards = Array.from(document.querySelectorAll(".search-card"));
const emptyState = document.querySelector(".empty-state");

const applyFilters = () => {
    if (!cards.length) {
        return;
    }

    const keyword = normalize(searchInput ? searchInput.value : "");
    const filters = selectFilters.map((select) => ({
        key: select.getAttribute("data-filter-key"),
        value: normalize(select.value)
    })).filter((item) => item.key && item.value);

    let visibleCount = 0;

    cards.forEach((card) => {
        const text = normalize(card.getAttribute("data-search"));
        const matchesKeyword = !keyword || text.includes(keyword);
        const matchesFilters = filters.every((filter) => normalize(card.getAttribute(`data-${filter.key}`)) === filter.value);
        const visible = matchesKeyword && matchesFilters;
        card.classList.toggle("is-hidden", !visible);
        if (visible) {
            visibleCount += 1;
        }
    });

    if (emptyState) {
        emptyState.classList.toggle("is-visible", visibleCount === 0);
    }
};

if (searchInput) {
    const params = new URLSearchParams(window.location.search);
    const query = params.get("q");
    if (query) {
        searchInput.value = query;
    }
    searchInput.addEventListener("input", applyFilters);
}

selectFilters.forEach((select) => {
    select.addEventListener("change", applyFilters);
});

applyFilters();
