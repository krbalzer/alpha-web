/**
 * Encode web renditions from the drive masters, upload them to the CMS (Media → Blob) and attach them.
 *
 *   MEDIA_ROOT="/Volumes/Extreme Pro" pnpm ingest:video            # dry run, prints the plan
 *   MEDIA_ROOT="/Volumes/Extreme Pro" APPLY=1 pnpm ingest:video    # encode + upload + attach
 *   ONLY=002 ...   limit to one partner (PTR)      FORCE=1 ...   replace videos that are already set
 *
 * Needs ffmpeg with libx264 and libsvtav1 (brew install ffmpeg). Masters are never touched.
 *
 * Folder convention (<PARTNER>/_NAMING.txt):
 *   <PARTNER>/01_BRAND/hero-loop/NNN-<brand>_brand_hero-loop.mp4                    → brands.heroVideo + heroPoster
 *   <PARTNER>/02_LOCATIONS/<city-slug>/hero-loop/NNN-<brand>_<city-slug>_hero-loop.mp4 → locations.heroVideo + heroPoster
 *   <PARTNER>/01_BRAND/film/NNN-*.mp4                                                → brands.film.video (+ film.poster if empty)
 *
 * Hero loops (silent, autoplay), bitrate-capped so busy footage (surf, foliage) can't balloon:
 *   AV1 1080p ≤2 Mbps, H.264 1080p fallback ≤3 Mbps, H.264 720p for phones ≤1.5 Mbps,
 *   poster = the master's first frame as AVIF, so the swap from poster to video is invisible.
 * Films (click to play): H.264 1080p default, 720p for phones, 2160p when the master is 4K. Loudness to -14 LUFS.
 * Encodes are cached in .video-cache/, so a re-run only uploads.
 */
import { execFileSync } from 'node:child_process'
import fs from 'node:fs'
import path from 'node:path'
import sharp from 'sharp'
import type { Payload } from 'payload'
import { getPayload } from 'payload'
import config from '@payload-config'

const root = process.env.MEDIA_ROOT || '/Volumes/Extreme Pro'
const apply = process.env.APPLY === '1'
const force = process.env.FORCE === '1'
const only = process.env.ONLY ? Number(process.env.ONLY) : null
const FF = process.env.FFMPEG || 'ffmpeg'
const cacheDir = path.resolve('.video-cache')
const slugify = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
const mb = (f: string) => (fs.statSync(f).size / 1048576).toFixed(1) + 'MB'

type Job = { kind: 'brand' | 'location' | 'film'; ptr: number; city?: string; file: string }
type Doc = Record<string, unknown> & { id: number }

function findJobs(): Job[] {
  const jobs: Job[] = []
  const mp4s = (dir: string) => (fs.existsSync(dir) ? fs.readdirSync(dir).filter((f) => /^\d{3}-.+\.mp4$/i.test(f) && !f.startsWith('._')) : [])
  for (const partner of fs.readdirSync(root, { withFileTypes: true })) {
    if (!partner.isDirectory() || partner.name.startsWith('.')) continue
    const base = path.join(root, partner.name)
    const brandDir = path.join(base, '01_BRAND', 'hero-loop')
    for (const f of mp4s(brandDir).filter((f) => /_brand_hero-loop\.mp4$/i.test(f))) jobs.push({ kind: 'brand', ptr: Number(f.slice(0, 3)), file: path.join(brandDir, f) })
    const filmDir = path.join(base, '01_BRAND', 'film')
    const film = mp4s(filmDir).sort((a, b) => fs.statSync(path.join(filmDir, b)).size - fs.statSync(path.join(filmDir, a)).size)[0]
    if (film) jobs.push({ kind: 'film', ptr: Number(film.slice(0, 3)), file: path.join(filmDir, film) })
    const locRoot = path.join(base, '02_LOCATIONS')
    if (fs.existsSync(locRoot)) {
      for (const city of fs.readdirSync(locRoot)) {
        const dir = path.join(locRoot, city, 'hero-loop')
        for (const f of mp4s(dir).filter((f) => /_hero-loop\.mp4$/i.test(f))) jobs.push({ kind: 'location', ptr: Number(f.slice(0, 3)), city, file: path.join(dir, f) })
      }
    }
  }
  return jobs.filter((j) => only == null || j.ptr === only).sort((a, b) => a.ptr - b.ptr || a.kind.localeCompare(b.kind) || (a.city || '').localeCompare(b.city || ''))
}

const ff = (args: string[]) => execFileSync(FF, ['-nostdin', '-hide_banner', '-loglevel', 'error', '-y', ...args], { stdio: ['ignore', 'ignore', 'inherit'], env: { ...process.env, SVT_LOG: '1' } })
const height = (f: string) => Number(execFileSync(FF.replace(/ffmpeg$/, 'ffprobe'), ['-v', 'error', '-select_streams', 'v:0', '-show_entries', 'stream=height', '-of', 'csv=p=0', f]).toString().trim())

/** Encode one rendition into the cache unless it is already there (keyed by master name + mtime). */
function cached(master: string, tag: string, ext: string, make: (out: string) => void) {
  const key = `${path.basename(master, path.extname(master))}.${Math.round(fs.statSync(master).mtimeMs)}.${tag}.${ext}`
  const out = path.join(cacheDir, key)
  if (!fs.existsSync(out)) { const tmp = out + '.part.' + ext; make(tmp); fs.renameSync(tmp, out) }
  return out
}

const scale = (h: number) => `scale=-2:'min(${h},ih)':flags=lanczos`
const mp4 = ['-pix_fmt', 'yuv420p', '-movflags', '+faststart']

function loopRenditions(src: string) {
  return {
    av1: cached(src, 'av1-1080', 'mp4', (o) => ff(['-i', src, '-an', '-vf', scale(1080), '-c:v', 'libsvtav1', '-preset', '6', '-crf', '34', '-maxrate', '2M', '-bufsize', '4M', '-g', '48', ...mp4, o])),
    h264: cached(src, 'h264-1080', 'mp4', (o) => ff(['-i', src, '-an', '-vf', scale(1080), '-c:v', 'libx264', '-preset', 'slow', '-crf', '23', '-profile:v', 'high', '-maxrate', '3M', '-bufsize', '6M', '-g', '48', ...mp4, o])),
    small: cached(src, 'h264-720', 'mp4', (o) => ff(['-i', src, '-an', '-vf', scale(720), '-c:v', 'libx264', '-preset', 'slow', '-crf', '25', '-profile:v', 'high', '-maxrate', '1.5M', '-bufsize', '3M', '-g', '48', ...mp4, o])),
  }
}

function filmRenditions(src: string) {
  const audio = (k: string) => ['-c:a', 'aac', '-b:a', k, '-ac', '2', '-af', 'loudnorm=I=-14:TP=-1.5:LRA=11', '-ar', '48000']
  const r: { h264: string; small: string; uhd?: string } = {
    h264: cached(src, 'film-1080', 'mp4', (o) => ff(['-i', src, '-vf', scale(1080), '-c:v', 'libx264', '-preset', 'slow', '-crf', '20', '-profile:v', 'high', '-maxrate', '10M', '-bufsize', '20M', ...audio('160k'), ...mp4, o])),
    small: cached(src, 'film-720', 'mp4', (o) => ff(['-i', src, '-vf', scale(720), '-c:v', 'libx264', '-preset', 'slow', '-crf', '23', '-profile:v', 'high', '-maxrate', '4M', '-bufsize', '8M', ...audio('128k'), ...mp4, o])),
  }
  if (height(src) >= 2160) r.uhd = cached(src, 'film-2160', 'mp4', (o) => ff(['-i', src, '-vf', scale(2160), '-c:v', 'libx264', '-preset', 'slow', '-crf', '21', '-profile:v', 'high', '-maxrate', '25M', '-bufsize', '50M', ...audio('192k'), ...mp4, o]))
  return r
}

/** Poster from the master (never from a compressed rendition): lossless frame → AVIF, full chroma. */
async function makePoster(src: string, at = 0) {
  const key = `${path.basename(src, path.extname(src))}.${Math.round(fs.statSync(src).mtimeMs)}.poster-${at}.avif`
  const out = path.join(cacheDir, key)
  if (fs.existsSync(out)) return out
  const png = out + '.png'
  ff([...(at ? ['-ss', String(at)] : []), '-i', src, '-frames:v', '1', '-vf', `scale='min(2560,iw)':-2:flags=lanczos`, png])
  await sharp(png).avif({ quality: 70, chromaSubsampling: '4:4:4', effort: 6 }).toFile(out + '.part')
  fs.rmSync(png, { force: true })
  fs.renameSync(out + '.part', out)
  return out
}

async function upload(p: Payload, file: string, alt: string, data: Record<string, unknown> = {}) {
  const doc = await p.create({ collection: 'media', data: { alt, ...data } as never, filePath: file })
  return doc.id as number
}

function checkFfmpeg() {
  try {
    const enc = execFileSync(FF, ['-hide_banner', '-encoders']).toString()
    const missing = ['libx264', 'libsvtav1'].filter((e) => !enc.includes(e))
    if (missing.length) throw new Error(`ffmpeg is missing ${missing.join(', ')}`)
  } catch (e) {
    console.error(`video: ${(e as Error).message || 'ffmpeg not found'}. Install it with: brew install ffmpeg`)
    process.exit(1)
  }
}

async function run(p: Payload) {
  if (!fs.existsSync(root)) { p.logger.error(`video: ${root} not found. Plug in the drive or set MEDIA_ROOT.`); return }
  const jobs = findJobs()
  if (apply) { checkFfmpeg(); fs.mkdirSync(cacheDir, { recursive: true }) }
  const brands = (await p.find({ collection: 'brands', limit: 200, depth: 0 })).docs as unknown as Doc[]
  const locations = (await p.find({ collection: 'locations', limit: 1000, depth: 0 })).docs as unknown as Doc[]
  let done = 0, skipped = 0, missing = 0
  for (const j of jobs) {
    const brand = brands.find((b) => Number(b.ptr) === j.ptr)
    const target = j.kind === 'location' ? locations.find((l) => l.brand === brand?.id && slugify(String(l.city)) === j.city) : brand
    const label = `PTR ${String(j.ptr).padStart(3, '0')} ${j.kind === 'location' ? j.city : j.kind}`
    if (!target) { p.logger.warn(`video: ${label}: no matching ${j.kind === 'location' ? 'location' : 'brand'} in the CMS, skipped (${path.basename(j.file)})`); missing++; continue }
    const film = (target.film || {}) as { video?: unknown; poster?: unknown }
    const has = j.kind === 'film' ? film.video : target.heroVideo
    if (has && !force) { p.logger.info(`video: ${label}: already set, skipped`); skipped++; continue }
    if (!apply) { p.logger.info(`video: ${label}: would encode + upload ${path.basename(j.file)} (${mb(j.file)})`); done++; continue }

    const name = j.kind === 'location' ? `${brand?.name} ${target.city}` : String(brand?.name)
    p.logger.info(`video: ${label}: encoding ${path.basename(j.file)}…`)
    if (j.kind === 'film') {
      const r = filmRenditions(j.file)
      const small = await upload(p, r.small, `${name} film, 720p`)
      const uhd = r.uhd ? await upload(p, r.uhd, `${name} film, 2160p`) : undefined
      const video = await upload(p, r.h264, `${name} film`, { variants: { small, uhd } })
      const next: Record<string, unknown> = { ...film, video }
      if (!film.poster) next.poster = await upload(p, await makePoster(j.file, 3), `${name} film`)
      await p.update({ collection: 'brands', id: target.id, data: { film: next } as never })
      p.logger.info(`video: ${label}: film ${mb(r.small)} / ${mb(r.h264)}${r.uhd ? ' / ' + mb(r.uhd) : ''}`)
    } else {
      const r = loopRenditions(j.file)
      const av1 = await upload(p, r.av1, `${name} hero loop, AV1`)
      const small = await upload(p, r.small, `${name} hero loop, 720p`)
      const heroVideo = await upload(p, r.h264, `${name} hero loop`, { variants: { av1, small } })
      const data: Record<string, unknown> = { heroVideo }
      if (!target.heroPoster || force) data.heroPoster = await upload(p, await makePoster(j.file), `${name}`)
      await p.update({ collection: j.kind === 'brand' ? 'brands' : 'locations', id: target.id, data: data as never })
      p.logger.info(`video: ${label}: loop ${mb(r.av1)} AV1 / ${mb(r.h264)} H.264 / ${mb(r.small)} 720p`)
    }
    done++
  }
  p.logger.info(`video: ${apply ? 'done' : 'would do'} ${done}, already set ${skipped}, no CMS match ${missing}${apply ? '' : ' (dry run; APPLY=1 to encode + upload)'}`)
}

const payload = await getPayload({ config })
await run(payload)
process.exit(0)
