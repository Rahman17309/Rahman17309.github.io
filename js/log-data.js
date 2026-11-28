// Build log: newest first. Add one entry per working day.
// status: "building" marks the current project (shown in the banner with its progress).
window.BUILD_NOW = {
  project: "Transaction Reconciliation Engine (ledger ↔ gateway ↔ bank)",
  link: "https://github.com/Rahman17309/transaction-reconciliation-engine",
  day: 6, of: 7,
  next: "Day 7: final README, interview Q&A, fresh-clone check and the project-complete post",
};
window.BUILD_LOG = [
  {
    date: "2026-11-28", tag: "Reconciliation · Day 6", title: "What the exceptions are worth: ₹ impact and a ranked action list",
    items: ["₹6.71 L of cash to recover this close; 95.7% of it is one payout the gateway held for 11 days",
            "Closing without the engine would overstate revenue by ₹2.29 L (1.04% of sales), 2× a 0.5% materiality threshold, and it is material in 20 of 20 test months",
            "Wallet fee step priced at the current rate: ₹75k a year incl. GST, about 22× the October wallet overcharge; 8 recommendations with owners and evidence, plus the case-study page"],
    link: "https://rahman17309.github.io/work/reconciliation-engine.html",
  },
  {
    date: "2026-11-27", tag: "Reconciliation · Day 5", title: "Four-page reconciliation dashboard, tied out to the engine",
    items: ["Overview, Exceptions, Gateway fees and Settlements pages on six SQL marts; 7 tie-out checks must pass before the page is written",
            "Exceptions page: slicers by owner, type and age over all 619 items, largest-first queue, CSV export; 66 items hold 80% of break value",
            "New finding: 227 of 485 breaks (46.8%) were over 14 days old at close, the cost of reconciling monthly instead of daily"],
    link: "https://rahman17309.github.io/work/recon-dashboard.html",
  },
  {
    date: "2026-11-26", tag: "Reconciliation · Day 4", title: "Validated against ground truth: 100% precision, 99.90% recall",
    items: ["Scored every exception type against the injected labels: 0 false positives, 2,073 of 2,075 in-scope problems caught",
            "Scoring exposed two engine bugs, both fixed in SQL: 31 Oct refunds wrongly flagged (now a learned credit-note-pending window) and a 31 Oct/1 Nov cross-period match",
            "Rules frozen and rerun on 20 newly generated months: every bridge ties to ₹0.00, recall 99.63–99.90%"],
    link: "https://github.com/Rahman17309/transaction-reconciliation-engine",
  },
  {
    date: "2026-11-25", tag: "Reconciliation · Day 3", title: "SQL engine in DuckDB: rule cascade, exception register, cash bridge",
    items: ["9-rule SQL cascade auto-matches 98.05% of 23,976 keys; cut-off rows reclassified as timing, 356 ledger↔gateway breaks left",
            "Exception register of 619 owned items; one held payout is 63.7% of the ₹10.07 L break value",
            "Cash bridge from ERP net sales to bank credits explains the ₹15.41 L gap with ₹0.00 unexplained"],
    link: "https://github.com/Rahman17309/transaction-reconciliation-engine",
  },
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
