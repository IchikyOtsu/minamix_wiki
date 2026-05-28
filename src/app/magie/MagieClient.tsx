'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { WikiEditor } from '@/components/WikiEditor'
import { RichText } from '@/components/RichText'
import { ConflictBanner } from '@/components/ConflictBanner'
import { upsertMagie } from './actions'

type Section = { titre: string; contenu: string }
type Affinite = { element: string; description: string }
type MagieData = { intro: string; sections: Section[]; affinites: Affinite[] }

interface Props {
  data: MagieData
  isLoggedIn: boolean
  updatedAt: string | null
}

export function MagieClient({ data: initial, isLoggedIn, updatedAt }: Props) {
  const [editing, setEditing] = useState(false)
  const [saving, setSaving] = useState(false)
  const [conflict, setConflict] = useState(false)
  const [draft, setDraft] = useState<MagieData>(initial)
  const [loadedAt] = useState(updatedAt)
  const router = useRouter()

  async function handleSave() {
    setSaving(true)
    setConflict(false)
    const result = await upsertMagie(draft, loadedAt)
    if (result.ok) {
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
              <button onClick={() => { setDraft(initial); setEditing(false); setConflict(false) }} className="btn-wiki btn-wiki-ghost">Annuler</button>
              <button onClick={handleSave} disabled={saving} className="btn-wiki btn-wiki-primary disabled:opacity-60">
                {saving ? 'Sauvegarde…' : '✓ Sauvegarder'}
              </button>
            </>
          ) : (
            <button onClick={() => setEditing(true)} className="btn-wiki btn-wiki-primary">✏️ Modifier cette page</button>
          )}
        </div>
      )}

      <h1 className="text-4xl font-bold mb-6" style={{ fontFamily: 'var(--font-heading)' }}>La Magie</h1>

      {/* Intro */}
      <div className="wiki-card p-8 mb-8">
        {editing ? (
          <WikiEditor content={draft.intro} onChange={(html) => setDraft((d) => ({ ...d, intro: html }))} />
        ) : (
          <p className="text-justify leading-relaxed text-lg italic" style={{ color: 'var(--ink)' }}>{draft.intro}</p>
        )}
      </div>

      {/* Sections */}
      <div className="space-y-6 mb-10">
        {draft.sections.map((s, i) => (
          <div key={i} className="wiki-card p-6">
            {editing ? (
              <div className="space-y-2">
                <div className="flex gap-2 items-center">
                  <input
                    value={s.titre}
                    onChange={(e) => setDraft((d) => {
                      const sections = [...d.sections]
                      sections[i] = { ...sections[i], titre: e.target.value }
                      return { ...d, sections }
                    })}
                    className="flex-1 border border-gray-200 rounded-lg px-3 py-1.5 font-semibold text-lg focus:outline-none focus:border-blue-400"
                    placeholder="Titre de la section"
                  />
                  <button
                    type="button"
                    onClick={() => setDraft((d) => ({ ...d, sections: d.sections.filter((_, j) => j !== i) }))}
                    className="btn-wiki btn-wiki-ghost text-red-500 hover:text-red-700 hover:bg-red-50"
                  >×</button>
                </div>
                <WikiEditor
                  content={s.contenu}
                  onChange={(html) => setDraft((d) => {
                    const sections = [...d.sections]
                    sections[i] = { ...sections[i], contenu: html }
                    return { ...d, sections }
                  })}
                />
              </div>
            ) : (
              <>
                <h3 className="wiki-section-title">{s.titre}</h3>
                <RichText content={s.contenu} />
              </>
            )}
          </div>
        ))}
        {editing && (
          <button
            type="button"
            onClick={() => setDraft((d) => ({ ...d, sections: [...d.sections, { titre: '', contenu: '' }] }))}
            className="w-full py-3 border-2 border-dashed border-gray-300 rounded-xl text-gray-500 hover:border-[var(--gold)] hover:text-gray-700 transition-colors text-sm font-medium"
          >
            + Ajouter une section
          </button>
        )}
      </div>

      {/* Affinités */}
      <div className="wiki-card p-6">
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
    </div>
  )
}
