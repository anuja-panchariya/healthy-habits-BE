// controllers/aiController.js - ADD MISSING EXPORTS
import { supabase } from '../config/supabaseClient.js'

// ✅ EXPORT 1: Already working
export const generateRecommendations = async (req, res) => {
  try {
    const authData = await req.auth()
    const userId = authData.userId
    
    const { data: habits } = await supabase
      .from('habits')
      .select('id, title, category')
      .eq('user_id', userId)
    
    const recommendations = habits?.map(h => ({
      id: h.id,
      title: `📈 ${h.title}`,
      reason: 'Keep going!'
    })) || []

    res.json({ recommendations, habitsCount: habits?.length || 0 })
  } catch (error) {
    res.json({ recommendations: [] })
  }
}

// ✅ EXPORT 2: MISSING YE ADD KARO
export const generatePlan = async (req, res) => {
  try {
    const { prompt } = req.body
    res.json({ 
      result: `AI Plan for: ${prompt || 'your habits'} 💪`,
      habitsSuggested: ['Water', 'Meditation', 'Walk']
    })
  } catch (error) {
    res.status(500).json({ error: 'AI plan failed' })
  }
}
