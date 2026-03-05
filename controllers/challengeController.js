import { supabase } from "../config/supabaseClient.js"

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

export async function getMyChallenges(req, res) {
  try {
    console.log("👤 getMyChallenges called")
    
    // Mock data for now (real user_id )
    const mockData = [
      {
        id: 'mock-my-1',
        title: 'Hydration Challenge',
        description: 'Drink 8 glasses daily',
        progress: 65,
        duration: 30
      },
      {
        id: 'mock-my-2', 
        title: '30 Min Walk',
        description: 'Daily walking challenge',
        progress: 42,
        duration: 30
      }
    ]
    
    console.log("✅ My Challenges MOCK:", mockData.length)
    res.json(mockData)
  } catch (err) {
    console.error("💥 My Challenges ERROR:", err)
    res.status(500).json({ error: err.message })
  }
}

// MART HYBRID LEADERBOARD
export async function getLeaderboard(req, res) {
  try {
    const challengeId = req.params.id
    console.log("📊 getLeaderboard - Challenge ID:", challengeId)
    
    // 1️⃣ TRY Real Supabase query
    const { data, error } = await supabase
      .from('user_challenges')
      .select(`
        id,
        challenge_id,
        user_id,
        joined_at,
        user_name
      `)
      .eq('challenge_id', challengeId)
      .order('joined_at', { ascending: false })
    
    console.log("📊 Supabase response:", { 
      data: data?.length || 0, 
      error: error?.message || 'none' 
    })
    
    // 2️⃣ IF real data exists → Return real users
    if (data && Array.isArray(data) && data.length > 0) {
      console.log("✅ REAL DATA FOUND:", data.length, "users")
      const enrichedData = data.map((user, idx) => ({
        ...user,
        user_name: user.user_name || `User #${idx + 1}`,
        rank: idx + 1
      }))
      return res.json(enrichedData)
    }
    
    // 3️⃣ Supabase empty → Perfect Mock data
    console.log("📊 Using MOCK DATA")
    const mockData = [
      {
        id: `mock1-${challengeId}`,
        challenge_id: challengeId,
        user_id: 'anuja_panchariya',
        joined_at: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
        user_name: 'Anuja Panchariya',
        rank: 1
      },
      {
        id: `mock2-${challengeId}`,
        challenge_id: challengeId,
        user_id: 'rahul_sharma', 
        joined_at: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
        user_name: 'Rahul Sharma',
        rank: 2
      },
      {
        id: `mock3-${challengeId}`,
        challenge_id: challengeId,
        user_id: 'priya_patel',
        joined_at: new Date(Date.now() - 1000 * 60 * 12).toISOString(),
        user_name: 'Priya Patel', 
        rank: 3
      }
    ]
    
    console.log("✅ MOCK DATA sent:", mockData.length, "users")
    res.json(mockData)
    
  } catch (error) {
    console.error("💥 Leaderboard ERROR - Using FALLBACK:", error.message)
    res.status(200).json([
      { id: 'fallback1', user_name: 'Anuja Panchariya (You)', rank: 1 },
      { id: 'fallback2', user_name: 'Demo User', rank: 2 }
    ])
  }
}
