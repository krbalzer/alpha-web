import config from '@payload-config'
import { getPayload } from 'payload'
import { importEpisodes } from './episodes'

await importEpisodes(await getPayload({ config }))
process.exit(0)
