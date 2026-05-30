export function createHlsPlayer(options) {
    const video = document.getElementById(options.videoId);
    const overlay = document.getElementById(options.overlayId);
    const source = options.source;
    let loaded = false;
    let hls = null;
    let shouldPlay = false;

    if (!video || !source) {
        return;
    }

    const hideOverlay = () => {
        if (overlay) {
            overlay.classList.add("is-hidden");
        }
    };

    const loadSource = () => {
        if (loaded) {
            return;
        }

        loaded = true;

        if (video.canPlayType("application/vnd.apple.mpegurl")) {
            video.src = source;
            if (shouldPlay) {
                video.play().catch(() => {});
            }
            return;
        }

        if (window.Hls && window.Hls.isSupported()) {
            hls = new window.Hls({
                enableWorker: true,
                lowLatencyMode: true
            });
            hls.loadSource(source);
            hls.attachMedia(video);
            hls.on(window.Hls.Events.MANIFEST_PARSED, () => {
                if (shouldPlay) {
                    video.play().catch(() => {});
                }
            });
            hls.on(window.Hls.Events.ERROR, (_event, data) => {
                if (data && data.fatal && hls) {
                    if (data.type === window.Hls.ErrorTypes.NETWORK_ERROR) {
                        hls.startLoad();
                    } else if (data.type === window.Hls.ErrorTypes.MEDIA_ERROR) {
                        hls.recoverMediaError();
                    }
                }
            });
        }
    };

    const playVideo = () => {
        shouldPlay = true;
        loadSource();
        hideOverlay();
        video.play().catch(() => {});
    };

    if (overlay) {
        overlay.addEventListener("click", playVideo);
    }

    video.addEventListener("play", hideOverlay);
    video.addEventListener("loadedmetadata", () => {
        if (shouldPlay) {
            video.play().catch(() => {});
        }
    });
    video.addEventListener("emptied", () => {
        if (overlay) {
            overlay.classList.remove("is-hidden");
        }
    });

    video.addEventListener("mouseenter", loadSource, { once: true });
}
