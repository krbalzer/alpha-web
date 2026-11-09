import config from '@payload-config'
import { getPayload } from 'payload'
import { importSpeakers } from './speakers'

await importSpeakers(await getPayload({ config }))
process.exit(0)
