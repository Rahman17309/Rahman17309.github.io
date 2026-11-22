// Build log: newest first. Add one entry per working day.
// status: "building" marks the current project (shown in the banner with its progress).
window.BUILD_NOW = {
  project: "Finance / CFO Dashboard (Power BI)",
  link: "https://github.com/Rahman17309/Finance-CFO-Dashboard-PowerBI",
  day: 1, of: 1,
  next: "Project complete. Next up: Sales & Profitability dashboard in Power BI",
};
window.BUILD_LOG = [
  {
    date: "2026-11-22", tag: "Power BI · Finance", title: "Finance / CFO Dashboard shipped",
    items: ["Star schema (4 facts, 6 dims), fiscal-year date table and 48 DAX measures",
            "Found why profit fell 3% while revenue grew 10%: South-region COGS (+5.7 pts) and H2 marketing overspend",
            "Receivables ageing and cash flow pages; saved as PBIP/TMDL for Git"],
    link: "https://github.com/Rahman17309/Finance-CFO-Dashboard-PowerBI",
  },
  {
    date: "2026-11-22", tag: "Funnel project · Day 3", title: "Recommendations report and final write-up",
    items: ["Prioritised 5 fixes by ₹ value, confidence and effort: checkout rollout first (~₹32 L/yr)",
            "Risk register and next experiments with power analysis (sample size and duration)",
            "Fresh-clone check: pipeline, 7 SQL queries and 4 notebooks run end to end"],
    link: "https://github.com/Rahman17309/product-funnel-conversion-analytics/blob/main/reports/recommendations.md",
  },
  {
    date: "2026-11-21", tag: "Funnel project · Day 2", title: "SQL deep-dive, A/B test and dashboard",
    items: ["7 DuckDB queries: segment funnels, weakest step per segment, timing, payment failures, ₹ opportunity sizing",
            "One-page checkout A/B test: +17% conversion (p ≈ 0.001) with SRM, balance, guardrail and regression checks",
            "Interactive Plotly dashboard"],
    link: "https://github.com/Rahman17309/product-funnel-conversion-analytics",
  },
  {
    date: "2026-11-21", tag: "Portfolio", title: "Launched this portfolio",
    items: ["Face-card hero, case-study pages, SQL showcase and an on-page chat assistant"],
    link: "https://github.com/Rahman17309/Rahman17309.github.io",
  },
  {
    date: "2026-11-20", tag: "Funnel project · Day 1", title: "Data quality pipeline and EDA",
    items: ["Reproducible clickstream generator with realistic messiness",
            "Cleaning: bot detection, duplicate events, mixed timestamps, funnel-order validation",
            "EDA by device, channel, page speed, timing and payment method"],
    link: "https://github.com/Rahman17309/product-funnel-conversion-analytics",
  },
];
