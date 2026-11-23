/** Shared by server loaders and client views (no server-only imports). */
export type Team = 'Clinical' | 'Patient experience' | 'Leadership' | 'Marketing' | 'Operations'
export const TEAMS: Team[] = ['Clinical', 'Patient experience', 'Leadership', 'Marketing', 'Operations']

export type RoleBrand = { id: number; n: string; slug: string; name: string; href: string; intro: string; img: string }
export type Role = {
  slug: string; href: string; title: string; team: Team
  brand: RoleBrand; locId: number | null; locHref: string; city: string; state: string; where: string; remote: boolean
  posted: string; ago: string; date: string; applyUrl: string; ref: string; desc: string
}

/** Team from the title. Marketing and leadership win over clinical words ("Marketing Director", "Clinic Manager"). */
export function teamOf(title: string): Team {
  const t = title.toLowerCase()
  if (/marketing|social media|content|brand/.test(t)) return 'Marketing'
  if (/manager|director|lead\b|supervisor|head of/.test(t)) return 'Leadership'
  if (/nurse|injector|practitioner|\blpn\b|\brn\b|medical assistant|esthetician|aesthetician|physician|\bpa-?c?\b|surgeon|clinical/.test(t)) return 'Clinical'
  if (/coordinator|guest|front desk|concierge|reception|patient/.test(t)) return 'Patient experience'
  return 'Operations'
}

