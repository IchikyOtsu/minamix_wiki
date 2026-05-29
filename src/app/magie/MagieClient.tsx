'use client'

import { useState } from 'react'
import dynamic from 'next/dynamic'
import { TableOfContents } from '@/components/TableOfContents'
import { useRouter } from 'next/navigation'
import { BlockView } from '@/components/BlockView'
import { ConflictBanner } from '@/components/ConflictBanner'
import { upsertMagie } from './actions'
import type { Block } from '@/types/blocks'

const BlockEditor = dynamic(
  () => import('@/components/BlockEditor').then(m => ({ default: m.BlockEditor })),
  { ssr: false, loading: () => <div className="space-y-3 animate-pulse"><div className="h-44 bg-gray-100 rounded-xl" /><div className="h-12 bg-gray-100 rounded-xl" /></div> }
) as React.ComponentType<{ blocks: Block[]; onChange: (b: Block[]) => void; onUploading?: (u: boolean) => void }>

type Section = { titre: string; contenu: string }
type Affinite = { element: string; description: string }
type MagieData = { intro?: string; sections: Section[]; affinites: Affinite[]; blocks?: Block[]; isDraft?: boolean }

interface Props {
  data: MagieData
  isLoggedIn: boolean
  updatedAt: string | null
}

function initBlocks(data: MagieData): Block[] {
  if (data.blocks?.length) return data.blocks
  // Migrate legacy sections to blocks on first load
  return (data.sections ?? [])
    .filter((s) => s.titre || s.contenu)
    .map((s) => ({ id: crypto.randomUUID(), type: 'text' as const, titre: s.titre, contenu: s.contenu }))
}

export function MagieClient({ data: initial, isLoggedIn, updatedAt }: Props) {
  const [editing, setEditing] = useState(false)
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [conflict, setConflict] = useState(false)
  const [draft, setDraft] = useState<MagieData>({ ...initial, blocks: initBlocks(initial) })
  const [loadedAt, setLoadedAt] = useState(updatedAt)
  const router = useRouter()

  async function handleSave() {
    setSaving(true)
    setConflict(false)
    const result = await upsertMagie(draft, loadedAt)
    if (result.ok) {
      setLoadedAt(result.updatedAt)
      setEditing(false)
      router.refresh()
    } else if (result.conflict) {
      setConflict(true)
    } else {
      alert('Erreur lors de la sauvegarde.')
    }
    setSaving(false)
  }

  async function handleForceSave() {
    setSaving(true)
    const result = await upsertMagie(draft, null)
    if (result.ok) {
      setLoadedAt(result.updatedAt)
      setConflict(false)
      setEditing(false)
      router.refresh()
    } else {
      alert('Erreur lors de la sauvegarde.')
    }
    setSaving(false)
  }

  return (
    <div>
      {isLoggedIn && (
        <div className="wiki-edit-bar">
          {editing ? (
            <>
              {conflict && (
                <ConflictBanner
                  saving={saving}
                  onForce={handleForceSave}
                  onCancel={() => { setConflict(false); setDraft({ ...initial, blocks: initBlocks(initial) }); setEditing(false); router.refresh() }}
                />
              )}
              <button onClick={() => { setDraft({ ...initial, blocks: initBlocks(initial) }); setEditing(false); setConflict(false) }} className="btn-wiki btn-wiki-ghost">Annuler</button>
              <button type="button" onClick={() => setDraft(d => ({ ...d, isDraft: !d.isDraft }))} className={`btn-wiki btn-wiki-ghost ${draft.isDraft ? 'border-amber-300 text-amber-700 hover:bg-amber-50' : ''}`}>
                {draft.isDraft ? '⚠️ Brouillon' : '◎ Publié'}
              </button>
              <button onClick={handleSave} disabled={saving || uploading} className="btn-wiki btn-wiki-primary disabled:opacity-60">
                {saving ? 'Sauvegarde…' : uploading ? 'Upload en cours…' : '✓ Sauvegarder'}
              </button>
            </>
          ) : (
            <button onClick={() => setEditing(true)} className="btn-wiki btn-wiki-primary">✏️ Modifier cette page</button>
          )}
        </div>
      )}

      {isLoggedIn && draft.isDraft && (
        <div className="mb-6 p-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-700 text-sm flex items-center gap-2">
          <span>⚠️</span><span>Cette page est en brouillon — invisible aux visiteurs non connectés.</span>
        </div>
      )}

      <h1 className="text-4xl font-bold mb-6" style={{ fontFamily: 'var(--font-heading)' }}>La Magie</h1>

      {/* Affinités Élémentaires — structured data, kept outside blocks */}
      {(draft.affinites?.length > 0 || editing) && (
        <div className="wiki-card p-6 mb-8">
          <h2 className="wiki-section-title">Affinités Élémentaires</h2>
          {editing ? (
            <div className="space-y-2">
              {draft.affinites.map((a, i) => (
                <div key={i} className="flex gap-2 items-center">
                  <input
                    value={a.element}
                    onChange={(e) => setDraft((d) => {
                      const af = [...d.affinites]; af[i] = { ...af[i], element: e.target.value }; return { ...d, affinites: af }
                    })}
                    className="w-28 border border-gray-200 rounded-lg px-2 py-1.5 font-semibold text-sm focus:outline-none focus:border-blue-400"
                    placeholder="Élément"
                  />
                  <input
                    value={a.description}
                    onChange={(e) => setDraft((d) => {
                      const af = [...d.affinites]; af[i] = { ...af[i], description: e.target.value }; return { ...d, affinites: af }
                    })}
                    className="flex-1 border border-gray-200 rounded-lg px-2 py-1.5 text-sm focus:outline-none focus:border-blue-400"
                    placeholder="Description"
                  />
                  <button
                    type="button"
                    onClick={() => setDraft((d) => ({ ...d, affinites: d.affinites.filter((_, j) => j !== i) }))}
                    className="btn-wiki btn-wiki-ghost text-red-500 hover:text-red-700 hover:bg-red-50"
                  >×</button>
                </div>
              ))}
              <button
                type="button"
                onClick={() => setDraft((d) => ({ ...d, affinites: [...d.affinites, { element: '', description: '' }] }))}
                className="btn-wiki btn-wiki-ghost text-sm mt-1"
              >+ Ajouter une affinité</button>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {draft.affinites.map((a) => (
                <div key={a.element} className="rounded-xl p-4 text-center border-2 border-gray-100 hover:border-[var(--gold)] transition-colors">
                  <div className="text-lg font-bold mb-1" style={{ fontFamily: 'var(--font-heading)' }}>{a.element}</div>
                  {a.description && <div className="text-xs text-gray-600">{a.description}</div>}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      <TableOfContents blocks={draft.blocks ?? []} />

      {/* All content via blocks */}
      {editing ? (
        <BlockEditor
          blocks={draft.blocks ?? []}
          onChange={(blocks) => setDraft((d) => ({ ...d, blocks }))}
          onUploading={setUploading}
        />
      ) : (
        <div className="space-y-5">
          {(draft.blocks ?? []).map((b) => <BlockView key={b.id} block={b} />)}
          {(draft.blocks ?? []).length === 0 && isLoggedIn && (
            <p className="text-gray-400 italic text-sm text-center py-8">Aucun contenu. Clique sur Modifier pour ajouter des blocs.</p>
          )}
        </div>
      )}
    </div>
  )
}
