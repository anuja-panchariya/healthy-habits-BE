export const createHabit = async (req, res) => {
  try {
    const { name, category, goal } = req.body
    const userId = req.auth.userId  // Clerk middleware
    
    const newHabit = {
      name,
      category, 
      goal,
      userId,
      createdAt: new Date()
    }
    
    // Database save (Supabase/Postgres)
    const result = await db.habits.create(newHabit)
    
    res.status(201).json({
      success: true,
      habit: result
    })
  } catch (error) {
    console.error('Create habit error:', error)
    res.status(500).json({ error: 'Failed to create habit' })
  }
}
