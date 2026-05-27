import Link from 'next/link'
import { getAllPays, getCurrentUser } from '@/lib/wiki-data'

export const metadata = { title: 'MINAMIX — Les Pays' }

export default async function PaysPage() {
  const [pays, user] = await Promise.all([getAllPays(), getCurrentUser()])

  return (
    <div>
      <div className="wiki-page-header">
        <h1 className="text-4xl font-bold mb-2" style={{ fontFamily: 'var(--font-heading)', letterSpacing: '0.12em' }}>Les Pays</h1>
      </div>

      {user && (
        <div className="flex justify-end mb-6">
          <Link href="/wiki/nouveau-pays" className="btn-wiki btn-wiki-primary">+ Nouveau pays</Link>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {pays.map((p) => (
          <Link
            key={p.slug}
            href={`/pays/${p.slug}`}
            className="rounded-lg p-7 text-white shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-200"
            style={{ backgroundColor: p.couleur, border: '1px solid rgba(0,0,0,0.12)' }}
          >
            <h2 className="text-2xl font-bold mb-3 text-left" style={{ fontFamily: 'var(--font-heading)', letterSpacing: '0.08em' }}>{p.nom}</h2>
            <p className="text-sm leading-relaxed opacity-90" style={{ fontStyle: 'italic' }}>
              {typeof p.geographie === 'string' && !p.geographie.includes('<')
                ? p.geographie.substring(0, 180)
                : p.geographie?.replace(/<[^>]+>/g, '').substring(0, 180)}
              {(p.geographie?.length ?? 0) > 180 ? '…' : ''}
            </p>
          </Link>
        ))}
      </div>
    </div>
  )
}
