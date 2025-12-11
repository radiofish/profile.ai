/**
 * Iframely API integration
 * Documentation: https://iframely.com/docs/api
 */

export interface IframelyResponse {
  meta: {
    title?: string;
    description?: string;
    canonical?: string;
    author?: string;
    site?: string;
  };
  links: {
    thumbnail?: Array<{ href: string; type?: string; rel?: string[] }>;
    icon?: Array<{ href: string; type?: string; rel?: string[] }>;
  };
  html?: string;
  rel?: string[];
}

export async function fetchIframelyEmbed(url: string): Promise<IframelyResponse | null> {
  try {
    // Iframely API endpoint
    // Support both NEXT_PUBLIC_ (client-accessible) and server-only env vars
    const iframelyApiKey = process.env.IFRAMELY_API_KEY || 
                          process.env.NEXT_PUBLIC_IFRAMELY_API_KEY || 
                          '';
    
    // Build API URL
    let apiUrl = `https://iframe.ly/api/iframely?url=${encodeURIComponent(url)}`;
    if (iframelyApiKey) {
      apiUrl += `&api_key=${iframelyApiKey}`;
    }

    console.log('Fetching Iframely embed for URL:', url);
    console.log('API key present:', !!iframelyApiKey);

    const response = await fetch(apiUrl, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Iframely API error:', {
        status: response.status,
        statusText: response.statusText,
        body: errorText
      });
      return null;
    }

    const data = await response.json();
    
    // Check if Iframely returned an error in the response
    if (data.error) {
      console.error('Iframely API returned error:', data.error);
      return null;
    }

    return data;
  } catch (error) {
    console.error('Error fetching Iframely embed:', error);
    return null;
  }
}

