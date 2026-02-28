import { sendReminderEmail } from "../services/emailService.js"

export async function sendReminder(req, res, next) {
  try {
    const { email, subject, message } = req.body

    if (!email || !subject || !message) {
      return res.status(400).json({ error: "Missing fields" })
    }

    await sendReminderEmail(email, subject, `<p>${message}</p>`)

    res.json({ message: "Reminder sent successfully" })
  } catch (err) {
    next(err)
  }
}