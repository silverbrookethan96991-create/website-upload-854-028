(function () {
    function ready(callback) {
        if (document.readyState !== "loading") {
            callback();
            return;
        }
        document.addEventListener("DOMContentLoaded", callback);
    }

    ready(function () {
        var menuButton = document.querySelector("[data-menu-toggle]");
        var mobilePanel = document.querySelector("[data-mobile-panel]");
        if (menuButton && mobilePanel) {
            menuButton.addEventListener("click", function () {
                mobilePanel.classList.toggle("is-open");
            });
        }

        var slides = Array.prototype.slice.call(document.querySelectorAll("[data-hero-slide]"));
        var dots = Array.prototype.slice.call(document.querySelectorAll("[data-hero-dot]"));
        var current = 0;

        function showSlide(index) {
            if (!slides.length) {
                return;
            }
            current = (index + slides.length) % slides.length;
            slides.forEach(function (slide, slideIndex) {
                slide.classList.toggle("is-active", slideIndex === current);
            });
            dots.forEach(function (dot, dotIndex) {
                dot.classList.toggle("is-active", dotIndex === current);
            });
        }

        dots.forEach(function (dot) {
            dot.addEventListener("click", function () {
                showSlide(Number(dot.getAttribute("data-hero-dot")) || 0);
            });
        });

        if (slides.length > 1) {
            setInterval(function () {
                showSlide(current + 1);
            }, 5200);
        }

        function normalize(value) {
            return String(value || "").toLowerCase().trim();
        }

        function applyFilter(scope, query) {
            var area = scope ? document.getElementById(scope) : document;
            if (!area) {
                area = document;
            }
            var words = normalize(query).split(/\s+/).filter(Boolean);
            var cards = Array.prototype.slice.call(area.querySelectorAll(".searchable-card"));
            cards.forEach(function (card) {
                var text = normalize([
                    card.getAttribute("data-title"),
                    card.getAttribute("data-region"),
                    card.getAttribute("data-year"),
                    card.getAttribute("data-type"),
                    card.getAttribute("data-tags"),
                    card.getAttribute("data-category"),
                    card.textContent
                ].join(" "));
                var matched = words.every(function (word) {
                    return text.indexOf(word) !== -1;
                });
                card.classList.toggle("is-hidden", words.length > 0 && !matched);
            });
        }

        var filterForms = Array.prototype.slice.call(document.querySelectorAll("[data-filter-scope]"));
        filterForms.forEach(function (form) {
            var input = form.querySelector("[data-search-input]");
            var scope = form.getAttribute("data-filter-scope");
            if (!input) {
                return;
            }
            form.addEventListener("submit", function (event) {
                event.preventDefault();
                applyFilter(scope, input.value);
            });
            input.addEventListener("input", function () {
                applyFilter(scope, input.value);
            });
        });

        var urlInput = document.querySelector("[data-url-query]");
        if (urlInput) {
            var params = new URLSearchParams(window.location.search);
            var key = urlInput.getAttribute("data-url-query");
            var value = params.get(key) || "";
            if (value) {
                urlInput.value = value;
                var parent = urlInput.closest("[data-filter-scope]");
                applyFilter(parent ? parent.getAttribute("data-filter-scope") : null, value);
            }
        }
    });
})();
