'use client'

import { ContentItem } from '@/types/content'

interface ContentCardProps {
  item: ContentItem;
  isAdminMode: boolean;
  onDelete: () => void;
}

export default function ContentCard({ item, isAdminMode, onDelete }: ContentCardProps) {
  const embedData = item.embed_data

  const renderContent = () => {
    if (!embedData) {
      return (
        <div style={{ padding: '1rem' }}>
          <a 
            href={item.url} 
            target="_blank" 
            rel="noopener noreferrer"
            style={{ color: '#667eea', textDecoration: 'none' }}
          >
            {item.url}
          </a>
        </div>
      )
    }

    // If Iframely provided HTML, use it
    if (embedData.html) {
      return (
        <div 
          style={{ 
            width: '100%', 
            height: '100%',
            overflow: 'auto'
          }}
          dangerouslySetInnerHTML={{ __html: embedData.html }}
        />
      )
    }

    // Otherwise, render a card with metadata
    return (
      <div style={{ padding: '1rem', height: '100%', display: 'flex', flexDirection: 'column' }}>
        {embedData.meta?.title && (
          <h3 style={{ marginBottom: '0.5rem', fontSize: '1.1rem' }}>
            {embedData.meta.title}
          </h3>
        )}
        {embedData.meta?.description && (
          <p style={{ marginBottom: '0.5rem', color: '#666', fontSize: '0.9rem' }}>
            {embedData.meta.description}
          </p>
        )}
        {embedData.links?.thumbnail?.[0]?.href && (
          <img
            src={embedData.links.thumbnail[0].href}
            alt={embedData.meta?.title || 'Preview'}
            style={{
              width: '100%',
              maxHeight: '200px',
              objectFit: 'cover',
              borderRadius: '4px',
              marginTop: 'auto'
            }}
          />
        )}
        <a
          href={item.url}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            marginTop: '0.5rem',
            color: '#667eea',
            textDecoration: 'none',
            fontSize: '0.9rem'
          }}
        >
          Visit →
        </a>
      </div>
    )
  }

  return (
    <div style={{
      background: 'white',
      borderRadius: '8px',
      boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      overflow: 'hidden'
    }}>
      {isAdminMode && (
        <div style={{
          padding: '0.5rem',
          background: '#f5f5f5',
          borderBottom: '1px solid #e0e0e0',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <div 
            className="drag-handle"
            style={{
              cursor: 'move',
              color: '#999',
              fontSize: '0.9rem',
              userSelect: 'none'
            }}
          >
            ⋮⋮ Drag
          </div>
          <button
            onClick={onDelete}
            style={{
              padding: '0.25rem 0.5rem',
              background: '#f44336',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '0.8rem'
            }}
          >
            Delete
          </button>
        </div>
      )}
      <div style={{ flex: 1, overflow: 'auto' }}>
        {renderContent()}
      </div>
      {item.description && (
        <div style={{
          padding: '0.75rem 1rem',
          borderTop: '1px solid #e0e0e0',
          background: '#f9f9f9'
        }}>
          <p style={{
            margin: 0,
            fontSize: '0.9rem',
            color: '#666',
            lineHeight: '1.4'
          }}>
            {item.description}
          </p>
        </div>
      )}
    </div>
  )
}

