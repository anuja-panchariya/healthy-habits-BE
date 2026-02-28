import express from "express"
import { requireAuth } from "@clerk/express"
import { 
  getHabits,
  createHabit,
  deleteHabit,
  logHabit,
  getWellnessScore  
} from "../controllers/habitController.js"

const router = express.Router()

router.get('/', requireAuth(), getHabits)
router.post('/', requireAuth(), createHabit)
router.delete('/:id', requireAuth(), deleteHabit)
router.post('/:id/log', requireAuth(), logHabit)
router.get('/wellness-score', requireAuth(), getWellnessScore)

export default router
