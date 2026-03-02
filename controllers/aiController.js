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
      reason: 'Keep going! Great consistency!'
    })) || []

    res.json({ recommendations, habitsCount: habits?.length || 0 })
  } catch (error) {
    console.error('Supabase Error:', error)
    res.json({ recommendations: [] })
  }
}

export const generatePlan = async (req, res) => {
  try {
    const { prompt } = req.body
    const aiPrompt = `Create personalized habit plan for: "${prompt}". Return JSON with 3 steps.`
    
    const aiResponse = await generateAIResponse(aiPrompt) // Import karo upar se
    res.json({ 
      result: `AI Plan generated for: ${prompt || 'your habits'}`,
      plan: Array.isArray(aiResponse) ? aiResponse : aiResponse.result || 'Plan ready!'
    })
  } catch (error) {
    res.status(500).json({ error: 'AI plan generation failed' })
  }
}

// Mood AI Analysis
export const analyzeMood = async (req, res) => {
  try {
    const { mood, notes, history } = req.body
    const prompt = `Mood: ${mood}, Notes: "${notes}", History: ${JSON.stringify(history?.slice(0,3))}.
    Analyze habit impact. Return JSON:
    {
      "habitImpact": "Exercise helped",
      "aiInsight": "Great consistency insight"
    }`
    
    const aiResponse = await generateAIResponse(prompt)
    res.json(aiResponse)
  } catch (error) {
    res.json({
      habitImpact: detectHabitImpact(notes),
      aiInsight: "Keep tracking your progress!"
    })
  }
}
