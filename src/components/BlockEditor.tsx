'use client'

import { useState, useRef, useEffect } from 'react'
import { WikiEditor } from './WikiEditor'
import { uploadImage } from '@/lib/uploadImage'
import type { Block } from '@/types/blocks'

interface Props {
  blocks: Block[]
  onChange: (blocks: Block[]) => void
  onUploading?: (uploading: boolean) => void
}

export function BlockEditor({ blocks, onChange, onUploading }: Props) {
  const [uploading, setUploading] = useState<Record<string, boolean>>({})
  const fileInputRefs = useRef<Record<string, HTMLInputElement | null>>({})
  // Always-current ref so async callbacks never read stale closures
  const blocksRef = useRef(blocks)
  blocksRef.current = blocks

  const isAnyUploading = Object.values(uploading).some(Boolean)
  useEffect(() => { onUploading?.(isAnyUploading) }, [isAnyUploading, onUploading])

  function add(type: Block['type']) {
    const id = crypto.randomUUID()
    const contenu = type === 'list' ? '<ul><li></li></ul>' : ''
    onChange([...blocksRef.current, { id, type, titre: '', contenu }])
  }

  function remove(id: string) {
    onChange(blocksRef.current.filter((b) => b.id !== id))
  }

  function update(id: string, patch: Partial<Block>) {
    onChange(blocksRef.current.map((b) => (b.id === id ? { ...b, ...patch } : b)))
  }

  function move(i: number, dir: -1 | 1) {
    const j = i + dir
    if (j < 0 || j >= blocksRef.current.length) return
    const next = [...blocksRef.current]
    ;[next[i], next[j]] = [next[j], next[i]]
    onChange(next)
  }

  async function handleImageUpload(blockId: string, file: File) {
    setUploading((u) => ({ ...u, [blockId]: true }))
    try {
      const fd = new FormData()
      fd.append('file', file)
      const result = await uploadImage(fd)
      if (!result.ok) { alert('Erreur upload : ' + result.error); return }
      update(blockId, { contenu: result.url })
    } catch (e) {
      alert('Erreur upload : ' + (e instanceof Error ? e.message : String(e)))
    } finally {
      setUploading((u) => ({ ...u, [blockId]: false }))
    }
  }

  const typeLabel: Record<Block['type'], string> = { text: 'Texte', list: 'Liste', image: 'Image' }

  return (
    <div className="space-y-4">
      {blocks.map((b, i) => (
        <div key={b.id} className="wiki-card p-4 border border-gray-200 rounded-xl">
          <div className="flex items-center gap-2 mb-3">
            <div className="flex flex-col gap-0.5 shrink-0">
              <button
                type="button"
                onClick={() => move(i, -1)}
                disabled={i === 0}
                className="text-gray-400 hover:text-gray-700 disabled:opacity-25 text-xs leading-none px-1 py-0.5 hover:bg-gray-100 rounded"
                title="Monter"
              >▲</button>
              <button
                type="button"
                onClick={() => move(i, 1)}
                disabled={i === blocks.length - 1}
                className="text-gray-400 hover:text-gray-700 disabled:opacity-25 text-xs leading-none px-1 py-0.5 hover:bg-gray-100 rounded"
                title="Descendre"
              >▼</button>
            </div>

            <input
              value={b.titre}
              onChange={(e) => update(b.id, { titre: e.target.value })}
              className="flex-1 border border-gray-200 rounded-lg px-3 py-1.5 font-semibold text-base focus:outline-none focus:border-blue-400 bg-transparent"
              placeholder={b.type === 'image' ? 'Légende (optionnel)…' : 'Titre du bloc…'}
            />

            <span className="shrink-0 text-xs bg-gray-100 rounded-full px-2.5 py-1 text-gray-500 font-medium">
              {typeLabel[b.type]}
            </span>

            <button
              type="button"
              onClick={() => remove(b.id)}
              className="shrink-0 btn-wiki btn-wiki-ghost text-red-500 hover:text-red-700 hover:bg-red-50 text-lg leading-none w-8 h-8 flex items-center justify-center"
              title="Supprimer ce bloc"
            >×</button>
          </div>

          {b.type === 'image' ? (
            <div>
              {b.contenu && (
                <div className="mb-3 rounded-lg overflow-hidden bg-gray-50 flex items-center justify-center">
                  <img src={b.contenu} alt={b.titre || ''} className="max-h-64 max-w-full object-contain" />
                </div>
              )}
              <label className={`flex items-center justify-center gap-2 w-full py-2.5 rounded-lg border-2 border-dashed cursor-pointer transition-colors text-sm font-medium
                ${uploading[b.id]
                  ? 'border-gray-200 text-gray-400 cursor-not-allowed'
                  : 'border-gray-300 text-gray-500 hover:border-[var(--gold)] hover:text-gray-700'
                }`}
              >
                {uploading[b.id] ? (
                  <span>Upload en cours…</span>
                ) : (
                  <>
                    <span>🖼</span>
                    <span>{b.contenu ? "Changer l'image" : 'Choisir une image'}</span>
                  </>
                )}
                <input
                  ref={(el) => { fileInputRefs.current[b.id] = el }}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  disabled={uploading[b.id]}
                  onChange={(e) => {
                    const file = e.target.files?.[0]
                    if (file) handleImageUpload(b.id, file)
                    e.target.value = ''
                  }}
                />
              </label>
            </div>
          ) : (
            <WikiEditor
              content={b.contenu}
              onChange={(html) => update(b.id, { contenu: html })}
            />
          )}
        </div>
      ))}

      <div className="flex gap-2 flex-wrap">
        <button
          type="button"
          onClick={() => add('text')}
          className="flex-1 min-w-28 py-3 border-2 border-dashed border-gray-300 rounded-xl text-gray-500 hover:border-[var(--gold)] hover:text-gray-700 transition-colors text-sm font-medium"
        >
          + Texte
        </button>
        <button
          type="button"
          onClick={() => add('list')}
          className="flex-1 min-w-28 py-3 border-2 border-dashed border-gray-300 rounded-xl text-gray-500 hover:border-[var(--gold)] hover:text-gray-700 transition-colors text-sm font-medium"
        >
          + Liste
        </button>
        <button
          type="button"
          onClick={() => add('image')}
          className="flex-1 min-w-28 py-3 border-2 border-dashed border-gray-300 rounded-xl text-gray-500 hover:border-[var(--gold)] hover:text-gray-700 transition-colors text-sm font-medium"
        >
          + Image
        </button>
      </div>
    </div>
  )
}
