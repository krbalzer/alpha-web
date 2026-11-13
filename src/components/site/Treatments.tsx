import type { TxGroup } from '@/lib/data'
import './treatments.css'

/** Treatments a brand or location offers, as an index by category. Data: the `treatments` collection (src/lib/data.ts treatmentsFor). */
export function Treatments({ groups, where }: { groups?: TxGroup[]; where: string }) {
  if (!groups?.length) return null
  const n = groups.reduce((a, g) => a + g.items.length, 0)
  return (
    <section className="tx" aria-label="Treatments">
      <div className="tx_in">
        <div className="tx_head">
          <h2 className="eyebrow tx_k">The Treatments</h2>
          <p className="tx_ct">{n} treatments / {where}</p>
        </div>
        <div className="tx_grid">
          {groups.map((g) => (
            <div className="tx_cat" key={g.cat}>
              <p className="tx_c"><span>{g.cat}</span><span>{String(g.items.length).padStart(2, '0')}</span></p>
              <ul>
                {g.items.map((t) => (
                  <li key={t.name}>{t.name}{t.where ? <small>{t.where} only</small> : null}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
