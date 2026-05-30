(function () {
    var navButton = document.querySelector('[data-nav-toggle]');
    var navLinks = document.querySelector('[data-nav-links]');
    if (navButton && navLinks) {
        navButton.addEventListener('click', function () {
            navLinks.classList.toggle('is-open');
        });
    }

    var canvas = document.querySelector('[data-bubbles]');
    if (canvas) {
        var context = canvas.getContext('2d');
        var bubbles = [];
        var colors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A', '#98D8C8', '#F7DC6F', '#BB8FCE', '#85C1E2'];
        var resizeCanvas = function () {
            canvas.width = canvas.offsetWidth || window.innerWidth;
            canvas.height = canvas.offsetHeight || 560;
        };
        var makeBubbles = function () {
            bubbles = [];
            for (var i = 0; i < 46; i += 1) {
                bubbles.push({
                    x: Math.random() * canvas.width,
                    y: Math.random() * canvas.height,
                    size: Math.random() * 14 + 8,
                    speed: Math.random() * 1.1 + 0.35,
                    drift: (Math.random() - 0.5) * 0.7,
                    color: colors[Math.floor(Math.random() * colors.length)],
                    alpha: Math.random() * 0.35 + 0.2
                });
            }
        };
        var draw = function () {
            context.clearRect(0, 0, canvas.width, canvas.height);
            bubbles.forEach(function (bubble) {
                bubble.y -= bubble.speed;
                bubble.x += bubble.drift;
                if (bubble.y < -bubble.size) {
                    bubble.y = canvas.height + bubble.size;
                    bubble.x = Math.random() * canvas.width;
                }
                context.save();
                context.globalAlpha = bubble.alpha;
                context.beginPath();
                context.arc(bubble.x, bubble.y, bubble.size, 0, Math.PI * 2);
                context.fillStyle = bubble.color;
                context.fill();
                context.restore();
            });
            window.requestAnimationFrame(draw);
        };
        resizeCanvas();
        makeBubbles();
        draw();
        window.addEventListener('resize', function () {
            resizeCanvas();
            makeBubbles();
        });
    }

    var hero = document.querySelector('[data-hero]');
    if (hero) {
        var slides = Array.prototype.slice.call(hero.querySelectorAll('[data-hero-slide]'));
        var current = 0;
        var showSlide = function (index) {
            current = (index + slides.length) % slides.length;
            slides.forEach(function (slide, slideIndex) {
                slide.classList.toggle('is-active', slideIndex === current);
            });
        };
        var nextButton = hero.querySelector('[data-hero-next]');
        var prevButton = hero.querySelector('[data-hero-prev]');
        if (nextButton) {
            nextButton.addEventListener('click', function () {
                showSlide(current + 1);
            });
        }
        if (prevButton) {
            prevButton.addEventListener('click', function () {
                showSlide(current - 1);
            });
        }
        window.setInterval(function () {
            showSlide(current + 1);
        }, 5800);
    }

    var localSearch = document.querySelector('[data-local-search]');
    var filterList = document.querySelector('[data-filter-list]');
    var activeFilter = { key: 'all', value: 'all' };
    var applyFilters = function () {
        if (!filterList) {
            return;
        }
        var query = localSearch ? localSearch.value.trim().toLowerCase() : '';
        Array.prototype.slice.call(filterList.querySelectorAll('[data-title]')).forEach(function (item) {
            var text = item.textContent.toLowerCase();
            var matchesText = !query || text.indexOf(query) !== -1;
            var matchesFilter = activeFilter.key === 'all' || item.getAttribute('data-' + activeFilter.key) === activeFilter.value;
            item.classList.toggle('is-hidden-by-filter', !(matchesText && matchesFilter));
        });
    };
    if (localSearch && filterList) {
        localSearch.addEventListener('input', applyFilters);
    }
    Array.prototype.slice.call(document.querySelectorAll('[data-filter]')).forEach(function (button) {
        button.addEventListener('click', function () {
            Array.prototype.slice.call(document.querySelectorAll('[data-filter]')).forEach(function (item) {
                item.classList.remove('is-active');
            });
            button.classList.add('is-active');
            activeFilter = {
                key: button.getAttribute('data-filter'),
                value: button.getAttribute('data-value')
            };
            applyFilters();
        });
    });

    var players = Array.prototype.slice.call(document.querySelectorAll('video[data-hls]'));
    players.forEach(function (video) {
        var stream = video.getAttribute('data-hls');
        var cover = video.parentElement ? video.parentElement.querySelector('[data-play-cover]') : null;
        var prepared = false;
        var prepare = function () {
            if (prepared || !stream) {
                return;
            }
            prepared = true;
            if (video.canPlayType('application/vnd.apple.mpegurl')) {
                video.src = stream;
            } else if (window.Hls && window.Hls.isSupported()) {
                var hls = new window.Hls({ enableWorker: true, lowLatencyMode: true });
                hls.loadSource(stream);
                hls.attachMedia(video);
                video._hlsInstance = hls;
            } else {
                video.src = stream;
            }
        };
        var start = function () {
            prepare();
            if (cover) {
                cover.classList.add('is-hidden');
            }
            var action = video.play();
            if (action && typeof action.catch === 'function') {
                action.catch(function () {});
            }
        };
        if (cover) {
            cover.addEventListener('click', start);
        }
        video.addEventListener('click', prepare, { once: true });
        video.addEventListener('play', function () {
            if (cover) {
                cover.classList.add('is-hidden');
            }
        });
    });

    var escapeHtml = function (value) {
        return String(value || '').replace(/[&<>\"]/g, function (character) {
            return {
                '&': '&amp;',
                '<': '&lt;',
                '>': '&gt;',
                '\"': '&quot;'
            }[character];
        });
    };

    var searchInput = document.querySelector('[data-search-input]');
    var searchResults = document.querySelector('[data-search-results]');
    var searchForm = document.querySelector('[data-search-page-form]');
    var renderSearch = function () {
        if (!searchInput || !searchResults || !window.SEARCH_INDEX) {
            return;
        }
        var query = searchInput.value.trim().toLowerCase();
        if (!query) {
            searchResults.innerHTML = '<p class="muted">请输入关键词开始搜索。</p>';
            return;
        }
        var results = window.SEARCH_INDEX.filter(function (item) {
            return item.keywords.indexOf(query) !== -1;
        }).slice(0, 80);
        if (!results.length) {
            searchResults.innerHTML = '<p class="muted">没有找到匹配的影片。</p>';
            return;
        }
        searchResults.innerHTML = results.map(function (item) {
            var title = escapeHtml(item.title);
            var image = escapeHtml(item.image);
            var page = escapeHtml(item.page);
            var region = escapeHtml(item.region);
            var year = escapeHtml(item.year);
            var type = escapeHtml(item.type);
            var oneLine = escapeHtml(item.oneLine);
            return '<a class="search-result" href="./' + page + '">' +
                '<img src="' + image + '" alt="' + title + '">' +
                '<span><strong>' + title + '</strong><em>' + region + ' · ' + year + ' · ' + type + '</em><span>' + oneLine + '</span></span>' +
                '</a>';
        }).join('');
    };
    if (searchInput && searchResults) {
        var params = new URLSearchParams(window.location.search);
        var initial = params.get('q') || '';
        searchInput.value = initial;
        renderSearch();
        searchInput.addEventListener('input', renderSearch);
    }
    if (searchForm) {
        searchForm.addEventListener('submit', function (event) {
            event.preventDefault();
            renderSearch();
            var query = searchInput ? searchInput.value.trim() : '';
            if (query) {
                window.history.replaceState(null, '', './search.html?q=' + encodeURIComponent(query));
            }
        });
    }
})();
