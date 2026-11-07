const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
const scenes = new Map();

document.querySelectorAll(".island").forEach((island) => {
  const scene = island.querySelector(".scene");
  const frames = [...scene.querySelectorAll(".frame")];
  const badge = scene.querySelector(".scene-effect");
  const end = scene.querySelector(".scene-end");
  let timer;
  let countdown;
  let index = 0;

  function stop() {
    clearTimeout(timer);
    clearInterval(countdown);
    frames.forEach((frame) => frame.classList.remove("current"));
    if (badge) badge.hidden = true;
    scene.classList.remove("playing");
    end.inert = false;
  }

  function advance() {
    if (index === frames.length) {
      stop();
      return;
    }
    frames.forEach((frame, position) => frame.classList.toggle("current", index === position));
    if (badge) {
      clearInterval(countdown);
      badge.hidden = false;
      badge.textContent = ["3", "+10", "🏆"][index];
      if (index === 0) {
        let count = 3;
        countdown = setInterval(() => {
          badge.textContent = String(--count);
          if (count === 1) clearInterval(countdown);
        }, 760);
      }
    }
    index += 1;
    timer = setTimeout(advance, 2400);
  }

  scenes.set(scene, {
    stop,
    play() {
      if (reducedMotion.matches || scene.classList.contains("playing") || end.contains(document.activeElement)) return;
      index = 0;
      scene.classList.add("playing");
      end.inert = true;
      advance();
    },
  });
});

if ("IntersectionObserver" in window) {
  const observer = new IntersectionObserver((entries) => {
    for (const entry of entries) {
      const scene = scenes.get(entry.target);
      if (entry.isIntersecting) scene.play();
      else scene.stop();
    }
  }, { threshold: 0.42 });
  scenes.forEach((_, scene) => observer.observe(scene));
}
reducedMotion.addEventListener("change", () => {
  if (reducedMotion.matches) scenes.forEach((scene) => scene.stop());
});
const dialog = document.querySelector("#app-store");
document.querySelectorAll("[data-ios]").forEach((link) => {
  link.addEventListener("click", (event) => {
    if (typeof dialog.showModal !== "function") return;
    event.preventDefault();
    dialog.showModal();
  });
});
dialog.addEventListener("click", (event) => {
  if (event.target === dialog) {
    const bounds = dialog.getBoundingClientRect();
    if (event.clientX < bounds.left || event.clientX > bounds.right ||
        event.clientY < bounds.top || event.clientY > bounds.bottom) dialog.close();
  }
});

const reviews = document.querySelector(".reviews");
const strip = reviews.querySelector(".review-strip");
const controls = reviews.querySelector(".review-controls");
const pause = controls.querySelector("[data-pause]");
let paused = reducedMotion.matches;
let interactingUntil = 0;
let reviewsVisible = !("IntersectionObserver" in window);

function updatePause() {
  pause.textContent = paused ? "▶" : "Ⅱ";
  pause.setAttribute("aria-label", paused ? "Otomatik kaydırmayı başlat" : "Otomatik kaydırmayı duraklat");
}

function scrollReviews(direction) {
  const end = strip.scrollWidth - strip.clientWidth;
  if (end < 2) return;
  const atEdge = direction > 0 ? strip.scrollLeft >= end - 2 : strip.scrollLeft <= 2;
  const offset = strip.children[1].offsetLeft - strip.children[0].offsetLeft;
  strip.scrollTo({
    left: atEdge ? (direction > 0 ? 0 : end) : strip.scrollLeft + offset * direction,
    behavior: reducedMotion.matches ? "instant" : "smooth",
  });
}

function deferAutoScroll() {
  interactingUntil = Date.now() + 9000;
}

controls.hidden = false;
updatePause();
pause.addEventListener("click", () => {
  paused = !paused;
  updatePause();
  if (!paused) scrollReviews(1);
});
controls.querySelector("[data-prev]").addEventListener("click", () => {
  deferAutoScroll();
  scrollReviews(-1);
});
controls.querySelector("[data-next]").addEventListener("click", () => {
  deferAutoScroll();
  scrollReviews(1);
});
strip.addEventListener("pointerdown", deferAutoScroll);
strip.addEventListener("wheel", deferAutoScroll, { passive: true });
strip.addEventListener("keydown", deferAutoScroll);
reducedMotion.addEventListener("change", () => {
  paused = reducedMotion.matches;
  updatePause();
});

if ("IntersectionObserver" in window) {
  const observer = new IntersectionObserver(([entry]) => {
    reviewsVisible = entry.isIntersecting;
  });
  observer.observe(reviews);
}

setInterval(() => {
  if (paused || !reviewsVisible || document.hidden || Date.now() < interactingUntil) return;
  if (reviews.matches(":hover") || reviews.contains(document.activeElement)) return;
  scrollReviews(1);
}, 4800);
