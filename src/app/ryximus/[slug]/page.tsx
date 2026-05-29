import { notFound } from 'next/navigation'
import { getRyximus, getAllRyximus, getCurrentUser } from '@/lib/wiki-data'
import { RyximusDetailClient } from './RyximusDetailClient'

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const { data: r } = await getRyximus(slug)
  return { title: r ? `MINAMIX — ${r.nom}` : 'MINAMIX' }
}

export default async function RyximusDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const [{ data: r, updatedAt }, allRyximus, user] = await Promise.all([getRyximus(slug), getAllRyximus(), getCurrentUser()])
  if (!r || (r.isDraft && !user)) notFound()

  return <RyximusDetailClient ryximus={r} allRyximus={allRyximus} isLoggedIn={!!user} updatedAt={updatedAt} />
}
