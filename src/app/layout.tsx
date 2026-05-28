import type { Metadata } from 'next'
import './globals.css'
import Navigation from '@/components/Navigation'
import { getAllPays } from '@/lib/wiki-data'
import { getAllRaces } from '@/lib/wiki-data'
import { getAllRyximus } from '@/lib/wiki-data'
import { getCurrentUser } from '@/lib/wiki-data'

export const metadata: Metadata = {
  title: 'MINAMIX',
  description: 'Le monde de Minamix — univers de fantasy',
  authors: [{ name: 'ato_nie' }, { name: 'fleuve56' }],
  creator: 'ato_nie & fleuve56',
  other: {
    copyright: `© ${new Date().getFullYear()} ato_nie & fleuve56 — Univers Minamix. Tous droits réservés.`,
    robots: 'index, follow',
  },
}

export default async function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const [paysItems, racesItems, ryximusItems, user] = await Promise.all([
    getAllPays(),
    getAllRaces(),
    getAllRyximus(),
    getCurrentUser(),
  ])

  return (
    <html lang="fr" className="h-full antialiased">
      <body className="min-h-full flex flex-col">
        <Navigation
          paysItems={paysItems.map((p) => ({ label: p.nom, href: `/pays/${p.slug}` }))}
          racesItems={racesItems.map((r) => ({ label: r.nom, href: `/races/${r.slug}` }))}
          ryximusItems={ryximusItems.map((r) => ({ label: r.nom, href: `/ryximus/${r.slug}` }))}
          isLoggedIn={!!user}
        />
        <main className="flex-1 mx-auto w-full max-w-5xl px-6 py-10">
          {children}
        </main>
        <footer className="text-center text-sm py-8 mt-8" style={{ background: 'linear-gradient(180deg, #2c1a08 0%, #1c1008 100%)', borderTop: '1px solid rgba(176,140,42,0.25)' }}>
          <p className="font-semibold tracking-widest text-xs mb-1" style={{ fontFamily: 'var(--font-heading)', color: 'var(--gold-light)', letterSpacing: '0.3em' }}>MINAMIX</p>
          <p className="mb-3" style={{ color: 'rgba(255,240,200,0.45)', fontSize: '0.72rem', letterSpacing: '0.12em' }}>Univers de fantasy</p>
          <p style={{ color: 'rgba(255,240,200,0.35)', fontSize: '0.68rem', letterSpacing: '0.06em' }}>
            © {new Date().getFullYear()} ato_nie & fleuve56 — Tous droits réservés
          </p>
          <p className="mt-2">
            <a href="/mentions-legales" style={{ color: 'rgba(255,240,200,0.30)', fontSize: '0.65rem', letterSpacing: '0.08em', textDecoration: 'underline', textUnderlineOffset: '3px' }}>
              Mentions légales & CGU
            </a>
          </p>
        </footer>
      </body>
    </html>
  )
}
