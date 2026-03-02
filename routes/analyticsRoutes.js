import express from "express"
import { requireAuth } from "@clerk/express"
import { 
  getStreaks, 
  getTrends,        
  getCategoryStats,
  getWellnessScore   // ← Rename getAnalytics to getWellnessScore
} from "../controllers/analyticsController.js"

const router = express.Router()

// ✅ CLEAN ROUTES - NO CONFLICT!
router.get('/streaks', requireAuth(), getStreaks)
router.get('/trends', requireAuth(), getTrends)          
router.get('/category-stats', requireAuth(), getCategoryStats) 
router.get('/wellness-score', requireAuth(), getWellnessScore)  // ✅ Single wellness route

export default router
