import express from 'express'
import { generateAIResponse } from '../services/aiService.js'

const router = express.Router()

router.get('/recommendations', async (req, res) => {
  try {
    const habits = req.user?.habits || ['water', 'exercise']
    const prompt = `User habits: ${habits.join(', ')}. Suggest 3 personalized habits. JSON:
    [
      {"title": "Habit name", "category": "type", "reason": "benefit"},
      ...
    ]`

    const aiResponse = await generateAIResponse(prompt)
    res.json({ 
      recommendations: Array.isArray(aiResponse) ? aiResponse : [],
      timestamp: new Date().toISOString()
    })
  } catch (error) {
    console.error('AI Recommendations Error:', error)
    res.json({ recommendations: fallbackRecommendations() })
  }
})

const fallbackRecommendations = () => [
  { title: "Morning Water", category: "hydration", reason: "Boosts metabolism" },
  { title: "5min Walk", category: "movement", reason: "Improves mood" }
]

export default router  
