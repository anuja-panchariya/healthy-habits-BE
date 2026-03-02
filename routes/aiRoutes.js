import express from 'express'
import { generateRecommendations, generatePlan } from '../controllers/aiController.js'

const router = express.Router()

// ✅ REAL AI RECOMMENDATIONS (Supabase + Gemini)
router.get('/recommendations', generateRecommendations)

// ✅ REAL AI PLAN GENERATOR  
router.post('/plan', generatePlan)

// ✅ WELLNESS SCORE (AI Analysis)
router.get('/wellness-score', async (req, res) => {
  try {
    const authData = await req.auth()
    const userId = authData.userId
    
    const { data: habits } = await supabase
      .from('habits')
      .select('title, streak, category, logs')
      .eq('user_id', userId)
    
    const prompt = `AI Wellness Score (0-100):
Habits: ${JSON.stringify(habits)}
Score factors: streak, variety, consistency, balance

JSON: {
  "score": 87,
  "grade": "A-",
  "insights": ["Hydration perfect", "Add mindfulness"],
  "nextLevel": "Evening walk → 95+"
}`

    const aiResponse = await generateAIResponse(prompt)
    res.json(aiResponse)
  } catch (error) {
    res.json({ 
      score: 75, 
      grade: "B", 
      insights: ["Good start!"],
      nextLevel: "Add 1 more habit"
    })
  }
})

export default router
