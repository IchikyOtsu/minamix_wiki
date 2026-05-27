import Link from 'next/link'
import { getAllRaces, getCurrentUser } from '@/lib/wiki-data'

export const metadata = { title: 'MINAMIX — Les Races' }

export default async function RacesPage() {
  const [races, user] = await Promise.all([getAllRaces(), getCurrentUser()])

  return (
    <div>
      <div className="wiki-page-header">
        <h1 className="text-4xl font-bold mb-2" style={{ fontFamily: 'var(--font-heading)', letterSpacing: '0.12em' }}>Les Races</h1>
        <p className="text-sm italic" style={{ color: 'var(--ink-muted)' }}>Les sept peuples qui habitent le monde de Minamix</p>
      </div>

      {user && (
        <div className="flex justify-end mb-6">
          <Link href="/wiki/nouvelle-race" className="btn-wiki btn-wiki-primary">+ Nouvelle race</Link>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {races.map((r) => (
          <Link
            key={r.slug}
            href={`/races/${r.slug}`}
            className="rounded-lg p-7 shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-200"
            style={{ backgroundColor: r.couleur, border: '1px solid rgba(0,0,0,0.10)' }}
          >
            <div className="flex justify-between items-start mb-3 gap-3">
              <h2 className="text-xl font-bold text-left" style={{ fontFamily: 'var(--font-heading)' }}>{r.nom}</h2>
              <span className="shrink-0 text-xs bg-white/60 rounded-full px-3 py-1 font-medium" style={{ fontFamily: 'var(--font-heading)', fontSize: '0.7rem' }}>
                {r.population.toLocaleString('fr-FR')} hab.
              </span>
            </div>
            <p className="text-sm leading-relaxed opacity-85" style={{ fontStyle: 'italic' }}>
              {typeof r.description === 'string' && !r.description.includes('<')
                ? r.description.substring(0, 160)
                : r.description?.replace(/<[^>]+>/g, '').substring(0, 160)}
              {(r.description?.length ?? 0) > 160 ? '…' : ''}
            </p>
            <p className="text-xs opacity-60 mt-3">Espérance de vie : {r.esperanceVie}</p>
          </Link>
        ))}
      </div>
    </div>
  )
}
