'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { WikiEditor } from '@/components/WikiEditor'
import { upsertPays } from '@/app/pays/[slug]/actions'

function toSlug(s: string) {
  return s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
}

export default function NouveauPaysPage() {
  const router = useRouter()
  const [saving, setSaving] = useState(false)
  const [nom, setNom] = useState('')
  const [couleur, setCouleur] = useState('#747474')
  const [geographie, setGeographie] = useState('')
  const [histoire, setHistoire] = useState('')
  const [politiqueInterne, setPolitiqueInterne] = useState('')
  const [politiqueExterne, setPolitiqueExterne] = useState('')
  const [modeDeVie, setModeDeVie] = useState('')
  const [magie, setMagie] = useState('')
  const [traditions, setTraditions] = useState('')
  const [societe, setSociete] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!nom.trim()) return
    setSaving(true)
    const slug = toSlug(nom)
    try {
      await upsertPays(slug, { nom, couleur, geographie, histoire, politiqueInterne, politiqueExterne, modeDeVie, magie: magie || undefined, traditions, societe })
      router.push(`/pays/${slug}`)
      router.refresh()
    } catch {
      alert('Erreur lors de la création.')
      setSaving(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="flex items-center gap-4 mb-8">
        <Link href="/pays" className="text-sm text-gray-600 hover:underline">← Pays</Link>
        <h1 className="text-3xl font-bold" style={{ fontFamily: 'var(--font-heading)' }}>Nouveau Pays</h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Nom + couleur */}
        <div className="bg-white rounded-xl shadow p-6 space-y-4">
          <div className="flex gap-4 items-end">
            <div className="flex-1">
              <label className="block text-sm font-semibold mb-1">Nom *</label>
              <input value={nom} onChange={(e) => setNom(e.target.value)} required className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:border-[#747474]" placeholder="Nom du pays" />
              {nom && <p className="text-xs text-gray-500 mt-1">slug : {toSlug(nom)}</p>}
            </div>
            <div>
              <label className="block text-sm font-semibold mb-1">Couleur</label>
              <input type="color" value={couleur} onChange={(e) => setCouleur(e.target.value)} className="w-12 h-10 rounded cursor-pointer border border-gray-300" />
            </div>
          </div>
        </div>

        {[
          ['Géographie', geographie, setGeographie],
          ['Histoire', histoire, setHistoire],
          ['Politique interne', politiqueInterne, setPolitiqueInterne],
          ['Politique externe', politiqueExterne, setPolitiqueExterne],
          ['Mode de vie', modeDeVie, setModeDeVie],
          ['Magie (optionnel)', magie, setMagie],
          ['Société', societe, setSociete],
        ].map(([label, value, setter]) => (
          <div key={label as string} className="bg-white rounded-xl shadow p-6">
            <label className="block text-sm font-semibold mb-2">{label as string}</label>
            <WikiEditor content={value as string} onChange={setter as (v: string) => void} />
          </div>
        ))}

        {/* Traditions */}
        <div className="bg-white rounded-xl shadow p-6">
          <label className="block text-sm font-semibold mb-3">Traditions</label>
          <WikiEditor content={traditions} onChange={setTraditions} />
        </div>

        <div className="flex gap-3 justify-end">
          <Link href="/pays" className="px-5 py-2 bg-gray-200 rounded-lg text-sm hover:bg-gray-300 transition-colors">Annuler</Link>
          <button type="submit" disabled={saving || !nom.trim()} className="px-5 py-2 bg-[#747474] text-white rounded-lg text-sm hover:bg-[#5a5a5a] disabled:opacity-60 transition-colors">
            {saving ? 'Création…' : 'Créer le pays'}
          </button>
        </div>
      </form>
    </div>
  )
}
