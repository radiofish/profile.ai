'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import ProfileGrid from './ProfileGrid'
import AdminControls from './AdminControls'
import { ContentItem } from '@/types/content'

interface Profile {
  id: string
  username: string | null
  is_published: boolean
}

interface ProfileEditorProps {
  profile: Profile | null
  contentItems: ContentItem[]
}

export default function ProfileEditor({ profile: initialProfile, contentItems: initialContentItems }: ProfileEditorProps) {
  const [profile, setProfile] = useState<Profile | null>(initialProfile)
  const [username, setUsername] = useState(initialProfile?.username || '')
  const [contentItems, setContentItems] = useState<ContentItem[]>(initialContentItems)
  const [isPublished, setIsPublished] = useState(initialProfile?.is_published || false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const supabase = createClient()
  const router = useRouter()

  const loadProfile = async () => {
    if (!profile) return

    try {
      const { data: items, error: itemsError } = await supabase
        .from('content_items')
        .select('*')
        .eq('profile_id', profile.id)
        .order('created_at', { ascending: true })

      if (itemsError) throw itemsError
      setContentItems(items || [])
    } catch (error) {
      console.error('Error loading profile:', error)
    }
  }

  useEffect(() => {
    if (profile) {
      loadProfile()
    }
  }, [profile])

  const handleCreateOrUpdateProfile = async () => {
    if (!username.trim()) {
      setError('Username is required')
      return
    }

    // Validate username format (alphanumeric and underscores only)
    if (!/^[a-zA-Z0-9_]+$/.test(username.trim())) {
      setError('Username can only contain letters, numbers, and underscores')
      return
    }

    setLoading(true)
    setError(null)

    try {
      if (profile) {
        // Update existing profile
        const { data: updatedProfile, error: updateError } = await supabase
          .from('profiles')
          .update({ username: username.trim() })
          .eq('id', profile.id)
          .select()
          .single()

        if (updateError) {
          if (updateError.code === '23505') { // Unique violation
            setError('Username is already taken')
          } else {
            throw updateError
          }
          setLoading(false)
          return
        }

        setProfile(updatedProfile)
        router.push(`/edit/${username.trim()}`)
      } else {
        // Create new profile
        const { data: newProfile, error: createError } = await supabase
          .from('profiles')
          .insert({
            username: username.trim(),
            is_published: false,
          })
          .select()
          .single()

        if (createError) {
          if (createError.code === '23505') { // Unique violation
            setError('Username is already taken')
          } else {
            throw createError
          }
          setLoading(false)
          return
        }

        setProfile(newProfile)
        router.push(`/edit/${username.trim()}`)
        router.refresh()
      }
    } catch (error: any) {
      console.error('Error saving profile:', error)
      setError(error.message || 'Failed to save profile')
    } finally {
      setLoading(false)
    }
  }

  const handleAddContent = async (url: string, description?: string) => {
    if (!profile) {
      setError('Please create a profile first')
      return
    }

    try {
      // Fetch embed data from Iframely
      let response: Response
      try {
        response = await fetch('/api/iframely', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ url }),
        })
      } catch (fetchError: any) {
        // Network error or fetch failed
        console.error('Network error fetching embed:', fetchError)
        setError('Network error: Could not connect to server. Please check your connection and try again.')
        return
      }

      if (!response.ok) {
        let errorMessage = `Failed to fetch embed: ${response.status} ${response.statusText}`
        try {
          const errorData = await response.json()
          errorMessage = errorData.error || errorData.details || errorMessage
        } catch {
          // If JSON parsing fails, use the status text
        }
        setError(errorMessage)
        return
      }

      let responseData: any
      try {
        responseData = await response.json()
      } catch (parseError) {
        console.error('Error parsing response:', parseError)
        setError('Invalid response from server. Please try again.')
        return
      }

      if (responseData.error) {
        setError(responseData.error + (responseData.details ? `: ${responseData.details}` : ''))
        return
      }

      const { embedData } = responseData

      if (!embedData) {
        setError('No embed data returned from Iframely API. The URL may not be supported.')
        return
      }

      // Find the next available position
      const maxY = contentItems.length > 0
        ? Math.max(...contentItems.map(item => item.layout_y + item.layout_h))
        : 0

      // Insert new content item
      const { data: newItem, error } = await supabase
        .from('content_items')
        .insert({
          profile_id: profile.id,
          url,
          description: description?.trim() || null,
          embed_data: embedData,
          layout_x: 0,
          layout_y: maxY,
          layout_w: 4,
          layout_h: 4,
        })
        .select()
        .single()

      if (error) {
        console.error('Supabase error:', error)
        setError(`Database error: ${error.message}`)
        return
      }

      setContentItems([...contentItems, newItem])
      setError(null) // Clear any previous errors
    } catch (error: any) {
      console.error('Unexpected error adding content:', error)
      setError(error.message || 'An unexpected error occurred. Please try again.')
    }
  }

  const handleDeleteContent = async (id: string) => {
    if (!profile) return

    try {
      const { error } = await supabase
        .from('content_items')
        .delete()
        .eq('id', id)

      if (error) throw error
      setContentItems(contentItems.filter(item => item.id !== id))
    } catch (error) {
      console.error('Error deleting content:', error)
      alert('Failed to delete content. Please try again.')
    }
  }

  const handleLayoutChange = async (layouts: any[]) => {
    if (!profile) return

    try {
      // Update all items that changed position
      const updates = layouts.map(layout => ({
        id: layout.i,
        layout_x: layout.x,
        layout_y: layout.y,
        layout_w: layout.w,
        layout_h: layout.h,
      }))

      for (const update of updates) {
        await supabase
          .from('content_items')
          .update({
            layout_x: update.layout_x,
            layout_y: update.layout_y,
            layout_w: update.layout_w,
            layout_h: update.layout_h,
          })
          .eq('id', update.id)
      }
    } catch (error) {
      console.error('Error updating layout:', error)
    }
  }

  const handlePublish = async () => {
    if (!profile) return

    try {
      const { error } = await supabase
        .from('profiles')
        .update({ is_published: !isPublished })
        .eq('id', profile.id)

      if (error) throw error
      setIsPublished(!isPublished)
    } catch (error) {
      console.error('Error publishing profile:', error)
      alert('Failed to publish profile. Please try again.')
    }
  }

  // If no profile exists yet, show creation form
  if (!profile) {
    return (
      <div style={{ minHeight: '100vh', background: '#f5f5f5' }}>
        <header style={{
          background: 'white',
          padding: '1rem 2rem',
          borderBottom: '1px solid #e0e0e0',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <h1 style={{ margin: 0, fontSize: '1.5rem' }}>Create Your Profile</h1>
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
            ← Back
          </a>
        </header>

        <main style={{ padding: '2rem', maxWidth: '600px', margin: '0 auto' }}>
          <div style={{
            background: 'white',
            padding: '2rem',
            borderRadius: '8px',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
          }}>
            <h2 style={{ marginBottom: '1rem' }}>Choose a Username</h2>
            <p style={{ marginBottom: '1.5rem', color: '#666' }}>
              Your profile will be available at /{username || 'username'}
            </p>
            <div style={{ marginBottom: '1rem' }}>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="username"
                pattern="[a-zA-Z0-9_]+"
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  border: '1px solid #ddd',
                  borderRadius: '4px',
                  fontSize: '1rem'
                }}
              />
              {error && (
                <div style={{
                  marginTop: '0.5rem',
                  padding: '0.75rem',
                  background: '#fee',
                  color: '#c33',
                  borderRadius: '4px',
                  fontSize: '0.9rem'
                }}>
                  {error}
                </div>
              )}
            </div>
            <button
              onClick={handleCreateOrUpdateProfile}
              disabled={loading || !username.trim()}
              style={{
                width: '100%',
                padding: '0.75rem',
                background: loading || !username.trim() ? '#ccc' : '#667eea',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                fontSize: '1rem',
                cursor: loading || !username.trim() ? 'not-allowed' : 'pointer'
              }}
            >
              {loading ? 'Creating...' : 'Create Profile'}
            </button>
          </div>
        </main>
      </div>
    )
  }

  // Show editor for existing profile
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
        <div>
          <h1 style={{ margin: 0, fontSize: '1.5rem' }}>Edit: @{profile.username}</h1>
          <a
            href={`/${profile.username}`}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              fontSize: '0.9rem',
              color: '#667eea',
              textDecoration: 'none'
            }}
          >
            View profile →
          </a>
        </div>
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
        {/* Username Editor */}
        <div style={{
          background: 'white',
          padding: '1.5rem',
          borderRadius: '8px',
          marginBottom: '1.5rem',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
        }}>
          <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
            Username
          </label>
          <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="username"
              pattern="[a-zA-Z0-9_]+"
              style={{
                flex: 1,
                padding: '0.75rem',
                border: '1px solid #ddd',
                borderRadius: '4px',
                fontSize: '1rem'
              }}
            />
            <button
              onClick={handleCreateOrUpdateProfile}
              disabled={loading || !username.trim() || username === profile.username}
              style={{
                padding: '0.75rem 1.5rem',
                background: loading || !username.trim() || username === profile.username ? '#ccc' : '#667eea',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                fontSize: '1rem',
                cursor: loading || !username.trim() || username === profile.username ? 'not-allowed' : 'pointer'
              }}
            >
              {loading ? 'Saving...' : 'Update Username'}
            </button>
          </div>
          {error && (
            <div style={{
              marginTop: '0.5rem',
              padding: '0.75rem',
              background: '#fee',
              color: '#c33',
              borderRadius: '4px',
              fontSize: '0.9rem'
            }}>
              {error}
            </div>
          )}
          <p style={{ marginTop: '0.5rem', marginBottom: 0, color: '#666', fontSize: '0.9rem' }}>
            Profile URL: /{username || profile.username}
          </p>
        </div>

        {/* Error display for content addition */}
        {error && (error.includes('embed') || error.includes('content') || error.includes('Network') || error.includes('fetch')) && (
          <div style={{
            background: '#fee',
            color: '#c33',
            padding: '1rem',
            borderRadius: '8px',
            marginBottom: '1.5rem',
            fontSize: '0.9rem'
          }}>
            <strong>Error adding content:</strong> {error}
          </div>
        )}

        <AdminControls
          onAddContent={handleAddContent}
          onPublish={handlePublish}
          isPublished={isPublished}
        />
        <ProfileGrid
          contentItems={contentItems}
          isAdminMode={true}
          onDelete={handleDeleteContent}
          onLayoutChange={handleLayoutChange}
        />
      </main>
    </div>
  )
}

