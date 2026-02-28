import { getOrCreateUser } from "../models/userModel.js"
import { getMoods, addMood } from "../models/moodModel.js"

export async function fetchMoods(req, res, next) {
  try {
    const user = await getOrCreateUser(req.auth.userId)
    const moods = await getMoods(user.id)
    res.json(moods)
  } catch (err) {
    next(err)
  }
}

export async function createMood(req, res, next) {
  try {
    const user = await getOrCreateUser(req.auth.userId)

    const mood = await addMood({
      ...req.body,
      user_id: user.id
    })

    res.status(201).json(mood)
  } catch (err) {
    next(err)
  }
}