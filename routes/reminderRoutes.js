// routes/reminderRoutes.js - BULLETPROOF VERSION
import express from 'express'
import { requireAuth } from '@clerk/express'
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)
const router = express.Router()

router.post('/test', requireAuth(), async (req, res) => {
  try {
    console.log('🔍 Test email triggered!')
    
    // ✅ CLERK USER EMAIL (Multiple fallbacks)
    const { userId } = await req.auth()
    console.log('👤 USER ID:', userId)
    
    let email = 'anuja.panchariya@gmail.com' // YOUR REAL EMAIL
    
    // Try to get from Clerk
    if (req.auth().user?.primaryEmailAddress?.emailAddress) {
      email = req.auth().user.primaryEmailAddress.emailAddress
    }
    
    console.log('📧 SENDING TO:', email)
    console.log('🔑 RESEND KEY LOADED:', !!process.env.RESEND_API_KEY)
    
    // ✅ REAL RESEND EMAIL
    const data = await resend.emails.send({
      from: 'HealthyHabits <onboarding@resend.dev>',
      to: [email],
      subject: '✅ Anuja - Test Email LIVE!',
      html: `
        <h1 style="color: #10b981;">🎉 HealthyHabits Email WORKING!</h1>
        <p><strong>User ID:</strong> ${userId}</p>
        <p><strong>Time:</strong> ${new Date().toLocaleString('en-IN')}</p>
        <div style="background: #10b981; color: white; padding: 20px; border-radius: 10px;">
          <h2>🥤 Your Daily Reminder:</h2>
          <p>Keep tracking your habits! 💪</p>
        </div>
      `
    })
    
    console.log('✅ EMAIL SUCCESS:', data.data.id)
    res.json({ success: true, sentTo: email })
    
  } catch (error) {
    console.error('❌ RESEND ERROR FULL:', error)
    console.error('❌ RESEND DATA:', error.data)
    
    res.status(500).json({ 
      error: error.message,
      debug: process.env.RESEND_API_KEY ? 'KEY OK' : 'KEY MISSING'
    })
  }
})

export default router
