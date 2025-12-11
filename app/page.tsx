import { createClient } from '@/lib/supabase/server'
import ProfilesGrid from '@/components/ProfilesGrid'

export default async function Home() {
  const supabase = await createClient()

  // Fetch all published profiles
  const { data: profiles } = await supabase
    .from('profiles')
    .select('id, username, is_published, created_at')
    .eq('is_published', true)
    .order('created_at', { ascending: false })

  // Fetch all content items for published profiles
  const { data: allContentItems } = await supabase
    .from('content_items')
    .select('profile_id, url')
    .in('profile_id', (profiles || []).map(p => p.id))

  // Extract unique domains from all content URLs
  const domains = new Set<string>()
  allContentItems?.forEach(item => {
    try {
      const url = new URL(item.url)
      const domain = url.hostname.replace('www.', '')
      domains.add(domain)
    } catch {
      // Invalid URL, skip
    }
  })

  // Get content counts and domains for each profile
  const profilesWithData = await Promise.all(
    (profiles || []).map(async (profile) => {
      const { count } = await supabase
        .from('content_items')
        .select('*', { count: 'exact', head: true })
        .eq('profile_id', profile.id)

      // Get domains for this profile's content
      const profileContentItems = allContentItems?.filter(item => item.profile_id === profile.id) || []
      const profileDomains = new Set<string>()
      profileContentItems.forEach(item => {
        try {
          const url = new URL(item.url)
          const domain = url.hostname.replace('www.', '')
          profileDomains.add(domain)
        } catch {
          // Invalid URL, skip
        }
      })

      return {
        ...profile,
        content_count: count || 0,
        domains: Array.from(profileDomains)
      }
    })
  )

  return <ProfilesGrid profiles={profilesWithData} availableDomains={Array.from(domains).sort()} />
}
