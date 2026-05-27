import Link from 'next/link'
import { getAllRyximus, getCurrentUser } from '@/lib/wiki-data'

export const metadata = { title: 'MINAMIX — Les Ryximus' }

export default async function RyximusPage() {
  const [ryximus, user] = await Promise.all([getAllRyximus(), getCurrentUser()])

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-4xl font-bold" style={{ fontFamily: 'var(--font-heading)' }}>Les Ryximus</h1>
        {user && (
          <Link href="/wiki/nouveau-ryximus" className="px-4 py-2 bg-[#747474] text-white rounded-lg text-sm hover:bg-[#5a5a5a] transition-colors">
            + Nouveau Ryximus
          </Link>
        )}
      </div>
      <p className="text-center text-gray-700 mb-10 italic">Les huit entités divines qui façonnent le destin du monde de Minamix</p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {ryximus.map((r) => (
          <Link key={r.slug} href={`/ryximus/${r.slug}`} className="rounded-lg p-6 text-white shadow hover:opacity-90 hover:scale-[1.02] transition-all duration-200" style={{ backgroundColor: r.couleur }}>
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-2xl font-bold" style={{ fontFamily: 'var(--font-heading)' }}>{r.nom}</h2>
              <span className="text-sm opacity-80 bg-white bg-opacity-20 rounded-full px-3 py-1">{r.element}</span>
            </div>
            <p className="text-sm opacity-90 italic leading-relaxed">&ldquo;{r.citation}&rdquo;</p>
            <p className="text-xs opacity-70 mt-2">{r.genre}</p>
          </Link>
        ))}
      </div>
    </div>
  )
}
