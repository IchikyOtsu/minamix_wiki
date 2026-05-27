import Link from 'next/link'
import { getAllRaces, getCurrentUser } from '@/lib/wiki-data'

export const metadata = { title: 'MINAMIX — Les Races' }

export default async function RacesPage() {
  const [races, user] = await Promise.all([getAllRaces(), getCurrentUser()])

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-4xl font-bold" style={{ fontFamily: 'var(--font-heading)' }}>Les Races de Minamix</h1>
        {user && (
          <Link href="/wiki/nouvelle-race" className="px-4 py-2 bg-[#747474] text-white rounded-lg text-sm hover:bg-[#5a5a5a] transition-colors">
            + Nouvelle race
          </Link>
        )}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {races.map((r) => (
          <Link key={r.slug} href={`/races/${r.slug}`} className="rounded-lg p-6 shadow hover:opacity-90 hover:scale-[1.02] transition-all duration-200 border border-gray-200" style={{ backgroundColor: r.couleur }}>
            <div className="flex justify-between items-start mb-3">
              <h2 className="text-xl font-bold" style={{ fontFamily: 'var(--font-heading)' }}>{r.nom}</h2>
              <span className="text-xs bg-white bg-opacity-70 rounded-full px-3 py-1">{r.population.toLocaleString()} hab.</span>
            </div>
            <p className="text-sm text-gray-800 leading-relaxed">
              {typeof r.description === 'string' && !r.description.includes('<')
                ? r.description
                : r.description?.replace(/<[^>]+>/g, '').substring(0, 200)}
            </p>
            <p className="text-xs text-gray-600 mt-3">Espérance de vie : {r.esperanceVie}</p>
          </Link>
        ))}
      </div>
    </div>
  )
}
