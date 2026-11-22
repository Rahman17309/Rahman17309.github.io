// Rahman's assistant: an on-page FAQ chatbot. It runs entirely in the browser and answers
// from the facts on this site (no external AI service, so no keys or data leave the page).
(function () {
  const fab = document.querySelector(".chat-fab");
  const panel = document.getElementById("chat");
  if (!fab || !panel) return;
  const log = panel.querySelector(".chat__log");
  const chipsEl = panel.querySelector(".chat__chips");
  const form = panel.querySelector(".chat__form");
  const input = panel.querySelector("#chat-input");
  const GH = "https://github.com/Rahman17309";
  const link = (href, text) => `<a href="${href}" target="_blank" rel="noopener">${text}</a>`;

  const KB = [
    { k: ["hi", "hello", "hey", "salam", "assalam", "good morning", "good evening"], a: "Hi! 👋 I'm Rahman's assistant. Ask me about his skills, projects, experience or how to contact him." },
    { k: ["who", "about", "yourself", "introduce", "summary", "rahman"], a: "M A Rahman is a <b>Data Analyst with 3+ years</b> across data analysis, BI and reporting automation, including a Business Analyst role at <b>Amazon</b>. He works in SQL, Power BI, Python and Advanced Excel, and is based in Hyderabad, India." },
    { k: ["skill", "stack", "tools", "technolog", "know"], a: "Core stack:<br>• <b>SQL</b>: BigQuery, PostgreSQL, MySQL, CTEs, window functions<br>• <b>Power BI</b>: DAX, Power Query, data modelling<br>• <b>Python</b>: pandas, NumPy, Plotly, scikit-learn<br>• <b>Excel</b>: VBA, pivots, XLOOKUP, Power Pivot<br>• Analytics: A/B testing, forecasting, cohort &amp; churn, reconciliation" },
    { k: ["sql", "query", "bigquery", "postgres", "mysql"], a: "SQL is his daily tool: multi-table joins, CTEs, window functions and query optimisation in BigQuery and PostgreSQL. See the " + link(GH + "/product-funnel-conversion-analytics/tree/main/sql", "funnel project's SQL folder") + " for real examples." },
    { k: ["power bi", "powerbi", "dax", "dashboard", "tableau", "report"], a: "He builds Power BI dashboards with DAX, Power Query and star-schema models for Sales, Marketing, Finance and Customer Success teams, plus Google Sheets and Plotly dashboards. See his " + link(GH + "/Finance-CFO-Dashboard-PowerBI", "Finance / CFO Dashboard") + ": 48 DAX measures on a star schema." },
    { k: ["python", "pandas", "machine learning", "ml", "model"], a: "Python (pandas, NumPy, scikit-learn, statsmodels) for cleaning, analysis, A/B tests and models such as classification, regression and forecasting." },
    { k: ["excel", "vba", "macro", "sheets", "apps script"], a: "Advanced Excel (VBA macros, pivot tables, XLOOKUP, Power Pivot) and Google Sheets with Apps Script. At Amazon his VBA automation cut daily processing time by 15%." },
    { k: ["a/b", "ab test", "experiment", "hypothesis"], a: "His " + link(GH + "/product-funnel-conversion-analytics", "funnel project") + " analyses a one-page checkout A/B test end to end (SRM, balance, guardrails, Bonferroni, regression): conversion rose <b>3.55% → 4.16% (+17%, p ≈ 0.001)</b>." },
    { k: ["reconcil", "accounting", "finance", "tally", "audit"], a: "He built a daily reconciliation process matching internal systems, bank statements and payment gateways, and has hands-on accounting experience (Tally, QuickBooks, Zoho Books)." },
    { k: ["experience", "work history", "job", "career", "worked", "pda", "amazon", "intern", "ai variant"], a: "• <b>Data Analyst, PDA Infotech</b> (Nov 2024 – Jul 2026, Dubai): SQL models, Power BI, ETL automation (−60% manual reporting), reconciliation<br>• <b>Data Science Intern, AI Variant</b> (Jun 2023 – Aug 2024): EDA, ML and forecasting models<br>• <b>Business Analyst, Amazon</b> (May 2022 – May 2023): VBA automation, catalog ETL, Transparency SOP" },
    { k: ["project", "portfolio", "work sample", "github", "case stud"], a: "Projects:<br>• " + link(GH + "/Finance-CFO-Dashboard-PowerBI", "Finance / CFO Dashboard (Power BI)") + ": P&amp;L, budget variance, cash flow<br>• " + link(GH + "/product-funnel-conversion-analytics", "Product Funnel & Conversion") + ": +17% conversion A/B test<br>• " + link(GH + "/Bankruptcy-Prevention-Project", "Bankruptcy Risk Prediction") + "<br>• " + link(GH + "/NLP-Sentiment-Classification-Analysis", "Review Sentiment Analysis") + ": 96% accuracy<br>• " + link(GH + "/Solar-Power-Prediction", "Solar Power Prediction") + ": R² 0.90<br>• " + link(GH + "/Apple-Stock-Forecasting", "Apple Stock Forecasting") + "<br>A new project is added every week." },
    { k: ["finance", "cfo", "p&l", "budget", "cash flow", "receivable"], a: "The " + link(GH + "/Finance-CFO-Dashboard-PowerBI", "Finance / CFO Dashboard") + " is a 3-page Power BI report: revenue grew 10% but profit fell 3%, traced to South-region COGS and marketing overspend (≈₹6 Cr/yr to recover), plus receivables ageing and cash flow." },
    { k: ["funnel", "conversion", "checkout", "ecommerce", "e-commerce"], a: "The " + link(GH + "/product-funnel-conversion-analytics", "funnel project") + " cleans 285k clickstream events, segments the funnel in SQL, sizes each fix in ₹ (mobile checkout ≈ ₹26 L/yr) and tests a one-page checkout (+17% conversion)." },
    { k: ["bankrupt", "credit", "risk"], a: "The " + link(GH + "/Bankruptcy-Prevention-Project", "bankruptcy project") + " found 147 duplicate rows before modelling, compared 5 tuned models, and showed competitiveness, credibility and financial flexibility drive risk." },
    { k: ["sentiment", "nlp", "review", "text"], a: "The " + link(GH + "/NLP-Sentiment-Classification-Analysis", "sentiment project") + " scrapes product reviews and classifies them: TF-IDF + Logistic Regression reached 96% accuracy (macro-F1 0.92)." },
    { k: ["solar", "energy"], a: "The " + link(GH + "/Solar-Power-Prediction", "solar project") + " predicts power output from weather with Gradient Boosting: R² 0.90 on test, 0.85 cross-validated." },
    { k: ["stock", "apple", "forecast", "time series", "arima", "prophet", "lstm"], a: "The " + link(GH + "/Apple-Stock-Forecasting", "Apple forecasting project") + " compares ARIMA, SARIMA, Holt-Winters, Prophet and LSTM for a 30-day AAPL forecast." },
    { k: ["education", "degree", "study", "college", "university", "jntu"], a: "B.Tech in Mechanical Engineering (First Class) from JNTU Hyderabad, 2015–2019." },
    { k: ["certif", "course", "nasscom", "excelr", "ibm"], a: "Certifications: Master's Program in Data Science (NASSCOM FutureSkills), Certified Data Scientist (ExcelR), Machine Learning with Python and Python for Data Science (IBM)." },
    { k: ["language", "speak", "hindi", "telugu", "urdu", "english"], a: "He speaks English, Hindi, Telugu and Urdu." },
    { k: ["where", "location", "based", "city", "relocat", "remote", "hyderabad"], a: "Based in Hyderabad, India, and open to Data Analyst roles. For relocation or remote arrangements, best to ask him directly at " + link("mailto:rahmandatascience09@gmail.com", "rahmandatascience09@gmail.com") + "." },
    { k: ["hire", "available", "availability", "open to", "freelance", "opportunit", "role", "position", "join"], a: "Yes, he's <b>open to Data Analyst roles</b> and freelance analytics work. The fastest way is email: " + link("mailto:rahmandatascience09@gmail.com", "rahmandatascience09@gmail.com") + "." },
    { k: ["contact", "email", "mail", "reach", "phone", "call", "linkedin", "connect"], a: "📧 " + link("mailto:rahmandatascience09@gmail.com", "rahmandatascience09@gmail.com") + "<br>💼 " + link("https://www.linkedin.com/in/rahman17309/", "LinkedIn") + "<br>💻 " + link(GH, "GitHub") },
    { k: ["resume", "cv"], a: "Here's his resume: " + '<a href="assets/MA_Rahman_Data_Analyst_Resume.pdf" download>download PDF</a>' + "." },
    { k: ["salary", "ctc", "package", "notice period", "expected"], a: "That's best discussed with him directly. Email " + link("mailto:rahmandatascience09@gmail.com", "rahmandatascience09@gmail.com") + " and he'll get back to you." },
    { k: ["thank", "thanks", "great", "awesome", "cool", "nice"], a: "You're welcome! Anything else you'd like to know? 😊" },
    { k: ["bye", "goodbye", "see you"], a: "Thanks for visiting! Feel free to reach out any time. 👋" },
  ];
  const SUGGEST = ["What are his skills?", "Show me projects", "Work experience", "Is he available?", "How to contact?", "Resume"];

  function answer(q) {
    const s = q.toLowerCase();
    let best = null, score = 0;
    for (const item of KB) {
      const hits = item.k.reduce((n, kw) => n + (s.includes(kw) ? kw.length : 0), 0);
      if (hits > score) { score = hits; best = item; }
    }
    return best ? best.a : "I don't have that one yet. 🤔 Try asking about his <b>skills</b>, <b>projects</b>, <b>experience</b> or <b>availability</b>, or email him at " + link("mailto:rahmandatascience09@gmail.com", "rahmandatascience09@gmail.com") + ".";
  }

  function add(html, who) {
    const m = document.createElement("div");
    m.className = "msg msg--" + who;
    if (who === "user") m.textContent = html; else m.innerHTML = html;
    log.appendChild(m);
    log.scrollTop = log.scrollHeight;
    return m;
  }
  function botReply(q) {
    const typing = add('<span class="typing"><i></i><i></i><i></i></span>', "bot");
    setTimeout(() => { typing.innerHTML = answer(q); log.scrollTop = log.scrollHeight; }, 450 + Math.random() * 350);
  }
  function ask(q) { if (!q.trim()) return; add(q, "user"); botReply(q); }

  chipsEl.innerHTML = SUGGEST.map((s) => `<button type="button">${s}</button>`).join("");
  chipsEl.addEventListener("click", (e) => { if (e.target.tagName === "BUTTON") ask(e.target.textContent); });
  form.addEventListener("submit", (e) => { e.preventDefault(); const q = input.value; input.value = ""; ask(q); });

  let greeted = false;
  function open(state) {
    panel.hidden = !state;
    fab.setAttribute("aria-expanded", String(state));
    fab.classList.toggle("is-open", state);
    if (state) {
      fab.querySelector(".chat-fab__dot")?.remove();
      if (!greeted) { greeted = true; add("Hi! 👋 I'm Rahman's assistant. Ask me anything about his skills, projects, experience or availability.", "bot"); }
      setTimeout(() => input.focus(), 50);
    }
  }
  fab.addEventListener("click", () => open(panel.hidden));
  panel.querySelector(".chat__close").addEventListener("click", () => { open(false); fab.focus(); });
  document.addEventListener("keydown", (e) => { if (e.key === "Escape" && !panel.hidden) { open(false); fab.focus(); } });
  document.querySelectorAll("[data-open-chat]").forEach((b) => b.addEventListener("click", () => open(true)));
})();
