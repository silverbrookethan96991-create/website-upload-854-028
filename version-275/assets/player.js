import { H as Hls } from "./video-vendor-dru42stk.js";

export function bindMoviePlayer(source, videoId, triggerId) {
  const video = document.getElementById(videoId);
  const trigger = document.getElementById(triggerId);
  if (!video || !trigger || !source) {
    return;
  }

  let ready = false;
  let hls = null;

  function load() {
    if (ready) {
      return;
    }
    if (Hls.isSupported()) {
      hls = new Hls({
        enableWorker: true,
        lowLatencyMode: true
      });
      hls.loadSource(source);
      hls.attachMedia(video);
    } else if (video.canPlayType("application/vnd.apple.mpegurl")) {
      video.src = source;
    }
    ready = true;
  }

  async function start() {
    load();
    trigger.classList.add("is-hidden");
    try {
      await video.play();
    } catch (error) {
      trigger.classList.remove("is-hidden");
    }
  }

  trigger.addEventListener("click", start);
  video.addEventListener("click", function () {
    if (video.paused) {
      start();
    }
  });
  video.addEventListener("play", function () {
    trigger.classList.add("is-hidden");
  });
  video.addEventListener("ended", function () {
    trigger.classList.remove("is-hidden");
  });
  window.addEventListener("pagehide", function () {
    if (hls) {
      hls.destroy();
      hls = null;
    }
  });

  load();
}
