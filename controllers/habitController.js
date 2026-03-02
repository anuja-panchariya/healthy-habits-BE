import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
)

export const getHabits = async (req, res) => {
  try {
    const { data: habits, error } = await supabase
      .from('habits')
      .select('*')
      .order('created_at', { ascending: false })
    
    if (error) throw error
    res.json({ habits: habits || [] })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

export const createHabit = async (req, res) => {
  try {
    const { title, category, goal_type, goal_value } = req.body  // ✅ YOUR SCHEMA!
    
    const { data, error } = await supabase
      .from('habits')
      .insert([{
        title,           // ✅ Schema field
        category,        // ✅ Schema field  
        goal_type,       // ✅ Schema field
        goal_value: parseInt(goal_value),  // ✅ Schema field
        user_id: req.auth.userId
      }])
      .select()
      .single()
    
    if (error) throw error
    
    res.status(201).json({ success: true, habit: data })
  } catch (error) {
    console.error('Create error:', error)
    res.status(500).json({ error: error.message })
  }
}

export const deleteHabit = async (req, res) => {
  try {
    const { id } = req.params
    const { error } = await supabase
      .from('habits')
      .delete()
      .eq('id', id)
    
    if (error) throw error
    res.json({ success: true })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

export const logHabit = async (req, res) => {
  try {
    const { id } = req.params
    const { data, error } = await supabase
      .from('habit_logs')
      .insert([{
        habit_id: id,
        user_id: req.auth.userId,
        log_date: new Date().toISOString().split('T')[0],
        completed: true
      }])
      .select()
      .single()
    
    if (error) throw error
    res.json({ success: true })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

export const getWellnessScore = async (req, res) => {
  try {
    const { data: habits } = await supabase.from('habits').select('goal_value')
    const score = habits?.length ? Math.min(100, 50 + habits.length * 10) : 0
    res.json({ score })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}
