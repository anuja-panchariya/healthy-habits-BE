import { supabase } from "../config/supabaseClient.js"
import { v4 as uuidv4 } from 'uuid';

// models/userModel.js - YE FUNCTION REPLACE:
export async function getOrCreateUser(clerkId) {
  try {
    // First try to find existing user
    let { data: user, error } = await supabase
      .from('app_users')
      .select('*')
      .eq('clerk_id', clerkId)
      .single()

    if (user) return user

    // Create new user (no duplicate email check)
    const { data: newUser, error: createError } = await supabase
      .from('app_users')
      .insert({ 
        clerk_id: clerkId, 
        email: `user_${clerkId}@habitapp.local` 
      })
      .select()
      .single()

    if (createError && createError.code !== '23505') throw createError
    return newUser || user
  } catch (err) {
    console.error('getOrCreateUser error:', err)
    throw err
  }
}
