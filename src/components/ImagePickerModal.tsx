'use client'

import { useState, useEffect, useCallback } from 'react'
import { getImageLibrary, type ImageEntry } from '@/app/admin/actions'

interface Props {
  onSelect: (url: string) => void
  onClose: () => void
}

export function ImagePickerModal({ onSelect, onClose }: Props) {
  const [images, setImages] = useState<ImageEntry[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')

  useEffect(() => {
    getImageLibrary().then((imgs) => { setImages(imgs); setLoading(false) })
  }, [])

  const handleKey = useCallback((e: KeyboardEvent) => {
    if (e.key === 'Escape') onClose()
  }, [onClose])

  useEffect(() => {
    document.addEventListener('keydown', handleKey)
    return () => document.removeEventListener('keydown', handleKey)
  }, [handleKey])

  const filtered = search.trim()
    ? images.filter((i) => i.name.toLowerCase().includes(search.toLowerCase()))
    : images

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: 'rgba(0,0,0,0.65)' }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose() }}
    >
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl flex flex-col" style={{ maxHeight: '80vh' }}>
        {/* Header */}
        <div className="flex items-center gap-3 p-4 border-b shrink-0">
          <div className="flex-1">
            <h2 className="font-bold text-lg" style={{ fontFamily: 'var(--font-heading)' }}>
              Bibliothèque d'images
            </h2>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-700 text-2xl leading-none w-8 h-8 flex items-center justify-center rounded hover:bg-gray-100 transition-colors"
          >
            ×
          </button>
        </div>

        {/* Search */}
        <div className="px-4 py-2 border-b shrink-0">
          <input
            type="search"
            placeholder="Rechercher…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full border border-gray-200 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:border-blue-400"
            autoFocus
          />
        </div>

        {/* Grid */}
        <div className="overflow-y-auto flex-1 p-4">
          {loading ? (
            <div className="text-center py-16 text-gray-400">Chargement…</div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-16 text-gray-400">
              {search ? 'Aucun résultat.' : 'Aucune image disponible.'}
            </div>
          ) : (
            <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
              {filtered.map((img) => (
                <button
                  key={img.name}
                  type="button"
                  onClick={() => { onSelect(img.url); onClose() }}
                  className="group relative aspect-square bg-gray-100 rounded-xl overflow-hidden hover:ring-2 hover:ring-[var(--gold)] transition-all focus:outline-none focus:ring-2 focus:ring-[var(--gold)]"
                >
                  <img
                    src={img.url}
                    alt={img.name}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                  <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent py-1.5 px-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <p className="text-xs text-white truncate leading-tight">{img.name}</p>
                    {img.usageCount > 0 && (
                      <p className="text-xs text-green-300">×{img.usageCount}</p>
                    )}
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-4 py-3 border-t shrink-0 flex justify-between items-center text-xs text-gray-400">
          <span>{filtered.length} image{filtered.length !== 1 ? 's' : ''}</span>
          <span>Appuyez sur Échap pour fermer</span>
        </div>
      </div>
    </div>
  )
}
