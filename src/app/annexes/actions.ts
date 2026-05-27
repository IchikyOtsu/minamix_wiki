'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function upsertAnnexe(label: string, titre: string, contenu: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Non autorisé')

  const { error } = await supabase
    .from('annexes')
    .upsert({ label, data: { titre, contenu }, updated_at: new Date().toISOString() })

  if (error) throw new Error(error.message)
  revalidatePath('/annexes')
}

export async function deleteAnnexe(label: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Non autorisé')

  const { error } = await supabase.from('annexes').delete().eq('label', label)
  if (error) throw new Error(error.message)
  revalidatePath('/annexes')
}
