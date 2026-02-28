// aiRoutes.js - Just add this ONE LINE
import express from "express"
import { requireAuth } from "@clerk/express"
import { generatePlan, generateRecommendations } from "../controllers/aiController.js"

const router = express.Router()

router.post("/", requireAuth(), generatePlan)
router.get("/recommendations", requireAuth(), generateRecommendations)  // ✅ THIS LINE ONLY!

export default router
