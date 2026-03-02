import express from "express"
import cors from "cors"
import dotenv from "dotenv"
import cron from 'node-cron'

import habitRoutes from "./routes/habitRoutes.js"
import aiRoutes from "./routes/aiRoutes.js"
import { authMiddleware } from "./config/clerk.js"           
import { errorHandler } from "./middleware/errorHandler.js"
import { analyzeMood } from "./controllers/aiController.js" 

dotenv.config()
const app = express()
const PORT = process.env.PORT || 5000

app.use(cors({ origin: "https://healthy-habits-frontend-tawny.vercel.app", credentials: true }))
app.use(express.json())

app.get("/", (req, res) => res.json({ 
  message: "🚀 Healthy Habits AI Backend LIVE!", 
  endpoints: ["/api/health", "/api/ai/recommendations", "/api/ai/wellness-score"] 
}))

app.get("/api/health", (req, res) => res.json({ 
  status: "healthy", 
  gemini: !!process.env.GEMINI_API_KEY,
  timestamp: new Date().toISOString()
}))

// 🔥 ALL PROTECTED ROUTES
app.use(authMiddleware)

app.use("/api/habits", habitRoutes)
app.use("/api/ai", aiRoutes)
app.post('/api/moods/ai-analyze', analyzeMood)

app.use(errorHandler)

app.listen(PORT, () => {
  console.log(`🚀 AI Backend LIVE: http://localhost:${PORT}`)
  console.log(`✅ Test: http://localhost:${PORT}/api/health`)
})
