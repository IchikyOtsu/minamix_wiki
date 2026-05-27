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
        <main className="flex-1 mx-auto w-full max-w-5xl px-6 py-8">
          {children}
        </main>
        <footer className="bg-[#747474] text-white text-center text-sm py-4 mt-8">
          <p>MINAMIX — Univers de fantasy</p>
        </footer>
      </body>
    </html>
  )
}
