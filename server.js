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
import { analyzeMood } from "./controllers/aiController.js" 

dotenv.config()
const app = express()
const PORT = process.env.PORT || 5000

app.use(cors({
  origin: "https://healthy-habits-v2.netlify.app",  
  credentials: true
}))

app.use(express.json())

// ROOT + HEALTH
app.get("/", (req, res) => {
  res.json({ 
    message: "Healthy Habits BE Live!", 
    status: "running",
    endpoints: ["/api/health", "/api/habits", "/api/analytics", "/api/moods/ai-analyze"] // ✅ Added
  })
})

app.get("/api/health", (req, res) => res.json({ status: "healthy" }))

// 🔥 AUTH MIDDLEWARE
app.use(authMiddleware)

// ✅ ALL ROUTES (protected)
app.use("/api/habits", habitRoutes)
app.use("/api/analytics", analyticsRoutes)
app.use("/api/challenges", challengeRoutes)
app.use("/api/moods", moodRoutes)
app.use("/api/ai", aiRoutes)
app.use("/api/reminders", reminderRoutes)

//  MOOD AI ANALYSIS 
app.post('/api/moods/ai-analyze', analyzeMood) // ✅ ADDED HERE

app.use(errorHandler)

cron.schedule('0 8 * * *', async () => {
  console.log('🌅 Auto-sending daily reminders...')
})

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`)
})
