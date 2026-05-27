'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { WikiEditor } from '@/components/WikiEditor'
import { RichText } from '@/components/RichText'
import { DeleteConfirm } from '@/components/DeleteConfirm'
import { upsertAnnexe, deleteAnnexe } from './actions'

type Annexe = { label: string; titre: string; contenu: string }

interface Props {
  annexes: Annexe[]
  isLoggedIn: boolean
}

function toLabel(s: string) {
  return s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').substring(0, 32)
}

export function AnnexesClient({ annexes: initial, isLoggedIn }: Props) {
  const [annexes, setAnnexes] = useState<Annexe[]>(initial)
  const [editingLabel, setEditingLabel] = useState<string | null>(null)
  const [drafts, setDrafts] = useState<Record<string, Annexe>>(
    Object.fromEntries(initial.map((a) => [a.label, a]))
  )
  const [saving, setSaving] = useState(false)
  const [showNewForm, setShowNewForm] = useState(false)
  const [newTitre, setNewTitre] = useState('')
  const [creatingNew, setCreatingNew] = useState(false)
  const router = useRouter()

  function getAnnexe(label: string): Annexe {
    return drafts[label] ?? { label, titre: `Annexe ${label}`, contenu: '' }
  }

  async function handleSave(label: string) {
    setSaving(true)
    const a = getAnnexe(label)
    try {
      await upsertAnnexe(label, a.titre, a.contenu)
      setEditingLabel(null)
      router.refresh()
    } catch {
      alert('Erreur lors de la sauvegarde.')
    }
    setSaving(false)
  }

  async function handleCreateNew() {
    if (!newTitre.trim()) return
    setCreatingNew(true)
    const label = toLabel(newTitre) || `annexe-${Date.now()}`
    const newAnnexe: Annexe = { label, titre: newTitre, contenu: '' }
    try {
      await upsertAnnexe(label, newTitre, '')
      setAnnexes((prev) => [...prev, newAnnexe])
      setDrafts((d) => ({ ...d, [label]: newAnnexe }))
      setNewTitre('')
      setShowNewForm(false)
      router.refresh()
    } catch {
      alert('Erreur lors de la création.')
    }
    setCreatingNew(false)
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-4xl font-bold" style={{ fontFamily: 'var(--font-heading)' }}>Annexes</h1>
        {isLoggedIn && !showNewForm && (
          <button onClick={() => setShowNewForm(true)} className="btn-wiki btn-wiki-primary">
            + Nouvelle annexe
          </button>
        )}
      </div>

      {/* New annexe form */}
      {isLoggedIn && showNewForm && (
        <div className="wiki-card p-5 mb-6 border-2 border-dashed border-blue-300">
          <p className="text-sm font-semibold mb-3">Titre de la nouvelle annexe</p>
          <div className="flex gap-2 flex-wrap">
            <input
              autoFocus
              value={newTitre}
              onChange={(e) => setNewTitre(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleCreateNew()}
              className="flex-1 min-w-48 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-400"
              placeholder="ex: Chronologie, Glossaire, Carte…"
            />
            {newTitre && <p className="w-full text-xs text-gray-400">identifiant : {toLabel(newTitre)}</p>}
            <button onClick={() => { setShowNewForm(false); setNewTitre('') }} className="btn-wiki btn-wiki-ghost">Annuler</button>
            <button onClick={handleCreateNew} disabled={creatingNew || !newTitre.trim()} className="btn-wiki btn-wiki-primary disabled:opacity-60">
              {creatingNew ? 'Création…' : 'Créer'}
            </button>
          </div>
        </div>
      )}

      {/* Quick nav */}
      {annexes.length > 0 && (
        <div className="wiki-card p-4 mb-8 flex flex-wrap gap-2 justify-center">
          {annexes.map((a) => {
            const draft = getAnnexe(a.label)
            return (
              <a key={a.label} href={`#${a.label}`} className="px-3 py-1.5 rounded-md bg-gray-100 hover:bg-gray-200 font-medium text-sm transition-colors" style={{ fontFamily: 'var(--font-heading)' }}>
                {draft.titre || a.label}
              </a>
            )
          })}
        </div>
      )}

      <div className="space-y-6">
        {annexes.map((a) => {
          const draft = getAnnexe(a.label)
          const isEditing = editingLabel === a.label

          return (
            <div key={a.label} id={a.label} className="wiki-card p-6">
              <div className="flex items-start justify-between mb-4 gap-4">
                {isEditing ? (
                  <input
                    value={draft.titre}
                    onChange={(e) => setDrafts((d) => ({ ...d, [a.label]: { ...d[a.label], titre: e.target.value } }))}
                    className="text-2xl font-semibold border-b-2 border-blue-400 focus:outline-none flex-1 bg-transparent"
                    style={{ fontFamily: 'var(--font-heading)' }}
                    placeholder={`Annexe ${a.label}`}
                  />
                ) : (
                  <h2 className="wiki-section-title flex-1">{draft.titre || a.label}</h2>
                )}

                {isLoggedIn && (
                  <div className="flex gap-2 shrink-0 flex-wrap justify-end">
                    {isEditing ? (
                      <>
                        <DeleteConfirm
                          label="Supprimer"
                          onConfirm={async () => {
                            await deleteAnnexe(a.label)
                            setAnnexes((prev) => prev.filter((x) => x.label !== a.label))
                            setEditingLabel(null)
                            router.refresh()
                          }}
                        />
                        <button onClick={() => { setDrafts((d) => ({ ...d, [a.label]: a })); setEditingLabel(null) }} className="btn-wiki btn-wiki-ghost">Annuler</button>
                        <button onClick={() => handleSave(a.label)} disabled={saving} className="btn-wiki btn-wiki-primary disabled:opacity-60">
                          {saving ? '…' : '✓ Sauvegarder'}
                        </button>
                      </>
                    ) : (
                      <button onClick={() => setEditingLabel(a.label)} className="btn-wiki btn-wiki-primary">✏️ Modifier</button>
                    )}
                  </div>
                )}
              </div>

              {isEditing ? (
                <WikiEditor
                  content={draft.contenu}
                  onChange={(html) => setDrafts((d) => ({ ...d, [a.label]: { ...d[a.label], contenu: html } }))}
                />
              ) : draft.contenu ? (
                <RichText content={draft.contenu} />
              ) : (
                <p className="text-gray-400 italic text-sm">Contenu à venir…{isLoggedIn ? ' Clique sur Modifier pour rédiger.' : ''}</p>
              )}
            </div>
          )
        })}

        {annexes.length === 0 && (
          <div className="wiki-card p-12 text-center text-gray-400">
            <p className="text-lg mb-2">Aucune annexe pour l&apos;instant.</p>
            {isLoggedIn && <p className="text-sm">Crée la première avec le bouton ci-dessus.</p>}
          </div>
        )}
      </div>
    </div>
  )
}
