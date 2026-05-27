'use client'

import Link from 'next/link'
import { useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

interface NavLink { label: string; href: string }

interface Props {
  paysItems: NavLink[]
  racesItems: NavLink[]
  ryximusItems: NavLink[]
  isLoggedIn: boolean
}

export default function Navigation({ paysItems, racesItems, ryximusItems, isLoggedIn }: Props) {
  const [openMenu, setOpenMenu] = useState<string | null>(null)
  const [mobileOpen, setMobileOpen] = useState(false)
  const router = useRouter()
  const pathname = usePathname()

  async function handleLogout() {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/')
    router.refresh()
  }

  const navItems = [
    { label: 'Accueil', href: '/' },
    { label: 'Pays', href: '/pays', dropdown: paysItems },
    { label: 'Races', href: '/races', dropdown: racesItems },
    { label: 'Ryximus', href: '/ryximus', dropdown: ryximusItems },
    { label: 'Magie', href: '/magie' },
    {
      label: 'Annexes', href: '/annexes',
      dropdown: [],
    },
  ]

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 shadow-lg" style={{ background: 'linear-gradient(180deg, #5c5c5c 0%, #484848 100%)' }}>
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="text-white font-bold text-xl tracking-widest hover:text-gray-200 transition-colors" style={{ fontFamily: 'var(--font-heading)' }}>
            MINAMIX
          </Link>

          {/* Desktop nav */}
          <ul className="hidden md:flex items-center">
            {navItems.map((item) => {
              const isActive = pathname === item.href || pathname.startsWith(item.href + '/')
              return (
                <li key={item.href} className="relative"
                  onMouseEnter={() => item.dropdown?.length && setOpenMenu(item.href)}
                  onMouseLeave={() => setOpenMenu(null)}
                >
                  <Link
                    href={item.href}
                    className={`px-4 py-5 text-sm font-medium inline-block border-b-2 transition-all ${
                      isActive
                        ? 'text-white border-[#b08c2a]'
                        : 'text-gray-300 hover:text-white border-transparent hover:border-white/40'
                    }`}
                  >
                    {item.label}
                  </Link>
                  {item.dropdown && item.dropdown.length > 0 && openMenu === item.href && (
                    <ul className="absolute top-full left-0 bg-white shadow-xl min-w-[200px] rounded-b-lg border-t-2 border-[#b08c2a] py-1">
                      {item.dropdown.map((sub) => (
                        <li key={sub.href}>
                          <Link href={sub.href} className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-gray-900 transition-colors" onClick={() => setOpenMenu(null)}>
                            {sub.label}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  )}
                </li>
              )
            })}

            <li className="ml-3 pl-3 border-l border-white/20">
              {isLoggedIn ? (
                <button onClick={handleLogout} className="px-3 py-1.5 text-xs font-medium text-gray-300 hover:text-white border border-white/30 rounded-md hover:border-white/60 transition-all">
                  Déconnexion
                </button>
              ) : (
                <Link href="/login" className="px-3 py-1.5 text-xs font-medium text-gray-300 hover:text-white border border-white/30 rounded-md hover:border-white/60 transition-all">
                  Connexion
                </Link>
              )}
            </li>
          </ul>

          {/* Mobile toggle */}
          <button className="md:hidden text-white p-2 flex flex-col gap-1.5" onClick={() => setMobileOpen(!mobileOpen)} aria-label="Menu">
            <span className={`block w-6 h-0.5 bg-white transition-transform ${mobileOpen ? 'rotate-45 translate-y-2' : ''}`} />
            <span className={`block w-6 h-0.5 bg-white transition-opacity ${mobileOpen ? 'opacity-0' : ''}`} />
            <span className={`block w-6 h-0.5 bg-white transition-transform ${mobileOpen ? '-rotate-45 -translate-y-2' : ''}`} />
          </button>
        </div>

        {/* Mobile menu */}
        {mobileOpen && (
          <div className="md:hidden border-t border-white/10 pb-4">
            {navItems.map((item) => (
              <div key={item.href}>
                <Link href={item.href} className="block px-4 py-2.5 text-white hover:bg-white/10 font-medium text-sm transition-colors" onClick={() => setMobileOpen(false)}>
                  {item.label}
                </Link>
                {item.dropdown?.map((sub) => (
                  <Link key={sub.href} href={sub.href} className="block px-8 py-2 text-gray-400 hover:text-white text-xs transition-colors" onClick={() => setMobileOpen(false)}>
                    {sub.label}
                  </Link>
                ))}
              </div>
            ))}
            <div className="px-4 pt-3 border-t border-white/10 mt-2">
              {isLoggedIn ? (
                <button onClick={handleLogout} className="text-gray-300 text-sm hover:text-white">Déconnexion</button>
              ) : (
                <Link href="/login" className="text-gray-300 text-sm hover:text-white" onClick={() => setMobileOpen(false)}>Connexion</Link>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}
