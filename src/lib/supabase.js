import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://xwcrzedgekurwoykbcys.supabase.co'
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh3Y3J6ZWRnZWt1cndveWtiY3lzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzk1MzI0ODUsImV4cCI6MjA5NTEwODQ4NX0.JaZ9iOC85C1dZFn70ncFgxaGEf3gX9NVvHbAzhqQv9s'

if (!import.meta.env.VITE_SUPABASE_URL) {
  console.warn('[Supabase] VITE_SUPABASE_URL missing from env — using hardcoded fallback')
}

export const supabase = createClient(supabaseUrl, supabaseKey)