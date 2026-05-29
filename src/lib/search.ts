'use server'

import { getAllPays, getAllRaces, getAllRyximus, getMagie, getCurrentUser } from '@/lib/wiki-data'
import type { Block } from '@/types/blocks'

export type SearchResult = {
  type: 'Pays' | 'Race' | 'Ryximus' | 'Magie'
  href: string
  nom: string
  blockTitre?: string
  snippet: string
}

function stripHtml(html: string): string {
  return html.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim()
}

function excerpt(text: string, q: string, len = 140): string {
  const lower = text.toLowerCase()
  const idx = lower.indexOf(q)
  if (idx === -1) return text.slice(0, len) + (text.length > len ? '…' : '')
  const start = Math.max(0, idx - 50)
  const end = Math.min(text.length, idx + q.length + 90)
  return (start > 0 ? '…' : '') + text.slice(start, end) + (end < text.length ? '…' : '')
}

function matchBlocks(
  blocks: Block[],
  q: string,
  type: SearchResult['type'],
  nom: string,
  href: string,
): SearchResult[] {
  const out: SearchResult[] = []
  for (const b of blocks) {
    if (b.type === 'image') continue
    const titleMatch = (b.titre ?? '').toLowerCase().includes(q)
    const body = stripHtml(b.contenu)
    const bodyMatch = body.toLowerCase().includes(q)
    if (titleMatch || bodyMatch) {
      out.push({ type, href, nom, blockTitre: b.titre || undefined, snippet: excerpt(body, q) })
      if (out.length >= 3) break // cap per page
    }
  }
  return out
}

export async function searchWiki(rawQuery: string): Promise<SearchResult[]> {
  // Sanitize & gate
  const q = rawQuery.trim().toLowerCase().replace(/[<>"']/g, '').slice(0, 100)
  if (q.length < 2) return []

  const user = await getCurrentUser()
  const results: SearchResult[] = []

  const [pays, races, ryximus, { data: magie }] = await Promise.all([
    getAllPays(), getAllRaces(), getAllRyximus(), getMagie(),
  ])

  for (const p of pays) {
    if (p.isDraft && !user) continue
    if (p.nom.toLowerCase().includes(q)) {
      results.push({ type: 'Pays', href: `/pays/${p.slug}`, nom: p.nom, snippet: '' })
    } else {
      results.push(...matchBlocks(p.blocks, q, 'Pays', p.nom, `/pays/${p.slug}`))
    }
  }

  for (const r of races) {
    if (r.isDraft && !user) continue
    if (r.nom.toLowerCase().includes(q)) {
      results.push({ type: 'Race', href: `/races/${r.slug}`, nom: r.nom, snippet: '' })
    } else {
      results.push(...matchBlocks(r.blocks, q, 'Race', r.nom, `/races/${r.slug}`))
    }
  }

  for (const r of ryximus) {
    if (r.isDraft && !user) continue
    if (r.nom.toLowerCase().includes(q)) {
      results.push({ type: 'Ryximus', href: `/ryximus/${r.slug}`, nom: r.nom, snippet: '' })
    } else {
      results.push(...matchBlocks(r.blocks ?? [], q, 'Ryximus', r.nom, `/ryximus/${r.slug}`))
    }
  }

  const magieAny = magie as Record<string, unknown>
  if (!magieAny.isDraft || user) {
    results.push(...matchBlocks((magieAny.blocks as Block[]) ?? [], q, 'Magie', 'La Magie', '/magie'))
  }

  return results.slice(0, 25)
}
