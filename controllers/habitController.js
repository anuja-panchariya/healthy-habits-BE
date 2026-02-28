import { supabase } from "../config/supabaseClient.js"

export async function getHabits(req, res) {
  try {
    console.log("🔍 getHabits called")
    
    // BYPASS user filter - sab habits show karo
    const { data, error } = await supabase
      .from('habits')
      .select('*')
    
    if (error) throw error
    console.log("✅ Habits:", data?.length || 0)
    res.json(data || [])
  } catch (err) {
    console.error("💥 ERROR:", err)
    res.status(500).json({ error: err.message })
  }
}

// controllers/habitController.js - createHabit BULLETPROOF
export async function createHabit(req, res) {
  try {
    console.log("➕ createHabit:", req.body)
    
    // ✅ Only send days IF it exists
    const habit = {
      title: req.body.title,
      category: req.body.category,
      goal_type: req.body.goal_type,
      goal_value: req.body.goal_value,
      user_id: null
      // days: req.body.days || []  ← COMMENT OUT temporarily
    }
    
    const { data, error } = await supabase
      .from('habits')
      .insert([habit])
      .select()
    
    if (error) {
      console.error("❌ Create error:", error)
      throw error
    }
    
    console.log("✅ Habit created:", data[0]?.id)
    res.json(data[0])
  } catch (err) {
    console.error("💥 createHabit ERROR:", err)
    res.status(500).json({ error: err.message })
  }
}

export async function deleteHabit(req, res) {
  try {
    const habitId = req.params.id
    console.log("🗑️ delete:", habitId)
    
    // ✅ STEP 1: Delete ALL related habit_logs FIRST
    const { error: logError } = await supabase
      .from('habit_logs')
      .delete()
      .eq('habit_id', habitId)
    
    if (logError) {
      console.error("Log delete error:", logError)
      // Don't fail - continue with habit delete
    }
    
    // ✅ STEP 2: Delete habit
    const { error: habitError } = await supabase
      .from('habits')
      .delete()
      .eq('id', habitId)
    
    if (habitError) throw habitError
    
    console.log("✅ Habit + logs deleted:", habitId)
    res.json({ success: true })
  } catch (err) {
    console.error("💥 deleteHabit ERROR:", err)
    res.status(500).json({ error: err.message })
  }
}



export async function logHabit(req, res) {
  try {
    const habitId = req.params.id
    console.log("📝 logHabit:", habitId)
    
    // ✅ Get habit details first
    const { data: habit, error: habitError } = await supabase
      .from('habits')
      .select('goal_type, days')
      .eq('id', habitId)
      .single()
    
    if (habitError) throw habitError
    
    const today = new Date()
    const todayDay = today.toLocaleDateString('en-US', { weekday: 'short' }) // "Wed"
    
    // ✅ DAY-WISE RESTRICTION CHECK
    if (habit.goal_type === 'daywise' && (!habit.days || !habit.days.includes(todayDay))) {
      console.log(`❌ Day restriction: Today=${todayDay}, Allowed=${habit.days?.join(',') || 'none'}`)
      return res.status(403).json({ message: `Can only log on ${habit.days?.join(', ') || 'specific days'}` })
    }
    
    // ✅ Already logged today check
    const todayDate = today.toISOString().split('T')[0]
    const { data: todayLog } = await supabase
      .from('habit_logs')
      .select('id')
      .eq('habit_id', habitId)
      .eq('log_date', todayDate)
    
    if (todayLog?.length > 0) {
      return res.status(409).json({ message: 'Already logged today' })
    }
    
    // ✅ Insert log
    const { error } = await supabase
      .from('habit_logs')
      .insert([{ 
        habit_id: habitId,
        completed: true
      }])
    
    if (error) throw error
    
    console.log("✅ Habit logged on", todayDay)
    res.json({ success: true })
  } catch (err) {
    console.error("💥 logHabit ERROR:", err)
    res.status(500).json({ error: err.message })
  }
}

export async function getWellnessScore(req, res) {
  try {
    console.log("📊 Calculating REAL wellness score")
    
    // ✅ REAL habit_logs data count
    const { count: totalLogs, error: totalError } = await supabase
      .from('habit_logs')
      .select('*', { count: 'exact', head: true })
    
    const { count: completedLogs, error: completedError } = await supabase
      .from('habit_logs')
      .select('*', { count: 'exact', head: true })
      .eq('completed', true)
    
    if (totalError || completedError) {
      console.log("No logs yet, score = 0")
      return res.json({ score: 0 })
    }
    
    // ✅ ACTUAL % calculation
    const score = totalLogs > 0 ? Math.round((completedLogs / totalLogs) * 100) : 0
    
    console.log(`📊 REAL score: ${completedLogs}/${totalLogs} = ${score}%`)
    res.json({ score })
    
  } catch (err) {
    console.error("💥 Wellness calc error:", err)
    res.json({ score: 0 })  // Graceful fallback
  }
}

