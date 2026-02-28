import { supabase } from "../config/supabaseClient.js"

export async function getHabitsByUser(userId) {
  const { data, error } = await supabase
    .from("habits")
    .select("*")
    .eq("user_id", userId)

  if (error) throw error
  return data
}

export async function createHabit(habit) {
  const { data, error } = await supabase
    .from("habits")
    .insert(habit)
    .select()
    .single()

  if (error) throw error
  return data
}