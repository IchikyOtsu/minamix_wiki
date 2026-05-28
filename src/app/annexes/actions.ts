'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

type SaveResult = { ok: true } | { ok: false; conflict: boolean; error?: string }

export async function upsertAnnexe(label: string, titre: string, contenu: string, loadedAt: string | null = null): Promise<SaveResult> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { ok: false, conflict: false, error: 'Non autorisé' }

  if (loadedAt) {
    const { data: current } = await supabase.from('annexes').select('updated_at').eq('label', label).maybeSingle()
    if (current?.updated_at && current.updated_at !== loadedAt) {
      return { ok: false, conflict: true }
    }
  }

  const { error } = await supabase
    .from('annexes')
    .upsert({ label, data: { titre, contenu }, updated_at: new Date().toISOString() })

  if (error) return { ok: false, conflict: false, error: error.message }

  revalidatePath('/annexes')
  return { ok: true }
}

export async function deleteAnnexe(label: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Non autorisé')

  const { error } = await supabase.from('annexes').delete().eq('label', label)
  if (error) throw new Error(error.message)
  revalidatePath('/annexes')
}
