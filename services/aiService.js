import { GoogleGenerativeAI } from "@google/generative-ai"

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY) // ← .env me GEMINI_API_KEY

export async function generateAIResponse(prompt) {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" }) // Updated model
    const result = await model.generateContent(prompt)
    const text = await result.response.text()
    
    // Parse JSON safely
    try {
      return JSON.parse(text)
    } catch {
      return [{ title: "Keep tracking!", reason: "Consistency builds habits 💪" }]
    }
  } catch (error) {
    console.error('Gemini AI Error:', error)
    return [
      { title: "Morning Water", category: "hydration", reason: "Boosts metabolism 30%" },
      { title: "Evening Walk", category: "movement", reason: "Improves sleep quality" }
    ]
  }
}
