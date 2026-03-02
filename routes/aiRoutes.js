import express from 'express'
import { supabase } from '../config/supabaseClient.js'
import { generateAIResponse } from '../services/aiService.js'

const router = express.Router()

router.get('/recommendations', async (req, res) => {
  const authData = await req.auth()
  const { data: habits } = await supabase
    .from('habits').select('title,category').eq('user_id', authData.userId)
  
  const prompt = `User habits: ${JSON.stringify(habits||[])}. Suggest 3 NEW habits. JSON array.`
  try {
    const recommendations = await generateAIResponse(prompt)
    res.json({ recommendations: Array.isArray(recommendations) ? recommendations : [], habitsCount: habits?.length || 0 })
  } catch {
    res.json({ recommendations: [], habitsCount: 0 })
  }
})

export default router
