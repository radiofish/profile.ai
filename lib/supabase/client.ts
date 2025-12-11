import { createBrowserClient } from '@supabase/ssr'

export function createClient() {
  // Support both new publishable key and legacy anon key
  const apiKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || 
                 process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    apiKey!
  )
}

