import { supabase } from "../config/supabaseClient.js"

// 1. GET ALL CHALLENGES
export async function getChallenges(req, res) {
  try {
    console.log("🏆 getChallenges called")
    const { data, error } = await supabase.from('challenges').select('*')
    if (error) throw error
    console.log("✅ Challenges:", data?.length || 0)
    res.json(data || [])
  } catch (err) {
    console.error("💥 Challenges ERROR:", err)
    res.status(500).json({ error: err.message })
  }
}

// 2. CREATE CHALLENGE
export async function createChallenge(req, res) {
  try {
    console.log("➕ createChallenge:", req.body)
    const { data, error } = await supabase
      .from('challenges')
      .insert([req.body])
      .select()
    if (error) throw error
    res.json(data[0])
  } catch (err) {
    console.error("💥 createChallenge ERROR:", err)
    res.status(500).json({ error: err.message })
  }
}

// 3. JOIN CHALLENGE
export async function joinChallenge(req, res) {
  try {
    const challengeId = req.params.id
    console.log("🤝 joinChallenge:", challengeId)
    
    const { data, error } = await supabase
      .from('user_challenges')
      .insert([{ challenge_id: challengeId, user_id: null }])
      .select()
    
    if (error) throw error
    res.json({ success: true })
  } catch (err) {
    console.error("💥 joinChallenge ERROR:", err)
    res.status(500).json({ error: err.message })
  }
}

// 4. MY CHALLENGES (ONLY ONE VERSION!)
export async function getMyChallenges(req, res) {
  try {
    console.log("👤 getMyChallenges called")
    
    // MOCK DATA - FULL FEATURES
    const mockData = [
      {
        id: 'mock1',
        title: 'Hydration Challenge',
        description: 'Drink 8 glasses daily',
        progress: 65,
        duration: 30,
        participants_count: 23
      },
      {
        id: 'mock2',
        title: '30 Min Walk',
        description: 'Daily walking challenge',
        progress: 42,
        duration: 30,
        participants_count: 8
      }
    ]
    
    console.log("✅ My Challenges MOCK:", mockData.length)
    res.json(mockData)
  } catch (err) {
    console.error("💥 My Challenges ERROR:", err)
    res.status(500).json({ error: err.message })
  }
}

// 5. LEADERBOARD
export async function getLeaderboard(req, res) {
  try {
    const challengeId = req.params.id
    console.log("📊 getLeaderboard:", challengeId)
    
    // Mock data for now
    const mockData = [
      { id: '1', user_name: 'Anuja Panchariya', rank: 1 },
      { id: '2', user_name: 'Rahul Sharma', rank: 2 },
      { id: '3', user_name: 'Priya Patel', rank: 3 }
    ]
    
    res.json(mockData)
  } catch (error) {
    res.status(200).json([{ user_name: 'Anuja Panchariya', rank: 1 }])
  }
}
