'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import type { Race } from '@/data/races'

export async function upsertRace(slug: string, fields: Omit<Race, 'slug'>) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Non autorisé')

  const { error } = await supabase
    .from('races')
    .upsert({ slug, data: fields, updated_at: new Date().toISOString() })

  if (error) throw new Error(error.message)

  revalidatePath(`/races/${slug}`)
  revalidatePath('/races')
  revalidatePath('/')
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
