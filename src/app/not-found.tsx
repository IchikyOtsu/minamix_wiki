import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[50vh] text-center px-4">
      <p className="text-6xl mb-6" style={{ fontFamily: 'var(--font-heading)' }}>404</p>
      <h1 className="text-2xl font-bold mb-3" style={{ fontFamily: 'var(--font-heading)', color: 'var(--ink)' }}>
        Page introuvable
      </h1>
      <p className="text-gray-500 mb-8 max-w-sm">
        Cette page n'existe pas ou a été déplacée.
      </p>
      <Link href="/" className="btn-wiki btn-wiki-primary">
        Retour à l'accueil
      </Link>
    </div>
  )
}
