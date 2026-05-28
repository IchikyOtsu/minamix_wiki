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
        <div className="mt-8">
          <a
            href="https://discord.gg/3YdFKxfBFA"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-3 px-7 py-3 rounded-full font-semibold transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg"
            style={{
              background: 'linear-gradient(135deg, #5865F2 0%, #404EED 100%)',
              color: '#fff',
              fontFamily: 'var(--font-heading)',
              letterSpacing: '0.08em',
              fontSize: '0.9rem',
              boxShadow: '0 4px 18px rgba(88,101,242,0.35)',
            }}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057c.002.022.015.04.033.05a19.982 19.982 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 0 0-.041-.106 13.201 13.201 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z"/>
            </svg>
            Rejoindre le serveur Discord
          </a>
        </div>
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
                {p.blocks?.[0]?.contenu?.replace(/<[^>]+>/g, '').substring(0, 75) ?? ''}…
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
