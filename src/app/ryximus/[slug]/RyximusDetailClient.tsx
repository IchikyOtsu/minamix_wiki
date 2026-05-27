'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import type { Ryximus } from '@/data/ryximus'
import { WikiEditor } from '@/components/WikiEditor'
import { RichText } from '@/components/RichText'
import { DeleteConfirm } from '@/components/DeleteConfirm'
import { upsertRyximus, deleteRyximus } from './actions'

interface Props {
  ryximus: Ryximus
  allRyximus: Ryximus[]
  isLoggedIn: boolean
}

export function RyximusDetailClient({ ryximus: initial, allRyximus, isLoggedIn }: Props) {
  const [editing, setEditing] = useState(false)
  const [saving, setSaving] = useState(false)
  const [draft, setDraft] = useState<Ryximus>(initial)
  const router = useRouter()

  function field(key: keyof Ryximus, label: string) {
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
      await upsertRyximus(slug, fields)
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
                  await deleteRyximus(initial.slug)
                  router.push('/ryximus')
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

        {editing ? (
          <input value={draft.citation} onChange={(e) => setDraft((d) => ({ ...d, citation: e.target.value }))} className="mt-6 w-full border border-white/40 rounded-lg px-3 py-2 bg-white/20 text-white italic focus:outline-none" placeholder="Citation…" />
        ) : (
          <blockquote className="mt-6 border-l-4 border-white/50 pl-4 italic opacity-90">
            &ldquo;{draft.citation}&rdquo;
          </blockquote>
        )}
      </div>

      <div className="space-y-5">
        {field('description', 'Description')}
        {field('personnalite', 'Personnalité')}

        <div className="wiki-card p-6 border-l-4" style={{ borderColor: draft.couleur }}>
          <h3 className="wiki-section-title">Condition du Pacte</h3>
          {editing ? (
            <WikiEditor content={(draft.conditionPacte ?? '') as string} onChange={(html) => setDraft((d) => ({ ...d, conditionPacte: html }))} />
          ) : (
            <RichText content={draft.conditionPacte} />
          )}
        </div>
      </div>

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
