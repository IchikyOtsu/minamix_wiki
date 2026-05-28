import Link from 'next/link'
import { getAllRyximus, getCurrentUser } from '@/lib/wiki-data'

export const metadata = { title: 'MINAMIX — Les Ryximus' }

export default async function RyximusPage() {
  const [ryximus, user] = await Promise.all([getAllRyximus(), getCurrentUser()])

  return (
    <div>
      <div className="wiki-page-header">
        <h1 className="text-4xl font-bold mb-2" style={{ fontFamily: 'var(--font-heading)', letterSpacing: '0.12em' }}>Les Ryximus</h1>
      </div>

      {user && (
        <div className="flex justify-end mb-6">
          <Link href="/wiki/nouveau-ryximus" className="btn-wiki btn-wiki-primary">+ Nouveau Ryximus</Link>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {ryximus.map((r) => (
          <Link
            key={r.slug}
            href={`/ryximus/${r.slug}`}
            className="rounded-lg p-7 text-white shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-200"
            style={{ backgroundColor: r.couleur, border: '1px solid rgba(0,0,0,0.15)' }}
          >
            <div className="flex items-start justify-between gap-3 mb-3">
              <h2 className="text-2xl font-bold text-left" style={{ fontFamily: 'var(--font-heading)' }}>{r.nom}</h2>
              <span className="shrink-0 text-xs bg-white/20 border border-white/30 rounded-full px-3 py-1 mt-1">
                {r.element}
              </span>
            </div>
            <p className="text-sm opacity-80 leading-relaxed">
              {r.personnalite?.replace(/<[^>]+>/g, '').substring(0, 120)}…
            </p>
            <p className="text-xs opacity-55 mt-3" style={{ fontFamily: 'var(--font-heading)', letterSpacing: '0.06em' }}>{r.genre}</p>
          </Link>
        ))}
      </div>
    </div>
  )
}
