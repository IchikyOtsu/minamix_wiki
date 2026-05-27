import { getAllAnnexes, getCurrentUser } from '@/lib/wiki-data'
import { AnnexesClient } from './AnnexesClient'

export const metadata = { title: 'MINAMIX — Annexes' }

export default async function AnnexesPage() {
  const [annexes, user] = await Promise.all([getAllAnnexes(), getCurrentUser()])
  return <AnnexesClient annexes={annexes} isLoggedIn={!!user} />
}
