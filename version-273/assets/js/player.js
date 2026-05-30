(function () {
  function init(options) {
    var video = document.getElementById(options.videoId);
    var overlay = document.getElementById(options.overlayId);
    var button = document.getElementById(options.buttonId);
    var source = options.source;
    var hls = null;
    var attached = false;

    if (!video || !overlay || !source) return;

    function attach() {
      if (attached) return;
      attached = true;

      if (video.canPlayType("application/vnd.apple.mpegurl")) {
        video.src = source;
        return;
      }

      if (window.Hls && window.Hls.isSupported()) {
        hls = new window.Hls({
          enableWorker: true,
          lowLatencyMode: true,
          maxBufferLength: 30,
        });
        hls.loadSource(source);
        hls.attachMedia(video);
        return;
      }

      video.src = source;
    }

    function play() {
      attach();
      overlay.classList.add("is-hidden");
      video.setAttribute("controls", "controls");
      var promise = video.play();
      if (promise && typeof promise.catch === "function") {
        promise.catch(function () {
          overlay.classList.remove("is-hidden");
        });
      }
    }

    overlay.addEventListener("click", play);
    if (button) {
      button.addEventListener("click", function (event) {
        event.stopPropagation();
        play();
      });
    }

    video.addEventListener("click", function () {
      if (video.paused) {
        play();
      } else {
        video.pause();
      }
    });

    video.addEventListener("play", function () {
      overlay.classList.add("is-hidden");
    });

    window.addEventListener("pagehide", function () {
      if (hls && typeof hls.destroy === "function") {
        hls.destroy();
      }
    });
  }

  window.MoviePlayer = {
    init: init,
  };
})();
