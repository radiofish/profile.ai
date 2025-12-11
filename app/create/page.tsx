import ProfileEditor from '@/components/ProfileEditor'

export default function CreateProfilePage() {
  // Pass null profile to indicate this is a new profile
  return <ProfileEditor profile={null} contentItems={[]} />
}

