import express from "express"
import cors from "cors"
import dotenv from "dotenv"

dotenv.config()
const app = express()
const PORT = process.env.PORT || 5000

app.use(cors({
  origin: true,  // Allow all for demo
  credentials: true
}))
app.use(express.json())

// ✅ ALL ROUTES - NO CONTROLLERS NEEDED!
app.get("/api/health", (req, res) => res.json({ status: "healthy" }))

// HABITS ✅
app.get("/api/habits", (req, res) => res.json({ habits: [] }))
app.post("/api/habits", (req, res) => {
  const habit = { id: Date.now().toString(), ...req.body }
  res.status(201).json({ success: true, habit })
})
app.delete("/api/habits/:id", (req, res) => res.json({ success: true }))
app.post("/api/habits/:id/log", (req, res) => res.json({ success: true }))
app.get("/api/habits/wellness-score", (req, res) => res.json({ score: 60 }))

// CHALLENGES ✅
app.get("/api/challenges", (req, res) => res.json({ challenges: [] }))
app.post("/api/challenges", (req, res) => res.status(201).json({ success: true }))

// ANALYTICS ✅
app.get("/api/analytics", (req, res) => res.json({ totalHabits: 3 }))
app.get("/api/analytics/streaks", (req, res) => res.json({ streaks: [7] }))

// OTHERS ✅
app.get("/api/moods", (req, res) => res.json({ moods: [] }))
app.post("/api/moods", (req, res) => res.status(201).json({ success: true }))
app.get("/api/ai", (req, res) => res.json({ suggestions: [] }))
app.post("/api/reminders", (req, res) => res.status(201).json({ success: true }))

app.listen(PORT, () => {
  console.log(`🚀 Server: port ${PORT}`)
  console.log(`✅ https://healthy-habits-be-1.onrender.com/api/health`)
})
