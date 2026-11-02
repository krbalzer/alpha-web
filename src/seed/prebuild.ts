/**
 * Runs once before `next build` (single process, so no race between build workers).
 *   SEED_ON_EMPTY=true   load stand-in content into an empty database
 *   SEED_ON_EMPTY=reset  wipe stand-in collections and reload (e.g. after swapping the Blob store)
 * Unset: does nothing. Remove the variable once real content is in.
 */
import config from '@payload-config'
import { getPayload } from 'payload'
import { seedStandIn } from './standin'

const mode = process.env.SEED_ON_EMPTY
if (mode === 'true' || mode === 'reset') {
  const p = await getPayload({ config: await config }) // applies pending migrations on Postgres
  const empty = !(await p.count({ collection: 'brands' })).totalDocs
  if (mode === 'reset' || empty) {
    await seedStandIn(p, { wipe: mode === 'reset' })
  } else p.logger.info('seed: brands exist, skipping (use SEED_ON_EMPTY=reset to reload)')
}
process.exit(0)
