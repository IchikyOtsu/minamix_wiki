'use client'

import { useState, useRef } from 'react'
import { addImageUrl, deleteImageFile, deleteImageUrl, getImageLibrary, renameImageFile, type ImageEntry } from './actions'

function formatSize(bytes: number) {
  if (bytes < 1024) return bytes + ' B'
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB'
  return (bytes / (1024 * 1024)).toFixed(1) + ' MB'
}

function formatDate(iso: string) {
  if (!iso) return ''
  return new Date(iso).toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit', year: 'numeric' })
}

interface Props {
  initialImages: ImageEntry[]
}

export function AdminImagesClient({ initialImages }: Props) {
  const [images, setImages] = useState(initialImages)
  const [deleting, setDeleting] = useState<string | null>(null)
  const [refreshing, setRefreshing] = useState(false)
  const [tooltip, setTooltip] = useState<string | null>(null)
  const [renaming, setRenaming] = useState<string | null>(null)
  const [renameValue, setRenameValue] = useState('')
  const [renameSaving, setRenameSaving] = useState(false)
  const renameInputRef = useRef<HTMLInputElement>(null)
  const [urlName, setUrlName] = useState('')
  const [urlValue, setUrlValue] = useState('')
  const [urlAdding, setUrlAdding] = useState(false)

  async function handleRefresh() {
    setRefreshing(true)
    const fresh = await getImageLibrary()
    setImages(fresh)
    setRefreshing(false)
  }

  async function handleDelete(img: ImageEntry) {
    const confirmed = img.usageCount > 0
      ? window.confirm(`Cette image est utilisée ${img.usageCount} fois (${img.usedIn.join(', ')}).\nSupprimer quand même ?`)
      : window.confirm(`Supprimer « ${img.name} » ?`)
    if (!confirmed) return

    setDeleting(img.name)
    const result = img.urlId !== undefined
      ? await deleteImageUrl(img.urlId)
      : await deleteImageFile(img.name)
    setDeleting(null)
    if (!result.ok) { alert('Erreur : ' + result.error); return }
    setImages((prev) => prev.filter((i) => i.name !== img.name))
  }

  async function handleAddUrl(e: React.FormEvent) {
    e.preventDefault()
    if (!urlName.trim() || !urlValue.trim()) return
    setUrlAdding(true)
    const result = await addImageUrl(urlName, urlValue)
    setUrlAdding(false)
    if (!result.ok) { alert('Erreur : ' + result.error); return }
    setImages((prev) => [result.entry!, ...prev])
    setUrlName('')
    setUrlValue('')
  }

  function startRename(img: ImageEntry) {
    // Strip extension from displayed value for easier editing
    const lastDot = img.name.lastIndexOf('.')
    setRenameValue(lastDot > 0 ? img.name.slice(0, lastDot) : img.name)
    setRenaming(img.name)
    setTimeout(() => renameInputRef.current?.select(), 0)
  }

  async function confirmRename(img: ImageEntry) {
    const trimmed = renameValue.trim()
    if (!trimmed || trimmed === img.name) { setRenaming(null); return }

    setRenameSaving(true)
    const result = await renameImageFile(img.name, trimmed)
    setRenameSaving(false)

    if (!result.ok) { alert('Erreur : ' + result.error); return }

    setImages((prev) => prev.map((i) =>
      i.name === img.name
        ? { ...i, name: result.newName!, url: result.newUrl! }
        : i
    ))
    setRenaming(null)
  }

  const totalSize = images.reduce((sum, i) => sum + i.size, 0)
  const unused = images.filter((i) => i.usageCount === 0).length

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex flex-wrap items-start justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-1" style={{ fontFamily: 'var(--font-heading)' }}>
            Bibliothèque d'images
          </h1>
          <div className="flex gap-4 text-sm text-gray-500">
            <span>{images.length} image{images.length !== 1 ? 's' : ''}</span>
            <span>{formatSize(totalSize)}</span>
            {unused > 0 && <span className="text-amber-500">{unused} non utilisée{unused !== 1 ? 's' : ''}</span>}
          </div>
        </div>
        <button onClick={handleRefresh} disabled={refreshing} className="btn-wiki btn-wiki-ghost text-sm">
          {refreshing ? 'Actualisation…' : '↺ Actualiser'}
        </button>
      </div>

      {/* Add by URL */}
      <div className="mb-8 p-5 rounded-xl border border-dashed border-gray-300 bg-white">
        <h2 className="text-sm font-semibold text-gray-700 mb-3">Ajouter une image par URL</h2>
        <form onSubmit={handleAddUrl} className="flex flex-wrap gap-3 items-end">
          <div className="flex-1 min-w-40">
            <label className="block text-xs text-gray-500 mb-1">Nom affiché</label>
            <input
              value={urlName}
              onChange={(e) => setUrlName(e.target.value)}
              placeholder="ex: Carte du monde"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-400"
              required
            />
          </div>
          <div className="flex-[2] min-w-60">
            <label className="block text-xs text-gray-500 mb-1">URL de l'image</label>
            <input
              value={urlValue}
              onChange={(e) => setUrlValue(e.target.value)}
              placeholder="https://…"
              type="url"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-400 font-mono"
              required
            />
          </div>
          <button
            type="submit"
            disabled={urlAdding || !urlName.trim() || !urlValue.trim()}
            className="btn-wiki btn-wiki-primary shrink-0 disabled:opacity-60"
          >
            {urlAdding ? 'Ajout…' : '+ Ajouter'}
          </button>
        </form>
      </div>

      {images.length === 0 ? (
        <div className="text-center py-24 text-gray-400 text-lg">
          Aucune image dans la bibliothèque.
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
          {images.map((img) => (
            <div key={img.name} className="wiki-card overflow-hidden flex flex-col">
              {/* Preview */}
              <div className="aspect-square bg-gray-100 overflow-hidden shrink-0">
                <img src={img.url} alt={img.name} className="w-full h-full object-cover" loading="lazy" />
              </div>

              {/* Info */}
              <div className="p-2 flex flex-col gap-1 flex-1">
                {/* Filename — click to rename (not for URL images) */}
                {img.urlId !== undefined ? (
                  <div className="flex items-center gap-1">
                    <span className="text-xs bg-blue-100 text-blue-600 rounded px-1.5 py-0.5 font-medium shrink-0">🔗 URL</span>
                    <span className="text-xs font-mono text-gray-600 truncate" title={img.name}>{img.name}</span>
                  </div>
                ) : renaming === img.name ? (
                  <div className="flex items-center gap-1">
                    <input
                      ref={renameInputRef}
                      value={renameValue}
                      onChange={(e) => setRenameValue(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') confirmRename(img)
                        if (e.key === 'Escape') setRenaming(null)
                      }}
                      className="flex-1 text-xs font-mono border border-blue-300 rounded px-1 py-0.5 focus:outline-none focus:border-blue-500 min-w-0"
                      disabled={renameSaving}
                    />
                    <button
                      onClick={() => confirmRename(img)}
                      disabled={renameSaving}
                      className="text-green-600 hover:text-green-800 text-sm shrink-0 disabled:opacity-40"
                      title="Confirmer"
                    >
                      {renameSaving ? '…' : '✓'}
                    </button>
                    <button
                      onClick={() => setRenaming(null)}
                      disabled={renameSaving}
                      className="text-gray-400 hover:text-gray-600 text-sm shrink-0"
                      title="Annuler"
                    >
                      ✕
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => startRename(img)}
                    className="text-xs font-mono text-gray-600 truncate text-left hover:text-blue-600 transition-colors"
                    title={`${img.name} — cliquer pour renommer`}
                  >
                    {img.name}
                  </button>
                )}

                <div className="flex items-center justify-between text-xs text-gray-400">
                  <span>{img.size > 0 ? formatSize(img.size) : ''}</span>
                  <span>{formatDate(img.createdAt)}</span>
                </div>

                {/* Usage + delete */}
                <div className="mt-auto pt-1.5 flex items-center justify-between gap-1">
                  <button
                    className={`text-xs px-2 py-0.5 rounded-full font-medium transition-colors ${
                      img.usageCount > 0
                        ? 'bg-green-50 text-green-700 hover:bg-green-100'
                        : 'bg-gray-100 text-gray-400'
                    }`}
                    title={img.usedIn.length > 0 ? img.usedIn.join('\n') : 'Non utilisée'}
                    onClick={() => setTooltip(tooltip === img.name ? null : img.name)}
                  >
                    {img.usageCount > 0 ? `×${img.usageCount}` : '–'}
                  </button>
                  <button
                    onClick={() => handleDelete(img)}
                    disabled={deleting === img.name}
                    className="text-sm text-red-400 hover:text-red-600 transition-colors disabled:opacity-40 w-6 h-6 flex items-center justify-center rounded hover:bg-red-50"
                    title="Supprimer"
                  >
                    {deleting === img.name ? '…' : '✕'}
                  </button>
                </div>

                {/* Expanded usage list */}
                {tooltip === img.name && img.usedIn.length > 0 && (
                  <ul className="mt-1 text-xs text-gray-500 space-y-0.5 border-t pt-1">
                    {img.usedIn.map((loc, i) => (
                      <li key={i} className="truncate" title={loc}>· {loc}</li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
