'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import Link from 'next/link'
import { searchWiki, type SearchResult } from '@/lib/search'

const TYPE_STYLE: Record<string, string> = {
  Pays:    'bg-blue-100 text-blue-700',
  Race:    'bg-purple-100 text-purple-700',
  Ryximus: 'bg-rose-100 text-rose-700',
  Magie:   'bg-amber-100 text-amber-700',
}

interface Props { onClose: () => void }

export function SearchModal({ onClose }: Props) {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<SearchResult[]>([])
  const [loading, setLoading] = useState(false)
  const [selected, setSelected] = useState(-1)
  const inputRef = useRef<HTMLInputElement>(null)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const listRef = useRef<HTMLUListElement>(null)

  useEffect(() => { inputRef.current?.focus() }, [])

  useEffect(() => {
    if (timerRef.current) clearTimeout(timerRef.current)
    if (query.trim().length < 2) { setResults([]); setLoading(false); return }
    setLoading(true)
    timerRef.current = setTimeout(async () => {
      const r = await searchWiki(query)
      setResults(r)
      setSelected(-1)
      setLoading(false)
    }, 280)
    return () => { if (timerRef.current) clearTimeout(timerRef.current) }
  }, [query])

  const handleKey = useCallback((e: KeyboardEvent) => {
    if (e.key === 'Escape') { onClose(); return }
    if (e.key === 'ArrowDown') { e.preventDefault(); setSelected(s => Math.min(s + 1, results.length - 1)) }
    if (e.key === 'ArrowUp') { e.preventDefault(); setSelected(s => Math.max(s - 1, -1)) }
    if (e.key === 'Enter' && selected >= 0 && results[selected]) {
      onClose()
      window.location.href = results[selected].href
    }
  }, [onClose, results, selected])

  useEffect(() => {
    document.addEventListener('keydown', handleKey)
    return () => document.removeEventListener('keydown', handleKey)
  }, [handleKey])

  // Scroll selected item into view
  useEffect(() => {
    if (selected >= 0 && listRef.current) {
      listRef.current.children[selected]?.scrollIntoView({ block: 'nearest' })
    }
  }, [selected])

  const showEmpty = query.length >= 2 && !loading && results.length === 0
  const showHint = query.length < 2

  return (
    <div
      className="fixed inset-0 z-[200] flex items-start justify-center pt-[8vh] px-4"
      style={{ background: 'rgba(10,5,0,0.65)', backdropFilter: 'blur(6px)' }}
      onClick={e => { if (e.target === e.currentTarget) onClose() }}
    >
      <div className="w-full max-w-xl bg-white rounded-2xl shadow-2xl overflow-hidden">
        {/* Input row */}
        <div className="flex items-center gap-3 px-4 py-3.5 border-b border-gray-100">
          <svg className="w-5 h-5 text-gray-400 shrink-0" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
          </svg>
          <input
            ref={inputRef}
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Rechercher dans le wiki…"
            className="flex-1 text-base outline-none placeholder-gray-400 bg-transparent"
            autoComplete="off"
            spellCheck={false}
          />
          {loading && (
            <span className="text-xs text-gray-400 shrink-0 animate-pulse">Recherche…</span>
          )}
          <kbd
            onClick={onClose}
            className="shrink-0 text-xs text-gray-400 border border-gray-200 rounded px-1.5 py-0.5 cursor-pointer hover:bg-gray-50 select-none"
          >
            Échap
          </kbd>
        </div>

        {/* Results */}
        {results.length > 0 && (
          <ul ref={listRef} className="max-h-[62vh] overflow-y-auto py-1.5 divide-y divide-gray-50">
            {results.map((r, i) => (
              <li key={i}>
                <Link
                  href={r.href}
                  onClick={onClose}
                  className={`flex flex-col gap-1 px-4 py-3 transition-colors ${selected === i ? 'bg-gray-50' : 'hover:bg-gray-50'}`}
                >
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className={`text-xs font-semibold px-2 py-0.5 rounded-full shrink-0 ${TYPE_STYLE[r.type] ?? ''}`}>
                      {r.type}
                    </span>
                    <span className="font-semibold text-sm text-gray-800">{r.nom}</span>
                    {r.blockTitre && (
                      <span className="text-xs text-gray-400 truncate">· {r.blockTitre}</span>
                    )}
                  </div>
                  {r.snippet && (
                    <p className="text-xs text-gray-500 line-clamp-2 leading-relaxed">{r.snippet}</p>
                  )}
                </Link>
              </li>
            ))}
          </ul>
        )}

        {showEmpty && (
          <div className="py-12 text-center text-sm text-gray-400">
            Aucun résultat pour «&nbsp;{query}&nbsp;»
          </div>
        )}

        {showHint && (
          <div className="py-12 text-center text-sm text-gray-400">
            Tapez au moins 2 caractères pour lancer la recherche
          </div>
        )}

        <div className="px-4 py-2 border-t border-gray-50 flex gap-4 text-xs text-gray-300">
          <span>↑↓ naviguer</span>
          <span>↵ ouvrir</span>
          <span>Échap fermer</span>
        </div>
      </div>
    </div>
  )
}
