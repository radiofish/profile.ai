'use client'

import ProfileGrid from './ProfileGrid'
import { ContentItem } from '@/types/content'

interface Profile {
  id: string
  username: string | null
  is_published: boolean
}

interface ProfileViewProps {
  profile: Profile
  contentItems: ContentItem[]
}

export default function ProfileView({ profile, contentItems }: ProfileViewProps) {
  return (
    <div style={{ minHeight: '100vh', background: '#f5f5f5' }}>
      {/* Header */}
      <header style={{
        background: 'white',
        padding: '1rem 2rem',
        borderBottom: '1px solid #e0e0e0',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <h1 style={{ margin: 0, fontSize: '1.5rem' }}>
          @{profile.username}
        </h1>
        <a
          href="/"
          style={{
            padding: '0.5rem 1rem',
            background: '#f0f0f0',
            color: '#333',
            textDecoration: 'none',
            borderRadius: '4px',
            fontSize: '0.9rem'
          }}
        >
          ← Back to Profiles
        </a>
      </header>

      {/* Main Content */}
      <main style={{ padding: '2rem', maxWidth: '1400px', margin: '0 auto' }}>
        <ProfileGrid
          contentItems={contentItems}
          isAdminMode={false}
          onDelete={() => {}}
          onLayoutChange={() => {}}
        />
      </main>
    </div>
  )
}


