'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import type { Pays } from '@/data/pays'
import { WikiEditor } from '@/components/WikiEditor'
import { RichText } from '@/components/RichText'
import { DeleteConfirm } from '@/components/DeleteConfirm'
import { upsertPays, deletePays } from './actions'

interface Props {
  pays: Pays
  allPays: Pays[]
  isLoggedIn: boolean
}

export function PaysDetailClient({ pays: initial, allPays, isLoggedIn }: Props) {
  const [editing, setEditing] = useState(false)
  const [saving, setSaving] = useState(false)
  const [draft, setDraft] = useState<Pays>(initial)
  const router = useRouter()

  function field(key: keyof Pays, label: string) {
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
      await upsertPays(slug, fields)
      setEditing(false)
      router.refresh()
    } catch {
      alert('Erreur lors de la sauvegarde.')
    }
    setSaving(false)
  }

  return (
    <div>
      {/* Edit bar */}
      {isLoggedIn && (
        <div className="wiki-edit-bar">
          {editing ? (
            <>
              <DeleteConfirm
                label="Supprimer la page"
                onConfirm={async () => {
                  await deletePays(initial.slug)
                  router.push('/pays')
                  router.refresh()
                }}
              />
              <button onClick={() => { setDraft(initial); setEditing(false) }} className="btn-wiki btn-wiki-ghost">
                Annuler
              </button>
              <button onClick={handleSave} disabled={saving} className="btn-wiki btn-wiki-primary disabled:opacity-60">
                {saving ? 'Sauvegarde…' : '✓ Sauvegarder'}
              </button>
            </>
          ) : (
            <button onClick={() => setEditing(true)} className="btn-wiki btn-wiki-primary">
              ✏️ Modifier cette page
            </button>
          )}
        </div>
      )}

      {/* Header coloré */}
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

      {/* Sections */}
      <div className="space-y-5">
        {field('geographie', 'Géographie')}
        {field('histoire', 'Histoire')}
        {field('politiqueInterne', 'Politique interne')}
        {field('politiqueExterne', 'Politique externe')}
        {field('modeDeVie', 'Mode de vie')}
        {(draft.magie || editing) && field('magie', 'Magie')}

        {/* Traditions */}
        <div className="wiki-card p-6">
          <h3 className="wiki-section-title">Traditions</h3>
          {editing ? (
            <div className="space-y-3">
              {draft.traditions.map((t, i) => (
                <div key={i} className="flex gap-2 items-start border border-gray-200 rounded-lg p-3 bg-gray-50/50">
                  <div className="flex-1 space-y-2">
                    <input
                      value={t.nom}
                      onChange={(e) => setDraft((d) => {
                        const tr = [...d.traditions]; tr[i] = { ...tr[i], nom: e.target.value }; return { ...d, traditions: tr }
                      })}
                      className="w-full border border-gray-200 rounded px-2.5 py-1.5 text-sm font-semibold focus:outline-none focus:border-gray-400"
                      placeholder="Nom de la tradition"
                    />
                    <input
                      value={t.description}
                      onChange={(e) => setDraft((d) => {
                        const tr = [...d.traditions]; tr[i] = { ...tr[i], description: e.target.value }; return { ...d, traditions: tr }
                      })}
                      className="w-full border border-gray-200 rounded px-2.5 py-1.5 text-sm focus:outline-none focus:border-gray-400"
                      placeholder="Description"
                    />
                  </div>
                  <button type="button" onClick={() => setDraft((d) => ({ ...d, traditions: d.traditions.filter((_, j) => j !== i) }))} className="text-red-400 hover:text-red-600 text-xl leading-none px-1 mt-1">×</button>
                </div>
              ))}
              <button type="button" onClick={() => setDraft((d) => ({ ...d, traditions: [...d.traditions, { nom: '', description: '' }] }))} className="text-sm text-blue-600 hover:underline">
                + Ajouter une tradition
              </button>
            </div>
          ) : (
            <ul className="space-y-3">
              {draft.traditions.map((t) => (
                <li key={t.nom} className="border-l-4 pl-4 py-0.5" style={{ borderColor: draft.couleur }}>
                  <span className="font-semibold">{t.nom}</span>
                  <span className="text-gray-700"> — {t.description}</span>
                </li>
              ))}
            </ul>
          )}
        </div>

        {field('societe', 'Société')}
      </div>

      {/* Navigation entre pays */}
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
