import express from "express"
import { requireAuth } from "@clerk/express"
import { fetchMoods, createMood } from "../controllers/moodController.js"

const router = express.Router()

router.get("/", requireAuth(), fetchMoods)
router.post("/", requireAuth(), createMood)

export default router