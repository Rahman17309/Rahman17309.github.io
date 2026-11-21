// SQL showcase tabs + highlighting, build log, contact form.
(function () {
  /* ---------- SQL showcase ---------- */
  const KW = /\b(WITH|AS|SELECT|FROM|WHERE|GROUP|BY|ORDER|HAVING|JOIN|USING|ON|INTO|NAME|VALUE|UNPIVOT|COLUMNS|OVER|PARTITION|QUALIFY|UNION|ALL|AND|NOT|IN|IS|NULL|DESC|ASC|FILTER|CAST|INT|CASE|WHEN|THEN|ELSE|END|DISTINCT)\b/g;
  const FN = /\b(SUM|AVG|COUNT|MIN|MAX|ROUND|LAG|FIRST_VALUE|RANK|NULLIF|QUANTILE_CONT|date_diff|substr)\b(?=\s*\()/g;
  function highlight(code) {
    const src = code.textContent;
    const out = src.split("\n").map((line) => {
      const ci = line.indexOf("--");
      let body = ci >= 0 ? line.slice(0, ci) : line, comment = ci >= 0 ? line.slice(ci) : "";
      const esc = (s) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
      body = esc(body)
        .replace(/'[^']*'/g, (m) => `<span class="t-str">${m}</span>`)
        .replace(FN, '<span class="t-fn">$1</span>')
        .replace(KW, '<span class="t-kw">$1</span>')
        .replace(/\b(\d+(?:\.\d+)?(?:e\d+)?)\b/g, '<span class="t-num">$1</span>');
      return body + (comment ? `<span class="t-com">${esc(comment)}</span>` : "");
    });
    code.innerHTML = out.join("\n");
  }
  document.querySelectorAll("code.sql").forEach(highlight);
  const tabs = [...document.querySelectorAll(".sql-tabs [role=tab]")];
  tabs.forEach((tab, i) => tab.addEventListener("click", () => {
    tabs.forEach((t, j) => {
      const on = i === j;
      t.classList.toggle("is-active", on); t.setAttribute("aria-selected", String(on));
      document.getElementById("sq" + j).hidden = !on;
    });
  }));
  document.querySelectorAll(".sql-copy").forEach((b) => b.addEventListener("click", async () => {
    const code = b.closest(".sql-code").querySelector("code").textContent;
    try { await navigator.clipboard.writeText(code); b.textContent = "Copied ✓"; } catch { b.textContent = "Select & copy"; }
    setTimeout(() => (b.textContent = "Copy"), 1600);
  }));

  /* ---------- Build log ---------- */
  const now = document.getElementById("log-now"), list = document.getElementById("log-list");
  const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
  const fmt = (d) => new Date(d + "T00:00:00").toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
  if (now && window.BUILD_NOW) {
    const b = window.BUILD_NOW, pct = Math.round((b.day / b.of) * 100);
    now.innerHTML = `<p class="log-now__label"><span class="live-dot"></span>Currently building</p>
      <h3><a href="${esc(b.link)}">${esc(b.project)}</a></h3>
      <div class="log-bar" role="progressbar" aria-valuemin="0" aria-valuemax="${b.of}" aria-valuenow="${b.day}" aria-label="Project progress"><span style="width:${pct}%"></span></div>
      <p class="log-now__meta">Day ${b.day} of ${b.of} · Next: ${esc(b.next)}</p>`;
  }
  if (list && window.BUILD_LOG) {
    list.innerHTML = window.BUILD_LOG.slice(0, 8).map((e) => `<li class="log-item glass">
      <time datetime="${esc(e.date)}">${fmt(e.date)}</time>
      <p class="log-tag">${esc(e.tag)}</p>
      <h3>${esc(e.title)}</h3>
      <ul>${e.items.map((i) => `<li>${esc(i)}</li>`).join("")}</ul>
      ${e.link ? `<a href="${esc(e.link)}" target="_blank" rel="noopener">See the commits ↗</a>` : ""}
    </li>`).join("");
  }

  /* ---------- Contact form (FormSubmit, no backend) ---------- */
  const form = document.getElementById("cform");
  if (form) {
    const status = form.querySelector(".cform__status"), btn = form.querySelector("button[type=submit]");
    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      if (form._honey.value) return;
      btn.disabled = true; btn.textContent = "Sending…"; status.textContent = "";
      try {
        const res = await fetch("https://formsubmit.co/ajax/rahmandatascience09@gmail.com", {
          method: "POST", headers: { "Content-Type": "application/json", Accept: "application/json" },
          body: JSON.stringify(Object.fromEntries(new FormData(form))),
        });
        const data = await res.json().catch(() => ({}));
        if (!res.ok || String(data.success) === "false") throw new Error(data.message || "failed");
        form.reset(); status.textContent = "Thanks! Your message is on its way. I'll reply by email.";
        status.className = "cform__status is-ok";
        window.goatcounter?.count?.({ path: "contact-form-sent", event: true });
      } catch {
        status.innerHTML = 'Couldn\'t send right now. Please email <a href="mailto:rahmandatascience09@gmail.com">rahmandatascience09@gmail.com</a>.';
        status.className = "cform__status is-err";
      } finally { btn.disabled = false; btn.textContent = "Send message"; }
    });
  }
})();
