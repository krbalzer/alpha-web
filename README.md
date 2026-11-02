# Alpha Aesthetics Partners / site

Next.js 16 + Payload CMS 3 in one app. The CMS runs at `/admin`, the site everywhere else.

## Run it

```bash
pnpm install
cp .env.example .env        # set PAYLOAD_SECRET to any long random string
pnpm seed                   # stand-in brands, locations, founders, one episode
pnpm dev                    # http://localhost:3000, CMS at /admin
```

Locally the database is a SQLite file (`alpha.db`). In production it is Postgres, chosen automatically when `DATABASE_URL` starts with `postgres`.

## Deploy (Vercel)

1. Import the repo in Vercel.
2. Storage tab: add **Neon Postgres** (sets `DATABASE_URL`) and **Blob** (sets `BLOB_READ_WRITE_TOKEN`).
3. Add `PAYLOAD_SECRET` and `NEXT_PUBLIC_SITE_URL`.
4. First deploy only: add `SEED_ON_EMPTY=true` to load stand-in content into the empty database. Remove it after.
5. Deploy. Every branch and PR gets its own preview URL. Visit `/admin` to create the first CMS login.

Schema changes: `pnpm payload migrate:create <name>` against a Postgres URL, commit the file in `src/migrations`, and the next deploy applies it.

## Where things live

| | |
|---|---|
| `src/collections/` | CMS schema. Brands, Locations, Founders, CTA Images, Departments, Team, Shows, Episodes, Speakers, Tags, Newswire, Resources, plus the Network global (the one source for brand / location / state counts). |
| `src/components/site/` | Global layer: Nav, Menu, Player, Closer, Footer. `SiteProvider` sits in the root layout, so the player and menu never unmount on navigation. |
| `src/app/(frontend)/` | Pages. `global.css` holds tokens, fonts and the shared components. Each template imports its own CSS, scoped under a page class. |
| `src/lib/data.ts` | All CMS reads. Pages get plain objects shaped for their template. |
| `src/lib/dc.ts` | Runs a design-board logic class inside React, so canvas prototypes port with their logic intact. |
| `public/fonts/` | NHD (Neue Haas Grotesk Display, spacing tuned) and Diatype Mono. **Needs web licenses before launch.** |

## Templates ported

- [x] Global: nav, menu, persistent player (desktop bar + mobile dock), closer with random CTA image, footer
- [x] Brand (`/brands/[slug]`), including the canvas map engine (swap for Mapbox GL in production)
- [ ] Home, Location, Founder, Locations map, Episode, Show, Speaker, Podcasts index, Department, Team member, Team, About, Talk, Newswire, Article, Resources, Landing, Legal, 404

## Content rules

- Quotes on Brand, Founder, Team and Episode records are **verbatim only**, each with a source field.
- CTA images are their own collection: text-free, readable under a white headline. `soften` exists only for stand-in frames.
