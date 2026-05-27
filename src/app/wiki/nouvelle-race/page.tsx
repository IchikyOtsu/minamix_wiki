'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { WikiEditor } from '@/components/WikiEditor'
import { upsertRace } from '@/app/races/[slug]/actions'

function toSlug(s: string) {
  return s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
}

export default function NouvelleRacePage() {
  const router = useRouter()
  const [saving, setSaving] = useState(false)
  const [nom, setNom] = useState('')
  const [couleur, setCouleur] = useState('#747474')
  const [population, setPopulation] = useState(0)
  const [esperanceVie, setEsperanceVie] = useState('')
  const [description, setDescription] = useState('')
  const [histoire, setHistoire] = useState('')
  const [physique, setPhysique] = useState('')
  const [magie, setMagie] = useState('')
  const [societe, setSociete] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!nom.trim()) return
    setSaving(true)
    const slug = toSlug(nom)
    try {
      await upsertRace(slug, { nom, couleur, image: '', population, esperanceVie, description, histoire, physique, magie, societe })
      router.push(`/races/${slug}`)
      router.refresh()
    } catch {
      alert('Erreur lors de la création.')
      setSaving(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="flex items-center gap-4 mb-8">
        <Link href="/races" className="text-sm text-gray-600 hover:underline">← Races</Link>
        <h1 className="text-3xl font-bold" style={{ fontFamily: 'var(--font-heading)' }}>Nouvelle Race</h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-white rounded-xl shadow p-6 space-y-4">
          <div className="flex gap-4 items-end flex-wrap">
            <div className="flex-1 min-w-40">
              <label className="block text-sm font-semibold mb-1">Nom *</label>
              <input value={nom} onChange={(e) => setNom(e.target.value)} required className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:border-[#747474]" placeholder="Nom de la race" />
              {nom && <p className="text-xs text-gray-500 mt-1">slug : {toSlug(nom)}</p>}
            </div>
            <div>
              <label className="block text-sm font-semibold mb-1">Couleur</label>
              <input type="color" value={couleur} onChange={(e) => setCouleur(e.target.value)} className="w-12 h-10 rounded cursor-pointer border border-gray-300" />
            </div>
          </div>
          <div className="flex gap-4">
            <div className="flex-1">
              <label className="block text-sm font-semibold mb-1">Population</label>
              <input type="number" value={population} onChange={(e) => setPopulation(Number(e.target.value))} className="w-full border rounded-lg px-3 py-2 focus:outline-none" />
            </div>
            <div className="flex-1">
              <label className="block text-sm font-semibold mb-1">Espérance de vie</label>
              <input value={esperanceVie} onChange={(e) => setEsperanceVie(e.target.value)} className="w-full border rounded-lg px-3 py-2 focus:outline-none" placeholder="ex: 500 ans" />
            </div>
          </div>
        </div>

        {[
          ['Description', description, setDescription],
          ['Histoire', histoire, setHistoire],
          ['Apparence physique', physique, setPhysique],
          ['Magie', magie, setMagie],
          ['Société', societe, setSociete],
        ].map(([label, value, setter]) => (
          <div key={label as string} className="bg-white rounded-xl shadow p-6">
            <label className="block text-sm font-semibold mb-2">{label as string}</label>
            <WikiEditor content={value as string} onChange={setter as (v: string) => void} />
          </div>
        ))}

        <div className="flex gap-3 justify-end">
          <Link href="/races" className="px-5 py-2 bg-gray-200 rounded-lg text-sm hover:bg-gray-300 transition-colors">Annuler</Link>
          <button type="submit" disabled={saving || !nom.trim()} className="px-5 py-2 bg-[#747474] text-white rounded-lg text-sm hover:bg-[#5a5a5a] disabled:opacity-60 transition-colors">
            {saving ? 'Création…' : 'Créer la race'}
          </button>
        </div>
      </form>
    </div>
  )
}
