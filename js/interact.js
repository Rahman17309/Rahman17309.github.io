// Interactivity: role rotator, pointer spotlight, card tilt, magnetic buttons, custom cursor, quick-view modal.
(function () {
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const fine = window.matchMedia("(hover: hover) and (pointer: fine)").matches;

  /* ---------- Rotating role (typewriter) ---------- */
  const roles = ["Data Analyst", "BI & Power BI Developer", "SQL Problem Solver", "Automation Builder", "Ex-Amazon Analyst"];
  const word = document.querySelector(".rotator__word");
  if (word && !reduce) {
    let i = 0, ch = roles[0].length, deleting = false;
    (function tick() {
      const target = roles[i];
      if (!deleting && ch === target.length) { deleting = true; return setTimeout(tick, 1800); }
      if (deleting && ch === 0) { deleting = false; i = (i + 1) % roles.length; }
      ch += deleting ? -1 : 1;
      word.textContent = roles[i].slice(0, ch);
      setTimeout(tick, deleting ? 35 : 70);
    })();
  }

  /* ---------- Pointer spotlight on every glass surface ---------- */
  if (fine) {
    document.addEventListener("pointermove", (e) => {
      const el = e.target.closest && e.target.closest(".glass");
      if (!el) return;
      const r = el.getBoundingClientRect();
      el.style.setProperty("--mx", `${e.clientX - r.left}px`);
      el.style.setProperty("--my", `${e.clientY - r.top}px`);
    }, { passive: true });
  }

  /* ---------- 3D tilt on project cards and the portrait ---------- */
  function tilt(el, max) {
    let raf = 0;
    el.addEventListener("pointermove", (e) => {
      const r = el.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width - 0.5, y = (e.clientY - r.top) / r.height - 0.5;
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        el.style.transition = "transform 120ms ease-out";
        el.style.transform = `perspective(900px) rotateX(${(-y * max).toFixed(2)}deg) rotateY(${(x * max).toFixed(2)}deg) translateY(-6px)`;
      });
    });
    el.addEventListener("pointerleave", () => {
      cancelAnimationFrame(raf);
      el.style.transition = "transform 500ms cubic-bezier(0.23, 1, 0.32, 1)";
      el.style.transform = "";
    });
  }
  if (fine && !reduce) {
    document.querySelectorAll(".pcard").forEach((c) => tilt(c, 7));
    const portrait = document.querySelector(".intro__portrait");
    if (portrait) {
      window.addEventListener("pointermove", (e) => {
        if (window.scrollY > window.innerHeight) return;
        const x = e.clientX / window.innerWidth - 0.5, y = e.clientY / window.innerHeight - 0.5;
        portrait.style.transform = `perspective(700px) rotateY(${x * 16}deg) rotateX(${-y * 16}deg)`;
      }, { passive: true });
    }
  }

  /* ---------- Magnetic buttons ---------- */
  if (fine && !reduce) {
    document.querySelectorAll(".btn, .icon-btn, .chip").forEach((b) => {
      b.addEventListener("pointermove", (e) => {
        const r = b.getBoundingClientRect();
        const x = e.clientX - r.left - r.width / 2, y = e.clientY - r.top - r.height / 2;
        b.style.transform = `translate(${x * 0.18}px, ${y * 0.25}px)`;
      });
      b.addEventListener("pointerleave", () => { b.style.transform = ""; });
    });
  }

  /* ---------- Custom cursor ---------- */
  const cursor = document.querySelector(".cursor");
  if (cursor && fine && !reduce) {
    document.documentElement.classList.add("has-cursor");
    const dot = cursor.querySelector(".cursor__dot"), ring = cursor.querySelector(".cursor__ring");
    let mx = -100, my = -100, rx = -100, ry = -100;
    window.addEventListener("pointermove", (e) => { mx = e.clientX; my = e.clientY; }, { passive: true });
    (function loop() {
      rx += (mx - rx) * 0.18; ry += (my - ry) * 0.18;
      dot.style.transform = `translate(${mx}px, ${my}px)`;
      ring.style.transform = `translate(${rx}px, ${ry}px)`;
      requestAnimationFrame(loop);
    })();
    const hoverSel = "a, button, .pcard, .chip, [data-copy]";
    document.addEventListener("pointerover", (e) => cursor.classList.toggle("is-hover", !!e.target.closest(hoverSel)));
    window.addEventListener("pointerdown", () => cursor.classList.add("is-down"));
    window.addEventListener("pointerup", () => cursor.classList.remove("is-down"));
    document.addEventListener("pointerleave", () => { mx = my = -100; });
  }

  /* ---------- One-time hint about the clickable background ---------- */
  const chip = document.querySelector(".hint-chip");
  if (chip && document.documentElement) {
    let shown = false;
    const onS = () => {
      if (shown || window.scrollY < window.innerHeight * 0.9) return;
      shown = true;
      chip.textContent = fine ? "✦ Tip: click the background to send a ripple through the data" : "✦ Tip: tap the background to send a ripple through the data";
      chip.classList.add("is-visible");
      setTimeout(() => chip.classList.remove("is-visible"), 5000);
      window.removeEventListener("scroll", onS);
    };
    window.addEventListener("scroll", onS, { passive: true });
  }

  /* ---------- Quick-view modal ---------- */
  const modal = document.getElementById("project-modal");
  if (modal && typeof modal.showModal === "function") {
    const $ = (id) => document.getElementById(id);
    document.querySelectorAll(".pcard").forEach((card) => {
      const btn = card.querySelector(".pcard__media");
      if (!btn) return;
      btn.addEventListener("click", () => {
        const img = card.querySelector("img");
        $("modal-img").src = img.src;
        $("modal-img").alt = card.querySelector("h3").textContent + " preview";
        $("modal-kicker").textContent = card.querySelector(".pcard__kicker").textContent;
        $("modal-title").textContent = card.querySelector("h3").textContent;
        $("modal-desc").textContent = card.dataset.more || card.querySelector(".pcard__body > p:not(.pcard__kicker)").textContent;
        $("modal-kpis").innerHTML = card.querySelector(".kpis") ? card.querySelector(".kpis").innerHTML : "";
        $("modal-tags").innerHTML = card.querySelector(".tags") ? card.querySelector(".tags").innerHTML : "";
        $("modal-links").innerHTML = [...card.querySelectorAll(".pcard__links a")]
          .map((a, i) => `<a class="btn ${i === 0 ? "btn--primary" : "btn--glass"}" href="${a.href}" target="_blank" rel="noopener">${a.textContent}</a>`).join("");
        modal.showModal();
        modal.querySelector(".modal__close").focus();
      });
    });
    modal.querySelector(".modal__close").addEventListener("click", () => modal.close());
    modal.addEventListener("click", (e) => { if (e.target === modal) modal.close(); });
  }
})();
