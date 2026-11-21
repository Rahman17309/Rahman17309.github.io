// Intro loader: a short "loading the data" sequence, then everything on it collapses
// and falls off the screen (the "doom" drop) to reveal the live site.
(function () {
  const loader = document.getElementById("loader");
  if (!loader) return;
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const hasGsap = typeof window.gsap !== "undefined";
  const pctEl = loader.querySelector(".loader__pct");
  const bar = loader.querySelector(".loader__progress span");
  const stepEl = loader.querySelector(".loader__step");
  const bars = [...loader.querySelectorAll(".loader__bars i")];
  const steps = ["Loading data…", "Cleaning rows…", "Running SQL…", "Building dashboards…", "Ready."];
  const targets = [0.35, 0.55, 0.45, 0.75, 0.6, 0.9, 1];
  document.documentElement.classList.add("is-loading");

  let finished = false;
  function done() {
    if (finished) return;
    finished = true;
    const reveal = () => {
      loader.remove();
      document.documentElement.classList.remove("is-loading");
      window.dispatchEvent(new CustomEvent("loader:done"));
    };
    if (!hasGsap || reduce) {
      loader.style.transition = "opacity 400ms ease";
      loader.style.opacity = "0";
      return setTimeout(reveal, 420);
    }
    // The doom drop: every piece loses its footing and falls with a random spin
    const pieces = [...loader.querySelectorAll(".fall"), ...bars];
    const tl = gsap.timeline({ onComplete: reveal });
    pieces.forEach((el) => {
      tl.to(el, {
        y: window.innerHeight * (0.9 + Math.random() * 0.6),
        x: (Math.random() - 0.5) * 220,
        rotation: (Math.random() - 0.5) * 120,
        duration: 0.9 + Math.random() * 0.5,
        ease: "power3.in",
      }, Math.random() * 0.35);
    });
    tl.to(loader, { "--hole": "150%", duration: 0.9, ease: "power2.inOut" }, 0.75)
      .to(loader, { opacity: 0, duration: 0.35 }, 1.45);
  }

  // Progress: at least ~2.2s so the intro is readable, and never before the page has loaded
  const start = performance.now(), MIN = reduce ? 600 : 2200;
  let pageLoaded = document.readyState === "complete";
  window.addEventListener("load", () => { pageLoaded = true; });
  (function tick() {
    const elapsed = performance.now() - start;
    let p = Math.min(1, elapsed / MIN);
    if (!pageLoaded) p = Math.min(p, 0.92);
    const pct = Math.round(p * 100);
    pctEl.textContent = pct + "%";
    bar.style.transform = `scaleX(${p})`;
    stepEl.textContent = steps[Math.min(steps.length - 1, Math.floor(p * (steps.length - 1) + 0.0001))];
    bars.forEach((b, i) => { b.style.transform = `scaleY(${Math.max(0.08, Math.min(1, p * 1.6 - i * 0.08)) * targets[i]})`; });
    if (p >= 1) return setTimeout(done, 250);
    requestAnimationFrame(tick);
  })();
  setTimeout(() => { pageLoaded = true; }, 6000); // never get stuck
  loader.querySelector(".loader__skip").addEventListener("click", done);
})();
