import { notFound } from 'next/navigation'
import { getRace, getAllRaces, getCurrentUser } from '@/lib/wiki-data'
import { RaceDetailClient } from './RaceDetailClient'

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const { data: r } = await getRace(slug)
  return { title: r ? `MINAMIX — ${r.nom}` : 'MINAMIX' }
}

export default async function RaceDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const [{ data: r, updatedAt }, allRaces, user] = await Promise.all([getRace(slug), getAllRaces(), getCurrentUser()])
  if (!r) notFound()

  return <RaceDetailClient race={r} allRaces={allRaces} isLoggedIn={!!user} updatedAt={updatedAt} />
}
