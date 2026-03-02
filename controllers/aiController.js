import { supabase } from '../config/supabaseClient.js'

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
