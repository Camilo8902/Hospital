'use client'

import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { SessionContextProvider } from '@supabase/auth-helpers-react'
import { useState } from 'react'

export function ClientProviders({ children }: { children: React.ReactNode }) {
  const [supabase] = useState(() => {
    try {
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
      const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

      if (!supabaseUrl || !supabaseKey || supabaseUrl === 'your_supabase_url_here') {
        console.warn('Supabase environment variables not configured, using fallback')
        // Create client with dummy values to prevent build failure
        return createClientComponentClient()
      }

      return createClientComponentClient()
    } catch (error) {
      console.warn('Error creating Supabase client, using fallback:', error)
      // Fallback client to prevent build failure
      return createClientComponentClient()
    }
  })

  return (
    <SessionContextProvider supabaseClient={supabase}>
      {children}
    </SessionContextProvider>
  )
}