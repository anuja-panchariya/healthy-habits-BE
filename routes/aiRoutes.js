
import express from 'express'
import { generateAIResponse } from '../services/aiService.js'

const router = express.Router()

router.get('/recommendations', async (req, res) => {
  try {
    // User's habits se personalized prompt
    const habits = req.user?.habits || ['water drinking', 'exercise']
    const prompt = `Based on these habits: ${habits.join(', ')}, suggest 3-5 personalized habit recommendations. Return JSON format:
    [
      {"title": "Habit Name", "category": "category", "reason": "why this helps"},
      ...
    ]`

    const aiResponse = await generateAIResponse(prompt)
    
    // Parse AI response as JSON
    const recommendations = JSON.parse(aiResponse)
    
    res.json({ 
      recommendations: Array.isArray(recommendations) ? recommendations : [],
      timestamp: new Date().toISOString()
    })
  } catch (error) {
    console.error('AI Recommendations Error:', error)
    // Fallback recommendations
    res.json({
      recommendations: [
        { id: 1, title: 'Morning Water', category: 'hydration', reason: 'Boosts metabolism 30%' },
        { id: 2, title: '5-min Walk', category: 'movement', reason: 'Improves mood instantly' }
      ]
    })
  }
})

export default router
