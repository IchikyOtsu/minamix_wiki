import { createClient } from '@/lib/supabase/server'
import { pays as staticPays, type Pays } from '@/data/pays'
import { races as staticRaces, type Race } from '@/data/races'
import { ryximus as staticRyximus, type Ryximus } from '@/data/ryximus'
import { magie as staticMagie } from '@/data/magie'
import type { Block } from '@/types/blocks'

type MagieData = typeof staticMagie
type AnnexeData = { label: string; titre: string; contenu: string }
export type AnnexeWithTs = AnnexeData & { updatedAt: string | null }

function isConfigured(): boolean {
  return !!(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)
}

function makeBlock(titre: string, contenu: unknown, type: Block['type'] = 'text'): Block | null {
  if (!contenu || typeof contenu !== 'string' || !contenu.trim()) return null
  return { id: titre.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, ''), type, titre, contenu }
}

function migratePaysData(slug: string, data: unknown): Pays {
  const d = data as Record<string, unknown>
  const isDraft = d.isDraft === true
  if (Array.isArray(d.blocks)) return { slug, nom: String(d.nom ?? ''), couleur: String(d.couleur ?? '#747474'), blocks: d.blocks as Block[], isDraft }
  const blocks: Block[] = [
    makeBlock('Géographie', d.geographie),
    makeBlock('Histoire', d.histoire),
    makeBlock('Politique interne', d.politiqueInterne),
    makeBlock('Politique externe', d.politiqueExterne),
    makeBlock('Mode de vie', d.modeDeVie),
    makeBlock('Traditions', d.traditions, 'list'),
    makeBlock('Société', d.societe),
    makeBlock('Magie', d.magie),
  ].filter((b): b is Block => b !== null)
  return { slug, nom: String(d.nom ?? ''), couleur: String(d.couleur ?? '#747474'), blocks, isDraft }
}

function migrateRaceData(slug: string, data: unknown): Race {
  const d = data as Record<string, unknown>
  const isDraft = d.isDraft === true
  if (Array.isArray(d.blocks)) {
    return {
      slug,
      nom: String(d.nom ?? ''),
      couleur: String(d.couleur ?? '#747474'),
      image: String(d.image ?? ''),
      population: Number(d.population ?? 0),
      esperanceVie: String(d.esperanceVie ?? ''),
      blocks: d.blocks as Block[],
      isDraft,
    }
  }
  const blocks: Block[] = [
    makeBlock('Description', d.description),
    makeBlock('Histoire', d.histoire),
    makeBlock('Apparence physique', d.physique),
    makeBlock('Magie', d.magie),
    makeBlock('Société', d.societe),
  ].filter((b): b is Block => b !== null)
  return {
    slug,
    nom: String(d.nom ?? ''),
    couleur: String(d.couleur ?? '#747474'),
    image: String(d.image ?? ''),
    population: Number(d.population ?? 0),
    esperanceVie: String(d.esperanceVie ?? ''),
    blocks,
    isDraft,
  }
}

// ── Pays ──────────────────────────────────────────────────────────────────────

export async function getAllPays(): Promise<Pays[]> {
  if (!isConfigured()) return staticPays
  try {
    const supabase = await createClient()
    const { data } = await supabase.from('pays').select('slug, data')
    if (!data?.length) return staticPays
    return data.map((row) => migratePaysData(row.slug, row.data))
  } catch {
    return staticPays
  }
}

export async function getPays(slug: string): Promise<{ data: Pays | null; updatedAt: string | null }> {
  if (!isConfigured()) {
    const data = staticPays.find((p) => p.slug === slug) ?? null
    return { data, updatedAt: null }
  }
  try {
    const supabase = await createClient()
    const { data: row } = await supabase.from('pays').select('slug, data, updated_at').eq('slug', slug).single()
    if (!row) {
      return { data: staticPays.find((p) => p.slug === slug) ?? null, updatedAt: null }
    }
    return {
      data: migratePaysData(row.slug, row.data),
      updatedAt: row.updated_at ?? null,
    }
  } catch {
    return { data: staticPays.find((p) => p.slug === slug) ?? null, updatedAt: null }
  }
}

// ── Races ─────────────────────────────────────────────────────────────────────

export async function getAllRaces(): Promise<Race[]> {
  if (!isConfigured()) return staticRaces
  try {
    const supabase = await createClient()
    const { data } = await supabase.from('races').select('slug, data')
    if (!data?.length) return staticRaces
    return data.map((row) => migrateRaceData(row.slug, row.data))
  } catch {
    return staticRaces
  }
}

export async function getRace(slug: string): Promise<{ data: Race | null; updatedAt: string | null }> {
  if (!isConfigured()) {
    const data = staticRaces.find((r) => r.slug === slug) ?? null
    return { data, updatedAt: null }
  }
  try {
    const supabase = await createClient()
    const { data: row } = await supabase.from('races').select('slug, data, updated_at').eq('slug', slug).single()
    if (!row) {
      return { data: staticRaces.find((r) => r.slug === slug) ?? null, updatedAt: null }
    }
    return {
      data: migrateRaceData(row.slug, row.data),
      updatedAt: row.updated_at ?? null,
    }
  } catch {
    return { data: staticRaces.find((r) => r.slug === slug) ?? null, updatedAt: null }
  }
}

// ── Ryximus ───────────────────────────────────────────────────────────────────

export async function getAllRyximus(): Promise<Ryximus[]> {
  if (!isConfigured()) return staticRyximus
  try {
    const supabase = await createClient()
    const { data } = await supabase.from('ryximus').select('slug, data')
    if (!data?.length) return staticRyximus
    return data.map((row) => ({ slug: row.slug, ...(row.data as Omit<Ryximus, 'slug'>) }))
  } catch {
    return staticRyximus
  }
}

export async function getRyximus(slug: string): Promise<{ data: Ryximus | null; updatedAt: string | null }> {
  if (!isConfigured()) {
    const data = staticRyximus.find((r) => r.slug === slug) ?? null
    return { data, updatedAt: null }
  }
  try {
    const supabase = await createClient()
    const { data: row } = await supabase.from('ryximus').select('slug, data, updated_at').eq('slug', slug).single()
    if (!row) {
      return { data: staticRyximus.find((r) => r.slug === slug) ?? null, updatedAt: null }
    }
    return {
      data: { slug: row.slug, ...(row.data as Omit<Ryximus, 'slug'>) },
      updatedAt: row.updated_at ?? null,
    }
  } catch {
    return { data: staticRyximus.find((r) => r.slug === slug) ?? null, updatedAt: null }
  }
}

// ── Magie ─────────────────────────────────────────────────────────────────────

export async function getMagie(): Promise<{ data: MagieData; updatedAt: string | null }> {
  if (!isConfigured()) return { data: staticMagie, updatedAt: null }
  try {
    const supabase = await createClient()
    const { data: row } = await supabase.from('magie').select('data, updated_at').eq('id', 1).single()
    if (!row?.data) return { data: staticMagie, updatedAt: null }
    return { data: row.data as MagieData, updatedAt: row.updated_at ?? null }
  } catch {
    return { data: staticMagie, updatedAt: null }
  }
}

// ── Annexes ───────────────────────────────────────────────────────────────────

const DEFAULT_LABELS = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H']

export async function getAllAnnexes(): Promise<AnnexeWithTs[]> {
  if (!isConfigured()) {
    return DEFAULT_LABELS.map((label) => ({ label, titre: `Annexe ${label}`, contenu: '', updatedAt: null }))
  }
  try {
    const supabase = await createClient()
    const { data } = await supabase.from('annexes').select('label, data, updated_at')
    if (!data?.length) {
      return DEFAULT_LABELS.map((label) => ({ label, titre: `Annexe ${label}`, contenu: '', updatedAt: null }))
    }
    return data.map((row) => ({
      label: row.label,
      ...(row.data as Omit<AnnexeData, 'label'>),
      updatedAt: row.updated_at ?? null,
    }))
  } catch {
    return DEFAULT_LABELS.map((label) => ({ label, titre: `Annexe ${label}`, contenu: '', updatedAt: null }))
  }
}

// ── Current user ──────────────────────────────────────────────────────────────

export async function getCurrentUser() {
  if (!isConfigured()) return null
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    return user
  } catch {
    return null
  }
}
