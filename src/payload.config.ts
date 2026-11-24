import { postgresAdapter } from '@payloadcms/db-postgres'
import { sqliteAdapter } from '@payloadcms/db-sqlite'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import { vercelBlobStorage } from '@payloadcms/storage-vercel-blob'
import path from 'path'
import { buildConfig, type CollectionConfig } from 'payload'
import sharp from 'sharp'
import { fileURLToPath } from 'url'

import { Articles, Leads, Legal, Network, Resources } from './collections/content'
import { Media } from './collections/Media'
import { Brands, CtaImages, Founders, Locations, TuckIns } from './collections/network'
import { Episodes, Shows, Speakers, Tags } from './collections/podcast'
import { Departments, Team } from './collections/team'
import { Users } from './collections/Users'
import { Jobs } from './collections/jobs'
import { visibleTo, type Role } from './access'
import { Treatments } from './collections/treatments'
import { TrainingEvents, University } from './collections/training'
import { migrations } from './migrations'

/** Who sees which collection in the admin nav. Admin sees everything; unlisted collections are admin-only. */
const NAV: Record<string, Role[]> = {
  leads: ['partnerships'],
  media: ['contributor', 'university'],
  'training-events': ['university', 'contributor'],
}
const nav = (c: CollectionConfig): CollectionConfig => ({ ...c, admin: { ...c.admin, hidden: c.admin?.hidden ?? visibleTo(...(NAV[c.slug] || [])) } })

const dirname = path.dirname(fileURLToPath(import.meta.url))
// Neon on Vercel sets POSTGRES_URL / DATABASE_URL; locally fall back to a SQLite file
const DB = process.env.DATABASE_URL || process.env.POSTGRES_URL || 'file:./alpha.db'

// On Vercel, uploads must go to Blob. Without the token they'd land on the build machine's disk and vanish.
if (process.env.VERCEL && !process.env.BLOB_READ_WRITE_TOKEN) {
  throw new Error('BLOB_READ_WRITE_TOKEN is missing. Copy it from Storage › alpha-media › .env.local into Settings › Environment Variables.')
}

export default buildConfig({
  admin: {
    user: Users.slug,
    importMap: { baseDir: path.resolve(dirname) },
    meta: { titleSuffix: ' / Alpha CMS' },
  },
  collections: [
    // network
    Brands, Locations, TuckIns, Founders, CtaImages, Treatments,
    // alpha team
    Departments, Team,
    // podcasts
    Shows, Episodes, Speakers, Tags,
    // content
    Articles, Resources, Legal,
    // people
    Jobs,
    // alpha university
    TrainingEvents,
    // inbox
    Leads,
    // system
    Media, Users,
  ].map(nav),
  globals: [{ ...Network, admin: { ...Network.admin, hidden: visibleTo() } }, { ...University, admin: { ...University.admin, hidden: visibleTo('university') } }],
  editor: lexicalEditor(),
  secret: process.env.PAYLOAD_SECRET || '',
  typescript: { outputFile: path.resolve(dirname, 'payload-types.ts') },
  // Postgres (Neon via Vercel) in production, SQLite file locally.
  db: DB.startsWith('postgres')
    ? postgresAdapter({ pool: { connectionString: DB }, push: false, migrationDir: path.resolve(dirname, 'migrations'), prodMigrations: migrations })
    : sqliteAdapter({ client: { url: DB } }),
  plugins: [
    vercelBlobStorage({
      enabled: Boolean(process.env.BLOB_READ_WRITE_TOKEN),
      collections: { media: { disablePayloadAccessControl: true } }, // files served straight from the Blob CDN, not proxied through a function
      alwaysInsertFields: true, // same schema with or without the token, so migrations never drift
      clientUploads: true, // browser uploads straight to Blob; full-res photos would hit Vercel's 4.5 MB function body limit
      token: process.env.BLOB_READ_WRITE_TOKEN || '',
    }),
  ],
  sharp,
})
