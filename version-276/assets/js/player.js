
(function () {
  const attached = new WeakMap();

  window.initMoviePlayer = function (videoId, overlayId, source) {
    const video = document.getElementById(videoId);
    const overlay = document.getElementById(overlayId);

    if (!video || !overlay || !source) {
      return;
    }

    function attach() {
      if (attached.has(video)) {
        return;
      }

      if (video.canPlayType('application/vnd.apple.mpegurl')) {
        video.src = source;
        attached.set(video, true);
        return;
      }

      if (window.Hls && window.Hls.isSupported()) {
        const hls = new window.Hls({ enableWorker: true });
        hls.loadSource(source);
        hls.attachMedia(video);
        attached.set(video, hls);
        return;
      }

      video.src = source;
      attached.set(video, true);
    }

    async function start() {
      attach();
      overlay.classList.add('is-hidden');
      video.controls = true;
      try {
        await video.play();
      } catch (error) {
        overlay.classList.remove('is-hidden');
        video.controls = true;
      }
    }

    overlay.addEventListener('click', start);
    video.addEventListener('click', function () {
      if (video.paused) {
        start();
      }
    });
    video.addEventListener('play', function () {
      overlay.classList.add('is-hidden');
    });
  };
})();
