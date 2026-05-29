import { notFound } from 'next/navigation'
import { getMagie, getCurrentUser } from '@/lib/wiki-data'
import { MagieClient } from './MagieClient'

export const metadata = { title: 'MINAMIX — La Magie' }

export default async function MagiePage() {
  const [{ data, updatedAt }, user] = await Promise.all([getMagie(), getCurrentUser()])
  if ((data as { isDraft?: boolean }).isDraft && !user) notFound()
  return <MagieClient data={data} isLoggedIn={!!user} updatedAt={updatedAt} />
}
