'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import type { Race } from '@/data/races'
import { WikiEditor } from '@/components/WikiEditor'
import { RichText } from '@/components/RichText'
import { DeleteConfirm } from '@/components/DeleteConfirm'
import { upsertRace, deleteRace } from './actions'

interface Props {
  race: Race
  allRaces: Race[]
  isLoggedIn: boolean
}

export function RaceDetailClient({ race: initial, allRaces, isLoggedIn }: Props) {
  const [editing, setEditing] = useState(false)
  const [saving, setSaving] = useState(false)
  const [draft, setDraft] = useState<Race>(initial)
  const router = useRouter()

  function field(key: keyof Race, label: string) {
    const value = (draft[key] ?? '') as string
    return (
      <div className="wiki-card p-6">
        <h3 className="wiki-section-title">{label}</h3>
        {editing ? (
          <WikiEditor content={value} onChange={(html) => setDraft((d) => ({ ...d, [key]: html }))} />
        ) : (
          <RichText content={value} />
        )}
      </div>
    )
  }

  async function handleSave() {
    setSaving(true)
    try {
      const { slug, ...fields } = draft
      await upsertRace(slug, fields)
      setEditing(false)
      router.refresh()
    } catch {
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
              <DeleteConfirm
                label="Supprimer la page"
                onConfirm={async () => {
                  await deleteRace(initial.slug)
                  router.push('/races')
                  router.refresh()
                }}
              />
              <button onClick={() => { setDraft(initial); setEditing(false) }} className="btn-wiki btn-wiki-ghost">Annuler</button>
              <button onClick={handleSave} disabled={saving} className="btn-wiki btn-wiki-primary disabled:opacity-60">
                {saving ? 'Sauvegarde…' : '✓ Sauvegarder'}
              </button>
            </>
          ) : (
            <button onClick={() => setEditing(true)} className="btn-wiki btn-wiki-primary">✏️ Modifier cette page</button>
          )}
        </div>
      )}

      {/* Header */}
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

      <div className="space-y-5">
        {field('description', 'Description')}
        {field('histoire', 'Histoire')}
        {field('physique', 'Apparence physique')}
        {field('magie', 'Magie')}
        {field('societe', 'Société')}
      </div>

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
