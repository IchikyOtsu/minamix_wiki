import { RichText } from './RichText'
import type { Block } from '@/types/blocks'

export function BlockView({ block }: { block: Block }) {
  if (block.type === 'image') {
    if (!block.contenu) return null
    return (
      <div className="wiki-card p-4">
        <figure>
          <img
            src={block.contenu}
            alt={block.titre || ''}
            className="w-full rounded-lg max-h-[32rem] object-contain"
          />
          {block.titre && (
            <figcaption className="text-sm text-center mt-2 italic" style={{ color: 'var(--ink-muted)' }}>
              {block.titre}
            </figcaption>
          )}
        </figure>
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
