// Page interactions: nav, mobile menu, filters, progress bar, back-to-top, copy email and GSAP motion.
(function () {
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const hasGsap = typeof window.gsap !== "undefined" && typeof window.ScrollTrigger !== "undefined";
  document.getElementById("year").textContent = new Date().getFullYear();

  const nav = document.getElementById("nav");
  const toggle = document.querySelector(".nav__toggle");
  const menu = document.getElementById("mobile-menu");
  const progress = document.querySelector(".progress span");
  const toTop = document.querySelector(".to-top");

  /* ---------- Scroll: hide nav on the way down, progress bar, back-to-top ---------- */
  let lastY = window.scrollY;
  function onScroll() {
    const y = window.scrollY;
    const max = document.documentElement.scrollHeight - window.innerHeight;
    progress.style.transform = `scaleX(${max > 0 ? y / max : 0})`;
    const menuOpen = toggle.getAttribute("aria-expanded") === "true";
    nav.classList.toggle("is-hidden", !menuOpen && y > lastY && y > 500);
    toTop.classList.toggle("is-visible", y > window.innerHeight * 1.2);
    lastY = y;
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* ---------- Active nav link ---------- */
  const links = [...document.querySelectorAll(".nav__links a")];
  const io = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (e.isIntersecting) links.forEach((l) => l.classList.toggle("is-active", l.getAttribute("href") === "#" + e.target.id));
    });
  }, { rootMargin: "-45% 0px -50% 0px" });
  links.forEach((a) => { const s = document.querySelector(a.getAttribute("href")); if (s) io.observe(s); });

  /* ---------- Mobile menu ---------- */
  function setMenu(open) {
    toggle.setAttribute("aria-expanded", String(open));
    toggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
    menu.hidden = !open;
    document.body.style.overflow = open ? "hidden" : "";
  }
  toggle.addEventListener("click", () => setMenu(toggle.getAttribute("aria-expanded") !== "true"));
  menu.addEventListener("click", (e) => { if (e.target.tagName === "A") setMenu(false); });
  document.addEventListener("keydown", (e) => { if (e.key === "Escape") setMenu(false); });

  /* ---------- Toast + copy email ---------- */
  const toast = document.querySelector(".toast");
  let toastTimer;
  function showToast(msg) {
    toast.textContent = msg;
    toast.classList.add("is-visible");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove("is-visible"), 2200);
  }
  document.querySelectorAll("[data-copy]").forEach((btn) => {
    btn.addEventListener("click", async () => {
      try { await navigator.clipboard.writeText(btn.dataset.copy); showToast("Email copied"); }
      catch { showToast(btn.dataset.copy); }
    });
  });

  /* ---------- Project filters ---------- */
  const chips = [...document.querySelectorAll(".chip")];
  const cards = [...document.querySelectorAll(".pcard")];
  chips.forEach((chip) => chip.addEventListener("click", () => {
    const f = chip.dataset.filter;
    chips.forEach((c) => { const on = c === chip; c.classList.toggle("is-active", on); c.setAttribute("aria-pressed", String(on)); });
    const shown = [];
    cards.forEach((card) => {
      const match = f === "all" || card.dataset.cat.split(" ").includes(f);
      card.classList.toggle("is-hidden", !match);
      if (match) shown.push(card);
    });
    if (hasGsap && !reduceMotion) {
      gsap.fromTo(shown, { opacity: 0, y: 16, scale: 0.98 }, { opacity: 1, y: 0, scale: 1, duration: 0.45, ease: "expo.out", stagger: 0.04, overwrite: true });
      ScrollTrigger.refresh();
    }
  }));

  /* ---------- Motion (GSAP) ---------- */
  if (!hasGsap || reduceMotion) return;
  document.documentElement.classList.add("js-motion");
  gsap.registerPlugin(ScrollTrigger);
  const EASE = "expo.out";

  // Intro: portrait first, then the words
  gsap.timeline({ defaults: { ease: EASE } })
    .to(".intro__portrait", { opacity: 1, scale: 1, duration: 1.2 }, 0.1)
    .to(".reveal-intro", { opacity: 1, y: 0, duration: 1, stagger: 0.08 }, 0.4);

  // As you scroll away, the intro recedes and its black backdrop fades to reveal the terrain
  gsap.to(".intro__inner", {
    yPercent: -12, opacity: 0, ease: "none",
    scrollTrigger: { trigger: ".intro", start: "top top", end: "bottom top", scrub: true },
  });
  gsap.to(".intro", {
    backgroundColor: "rgba(0,0,0,0)", ease: "none",
    scrollTrigger: { trigger: ".intro", start: "top top", end: "bottom top", scrub: true },
  });

  // Reveals: groups stagger together, single elements reveal on their own
  const groups = [".stats", ".services__grid", ".cards", ".skills__grid", ".facts"];
  const inGroup = (el) => groups.some((g) => el.parentElement && el.parentElement.matches(g));
  gsap.utils.toArray(".reveal").filter((el) => !inGroup(el)).forEach((el) => {
    gsap.to(el, { opacity: 1, y: 0, duration: 0.9, ease: EASE, scrollTrigger: { trigger: el, start: "top 88%", once: true } });
  });
  groups.forEach((sel) => {
    const grid = document.querySelector(sel);
    if (!grid) return;
    const items = [...grid.children].filter((c) => c.classList.contains("reveal"));
    if (!items.length) return;
    ScrollTrigger.create({
      trigger: grid, start: "top 88%", once: true,
      onEnter: () => gsap.to(items, { opacity: 1, y: 0, duration: 0.9, ease: EASE, stagger: 0.07, overwrite: true }),
    });
  });

  // Count-up numbers
  document.querySelectorAll(".count").forEach((el) => {
    const to = +el.dataset.to, obj = { v: 0 };
    el.textContent = "0";
    ScrollTrigger.create({
      trigger: el, start: "top 92%", once: true,
      onEnter: () => gsap.to(obj, { v: to, duration: 1.4, ease: "power2.out", onUpdate: () => (el.textContent = Math.round(obj.v)) }),
    });
  });

  // Experience timeline fills as you read
  gsap.to(".timeline__fill", {
    scaleY: 1, ease: "none",
    scrollTrigger: { trigger: ".timeline", start: "top 70%", end: "bottom 65%", scrub: 0.6 },
  });

  window.addEventListener("load", () => ScrollTrigger.refresh());
})();
