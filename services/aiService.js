import { GoogleGenerativeAI } from "@google/generative-ai"

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY)

export async function generateAIResponse(prompt) {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" })
    const result = await model.generateContent(prompt)
    const text = await result.response.text()
    
    // Safe JSON parsing
    try {
      return JSON.parse(text)
    } catch {
      console.log('AI returned non-JSON, using fallback')
      return parseAIResponse(text)
    }
  } catch (error) {
    console.error('🚨 Gemini Error:', error)
    return fallbackRecommendations()
  }
}

function parseAIResponse(text) {
  const lines = text.split('\n')
  return lines.map(line => {
    const match = line.match(/\{.*\}/)
    return match ? JSON.parse(match[0]) : null
  }).filter(Boolean)
}

const fallbackRecommendations = () => [
  { title: "Morning Water", category: "hydration", reason: "Boosts metabolism 30%" },
  { title: "10min Walk", category: "movement", reason: "Improves mood instantly" },
  { title: "Gratitude Journal", category: "mindfulness", reason: "Reduces stress hormones" }
]
