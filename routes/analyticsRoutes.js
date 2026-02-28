import express from "express"
import { requireAuth } from "@clerk/express"
import { 
  getStreaks, 
  getAnalytics, 
  getTrends,        // ✅ ADD THIS
  getCategoryStats  // ✅ ADD THIS
} from "../controllers/analyticsController.js"

const router = express.Router()

// ✅ FIXED ROUTES - YE 4 SAB KAM KARenge
router.get('/streaks', requireAuth(), getStreaks)
router.get('/trends', requireAuth(), getTrends)           // ✅ NEW
router.get('/category-stats', requireAuth(), getCategoryStats) // ✅ NEW
router.get('/habits/wellness-score', requireAuth(), getAnalytics) // ✅ WORKS
router.get("/", requireAuth(), getAnalytics)

export default router
