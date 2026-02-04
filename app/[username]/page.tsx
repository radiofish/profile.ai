import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import ProfileView from '@/components/ProfileView'

interface PageProps {
  params: Promise<{
    username: string
  }>
}

export default async function ProfilePage({ params }: PageProps) {
  const supabase = await createClient()
  const { username } = await params

  // Fetch profile by username
  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('username', username)
    .eq('is_published', true)
    .single()

  if (!profile) {
    notFound()
  }

  // Fetch content items
  const { data: contentItems } = await supabase
    .from('content_items')
    .select('*')
    .eq('profile_id', profile.id)
    .order('created_at', { ascending: true })

  return <ProfileView profile={profile} contentItems={contentItems || []} />
}


