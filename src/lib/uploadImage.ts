'use server'

import { createClient } from '@/lib/supabase/server'

type UploadResult = { ok: true; url: string } | { ok: false; error: string }

export async function uploadImage(formData: FormData): Promise<UploadResult> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { ok: false, error: 'Non autorisé' }

  const file = formData.get('file') as File | null
  if (!file) return { ok: false, error: 'Aucun fichier' }

  const ext = file.name.split('.').pop() ?? 'jpg'
  const path = `${crypto.randomUUID()}.${ext}`

  const buffer = Buffer.from(await file.arrayBuffer())

  const { error } = await supabase.storage
    .from('images')
    .upload(path, buffer, { contentType: file.type, upsert: false })

  if (error) return { ok: false, error: error.message }

  const { data } = supabase.storage.from('images').getPublicUrl(path)
  return { ok: true, url: data.publicUrl }
}
