import Link from 'next/link'
import { getAllPays, getAllRaces, getAllRyximus } from '@/lib/wiki-data'

export default async function Home() {
  const [pays, races, ryximus] = await Promise.all([getAllPays(), getAllRaces(), getAllRyximus()])

  return (
    <div>
      {/* Hero */}
      <section className="wiki-hero mb-10">
        <div className="wiki-hero-ornament">
          <span style={{ fontFamily: 'var(--font-heading)', fontSize: '0.7rem', letterSpacing: '0.35em', color: 'var(--gold)' }}>✦</span>
        </div>
        <h1 className="wiki-hero-title">MINAMIX</h1>
        <div className="wiki-hero-ornament">
          <span style={{ fontFamily: 'var(--font-heading)', fontSize: '0.7rem', letterSpacing: '0.35em', color: 'var(--gold)' }}>✦</span>
        </div>
      </section>

      {/* Intro scroll */}
      <section className="wiki-card wiki-scroll p-10 mb-12 text-center">
        <p className="text-justify leading-loose mx-auto max-w-2xl" style={{ fontSize: '1.1rem', color: 'var(--ink)' }}>
          Minamix est un univers de fantasy riche et détaillé, peuplé de sept races distinctes, gouverné par quatre pays aux
          cultures différentes, et animé par huit entités divines appelées les Ryximus. Un système de magie basé sur le mana
          imprègne ce monde, offrant à ses habitants des capacités extraordinaires selon leurs affinités et leur entraînement.
        </p>
        <p className="text-justify leading-loose mx-auto max-w-2xl mt-4" style={{ fontSize: '1.05rem', color: 'var(--ink-muted)', fontStyle: 'italic' }}>
          Explorez les contrées de Silfus, Lyndera, Frimaz et Ilonaï, découvrez les races qui les peuplent,
          apprenez à connaître les Ryximus qui façonnent le destin des mortels, et plongez dans les mystères
          de la magie qui régit ce monde fascinant.
        </p>
      </section>

      {/* Pays */}
      <section className="mb-12">
        <div className="wiki-divider"><span>Les Pays</span></div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
          {pays.map((p) => (
            <Link
              key={p.slug}
              href={`/pays/${p.slug}`}
              className="rounded-lg p-5 text-white shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-200"
              style={{ backgroundColor: p.couleur, border: '1px solid rgba(0,0,0,0.12)' }}
            >
              <div className="text-base font-semibold mb-2 text-center" style={{ fontFamily: 'var(--font-heading)', letterSpacing: '0.08em' }}>{p.nom}</div>
              <div className="text-xs font-normal opacity-80 leading-relaxed text-center" style={{ fontStyle: 'italic' }}>
                {typeof p.geographie === 'string' && !p.geographie.includes('<')
                  ? p.geographie.substring(0, 75)
                  : p.geographie?.replace(/<[^>]+>/g, '').substring(0, 75)}…
              </div>
            </Link>
          ))}
        </div>
        <div className="mt-4 text-right">
          <Link href="/pays" className="text-sm hover:underline underline-offset-2" style={{ color: 'var(--ink-muted)', fontFamily: 'var(--font-heading)', fontSize: '0.78rem', letterSpacing: '0.08em' }}>
            Tous les pays →
          </Link>
        </div>
      </section>

      {/* Races */}
      <section className="mb-12">
        <div className="wiki-divider"><span>Les Races</span></div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 mt-6">
          {races.map((r) => (
            <Link
              key={r.slug}
              href={`/races/${r.slug}`}
              className="rounded-lg p-4 text-center shadow hover:shadow-md hover:-translate-y-0.5 transition-all duration-200"
              style={{ backgroundColor: r.couleur, border: '1px solid rgba(0,0,0,0.10)' }}
            >
              <div className="font-semibold text-sm" style={{ fontFamily: 'var(--font-heading)' }}>{r.nom}</div>
              <div className="text-xs mt-1.5 opacity-70">{r.population.toLocaleString('fr-FR')} hab.</div>
            </Link>
          ))}
        </div>
        <div className="mt-4 text-right">
          <Link href="/races" className="text-sm hover:underline underline-offset-2" style={{ color: 'var(--ink-muted)', fontFamily: 'var(--font-heading)', fontSize: '0.78rem', letterSpacing: '0.08em' }}>
            Toutes les races →
          </Link>
        </div>
      </section>

      {/* Ryximus */}
      <section className="mb-12">
        <div className="wiki-divider"><span>Les Ryximus</span></div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6">
          {ryximus.map((r) => (
            <Link
              key={r.slug}
              href={`/ryximus/${r.slug}`}
              className="rounded-lg p-4 text-white text-center shadow hover:shadow-md hover:-translate-y-0.5 transition-all duration-200"
              style={{ backgroundColor: r.couleur, border: '1px solid rgba(0,0,0,0.15)' }}
            >
              <div className="font-bold text-sm mb-0.5" style={{ fontFamily: 'var(--font-heading)' }}>{r.nom}</div>
              <div className="text-xs opacity-80">{r.element}</div>
            </Link>
          ))}
        </div>
        <div className="mt-4 text-right">
          <Link href="/ryximus" className="text-sm hover:underline underline-offset-2" style={{ color: 'var(--ink-muted)', fontFamily: 'var(--font-heading)', fontSize: '0.78rem', letterSpacing: '0.08em' }}>
            Tous les Ryximus →
          </Link>
        </div>
      </section>

      {/* Explorer */}
      <div className="wiki-divider"><span>Explorer</span></div>
      <section className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6 mb-4">
        <Link href="/magie" className="wiki-card p-7 hover:-translate-y-0.5 transition-all duration-200 text-center block">
          <div className="text-2xl mb-2" style={{ color: 'var(--gold)' }}>✦</div>
          <h3 className="text-lg font-semibold mb-2" style={{ fontFamily: 'var(--font-heading)', textDecoration: 'none', letterSpacing: '0.08em' }}>La Magie</h3>
          <p className="text-sm" style={{ color: 'var(--ink-muted)', fontStyle: 'italic' }}>Découvrez le système de magie et les affinités élémentaires</p>
        </Link>
        <Link href="/annexes" className="wiki-card p-7 hover:-translate-y-0.5 transition-all duration-200 text-center block">
          <div className="text-2xl mb-2" style={{ color: 'var(--gold)' }}>✦</div>
          <h3 className="text-lg font-semibold mb-2" style={{ fontFamily: 'var(--font-heading)', textDecoration: 'none', letterSpacing: '0.08em' }}>Annexes</h3>
          <p className="text-sm" style={{ color: 'var(--ink-muted)', fontStyle: 'italic' }}>Informations complémentaires, chronologie et références</p>
        </Link>
      </section>
    </div>
  )
}
