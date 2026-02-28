import { createClient } from "@supabase/supabase-js"
import dotenv from "dotenv"

dotenv.config({ path: './.env' })  // Backend .env

// ✅ BACKEND SERVICE ROLE KEYS (Not VITE!)
const supabaseUrl = process.env.SUPABASE_URL
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseKey) {
  console.error(' Backend Supabase credentials missing!')
  process.exit(1)  // Stop server if no credentials
}

export const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: { autoRefreshToken: false, persistSession: false }
})

console.log('Backend Supabase client ready!')
