// services/sendReminderEmail.js
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendReminderEmail(to, subject, html) {
  try {
    // RENDER SAFETY CHECK
    if (!process.env.RESEND_API_KEY) {
      console.error("❌ RESEND_API_KEY missing in Render Environment");
      throw new Error("Email service not configured - Check Render Environment Variables");
    }

    // ESEND OFFICIAL FORMAT (Array + Custom From)
    const result = await resend.emails.send({
      from: "Healthy Habits <noreply@healthyhabits.app>",  
      to: [to], 
      subject,
      html,
      // Professional tracking
      tags: [
        { name: "category", value: "habit-reminder" },
        { name: "type", value: "daily" }
      ],
      headers: {
        "X-Entity-ID": "healthy-habits-app"
      }
    });

    console.log(` Email sent successfully to ${to}`);
    console.log(` Resend ID: ${result.data?.id}`);
    
    return {
      success: true,
      id: result.data?.id,
      message: "Email delivered successfully"
    };

  } catch (error) {
    console.error("❌ Email failed:", {
      message: error.message,
      code: error?.code,
      to: to
    });

    //  Render logs friendly error
    throw new Error(`Email delivery failed: ${error.message || 'Unknown error'}`);
  }
}
