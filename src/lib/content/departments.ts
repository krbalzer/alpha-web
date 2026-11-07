/**
 * Department-page modules the CMS does not hold yet, keyed by department slug. Copy from the Department board (Marketing).
 * A department without an entry shows hero, timeline, team and other teams only.
 * Move into the Departments collection when other teams get their pages written.
 */
export type DeptExtra = {
  h1b?: string; h1c?: string
  stats?: { n: string; l: string }[]
  plate?: { stop: string; get: string }[]
  scope?: { a: string; d: string; you: boolean }[]
  ninety?: { d: string; t: string; x: string }[]
  faq?: { q: string; a: string }[]
  /** Brand grid: [ptr, name, r = relaunched | p = in production | k = brand kept, after image] */
  partners?: [string, string, 'r' | 'p' | 'k', string?][]
}

export const DEPT_EXTRA: Record<string, DeptExtra> = {
  marketing: {
    h1b: 'for aesthetic', h1c: 'practices',
    stats: [{ n: '8', l: 'Rebrands' }, { n: '11', l: 'Sites built' }, { n: '8', l: 'States' }],
    plate: [{ stop: 'Briefing and managing agencies', get: 'A team that only does aesthetics' }, { stop: 'Writing campaigns at 10pm', get: 'Campaigns planned a quarter ahead' }, { stop: 'Chasing a developer for a small change', get: 'Site changes the same week' }, { stop: 'Guessing what works in other markets', get: 'What’s working across every partner' }],
    scope: [
      { a: 'Brand', d: 'Identity, voice and guidelines. Refined or rebuilt, depending on where you are.', you: true },
      { a: 'Website', d: 'Design, build, CMS, SEO and every change after launch.', you: true },
      { a: 'Launches', d: 'New treatments, devices, providers and locations, start to finish.', you: true },
      { a: 'Campaigns', d: 'Seasonal and always-on, paid and organic, planned a quarter ahead.', you: true },
      { a: 'Content and social', d: 'Shoots, edits and posting, in your brand’s voice.', you: true },
      { a: 'Reviews', d: 'Requests, responses and reputation across platforms.', you: false },
      { a: 'Reporting', d: 'What ran, what it cost and what it booked, every month.', you: false },
    ],
    ninety: [
      { d: 'Days 1–14', t: 'Audit', x: 'Brand, site, reviews and every channel. What to keep, what to fix, what to stop.' },
      { d: 'Days 15–30', t: 'The plan', x: 'A 90-day plan and a quarter calendar, agreed with you before anything ships.' },
      { d: 'Days 31–60', t: 'First wins', x: 'Site fixes, the review engine and the first campaign go live.' },
      { d: 'Days 61–90', t: 'Running', x: 'Monthly calendar, monthly reporting, and launches on a schedule.' },
    ],
    // board FAQ minus the three answers still marked as placeholders
    faq: [
      { q: 'Do I keep my brand?', a: 'Yes. Some partners relaunch, some refine, some keep everything as it is. The grid above shows where each one landed.' },
      { q: 'How fast do website changes happen?', a: 'Site changes go out the same week.' },
    ],
    partners: [['001', 'Esthetics Center', 'r'], ['002', 'Holden Timeless Beauty', 'r'], ['003', 'Refined Aesthetics', 'p'], ['005', 'Laser Center of Marin', 'r'], ['006', 'Williams Center', 'p'], ['007', 'Anne Therese Aesthetics', 'k'], ['008', 'RN Esthetics', 'r'], ['009', 'Dontage', 'p'], ['010', 'CAMI Aesthetics', 'r'], ['011', 'InBloom', 'p', '/img/p-inbloom.webp'], ['012', 'Flawless', 'p', '/img/p-flawless.webp'], ['013', 'Mint + Needle', 'r', '/img/p-mint.webp'], ['014', 'Privé Med Spa', 'r', '/img/p-prive.webp'], ['015', 'LexRx', 'r', '/img/p-lexrx.webp'], ['016', 'Preva Aesthetics', 'k', '/img/p-preva.webp']],
  },
}
