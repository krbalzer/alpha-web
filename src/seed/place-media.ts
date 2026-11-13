/**
 * Photography placed by hand-off (Kevin picks, Claude crops), shipped with the repo and applied once.
 * Each placement uploads its file only if a Media item with that filename does not exist yet, so a later
 * hand edit in the CMS is never overwritten by a redeploy. Runs in prebuild.
 */
import fs from 'node:fs'
import path from 'node:path'
import type { Payload } from 'payload'

const dir = path.resolve(process.cwd(), 'src/seed/media')
type Doc = Record<string, unknown> & { id: number }

const PLACEMENTS: { file: string; alt: string; apply: (p: Payload, id: number) => Promise<unknown> }[] = [
  { file: 'preva/practice-team.jpg', alt: 'The Preva team between appointments', apply: (p, id) => brand(p, 'preva', (b) => ({ practice: { ...(b.practice as object), image: id } })) },
  { file: 'preva/why-reception.jpg', alt: 'Preva reception through the gold doorway', apply: (p, id) => brand(p, 'preva', (b) => ({ why: { ...(b.why as object), image: id } })) },
  { file: 'preva/film-poster-laser.jpg', alt: 'Laser treatment at Preva', apply: (p, id) => brand(p, 'preva', (b) => ({ film: { ...(b.film as object), poster: id } })) },
  { file: 'preva/founder-michelle-paty.jpg', alt: 'Michelle Paty', apply: async (p, id) => {
    const f = (await p.find({ collection: 'founders', where: { slug: { equals: 'michelle-paty' } }, limit: 1, depth: 0 })).docs[0]
    if (f) await p.update({ collection: 'founders', id: f.id, data: { headshot: id } })
  } },
  // Privé (014), Lexington shoot, Nov 2026
  { file: 'prive/practice-hallway.jpg', alt: 'The treatment hallway at Privé', apply: (p, id) => brand(p, 'prive', (b) => ({ practice: { ...(b.practice as object), image: id } })) },
  { file: 'prive/why-brandice.jpg', alt: 'Brandice Harrison with a patient at Privé', apply: (p, id) => brand(p, 'prive', (b) => ({ why: { ...(b.why as object), image: id } })) },
  { file: 'prive/film-poster-keeneland.jpg', alt: 'Keeneland barn in the snow, Lexington', apply: (p, id) => brand(p, 'prive', (b) => ({ film: { ...(b.film as object), poster: id } })) },
  { file: 'prive/location-lexington.jpg', alt: 'The Privé mark on marble, Lexington', apply: (p, id) => location(p, 'prive-lexington-ky', { photo: id }) },
  { file: 'prive/founder-brandice-harrison.jpg', alt: 'Brandice Harrison', apply: (p, id) => founder(p, 'brandice-harrison', { headshot: id }) },
  { file: 'prive/portrait-brandice-harrison.jpg', alt: 'Brandice Harrison at Privé', apply: (p, id) => founder(p, 'brandice-harrison', { portrait: id }) },
  { file: 'prive/founder-becky-mcdonald.jpg', alt: 'Becky McDonald', apply: (p, id) => founder(p, 'becky-mcdonald', { headshot: id }) },
  // LexRx (015), Boston shoot, Nov 2026
  { file: 'lexrx/practice-team.jpg', alt: 'The LexRx team at the front bar', apply: (p, id) => brand(p, 'lexrx', (b) => ({ practice: { ...(b.practice as object), image: id } })) },
  { file: 'lexrx/why-mirror.jpg', alt: 'Alexa Nicholls Costa handing a patient the mirror', apply: (p, id) => brand(p, 'lexrx', (b) => ({ why: { ...(b.why as object), image: id } })) },
  { file: 'lexrx/film-poster-studio.jpg', alt: 'LexRx', apply: (p, id) => brand(p, 'lexrx', (b) => ({ film: { ...(b.film as object), poster: id } })) },
  { file: 'lexrx/founder-alexa-nicholls-costa.jpg', alt: 'Alexa Nicholls Costa', apply: (p, id) => founder(p, 'alexa-nicholls-costa', { headshot: id }) },
  { file: 'lexrx/portrait-alexa-nicholls-costa.jpg', alt: 'Alexa Nicholls Costa at LexRx', apply: (p, id) => founder(p, 'alexa-nicholls-costa', { portrait: id }) },
  // Anne Therese (007), Ohio + Cape Coral shoot, Nov 2026
  { file: 'atam/practice-front-desk.jpg', alt: 'The front desk at Anne Therese, Lewis Center', apply: (p, id) => brand(p, 'anne-therese-aesthetic-medicine', (b) => ({ practice: { ...(b.practice as object), image: id } })) },
  { file: 'atam/why-anne.jpg', alt: 'Dr. Anne Therese Stubbs with a patient', apply: (p, id) => brand(p, 'anne-therese-aesthetic-medicine', (b) => ({ why: { ...(b.why as object), image: id } })) },
  { file: 'atam/film-poster-canal.jpg', alt: 'A Cape Coral canal at dawn', apply: (p, id) => brand(p, 'anne-therese-aesthetic-medicine', (b) => ({ film: { ...(b.film as object), poster: id } })) },
  { file: 'atam/founder-anne-therese-stubbs.jpg', alt: 'Dr. Anne Therese Stubbs', apply: (p, id) => founder(p, 'anne-therese-stubbs', { headshot: id }) },
  { file: 'atam/portrait-anne-therese-stubbs.jpg', alt: 'Dr. Anne Therese Stubbs at Anne Therese', apply: (p, id) => founder(p, 'anne-therese-stubbs', { portrait: id }) },
  { file: 'atam/location-lewis-center.jpg', alt: 'The lobby at Anne Therese, Lewis Center', apply: (p, id) => location(p, 'anne-therese-aesthetic-medicine-columbus-ohio', { photo: id }) },
  { file: 'atam/location-gahanna.jpg', alt: 'Anne Therese, Gahanna', apply: (p, id) => location(p, 'anne-therese-aesthetic-medicine-gahanna-oh', { photo: id }) },
  { file: 'atam/location-cape-coral.jpg', alt: 'Anne Therese on Cape Coral Parkway', apply: (p, id) => location(p, 'anne-therese-aesthetic-medicine-cape-coral-fl', { photo: id }) },
  { file: 'atam/cta-cape-coral.jpg', alt: 'Sunrise on the water, Cape Coral', apply: (p, id) => cta(p, 'Anne Therese / Cape Coral', 'anne-therese-aesthetic-medicine-cape-coral-fl', id) },
  { file: 'atam/cta-gahanna.jpg', alt: 'A crystal sconce at Anne Therese, Gahanna', apply: (p, id) => cta(p, 'Anne Therese / Gahanna', 'anne-therese-aesthetic-medicine-gahanna-oh', id) },
  // Inside the practice rail (brand page) and location galleries
  { file: 'atam/inside-lobby-chandeliers.jpg', alt: 'Chandeliers in the Lewis Center lobby', apply: (p, id) => inside(p, 'anne-therese-aesthetic-medicine', id, 'Lobby / Lewis Center') },
  { file: 'atam/inside-lewis-center-desk.jpg', alt: 'The front desk at Lewis Center', apply: (p, id) => inside(p, 'anne-therese-aesthetic-medicine', id, 'Front desk / Lewis Center') },
  { file: 'atam/inside-anne-treatment.jpg', alt: 'Dr. Anne Therese Stubbs treating a patient', apply: (p, id) => inside(p, 'anne-therese-aesthetic-medicine', id, 'Dr. Anne Therese Stubbs / Lewis Center') },
  { file: 'atam/inside-lewis-center-room.jpg', alt: 'A treatment at Lewis Center', apply: (p, id) => inside(p, 'anne-therese-aesthetic-medicine', id, 'Treatment room / Lewis Center') },
  { file: 'atam/inside-gahanna-desk.jpg', alt: 'The front desk at Gahanna', apply: (p, id) => inside(p, 'anne-therese-aesthetic-medicine', id, 'Front desk / Gahanna') },
  { file: 'atam/inside-gahanna-laser.jpg', alt: 'A laser treatment at Gahanna', apply: (p, id) => inside(p, 'anne-therese-aesthetic-medicine', id, 'Laser / Gahanna') },
  { file: 'atam/inside-gahanna-skincare.jpg', alt: 'The skincare wall at Gahanna', apply: (p, id) => inside(p, 'anne-therese-aesthetic-medicine', id, 'Skincare / Gahanna') },
  { file: 'atam/inside-gahanna-facial.jpg', alt: 'A facial at Gahanna', apply: (p, id) => inside(p, 'anne-therese-aesthetic-medicine', id, 'Facial / Gahanna') },
  { file: 'atam/inside-cape-coral-desk.jpg', alt: 'The front desk at Cape Coral', apply: (p, id) => inside(p, 'anne-therese-aesthetic-medicine', id, 'Front desk / Cape Coral') },
  { file: 'atam/inside-cape-coral-room.jpg', alt: 'A treatment at Cape Coral', apply: (p, id) => inside(p, 'anne-therese-aesthetic-medicine', id, 'Treatment room / Cape Coral') },
  { file: 'atam/inside-cape-coral-palm.jpg', alt: 'A palm on Cape Coral Parkway', apply: (p, id) => inside(p, 'anne-therese-aesthetic-medicine', id, 'Cape Coral') },
  { file: 'atam/gal-lewis-center-1.jpg', alt: 'The lobby at Lewis Center', apply: (p, id) => gallery(p, 'anne-therese-aesthetic-medicine-columbus-ohio', id, 'arrival') },
  { file: 'atam/gal-lewis-center-2.jpg', alt: 'The front desk at Lewis Center', apply: (p, id) => gallery(p, 'anne-therese-aesthetic-medicine-columbus-ohio', id, 'front-desk') },
  { file: 'atam/gal-lewis-center-3.jpg', alt: 'A treatment room at Lewis Center', apply: (p, id) => gallery(p, 'anne-therese-aesthetic-medicine-columbus-ohio', id, 'treatment-room') },
  { file: 'atam/gal-lewis-center-4.jpg', alt: 'A treatment room at Lewis Center', apply: (p, id) => gallery(p, 'anne-therese-aesthetic-medicine-columbus-ohio', id, 'treatment-room') },
  { file: 'atam/gal-lewis-center-5.jpg', alt: 'Syringes on a crystal tray at Lewis Center', apply: (p, id) => gallery(p, 'anne-therese-aesthetic-medicine-columbus-ohio', id, 'detail') },
  { file: 'atam/gal-gahanna-1.jpg', alt: 'Anne Therese, Gahanna, from the walk', apply: (p, id) => gallery(p, 'anne-therese-aesthetic-medicine-gahanna-oh', id, 'arrival') },
  { file: 'atam/gal-gahanna-2.jpg', alt: 'The front desk at Gahanna', apply: (p, id) => gallery(p, 'anne-therese-aesthetic-medicine-gahanna-oh', id, 'front-desk') },
  { file: 'atam/gal-gahanna-3.jpg', alt: 'A laser treatment at Gahanna', apply: (p, id) => gallery(p, 'anne-therese-aesthetic-medicine-gahanna-oh', id, 'treatment-room') },
  { file: 'atam/gal-gahanna-4.jpg', alt: 'A consult at Gahanna', apply: (p, id) => gallery(p, 'anne-therese-aesthetic-medicine-gahanna-oh', id, 'consult') },
  { file: 'atam/gal-gahanna-5.jpg', alt: 'The skincare wall at Gahanna', apply: (p, id) => gallery(p, 'anne-therese-aesthetic-medicine-gahanna-oh', id, 'retail') },
  { file: 'atam/gal-cape-coral-1.jpg', alt: 'Anne Therese on Cape Coral Parkway', apply: (p, id) => gallery(p, 'anne-therese-aesthetic-medicine-cape-coral-fl', id, 'arrival') },
  { file: 'atam/gal-cape-coral-2.jpg', alt: 'The front desk at Cape Coral', apply: (p, id) => gallery(p, 'anne-therese-aesthetic-medicine-cape-coral-fl', id, 'front-desk') },
  { file: 'atam/gal-cape-coral-3.jpg', alt: 'A treatment at Cape Coral', apply: (p, id) => gallery(p, 'anne-therese-aesthetic-medicine-cape-coral-fl', id, 'treatment-room') },
  { file: 'atam/gal-cape-coral-4.jpg', alt: 'A consult at Cape Coral', apply: (p, id) => gallery(p, 'anne-therese-aesthetic-medicine-cape-coral-fl', id, 'consult') },
  { file: 'atam/gal-cape-coral-5.jpg', alt: 'The treatment room hallway at Cape Coral', apply: (p, id) => gallery(p, 'anne-therese-aesthetic-medicine-cape-coral-fl', id, 'treatment-room') },
  // Refined at Blossom (Winchester, tuck-in), Nov 2026 shoot
  { file: 'ra/location-winchester.jpg', alt: 'The lobby at Refined at Blossom, Winchester', apply: (p, id) => location(p, 'refined-aesthetics-winchester', { photo: id }) },
  { file: 'ra/gal-winchester-1.jpg', alt: 'The lobby and skincare wall at Refined at Blossom', apply: (p, id) => gallery(p, 'refined-aesthetics-winchester', id, 'arrival') },
  { file: 'ra/gal-winchester-2.jpg', alt: 'A treatment room at Refined at Blossom', apply: (p, id) => gallery(p, 'refined-aesthetics-winchester', id, 'treatment-room') },
  { file: 'ra/gal-winchester-3.jpg', alt: 'A Halo laser treatment at Refined at Blossom', apply: (p, id) => gallery(p, 'refined-aesthetics-winchester', id, 'treatment-room') },
  { file: 'ra/gal-winchester-4.jpg', alt: 'A consult at Refined at Blossom', apply: (p, id) => gallery(p, 'refined-aesthetics-winchester', id, 'consult') },
  { file: 'ra/gal-winchester-5.jpg', alt: 'A facial at Refined at Blossom', apply: (p, id) => gallery(p, 'refined-aesthetics-winchester', id, 'treatment-room') },
  { file: 'ra/lead-lynn-nieman.jpg', alt: 'Dr. Lynn Nieman', apply: (p, id) => location(p, 'refined-aesthetics-winchester', { lead: { name: 'Dr. Lynn Nieman', credentials: 'MD', title: 'Medical Director', photo: id } }) },
  { file: 'ra/cta-winchester.jpg', alt: 'A treatment room at Refined at Blossom', apply: (p, id) => cta(p, 'Refined at Blossom / Winchester', 'refined-aesthetics-winchester', id) },
  // Bonita Springs (de novo), branding shoot, Nov 2025
  { file: 'atam/location-bonita-springs.jpg', alt: 'Anne Therese, Suite 154, Bonita Springs', apply: (p, id) => location(p, 'anne-therese-aesthetic-medicine-bonita-springs-fl', { photo: id }) },
  { file: 'atam/gal-bonita-springs-1.jpg', alt: 'The colonnade at Suite 154, Bonita Springs', apply: (p, id) => gallery(p, 'anne-therese-aesthetic-medicine-bonita-springs-fl', id, 'arrival') },
  { file: 'atam/gal-bonita-springs-2.jpg', alt: 'The front desk at Bonita Springs', apply: (p, id) => gallery(p, 'anne-therese-aesthetic-medicine-bonita-springs-fl', id, 'front-desk') },
  { file: 'atam/gal-bonita-springs-3.jpg', alt: 'A treatment at Bonita Springs', apply: (p, id) => gallery(p, 'anne-therese-aesthetic-medicine-bonita-springs-fl', id, 'treatment-room') },
  { file: 'atam/gal-bonita-springs-4.jpg', alt: 'A facial at Bonita Springs', apply: (p, id) => gallery(p, 'anne-therese-aesthetic-medicine-bonita-springs-fl', id, 'treatment-room') },
  { file: 'atam/gal-bonita-springs-5.jpg', alt: 'The skincare wall at Bonita Springs', apply: (p, id) => gallery(p, 'anne-therese-aesthetic-medicine-bonita-springs-fl', id, 'retail') },
  // story film posters (the brand page film card), one place frame per brand
  { file: 'rne/film-poster-rocks.jpg', alt: 'Surf on the rocks, North Shore', apply: (p, id) => brand(p, 'rn-esthetics', (b) => ({ film: { ...(b.film as object), poster: id } })) },
  { file: 'lcm/film-poster-marina.jpg', alt: 'The Marin waterfront', apply: (p, id) => brand(p, 'the-laser-center-of-marin', (b) => ({ film: { ...(b.film as object), poster: id } })) },
  { file: 'twc/film-poster-saratoga.jpg', alt: 'Welcome to Saratoga Springs', apply: (p, id) => brand(p, 'williams-center', (b) => ({ film: { ...(b.film as object), poster: id } })) },
  { file: 'mn/film-poster-breakwater.jpg', alt: 'The breakwater lighthouse off Lewes', apply: (p, id) => brand(p, 'mint-needle', (b) => ({ film: { ...(b.film as object), poster: id } })) },
  { file: 'flawless/film-poster-old-town.jpg', alt: 'Adobe in Old Town Albuquerque', apply: (p, id) => brand(p, 'flawless-medspa-wellness', (b) => ({ film: { ...(b.film as object), poster: id } })) },
  { file: 'htb/film-poster-rocks.jpg', alt: 'On the rocks above the Pacific, HTB rebrand shoot', apply: (p, id) => brand(p, 'holden-timeless-beauty', (b) => ({ film: { ...(b.film as object), poster: id } })) },
  { file: 'ec/film-poster-consult.jpg', alt: 'A surgical consult at Esthetics Center', apply: (p, id) => brand(p, 'esthetics-center', (b) => ({ film: { ...(b.film as object), poster: id } })) },
  { file: 'cami/film-poster-lake.jpg', alt: 'On the lake, Cami rebrand shoot', apply: (p, id) => brand(p, 'cami', (b) => ({ film: { ...(b.film as object), poster: id } })) },
  { file: 'dontage/film-poster-injector.jpg', alt: 'An injection at Dontage', apply: (p, id) => brand(p, 'dontage', (b) => ({ film: { ...(b.film as object), poster: id } })) },
  { file: 'inbloom/film-poster-town.jpg', alt: 'Southern New Hampshire from above', apply: (p, id) => brand(p, 'inbloom', (b) => ({ film: { ...(b.film as object), poster: id } })) },
  // RN Esthetics, location shoot May 2026 (Kevin's red-tagged picks + North Shore details)
  { file: 'rne/practice-front-desk.jpg', alt: 'The front desk at RN Esthetics, Salem', apply: (p, id) => brand(p, 'rn-esthetics', (b) => ({ practice: { ...(b.practice as object), image: id } })) },
  { file: 'rne/why-provider.jpg', alt: 'A treatment at RN Esthetics, Salem', apply: (p, id) => brand(p, 'rn-esthetics', (b) => ({ why: { ...(b.why as object), image: id } })) },
  { file: 'rne/inside-marblehead-light.jpg', alt: 'Marblehead Light', apply: (p, id) => inside(p, 'rn-esthetics', id, 'Marblehead Light / North Shore') },
  { file: 'rne/inside-newburyport-lobby.jpg', alt: 'The lobby at Newburyport', apply: (p, id) => inside(p, 'rn-esthetics', id, 'Lobby / Newburyport') },
  { file: 'rne/inside-salem-lounge.jpg', alt: 'The lounge at Salem', apply: (p, id) => inside(p, 'rn-esthetics', id, 'Lounge / Salem') },
  { file: 'rne/inside-newburyport-hall.jpg', alt: 'The treatment hall at Newburyport', apply: (p, id) => inside(p, 'rn-esthetics', id, 'Hall / Newburyport') },
  { file: 'rne/inside-salem-laser.jpg', alt: 'A laser treatment at Salem', apply: (p, id) => inside(p, 'rn-esthetics', id, 'Laser / Salem') },
  { file: 'rne/inside-lynnfield-skincare.jpg', alt: 'The skincare wall at Lynnfield', apply: (p, id) => inside(p, 'rn-esthetics', id, 'Skincare / Lynnfield') },
  { file: 'rne/inside-newburyport-laser.jpg', alt: 'A laser treatment at Newburyport', apply: (p, id) => inside(p, 'rn-esthetics', id, 'Laser / Newburyport') },
  { file: 'rne/inside-newburyport-flowers.jpg', alt: 'The lobby table at Newburyport', apply: (p, id) => inside(p, 'rn-esthetics', id, 'Lobby / Newburyport') },
  { file: 'rne/inside-lynnfield-facial.jpg', alt: 'A facial at Lynnfield', apply: (p, id) => inside(p, 'rn-esthetics', id, 'Facial / Lynnfield') },
  { file: 'rne/inside-salem-downtown.jpg', alt: 'Downtown Salem', apply: (p, id) => inside(p, 'rn-esthetics', id, 'Downtown / Salem') },
  { file: 'rne/inside-salem-facial.jpg', alt: 'A facial at Salem', apply: (p, id) => inside(p, 'rn-esthetics', id, 'Facial / Salem') },
  { file: 'rne/inside-pink-house.jpg', alt: 'The Pink House, Newbury', apply: (p, id) => inside(p, 'rn-esthetics', id, 'The Pink House / Newbury') },
  { file: 'rne/location-salem.jpg', alt: 'The RN Esthetics sign, Salem', apply: (p, id) => location(p, 'rn-esthetics-salem', { photo: id }) },
  { file: 'rne/gal-salem-1.jpg', alt: 'The lounge at Salem', apply: (p, id) => gallery(p, 'rn-esthetics-salem', id, 'arrival') },
  { file: 'rne/gal-salem-2.jpg', alt: 'The front desk at Salem', apply: (p, id) => gallery(p, 'rn-esthetics-salem', id, 'front-desk') },
  { file: 'rne/gal-salem-3.jpg', alt: 'A laser treatment at Salem', apply: (p, id) => gallery(p, 'rn-esthetics-salem', id, 'treatment-room') },
  { file: 'rne/gal-salem-4.jpg', alt: 'A treatment at Salem', apply: (p, id) => gallery(p, 'rn-esthetics-salem', id, 'treatment-room') },
  { file: 'rne/gal-salem-5.jpg', alt: 'The skincare shelves at Salem', apply: (p, id) => gallery(p, 'rn-esthetics-salem', id, 'retail') },
  { file: 'rne/cta-salem.jpg', alt: 'The lounge at Salem', apply: (p, id) => cta(p, 'RN Esthetics / Salem', 'rn-esthetics-salem', id) },
  { file: 'rne/location-newburyport.jpg', alt: 'RN Esthetics, Newburyport', apply: (p, id) => location(p, 'rn-esthetics-newburyport', { photo: id }) },
  { file: 'rne/gal-newburyport-1.jpg', alt: 'The lobby at Newburyport', apply: (p, id) => gallery(p, 'rn-esthetics-newburyport', id, 'arrival') },
  { file: 'rne/gal-newburyport-2.jpg', alt: 'The front desk at Newburyport', apply: (p, id) => gallery(p, 'rn-esthetics-newburyport', id, 'front-desk') },
  { file: 'rne/gal-newburyport-3.jpg', alt: 'A laser treatment at Newburyport', apply: (p, id) => gallery(p, 'rn-esthetics-newburyport', id, 'treatment-room') },
  { file: 'rne/gal-newburyport-4.jpg', alt: 'A treatment room at Newburyport', apply: (p, id) => gallery(p, 'rn-esthetics-newburyport', id, 'treatment-room') },
  { file: 'rne/gal-newburyport-5.jpg', alt: 'The skincare wall at Newburyport', apply: (p, id) => gallery(p, 'rn-esthetics-newburyport', id, 'retail') },
  { file: 'rne/cta-newburyport.jpg', alt: 'The lobby at Newburyport from above', apply: (p, id) => cta(p, 'RN Esthetics / Newburyport', 'rn-esthetics-newburyport', id) },
  { file: 'rne/location-lynnfield.jpg', alt: 'The 1690 house in Lynnfield', apply: (p, id) => location(p, 'rn-esthetics-lynnfield', { photo: id }) },
  { file: 'rne/gal-lynnfield-1.jpg', alt: 'A treatment room at Lynnfield', apply: (p, id) => gallery(p, 'rn-esthetics-lynnfield', id, 'treatment-room') },
  { file: 'rne/gal-lynnfield-2.jpg', alt: 'A consult at Lynnfield', apply: (p, id) => gallery(p, 'rn-esthetics-lynnfield', id, 'consult') },
  { file: 'rne/gal-lynnfield-3.jpg', alt: 'A laser treatment at Lynnfield', apply: (p, id) => gallery(p, 'rn-esthetics-lynnfield', id, 'treatment-room') },
  { file: 'rne/gal-lynnfield-4.jpg', alt: 'A facial at Lynnfield', apply: (p, id) => gallery(p, 'rn-esthetics-lynnfield', id, 'treatment-room') },
  { file: 'rne/gal-lynnfield-5.jpg', alt: 'The skincare wall at Lynnfield', apply: (p, id) => gallery(p, 'rn-esthetics-lynnfield', id, 'retail') },
  { file: 'rne/cta-lynnfield.jpg', alt: 'A treatment at Lynnfield', apply: (p, id) => cta(p, 'RN Esthetics / Lynnfield', 'rn-esthetics-lynnfield', id) },
  // The Laser Center of Marin, finaltlc exports
  { file: 'lcm/practice-room.jpg', alt: 'A treatment room at the Laser Center of Marin', apply: (p, id) => brand(p, 'the-laser-center-of-marin', (b) => ({ practice: { ...(b.practice as object), image: id } })) },
  { file: 'lcm/why-consult.jpg', alt: 'A consult at the Laser Center of Marin', apply: (p, id) => brand(p, 'the-laser-center-of-marin', (b) => ({ why: { ...(b.why as object), image: id } })) },
  { file: 'lcm/inside-waterfront.jpg', alt: 'Boats on the Marin waterfront', apply: (p, id) => inside(p, 'the-laser-center-of-marin', id, 'Marin waterfront') },
  { file: 'lcm/inside-provider.jpg', alt: 'A provider at the Laser Center of Marin', apply: (p, id) => inside(p, 'the-laser-center-of-marin', id, 'Provider / Corte Madera') },
  { file: 'lcm/inside-consult-mirror.jpg', alt: 'A consult with a hand mirror', apply: (p, id) => inside(p, 'the-laser-center-of-marin', id, 'Consult / Corte Madera') },
  { file: 'lcm/inside-laser.jpg', alt: 'A laser treatment', apply: (p, id) => inside(p, 'the-laser-center-of-marin', id, 'Laser / Corte Madera') },
  { file: 'lcm/inside-laser-2.jpg', alt: 'A laser treatment', apply: (p, id) => inside(p, 'the-laser-center-of-marin', id, 'Laser / Corte Madera') },
  { file: 'lcm/inside-provider-2.jpg', alt: 'A provider between treatments', apply: (p, id) => inside(p, 'the-laser-center-of-marin', id, 'Provider / Corte Madera') },
  { file: 'lcm/inside-treatment.jpg', alt: 'A treatment', apply: (p, id) => inside(p, 'the-laser-center-of-marin', id, 'Treatment / Corte Madera') },
  { file: 'lcm/inside-laser-3.jpg', alt: 'A laser treatment', apply: (p, id) => inside(p, 'the-laser-center-of-marin', id, 'Laser / Corte Madera') },
  { file: 'lcm/inside-treatment-2.jpg', alt: 'A microneedling treatment', apply: (p, id) => inside(p, 'the-laser-center-of-marin', id, 'Treatment / Corte Madera') },
  { file: 'lcm/inside-boat.jpg', alt: 'A sailboat on the Marin waterfront', apply: (p, id) => inside(p, 'the-laser-center-of-marin', id, 'Marin waterfront') },
  { file: 'lcm/inside-skyline.jpg', alt: 'San Francisco from across the bay', apply: (p, id) => inside(p, 'the-laser-center-of-marin', id, 'Across the bay') },
  { file: 'lcm/location-corte-madera.jpg', alt: 'The entrance at 770 Tamalpais Dr, Corte Madera', apply: (p, id) => location(p, 'the-laser-center-of-marin-corte-matero-ca', { photo: id }) },
  { file: 'lcm/gal-corte-madera-1.jpg', alt: 'The courtyard outside the Laser Center of Marin', apply: (p, id) => gallery(p, 'the-laser-center-of-marin-corte-matero-ca', id, 'arrival') },
  { file: 'lcm/gal-corte-madera-2.jpg', alt: 'A consult at Corte Madera', apply: (p, id) => gallery(p, 'the-laser-center-of-marin-corte-matero-ca', id, 'consult') },
  { file: 'lcm/gal-corte-madera-3.jpg', alt: 'A laser treatment at Corte Madera', apply: (p, id) => gallery(p, 'the-laser-center-of-marin-corte-matero-ca', id, 'treatment-room') },
  { file: 'lcm/gal-corte-madera-4.jpg', alt: 'A laser treatment at Corte Madera', apply: (p, id) => gallery(p, 'the-laser-center-of-marin-corte-matero-ca', id, 'treatment-room') },
  { file: 'lcm/gal-corte-madera-5.jpg', alt: 'A treatment device screen', apply: (p, id) => gallery(p, 'the-laser-center-of-marin-corte-matero-ca', id, 'detail') },
  { file: 'lcm/cta-corte-madera.jpg', alt: 'The Golden Gate Bridge at dusk', apply: (p, id) => cta(p, 'The Laser Center of Marin / Corte Madera', 'the-laser-center-of-marin-corte-matero-ca', id) },
  // Williams Center, Latham shoot Aug 2025
  { file: 'twc/practice-surgery.jpg', alt: 'A surgery in progress at the Williams Center, Latham', apply: (p, id) => brand(p, 'williams-center', (b) => ({ practice: { ...(b.practice as object), image: id } })) },
  { file: 'twc/why-consult.jpg', alt: 'A consult at the Williams Center', apply: (p, id) => brand(p, 'williams-center', (b) => ({ why: { ...(b.why as object), image: id } })) },
  { file: 'twc/inside-facade.jpg', alt: 'The Williams Center, Latham', apply: (p, id) => inside(p, 'williams-center', id, 'The Williams Center / Latham') },
  { file: 'twc/inside-lounge.jpg', alt: 'The lounge at Latham', apply: (p, id) => inside(p, 'williams-center', id, 'Lounge / Latham') },
  { file: 'twc/inside-staircase.jpg', alt: 'The staircase at Latham', apply: (p, id) => inside(p, 'williams-center', id, 'Staircase / Latham') },
  { file: 'twc/inside-hair-desk.jpg', alt: 'The Saratoga Hair Center desk', apply: (p, id) => inside(p, 'williams-center', id, 'Saratoga Hair Center / Latham') },
  { file: 'twc/inside-consult-mirror.jpg', alt: 'A consult with a hand mirror', apply: (p, id) => inside(p, 'williams-center', id, 'Consult / Latham') },
  { file: 'twc/inside-surgery.jpg', alt: 'The operating room at Latham', apply: (p, id) => inside(p, 'williams-center', id, 'Surgery / Latham') },
  { file: 'twc/inside-surgeon.jpg', alt: 'A surgeon at work', apply: (p, id) => inside(p, 'williams-center', id, 'Surgery / Latham') },
  { file: 'twc/inside-injectable.jpg', alt: 'An injectable treatment', apply: (p, id) => inside(p, 'williams-center', id, 'Injectables / Latham') },
  { file: 'twc/inside-rejuva.jpg', alt: 'The Rejuva Center at Williams', apply: (p, id) => inside(p, 'williams-center', id, 'The Rejuva Center / Latham') },
  { file: 'twc/inside-waiting.jpg', alt: 'The Rejuva Center waiting room', apply: (p, id) => inside(p, 'williams-center', id, 'Waiting room / Latham') },
  { file: 'twc/inside-procedure.jpg', alt: 'A procedure at Latham', apply: (p, id) => inside(p, 'williams-center', id, 'Procedure / Latham') },
  { file: 'twc/inside-facial.jpg', alt: 'A facial at the Rejuva Center', apply: (p, id) => inside(p, 'williams-center', id, 'Facial / Latham') },
  { file: 'twc/location-latham.jpg', alt: 'The Williams Center building, Latham', apply: (p, id) => location(p, 'williams-center-latham-ny', { photo: id }) },
  { file: 'twc/gal-latham-1.jpg', alt: 'The entrance at Latham', apply: (p, id) => gallery(p, 'williams-center-latham-ny', id, 'arrival') },
  { file: 'twc/gal-latham-2.jpg', alt: 'The Saratoga Hair Center front desk', apply: (p, id) => gallery(p, 'williams-center-latham-ny', id, 'front-desk') },
  { file: 'twc/gal-latham-3.jpg', alt: 'The operating room at Latham', apply: (p, id) => gallery(p, 'williams-center-latham-ny', id, 'treatment-room') },
  { file: 'twc/gal-latham-4.jpg', alt: 'A consult at Latham', apply: (p, id) => gallery(p, 'williams-center-latham-ny', id, 'consult') },
  { file: 'twc/gal-latham-5.jpg', alt: 'The skincare shelves at the Rejuva Center', apply: (p, id) => gallery(p, 'williams-center-latham-ny', id, 'retail') },
  { file: 'twc/cta-latham.jpg', alt: 'The lounge at Latham', apply: (p, id) => cta(p, 'Williams Center / Latham', 'williams-center-latham-ny', id) },
  // Williams Center, Saratoga Springs shoot Sep 2025
  { file: 'twc/location-saratoga-springs.jpg', alt: 'The Wise Building entrance, 60 Railroad Pl, Saratoga Springs', apply: (p, id) => location(p, 'williams-center-saratoga-springs', { photo: id }) },
  { file: 'twc/gal-saratoga-springs-1.jpg', alt: 'The Rejuva Center door, Suite 102', apply: (p, id) => gallery(p, 'williams-center-saratoga-springs', id, 'arrival') },
  { file: 'twc/gal-saratoga-springs-2.jpg', alt: 'The front desk at Saratoga Springs', apply: (p, id) => gallery(p, 'williams-center-saratoga-springs', id, 'front-desk') },
  { file: 'twc/gal-saratoga-springs-3.jpg', alt: 'A treatment room at Saratoga Springs', apply: (p, id) => gallery(p, 'williams-center-saratoga-springs', id, 'treatment-room') },
  { file: 'twc/gal-saratoga-springs-4.jpg', alt: 'A consult at Saratoga Springs', apply: (p, id) => gallery(p, 'williams-center-saratoga-springs', id, 'consult') },
  { file: 'twc/gal-saratoga-springs-5.jpg', alt: 'A treatment tray', apply: (p, id) => gallery(p, 'williams-center-saratoga-springs', id, 'detail') },
  { file: 'twc/cta-saratoga-springs.jpg', alt: 'The carousel in Congress Park, Saratoga Springs', apply: (p, id) => cta(p, 'Williams Center / Saratoga Springs', 'williams-center-saratoga-springs', id) },
  // Mint + Needle, Lewes + Middletown shoot Mar 2025 (finalmn)
  { file: 'mn/practice-hall.jpg', alt: 'The treatment hall at Mint + Needle, Middletown', apply: (p, id) => brand(p, 'mint-needle', (b) => ({ practice: { ...(b.practice as object), image: id } })) },
  { file: 'mn/why-injectable.jpg', alt: 'An injectable treatment at Mint + Needle', apply: (p, id) => brand(p, 'mint-needle', (b) => ({ why: { ...(b.why as object), image: id } })) },
  { file: 'mn/inside-beach.jpg', alt: 'The beach at Lewes', apply: (p, id) => inside(p, 'mint-needle', id, 'The beach / Lewes') },
  { file: 'mn/inside-lighthouse.jpg', alt: 'The breakwater lighthouse off Lewes', apply: (p, id) => inside(p, 'mint-needle', id, 'Breakwater / Lewes') },
  { file: 'mn/inside-lewes-building.jpg', alt: 'Mint + Needle on 3rd St, Lewes', apply: (p, id) => inside(p, 'mint-needle', id, '3rd St / Lewes') },
  { file: 'mn/inside-lewes-lounge.jpg', alt: 'The lounge at Lewes', apply: (p, id) => inside(p, 'mint-needle', id, 'Lounge / Lewes') },
  { file: 'mn/inside-skincare.jpg', alt: 'The skincare shelves at Lewes', apply: (p, id) => inside(p, 'mint-needle', id, 'Skincare / Lewes') },
  { file: 'mn/inside-provider.jpg', alt: 'A provider at Lewes', apply: (p, id) => inside(p, 'mint-needle', id, 'Provider / Lewes') },
  { file: 'mn/inside-injectable.jpg', alt: 'An injectable treatment at Lewes', apply: (p, id) => inside(p, 'mint-needle', id, 'Injectables / Lewes') },
  { file: 'mn/inside-lightship.jpg', alt: 'The Overfalls lightship, Lewes', apply: (p, id) => inside(p, 'mint-needle', id, 'Overfalls / Lewes') },
  { file: 'mn/inside-middletown-street.jpg', alt: 'Main Street, Middletown', apply: (p, id) => inside(p, 'mint-needle', id, 'Main Street / Middletown') },
  { file: 'mn/inside-middletown-lounge.jpg', alt: 'The lounge at Middletown', apply: (p, id) => inside(p, 'mint-needle', id, 'Lounge / Middletown') },
  { file: 'mn/inside-treatment.jpg', alt: 'A treatment at Middletown', apply: (p, id) => inside(p, 'mint-needle', id, 'Treatment / Middletown') },
  { file: 'mn/inside-facial-steam.jpg', alt: 'A facial', apply: (p, id) => inside(p, 'mint-needle', id, 'Facial / Middletown') },
  { file: 'mn/inside-facial-light.jpg', alt: 'A facial under the lamp', apply: (p, id) => inside(p, 'mint-needle', id, 'Facial / Middletown') },
  { file: 'mn/inside-training.jpg', alt: 'Team training at Middletown', apply: (p, id) => inside(p, 'mint-needle', id, 'Training / Middletown') },
  { file: 'mn/location-lewes.jpg', alt: 'Mint + Needle on the corner of 3rd St, Lewes', apply: (p, id) => location(p, 'mint-needle-lewes-de', { photo: id }) },
  { file: 'mn/gal-lewes-1.jpg', alt: 'The entrance at Lewes', apply: (p, id) => gallery(p, 'mint-needle-lewes-de', id, 'arrival') },
  { file: 'mn/gal-lewes-2.jpg', alt: 'The front desk at Lewes', apply: (p, id) => gallery(p, 'mint-needle-lewes-de', id, 'front-desk') },
  { file: 'mn/gal-lewes-3.jpg', alt: 'A treatment room at Lewes', apply: (p, id) => gallery(p, 'mint-needle-lewes-de', id, 'treatment-room') },
  { file: 'mn/gal-lewes-4.jpg', alt: 'A provider preparing a treatment at Lewes', apply: (p, id) => gallery(p, 'mint-needle-lewes-de', id, 'treatment-room') },
  { file: 'mn/gal-lewes-5.jpg', alt: 'The skincare shelves at Lewes', apply: (p, id) => gallery(p, 'mint-needle-lewes-de', id, 'retail') },
  { file: 'mn/cta-lewes.jpg', alt: 'The Lewes harbor', apply: (p, id) => cta(p, 'Mint + Needle / Lewes', 'mint-needle-lewes-de', id) },
  { file: 'mn/location-middletown.jpg', alt: 'The hall at Mint + Needle, Middletown', apply: (p, id) => location(p, 'mint-needle-middletown-de', { photo: id }) },
  { file: 'mn/gal-middletown-1.jpg', alt: 'The hall at Middletown', apply: (p, id) => gallery(p, 'mint-needle-middletown-de', id, 'arrival') },
  { file: 'mn/gal-middletown-2.jpg', alt: 'The lounge at Middletown', apply: (p, id) => gallery(p, 'mint-needle-middletown-de', id, 'detail') },
  { file: 'mn/gal-middletown-3.jpg', alt: 'A treatment room at Middletown', apply: (p, id) => gallery(p, 'mint-needle-middletown-de', id, 'treatment-room') },
  { file: 'mn/gal-middletown-4.jpg', alt: 'A treatment at Middletown', apply: (p, id) => gallery(p, 'mint-needle-middletown-de', id, 'consult') },
  { file: 'mn/gal-middletown-5.jpg', alt: 'A treatment at Middletown', apply: (p, id) => gallery(p, 'mint-needle-middletown-de', id, 'treatment-room') },
  { file: 'mn/cta-middletown.jpg', alt: 'The team at Middletown', apply: (p, id) => cta(p, 'Mint + Needle / Middletown', 'mint-needle-middletown-de', id) },
  // Flawless, Taylor Ranch + Menaul Blvd shoot Jan 2025 (finalflawl)
  { file: 'flawless/practice-lobby.jpg', alt: 'The lobby and skincare wall at Flawless, Menaul Blvd', apply: (p, id) => brand(p, 'flawless-medspa-wellness', (b) => ({ practice: { ...(b.practice as object), image: id } })) },
  { file: 'flawless/why-provider.jpg', alt: 'A provider at Flawless', apply: (p, id) => brand(p, 'flawless-medspa-wellness', (b) => ({ why: { ...(b.why as object), image: id } })) },
  { file: 'flawless/inside-taylor-sign.jpg', alt: 'The Flawless sign at Taylor Ranch', apply: (p, id) => inside(p, 'flawless-medspa-wellness', id, 'Taylor Ranch') },
  { file: 'flawless/inside-disco.jpg', alt: 'Mirror balls at Flawless', apply: (p, id) => inside(p, 'flawless-medspa-wellness', id, 'Detail / Menaul Blvd') },
  { file: 'flawless/inside-consult.jpg', alt: 'A consult at Taylor Ranch', apply: (p, id) => inside(p, 'flawless-medspa-wellness', id, 'Consult / Taylor Ranch') },
  { file: 'flawless/inside-lounge.jpg', alt: 'The lounge at Menaul Blvd', apply: (p, id) => inside(p, 'flawless-medspa-wellness', id, 'Lounge / Menaul Blvd') },
  { file: 'flawless/inside-hall.jpg', alt: 'The hall at Menaul Blvd', apply: (p, id) => inside(p, 'flawless-medspa-wellness', id, 'Hall / Menaul Blvd') },
  { file: 'flawless/inside-room.jpg', alt: 'A treatment room at Menaul Blvd', apply: (p, id) => inside(p, 'flawless-medspa-wellness', id, 'Treatment room / Menaul Blvd') },
  { file: 'flawless/inside-injectable.jpg', alt: 'An injectable treatment', apply: (p, id) => inside(p, 'flawless-medspa-wellness', id, 'Injectables / Menaul Blvd') },
  { file: 'flawless/inside-doorway.jpg', alt: 'Through the doorway at Menaul Blvd', apply: (p, id) => inside(p, 'flawless-medspa-wellness', id, 'Menaul Blvd') },
  { file: 'flawless/inside-provider-desk.jpg', alt: 'A provider at his desk', apply: (p, id) => inside(p, 'flawless-medspa-wellness', id, 'Provider / Menaul Blvd') },
  { file: 'flawless/inside-salsa-saint.jpg', alt: 'Chile ristras in Old Town', apply: (p, id) => inside(p, 'flawless-medspa-wellness', id, 'Old Town / Albuquerque') },
  { file: 'flawless/inside-cactus.jpg', alt: 'Prickly pear outside', apply: (p, id) => inside(p, 'flawless-medspa-wellness', id, 'Albuquerque') },
  { file: 'flawless/inside-red-nook.jpg', alt: 'A corner at Taylor Ranch', apply: (p, id) => inside(p, 'flawless-medspa-wellness', id, 'Detail / Taylor Ranch') },
  { file: 'flawless/inside-laser-room.jpg', alt: 'A laser room at Menaul Blvd', apply: (p, id) => inside(p, 'flawless-medspa-wellness', id, 'Laser / Menaul Blvd') },
  { file: 'flawless/location-taylor-ranch.jpg', alt: 'The Flawless sign, Taylor Ranch', apply: (p, id) => location(p, 'flawless-medspa-wellness-albuquerque-nm-2', { photo: id }) },
  { file: 'flawless/gal-taylor-ranch-1.jpg', alt: 'The lobby at Taylor Ranch', apply: (p, id) => gallery(p, 'flawless-medspa-wellness-albuquerque-nm-2', id, 'arrival') },
  { file: 'flawless/gal-taylor-ranch-2.jpg', alt: 'A consult at Taylor Ranch', apply: (p, id) => gallery(p, 'flawless-medspa-wellness-albuquerque-nm-2', id, 'consult') },
  { file: 'flawless/gal-taylor-ranch-3.jpg', alt: 'The hall at Taylor Ranch', apply: (p, id) => gallery(p, 'flawless-medspa-wellness-albuquerque-nm-2', id, 'detail') },
  { file: 'flawless/gal-taylor-ranch-4.jpg', alt: 'Flowers at Taylor Ranch', apply: (p, id) => gallery(p, 'flawless-medspa-wellness-albuquerque-nm-2', id, 'detail') },
  { file: 'flawless/gal-taylor-ranch-5.jpg', alt: 'The lounge at Taylor Ranch', apply: (p, id) => gallery(p, 'flawless-medspa-wellness-albuquerque-nm-2', id, 'arrival') },
  { file: 'flawless/cta-taylor-ranch.jpg', alt: 'Mirror balls at Taylor Ranch', apply: (p, id) => cta(p, 'Flawless / Taylor Ranch', 'flawless-medspa-wellness-albuquerque-nm-2', id) },
  { file: 'flawless/location-menaul.jpg', alt: 'Flawless on Menaul Blvd', apply: (p, id) => location(p, 'flawless-medspa-wellness-albuquerque-nm', { photo: id }) },
  { file: 'flawless/gal-menaul-1.jpg', alt: 'The lobby at Menaul Blvd', apply: (p, id) => gallery(p, 'flawless-medspa-wellness-albuquerque-nm', id, 'arrival') },
  { file: 'flawless/gal-menaul-2.jpg', alt: 'The front desk at Menaul Blvd', apply: (p, id) => gallery(p, 'flawless-medspa-wellness-albuquerque-nm', id, 'front-desk') },
  { file: 'flawless/gal-menaul-3.jpg', alt: 'A treatment room at Menaul Blvd', apply: (p, id) => gallery(p, 'flawless-medspa-wellness-albuquerque-nm', id, 'treatment-room') },
  { file: 'flawless/gal-menaul-4.jpg', alt: 'A treatment at Menaul Blvd', apply: (p, id) => gallery(p, 'flawless-medspa-wellness-albuquerque-nm', id, 'treatment-room') },
  { file: 'flawless/gal-menaul-5.jpg', alt: 'The skincare shelves at Menaul Blvd', apply: (p, id) => gallery(p, 'flawless-medspa-wellness-albuquerque-nm', id, 'retail') },
  { file: 'flawless/cta-menaul.jpg', alt: 'Late light at Menaul Blvd', apply: (p, id) => cta(p, 'Flawless / Menaul Blvd', 'flawless-medspa-wellness-albuquerque-nm', id) },
  // Refined Aesthetics, brand + Leesburg (finalra)
  { file: 'ra/inside-leesburg-sign.jpg', alt: 'The Refined sign on Church St, Leesburg', apply: (p, id) => brand(p, 'refined-aesthetics', (b) => ({ why: { ...(b.why as object), image: id } })) },
  { file: 'ra/inside-leesburg-room.jpg', alt: 'A treatment room at Leesburg', apply: (p, id) => brand(p, 'refined-aesthetics', (b) => ({ practice: { ...(b.practice as object), image: id } })) },
  { file: 'ra/inside-leesburg-treatment.jpg', alt: 'A laser treatment at Leesburg', apply: (p, id) => inside(p, 'refined-aesthetics', id, 'Laser / Leesburg') },
  { file: 'ra/inside-king-st.jpg', alt: 'Downtown Leesburg at dusk', apply: (p, id) => inside(p, 'refined-aesthetics', id, 'Downtown / Leesburg') },
  { file: 'ra/inside-horse.jpg', alt: 'A horse at the fence, Loudoun County', apply: (p, id) => brand(p, 'refined-aesthetics', (b) => ({ film: { ...(b.film as object), poster: id } })) },
  { file: 'ra/inside-pasture.jpg', alt: 'A gate onto the pasture', apply: (p, id) => inside(p, 'refined-aesthetics', id, 'Loudoun County') },
  { file: 'ra/location-leesburg.jpg', alt: 'The Refined sign on Church St, Leesburg', apply: (p, id) => location(p, 'refined-aesthetics-leesburgh-vg', { photo: id }) },
  { file: 'ra/gal-leesburg-1.jpg', alt: 'The porch at Leesburg', apply: (p, id) => gallery(p, 'refined-aesthetics-leesburgh-vg', id, 'arrival') },
  { file: 'ra/gal-leesburg-2.jpg', alt: 'A treatment room at Leesburg', apply: (p, id) => gallery(p, 'refined-aesthetics-leesburgh-vg', id, 'treatment-room') },
  { file: 'ra/gal-leesburg-3.jpg', alt: 'A laser treatment at Leesburg', apply: (p, id) => gallery(p, 'refined-aesthetics-leesburgh-vg', id, 'treatment-room') },
  { file: 'ra/gal-leesburg-4.jpg', alt: 'Downtown Leesburg at dusk', apply: (p, id) => gallery(p, 'refined-aesthetics-leesburgh-vg', id, 'detail') },
  { file: 'ra/cta-leesburg.jpg', alt: 'Horses in a Loudoun County pasture', apply: (p, id) => cta(p, 'Refined Aesthetics / Leesburg', 'refined-aesthetics-leesburgh-vg', id) },
  // Privé, Lexington shoot (prive-DSC05xxx on Extreme Pro): Inside rail, gallery, closer
  { file: 'prive/inside-keeneland-barn.jpg', alt: 'A Keeneland barn in the snow', apply: (p, id) => inside(p, 'prive', id, 'Keeneland / Lexington') },
  { file: 'prive/inside-hall-art.jpg', alt: 'The hallway at Privé', apply: (p, id) => inside(p, 'prive', id, 'Hallway / Lexington') },
  { file: 'prive/inside-room.jpg', alt: 'A treatment room at Privé', apply: (p, id) => inside(p, 'prive', id, 'Treatment room / Lexington') },
  { file: 'prive/inside-injectable.jpg', alt: 'An injectable treatment', apply: (p, id) => inside(p, 'prive', id, 'Injectables / Lexington') },
  { file: 'prive/inside-laser-glow.jpg', alt: 'A laser treatment', apply: (p, id) => inside(p, 'prive', id, 'Laser / Lexington') },
  { file: 'prive/inside-grandstand.jpg', alt: 'The grandstand at Keeneland', apply: (p, id) => inside(p, 'prive', id, 'Keeneland / Lexington') },
  { file: 'prive/inside-consult.jpg', alt: 'A consult at Privé', apply: (p, id) => inside(p, 'prive', id, 'Consult / Lexington') },
  { file: 'prive/inside-bbl.jpg', alt: 'A BBL treatment', apply: (p, id) => inside(p, 'prive', id, 'BBL / Lexington') },
  { file: 'prive/inside-keeneland-clock.jpg', alt: 'The Keeneland clock', apply: (p, id) => inside(p, 'prive', id, 'Keeneland / Lexington') },
  { file: 'prive/inside-room-2.jpg', alt: 'A treatment at Privé', apply: (p, id) => inside(p, 'prive', id, 'Treatment / Lexington') },
  { file: 'prive/inside-facial.jpg', alt: 'A facial at Privé', apply: (p, id) => inside(p, 'prive', id, 'Facial / Lexington') },
  { file: 'prive/inside-moxi.jpg', alt: 'A Moxi treatment', apply: (p, id) => inside(p, 'prive', id, 'Moxi / Lexington') },
  { file: 'prive/gal-lexington-1.jpg', alt: 'The hallway at Privé', apply: (p, id) => gallery(p, 'prive-lexington-ky', id, 'arrival') },
  { file: 'prive/gal-lexington-2.jpg', alt: 'A treatment room at Privé', apply: (p, id) => gallery(p, 'prive-lexington-ky', id, 'treatment-room') },
  { file: 'prive/gal-lexington-3.jpg', alt: 'A consult at Privé', apply: (p, id) => gallery(p, 'prive-lexington-ky', id, 'consult') },
  { file: 'prive/gal-lexington-4.jpg', alt: 'A laser treatment at Privé', apply: (p, id) => gallery(p, 'prive-lexington-ky', id, 'treatment-room') },
  { file: 'prive/gal-lexington-5.jpg', alt: 'A treatment detail', apply: (p, id) => gallery(p, 'prive-lexington-ky', id, 'detail') },
  { file: 'prive/cta-lexington.jpg', alt: 'Keeneland in the snow, Lexington', apply: (p, id) => cta(p, 'Privé / Lexington', 'prive-lexington-ky', id) },
  { file: 'atam/cta-lewis-center.jpg', alt: 'Dr. Anne Therese Stubbs with a patient, Lewis Center', apply: (p, id) => cta(p, 'Anne Therese / Lewis Center', 'anne-therese-aesthetic-medicine-columbus-ohio', id) },
  { file: 'atam/cta-bonita-springs.jpg', alt: 'The fountain courtyard, Bonita Springs', apply: (p, id) => cta(p, 'Anne Therese / Bonita Springs', 'anne-therese-aesthetic-medicine-bonita-springs-fl', id) },
  { file: 'atam/inside-bonita-exam-room.jpg', alt: 'An exam room at Bonita Springs', apply: (p, id) => inside(p, 'anne-therese-aesthetic-medicine', id, 'Exam room / Bonita Springs') },
  { file: 'atam/inside-bonita-retail.jpg', alt: 'The skincare wall at Bonita Springs', apply: (p, id) => inside(p, 'anne-therese-aesthetic-medicine', id, 'Skincare / Bonita Springs') },
]

async function founder(p: Payload, slug: string, data: Record<string, unknown>) {
  const f = (await p.find({ collection: 'founders', where: { slug: { equals: slug } }, limit: 1, depth: 0 })).docs[0]
  if (f) await p.update({ collection: 'founders', id: f.id, data: data as never })
}

async function cta(p: Payload, label: string, slug: string, id: number) {
  const l = (await p.find({ collection: 'locations', where: { slug: { equals: slug } }, limit: 1, depth: 0 })).docs[0]
  if (l) await p.create({ collection: 'cta-images', data: { label, image: id, location: l.id, active: true } as never })
}

async function inside(p: Payload, slug: string, id: number, caption: string) {
  const b = (await p.find({ collection: 'brands', where: { slug: { equals: slug } }, limit: 1, depth: 0 })).docs[0] as unknown as Doc | undefined
  if (b) await p.update({ collection: 'brands', id: b.id, data: { inside: [...((b.inside as object[]) || []), { image: id, caption }] } as never })
}

async function gallery(p: Payload, slug: string, id: number, kind: string, caption = '') {
  const l = (await p.find({ collection: 'locations', where: { slug: { equals: slug } }, limit: 1, depth: 0 })).docs[0] as unknown as Doc | undefined
  if (l) await p.update({ collection: 'locations', id: l.id, data: { gallery: [...((l.gallery as object[]) || []), { image: id, kind, caption }] } as never })
}

/** Locations that exist but were never in the Webflow import. Created once, then the CMS owns them. */
async function ensureLocations(p: Payload) {
  const ra = (await p.find({ collection: 'brands', where: { slug: { equals: 'refined-aesthetics' } }, limit: 1, depth: 0 })).docs[0]
  const have = (await p.find({ collection: 'locations', where: { slug: { equals: 'refined-aesthetics-winchester' } }, limit: 1, depth: 0 })).docs[0]
  if (!ra || have) return
  const loc = await p.create({ collection: 'locations', data: {
    brand: ra.id, city: 'Winchester', state: 'VA', zip: '22601', address1: '8 W Fairfax Ln', lat: 39.1872, lng: -78.1648, phone: '(540) 323-7254',
    origin: 'tuck-in', formerName: 'Blossom Medical', slug: 'refined-aesthetics-winchester', live: true,
  } as never })
  await p.create({ collection: 'tuck-ins', data: { formerName: 'Blossom Medical', brand: ra.id, kind: 'location', location: loc.id, city: 'Winchester', state: 'VA', slug: 'blossom-medical', live: true } as never })
  p.logger.info('locations: created Refined at Blossom, Winchester')
}

async function location(p: Payload, slug: string, data: Record<string, unknown>) {
  const l = (await p.find({ collection: 'locations', where: { slug: { equals: slug } }, limit: 1, depth: 0 })).docs[0]
  if (l) await p.update({ collection: 'locations', id: l.id, data: data as never })
}

async function brand(p: Payload, slug: string, patch: (b: Doc) => Record<string, unknown>) {
  const b = (await p.find({ collection: 'brands', where: { slug: { equals: slug } }, limit: 1, depth: 0 })).docs[0] as unknown as Doc | undefined
  if (b) await p.update({ collection: 'brands', id: b.id, data: patch(b) as never })
}

const rich = (ps: string[]) => ({ root: { type: 'root', direction: 'ltr', format: '', indent: 0, version: 1, children: ps.map((t) => ({ type: 'paragraph', direction: 'ltr', format: '', indent: 0, version: 1, textFormat: 0, children: [{ type: 'text', text: t, detail: 0, format: 0, mode: 'normal', style: '', version: 1 }] })) } })

/** Refined at Blossom: name, visit details and the Joined chapter. Runs once (skips when the chapter has a headline), after the photo placements. */
async function blossom(p: Payload) {
  const slug = 'refined-aesthetics-winchester'
  const l = (await p.find({ collection: 'locations', where: { slug: { equals: slug } }, limit: 1, depth: 0 })).docs[0]
  const tk = (await p.find({ collection: 'tuck-ins', where: { slug: { equals: 'blossom-medical' } }, limit: 1, depth: 0 })).docs[0]
  if (!l || !tk || tk.chapter?.headline) return
  const sarah = (await p.find({ collection: 'founders', where: { slug: { equals: 'sarah-safa' } }, limit: 1, depth: 0 })).docs[0]
  await p.update({ collection: 'locations', id: l.id, data: {
    name: 'Refined at Blossom', googlePlaceId: 'ChIJt5r4LWjvtYkRSpe-zSufxk4',
    hours: [{ days: 'Mon to Fri', time: '8am to 4:30pm' }, { days: 'Sat, Sun', time: 'Closed' }],
    arrivalNote: 'Free parking near the entrance, just off West Fairfax Lane. Ground floor, just inside the main entrance.',
    story: rich([
      'Blossom began in a single treatment room, offered by two physician friends who had one to spare. Dr. Lynn Nieman, a board-certified anesthesiologist, had come to aesthetics while a riding fall kept her out of the operating room for twelve weeks.',
      'She named the practice for the Apple Blossom Festival, the week each spring when Winchester closes its streets for parades and opens its yards to neighbors. Blossom still sponsors festival events, local teams and a local cancer charity. The practice sits in Old Town, a few steps off the walking mall, down the street from George Washington’s old office.',
    ]),
    milestones: [{ when: 'Jul 2026', line: 'Blossom Medical joins Refined Aesthetics as Refined at Blossom.' }, { when: 'Sep 2026', line: 'Launch celebration in Winchester.' }],
    quote: { text: 'We are only getting better. We are not changing.', source: 'Dr. Lynn Nieman, interview 00:18:33' },
  } as never })
  await p.update({ collection: 'tuck-ins', id: tk.id, data: {
    closed: '2026-07-01T00:00:00.000Z',
    chapter: {
      headline: 'First she trained here. Now it is one practice.',
      intro: 'Dr. Lynn Nieman opened Blossom Medical in Old Town Winchester in a single borrowed treatment room. Some of her first hands-on injectables training was with Sarah Safa of Refined Aesthetics, an hour away in Leesburg. Years later Sarah called with an idea, and in 2026 the two practices became one: Refined at Blossom.',
      pair: [
        { name: 'Dr. Lynn Nieman, MD', line: 'Founder / Blossom Medical', photo: (l as unknown as { lead?: { photo?: number } }).lead?.photo ?? null, quote: 'She is one of the first people that I heard say community over competition.', source: 'Interview 00:13:07 / on Sarah' },
        { name: 'Sarah Safa, MS, PA-C', line: 'Founder / Refined Aesthetics', photo: (sarah?.headshot as number | undefined) ?? null, quote: 'Our goal is to continue to inspire and motivate and elevate each other.', source: 'Interview 00:04:09 / on Blossom' },
      ],
      kept: [
        { label: 'The name', title: 'Blossom stays in it', line: 'Lynn named Blossom for Winchester’s Apple Blossom Festival. It is still on the door.', quote: 'I wanted the namesake to be a nod to the people and the place which are at the heart of what we do.', source: 'Dr. Lynn Nieman, 00:07:13' },
        { label: 'The physician', title: 'Dr. Nieman stays', line: 'Same physician, same team, now with Refined’s training and protocols behind them.', quote: 'I’m not leaving.', source: 'Dr. Lynn Nieman, 00:18:33' },
        { label: 'The patients', title: 'Same building, same number', line: '8 W Fairfax Ln and (540) 323-7254. Appointments booked before the change still stand.' },
      ],
    },
  } as never })
  p.logger.info('locations: Refined at Blossom content set')
}

/** Location order within a brand (opening order). Only fills locations that have no order yet, so admin edits stand. */
const ORDER: Record<string, string[]> = {
  'anne-therese-aesthetic-medicine': ['Lewis Center', 'Gahanna', 'Cape Coral', 'Bonita Springs'],
  'esthetics-center': ['El Dorado Hills', 'Rocklin', 'Sacramento', 'Fair Oaks'],
  'holden-timeless-beauty': ['San Marcos', 'San Diego', 'Carlsbad', 'Fallbrook'],
  'williams-center': ['Latham', 'Saratoga Springs'],
  'mint-needle': ['Middletown', 'Lewes', 'Greenville'],
  'flawless-medspa-wellness': ['East Albuquerque', 'West Albuquerque', 'Flawless at Bair'], // Menaul Blvd, Taylor Ranch, then the Bair tuck-in (8810 Holly Ave NE, Ste F), matched by location name
  'rn-esthetics': ['Salem', 'Lynnfield', 'Newburyport', 'Boston'],
  'preva': ['Encinitas', 'Denver'],
}
async function orderLocations(p: Payload) {
  for (const [slug, cities] of Object.entries(ORDER)) {
    const b = (await p.find({ collection: 'brands', where: { slug: { equals: slug } }, limit: 1, depth: 0 })).docs[0]
    if (!b) continue
    const locs = (await p.find({ collection: 'locations', where: { brand: { equals: b.id } }, limit: 50, depth: 0 })).docs
    for (const l of locs) {
      const order = (cities.indexOf(l.city) + 1) || (cities.indexOf(l.name || '') + 1)
      if (order && l.order == null) await p.update({ collection: 'locations', id: l.id, data: { order } as never })
    }
  }
}

export async function placeMedia(p: Payload) {
  await ensureLocations(p)
  for (const x of PLACEMENTS) {
    const name = 'placed-' + x.file.replace(/\//g, '-')
    const have = await p.find({ collection: 'media', where: { filename: { equals: name } }, limit: 1, depth: 0 })
    if (have.docs.length) continue
    try {
      const data = fs.readFileSync(path.join(dir, x.file))
      const m = await p.create({ collection: 'media', data: { alt: x.alt }, file: { data, mimetype: 'image/jpeg', name, size: data.length } })
      await x.apply(p, m.id as number)
      p.logger.info(`media: placed ${x.file}`)
    } catch (e) { p.logger.warn(`media: ${x.file} skipped (${(e as Error).message})`) }
  }
  await blossom(p)
  await orderLocations(p)
}
