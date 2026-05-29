'use server'

import { createClient } from '@/lib/supabase/server'
import { sanitizeName } from '@/lib/sanitize'
import { revalidatePath } from 'next/cache'

export type ImageEntry = {
  name: string
  url: string
  size: number
  createdAt: string
  usageCount: number
  usedIn: string[]
}

export async function getImageLibrary(): Promise<ImageEntry[]> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return []

  const { data: files, error } = await supabase.storage.from('images').list('', {
    limit: 1000,
    sortBy: { column: 'created_at', order: 'desc' },
  })
  if (error || !files) return []

  const filesWithUrls = files
    .filter((f) => f.name !== '.emptyFolderPlaceholder')
    .map((f) => ({
      name: f.name,
      url: supabase.storage.from('images').getPublicUrl(f.name).data.publicUrl,
      size: (f.metadata?.size as number) ?? 0,
      createdAt: f.created_at ?? '',
    }))

  const urlIndex = new Map(filesWithUrls.map((f) => [f.url, f.name]))
  const usageCounts = new Map<string, string[]>()

  function track(url: string, label: string) {
    if (!url || !urlIndex.has(url)) return
    if (!usageCounts.has(url)) usageCounts.set(url, [])
    usageCounts.get(url)!.push(label)
  }

  function scanBlocks(blocks: unknown, label: string) {
    if (!Array.isArray(blocks)) return
    for (const b of blocks) {
      if (b?.type === 'image' && typeof b.contenu === 'string') track(b.contenu, label)
    }
  }

  const [paysRes, racesRes, ryximusRes, magieRes] = await Promise.all([
    supabase.from('pays').select('slug, data'),
    supabase.from('races').select('slug, data'),
    supabase.from('ryximus').select('slug, data'),
    supabase.from('magie').select('data').eq('id', 1).maybeSingle(),
  ])

  for (const row of paysRes.data ?? []) {
    const d = row.data as Record<string, unknown>
    scanBlocks(d.blocks, `Pays · ${row.slug}`)
  }
  for (const row of racesRes.data ?? []) {
    const d = row.data as Record<string, unknown>
    scanBlocks(d.blocks, `Race · ${row.slug}`)
    if (typeof d.image === 'string') track(d.image, `Race · ${row.slug} (avatar)`)
  }
  for (const row of ryximusRes.data ?? []) {
    const d = row.data as Record<string, unknown>
    scanBlocks(d.blocks, `Ryximus · ${row.slug}`)
    if (typeof d.image === 'string') track(d.image, `Ryximus · ${row.slug} (avatar)`)
  }
  if (magieRes.data?.data) {
    const d = magieRes.data.data as Record<string, unknown>
    scanBlocks(d.blocks, 'Magie')
  }

  return filesWithUrls.map((f) => ({
    ...f,
    usageCount: (usageCounts.get(f.url) ?? []).length,
    usedIn: usageCounts.get(f.url) ?? [],
  }))
}

export async function deleteImageFile(name: string): Promise<{ ok: boolean; error?: string }> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { ok: false, error: 'Non autorisé' }

  const { error } = await supabase.storage.from('images').remove([name])
  if (error) return { ok: false, error: error.message }
  return { ok: true }
}

export async function renameImageFile(
  oldName: string,
  rawNewName: string,
): Promise<{ ok: boolean; newName?: string; newUrl?: string; error?: string }> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { ok: false, error: 'Non autorisé' }

  // Preserve original extension if user didn't type one
  const oldExt = oldName.includes('.') ? '.' + oldName.split('.').pop()!.toLowerCase() : ''
  const hasExt = /\.[a-z0-9]+$/i.test(rawNewName)
  const nameToSanitize = hasExt ? rawNewName : rawNewName + oldExt
  const newName = sanitizeName(nameToSanitize) // no random suffix on rename

  if (!newName || newName === oldName) return { ok: false, error: 'Nom identique ou invalide' }

  const oldUrl = supabase.storage.from('images').getPublicUrl(oldName).data.publicUrl

  // Download → re-upload → delete (more reliable than move() which needs extra storage policies)
  const { data: blob, error: downloadError } = await supabase.storage.from('images').download(oldName)
  if (downloadError || !blob) return { ok: false, error: downloadError?.message ?? 'Téléchargement impossible' }

  const buffer = Buffer.from(await blob.arrayBuffer())
  const { error: uploadError } = await supabase.storage
    .from('images')
    .upload(newName, buffer, { contentType: blob.type, upsert: false })
  if (uploadError) return { ok: false, error: uploadError.message }

  const { data: removed, error: deleteError } = await supabase.storage.from('images').remove([oldName])
  const deleteFailed = deleteError || !removed || removed.length === 0
  if (deleteFailed) {
    // Clean up the copy we just made to avoid leaving duplicates
    await supabase.storage.from('images').remove([newName])
    return {
      ok: false,
      error: deleteError
        ? 'Suppression impossible : ' + deleteError.message
        : 'Suppression bloquée par les politiques RLS — activez DELETE pour les utilisateurs authentifiés dans Storage > Policies.',
    }
  }

  const newUrl = supabase.storage.from('images').getPublicUrl(newName).data.publicUrl

  // Update all database references from oldUrl → newUrl
  const [paysRes, racesRes, ryximusRes, magieRes] = await Promise.all([
    supabase.from('pays').select('slug, data, updated_at'),
    supabase.from('races').select('slug, data, updated_at'),
    supabase.from('ryximus').select('slug, data, updated_at'),
    supabase.from('magie').select('data, updated_at').eq('id', 1).maybeSingle(),
  ])

  function replaceInBlocks(blocks: unknown): { changed: boolean; result: unknown } {
    if (!Array.isArray(blocks)) return { changed: false, result: blocks }
    let changed = false
    const result = blocks.map((b) => {
      if (b?.type === 'image' && b.contenu === oldUrl) { changed = true; return { ...b, contenu: newUrl } }
      return b
    })
    return { changed, result }
  }

  const updates: PromiseLike<unknown>[] = []

  for (const row of paysRes.data ?? []) {
    const d = row.data as Record<string, unknown>
    const { changed, result } = replaceInBlocks(d.blocks)
    if (changed) updates.push(supabase.from('pays').update({ data: { ...d, blocks: result } }).eq('slug', row.slug))
  }

  for (const row of racesRes.data ?? []) {
    const d = row.data as Record<string, unknown>
    const { changed: bc, result } = replaceInBlocks(d.blocks)
    const imageChanged = d.image === oldUrl
    if (bc || imageChanged) {
      updates.push(supabase.from('races').update({
        data: { ...d, blocks: result, ...(imageChanged ? { image: newUrl } : {}) },
      }).eq('slug', row.slug))
    }
  }

  for (const row of ryximusRes.data ?? []) {
    const d = row.data as Record<string, unknown>
    const { changed: bc, result } = replaceInBlocks(d.blocks)
    const imageChanged = d.image === oldUrl
    if (bc || imageChanged) {
      updates.push(supabase.from('ryximus').update({
        data: { ...d, blocks: result, ...(imageChanged ? { image: newUrl } : {}) },
      }).eq('slug', row.slug))
    }
  }

  if (magieRes.data?.data) {
    const d = magieRes.data.data as Record<string, unknown>
    const { changed, result } = replaceInBlocks(d.blocks)
    if (changed) updates.push(supabase.from('magie').update({ data: { ...d, blocks: result } }).eq('id', 1))
  }

  await Promise.all(updates)

  revalidatePath('/', 'layout')

  return { ok: true, newName, newUrl }
}
