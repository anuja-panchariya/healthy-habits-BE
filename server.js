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

// ✅ MIDDLEWARE FIRST (Fixed order!)
app.use(cors({
  origin: "https://healthy-habits-frontend-tawny.vercel.app/",  
  credentials: true
}))

app.use(express.json())

// ✅ PUBLIC ROUTES (NO AUTH)
app.get("/", (req, res) => {
  res.json({ 
    message: "Healthy Habits BE Live!", 
    status: "running",
    endpoints: ["/api/health", "/api/habits", "/api/analytics", "/api/moods/ai-analyze"]
  })
})

app.get("/api/health", (req, res) => res.json({ status: "healthy" }))

// ✅ ROUTES BEFORE GLOBAL AUTH (CRITICAL FIX!)
app.use("/api/habits", habitRoutes)      // ← FIRST!
app.use("/api/analytics", analyticsRoutes)
app.use("/api/challenges", challengeRoutes)
app.use("/api/moods", moodRoutes)
app.use("/api/ai", aiRoutes)
app.use("/api/reminders", reminderRoutes)

// ✅ PUBLIC AI ENDPOINT (No auth needed)
app.post('/api/moods/ai-analyze', analyzeMood)

// ✅ GLOBAL AUTH AFTER ROUTES (Fixed!)
app.use(authMiddleware)

// ERROR HANDLER LAST
app.use(errorHandler)

// CRON JOB
cron.schedule('0 8 * * *', async () => {
  console.log('🌅 Auto-sending daily reminders...')
})

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`)
  console.log(`✅ Health: http://localhost:${PORT}/api/health`)
  console.log(`✅ Habits: http://localhost:${PORT}/api/habits`)
})
