import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://majhlkvnwnsycbtpguzb.supabase.co'
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1hamhsa3Zud25zeWNidHBndXpiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQxNzAyMzEsImV4cCI6MjA2OTc0NjIzMX0.7_R6TdDY8qxyrIUXMLRoXD1p4FfTxeiZWwNAlV1lo9M'

console.log('Supabase URL:', supabaseUrl)
console.log('Supabase Key exists:', !!supabaseAnonKey)

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  },
  realtime: {
    params: {
      eventsPerSecond: 10
    }
  }
})
