'use client'

import { useState } from 'react'
import dynamic from 'next/dynamic'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { TableOfContents } from '@/components/TableOfContents'
import type { Pays } from '@/data/pays'
import type { Block } from '@/types/blocks'
import { BlockView } from '@/components/BlockView'

const BlockEditor = dynamic(
  () => import('@/components/BlockEditor').then(m => ({ default: m.BlockEditor })),
  { ssr: false, loading: () => <div className="space-y-3 animate-pulse"><div className="h-44 bg-gray-100 rounded-xl" /><div className="h-12 bg-gray-100 rounded-xl" /></div> }
) as React.ComponentType<{ blocks: Block[]; onChange: (b: Block[]) => void; onUploading?: (u: boolean) => void }>
import { DeleteConfirm } from '@/components/DeleteConfirm'
import { ConflictBanner } from '@/components/ConflictBanner'
import { upsertPays, deletePays } from './actions'

interface Props {
  pays: Pays
  allPays: Pays[]
  isLoggedIn: boolean
  updatedAt: string | null
}

export function PaysDetailClient({ pays: initial, allPays, isLoggedIn, updatedAt }: Props) {
  const [editing, setEditing] = useState(false)
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [conflict, setConflict] = useState(false)
  const [draft, setDraft] = useState<Pays>(initial)
  const [loadedAt, setLoadedAt] = useState(updatedAt)
  const router = useRouter()

  async function handleSave() {
    setSaving(true)
    setConflict(false)
    const { slug, ...fields } = draft
    const result = await upsertPays(slug, fields, loadedAt)
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
    const result = await upsertPays(slug, fields, null)
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
                  onCancel={() => { setConflict(false); setDraft(initial); setEditing(false); router.refresh() }}
                />
              )}
              <DeleteConfirm
                label="Supprimer la page"
                onConfirm={async () => {
                  await deletePays(initial.slug)
                  router.push('/pays')
                  router.refresh()
                }}
              />
              <button onClick={() => { setDraft(initial); setEditing(false); setConflict(false) }} className="btn-wiki btn-wiki-ghost">
                Annuler
              </button>
              <button type="button" onClick={() => setDraft(d => ({ ...d, isDraft: !d.isDraft }))} className={`btn-wiki btn-wiki-ghost ${draft.isDraft ? 'border-amber-300 text-amber-700 hover:bg-amber-50' : ''}`}>
                {draft.isDraft ? '⚠️ Brouillon' : '◎ Publié'}
              </button>
              <button onClick={handleSave} disabled={saving || uploading} className="btn-wiki btn-wiki-primary disabled:opacity-60">
                {saving ? 'Sauvegarde…' : uploading ? 'Upload en cours…' : '✓ Sauvegarder'}
              </button>
            </>
          ) : (
            <button onClick={() => setEditing(true)} className="btn-wiki btn-wiki-primary">
              ✏️ Modifier cette page
            </button>
          )}
        </div>
      )}

      {isLoggedIn && draft.isDraft && (
        <div className="mb-6 p-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-700 text-sm flex items-center gap-2">
          <span>⚠️</span><span>Cette page est en brouillon — invisible aux visiteurs non connectés.</span>
        </div>
      )}

      <div className="rounded-2xl p-8 mb-8 text-white shadow-lg" style={{ backgroundColor: draft.couleur }}>
        {editing ? (
          <div className="space-y-3">
            <div className="flex gap-3 items-center flex-wrap">
              <input
                value={draft.nom}
                onChange={(e) => setDraft((d) => ({ ...d, nom: e.target.value }))}
                className="text-3xl font-bold bg-white/20 border border-white/40 rounded-lg px-3 py-1.5 text-white placeholder-white/60 flex-1 min-w-40 focus:outline-none focus:bg-white/30"
                placeholder="Nom du pays"
                style={{ fontFamily: 'var(--font-heading)' }}
              />
              <label className="flex items-center gap-2 text-sm opacity-80">
                Couleur
                <input
                  type="color"
                  value={draft.couleur}
                  onChange={(e) => setDraft((d) => ({ ...d, couleur: e.target.value }))}
                  className="w-10 h-8 rounded cursor-pointer border-0 bg-transparent"
                />
              </label>
            </div>
          </div>
        ) : (
          <>
            <h1 className="text-4xl font-bold mb-2 text-left" style={{ fontFamily: 'var(--font-heading)' }}>
              {draft.nom}
            </h1>
            <p className="opacity-75 text-sm">
              <Link href="/pays" className="underline hover:no-underline">← Tous les pays</Link>
            </p>
          </>
        )}
      </div>

      {editing ? (
        <BlockEditor
          blocks={draft.blocks}
          onChange={(blocks) => setDraft((d) => ({ ...d, blocks }))}
          onUploading={setUploading}
        />
      ) : (
        <div className="space-y-5">
          {draft.blocks.map((b) => <BlockView key={b.id} block={b} />)}
          {draft.blocks.length === 0 && (
            <p className="text-gray-400 italic text-sm text-center py-8">Aucun contenu.{isLoggedIn ? ' Clique sur Modifier pour ajouter des blocs.' : ''}</p>
          )}
        </div>
      )}

      <TableOfContents blocks={draft.blocks} accentColor={draft.couleur} />

      <div className="mt-10 flex gap-3 flex-wrap">
        {allPays.filter((x) => x.slug !== draft.slug).map((other) => (
          <Link key={other.slug} href={`/pays/${other.slug}`} className="rounded-lg px-4 py-2 text-white text-sm shadow hover:shadow-md hover:-translate-y-0.5 transition-all" style={{ backgroundColor: other.couleur }}>
            {other.nom} →
          </Link>
        ))}
      </div>
    </div>
  )
}
