// routes/reminderRoutes.js
import { Router } from 'express';
import { sendReminderEmail } from '../services/sendReminderEmail.js';

const router = Router();

// Frontend "Reminder" button → REAL EMAIL
router.post('/send', async (req, res) => {
  try {
    const { email, habits } = req.body;
    
    if (!email || !habits || !Array.isArray(habits)) {
      return res.status(400).json({ 
        error: "Email and habits array required" 
      });
    }

    //  Build beautiful HTML email
    const habitList = habits.map(h => ` ${h.title}`).join('<br>');
    
    const html = `
      <div style="font-family: -apple-system, BlinkMacSystemFont, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #3b82f6;">⏰ Daily Habit Reminders</h2>
        <p>Good morning! Complete today's habits:</p>
        
        <div style="background: #f8fafc; padding: 20px; border-radius: 12px; margin: 20px 0; border-left: 4px solid #3b82f6;">
          ${habitList}
        </div>
        
        <a href="https://healthy-habits-v2.netlify.app" 
           style="background: #3b82f6; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; display: inline-block; font-weight: 500;">
          Open Healthy Habits App
        </a>
        
        <p style="color: #64748b; font-size: 14px; margin-top: 24px; text-align: center;">
          Stay consistent! You got this 💪
        </p>
      </div>
    `;

    // Send REAL EMAIL
    await sendReminderEmail(
      email, 
      `⏰ ${habits.length} Daily Habit Reminder${habits.length !== 1 ? 's' : ''}`, 
      html
    );
    
    res.json({ 
      success: true, 
      message: ` Email sent to ${email}! Check inbox.` 
    });
    
  } catch (error) {
    console.error("Reminder route error:", error.message);
    res.status(500).json({ 
      error: "Failed to send reminder email" 
    });
  }
});

export default router;
