import { supabase } from '../config/supabaseClient.js'
import { generateAIResponse } from '../services/aiService.js'

export const analyzeMood = async (req, res) => {
  const { mood, notes, history } = req.body
  const prompt = `Mood: ${mood}. Notes: "${notes}". History: ${JSON.stringify(history?.slice(0,3))}.
  JSON: {"habitImpact":"Water helped","aiInsight":"Hydration boosts mood!"}`
  
  try {
    const result = await generateAIResponse(prompt)
    res.json(result)
  } catch {
    res.json({ habitImpact: "Habit analysis", aiInsight: "Keep tracking!" })
  }
}
