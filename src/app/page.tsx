import Link from 'next/link'
import { getAllPays, getAllRaces, getAllRyximus } from '@/lib/wiki-data'

export default async function Home() {
  const [pays, races, ryximus] = await Promise.all([getAllPays(), getAllRaces(), getAllRyximus()])

  return (
    <div>
      {/* Hero */}
      <section className="wiki-hero mb-10">
        <h1 className="wiki-hero-title">MINAMIX</h1>
        <p className="wiki-hero-sub">Bienvenue dans le monde de Minamix</p>
        <div className="wiki-hero-rule" />
      </section>

      {/* Qu'est-ce que Minamix ? */}
      <section className="wiki-card p-8 mb-10">
        <h2 className="wiki-section-title">Qu&apos;est-ce que Minamix ?</h2>
        <p className="text-justify leading-relaxed text-gray-800">
          Minamix est un univers de fantasy riche et détaillé, peuplé de sept races distinctes, gouverné par quatre pays aux
          cultures différentes, et animé par huit entités divines appelées les Ryximus. Un système de magie basé sur le mana
          imprègne ce monde, offrant à ses habitants des capacités extraordinaires selon leurs affinités et leur entraînement.
        </p>
        <p className="text-justify leading-relaxed text-gray-800 mt-4">
          Explorez les contrées de Silfus, Lyndera, Frimaz et Ilonaï, découvrez les races qui les peuplent, apprenez à
          connaître les Ryximus qui façonnent le destin des mortels, et plongez dans les mystères de la magie qui régit ce
          monde fascinant.
        </p>
      </section>

      {/* Pays */}
      <section className="mb-10">
        <div className="wiki-divider"><span>Les Pays</span></div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {pays.map((p) => (
            <Link
              key={p.slug}
              href={`/pays/${p.slug}`}
              className="rounded-xl p-5 text-white font-semibold text-center shadow-md hover:shadow-xl hover:-translate-y-0.5 transition-all duration-200"
              style={{ backgroundColor: p.couleur }}
            >
              <div className="text-lg mb-2" style={{ fontFamily: 'var(--font-heading)' }}>{p.nom}</div>
              <div className="text-xs font-normal opacity-85 leading-relaxed">
                {typeof p.geographie === 'string' && !p.geographie.includes('<')
                  ? p.geographie.substring(0, 80)
                  : p.geographie?.replace(/<[^>]+>/g, '').substring(0, 80)}…
              </div>
            </Link>
          ))}
        </div>
        <div className="mt-4 text-right">
          <Link href="/pays" className="text-sm text-gray-600 hover:text-gray-900 underline underline-offset-2">
            Tous les pays →
          </Link>
        </div>
      </section>

      {/* Races */}
      <section className="mb-10">
        <div className="wiki-divider"><span>Les Races</span></div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
          {races.map((r) => (
            <Link
              key={r.slug}
              href={`/races/${r.slug}`}
              className="rounded-xl p-4 text-center shadow hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 border border-black/5"
              style={{ backgroundColor: r.couleur }}
            >
              <div className="font-semibold text-sm" style={{ fontFamily: 'var(--font-heading)' }}>{r.nom}</div>
              <div className="text-xs text-gray-700 mt-1">{r.population.toLocaleString()} hab.</div>
            </Link>
          ))}
        </div>
        <div className="mt-4 text-right">
          <Link href="/races" className="text-sm text-gray-600 hover:text-gray-900 underline underline-offset-2">
            Toutes les races →
          </Link>
        </div>
      </section>

      {/* Ryximus */}
      <section className="mb-10">
        <div className="wiki-divider"><span>Les Ryximus</span></div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {ryximus.map((r) => (
            <Link
              key={r.slug}
              href={`/ryximus/${r.slug}`}
              className="rounded-xl p-4 text-white text-center shadow hover:shadow-md hover:-translate-y-0.5 transition-all duration-200"
              style={{ backgroundColor: r.couleur }}
            >
              <div className="font-bold text-sm" style={{ fontFamily: 'var(--font-heading)' }}>{r.nom}</div>
              <div className="text-xs mt-1 opacity-85">{r.element}</div>
            </Link>
          ))}
        </div>
        <div className="mt-4 text-right">
          <Link href="/ryximus" className="text-sm text-gray-600 hover:text-gray-900 underline underline-offset-2">
            Tous les Ryximus →
          </Link>
        </div>
      </section>

      {/* Liens rapides */}
      <div className="wiki-divider"><span>Explorer</span></div>
      <section className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
        <Link href="/magie" className="wiki-card p-6 hover:-translate-y-0.5 transition-all duration-200 text-center block">
          <h3 className="text-xl font-semibold mb-2 no-underline" style={{ fontFamily: 'var(--font-heading)', textDecoration: 'none' }}>
            ✦ La Magie
          </h3>
          <p className="text-gray-600 text-sm">Découvrez le système de magie et les affinités élémentaires</p>
        </Link>
        <Link href="/annexes" className="wiki-card p-6 hover:-translate-y-0.5 transition-all duration-200 text-center block">
          <h3 className="text-xl font-semibold mb-2" style={{ fontFamily: 'var(--font-heading)', textDecoration: 'none' }}>
            ✦ Annexes
          </h3>
          <p className="text-gray-600 text-sm">Informations complémentaires et références</p>
        </Link>
      </section>
    </div>
  )
}
