'use client'

import { useState } from 'react'
import type { Block } from '@/types/blocks'

interface Props {
  blocks: Block[]
  accentColor?: string
}

export function TableOfContents({ blocks, accentColor }: Props) {
  const [open, setOpen] = useState(false)

  const titles = blocks.filter(b => b.titre && b.type !== 'image')
  if (titles.length === 0) return null

  function scrollTo(id: string) {
    const el = document.getElementById(id)
    if (!el) return
    const offset = 80 // navbar height
    const top = el.getBoundingClientRect().top + window.scrollY - offset
    window.scrollTo({ top, behavior: 'smooth' })
    setOpen(false)
  }

  return (
    <div className="fixed top-1/2 -translate-y-1/2 right-0 z-40 flex items-stretch">
      {/* Panel */}
      <div
        className="overflow-hidden transition-all duration-300 ease-in-out"
        style={{ width: open ? '14rem' : '0', opacity: open ? 1 : 0 }}
      >
        <div className="bg-white shadow-xl rounded-l-xl border border-r-0 border-gray-200 py-3 w-56">
          <p className="px-4 pb-2 text-xs font-semibold uppercase tracking-wider" style={{ color: accentColor ?? 'var(--gold)' }}>
            Sommaire
          </p>
          <nav>
            {titles.map(b => (
              <button
                key={b.id}
                type="button"
                onClick={() => scrollTo(b.id)}
                className="w-full text-left px-4 py-1.5 text-sm text-gray-700 hover:bg-gray-50 hover:text-gray-900 truncate transition-colors block"
                title={b.titre}
              >
                {b.titre}
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Toggle button */}
      <button
        type="button"
        onClick={() => setOpen(o => !o)}
        title={open ? 'Fermer le sommaire' : 'Ouvrir le sommaire'}
        className="flex flex-col gap-[5px] items-center justify-center w-8 h-12 bg-white shadow-md rounded-l-lg border border-r-0 border-gray-200 hover:bg-gray-50 transition-colors shrink-0 group"
        style={{ borderColor: open ? (accentColor ?? 'var(--gold)') : undefined }}
      >
        <span className="block w-3.5 h-px bg-gray-500 group-hover:bg-gray-700 transition-colors" />
        <span className="block w-3.5 h-px bg-gray-500 group-hover:bg-gray-700 transition-colors" />
        <span className="block w-3.5 h-px bg-gray-500 group-hover:bg-gray-700 transition-colors" />
      </button>
    </div>
  )
}
