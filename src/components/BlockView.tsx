import { RichText } from './RichText'
import { parseTable } from '@/types/blocks'
import type { Block } from '@/types/blocks'

const CALLOUT = {
  info:    { bg: 'bg-blue-50',   border: 'border-blue-400',  title: 'text-blue-800',  icon: 'ℹ️',  label: 'Info' },
  warning: { bg: 'bg-amber-50',  border: 'border-amber-400', title: 'text-amber-800', icon: '⚠️', label: 'Avertissement' },
  success: { bg: 'bg-green-50',  border: 'border-green-500', title: 'text-green-800', icon: '✓',  label: 'Succès' },
  quote:   { bg: 'bg-gray-50',   border: 'border-gray-400',  title: 'text-gray-700',  icon: '❝',  label: 'Citation' },
  danger:  { bg: 'bg-red-50',    border: 'border-red-400',   title: 'text-red-800',   icon: '⚡', label: 'Danger' },
} as const

export function BlockView({ block }: { block: Block }) {
  if (block.type === 'image') {
    if (!block.contenu) return null
    return (
      <div className="wiki-card p-4">
        <figure>
          <img src={block.contenu} alt={block.titre || ''} className="w-full rounded-lg max-h-[32rem] object-contain" />
          {block.titre && (
            <figcaption className="text-sm text-center mt-2 italic" style={{ color: 'var(--ink-muted)' }}>
              {block.titre}
            </figcaption>
          )}
        </figure>
      </div>
    )
  }

  if (block.type === 'table') {
    const { headers, rows } = parseTable(block.contenu)
    return (
      <div className="wiki-card p-4 overflow-x-auto">
        {block.titre && <h3 className="wiki-section-title">{block.titre}</h3>}
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr>
              {headers.map((h, i) => (
                <th key={i} className="text-left px-3 py-2 font-semibold border-b-2 border-gray-200" style={{ color: 'var(--ink)' }}>
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, ri) => (
              <tr key={ri} className={ri % 2 === 1 ? 'bg-gray-50' : ''}>
                {row.map((cell, ci) => (
                  <td key={ci} className="px-3 py-2 border-b border-gray-100" style={{ color: 'var(--ink)' }}>
                    {cell}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    )
  }

  if (block.type === 'callout') {
    const key = (block.variant ?? 'info') as keyof typeof CALLOUT
    const style = CALLOUT[key] ?? CALLOUT.info
    return (
      <div className={`wiki-card border-l-4 p-5 ${style.bg} ${style.border}`}>
        {block.titre && (
          <p className={`font-bold mb-2 flex items-center gap-2 ${style.title}`}>
            <span>{style.icon}</span>
            <span>{block.titre}</span>
          </p>
        )}
        <RichText content={block.contenu} />
      </div>
    )
  }

  return (
    <div className="wiki-card p-6">
      {block.titre && <h3 className="wiki-section-title">{block.titre}</h3>}
      <RichText content={block.contenu} />
    </div>
  )
}
