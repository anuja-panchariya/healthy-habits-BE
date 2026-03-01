// backend/services/aiService.js
import { GoogleGenerativeAI } from "@google/generative-ai"

const genAI = new GoogleGenerativeAI("sk-emergent-4B3F0F6Ee9eCbAcA62")

export async function generateAIResponse(prompt) {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-pro" })
    const result = await model.generateContent(prompt)
    return result.response.text()
  } catch (error) {
    console.error('Emergent AI Error:', error)
    
    // Fallback recommendations (if API fails)
    return JSON.stringify([
      { title: "Morning Water Routine", category: "hydration", reason: "Boosts metabolism by 30% after waking up" },
      { title: "Evening 10-min Walk", category: "movement", reason: "Improves digestion and sleep quality" },
      { title: "5-min Gratitude Journal", category: "mindfulness", reason: "Reduces stress hormones instantly" }
    ])
  }
}
