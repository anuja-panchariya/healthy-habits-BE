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

app.use(cors({
  origin: "https://healthy-habits-v2.netlify.app",  
  credentials: true
}))

// ✅ EXPRESS JSON
app.use(express.json())

// ROOT ROUTE 
app.get("/", (req, res) => {
  res.json({ 
    message: " Healthy Habits BE Live!", 
    status: "running",
    endpoints: ["/api/health", "/api/habits", "/api/analytics"]
  })
})

//  HEALTH CHECK 
app.get("/api/health", (req, res) => res.json({ status: "healthy" }))

app.use(authMiddleware)

app.use("/api/habits", habitRoutes)
app.use("/api/analytics", analyticsRoutes)
app.use("/api/challenges", challengeRoutes)
app.use("/api/moods", moodRoutes)
app.use("/api/ai", aiRoutes)
app.use("/api/reminders", reminderRoutes)

app.use(errorHandler)

cron.schedule('0 8 * * *', async () => {
  console.log('🌅 Auto-sending daily reminders...')
})

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`)
})
