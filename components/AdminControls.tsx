'use client'

import { useState } from 'react'

interface AdminControlsProps {
  onAddContent: (url: string, description?: string) => void;
  onPublish: () => void;
  isPublished: boolean;
}

export default function AdminControls({ onAddContent, onPublish, isPublished }: AdminControlsProps) {
  const [url, setUrl] = useState('')
  const [description, setDescription] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    e.stopPropagation() // Prevent any form submission side effects
    if (!url.trim()) return

    setLoading(true)
    try {
      await onAddContent(url.trim(), description.trim() || undefined)
      // Only clear form if no error was set (success case)
      // The error state is managed in ProfileEditor
      setUrl('')
      setDescription('')
    } catch (error) {
      console.error('Error adding content:', error)
      // Error is handled in ProfileEditor, don't clear form
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{
      background: 'white',
      padding: '1.5rem',
      borderRadius: '8px',
      marginBottom: '2rem',
      boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
    }}>
      <h2 style={{ marginBottom: '1rem', fontSize: '1.25rem' }}>Add Content</h2>
      <form onSubmit={handleSubmit} style={{ marginBottom: '1rem' }}>
        <div style={{ display: 'flex', gap: '1rem', marginBottom: '0.75rem' }}>
          <input
            type="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="Enter URL to embed (e.g., https://example.com)"
            required
            style={{
              flex: 1,
              padding: '0.75rem',
              border: '1px solid #ddd',
              borderRadius: '4px',
              fontSize: '1rem'
            }}
          />
          <button
            type="submit"
            disabled={loading || !url.trim()}
            style={{
              padding: '0.75rem 2rem',
              background: '#667eea',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              fontSize: '1rem',
              cursor: loading ? 'not-allowed' : 'pointer',
              opacity: loading ? 0.6 : 1
            }}
          >
            {loading ? 'Adding...' : 'Add'}
          </button>
        </div>
        <input
          type="text"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Optional description (e.g., My favorite article)"
          style={{
            width: '100%',
            padding: '0.75rem',
            border: '1px solid #ddd',
            borderRadius: '4px',
            fontSize: '1rem'
          }}
        />
      </form>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <p style={{ margin: 0, color: '#666', fontSize: '0.9rem' }}>
          Status: {isPublished ? 'Published' : 'Draft'}
        </p>
        <button
          onClick={onPublish}
          style={{
            padding: '0.75rem 2rem',
            background: isPublished ? '#f44336' : '#4caf50',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            fontSize: '1rem',
            cursor: 'pointer'
          }}
        >
          {isPublished ? 'Unpublish' : 'Publish'}
        </button>
      </div>
    </div>
  )
}

