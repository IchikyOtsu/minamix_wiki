import { getMagie, getCurrentUser } from '@/lib/wiki-data'
import { MagieClient } from './MagieClient'

export const metadata = { title: 'MINAMIX — La Magie' }

export default async function MagiePage() {
  const [data, user] = await Promise.all([getMagie(), getCurrentUser()])
  return <MagieClient data={data} isLoggedIn={!!user} />
}
