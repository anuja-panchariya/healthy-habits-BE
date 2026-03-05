import express from "express"
import cors from "cors"

const app = express()
app.use(cors({ origin: true }))
app.use(express.json())

// ✅ REAL IN-MEMORY DATA STORAGE
let habits = []
let habitLogs = []
let challenges = []
let userChallenges = [] // ✅ NEW: Track user joins

// WELLNESS SCORE
const calculateWellnessScore = () => {
  const todayLogs = habitLogs.filter(log => 
    new Date(log.date).toDateString() === new Date().toDateString()
  )
  return todayLogs.length > 0 ? Math.min(100, 50 + todayLogs.length * 10) : 50
}

// 🔥 HABITS ROUTES (Working)
app.get("/api/habits", (req, res) => res.json({ habits }))
app.post("/api/habits", (req, res) => {
  const habit = { 
    id: Date.now().toString(), 
    title: req.body.title,
    category: req.body.category || "general",
    goal_type: req.body.goal_type || "daily",
    goal_value: req.body.goal_value || 1,
    days: req.body.days || [],
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
app.post("/api/habits/:id/log", (req, res) => {
  const habitId = req.params.id
  const habit = habits.find(h => h.id === habitId)
  if (habit) {
    const today = new Date().toISOString().split('T')[0]
    const existingLog = habit.logs.find(log => log.date === today)
    if (existingLog) {
      return res.status(409).json({ error: "Already logged today" })
    }
    const log = { id: Date.now().toString(), habitId, date: today }
    habit.logs.push(log)
    habitLogs.push(log)
    res.json({ success: true, log })
  } else {
    res.status(404).json({ error: "Habit not found" })
  }
})

// 🔥 ANALYTICS
app.get("/api/analytics", (req, res) => {
  const today = new Date().toDateString()
  const weekAgo = new Date(Date.now() - 7*24*60*60*1000).toDateString()
  res.json({
    totalHabits: habits.length,
    todayLogs: habitLogs.filter(log => new Date(log.date).toDateString() === today).length,
    weeklyLogs: habitLogs.filter(log => new Date(log.date).toDateString() >= weekAgo).length,
    wellnessScore: calculateWellnessScore(),
    bestCategory: habits.length > 0 ? 
      habits.reduce((max, h) => h.logs.length > max.logs.length ? h : max, habits[0]).category : "none"
  })
})

// 🔥 CHALLENGES - ALL ROUTES ✅
app.get("/api/challenges", (req, res) => {
  // Add participant count
  const challengesWithCount = challenges.map(challenge => ({
    ...challenge,
    participants_count: userChallenges.filter(uc => uc.challenge_id === challenge.id).length
  }))
  res.json(challengesWithCount)
})

app.post("/api/challenges", (req, res) => {
  const challenge = { 
    id: Date.now().toString(),
    title: req.body.title,
    description: req.body.description || '',
    category: req.body.category || 'health',
    duration: req.body.duration || 30,
    goal: req.body.goal || '',
    created_at: new Date().toISOString(),
    participants_count: 0
  }
  challenges.push(challenge)
  console.log("➕ NEW CHALLENGE:", challenge.title)
  res.status(201).json({ success: true, challenge })
})

// ✅ CRITICAL ROUTES - 404 FIXED!
app.get("/api/challenges/my", (req, res) => {
  // Mock my challenges + real joined ones
  const myJoined = userChallenges
    .filter(uc => uc.user_id === 'current_user') // Simulate current user
    .map(uc => challenges.find(c => c.id === uc.challenge_id))
    .filter(Boolean)
  
  const mockMy = myJoined.length > 0 ? myJoined : [
    {
      id: 'mock1',
      title: 'Hydration Challenge', 
      description: 'Drink 8 glasses daily',
      progress: 65,
      duration: 30,
      participants_count: 23
    }
  ]
  res.json(mockMy)
})

app.post("/api/challenges/:id/join", (req, res) => {
  const challengeId = req.params.id;
  console.log("🔍 JOIN PARAM:", challengeId); // DEBUG
  
  // ✅ SAFETY CHECK
  if (!challengeId || challengeId === 'undefined') {
    return res.status(400).json({ error: "Invalid challenge ID" });
  }
  
  const challenge = challenges.find(c => c.id === challengeId);
  if (!challenge) {
    return res.status(404).json({ error: "Challenge not found" });
  }
  
  const userChallenge = {
    id: Date.now().toString(),
    challenge_id: challengeId,
    user_id: 'current_user',
    joined_at: new Date().toISOString()
  };
  
  if (!userChallenges.find(uc => uc.challenge_id === challengeId && uc.user_id === 'current_user')) {
    userChallenges.push(userChallenge);
    console.log("🤝 Joined:", challenge.title);
    res.json({ success: true, message: `Joined ${challenge.title}!` });
  } else {
    res.status(409).json({ error: "Already joined" });
  }
});

// 🔥 WELLNESS SCORE
app.get("/api/habits/wellness-score", (req, res) => 
  res.json({ score: calculateWellnessScore() })
)

const PORT = process.env.PORT || 5000
app.listen(PORT, () => {
  console.log(`🚀 Backend LIVE on port ${PORT}!`)
  console.log(`📊 Data: ${habits.length} habits, ${challenges.length} challenges`)
})
