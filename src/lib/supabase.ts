import { createClient } from '@supabase/supabase-js'
// import type { Database } from './database.types'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

console.log('Environment check:', {
  hasUrl: !!supabaseUrl,
  hasKey: !!supabaseAnonKey,
  url: supabaseUrl ? supabaseUrl.substring(0, 20) + '...' : 'undefined'
})

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing environment variables:', {
    VITE_SUPABASE_URL: supabaseUrl,
    VITE_SUPABASE_ANON_KEY: supabaseAnonKey ? 'SET' : 'MISSING'
  })
  throw new Error('Missing Supabase environment variables')
}

// Remove type constraint temporarily until tables are created in database
export const supabase = createClient(supabaseUrl, supabaseAnonKey)
