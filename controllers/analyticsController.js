import { getOrCreateUser } from "../models/userModel.js"
import { getHabitStats } from "../models/analyticsModel.js"
import { supabase } from "../config/supabaseClient.js"

// ✅ getStreaks
export async function getStreaks(req, res, next) {
  try {
    const { userId } = await req.auth()
    const { data } = await supabase
      .from('habits')
      .select('id, title, streak')
      .eq('user_id', userId)
      .order('streak', { ascending: false })
      .limit(5)
    
    res.json({
      streaks: data?.map(h => ({
        habitId: h.id,
        title: h.title,
        streak: h.streak || 0
      })) || []
    })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}

// ✅ getTrends - FALLBACK DATA
export async function getTrends(req, res, next) {
  res.json([
    { date: '2026-02-26', completionRate: 85 },
    { date: '2026-02-27', completionRate: 92 },
    { date: '2026-02-28', completionRate: 78 }
  ])
}

// ✅ getCategoryStats - FALLBACK DATA
export async function getCategoryStats(req, res, next) {
  res.json([
    { category: 'Health', completionRate: 85 },
    { category: 'Productivity', completionRate: 72 },
    { category: 'Fitness', completionRate: 95 }
  ])
}

// ✅ calculateWellnessScore
export async function getAnalytics(req, res, next) {
  try {
    const { userId } = await req.auth()
    const { data } = await supabase
      .from('habits')
      .select('completed')
      .eq('user_id', userId)
    
    const total = data?.length || 0
    const completed = data?.filter(h => h.completed).length || 0
    const score = total ? (completed / total) * 100 : 0
    
    res.json({ score: Math.round(score) })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}
