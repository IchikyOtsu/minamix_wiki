'use client'

import { useState, useRef, useEffect } from 'react'
import { WikiEditor } from './WikiEditor'
import { ImagePickerModal } from './ImagePickerModal'
import { uploadImage } from '@/lib/uploadImage'
import { sanitizeName } from '@/lib/sanitize'
import type { Block } from '@/types/blocks'

interface Props {
  blocks: Block[]
  onChange: (blocks: Block[]) => void
  onUploading?: (uploading: boolean) => void
}

type PendingUpload = {
  blockId: string
  file: File
  previewUrl: string
  name: string   // base name without extension, user-editable
  ext: string    // e.g. ".jpg"
}

export function BlockEditor({ blocks, onChange, onUploading }: Props) {
  const [uploading, setUploading] = useState<Record<string, boolean>>({})
  const [pickerBlockId, setPickerBlockId] = useState<string | null>(null)
  const [pending, setPending] = useState<PendingUpload | null>(null)
  const fileInputRefs = useRef<Record<string, HTMLInputElement | null>>({})
  const blocksRef = useRef(blocks)
  blocksRef.current = blocks

  const isAnyUploading = Object.values(uploading).some(Boolean)
  useEffect(() => { onUploading?.(isAnyUploading) }, [isAnyUploading, onUploading])

  // Clean up object URL when pending changes
  useEffect(() => {
    return () => { if (pending) URL.revokeObjectURL(pending.previewUrl) }
  }, [pending])

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

  function handleFileSelect(blockId: string, file: File) {
    if (pending) URL.revokeObjectURL(pending.previewUrl)
    const clean = sanitizeName(file.name)
    const lastDot = clean.lastIndexOf('.')
    const base = lastDot > 0 ? clean.slice(0, lastDot) : clean
    const ext = lastDot > 0 ? clean.slice(lastDot) : ''
    setPending({ blockId, file, previewUrl: URL.createObjectURL(file), name: base, ext })
  }

  function cancelPending() {
    if (pending) URL.revokeObjectURL(pending.previewUrl)
    setPending(null)
  }

  async function confirmUpload() {
    if (!pending) return
    const { blockId, file, name, ext } = pending
    setPending(null)
    setUploading((u) => ({ ...u, [blockId]: true }))
    try {
      const fd = new FormData()
      fd.append('file', file)
      fd.append('name', name.trim() || 'image')
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
            <div className="space-y-2">
              {/* Current image preview */}
              {b.contenu && !pending && (
                <div className="rounded-lg overflow-hidden bg-gray-50 flex items-center justify-center">
                  <img src={b.contenu} alt={b.titre || ''} className="max-h-64 max-w-full object-contain" />
                </div>
              )}

              {/* Pending upload confirmation panel */}
              {pending?.blockId === b.id ? (
                <div className="border-2 border-blue-200 rounded-xl p-3 bg-blue-50 space-y-3">
                  <img
                    src={pending.previewUrl}
                    alt="aperçu"
                    className="max-h-40 max-w-full rounded-lg object-contain mx-auto block"
                  />
                  <div>
                    <p className="text-xs text-gray-500 mb-1 font-medium">Nom du fichier</p>
                    <div className="flex items-center gap-1.5">
                      <input
                        autoFocus
                        value={pending.name}
                        onChange={(e) => setPending((p) => p ? { ...p, name: e.target.value } : null)}
                        onKeyDown={(e) => { if (e.key === 'Enter') confirmUpload(); if (e.key === 'Escape') cancelPending() }}
                        className="flex-1 border border-gray-300 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:border-blue-400 font-mono"
                        placeholder="nom-du-fichier"
                      />
                      <span className="text-xs text-gray-400 shrink-0 font-mono">{pending.ext}</span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={confirmUpload}
                      className="flex-1 py-2 rounded-lg bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 transition-colors"
                    >
                      ↑ Uploader
                    </button>
                    <button
                      type="button"
                      onClick={cancelPending}
                      className="px-4 py-2 rounded-lg border border-gray-300 text-gray-600 text-sm hover:bg-gray-50 transition-colors"
                    >
                      Annuler
                    </button>
                  </div>
                </div>
              ) : (
                /* Upload + Library buttons */
                <div className="flex gap-2">
                  <label className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg border-2 border-dashed cursor-pointer transition-colors text-sm font-medium
                    ${uploading[b.id]
                      ? 'border-gray-200 text-gray-400 cursor-not-allowed'
                      : 'border-gray-300 text-gray-500 hover:border-[var(--gold)] hover:text-gray-700'
                    }`}
                  >
                    {uploading[b.id] ? (
                      <span>Upload en cours…</span>
                    ) : (
                      <>
                        <span>↑</span>
                        <span>{b.contenu ? 'Changer' : 'Uploader'}</span>
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
                        if (file) handleFileSelect(b.id, file)
                        e.target.value = ''
                      }}
                    />
                  </label>
                  <button
                    type="button"
                    onClick={() => setPickerBlockId(b.id)}
                    className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg border-2 border-dashed border-gray-300 text-gray-500 hover:border-[var(--gold)] hover:text-gray-700 transition-colors text-sm font-medium"
                  >
                    <span>🖼</span>
                    <span>Bibliothèque</span>
                  </button>
                </div>
              )}
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

      {pickerBlockId && (
        <ImagePickerModal
          onSelect={(url) => update(pickerBlockId, { contenu: url })}
          onClose={() => setPickerBlockId(null)}
        />
      )}
    </div>
  )
}
