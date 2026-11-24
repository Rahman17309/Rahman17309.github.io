// Build log: newest first. Add one entry per working day.
// status: "building" marks the current project (shown in the banner with its progress).
window.BUILD_NOW = {
  project: "Transaction Reconciliation Engine (ledger ↔ gateway ↔ bank)",
  link: "https://github.com/Rahman17309/transaction-reconciliation-engine",
  day: 2, of: 7,
  next: "Day 3: SQL matching rules in DuckDB (exact, normalised, ±₹1 tolerance, cut-off window, payout ↔ transactions) and the exception register",
};
window.BUILD_LOG = [
  {
    date: "2026-11-24", tag: "Reconciliation · Day 2", title: "EDA: where the ledger, gateway and bank disagree",
    items: ["First-pass order-id match: 97.7% exact; 468 keys (₹4.30 L) need a decision",
            "112 of 277 \"missing\" rows were a cut-off artefact: gateway report pulled in UTC, books in IST",
            "Gateway charging above contract: wallet MDR 2.00% → 2.25% from 15 Oct; 87 card payments at 2.4% vs 1.9%"],
    link: "https://github.com/Rahman17309/transaction-reconciliation-engine",
  },
  {
    date: "2026-11-23", tag: "Reconciliation · Day 1", title: "Three-way reconciliation: data and data quality",
    items: ["Seeded October close: ERP ledger, gateway report, payout file and bank statement, with 12 labelled problem types for scoring",
            "Cleaning pipeline with 18 logged rules (duplicates, test rows, paise, UTC vs IST, messy refs), a quarantine table and 19/19 validation checks",
            "Control totals don't tie: ERP net sales ₹2.20 cr vs gateway credits in the bank ₹2.04 cr"],
    link: "https://github.com/Rahman17309/transaction-reconciliation-engine",
  },
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
