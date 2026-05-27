import Link from 'next/link'
import { getAllPays, getCurrentUser } from '@/lib/wiki-data'

export const metadata = { title: 'MINAMIX — Les Pays' }

export default async function PaysPage() {
  const [pays, user] = await Promise.all([getAllPays(), getCurrentUser()])

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-4xl font-bold" style={{ fontFamily: 'var(--font-heading)' }}>Les Pays de Minamix</h1>
        {user && (
          <Link href="/wiki/nouveau-pays" className="px-4 py-2 bg-[#747474] text-white rounded-lg text-sm hover:bg-[#5a5a5a] transition-colors">
            + Nouveau pays
          </Link>
        )}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {pays.map((p) => (
          <Link key={p.slug} href={`/pays/${p.slug}`} className="rounded-lg p-6 text-white shadow hover:opacity-90 hover:scale-[1.02] transition-all duration-200" style={{ backgroundColor: p.couleur }}>
            <h2 className="text-2xl font-bold mb-3" style={{ fontFamily: 'var(--font-heading)' }}>{p.nom}</h2>
            <p className="text-sm opacity-90 leading-relaxed">
              {typeof p.geographie === 'string' && !p.geographie.includes('<')
                ? p.geographie
                : p.geographie?.replace(/<[^>]+>/g, '').substring(0, 200)}
            </p>
          </Link>
        ))}
      </div>
    </div>
  )
}
