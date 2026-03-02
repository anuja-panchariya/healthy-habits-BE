import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import habitRoutes from './routes/habitRoutes.js'
import aiRoutes from './routes/aiRoutes.js'
import { authMiddleware } from './config/clerk.js'
import { analyzeMood } from './controllers/aiController.js'

dotenv.config()
const app = express()

app.use(cors({ origin: "https://healthy-habits-frontend-tawny.vercel.app", credentials: true }))
app.use(express.json())

app.get('/', (req, res) => res.json({ message: 'Healthy Habits AI Backend LIVE!' }))
app.get('/api/health', (req, res) => res.json({ status: 'healthy', gemini: !!process.env.GEMINI_API_KEY }))

app.use(authMiddleware)
app.use('/api/habits', habitRoutes)
app.use('/api/ai', aiRoutes)
app.post('/api/moods/ai-analyze', analyzeMood)

const PORT = process.env.PORT || 5000
app.listen(PORT, () => console.log(`🚀 Backend: http://localhost:${PORT}`))
