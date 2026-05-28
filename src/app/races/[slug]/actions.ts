'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import type { Race } from '@/data/races'

type SaveResult = { ok: true } | { ok: false; conflict: boolean; error?: string }

export async function upsertRace(slug: string, fields: Omit<Race, 'slug'>, loadedAt: string | null = null): Promise<SaveResult> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { ok: false, conflict: false, error: 'Non autorisé' }

  if (loadedAt) {
    const { data: current } = await supabase.from('races').select('updated_at').eq('slug', slug).maybeSingle()
    if (current?.updated_at && current.updated_at !== loadedAt) {
      return { ok: false, conflict: true }
    }
  }

  const { error } = await supabase
    .from('races')
    .upsert({ slug, data: fields, updated_at: new Date().toISOString() })

  if (error) return { ok: false, conflict: false, error: error.message }

  revalidatePath(`/races/${slug}`)
  revalidatePath('/races')
  revalidatePath('/')
  return { ok: true }
}

export async function deleteRace(slug: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Non autorisé')

  const { error } = await supabase.from('races').delete().eq('slug', slug)
  if (error) throw new Error(error.message)

  revalidatePath('/races')
  revalidatePath('/')
}
