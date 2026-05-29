'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import type { Race } from '@/data/races'
import { BlockEditor } from '@/components/BlockEditor'
import { BlockView } from '@/components/BlockView'
import { DeleteConfirm } from '@/components/DeleteConfirm'
import { ConflictBanner } from '@/components/ConflictBanner'
import { upsertRace, deleteRace } from './actions'

interface Props {
  race: Race
  allRaces: Race[]
  isLoggedIn: boolean
  updatedAt: string | null
}

export function RaceDetailClient({ race: initial, allRaces, isLoggedIn, updatedAt }: Props) {
  const [editing, setEditing] = useState(false)
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [conflict, setConflict] = useState(false)
  const [draft, setDraft] = useState<Race>(initial)
  const [loadedAt, setLoadedAt] = useState(updatedAt)
  const router = useRouter()

  async function handleSave() {
    setSaving(true)
    setConflict(false)
    const { slug, ...fields } = draft
    const result = await upsertRace(slug, fields, loadedAt)
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
    const result = await upsertRace(slug, fields, null)
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
                  await deleteRace(initial.slug)
                  router.push('/races')
                  router.refresh()
                }}
              />
              <button onClick={() => { setDraft(initial); setEditing(false); setConflict(false) }} className="btn-wiki btn-wiki-ghost">Annuler</button>
              <button onClick={handleSave} disabled={saving || uploading} className="btn-wiki btn-wiki-primary disabled:opacity-60">
                {saving ? 'Sauvegarde…' : uploading ? 'Upload en cours…' : '✓ Sauvegarder'}
              </button>
            </>
          ) : (
            <button onClick={() => setEditing(true)} className="btn-wiki btn-wiki-primary">✏️ Modifier cette page</button>
          )}
        </div>
      )}

      <div className="rounded-2xl p-8 mb-8 shadow-lg border border-black/5" style={{ backgroundColor: draft.couleur }}>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            {editing ? (
              <div className="flex gap-3 items-center flex-wrap">
                <input
                  value={draft.nom}
                  onChange={(e) => setDraft((d) => ({ ...d, nom: e.target.value }))}
                  className="text-2xl font-bold bg-white/50 border border-black/10 rounded-lg px-3 py-1.5 focus:outline-none flex-1 min-w-32"
                  style={{ fontFamily: 'var(--font-heading)' }}
                />
                <input type="color" value={draft.couleur} onChange={(e) => setDraft((d) => ({ ...d, couleur: e.target.value }))} className="w-10 h-8 rounded cursor-pointer border-0" title="Couleur" />
              </div>
            ) : (
              <>
                <h1 className="text-4xl font-bold mb-1 text-left" style={{ fontFamily: 'var(--font-heading)' }}>{draft.nom}</h1>
                <p className="text-sm text-gray-700">
                  <Link href="/races" className="underline hover:no-underline">← Toutes les races</Link>
                </p>
              </>
            )}
          </div>
          <div className="text-right text-sm">
            {editing ? (
              <div className="space-y-1.5">
                <input type="number" value={draft.population} onChange={(e) => setDraft((d) => ({ ...d, population: Number(e.target.value) }))} className="w-32 border border-black/10 rounded px-2 py-1 text-right bg-white/50 focus:outline-none block ml-auto" />
                <input value={draft.esperanceVie} onChange={(e) => setDraft((d) => ({ ...d, esperanceVie: e.target.value }))} className="w-40 border border-black/10 rounded px-2 py-1 bg-white/50 focus:outline-none block ml-auto" placeholder="Espérance de vie" />
              </div>
            ) : (
              <>
                <div className="font-semibold text-lg">{draft.population.toLocaleString('fr-FR')}</div>
                <div className="text-gray-700">habitants</div>
                <div className="mt-1 text-gray-700">Espérance de vie : {draft.esperanceVie}</div>
              </>
            )}
          </div>
        </div>
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

      <div className="mt-10 flex gap-3 flex-wrap">
        {allRaces.filter((x) => x.slug !== draft.slug).map((other) => (
          <Link key={other.slug} href={`/races/${other.slug}`} className="rounded-full px-4 py-1.5 text-sm shadow hover:shadow-md hover:-translate-y-0.5 transition-all border border-black/5" style={{ backgroundColor: other.couleur }}>
            {other.nom}
          </Link>
        ))}
      </div>
    </div>
  )
}
