/**
 * The path to partnership, shared by the portal, the admin and (by title) the How it works page.
 * Confirmed with Preston (Nov 2026). Change here and on /how-it-works together.
 */
export const STAGES = [
  { key: 'intro', t: 'Intro call', d: "Thirty minutes with our New Partnerships team about what you've built and what you want next." },
  { key: 'nda', t: 'NDA and numbers', d: 'We both sign an NDA. Then you share three years of financials and how the practice runs. This is the longest step, and every file is reviewed by a person.' },
  { key: 'visit', t: 'Visit', d: "We come to you, and you spend time with the people you'd work with." },
  { key: 'loi', t: 'Letter of intent', d: 'Terms in writing, walked through line by line.' },
  { key: 'close', t: 'Diligence and close', d: 'Our advisors confirm the details, then we sign and your integration plan starts.' },
] as const
export type StageKey = (typeof STAGES)[number]['key']

/** The six reports for NDA and numbers (Preston, Nov 2026). Excel only; PDF allowed where pdf is true. */
export const REPORTS = [
  { key: 'pl', t: 'P&L by month', sub: 'Jan 2023 to today, one column per month. Usually a QuickBooks export.', pdf: false },
  { key: 'prov', t: 'Collections by provider', sub: 'Monthly, one row per provider. This is the one that most often needs a second pass.', pdf: false,
    tip: 'Most EMRs have a provider production or provider collections report. Run it by month for the full range and export to Excel. If your system only does one month at a time, send each month; we will combine them.' },
  { key: 'svc', t: 'Collections by service line', sub: 'Monthly, one row per service line (injectables, lasers, skincare, and so on).', pdf: false },
  { key: 'payroll', t: 'Payroll by month', sub: 'Monthly totals. A PDF from your payroll provider is fine.', pdf: true },
  { key: 'dist', t: 'Owner distributions', sub: 'Every distribution to owners, by month.', pdf: false },
  { key: 'bs', t: 'Balance sheet', sub: 'The most recent one. A PDF is fine.', pdf: true },
] as const
export type ReportKey = (typeof REPORTS)[number]['key']

export const EXCEL = ['.xlsx', '.xls', '.csv']
export const MAX_UPLOAD = 4 * 1024 * 1024 // stays under Vercel's 4.5 MB function body limit
