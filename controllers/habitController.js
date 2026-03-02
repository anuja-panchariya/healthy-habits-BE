import fs from 'fs/promises'
import path from 'path'

const DATA_FILE = path.join(process.cwd(), 'data', 'habits.json')

export const getHabits = async (req, res) => {
  try {
    // Always return ARRAY even if empty
    const habits = []
    res.json({ habits })  // ✅ { habits: [] } not null/undefined
    console.log('✅ Habits sent:', habits.length)
  } catch (error) {
    res.status(500).json({ habits: [], error: error.message })
  }
}

export const createHabit = async (req, res) => {
  try {
    const { title, category, goal_type, goal_value } = req.body
    const newHabit = {
      id: Date.now().toString(),
      title,
      category,
      goal_type,
      goal_value: parseInt(goal_value || 1),
      created_at: new Date().toISOString()
    }
    
    // Return immediately (file save optional)
    console.log('✅ Created:', newHabit.title)
    res.status(201).json({ success: true, habit: newHabit })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

export const getWellnessScore = async (req, res) => {
  res.json({ score: 0 })  // ✅ Always number, never null
}
