'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

interface Profile {
  id: string
  username: string | null
  is_published: boolean
  created_at: string
  content_count?: number
  domains?: string[]
}

interface ProfilesGridProps {
  profiles: Profile[]
  availableDomains: string[]
}

export default function ProfilesGrid({ profiles, availableDomains }: ProfilesGridProps) {
  const router = useRouter()
  const [selectedDomain, setSelectedDomain] = useState<string>('')

  // Filter profiles by selected domain
  const filteredProfiles = selectedDomain
    ? profiles.filter(profile => 
        profile.domains?.some(domain => domain === selectedDomain)
      )
    : profiles

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
        <h1 style={{ margin: 0, fontSize: '1.5rem' }}>Profile.ai</h1>
        <button
          onClick={() => router.push('/create')}
          style={{
            padding: '0.5rem 1rem',
            background: '#667eea',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '1rem'
          }}
        >
          Create Your Profile
        </button>
      </header>

      {/* Main Content */}
      <main style={{ padding: '2rem', maxWidth: '1400px', margin: '0 auto' }}>
        {/* Filter */}
        {availableDomains.length > 0 && (
          <div style={{
            background: 'white',
            padding: '1rem 1.5rem',
            borderRadius: '8px',
            marginBottom: '2rem',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
            display: 'flex',
            alignItems: 'center',
            gap: '1rem'
          }}>
            <label style={{
              fontSize: '0.9rem',
              fontWeight: '500',
              color: '#666'
            }}>
              Filter by domain:
            </label>
            <select
              value={selectedDomain}
              onChange={(e) => setSelectedDomain(e.target.value)}
              style={{
                padding: '0.5rem 1rem',
                border: '1px solid #ddd',
                borderRadius: '4px',
                fontSize: '0.9rem',
                cursor: 'pointer',
                flex: 1,
                maxWidth: '300px'
              }}
            >
              <option value="">All domains</option>
              {availableDomains.map(domain => (
                <option key={domain} value={domain}>
                  {domain}
                </option>
              ))}
            </select>
            {selectedDomain && (
              <button
                onClick={() => setSelectedDomain('')}
                style={{
                  padding: '0.5rem 1rem',
                  background: '#f0f0f0',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  fontSize: '0.9rem'
                }}
              >
                Clear
              </button>
            )}
          </div>
        )}

        {filteredProfiles.length === 0 ? (
          <div style={{
            background: 'white',
            padding: '4rem',
            borderRadius: '8px',
            textAlign: 'center',
            color: '#999'
          }}>
            <h2 style={{ marginBottom: '1rem' }}>
              {selectedDomain ? `No profiles with content from ${selectedDomain}` : 'No profiles yet'}
            </h2>
            <p>
              {selectedDomain ? 'Try selecting a different domain or clear the filter.' : 'Be the first to create a profile!'}
            </p>
          </div>
        ) : (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
            gap: '1.5rem'
          }}>
            {filteredProfiles.map((profile) => (
              profile.username && (
                <Link
                  key={profile.id}
                  href={`/${profile.username}`}
                  style={{
                    textDecoration: 'none',
                    color: 'inherit'
                  }}
                >
                  <div style={{
                    background: 'white',
                    padding: '1.5rem',
                    borderRadius: '8px',
                    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                    transition: 'transform 0.2s, box-shadow 0.2s',
                    cursor: 'pointer'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-4px)'
                    e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)'
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)'
                    e.currentTarget.style.boxShadow = '0 2px 4px rgba(0,0,0,0.1)'
                  }}
                  >
                    <div style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      marginBottom: '0.5rem'
                    }}>
                      <h3 style={{ margin: 0, fontSize: '1.25rem' }}>
                        @{profile.username}
                      </h3>
                      {profile.content_count !== undefined && (
                        <span style={{
                          fontSize: '1.5rem',
                          fontWeight: 'bold',
                          color: '#667eea'
                        }}>
                          {profile.content_count}
                        </span>
                      )}
                    </div>
                    <p style={{ margin: 0, color: '#666', fontSize: '0.9rem' }}>
                      View profile →
                    </p>
                  </div>
                </Link>
              )
            ))}
          </div>
        )}
      </main>
    </div>
  )
}

