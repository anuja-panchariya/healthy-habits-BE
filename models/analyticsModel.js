import { supabase } from "../config/supabaseClient.js"

export async function getHabitStats(userId) {
  const { data, error } = await supabase
    .from("habits")
    .select("id, title, streak, completed, category")
    .eq("user_id", userId)

  if (error) throw error

  const total = data.length
  const completed = data.filter(h => h.completed).length

  return {
    totalHabits: total,
    completedHabits: completed,
    completionRate: total ? (completed / total) * 100 : 0,
    habits: data
  }
}

export async function getCompletionTrends(days) {
  const { data, error } = await supabase
    .rpc('get_completion_trends', { days_ago: days })

  if (error) throw error
  return data || []
}

export async function getCategoryStats() {
  const { data, error } = await supabase
    .rpc('get_category_stats')

  if (error) throw error
  return data || []
}
