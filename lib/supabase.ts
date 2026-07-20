import { createClient } from '@supabase/supabase-js'

// Server-side only — uses the service role key, which bypasses row-level
// security. Never import this file into a "use client" component.
export const supabaseAdmin = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

