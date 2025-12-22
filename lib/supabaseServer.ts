import { createClient } from "@supabase/supabase-js"

// Fallback to placeholder values if environment variables are not set
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co'
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || 'placeholder-key'

export const supabase = createClient(
  supabaseUrl,
  supabaseKey
)
