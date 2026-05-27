'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { WikiEditor } from '@/components/WikiEditor'
import { upsertRyximus } from '@/app/ryximus/[slug]/actions'

function toSlug(s: string) {
  return s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
}

export default function NouveauRyximusPage() {
  const router = useRouter()
  const [saving, setSaving] = useState(false)
  const [nom, setNom] = useState('')
  const [couleur, setCouleur] = useState('#747474')
  const [genre, setGenre] = useState<'Masculin' | 'Féminin'>('Masculin')
  const [element, setElement] = useState('')
  const [personnalite, setPersonnalite] = useState('')
  const [conditionPacte, setConditionPacte] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!nom.trim()) return
    setSaving(true)
    const slug = toSlug(nom)
    try {
      await upsertRyximus(slug, { nom, couleur, genre, element, image: '', personnalite, conditionPacte })
      router.push(`/ryximus/${slug}`)
      router.refresh()
    } catch {
      alert('Erreur lors de la création.')
      setSaving(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="flex items-center gap-4 mb-8">
        <Link href="/ryximus" className="text-sm text-gray-600 hover:underline">← Ryximus</Link>
        <h1 className="text-3xl font-bold" style={{ fontFamily: 'var(--font-heading)' }}>Nouveau Ryximus</h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-white rounded-xl shadow p-6 space-y-4">
          <div className="flex gap-4 items-end flex-wrap">
            <div className="flex-1 min-w-40">
              <label className="block text-sm font-semibold mb-1">Nom *</label>
              <input value={nom} onChange={(e) => setNom(e.target.value)} required className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:border-[#747474]" placeholder="Nom du Ryximus" />
              {nom && <p className="text-xs text-gray-500 mt-1">slug : {toSlug(nom)}</p>}
            </div>
            <div>
              <label className="block text-sm font-semibold mb-1">Couleur</label>
              <input type="color" value={couleur} onChange={(e) => setCouleur(e.target.value)} className="w-12 h-10 rounded cursor-pointer border border-gray-300" />
            </div>
          </div>
          <div className="flex gap-4">
            <div className="flex-1">
              <label className="block text-sm font-semibold mb-1">Élément</label>
              <input value={element} onChange={(e) => setElement(e.target.value)} className="w-full border rounded-lg px-3 py-2 focus:outline-none" placeholder="ex: Feu, Eau…" />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-1">Genre</label>
              <select value={genre} onChange={(e) => setGenre(e.target.value as 'Masculin' | 'Féminin')} className="border rounded-lg px-3 py-2 focus:outline-none">
                <option value="Masculin">Masculin</option>
                <option value="Féminin">Féminin</option>
              </select>
            </div>
          </div>
        </div>

        {[
          ['Personnalité', personnalite, setPersonnalite],
          ['Condition du Pacte', conditionPacte, setConditionPacte],
        ].map(([label, value, setter]) => (
          <div key={label as string} className="bg-white rounded-xl shadow p-6">
            <label className="block text-sm font-semibold mb-2">{label as string}</label>
            <WikiEditor content={value as string} onChange={setter as (v: string) => void} />
          </div>
        ))}

        <div className="flex gap-3 justify-end">
          <Link href="/ryximus" className="px-5 py-2 bg-gray-200 rounded-lg text-sm hover:bg-gray-300 transition-colors">Annuler</Link>
          <button type="submit" disabled={saving || !nom.trim()} className="px-5 py-2 bg-[#747474] text-white rounded-lg text-sm hover:bg-[#5a5a5a] disabled:opacity-60 transition-colors">
            {saving ? 'Création…' : 'Créer le Ryximus'}
          </button>
        </div>
      </form>
    </div>
  )
}
