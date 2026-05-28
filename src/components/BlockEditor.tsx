'use client'

import { WikiEditor } from './WikiEditor'
import type { Block } from '@/types/blocks'

interface Props {
  blocks: Block[]
  onChange: (blocks: Block[]) => void
}

export function BlockEditor({ blocks, onChange }: Props) {
  function add(type: 'text' | 'list') {
    const id = crypto.randomUUID()
    const contenu = type === 'list' ? '<ul><li></li></ul>' : ''
    onChange([...blocks, { id, type, titre: '', contenu }])
  }

  function remove(id: string) {
    onChange(blocks.filter((b) => b.id !== id))
  }

  function update(id: string, patch: Partial<Block>) {
    onChange(blocks.map((b) => (b.id === id ? { ...b, ...patch } : b)))
  }

  function move(i: number, dir: -1 | 1) {
    const j = i + dir
    if (j < 0 || j >= blocks.length) return
    const next = [...blocks]
    ;[next[i], next[j]] = [next[j], next[i]]
    onChange(next)
  }

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
              placeholder="Titre du bloc…"
            />
            <span className="shrink-0 text-xs bg-gray-100 rounded-full px-2.5 py-1 text-gray-500 font-medium">
              {b.type === 'list' ? 'Liste' : 'Texte'}
            </span>
            <button
              type="button"
              onClick={() => remove(b.id)}
              className="shrink-0 btn-wiki btn-wiki-ghost text-red-500 hover:text-red-700 hover:bg-red-50 text-lg leading-none w-8 h-8 flex items-center justify-center"
              title="Supprimer ce bloc"
            >×</button>
          </div>
          <WikiEditor
            content={b.contenu}
            onChange={(html) => update(b.id, { contenu: html })}
          />
        </div>
      ))}

      <div className="flex gap-2 flex-wrap">
        <button
          type="button"
          onClick={() => add('text')}
          className="flex-1 min-w-32 py-3 border-2 border-dashed border-gray-300 rounded-xl text-gray-500 hover:border-[var(--gold)] hover:text-gray-700 transition-colors text-sm font-medium"
        >
          + Ajouter un bloc texte
        </button>
        <button
          type="button"
          onClick={() => add('list')}
          className="flex-1 min-w-32 py-3 border-2 border-dashed border-gray-300 rounded-xl text-gray-500 hover:border-[var(--gold)] hover:text-gray-700 transition-colors text-sm font-medium"
        >
          + Ajouter une liste
        </button>
      </div>
    </div>
  )
}
