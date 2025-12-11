import { NextRequest, NextResponse } from 'next/server'
import { fetchIframelyEmbed } from '@/lib/iframely'

export async function POST(request: NextRequest) {
  try {
    const { url } = await request.json()

    if (!url || typeof url !== 'string') {
      return NextResponse.json(
        { error: 'URL is required' },
        { status: 400 }
      )
    }

    console.log('Iframely API route called with URL:', url)
    
    // Check if API key is available
    const apiKey = process.env.IFRAMELY_API_KEY || process.env.NEXT_PUBLIC_IFRAMELY_API_KEY
    console.log('Iframely API key available:', !!apiKey)

    const embedData = await fetchIframelyEmbed(url)

    if (!embedData) {
      console.error('Failed to fetch embed data for URL:', url)
      return NextResponse.json(
        { 
          error: 'Failed to fetch embed data. Check server logs for details.',
          details: 'The Iframely API may have rejected the request. Verify your API key and the URL format.'
        },
        { status: 500 }
      )
    }

    return NextResponse.json({ embedData })
  } catch (error: any) {
    console.error('Error in iframely API route:', error)
    return NextResponse.json(
      { 
        error: 'Internal server error',
        details: error.message || 'Unknown error occurred'
      },
      { status: 500 }
    )
  }
}

