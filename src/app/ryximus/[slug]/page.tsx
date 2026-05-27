import { notFound } from 'next/navigation'
import { getRyximus, getAllRyximus, getCurrentUser } from '@/lib/wiki-data'
import { RyximusDetailClient } from './RyximusDetailClient'

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const r = await getRyximus(slug)
  return { title: r ? `MINAMIX — ${r.nom}` : 'MINAMIX' }
}

export default async function RyximusDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const [r, allRyximus, user] = await Promise.all([getRyximus(slug), getAllRyximus(), getCurrentUser()])
  if (!r) notFound()

  return <RyximusDetailClient ryximus={r} allRyximus={allRyximus} isLoggedIn={!!user} />
}
