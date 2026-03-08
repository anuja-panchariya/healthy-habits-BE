import express from "express"
import cors from "cors"
import dotenv from "dotenv"
import cron from 'node-cron'

import habitRoutes from "./routes/habitRoutes.js"
import analyticsRoutes from "./routes/analyticsRoutes.js"
import challengeRoutes from "./routes/challengeRoutes.js"
import moodRoutes from "./routes/moodRoutes.js"
import aiRoutes from "./routes/aiRoutes.js"
import reminderRoutes from "./routes/reminderRoutes.js"

import { authMiddleware } from "./config/clerk.js"
import { errorHandler } from "./middleware/errorHandler.js"

dotenv.config()
const app = express()
const PORT = process.env.PORT || 5000

//  CORS - FIXED for Render frontend
app.use(cors({
  origin: [
    "https://healthy-habits-frontend.onrender.com",
    "http://localhost:3000",
    "https://healthy-habits-v2.netlify.app"
  ],
  credentials: true
}))

//  EXPRESS JSON + URL ENCODED
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// 🩺 HEALTH CHECK FIRST
app.get("/api/health", (req, res) => res.json({ status: "healthy", timestamp: new Date().toISOString() }))

app.get("/", (req, res) => {
  res.json({ 
    message: "🖤💚 Healthy Habits BE Live!",
    status: "running",
    endpoints: [
      "/api/health",
      "/api/habits (GET/POST)",
      "/api/moods (GET/POST)", 
      "/api/analytics",
      "/api/challenges"
    ]
  })
})

app.use(authMiddleware)

app.use("/api/habits", habitRoutes)      
app.use("/api/moods", moodRoutes)        
app.use("/api/analytics", analyticsRoutes)
app.use("/api/challenges", challengeRoutes)
app.use("/api/ai", aiRoutes)
app.use("/api/reminders", reminderRoutes)

// 🛡️ ERROR HANDLER LAST
app.use(errorHandler)

// ⏰ DAILY CRON
cron.schedule('0 8 * * *', async () => {
  console.log('🌅 Auto-sending daily reminders...')
})

app.listen(PORT, () => {
  console.log(`🚀 Black Emerald BE running on port ${PORT}`)
  console.log(`📍 Test: http://localhost:${PORT}/api/health`)
})
