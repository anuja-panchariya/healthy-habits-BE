import { Router } from 'express';
import { sendReminderEmail } from '../services/sendReminderEmail.js';

const router = Router();

// FRONTEND CALL - /api/reminders/send
router.post('/send', async (req, res) => {
  try {
    const { email, habitName } = req.body;
    
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; padding: 20px;">
        <h2 style="color: #3b82f6;">⏰ ${habitName} Reminder!</h2>
        <p>Time to complete your daily habit!</p>
        <br/>
        <a href="https://healthy-habits-v2.netlify.app" 
           style="background: #3b82f6; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; font-weight: bold;">
          Open Healthy Habits
        </a>
        <br/><br/>
        <p style="color: #6b7280; font-size: 12px;">
          This is an automated reminder from Healthy Habits.
        </p>
      </div>
    `;

    await sendReminderEmail(email, `⏰ ${habitName} Reminder`, html);
    res.json({ success: true, message: "Reminder sent successfully!" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
