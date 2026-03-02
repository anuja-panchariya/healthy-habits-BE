import express from "express"
import cors from "cors"
import dotenv from "dotenv"

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

// ✅ MIDDLEWARE FIRST
app.use(cors({
  origin: "https://healthy-habits-frontend-tawny.vercel.app",
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS']
}))
app.use(express.json())

// ✅ API ROUTES BEFORE ANYTHING ELSE (CRITICAL!)
app.use("/api/habits", habitRoutes)
app.use("/api/analytics", analyticsRoutes)
app.use("/api/challenges", challengeRoutes)
app.use("/api/moods", moodRoutes)
app.use("/api/ai", aiRoutes)
app.use("/api/reminders", reminderRoutes)

// ✅ HEALTH CHECK
app.get("/api/health", (req, res) => res.json({ status: "healthy" }))

// ✅ CATCH-ALL LAST (frontend HTML)
app.get("*", (req, res) => {
  res.send(`
    <!doctype html>
    <html>
    <body>
      <h1>Healthy Habits API</h1>
      <p>✅ Backend Live!</p>
      <pre>${JSON.stringify({ endpoints: ["/api/health", "/api/habits"] }, null, 2)}</pre>
    </body>
    </html>
  `)
})

// ✅ ERROR HANDLER LAST
app.use(errorHandler)

app.listen(PORT, () => {
  console.log(`🚀 Server: port ${PORT}`)
  console.log(`✅ Health: /api/health`)
  console.log(`✅ Habits: /api/habits`)
})
