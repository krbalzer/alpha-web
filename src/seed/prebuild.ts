/**
 * Runs once before `next build` (single process, so no race between build workers).
 *   SEED_ON_EMPTY=true   load stand-in content into an empty database
 *   SEED_ON_EMPTY=reset  wipe stand-in collections and reload (e.g. after swapping the Blob store)
 *   SEED_ON_EMPTY=webflow  wipe content and import the current Webflow CMS (src/seed/webflow/export.json), then the interview copy
 *   SEED_ON_EMPTY=content  apply the interview copy (src/seed/content/partners.json) without wiping
 * Always: scrubs records removed from the network (src/seed/removed.ts).
 * Unset: nothing else. Remove the variable once real content is in.
 */
import config from '@payload-config'
import { getPayload } from 'payload'
import { seedStandIn } from './standin'

const mode = process.env.SEED_ON_EMPTY
const { checkBlob } = await import('./blob-check')
const blobOk = await checkBlob((m) => console.log(m))
{
  // always: pull new podcast episodes from each show's feed (never fails the build)
  if (process.env.IMPORT_EPISODES !== '0') {
    try {
      const p = await getPayload({ config: await config })
      const { importEpisodes } = await import('./episodes')
      await importEpisodes(p)
      // topics, audience and YouTube links from the old Webflow site; fills empty fields only
      const { importTopics } = await import('./topics')
      await importTopics(p)
      // chapters drafted from the Drive transcripts (MSM, OMS, GF); fills empty chapters only
      const { importChapters } = await import('./chapters')
      await importChapters(p)
      // Google place IDs for live ratings and reviews; fills empty IDs only
      const { importPlaces } = await import('./places')
      await importPlaces(p)
      // podcast people from the old Webflow site; a no-op once they are in
      const { importSpeakers } = await import('./speakers')
      if (blobOk) await importSpeakers(p)
      else console.warn('speakers: skipped, Blob token cannot write (see blob: lines above)')
    } catch (e) { console.warn('episodes: import skipped', e) }
  }
}
{
  // always: make sure removed people and partners are gone from the live database
  const p = await getPayload({ config: await config })
  const { scrubRemoved } = await import('./removed')
  await scrubRemoved(p)
  // hand-placed photography shipped with the repo (applied once; CMS edits win after that)
  const { placeMedia } = await import('./place-media')
  if (blobOk) await placeMedia(p)
  else console.warn('media: placements skipped, Blob token cannot write')
}
if (mode === 'webflow') {
  const p = await getPayload({ config: await config })
  const { importWebflow } = await import('./webflow')
  await importWebflow(p)
  const { applyContent } = await import('./interviews')
  await applyContent(p)
} else if (mode === 'content') {
  // interview copy only, on top of what is already in the database
  const p = await getPayload({ config: await config })
  const { applyContent } = await import('./interviews')
  await applyContent(p)
} else if (mode === 'true' || mode === 'reset') {
  const p = await getPayload({ config: await config }) // applies pending migrations on Postgres
  const empty = !(await p.count({ collection: 'brands' })).totalDocs
  if (mode === 'reset' || empty) {
    await seedStandIn(p, { wipe: mode === 'reset' })
  } else p.logger.info('seed: brands exist, skipping (use SEED_ON_EMPTY=reset to reload)')
}
process.exit(0)
