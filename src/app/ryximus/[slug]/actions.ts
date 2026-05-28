'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import type { Ryximus } from '@/data/ryximus'

type SaveResult = { ok: true } | { ok: false; conflict: boolean; error?: string }

export async function upsertRyximus(slug: string, fields: Omit<Ryximus, 'slug'>, loadedAt: string | null = null): Promise<SaveResult> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { ok: false, conflict: false, error: 'Non autorisé' }

  if (loadedAt) {
    const { data: current } = await supabase.from('ryximus').select('updated_at').eq('slug', slug).maybeSingle()
    if (current?.updated_at && current.updated_at !== loadedAt) {
      return { ok: false, conflict: true }
    }
  }

  const { error } = await supabase
    .from('ryximus')
    .upsert({ slug, data: fields, updated_at: new Date().toISOString() })

  if (error) return { ok: false, conflict: false, error: error.message }

  revalidatePath(`/ryximus/${slug}`)
  revalidatePath('/ryximus')
  revalidatePath('/')
  return { ok: true }
}

export async function deleteRyximus(slug: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Non autorisé')

  const { error } = await supabase.from('ryximus').delete().eq('slug', slug)
  if (error) throw new Error(error.message)

  revalidatePath('/ryximus')
  revalidatePath('/')
}
