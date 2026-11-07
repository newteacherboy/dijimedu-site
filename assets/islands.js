const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
const islands = new Map();

document.querySelectorAll(".island").forEach((island) => {
  const scene = island.querySelector(".scene");
  const frames = [...scene.querySelectorAll(".frame")];
  const replay = scene.querySelector("[data-replay]");
  const end = scene.querySelector(".scene-end");
  const markers = scene.querySelector(".scene-controls span");
  let timer;
  let visited = false;
  let activeFrame = 0;
  let effectTimer;

  function show(index) {
    activeFrame = index;
    clearInterval(effectTimer);
    const badge = scene.querySelector(".scene-effect");
    if (badge) {
      badge.hidden = !scene.classList.contains("playing");
      const effects = ["3", "+10", "🏆"];
      badge.textContent = effects[index];
      if (index === 0 && !badge.hidden) {
        let count = 3;
        effectTimer = setInterval(() => {
          count -= 1;
          badge.textContent = String(count);
          if (count === 1) clearInterval(effectTimer);
        }, 760);
      }
    }
    frames.forEach((frame, position) => frame.classList.toggle("current", position === index));
    markers.textContent = frames.map((_, position) => position === index ? "●" : "○").join(" ");
  }

  function finish() {
    clearTimeout(timer);
    timer = undefined;
    scene.classList.remove("playing");
    clearInterval(effectTimer);
    const badge = scene.querySelector(".scene-effect");
    if (badge) badge.hidden = true;
    end.style.visibility = "";
    end.inert = false;
    replay.textContent = "↻ Yeniden oynat";
  }

  function advance() {
    if (activeFrame === frames.length - 1) {
      finish();
      return;
    }
    show(activeFrame + 1);
    timer = setTimeout(advance, 2400);
  }

  function play(explicit = false) {
    if (!explicit && visited) return;
    visited = true;
    clearTimeout(timer);
    scene.classList.add("playing");
    show(0);
    end.style.visibility = "hidden";
    end.inert = true;
    replay.textContent = "■ Gösterimi bitir";
    timer = setTimeout(advance, reducedMotion.matches ? 2900 : 2400);
  }

  replay.hidden = false;
  replay.addEventListener("click", () => {
    if (timer) {
      show(frames.length - 1);
      finish();
    } else {
      play(true);
    }
  });
  show(0);
  islands.set(island, play);
});

if ("IntersectionObserver" in window) {
  const observer = new IntersectionObserver((entries) => {
    for (const entry of entries) {
      if (!entry.isIntersecting) continue;
      if (!reducedMotion.matches) islands.get(entry.target)();
      observer.unobserve(entry.target);
    }
  }, { threshold: 0.35 });
  islands.forEach((_, island) => observer.observe(island));
}

document.querySelectorAll(".site-header a[href^='#']").forEach((link) => {
  link.addEventListener("click", () => {
    const island = document.getElementById(link.hash.slice(1));
    if (islands.has(island) && !reducedMotion.matches && !island.querySelector(".playing")) {
      islands.get(island)(true);
    }
  });
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
