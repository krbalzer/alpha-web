import Link from 'next/link'

const COLS: [string, [string, string][]][] = [
  ['Partnership', [['About Alpha', '/about'], ['How it works', '/how-it-works'], ["Let's talk", '/talk']]],
  ['Network', [['Locations', '/locations'], ['Brands', '/brands'], ['Founders', '/founders']]],
  ['Alpha team', [['Everyone', '/team'], ['New Partnerships', '/team/new-partnerships'], ['Finance', '/team/finance'], ['Operations', '/team/operations'], ['Integrations', '/team/integrations'], ['HR', '/team/hr'], ['IT', '/team/it'], ['Marketing', '/team/marketing']]],
  ['Learn', [['Podcasts', '/podcasts'], ['Newswire', '/newswire'], ['Resources', '/resources']]],
  ['Follow', [['Instagram', 'https://www.instagram.com/'], ['LinkedIn', 'https://www.linkedin.com/']]],
]

export function Footer({ address }: { address: string }) {
  return (
    <footer className="foot">
      <div className="wrap">
        <div className="foot_links">
          {COLS.map(([h, links]) => (
            <div key={h}><h3>{h}</h3>{links.map(([t, href]) => <Link key={t} href={href}>{t}</Link>)}</div>
          ))}
        </div>
        <div className="foot_meta"><span>{address}</span><span><Link href="/legal/privacy">Privacy</Link> · <Link href="/legal/terms">Terms</Link> · <Link href="/legal/accessibility">Accessibility</Link></span><span>© Alpha Aesthetics Partners</span></div>
      </div>
      <div className="mark"><img src="/brand/alpha-paper.svg" alt="Alpha" /></div>
      <div className="tags">{[0, 1, 2].flatMap((i) => [<span key={'a' + i}>Raise the standard</span>, <span key={'b' + i}>Stronger together</span>])}</div>
    </footer>
  )
}
