import { H as Hls } from "./video-vendor.js";

const players = [...document.querySelectorAll("[data-player]")];

players.forEach((player) => {
  const video = player.querySelector("video");
  const button = player.querySelector(".player-overlay");

  if (!video) {
    return;
  }

  const source = video.dataset.videoSrc;

  if (source) {
    if (Hls.isSupported()) {
      const hls = new Hls({
        enableWorker: true,
        lowLatencyMode: true
      });
      hls.loadSource(source);
      hls.attachMedia(video);
      window.addEventListener("pagehide", () => hls.destroy(), { once: true });
    } else if (video.canPlayType("application/vnd.apple.mpegurl")) {
      video.src = source;
    }
  }

  const play = () => {
    video.play().then(() => {
      player.classList.add("is-playing");
    }).catch(() => {
      player.classList.remove("is-playing");
    });
  };

  if (button) {
    button.addEventListener("click", play);
  }

  video.addEventListener("play", () => {
    player.classList.add("is-playing");
  });

  video.addEventListener("pause", () => {
    if (!video.ended) {
      player.classList.remove("is-playing");
    }
  });

  video.addEventListener("ended", () => {
    player.classList.remove("is-playing");
  });
});
