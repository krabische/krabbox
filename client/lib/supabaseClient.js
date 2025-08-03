import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://majhlkvnwnsycbtpguzb.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1hamhsa3Zud25zeWNidHBndXpiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQxNzAyMzEsImV4cCI6MjA2OTc0NjIzMX0.7_R6TdDY8qxyrIUXMLRoXD1p4FfTxeiZWwNAlV1lo9M'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
