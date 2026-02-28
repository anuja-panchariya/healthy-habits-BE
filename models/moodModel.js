import { supabase } from "../config/supabaseClient.js"

export async function getMoods(userId) {
  const { data, error } = await supabase
    .from("moods")
    .select("*")
    .eq("user_id", userId)

  if (error) throw error
  return data
}

export async function addMood(mood) {
  const { data, error } = await supabase
    .from("moods")
    .insert(mood)
    .select()
    .single()

  if (error) throw error
  return data
}