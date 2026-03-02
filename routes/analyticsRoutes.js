import express from "express"
import { requireAuth } from "@clerk/express"
import { 
  getStreaks, 
  getAnalytics, 
  getTrends,        
  getCategoryStats  
} from "../controllers/analyticsController.js"

const router = express.Router()

router.get('/streaks', requireAuth(), getStreaks)
router.get('/trends', requireAuth(), getTrends)          
router.get('/category-stats', requireAuth(), getCategoryStats) 
router.get('/habits/wellness-score', requireAuth(), getAnalytics) 
router.get("/", requireAuth(), getAnalytics)

export default router
