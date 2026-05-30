(function () {
    function ready(callback) {
        if (document.readyState !== "loading") {
            callback();
            return;
        }
        document.addEventListener("DOMContentLoaded", callback);
    }

    ready(function () {
        var players = Array.prototype.slice.call(document.querySelectorAll(".movie-player"));
        players.forEach(function (player) {
            var video = player.querySelector("video");
            var cover = player.querySelector(".player-cover");
            var src = player.getAttribute("data-video");
            var hls = null;

            function bind() {
                if (!video || !src || video.getAttribute("data-ready") === "1") {
                    return;
                }
                if (video.canPlayType("application/vnd.apple.mpegurl")) {
                    video.src = src;
                } else if (window.Hls && window.Hls.isSupported()) {
                    hls = new window.Hls();
                    hls.loadSource(src);
                    hls.attachMedia(video);
                } else {
                    video.src = src;
                }
                video.setAttribute("data-ready", "1");
            }

            function play() {
                bind();
                if (cover) {
                    cover.classList.add("is-hidden");
                }
                if (video) {
                    video.controls = true;
                    var promise = video.play();
                    if (promise && typeof promise.catch === "function") {
                        promise.catch(function () {});
                    }
                }
            }

            if (cover) {
                cover.addEventListener("click", play);
            }
            if (video) {
                video.addEventListener("click", function () {
                    if (video.getAttribute("data-ready") !== "1") {
                        play();
                    }
                });
                video.addEventListener("play", function () {
                    if (cover) {
                        cover.classList.add("is-hidden");
                    }
                });
            }
            window.addEventListener("beforeunload", function () {
                if (hls && typeof hls.destroy === "function") {
                    hls.destroy();
                }
            });
        });
    });
})();
