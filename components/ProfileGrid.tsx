'use client'

import { useMemo, useState, useEffect } from 'react'
import GridLayout, { WidthProvider } from 'react-grid-layout'
import 'react-grid-layout/css/styles.css'
import 'react-resizable/css/styles.css'
import ContentCard from './ContentCard'
import { ContentItem } from '@/types/content'

const ResponsiveGridLayout = WidthProvider(GridLayout)

interface ProfileGridProps {
  contentItems: ContentItem[];
  isAdminMode: boolean;
  onDelete: (id: string) => void;
  onLayoutChange: (layouts: any[]) => void;
}

export default function ProfileGrid({ 
  contentItems, 
  isAdminMode, 
  onDelete, 
  onLayoutChange 
}: ProfileGridProps) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const layouts = useMemo(() => {
    return contentItems.map(item => ({
      i: item.id,
      x: item.layout_x,
      y: item.layout_y,
      w: item.layout_w,
      h: item.layout_h,
    }))
  }, [contentItems])

  const handleLayoutChange = (layout: GridLayout.Layout[]) => {
    onLayoutChange(layout)
  }

  if (contentItems.length === 0) {
    return (
      <div style={{
        background: 'white',
        padding: '4rem',
        borderRadius: '8px',
        textAlign: 'center',
        color: '#999'
      }}>
        {isAdminMode 
          ? 'No content yet. Add a URL above to get started!'
          : 'This profile has no content yet.'
        }
      </div>
    )
  }

  if (!mounted) {
    return (
      <div style={{
        background: 'white',
        padding: '4rem',
        borderRadius: '8px',
        textAlign: 'center',
        color: '#999'
      }}>
        Loading...
      </div>
    )
  }

  return (
    <div style={{ position: 'relative' }}>
      <ResponsiveGridLayout
        className="layout"
        layout={layouts}
        cols={12}
        rowHeight={50}
        isDraggable={isAdminMode}
        isResizable={isAdminMode}
        onLayoutChange={handleLayoutChange}
        draggableHandle=".drag-handle"
        style={{ margin: '0 auto' }}
      >
        {contentItems.map(item => (
          <div key={item.id}>
            <ContentCard
              item={item}
              isAdminMode={isAdminMode}
              onDelete={() => onDelete(item.id)}
            />
          </div>
        ))}
      </ResponsiveGridLayout>
    </div>
  )
}

