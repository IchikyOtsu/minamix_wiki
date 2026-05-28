'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import type { Pays } from '@/data/pays'

type SaveResult = { ok: true } | { ok: false; conflict: boolean; error?: string }

export async function upsertPays(slug: string, fields: Omit<Pays, 'slug'>, loadedAt: string | null = null): Promise<SaveResult> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { ok: false, conflict: false, error: 'Non autorisé' }

  if (loadedAt) {
    const { data: current } = await supabase.from('pays').select('updated_at').eq('slug', slug).maybeSingle()
    if (current?.updated_at && current.updated_at !== loadedAt) {
      return { ok: false, conflict: true }
    }
  }

  const { error } = await supabase
    .from('pays')
    .upsert({ slug, data: fields, updated_at: new Date().toISOString() })

  if (error) return { ok: false, conflict: false, error: error.message }

  revalidatePath(`/pays/${slug}`)
  revalidatePath('/pays')
  revalidatePath('/')
  return { ok: true }
}

export async function deletePays(slug: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Non autorisé')

  const { error } = await supabase.from('pays').delete().eq('slug', slug)
  if (error) throw new Error(error.message)

  revalidatePath('/pays')
  revalidatePath('/')
}
