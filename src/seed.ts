import config from '@payload-config'
import { getPayload } from 'payload'
import { seedStandIn } from './seed/standin'

// Local: wipe and reload stand-in data.  pnpm seed
const p = await getPayload({ config: await config })
await seedStandIn(p, { wipe: true }).catch((e) => { console.error(e); process.exit(1) })
process.exit(0)
