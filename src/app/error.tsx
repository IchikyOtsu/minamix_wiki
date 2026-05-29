'use client'

import { useEffect } from 'react'
import Link from 'next/link'

export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => { console.error(error) }, [error])

  return (
    <div className="flex flex-col items-center justify-center min-h-[50vh] text-center px-4">
      <p className="text-6xl mb-6" style={{ fontFamily: 'var(--font-heading)' }}>⚠</p>
      <h1 className="text-2xl font-bold mb-3" style={{ fontFamily: 'var(--font-heading)', color: 'var(--ink)' }}>
        Une erreur est survenue
      </h1>
      <p className="text-gray-500 mb-8 max-w-sm">
        Quelque chose s'est mal passé. Tu peux réessayer ou revenir à l'accueil.
      </p>
      <div className="flex gap-3">
        <button
          onClick={reset}
          className="btn-wiki btn-wiki-primary"
        >
          Réessayer
        </button>
        <Link href="/" className="btn-wiki btn-wiki-ghost">
          Accueil
        </Link>
      </div>
    </div>
  )
}
