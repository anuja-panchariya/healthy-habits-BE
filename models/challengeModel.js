import { supabase } from "../config/supabaseClient.js"

export async function getUserChallenges(userId) {
  const { data, error } = await supabase
    .from("challenges")
    .select("*")
    .eq("user_id", userId)

  if (error) throw error
  return data
}

export async function createChallenge(challenge) {
  const { data, error } = await supabase
    .from("challenges")
    .insert(challenge)
    .select()
    .single()

  if (error) throw error
  return data
}