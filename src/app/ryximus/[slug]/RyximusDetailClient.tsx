'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import type { Ryximus } from '@/data/ryximus'
import { BlockEditor } from '@/components/BlockEditor'
import { BlockView } from '@/components/BlockView'
import { DeleteConfirm } from '@/components/DeleteConfirm'
import { ConflictBanner } from '@/components/ConflictBanner'
import { upsertRyximus, deleteRyximus } from './actions'
import type { Block } from '@/types/blocks'

interface Props {
  ryximus: Ryximus
  allRyximus: Ryximus[]
  isLoggedIn: boolean
  updatedAt: string | null
}

function initBlocks(r: Ryximus): Block[] {
  if (r.blocks?.length) return r.blocks
  // Migrate legacy fields to blocks on first edit
  const blocks: Block[] = []
  if (r.personnalite?.trim())
    blocks.push({ id: crypto.randomUUID(), type: 'text', titre: 'Personnalité', contenu: r.personnalite })
  if (r.conditionPacte?.trim())
    blocks.push({ id: crypto.randomUUID(), type: 'text', titre: 'Condition du Pacte', contenu: r.conditionPacte })
  return blocks
}

export function RyximusDetailClient({ ryximus: initial, allRyximus, isLoggedIn, updatedAt }: Props) {
  const [editing, setEditing] = useState(false)
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [conflict, setConflict] = useState(false)
  const [draft, setDraft] = useState<Ryximus>({ ...initial, blocks: initBlocks(initial) })
  const [loadedAt, setLoadedAt] = useState(updatedAt)
  const router = useRouter()

  async function handleSave() {
    setSaving(true)
    setConflict(false)
    const { slug, ...fields } = draft
    const result = await upsertRyximus(slug, fields, loadedAt)
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
    const { slug, ...fields } = draft
    const result = await upsertRyximus(slug, fields, null)
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
              <DeleteConfirm
                label="Supprimer la page"
                onConfirm={async () => {
                  await deleteRyximus(initial.slug)
                  router.push('/ryximus')
                  router.refresh()
                }}
              />
              <button onClick={() => { setDraft({ ...initial, blocks: initBlocks(initial) }); setEditing(false); setConflict(false) }} className="btn-wiki btn-wiki-ghost">Annuler</button>
              <button onClick={handleSave} disabled={saving || uploading} className="btn-wiki btn-wiki-primary disabled:opacity-60">
                {saving ? 'Sauvegarde…' : uploading ? 'Upload en cours…' : '✓ Sauvegarder'}
              </button>
            </>
          ) : (
            <button onClick={() => setEditing(true)} className="btn-wiki btn-wiki-primary">✏️ Modifier cette page</button>
          )}
        </div>
      )}

      {/* Header */}
      <div className="rounded-2xl p-8 mb-8 text-white shadow-lg" style={{ backgroundColor: draft.couleur }}>
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
          <div>
            {editing ? (
              <div className="flex gap-3 items-center flex-wrap">
                <input
                  value={draft.nom}
                  onChange={(e) => setDraft((d) => ({ ...d, nom: e.target.value }))}
                  className="text-2xl font-bold bg-white/20 border border-white/40 rounded-lg px-3 py-1.5 text-white focus:outline-none flex-1 min-w-32"
                  style={{ fontFamily: 'var(--font-heading)' }}
                />
                <input type="color" value={draft.couleur} onChange={(e) => setDraft((d) => ({ ...d, couleur: e.target.value }))} className="w-10 h-8 rounded cursor-pointer border-0" title="Couleur" />
              </div>
            ) : (
              <>
                <h1 className="text-4xl font-bold mb-1 text-left" style={{ fontFamily: 'var(--font-heading)' }}>{draft.nom}</h1>
                <p className="text-sm opacity-75">
                  <Link href="/ryximus" className="underline hover:no-underline">← Tous les Ryximus</Link>
                </p>
              </>
            )}
          </div>
          <div className="text-right">
            {editing ? (
              <div className="space-y-1.5">
                <input value={draft.element} onChange={(e) => setDraft((d) => ({ ...d, element: e.target.value }))} className="border border-white/40 rounded px-2 py-1 bg-white/20 text-white text-right focus:outline-none block ml-auto" placeholder="Élément" />
                <select value={draft.genre} onChange={(e) => setDraft((d) => ({ ...d, genre: e.target.value as Ryximus['genre'] }))} className="border border-white/40 rounded px-2 py-1 bg-white/20 text-white focus:outline-none block ml-auto">
                  <option value="Masculin">Masculin</option>
                  <option value="Féminin">Féminin</option>
                </select>
              </div>
            ) : (
              <>
                <span className="text-2xl font-semibold opacity-90">{draft.element}</span>
                <div className="text-sm opacity-70 mt-1">{draft.genre}</div>
              </>
            )}
          </div>
        </div>
      </div>

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

      <div className="mt-10 flex gap-3 flex-wrap">
        {allRyximus.filter((x) => x.slug !== draft.slug).map((other) => (
          <Link key={other.slug} href={`/ryximus/${other.slug}`} className="rounded-full px-4 py-1.5 text-white text-sm shadow hover:shadow-md hover:-translate-y-0.5 transition-all" style={{ backgroundColor: other.couleur }}>
            {other.nom} · {other.element}
          </Link>
        ))}
      </div>
    </div>
  )
}
