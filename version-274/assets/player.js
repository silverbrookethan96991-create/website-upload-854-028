(() => {
  const startPlayback = (shell) => {
    const video = shell.querySelector('video');
    if (!video) return;
    const stream = video.getAttribute('data-stream');
    if (!stream) return;
    shell.classList.add('is-playing');

    const play = () => {
      const promise = video.play();
      if (promise && typeof promise.catch === 'function') {
        promise.catch(() => {});
      }
    };

    if (video.canPlayType('application/vnd.apple.mpegurl')) {
      if (!video.getAttribute('src')) {
        video.setAttribute('src', stream);
      }
      play();
      return;
    }

    if (window.Hls && window.Hls.isSupported()) {
      if (!video.hlsController) {
        const hls = new window.Hls({ enableWorker: true, lowLatencyMode: true });
        hls.loadSource(stream);
        hls.attachMedia(video);
        video.hlsController = hls;
        hls.on(window.Hls.Events.MANIFEST_PARSED, play);
      } else {
        play();
      }
      return;
    }

    if (!video.getAttribute('src')) {
      video.setAttribute('src', stream);
    }
    play();
  };

  document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.player-shell').forEach((shell) => {
      const overlay = shell.querySelector('.play-overlay');
      const video = shell.querySelector('video');
      if (overlay) {
        overlay.addEventListener('click', () => startPlayback(shell));
      }
      if (video) {
        video.addEventListener('click', () => {
          if (video.paused) startPlayback(shell);
        });
        video.addEventListener('play', () => shell.classList.add('is-playing'));
        video.addEventListener('pause', () => {
          if (!video.seeking && video.currentTime === 0) shell.classList.remove('is-playing');
        });
      }
    });
  });
})();
