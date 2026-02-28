import express from "express"
import { requireAuth } from "@clerk/express"
import { 
  getChallenges, 
  createChallenge,
  joinChallenge,
  getLeaderboard      
} from "../controllers/challengeController.js"

const router = express.Router()

router.get('/', requireAuth(), getChallenges)
router.post('/', requireAuth(), createChallenge)
router.post('/:id/join', requireAuth(), joinChallenge)     
router.get('/:id/leaderboard', requireAuth(), getLeaderboard)
export default router
