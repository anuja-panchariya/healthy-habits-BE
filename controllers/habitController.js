import fs from 'fs/promises'
import path from 'path'

const DATA_DIR = path.join(process.cwd(), 'data')
const DATA_FILE = path.join(DATA_DIR, 'habits.json')

// Create data directory
await fs.mkdir(DATA_DIR, { recursive: true })

// Load habits from file
const loadHabits = async () => {
  try {
    const data = await fs.readFile(DATA_FILE, 'utf8')
    return JSON.parse(data)
  } catch {
    return []
  }
}

// Save habits to file
const saveHabits = async (habits) => {
  await fs.writeFile(DATA_FILE, JSON.stringify(habits, null, 2))
}

export const getHabits = async (req, res) => {
  try {
    const habits = await loadHabits()
    console.log('✅ Loaded habits:', habits.length)
    res.json({ habits })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

export const createHabit = async (req, res) => {
  try {
    const { title, category, goal_type, goal_value } = req.body
    console.log('📤 Creating:', { title, category })
    
    const habits = await loadHabits()
    const newHabit = {
      id: Date.now().toString(),
      title,
      category,
      goal_type,
      goal_value: parseInt(goal_value),
      created_at: new Date().toISOString()
    }
    
    habits.unshift(newHabit)  // Add to start
    await saveHabits(habits)
    
    console.log('✅ Created habit:', newHabit.id)
    res.status(201).json({ success: true, habit: newHabit })
  } catch (error) {
    console.error('Create error:', error)
    res.status(500).json({ error: error.message })
  }
}

export const deleteHabit = async (req, res) => {
  try {
    const { id } = req.params
    const habits = await loadHabits()
    const filtered = habits.filter(h => h.id !== id)
    
    await saveHabits(filtered)
    console.log('🗑️ Deleted:', id)
    res.json({ success: true })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

export const logHabit = async (req, res) => {
  try {
    const { id } = req.params
    console.log('📝 Logged habit:', id)
    res.json({ success: true })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

export const getWellnessScore = async (req, res) => {
  try {
    const habits = await loadHabits()
    const score = habits.length ? Math.min(100, 50 + habits.length * 10) : 0
    console.log('🏥 Wellness score:', score)
    res.json({ score })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}
