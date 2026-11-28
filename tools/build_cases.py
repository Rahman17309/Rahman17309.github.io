# Builds the project case-study pages in /work from the data below.
# Run: python3 tools/build_cases.py   (adding a project = add one dict to CASES and re-run)
import html, pathlib

ROOT = pathlib.Path(__file__).resolve().parent.parent
GH = "https://github.com/Rahman17309/"
V = "9"

CASES = [
  dict(
    slug="reconciliation-engine", title="Transaction Reconciliation Engine", kicker="Finance · Reconciliation · SQL engine",
    date="Nov 2026", role="Solo project · end to end", cover="assets/projects/recon.jpg",
    summary="A three-way month-end reconciliation (ERP ledger ↔ payment gateway ↔ bank) in DuckDB SQL that explains every rupee of a ₹15.41 L gap, validates itself against ground truth and tells finance what each exception is worth.",
    kpis=[("₹0.00", "unexplained in a ₹15.41 L gap"), ("98.05%", "of 23,976 keys auto-matched"), ("100% / 99.90%", "precision / recall vs ground truth"), ("₹6.71 L", "cash to recover this close")],
    problem="A mid-size Indian D2C retailer takes nearly all its revenue through a payment gateway. Every month end, finance has to prove that each sale was paid, that the gateway paid what it owed after its contracted fees, refunds and chargebacks, and that the money reached the bank. It was done by hand in Excel over ~25,000 rows, took three to four days and still ended with an unexplained difference that got written off.",
    data="Four reproducible exports from a seeded generator with documented assumptions: an ERP ledger (24,261 rows, IST, three date formats, text amounts), a gateway transaction report (24,298 rows, UTC, amounts in paise, messy order refs), 32 daily payouts and the October bank statement. Twelve kinds of real reconciliation problems are injected and labelled, so the engine can be scored; the engine never reads the labels.",
    approach=[
      ("Logged cleaning pipeline", "18 rules, each logging the rows it touched; removed rows go to a quarantine table with a reason; 19 validation checks (unique keys, GST = 18% of fee, payout arithmetic, bank balance recomputes) must pass."),
      ("EDA", "A plain order-id join gets 97.7%. The rest splits into an IST/UTC cut-off artefact (112 rows), one-directional checkout discounts, fees above contract, unbooked refunds and a held payout."),
      ("SQL engine in DuckDB", "A 9-rule cascade with FULL OUTER JOIN and ordered CASE, a per-transaction fee audit with LAG() to find rate changes, many-to-one payout rebuilds, a 619-item exception register with owners, and a cash bridge from ERP sales to bank credits."),
      ("Validation against ground truth", "Precision and recall per exception type with Wilson intervals, error analysis that found and fixed two engine bugs, rule-sensitivity sweeps, and the frozen rules rerun on 20 newly generated months."),
      ("Dashboard", "Four Power BI-style pages on six SQL marts, published only after 7 tie-out checks against the engine pass."),
      ("₹ impact and recommendations", "Cash to recover, revenue misstatement tested against materiality, and annual cost at current rates with bootstrap intervals over 20 months; 8 ranked actions with owners."),
    ],
    findings=[
      "The ₹15.41 L gap between ERP net sales and bank credits is explained line by line to ₹0.00: fees, timing, a held payout, and real breaks.",
      "The gateway raised the wallet fee from 2.00% to 2.25% on 15 Oct with no contract change. The October claim is ₹3,953, but at the new rate it is about ₹81k a year.",
      "Closing without the engine would overstate October revenue by ₹2.29 L (1.04% of sales), twice a 0.5% materiality threshold, and it is material in all 20 test months.",
      "Nearly half the breaks (227 of 485) were over 14 days old at close. Running the same engine daily would cut value-weighted exposure by 91.7%.",
    ],
    table=("What the exceptions are worth (October)", ["Section", "Line", "₹"],
      [["Recover now", "Settlement held by the gateway (19 Oct)", "₹6,41,741.68"], ["Recover now", "Fee overcharge claim", "₹3,953.16"],
       ["Books wrong if closed now", "Net revenue overstatement", "₹2,28,750.50 (1.04%)"], ["Recurring", "Fee overcharge at current rates", "≈ ₹81,299 / year"],
       ["Recurring (at risk)", "Receipts with no captured payment", "₹1,61,250 / month"]]),
    images=[("assets/cases/recon/07_cash_bridge.webp", "Cash bridge: ERP net sales to bank credits, ₹0.00 unexplained"),
            ("assets/cases/recon/15_impact_overview.webp", "What the exceptions are worth: cash, misstatement, recurring cost"),
            ("assets/cases/recon/08_scorecard.webp", "Engine scored against ground truth, per exception type"),
            ("assets/cases/recon/12_dashboard_exceptions.webp", "Exceptions page: owner work queue with slicers and export")],
    insight="A clean bridge doesn't prove the classification is right, so the engine was scored against labelled ground truth: 0 false positives and 2,073 of 2,075 in-scope problems caught. Scoring found two real bugs (31 Oct refunds and a 31 Oct/1 Nov booking) that a ₹0.00 bridge had hidden. For the controller, the result is a short, owned work list: recover the held ₹6.42 L payout, post receipts from the payment-capture event, and get the wallet rate back to contract.",
    limits=["The data is synthetic, built to look like real exports with documented assumptions; the SQL runs unchanged on real files.", "Annual figures assume flat volume and no fixes, and the 20-month ranges only measure noise at fixed error rates.", "Receipts with no payment are revenue at risk; the dispatch log is needed to confirm the actual loss."],
    tools=["SQL (DuckDB)", "Python", "pandas", "SciPy", "Plotly", "matplotlib", "Jupyter"],
    links=[("View code on GitHub", GH + "transaction-reconciliation-engine"), ("Read the recommendations report", GH + "transaction-reconciliation-engine/blob/main/reports/recommendations.md"), ("Open the live dashboard", "recon-dashboard.html")],
    embed="recon-dashboard.html",
  ),
  dict(
    slug="product-funnel", title="Product Funnel & Conversion Optimization", kicker="E-commerce · Funnel analytics · A/B testing",
    date="Nov 2026", role="Solo project · end to end", cover="assets/projects/funnel.jpg",
    summary="Where is an e-commerce brand losing customers, why, and what should it fix first? I took 80,000 sessions of messy clickstream data from raw export to a costed, tested recommendation.",
    kpis=[("+17%", "conversion from one-page checkout"), ("p ≈ 0.001", "A/B test significance"), ("~₹26 L/yr", "biggest single fix"), ("285k", "events cleaned")],
    problem="ShopNest, a fictional Indian D2C brand, gets about 80,000 sessions a quarter but only 3.4% become orders. Two-thirds of traffic is mobile, and the product team had just launched a one-page checkout experiment. Leadership wanted to know which step loses the most customers, which segments under-perform, whether the new checkout works, and what each fix is worth in rupees.",
    data="A reproducible synthetic clickstream (sessions, events, orders) with the problems real exports have: bot traffic, duplicate events, mixed timestamp formats and test orders. A cleaning pipeline handles each one and validates that every session's funnel steps happen in order.",
    approach=[
      ("Data quality first", "Bot detection, de-duplication, timestamp parsing and funnel-order validation, so every later number is trustworthy."),
      ("Exploratory analysis", "Funnel by device, channel, city tier, page speed and visitor type, plus timing and payment behaviour."),
      ("SQL deep-dive", "Seven DuckDB queries (CTEs, UNPIVOT, window functions, QUALIFY, QUANTILE_CONT) rank each segment's weakest step and size every lever in ₹."),
      ("A/B test, done properly", "Sample-ratio and balance checks, primary metric with confidence interval, mechanism and guardrail metrics, Bonferroni correction, regression adjustment and power."),
      ("Dashboard", "An interactive Plotly dashboard with KPIs, a segment-filterable funnel, A/B lift and opportunity sizing."),
    ],
    findings=[
      "Mobile converts 41% worse than desktop (2.84% vs 4.80%), and the gap opens after the cart.",
      "Pages slower than 3 seconds roughly halve conversion, on mobile and desktop alike.",
      "1 in 5 card payments fails (80% success vs 90% for UPI).",
      "Paid social is the second-largest channel but the weakest: 2.0% conversion, ₹31 revenue per session vs ₹69 for paid search.",
    ],
    table=("What each fix is worth (closing half the gap to a realistic benchmark)", ["Priority", "Lever", "Est. extra revenue"],
      [["1", "Mobile checkout UX", "~₹26 L / year"], ["2", "Page speed under 3s", "~₹11 L / year"], ["3", "Paid social landing pages", "~₹3 L / year"], ["4", "Card payment success", "~₹2.6 L / year"]]),
    images=[("assets/cases/funnel/01_overall_funnel.webp", "Overall funnel with drop-off at each step"),
            ("assets/cases/funnel/08_segment_heatmap.webp", "Step conversion by segment: where each segment under-performs"),
            ("assets/cases/funnel/10_opportunity_sizing.webp", "Revenue opportunity for each lever"),
            ("assets/cases/funnel/11_ab_test_results.webp", "One-page checkout A/B test results")],
    insight="Conversion rose from about 2.4% to 4.0% over the quarter, but returning visitors rose from 23% to 79% of traffic at the same time. A before/after comparison would have wrongly credited the new checkout, so the decision rests on the randomised A/B test: 3.55% → 4.16% (+0.61 pp, 95% CI +0.25 to +0.98 pp). Recommendation: roll out to mobile now and to desktop with a small holdout, then fix page speed (~₹11 L/yr, to be confirmed by a test).",
    limits=["The data is synthetic, built to mirror real e-commerce patterns; the method transfers directly to a real export.", "Opportunities overlap (slow pages are mostly mobile), so the ₹ figures are not additive."],
    tools=["SQL (DuckDB)", "Python", "pandas", "statsmodels", "Plotly", "Jupyter"],
    links=[("View code on GitHub", GH + "product-funnel-conversion-analytics"), ("Read the recommendations report", GH + "product-funnel-conversion-analytics/blob/main/reports/recommendations.md"), ("Open the live dashboard", "funnel-dashboard.html")],
    embed="funnel-dashboard.html",
  ),
  dict(
    slug="bankruptcy-risk", title="Bankruptcy Risk Prediction", kicker="Credit risk · Classification · Streamlit",
    date="", role="End-to-end project", cover="assets/projects/bankruptcy.jpg",
    summary="An explainable early-warning model that ranks companies by bankruptcy risk from six qualitative ratings, built for credit teams who need to focus their due diligence.",
    kpis=[("0.996", "cross-validated score"), ("147", "duplicate rows caught"), ("5", "models compared and tuned"), ("−0.90", "competitiveness correlation")],
    problem="Lending to a company that later goes bankrupt is expensive; refusing a healthy one loses business. A credit team needs a quick, explainable way to rank applicants by risk.",
    data="250 companies with six ratings (industrial, management and operating risk, financial flexibility, credibility, competitiveness) on a low/medium/high scale, and a bankruptcy label.",
    approach=[
      ("Caught a data-quality trap", "Only 103 of the 250 rows were unique. Training on duplicates would leak identical rows into train and test and inflate the scores, so they were removed before splitting."),
      ("Handled imbalance correctly", "SMOTE applied to the training set only, after a stratified 80/20 split."),
      ("Compared five models", "Logistic Regression, Decision Tree, Random Forest, Gradient Boosting and SVM, with ROC and learning curves."),
      ("Tuned and deployed", "GridSearchCV / RandomizedSearchCV pipelines, then a Streamlit app where users set the ratings and get a probability."),
    ],
    findings=["Competitiveness (r = −0.90), credibility (−0.76) and financial flexibility (−0.75) almost completely separate the classes.", "The 'risk' ratings matter much less (r between +0.23 and +0.37).", "A simple Logistic Regression is as accurate as the complex models and fully explainable, so it's the recommended model."],
    table=("Model results", ["Model", "Test accuracy (21 companies)", "CV score (tuned)"],
      [["Logistic Regression", "1.00", "0.996"], ["Random Forest", "1.00", "1.000"], ["SVM", "1.00", "1.000"], ["Decision Tree", "0.95", "–"]]),
    images=[], insight="Near-perfect scores on 21 test companies would not hold on messy real-world credit data. The cross-validated scores and the feature analysis are the reliable part, and the explainable model is the one I'd put in front of a credit committee.",
    limits=["Small, very cleanly separable dataset.", "Next: validate on a larger, real credit dataset with financial ratios."],
    tools=["Python", "scikit-learn", "imbalanced-learn", "pandas", "Streamlit"],
    links=[("View code on GitHub", GH + "Bankruptcy-Prevention-Project"), ("Watch the demo", "https://youtu.be/jHw8JbTdTC4")], embed=None,
  ),
  dict(
    slug="review-sentiment", title="Customer Review Sentiment Analysis", kicker="NLP · Web scraping · Classification",
    date="", role="End-to-end project", cover="assets/projects/nlp.jpg",
    summary="An NLP pipeline that scrapes product reviews, cleans the text and classifies sentiment, so negative feedback surfaces automatically instead of being buried in thousands of reviews.",
    kpis=[("96%", "accuracy"), ("0.92", "macro F1"), ("1,468", "unique reviews"), ("7", "models compared")],
    problem="Product and marketing teams receive thousands of reviews and can't read them all. They need to know which products get negative feedback, quickly enough to act.",
    data="2,318 scraped e-commerce reviews across five categories, reduced to 1,468 unique reviews after removing duplicates and empty text.",
    approach=[
      ("Scraping", "requests + BeautifulSoup across shoes, skincare, gadgets and fitness categories."),
      ("Text cleaning", "Lower-casing, punctuation and stop-word removal, tokenisation and lemmatisation with NLTK."),
      ("Labelling", "No human labels existed, so sentiment was labelled with VADER and cross-checked with TextBlob."),
      ("Modelling", "TF-IDF features, SMOTE on training data only; Logistic Regression, Naive Bayes, trees, boosting, LSTM and GRU compared."),
      ("Deployment", "A Streamlit app that classifies any review a user types."),
    ],
    findings=["Negative reviews are only 17% of the data, so a model that always says 'positive' already scores 83%. I judged models on negative-class F1 instead.", "TF-IDF + Logistic Regression beat the deep-learning models; at ~1.5k reviews the LSTM/GRU never learned beyond the majority class."],
    table=("Results (test set: 213 reviews)", ["Model", "Accuracy", "Negative-class F1", "Macro F1"],
      [["Logistic Regression (TF-IDF)", "0.96", "0.87", "0.92"], ["Random Forest", "0.95", "0.86", "0.92"], ["Naive Bayes", "0.94", "0.84", "0.90"], ["Decision Tree", "0.90", "0.76", "0.85"]]),
    images=[], insight="At this data size, the simple, explainable model is the right choice, and the right metric is the one that measures what the business needs to catch: negative reviews.",
    limits=["Labels come from VADER, so the models partly learn to reproduce it; hand-labelling a few hundred reviews would give true ground truth.", "Next: aspect-based sentiment (delivery, quality, price) and a fine-tuned transformer."],
    tools=["Python", "NLTK", "VADER", "scikit-learn", "TensorFlow/Keras", "BeautifulSoup", "Streamlit"],
    links=[("View code on GitHub", GH + "NLP-Sentiment-Classification-Analysis"), ("Watch the demo", "https://youtu.be/ChRp_Pf63jE")], embed=None,
  ),
  dict(
    slug="solar-power", title="Solar Power Generation Prediction", kicker="Regression · Energy · Streamlit",
    date="", role="End-to-end project", cover="assets/projects/solar.jpg",
    summary="Predicting a solar installation's power output from weather conditions, so a grid operator can plan supply and storage ahead of time.",
    kpis=[("0.905", "R² on test set"), ("0.855", "5-fold CV R²"), ("8", "models compared"), ("243", "tuning configs searched")],
    problem="Solar output swings with sun angle, cloud cover and humidity. Under-forecasting means paying for unneeded backup power; over-forecasting means buying expensive power at short notice.",
    data="2,920 three-hour periods with nine weather features (distance to solar noon, temperature, wind, sky cover, visibility, humidity, pressure) and the power generated.",
    approach=[("Cleaning and EDA", "Missing values and outliers treated; distance to solar noon (r = −0.75) and humidity (r = −0.52) have the strongest relationships."),
              ("Model comparison", "Eight regressors on a 70/30 split."), ("Tuning", "GridSearchCV over 243 Gradient Boosting configurations with 5-fold CV."),
              ("Deployment", "A Streamlit app that takes weather inputs and returns predicted output.")],
    findings=["Tuned Gradient Boosting explains about 90% of the variance on unseen data (RMSE ≈ 3,054 J).", "Cross-validated R² of 0.855 is the more honest estimate; one fold scores 0.77, so performance varies with the weather pattern."],
    table=None, images=[], insight="I report the cross-validated score alongside the single test split, because one lucky split can overstate how a model will perform in production.",
    limits=["A time-based split would better reflect real forecasting than a random split.", "Next: use weather-forecast inputs for a true day-ahead forecast and compare against a persistence baseline."],
    tools=["Python", "scikit-learn", "pandas", "Seaborn", "Streamlit"],
    links=[("View code on GitHub", GH + "Solar-Power-Prediction"), ("Watch the demo", "https://youtu.be/sFNEGxjOMiI")], embed=None,
  ),
  dict(
    slug="apple-forecasting", title="Apple (AAPL) Stock Price Forecasting", kicker="Time series · Forecasting · Streamlit",
    date="", role="End-to-end project", cover="assets/projects/apple.jpg",
    summary="A 30-day forecast of Apple's closing price from eight years of daily data, comparing five time-series approaches and being honest about which comparison is fair.",
    kpis=[("5", "approaches compared"), ("2,011", "trading days"), ("≈ $6", "LSTM 1-day RMSE"), ("30-day", "forecast in the app")],
    problem="Investment and treasury teams want a view of where a stock is heading over the next month, and how much to trust that view.",
    data="2,011 trading days of AAPL prices, January 2012 to December 2019; the closing price is the target.",
    approach=[("EDA", "Trend, moving averages, returns, volatility and seasonality."), ("Statistical models", "ARIMA (ADF test, differencing, auto_arima), SARIMA and Holt-Winters (multiplicative trend and season)."),
              ("Prophet and LSTM", "Prophet with trend and seasonality; a 2-layer LSTM on 60-day windows."), ("Evaluation", "Time-ordered 80/20 split, never shuffled."), ("Deployment", "Streamlit app with interactive Plotly forecasts.")],
    findings=["The LSTM's RMSE of about $6 is for one-day-ahead prediction using real prices up to yesterday, a much easier task than forecasting a whole period at once.", "Holt-Winters improved with a multiplicative trend and season, consistent with a price whose swings grow as it rises."],
    table=None, images=[], insight="A fair model comparison needs the same forecast horizon for every model. That rolling 30-day comparison against a naive baseline is the next step, and it's the kind of check I apply before trusting any forecast.",
    limits=["Forecast returns rather than prices, with prediction intervals.", "Add external drivers such as market index and earnings dates."],
    tools=["Python", "statsmodels", "pmdarima", "Prophet", "TensorFlow/Keras", "Plotly", "Streamlit"],
    links=[("View code on GitHub", GH + "Apple-Stock-Forecasting"), ("Watch the demo", "https://www.youtube.com/watch?v=r2wZKC7ocJk")], embed=None,
  ),
]

e = html.escape
def link(text, href):
    ext = href.startswith("http")
    return f'<a class="btn {"btn--primary" if "GitHub" in text else "btn--glass"}" href="{e(href)}"{" target=\"_blank\" rel=\"noopener\"" if ext else ""}>{e(text)}{" ↗" if ext else ""}</a>'

def page(c, prev, nxt):
    kp = "".join(f'<li class="glass"><b>{e(a)}</b><span>{e(b)}</span></li>' for a, b in c["kpis"])
    ap = "".join(f'<li><h3>{e(t)}</h3><p>{e(d)}</p></li>' for t, d in c["approach"])
    fi = "".join(f"<li>{e(f)}</li>" for f in c["findings"])
    tb = ""
    if c["table"]:
        cap, head, rows = c["table"]
        tb = f'<div class="case-table glass"><table><caption>{e(cap)}</caption><thead><tr>{"".join(f"<th>{e(h)}</th>" for h in head)}</tr></thead><tbody>{"".join("<tr>" + "".join(f"<td>{e(x)}</td>" for x in r) + "</tr>" for r in rows)}</tbody></table></div>'
    im = "".join(f'<figure class="glass"><img src="../{e(s)}" alt="{e(a)}" loading="lazy"><figcaption>{e(a)}</figcaption></figure>' for s, a in c["images"])
    em = f'<section class="case-sec"><h2>Live dashboard</h2><div class="case-embed glass"><iframe src="{c["embed"]}" title="Interactive dashboard" loading="lazy"></iframe></div><p class="case-note">Interactive: filter by segment and hover any chart. <a href="{c["embed"]}" target="_blank" rel="noopener">Open full screen ↗</a></p></section>' if c["embed"] else ""
    li = "".join(f"<li>{e(x)}</li>" for x in c["limits"])
    tl = "".join(f"<li>{e(x)}</li>" for x in c["tools"])
    lk = "".join(link(t, h) for t, h in c["links"])
    return f'''<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>{e(c["title"])} · M A Rahman</title>
  <meta name="description" content="{e(c["summary"])}">
  <meta property="og:title" content="{e(c["title"])} · M A Rahman, Data Analyst">
  <meta property="og:description" content="{e(c["summary"])}">
  <meta property="og:image" content="https://rahman17309.github.io/{e(c["cover"])}">
  <meta name="theme-color" content="#1b1028">
  <link rel="icon" href="../assets/profile.jpg">
  <link rel="stylesheet" href="../css/style.css?v={V}">
  <link rel="stylesheet" href="../css/case.css?v={V}">
</head>
<body class="case">
  <header class="nav case-nav" id="nav">
    <a class="nav__logo" href="../index.html#top"><img src="../assets/profile.jpg" alt="" width="32" height="32"><span>M A Rahman</span></a>
    <a class="case-back" href="../index.html#work">← All projects</a>
    <a class="btn btn--small btn--primary nav__cta" href="../assets/MA_Rahman_Data_Analyst_Resume.pdf" target="_blank" rel="noopener">Resume</a>
  </header>
  <main class="container case-main">
    <section class="case-hero">
      <p class="eyebrow">{e(c["kicker"])}</p>
      <h1>{e(c["title"])}</h1>
      <p class="case-lead">{e(c["summary"])}</p>
      <p class="case-meta"><span>{e(c["role"])}</span>{f'<span>{e(c["date"])}</span>' if c["date"] else ""}</p>
      <div class="case-links">{lk}</div>
      <ul class="case-kpis">{kp}</ul>
      <img class="case-cover glass" src="../{e(c["cover"])}" alt="" width="1200" height="750">
    </section>
    <section class="case-sec"><h2>The problem</h2><p>{e(c["problem"])}</p></section>
    <section class="case-sec"><h2>The data</h2><p>{e(c["data"])}</p></section>
    <section class="case-sec"><h2>Approach</h2><ol class="case-steps">{ap}</ol></section>
    <section class="case-sec"><h2>What I found</h2><ul class="case-list">{fi}</ul>{tb}</section>
    {f'<section class="case-sec"><h2>Charts</h2><div class="case-figs">{im}</div></section>' if im else ""}
    {em}
    <section class="case-sec case-insight glass"><h2>The key insight</h2><p>{e(c["insight"])}</p></section>
    <section class="case-sec"><h2>Limitations &amp; next steps</h2><ul class="case-list">{li}</ul></section>
    <section class="case-sec"><h2>Tools</h2><ul class="tags">{tl}</ul></section>
    <nav class="case-pager" aria-label="More projects">
      <a class="glass" href="{prev["slug"]}.html"><span>← Previous</span>{e(prev["title"])}</a>
      <a class="glass" href="{nxt["slug"]}.html"><span>Next →</span>{e(nxt["title"])}</a>
    </nav>
  </main>
  <footer class="footer container"><p>© 2026 M A Rahman · <a href="mailto:rahmandatascience09@gmail.com">rahmandatascience09@gmail.com</a></p></footer>
  <script data-goatcounter="https://rahman17309.goatcounter.com/count" async src="https://gc.zgo.at/count.js"></script>
</body>
</html>
'''

n = len(CASES)
for i, c in enumerate(CASES):
    (ROOT / "work" / f'{c["slug"]}.html').write_text(page(c, CASES[i - 1], CASES[(i + 1) % n]), encoding="utf-8")
    print("built work/" + c["slug"] + ".html")
