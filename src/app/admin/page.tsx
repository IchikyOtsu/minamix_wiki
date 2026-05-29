import { redirect } from 'next/navigation'
import { getCurrentUser } from '@/lib/wiki-data'
import { getImageLibrary } from './actions'
import { AdminImagesClient } from './AdminImagesClient'

export const dynamic = 'force-dynamic'

export default async function AdminPage() {
  const user = await getCurrentUser()
  if (!user) redirect('/login')

  const images = await getImageLibrary()
  return <AdminImagesClient initialImages={images} />
}
