'use client'

import { useState, useRef, useEffect } from 'react'
import { WikiEditor } from './WikiEditor'
import { ImagePickerModal } from './ImagePickerModal'
import { uploadImage } from '@/lib/uploadImage'
import { sanitizeName } from '@/lib/sanitize'
import { parseTable } from '@/types/blocks'
import type { Block, TableData } from '@/types/blocks'

interface Props {
  blocks: Block[]
  onChange: (blocks: Block[]) => void
  onUploading?: (uploading: boolean) => void
}

type PendingUpload = {
  blockId: string
  file: File
  previewUrl: string
  name: string
  ext: string
}

const CALLOUT_VARIANTS = [
  { key: 'info',    icon: 'ℹ️',  label: 'Info',          cls: 'border-blue-400 bg-blue-50 text-blue-800' },
  { key: 'warning', icon: '⚠️', label: 'Avertissement',  cls: 'border-amber-400 bg-amber-50 text-amber-800' },
  { key: 'success', icon: '✓',  label: 'Succès',         cls: 'border-green-500 bg-green-50 text-green-800' },
  { key: 'quote',   icon: '❝',  label: 'Citation',       cls: 'border-gray-400 bg-gray-50 text-gray-700' },
  { key: 'danger',  icon: '⚡', label: 'Danger',         cls: 'border-red-400 bg-red-50 text-red-800' },
] as const

// ── Table sub-editor ─────────────────────────────────────────────────────────

function TableEditor({ data, onChange }: { data: TableData; onChange: (d: TableData) => void }) {
  function setHeader(i: number, val: string) {
    const headers = [...data.headers]; headers[i] = val
    onChange({ ...data, headers })
  }
  function setCell(ri: number, ci: number, val: string) {
    const rows = data.rows.map(r => [...r]); rows[ri][ci] = val
    onChange({ ...data, rows })
  }
  function addRow() {
    onChange({ ...data, rows: [...data.rows, data.headers.map(() => '')] })
  }
  function removeRow(i: number) {
    onChange({ ...data, rows: data.rows.filter((_, j) => j !== i) })
  }
  function addCol() {
    onChange({
      headers: [...data.headers, `Colonne ${data.headers.length + 1}`],
      rows: data.rows.map(r => [...r, '']),
    })
  }
  function removeCol() {
    if (data.headers.length <= 1) return
    onChange({ headers: data.headers.slice(0, -1), rows: data.rows.map(r => r.slice(0, -1)) })
  }

  const inputCls = 'w-full border border-gray-200 rounded px-2 py-1 text-sm focus:outline-none focus:border-blue-400 bg-white'

  return (
    <div>
      <div className="flex justify-end gap-1.5 mb-2">
        <button type="button" onClick={addCol} className="text-xs px-2 py-1 rounded border border-gray-300 hover:bg-gray-50 text-gray-600">+ Col</button>
        <button type="button" onClick={removeCol} disabled={data.headers.length <= 1} className="text-xs px-2 py-1 rounded border border-gray-300 hover:bg-gray-50 text-gray-600 disabled:opacity-30">− Col</button>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr>
              {data.headers.map((h, i) => (
                <th key={i} className="p-1 border-b-2 border-gray-300">
                  <input value={h} onChange={e => setHeader(i, e.target.value)} className={`${inputCls} font-semibold`} placeholder={`En-tête ${i + 1}`} />
                </th>
              ))}
              <th className="w-6" />
            </tr>
          </thead>
          <tbody>
            {data.rows.map((row, ri) => (
              <tr key={ri} className={ri % 2 === 1 ? 'bg-gray-50' : ''}>
                {row.map((cell, ci) => (
                  <td key={ci} className="p-1 border-b border-gray-100">
                    <input value={cell} onChange={e => setCell(ri, ci, e.target.value)} className={inputCls} placeholder="—" />
                  </td>
                ))}
                <td className="p-1">
                  <button type="button" onClick={() => removeRow(ri)} className="text-red-400 hover:text-red-600 text-sm w-5 h-5 flex items-center justify-center rounded hover:bg-red-50">×</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <button type="button" onClick={addRow} className="mt-2 text-xs px-3 py-1.5 rounded border border-dashed border-gray-300 hover:border-[var(--gold)] text-gray-500 hover:text-gray-700 transition-colors">
        + Ligne
      </button>
    </div>
  )
}

// ── Main BlockEditor ─────────────────────────────────────────────────────────

export function BlockEditor({ blocks, onChange, onUploading }: Props) {
  const [uploading, setUploading] = useState<Record<string, boolean>>({})
  const [pickerBlockId, setPickerBlockId] = useState<string | null>(null)
  const [pending, setPending] = useState<PendingUpload | null>(null)
  const fileInputRefs = useRef<Record<string, HTMLInputElement | null>>({})
  const blocksRef = useRef(blocks)
  blocksRef.current = blocks

  const isAnyUploading = Object.values(uploading).some(Boolean)
  useEffect(() => { onUploading?.(isAnyUploading) }, [isAnyUploading, onUploading])
  useEffect(() => { return () => { if (pending) URL.revokeObjectURL(pending.previewUrl) } }, [pending])

  function add(type: Block['type']) {
    const id = crypto.randomUUID()
    let contenu = ''
    if (type === 'list') contenu = '<ul><li></li></ul>'
    if (type === 'table') contenu = JSON.stringify({ headers: ['Colonne 1', 'Colonne 2'], rows: [['', ''], ['', '']] })
    const block: Block = { id, type, titre: '', contenu }
    if (type === 'callout') block.variant = 'info'
    onChange([...blocksRef.current, block])
  }

  function remove(id: string) { onChange(blocksRef.current.filter(b => b.id !== id)) }
  function update(id: string, patch: Partial<Block>) { onChange(blocksRef.current.map(b => b.id === id ? { ...b, ...patch } : b)) }
  function move(i: number, dir: -1 | 1) {
    const j = i + dir
    if (j < 0 || j >= blocksRef.current.length) return
    const next = [...blocksRef.current];[next[i], next[j]] = [next[j], next[i]]; onChange(next)
  }

  function handleFileSelect(blockId: string, file: File) {
    if (pending) URL.revokeObjectURL(pending.previewUrl)
    const clean = sanitizeName(file.name)
    const lastDot = clean.lastIndexOf('.')
    const base = lastDot > 0 ? clean.slice(0, lastDot) : clean
    const ext = lastDot > 0 ? clean.slice(lastDot) : ''
    setPending({ blockId, file, previewUrl: URL.createObjectURL(file), name: base, ext })
  }

  function cancelPending() { if (pending) URL.revokeObjectURL(pending.previewUrl); setPending(null) }

  async function confirmUpload() {
    if (!pending) return
    const { blockId, file, name, ext } = pending
    setPending(null)
    setUploading(u => ({ ...u, [blockId]: true }))
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
      setUploading(u => ({ ...u, [blockId]: false }))
    }
  }

  const typeLabel: Record<Block['type'], string> = { text: 'Texte', list: 'Liste', image: 'Image', table: 'Tableau', callout: 'Encadré' }

  return (
    <div className="space-y-4">
      {blocks.map((b, i) => (
        <div key={b.id} className="wiki-card p-4 border border-gray-200 rounded-xl">
          {/* Block header row */}
          <div className="flex items-center gap-2 mb-3">
            <div className="flex flex-col gap-0.5 shrink-0">
              <button type="button" onClick={() => move(i, -1)} disabled={i === 0} className="text-gray-400 hover:text-gray-700 disabled:opacity-25 text-xs leading-none px-1 py-0.5 hover:bg-gray-100 rounded" title="Monter">▲</button>
              <button type="button" onClick={() => move(i, 1)} disabled={i === blocks.length - 1} className="text-gray-400 hover:text-gray-700 disabled:opacity-25 text-xs leading-none px-1 py-0.5 hover:bg-gray-100 rounded" title="Descendre">▼</button>
            </div>
            <input
              value={b.titre}
              onChange={e => update(b.id, { titre: e.target.value })}
              className="flex-1 border border-gray-200 rounded-lg px-3 py-1.5 font-semibold text-base focus:outline-none focus:border-blue-400 bg-transparent"
              placeholder={b.type === 'image' ? 'Légende (optionnel)…' : b.type === 'callout' ? 'Titre de l\'encadré…' : 'Titre du bloc…'}
            />
            <span className="shrink-0 text-xs bg-gray-100 rounded-full px-2.5 py-1 text-gray-500 font-medium">{typeLabel[b.type]}</span>
            <button type="button" onClick={() => remove(b.id)} className="shrink-0 btn-wiki btn-wiki-ghost text-red-500 hover:text-red-700 hover:bg-red-50 text-lg leading-none w-8 h-8 flex items-center justify-center" title="Supprimer ce bloc">×</button>
          </div>

          {/* Block content */}
          {b.type === 'image' ? (
            <div className="space-y-2">
              {b.contenu && !pending && (
                <div className="rounded-lg overflow-hidden bg-gray-50 flex items-center justify-center">
                  <img src={b.contenu} alt={b.titre || ''} className="max-h-64 max-w-full object-contain" />
                </div>
              )}
              {pending?.blockId === b.id ? (
                <div className="border-2 border-blue-200 rounded-xl p-3 bg-blue-50 space-y-3">
                  <img src={pending.previewUrl} alt="aperçu" className="max-h-40 max-w-full rounded-lg object-contain mx-auto block" />
                  <div>
                    <p className="text-xs text-gray-500 mb-1 font-medium">Nom du fichier</p>
                    <div className="flex items-center gap-1.5">
                      <input autoFocus value={pending.name} onChange={e => setPending(p => p ? { ...p, name: e.target.value } : null)} onKeyDown={e => { if (e.key === 'Enter') confirmUpload(); if (e.key === 'Escape') cancelPending() }} className="flex-1 border border-gray-300 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:border-blue-400 font-mono" placeholder="nom-du-fichier" />
                      <span className="text-xs text-gray-400 shrink-0 font-mono">{pending.ext}</span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button type="button" onClick={confirmUpload} className="flex-1 py-2 rounded-lg bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 transition-colors">↑ Uploader</button>
                    <button type="button" onClick={cancelPending} className="px-4 py-2 rounded-lg border border-gray-300 text-gray-600 text-sm hover:bg-gray-50 transition-colors">Annuler</button>
                  </div>
                </div>
              ) : (
                <div className="flex gap-2">
                  <label className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg border-2 border-dashed cursor-pointer transition-colors text-sm font-medium ${uploading[b.id] ? 'border-gray-200 text-gray-400 cursor-not-allowed' : 'border-gray-300 text-gray-500 hover:border-[var(--gold)] hover:text-gray-700'}`}>
                    {uploading[b.id] ? <span>Upload en cours…</span> : <><span>↑</span><span>{b.contenu ? 'Changer' : 'Uploader'}</span></>}
                    <input ref={el => { fileInputRefs.current[b.id] = el }} type="file" accept="image/*" className="hidden" disabled={uploading[b.id]} onChange={e => { const f = e.target.files?.[0]; if (f) handleFileSelect(b.id, f); e.target.value = '' }} />
                  </label>
                  <button type="button" onClick={() => setPickerBlockId(b.id)} className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg border-2 border-dashed border-gray-300 text-gray-500 hover:border-[var(--gold)] hover:text-gray-700 transition-colors text-sm font-medium">
                    <span>🖼</span><span>Bibliothèque</span>
                  </button>
                </div>
              )}
            </div>
          ) : b.type === 'table' ? (
            <TableEditor
              data={parseTable(b.contenu)}
              onChange={d => update(b.id, { contenu: JSON.stringify(d) })}
            />
          ) : b.type === 'callout' ? (
            <div className="space-y-2">
              <div className="flex gap-1.5 flex-wrap">
                {CALLOUT_VARIANTS.map(v => (
                  <button key={v.key} type="button" onClick={() => update(b.id, { variant: v.key })}
                    className={`px-2.5 py-1 rounded-full text-xs font-medium border-2 transition-all ${(b.variant ?? 'info') === v.key ? v.cls + ' border-current' : 'border-gray-200 text-gray-500 hover:border-gray-400'}`}>
                    {v.icon} {v.label}
                  </button>
                ))}
              </div>
              <WikiEditor content={b.contenu} onChange={html => update(b.id, { contenu: html })} />
            </div>
          ) : (
            <WikiEditor content={b.contenu} onChange={html => update(b.id, { contenu: html })} />
          )}
        </div>
      ))}

      {/* Add block buttons */}
      <div className="flex gap-2 flex-wrap">
        {(['text', 'list', 'image', 'table', 'callout'] as Block['type'][]).map(type => (
          <button key={type} type="button" onClick={() => add(type)}
            className="flex-1 min-w-24 py-3 border-2 border-dashed border-gray-300 rounded-xl text-gray-500 hover:border-[var(--gold)] hover:text-gray-700 transition-colors text-sm font-medium">
            {type === 'text' ? '+ Texte' : type === 'list' ? '+ Liste' : type === 'image' ? '+ Image' : type === 'table' ? '+ Tableau' : '+ Encadré'}
          </button>
        ))}
      </div>

      {pickerBlockId && (
        <ImagePickerModal onSelect={url => update(pickerBlockId, { contenu: url })} onClose={() => setPickerBlockId(null)} />
      )}
    </div>
  )
}
