/**
 * The partner portal's stages and checklist. Copy follows design/boards/Portal.dc.html (Pre-LOI SOP + Preston, Nov 2026).
 * The public How it works page groups these into five steps; change both together.
 */
export const STAGES = [
  { key: 'intro', t: 'Intro call', d: 'A first conversation about your practice and what you want next.' },
  { key: 'nda', t: 'NDA', d: 'Mutual NDA, signed electronically. The portal opens the moment it is signed.' },
  { key: 'financials', t: 'Financials', d: 'Six reports, January 2023 to last month. Most come straight out of QuickBooks or your EMR, and every one has steps if you have never pulled it. Tyler reviews each file. When all six are approved, Preston starts your pro forma.' },
  { key: 'proforma', t: 'Pro forma call', d: 'Preston walks you through the model line by line: your P&L, the adjustments, and what the practice looks like inside Alpha. Changes happen live, on the call.' },
  { key: 'valuation', t: 'Valuation', d: 'Alpha leadership reviews the model. Nothing for you to do here. We will call you the moment there is news.' },
  { key: 'offer', t: 'Offer', d: 'We walk you through the offer together on a call. If it works for you, the letter of intent comes here to sign. If it does not, we talk about the number.' },
  { key: 'diligence', t: 'Diligence', d: 'Quality of earnings, legal and insurance, with our advisors and yours. Every workstream is tracked here.' },
  { key: 'close', t: 'Close', d: 'Signing day. Your integration plan starts the week after.' },
] as const
export type StageKey = (typeof STAGES)[number]['key']

/** The six financials (Preston, Nov 2026). Excel only; PDF allowed where pdf is true. */
export const REPORTS = [
  { key: 'pl', g: 'Top priority', t: 'P&L by month', sub: 'Jan 2023 to last month. One file, a column per month, exported straight from QuickBooks.', pdf: false,
    tips: ['In QuickBooks Online, open Reports and search Profit and Loss.', 'Set the period to Jan 1, 2023 through the last day of last month.', 'Set Display columns by to Months, then Run report.', 'Export to Excel. Upload it as is, no edits.'] },
  { key: 'svc', g: 'Top priority', t: 'Collections by service line', sub: 'Annual totals, 2023 to year to date. From your EMR or POS.', pdf: false,
    tips: ['In your EMR or POS, open the sales or collections report.', 'Group by category or service line, one column per year.', 'Date range Jan 1, 2023 to today. Export to Excel.'] },
  { key: 'prov', g: 'Secondary', t: 'Collections by provider by month', sub: 'Every provider, one file, a column per month.', pdf: false,
    tips: ['Same report, grouped by provider instead of service.', 'Columns by month, Jan 2023 to last month.', 'Export to Excel. One file for all providers.'] },
  { key: 'payroll', g: 'Secondary', t: 'Payroll by employee by month', sub: 'W-2 and 1099, Jan 2023 to last month. A PDF is fine.', pdf: true,
    tips: ['In Gusto, ADP or Paychex, run the payroll journal or register.', 'Group by employee and by month. Include 1099 contractors and benefits.', 'Export to Excel. A PDF works if that is all your system gives you.'] },
  { key: 'dist', g: 'Secondary', t: 'Owner distributions by month', sub: 'Anything paid to owners outside payroll, Jan 2023 to last month.', pdf: false,
    tips: ['In QuickBooks, run Transaction Detail by Account.', "Filter to Owner's Draw or Distributions, grouped by month.", 'Jan 2023 to last month. Export to Excel.'] },
  { key: 'bs', g: 'Secondary', t: 'Balance sheet', sub: 'Most recent month end. A PDF is fine.', pdf: true,
    tips: ['In QuickBooks, open Reports and run Balance Sheet.', 'Set the date to the last day of last month.', 'Export to Excel or save as PDF.'] },
] as const
export type ReportKey = (typeof REPORTS)[number]['key']

/** Guide contact links shown on the portal. Empty values hide the button. */
export const GUIDES: Record<string, { role: string; email?: string; book?: string }> = {
  Tyler: { role: 'New Partnerships' },
  Preston: { role: 'Finance' },
}

export const EXCEL = ['.xlsx', '.xls', '.csv']
export const MAX_UPLOAD = 4 * 1024 * 1024 // stays under Vercel's 4.5 MB function body limit
