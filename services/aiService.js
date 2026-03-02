import { GoogleGenerativeAI } from "@google/generative-ai"

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY)

export async function generateAIResponse(prompt) {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" })
    const result = await model.generateContent(prompt)
    const text = await result.response.text()
    
    try {
      return JSON.parse(text)
    } catch {
      return parseAIResponse(text)
    }
  } catch (error) {
    console.error('Gemini Error:', error)
    return fallbackData()
  }
}

function fallbackData() {
  return {
    recommendations: [
      { title: "Morning Water", category: "hydration", reason: "Boosts metabolism" },
      { title: "Evening Walk", category: "movement", reason: "Improves sleep" }
    ]
  }
}
