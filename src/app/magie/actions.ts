'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

type MagieSection = { titre: string; contenu: string }
type MagieAffinite = { element: string; description: string }
type MagieFields = { intro: string; sections: MagieSection[]; affinites: MagieAffinite[] }
type SaveResult = { ok: true } | { ok: false; conflict: boolean; error?: string }

export async function upsertMagie(fields: MagieFields, loadedAt: string | null = null): Promise<SaveResult> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { ok: false, conflict: false, error: 'Non autorisé' }

  if (loadedAt) {
    const { data: current } = await supabase.from('magie').select('updated_at').eq('id', 1).maybeSingle()
    if (current?.updated_at && current.updated_at !== loadedAt) {
      return { ok: false, conflict: true }
    }
  }

  const { error } = await supabase
    .from('magie')
    .upsert({ id: 1, data: fields, updated_at: new Date().toISOString() })

  if (error) return { ok: false, conflict: false, error: error.message }

  revalidatePath('/magie')
  return { ok: true }
}
