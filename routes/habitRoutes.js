// src/routes/habitRoutes.js - ALL ROUTES DEFINED!
import express from 'express'
import {
  getHabits,
  createHabit,
  deleteHabit,
  logHabit,
  getWellnessScore
} from '../controllers/habitController.js'

const router = express.Router()

router.get('/habits', getHabits)                    // GET habits
router.post('/habits', createHabit)                 // POST new habit  
router.delete('/habits/:id', deleteHabit)           // DELETE habit
router.post('/habits/:id/log', logHabit)            // Log habit
router.get('/habits/wellness-score', getWellnessScore)  // Wellness score

export default router
