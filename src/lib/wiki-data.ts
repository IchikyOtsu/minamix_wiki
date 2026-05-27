import { createClient } from '@/lib/supabase/server'
import { pays as staticPays, type Pays } from '@/data/pays'
import { races as staticRaces, type Race } from '@/data/races'
import { ryximus as staticRyximus, type Ryximus } from '@/data/ryximus'
import { magie as staticMagie } from '@/data/magie'

type MagieData = typeof staticMagie
type AnnexeData = { label: string; titre: string; contenu: string }

function isConfigured(): boolean {
  return !!(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)
}

// ── Pays ──────────────────────────────────────────────────────────────────────

export async function getAllPays(): Promise<Pays[]> {
  if (!isConfigured()) return staticPays
  try {
    const supabase = await createClient()
    const { data } = await supabase.from('pays').select('slug, data')
    if (!data?.length) return staticPays
    return data.map((row) => ({ slug: row.slug, ...(row.data as Omit<Pays, 'slug'>) }))
  } catch {
    return staticPays
  }
}

export async function getPays(slug: string): Promise<Pays | null> {
  if (!isConfigured()) return staticPays.find((p) => p.slug === slug) ?? null
  try {
    const supabase = await createClient()
    const { data } = await supabase.from('pays').select('slug, data').eq('slug', slug).single()
    if (!data) return staticPays.find((p) => p.slug === slug) ?? null
    return { slug: data.slug, ...(data.data as Omit<Pays, 'slug'>) }
  } catch {
    return staticPays.find((p) => p.slug === slug) ?? null
  }
}

// ── Races ─────────────────────────────────────────────────────────────────────

export async function getAllRaces(): Promise<Race[]> {
  if (!isConfigured()) return staticRaces
  try {
    const supabase = await createClient()
    const { data } = await supabase.from('races').select('slug, data')
    if (!data?.length) return staticRaces
    return data.map((row) => ({ slug: row.slug, ...(row.data as Omit<Race, 'slug'>) }))
  } catch {
    return staticRaces
  }
}

export async function getRace(slug: string): Promise<Race | null> {
  if (!isConfigured()) return staticRaces.find((r) => r.slug === slug) ?? null
  try {
    const supabase = await createClient()
    const { data } = await supabase.from('races').select('slug, data').eq('slug', slug).single()
    if (!data) return staticRaces.find((r) => r.slug === slug) ?? null
    return { slug: data.slug, ...(data.data as Omit<Race, 'slug'>) }
  } catch {
    return staticRaces.find((r) => r.slug === slug) ?? null
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

export async function getRyximus(slug: string): Promise<Ryximus | null> {
  if (!isConfigured()) return staticRyximus.find((r) => r.slug === slug) ?? null
  try {
    const supabase = await createClient()
    const { data } = await supabase.from('ryximus').select('slug, data').eq('slug', slug).single()
    if (!data) return staticRyximus.find((r) => r.slug === slug) ?? null
    return { slug: data.slug, ...(data.data as Omit<Ryximus, 'slug'>) }
  } catch {
    return staticRyximus.find((r) => r.slug === slug) ?? null
  }
}

// ── Magie ─────────────────────────────────────────────────────────────────────

export async function getMagie(): Promise<MagieData> {
  if (!isConfigured()) return staticMagie
  try {
    const supabase = await createClient()
    const { data } = await supabase.from('magie').select('data').eq('id', 1).single()
    if (!data?.data) return staticMagie
    return data.data as MagieData
  } catch {
    return staticMagie
  }
}

// ── Annexes ───────────────────────────────────────────────────────────────────

const DEFAULT_LABELS = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H']

export async function getAllAnnexes(): Promise<AnnexeData[]> {
  if (!isConfigured()) {
    return DEFAULT_LABELS.map((label) => ({ label, titre: `Annexe ${label}`, contenu: '' }))
  }
  try {
    const supabase = await createClient()
    const { data } = await supabase.from('annexes').select('label, data')
    if (!data?.length) {
      return DEFAULT_LABELS.map((label) => ({ label, titre: `Annexe ${label}`, contenu: '' }))
    }
    return data.map((row) => ({ label: row.label, ...(row.data as Omit<AnnexeData, 'label'>) }))
  } catch {
    return DEFAULT_LABELS.map((label) => ({ label, titre: `Annexe ${label}`, contenu: '' }))
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
