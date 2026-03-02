import express from "express"
import cors from "cors"

const app = express()
app.use(cors({ origin: true }))
app.use(express.json())

// ✅ REAL DATA STORAGE
let habits = []
let habitLogs = []
let challenges = []

// WELLNESS SCORE (Real calculation)
const calculateWellnessScore = () => {
  const todayLogs = habitLogs.filter(log => 
    new Date(log.date).toDateString() === new Date().toDateString()
  )
  return todayLogs.length > 0 ? Math.min(100, 50 + todayLogs.length * 10) : 50
}

// HABITS ✅
app.get("/api/habits", (req, res) => res.json({ habits }))

app.post("/api/habits", (req, res) => {
  const habit = { 
    id: Date.now().toString(), 
    title: req.body.title,
    category: req.body.category || "general",
    created_at: new Date().toISOString(),
    logs: []
  }
  habits.push(habit)
  res.status(201).json({ success: true, habit })
})

app.delete("/api/habits/:id", (req, res) => {
  habits = habits.filter(h => h.id !== req.params.id)
  res.json({ success: true })
})

// ✅ HABIT LOGGING (TODAY MARK)
app.post("/api/habits/:id/log", (req, res) => {
  const habitId = req.params.id
  const habit = habits.find(h => h.id === habitId)
  if (habit) {
    const log = {
      id: Date.now().toString(),
      habitId,
      date: new Date().toISOString().split('T')[0]
    }
    habit.logs.push(log)
    habitLogs.push(log)
    res.json({ success: true, log })
  } else {
    res.status(404).json({ error: "Habit not found" })
  }
})

// ANALYTICS ✅ REAL DATA
app.get("/api/habits/wellness-score", (req, res) => 
  res.json({ score: calculateWellnessScore() })
)

app.get("/api/analytics", (req, res) => {
  const today = new Date().toDateString()
  const weekAgo = new Date(Date.now() - 7*24*60*60*1000).toDateString()
  
  res.json({
    totalHabits: habits.length,
    todayLogs: habitLogs.filter(log => 
      new Date(log.date).toDateString() === today
    ).length,
    weeklyLogs: habitLogs.filter(log => 
      new Date(log.date).toDateString() >= weekAgo
    ).length,
    bestCategory: habits.length > 0 ? 
      habits.reduce((max, h) => h.logs.length > max.logs.length ? h : max, habits[0]).category : "none"
  })
})

// CHALLENGES
app.get("/api/challenges", (req, res) => res.json({ challenges }))
app.post("/api/challenges", (req, res) => {
  const challenge = { id: Date.now().toString(), title: req.body.title, created_at: new Date().toISOString() }
  challenges.push(challenge)
  res.status(201).json({ success: true, challenge })
})

app.listen(process.env.PORT || 5000, () => console.log("🚀 Backend LIVE!"))
