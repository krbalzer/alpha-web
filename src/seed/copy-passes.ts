/**
 * Copy passes: reviewed rewrites of partner-page copy (Alpha Site Copy Inventory, one tab per brand).
 * Each pass runs on deploy, but only while the brand still shows the copy it replaces, so a later CMS edit always wins.
 * Quotes are verbatim from the founder interview transcripts; the source sits next to each one.
 */
import type { Payload } from 'payload'

type Node = Record<string, unknown>
const text = (t: string): Node => ({ type: 'text', text: t, format: 0, detail: 0, mode: 'normal', style: '', version: 1 })
const para = (t: string): Node => ({ type: 'paragraph', children: [text(t)], direction: 'ltr', format: '', indent: 0, version: 1, textFormat: 0 })
const prose = (ps: string[]) => ({ root: { type: 'root', children: ps.map(para), direction: 'ltr', format: '', indent: 0, version: 1 } }) as never
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const plain = (rt: any): string => (rt?.root?.children || []).map((p: any) => (p.children || []).map((c: any) => c.text || '').join('')).join('\n')

type Pass = {
  ptr: number
  /** the pass applies only while this is still the practice headline */
  was: string
  brand: Record<string, unknown>
  founder?: { name: string; wasIncludes: string; bio: string[] }
}

const REFINED_WHY = [
  "Sarah went into partnership to keep running Refined her way, with more behind it. We took on “a lot of the extra admin and, you know, monetary things,” and she started telling us her plans before the deal even closed. The second floor came out of those conversations.",
  "Then came the part she had been teaching toward for years. Dr. Lynn Nieman, who founded Blossom Medical in Winchester, first learned to inject in Sarah's classes and never forgot what Sarah told her about collaboration over competition. Jackie Shank, one of Refined's own providers, lives in Winchester and drove an hour each way to Leesburg to work beside Sarah. Partnership let the two practices become one. Blossom became Refined at Blossom, Dr. Nieman and her team stayed, and Jackie now practices close to home.",
]

const PASSES: Pass[] = [
  {
    ptr: 3, // Refined Aesthetics, reviewed Nov 25 2026
    was: "Educate first. Say no when it's right.",
    brand: {
      intro: 'Refined Aesthetics in Leesburg, Virginia: a non-surgical practice in a restored building in the historic district, now with a second location in Winchester. Consultations are free.',
      established: 2014, // "ten years ago" in the 2024 interview (ra4 00:55)
      insideTitle: 'From Church Street to the Shenandoah Valley',
      practice: {
        headline: 'A practice that explains everything before it treats anything',
        body: prose([
          "At Refined Aesthetics the consultation is the main event. It's free, and patients leave knowing what's available, what each option does and whether they need it at all. Sarah Safa opened the practice more than ten years ago in a restored building in Leesburg's historic district. The building was preserved rather than remade, and that's how the team wants patients to feel walking out.",
          "It's non-surgical only, so nobody waits next to a surgery patient. Sarah says that's why more men come here than to most practices in Northern Virginia. Injectors are hired for bedside manner and trained in-house before they consult anyone, with a focus on serving, not selling. The team travels as far as Brazil and Canada to learn treatments before they reach the US. Patients come from young Arlington professionals to Middleburg horse country.",
        ]),
      },
      quote: {
        text: 'I knew that by joining a bigger and better team, we could make it happen together, and we could impact more people, more patients, more businesses, more educational platforms.',
        source: 'Sarah Safa, founder interview (ra3) 00:04:05',
      },
      why: {
        body: prose([
          // refined4 00:26; ra3 03:08, 05:15, 06:41
          REFINED_WHY[0],
          // MSM 081 04:57 to 06:21, 08:06
          REFINED_WHY[1],
        ]),
      },
      // Capacity / Demand / Depth. Google rating is added live from the location syncs. Botox units and treatment rooms wait on ops numbers.
      stats: [
        { kicker: 'Capacity', value: '150', label: 'Patients a week', rows: [{ k: 'Providers', v: '7' }, { k: 'Locations', v: '2' }] },
        { kicker: 'Demand', value: '6.5k', label: 'Social followers', rows: [{ k: 'Years in Leesburg', v: '10+' }] },
        { kicker: 'Depth', value: '37', label: 'Treatments', rows: [{ k: 'Skincare items a year', v: '1.5k' }, { k: 'Filler syringes a year', v: '2.1k' }] },
      ],
    },
    founder: {
      name: 'Sarah Safa',
      wasIncludes: 'Eighteen years later',
      bio: [
        'A Virginia native, born in Charlottesville and raised outside Richmond, Sarah planned on orthopedics until an elective rotation in plastic surgery out of PA school. More than eighteen years in, she still calls aesthetics happy medicine.',
        'She also teaches, training other providers inside practices across the country, and has written on why the specialty needs more education as it grows.',
      ],
    },
  },
  {
    ptr: 2, // Holden Timeless Beauty, now HTB Aesthetics; reviewed Nov 25 2026
    was: 'Built for San Diegans, by one.',
    brand: {
      name: 'HTB Aesthetics',
      short: 'HTB Aesthetics',
      intro: 'HTB Aesthetics, formerly Holden Timeless Beauty: Dr. Amanda Holden’s practice in Carlsbad, Fallbrook, San Diego and San Marcos, California.',
      insideTitle: 'North County to Mission Valley',
      practice: {
        headline: 'An ER doctor’s precision, in rooms built like a San Diego getaway',
        body: prose([
          // AmandaHTBExperience 06:50, 08:18 to 09:32; AmandaHTBExperince2 01:00 to 01:52, 02:32 to 03:04
          "HTB Aesthetics is built around the five senses. Walk into any of the four locations and there's Miami Beach chill on the speakers, a signature scent, bubble blue treatment rooms with chandeliers to look up at during a treatment, a Coronado Bridge painting and a bathroom styled like a nightclub. Dr. Amanda Holden designed it after the places San Diegans already love, from a trendy coffee shop to their favorite stylist, so it feels like their place at every address. She'll also tell you HTB stands for have the best, and hold time back.",
          // AmandaStory1 02:02; AmandaHTBExperience 09:32 to 10:18; Amanda Conclude 01:27, 01:50
          "Behind the fun is emergency medicine. Dr. Holden trained the emergency providers she'd worked beside into the HTB team, and consultations are custom: a menu of options, no pressure, whether a patient wants one thing or all of them. HTB is also a teaching practice, with a level one to three injector academy and a Sculptra Center of Excellence.",
        ]),
      },
      quote: {
        text: 'When you have partners that you can lean on when you have ups and downs, it makes it not feel so bad.',
        source: 'Dr. Amanda Holden, Great Friends E065 00:26:46',
      },
      why: {
        headline: "It's a love for aesthetics, a love for making the field absolutely phenomenal, and that's what I wanna be a part of.", // AmandaAlpha1 01:59
        body: prose([
          // AmandaAlpha1 01:45, 03:34, 04:59
          "Dr. Holden took her mentor's advice to explore every possibility and take every negotiation to the very end, and she took a lot of them there before choosing us. She met John when they both taught business at The Aesthetics Show, and her first question was about her team: whether they'd be allowed to grow the way she saw them growing. The team, the locations and the San Diego feel stayed. The rebrand to HTB Aesthetics came later, built with our in-house marketing team.",
          // AmandaAlpha1 06:33
          'What she wanted from the rest of the network, she explains with pie: “if you think of a business like a pie, we might be great at one piece of the pie but not great at the other. And now if we’re putting all of our slices together in one joint pie of business, that’s when you really see true acceleration to the moon.”',
        ]),
      },
      stats: [
        { kicker: 'Capacity', value: '220', label: 'Patients a week', rows: [{ k: 'Providers', v: '13' }, { k: 'Locations', v: '4' }, { k: 'Treatment rooms', v: '18' }] },
        { kicker: 'Demand', value: '103k', label: 'Social followers', rows: [{ k: 'In San Diego County since', v: '2017' }] },
        { kicker: 'Depth', value: '17', label: 'Treatments', rows: [{ k: 'Skincare items a year', v: '2.1k' }, { k: 'Botox units a year', v: '47.1k' }, { k: 'Filler syringes a year', v: '2.7k' }] },
      ],
    },
    founder: {
      name: 'Amanda Holden',
      wasIncludes: 'learned the business of aesthetics from a physician who ran fifteen clinics',
      bio: [
        // AmandaHTBExperience 00:02, 01:07; AmandaHTBExperince2 00:47; AmandaStory1 02:02
        'A board certified emergency physician who has lived in San Diego since she was nine, Dr. Holden was a single mom in medical school and chose emergency medicine over a surgical residency to stay close to her kids. She learned the business of aesthetics from a physician who ran fifteen clinics across Southern California, opened a single room in 2017 injecting friends and family, and trained with injectors across the country.',
        // AmandaHTBExperience 04:19, 05:18; Amanda Conclude 00:48; GF E065
        'She has studied every side of the business since, from people and finance to marketing, and leads HTB as its visionary alongside an integrator who runs clinical operations. Her goal is to reach 33 million people through the practice, the stage and the teams she trains. She also hosts Holding Time Back, one of the shows in the Alpha podcast network.',
      ],
    },
  },
  {
    ptr: 5, // the Laser Center of Marin; reviewed Nov 25 2026. No Kevin Jones anywhere (off the site); no medicine-first framing; nothing about who runs it now.
    was: 'The NorCal natural look, for twenty years.',
    brand: {
      intro: 'The Laser Center of Marin in Corte Madera, California: lasers, injectables and skin care at the same Tamalpais Drive address since 2003.',
      insideTitle: 'From Tamalpais Drive to the bay',
      practice: {
        headline: 'Tender loving care, at the same address since 2003',
        body: prose([
          // lasercenter-denise1 02:22, 04:17, 08:19
          'The Laser Center of Marin opened in Corte Madera in 2003 and has never moved. The Jones family built it by hand: family built the treatment rooms, ran the front desk, answered phones and stocked the shelves. Denise Jones, a Marin native and nurse practitioner, named it: The Laser Center, TLC, tender loving care.',
          // lasercenter-denise1 08:36, 09:26
          "Marin patients sail, hike and bike most of the year, and Denise says they're very aware of protecting their skin. The practice started with laser hair removal and IPL; injectables followed and are now the bigger part of the work. Some of the team have been here more than fifteen years, and some patients have seen the same provider for just as long.",
        ]),
      },
      quote: {
        text: "The people that live here in Marin are very well educated, and they're very aware of protecting their skin.",
        source: 'Denise Jones, founder interview (lasercenter-denise1) 00:09:26',
      },
      why: {
        headline: 'Before we ever met John, we listened to a lot of his podcast.', // lasercenter-denise1 12:32
        body: prose([
          // lasercenter-denise1 11:24
          "Over twenty years Denise watched a lot of places open in Marin. To stay competitive, she and her family wanted “a partner that would be able to provide us with the resources to continue to grow and support the culture and environment that we’ve created with our current staff.” The name, the team and the building stayed. In 2025 we rebuilt the brand around what was already there: patients who've been coming for years, and a practice a few minutes from the bay.",
        ]),
      },
      // weekly patients, treatment rooms and Botox volume wait on ops (the old 223k a week was broken)
      stats: [
        { kicker: 'Capacity', value: '6', label: 'Providers', rows: [{ k: 'Locations', v: '1' }] },
        { kicker: 'Demand', value: '652', label: 'Social followers', rows: [{ k: 'At the same address since', v: '2003' }] },
        { kicker: 'Depth', value: '1.3k', label: 'Filler syringes a year', rows: [{ k: 'Skincare items a year', v: '2.8k' }] },
      ],
    },
    founder: {
      name: 'Denise Jones',
      wasIncludes: 'while Kevin ran the business',
      bio: [
        // lasercenter-denise1 02:22, 08:19 to 08:36
        "A Marin native, Denise spent thirty years as a nurse practitioner at a large hospital before opening the practice with her family in 2003. She's never moved away: she grew up in Marin and still calls it the most beautiful place in all the world.",
      ],
    },
  },
  {
    ptr: 6, // Williams Center, reviewed Nov 25 2026. Three businesses in Latham (plastic surgery, Saratoga Hair, Rejuva Center), Rejuva also in Saratoga Springs. Surgeons unnamed (poaching).
    was: 'A destination practice, by design.',
    brand: {
      intro: "The Williams Center in Latham, NY: plastic surgery for face and body, Saratoga Hair and the Rejuva Center under one roof, plus a Rejuva Center in Saratoga Springs.",
      established: 1992, // "just about thirty one years ago" in the 2023 interview (MixPre-696 00:25); matches Webflow
      insideTitle: 'The Capital Region, from Latham to Saratoga Springs',
      practice: {
        headline: 'The practice people travel to Albany for',
        body: prose([
          // williams2 01:09 to 02:42; MixPre-696 02:36
          "The Williams Center is three practices in one building in Latham, New York. The plastic surgery practice covers the face and body, Saratoga Hair handles surgical hair restoration, and the Rejuva Center does non-surgical treatments, with a second Rejuva Center in Saratoga Springs. Surgery happens on site, in a surgery center approved and inspected by Medicare and New York State. Each practice is led by specialists who stay in their lane, the plan Dr. Edwin Williams built it around. The building sits beside the Albany airport so patients can fly in, and half or more of them come from out of town.",
          // williams2 04:53 to 05:41, 06:02 to 07:15, 09:07, 11:34 to 12:17; MixPre-696 33:24
          "Rejuva is a medical facility first, with physicians on site, a medical director involved in industry clinical trials, and facial plastic surgeons in the building to handle anything that comes up. At Saratoga Hair, a double board certified facial plastic surgeon is responsible for every graft, from the first to the last, where many centers hand that work to technicians. The reconstructive practice stays open, skin cancer and insurance cases included, because Dr. Williams calls it the practice's goodwill in the community. The doctors teach as well as operate: they speak at the major meetings, and the practice trains two facial plastic surgery fellows a year.",
        ]),
      },
      quote: {
        text: "I didn't work this hard to get where we're at to walk away from it.",
        source: 'Dr. Edwin Williams, founder interview (MixPre-696) 00:32:00',
      },
      why: {
        body: prose([
          // MixPre-696 15:36, 16:48 to 17:06, 19:30 to 20:26, 20:54 to 21:38, 31:23; williams2 09:44
          "Dr. Williams talked with plenty of partners before us. In his words, “I've probably kissed 20 toads.” One offered to take over all the management so he could just do surgery, which he didn't think was realistic. What he needed protected was his team, many of them family and some with him since the 1990s: “I wanna make sure we're taking care of our family as we grow with the Alpha family.” The name, the surgeons and the way each center runs stayed. With us he gets the time and capital for things he always knew were possible, from training more surgeons to do what he does to teaching what he's learned across the network.",
        ]),
      },
    },
    founder: {
      name: 'Edwin F. Williams',
      wasIncludes: 'Dr. Williams still does the facelift surgery he teaches',
      bio: [
        // MixPre-696 01:42, 03:54 to 04:31; williams2 01:36, 08:59 to 09:26
        "A facial plastic surgeon for three decades and past president of the American Academy of Facial Plastic and Reconstructive Surgery, Dr. Williams started out when cosmetic dermatology wasn't yet a phrase and facial plastics meant surgery. He spent a couple of years trying to build his specialist model with a local hospital, got bogged down in bureaucracy, and built it himself at 38, beside the airport. He still does the facelift surgery he teaches, and insists his surgeons speak at the meetings they attend.",
        // MixPre-696 33:24 to 34:56, 25:22, 31:23
        "His fellowship, approved when he was 38, is one of about sixty in the country and now takes two fellows a year from roughly fifty applicants. The Williams Center is a family business, too: his daughter and son-in-law work there, alongside staff who have been with him since the 1990s.",
      ],
    },
  },
]

// lasercenter-denise1 02:22, 03:27, 08:19 to 08:36
const LCM_FOUNDERS_BIO = ["Kevin and Denise Jones opened the Laser Center of Marin in 2003. Kevin had spent twenty years in Silicon Valley tech and always wanted his own business; Denise, a Marin native, had spent thirty years as a nurse practitioner at a large hospital. He ran the business side and she ran the clinical side. Denise grew up in Marin and still calls it the most beautiful place in all the world."]

/** Refined, Nov 25 v3: Why Alpha tells the Blossom story instead of the takeover line. Applies only over the v2 text. */
async function refinedWhyV3(p: Payload) {
  const b = (await p.find({ collection: 'brands', where: { ptr: { equals: 3 } }, limit: 1, depth: 0, overrideAccess: true })).docs[0] as unknown as Record<string, any> | undefined
  if (!b || !plain(b.why?.body).startsWith('Sarah had heard plenty')) return
  await p.update({ collection: 'brands', id: b.id, overrideAccess: true, data: { why: { ...b.why, body: prose(REFINED_WHY) } } as never })
  p.logger.info('copy: PTR 3 Why Alpha v3')
}

/** LCM, Nov 25: one shared founder entry for Kevin and Denise Jones (both long exited), built from Denise's record so her quotes stay. */
async function lcmFounders(p: Payload) {
  const f = (await p.find({ collection: 'founders', where: { name: { equals: 'Denise Jones' } }, limit: 1, depth: 0, overrideAccess: true })).docs[0] as unknown as Record<string, any> | undefined
  if (!f || !plain(f.bio).startsWith('A Marin native, Denise spent thirty years')) return
  await p.update({ collection: 'founders', id: f.id, overrideAccess: true, data: {
    name: 'Kevin and Denise Jones',
    slug: 'kevin-and-denise-jones',
    kind: 'business',
    status: 'former',
    credentials: null,
    headline: 'Co-founders',
    bio: prose(LCM_FOUNDERS_BIO),
    milestones: [{ year: 2003, line: 'Open the Laser Center of Marin.' }],
  } as never })
  p.logger.info('copy: PTR 5 founders joined')
}

/** Williams, Nov 25: place stories for both addresses (hair moved to Latham in Jan 2024; Saratoga Springs is the Rejuva Center). Each applies only over the old seeded text. */
const WILLIAMS_PLACES = [
  { slug: 'williams-center-latham-ny', was: 'Built by Dr. Williams at 38', not: 'all three practices', story: "Built by Dr. Williams at 38 beside Albany International Airport, the Latham building holds all three practices: plastic surgery with its own surgery center, Saratoga Hair since 2024, and the Rejuva Center. It's a family business in a family town: Albany, not Manhattan, where people put down roots and the same patients come back for decades." },
  { slug: 'williams-center-saratoga-springs', was: 'Saratoga Hair Transplant Center, part of', name: 'Rejuva Center', story: "The Rejuva Center's own location in Saratoga Springs: the old hair center, remodeled and reopened in September 2025, with Sciton lasers since June 2026." },
]
async function williamsPlaces(p: Payload) {
  for (const w of WILLIAMS_PLACES) {
    const l = (await p.find({ collection: 'locations', where: { slug: { equals: w.slug } }, limit: 1, depth: 0, overrideAccess: true })).docs[0] as unknown as Record<string, any> | undefined
    const t = plain(l?.story)
    if (!l || !t.startsWith(w.was) || (w.not && t.includes(w.not))) continue
    await p.update({ collection: 'locations', id: l.id, overrideAccess: true, data: { story: prose([w.story]), ...(w.name && !l.name ? { name: w.name } : {}) } as never })
    p.logger.info(`copy: ${w.slug} story`)
  }
}

/** Refined, Nov 25 follow-up: "Years in Leesburg" under Demand, for a database that already took the pass above. Skips once a person edits the stats. */
async function refinedYears(p: Payload) {
  const b = (await p.find({ collection: 'brands', where: { ptr: { equals: 3 } }, limit: 1, depth: 0, overrideAccess: true })).docs[0] as unknown as Record<string, any> | undefined
  const st = b?.stats as { kicker?: string; value?: string; label?: string; rows?: { k?: string; v?: string }[] }[] | undefined
  if (!b || !st || st.length !== 3 || st[0]?.label !== 'Patients a week' || (st[1]?.rows || []).length) return
  st[1].rows = [{ k: 'Years in Leesburg', v: '10+' }]
  await p.update({ collection: 'brands', id: b.id, overrideAccess: true, data: { stats: st } as never })
}

export async function applyCopyPasses(p: Payload) {
  await refinedYears(p)
  await refinedWhyV3(p)
  await lcmFounders(p)
  await williamsPlaces(p)
  for (const pass of PASSES) {
    const b = (await p.find({ collection: 'brands', where: { ptr: { equals: pass.ptr } }, limit: 1, depth: 0, overrideAccess: true })).docs[0] as unknown as Record<string, any> | undefined
    if (!b || b.practice?.headline !== pass.was) continue
    const x = pass.brand as Record<string, any>
    await p.update({ collection: 'brands', id: b.id, overrideAccess: true, data: {
      ...x,
      practice: { ...(b.practice || {}), ...(x.practice || {}) },
      why: { ...(b.why || {}), ...(x.why || {}) },
    } as never })
    if (pass.founder) {
      const f = (await p.find({ collection: 'founders', where: { name: { equals: pass.founder.name } }, limit: 1, depth: 0, overrideAccess: true })).docs[0]
      if (f && plain(f.bio).includes(pass.founder.wasIncludes)) await p.update({ collection: 'founders', id: f.id, overrideAccess: true, data: { bio: prose(pass.founder.bio) } })
    }
    p.logger.info(`copy: PTR ${pass.ptr} updated`)
  }
}
