import { notFound } from 'next/navigation'
import { getPays, getAllPays, getCurrentUser } from '@/lib/wiki-data'
import { PaysDetailClient } from './PaysDetailClient'

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const p = await getPays(slug)
  return { title: p ? `MINAMIX — ${p.nom}` : 'MINAMIX' }
}

export default async function PaysDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const [p, allPays, user] = await Promise.all([getPays(slug), getAllPays(), getCurrentUser()])
  if (!p) notFound()

  return <PaysDetailClient pays={p} allPays={allPays} isLoggedIn={!!user} />
}
