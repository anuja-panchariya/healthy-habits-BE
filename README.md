
 🥗 **Healthy Habits Tracker**
 Full-Stack Wellness App with AI Insights & Realtime Analytics

Frontend : https://healthy-habits-frontend.vercel.app
Backend :https://healthy-habits-be-1.onrender.com



 ✨ **Project Overview**

Production-ready **full-stack habit tracking app** with:
- **Daily habit logging** with realtime streaks
- **Mood correlation analytics** 
- **AI-powered habit recommendations** (GPT-4o-mini)
- **Email reminders** & **wellness score**
- **Responsive dashboard** with glassmorphism UI
- **Clerk authentication** + **Supabase realtime**

Tech Stack:** React 18 + Redux Toolkit + Tailwind + Node.js + Supabase + OpenAI

## 🎯 **Features**
✅ User Auth (Clerk JWT) - Sign up/Login/Protected routes
✅ Habit CRUD - Create/Edit/Delete habits with categories
✅ Daily Logging - Streak tracking + mood correlation
✅ AI Recommendations - GPT-4o-mini habit suggestions
✅ Realtime Dashboard - Wellness score, streaks, analytics
✅ Email Reminders - Automated daily habit notifications
✅ Mood Tracker - 5-level mood + habit impact analysis
✅ Responsive Design - Mobile-first glassmorphism UI
✅ Redux State - Global habits + loading/error states
✅ Production Deploy - Vercel (FE) + Render (BE)


🛠️ **Tech Stack**

| Frontend | Backend | Database | AI/ML | Tools |
|----------|---------|----------|-------|-------|
| React 18 | Node.js 20 | Supabase PostgreSQL | OpenAI GPT-4o-mini | Vercel |
| Redux Toolkit | Express 4.19 | Realtime Subscriptions | GPT Vision | Render |
| Tailwind CSS | Zod Validation | Row Level Security | Habit Analysis | CRACO |
| Framer Motion | Clerk JWT Auth | Edge Functions | Mood Correlation | npm |
| Radix UI | Resend Email | REST API | Recommendation Engine | GitHub Actions |

 📊 **Database Schema**

-- Core Tables
habits (PK: id, FK: user_id)
├── id, user_id, title, category, goal_type, goal_value
├── current_streak, best_streak, last_logged, created_at

habit_logs (PK: id, FK: habit_id)  
├── id, habit_id, logged_at, mood_score

mood_entries (PK: id, FK: user_id)
├── id, user_id, mood, notes, habits_impact, created_at

-- Indexes for performance
CREATE INDEX idx_habits_user_id ON habits(user_id);
CREATE INDEX idx_logs_habit_date ON habit_logs(habit_id, logged_at);

 API Documentation
Auth
text
POST /api/auth/verify
Authorization: Bearer <clerk-jwt>
→ { success: true, userId: "user_xxx" }

Habits

GET   /api/habits           → List habits
POST  /api/habits           → { title, category, goal }
PATCH /api/habits/:id       → Update habit
DELETE /api/habits/:id      → Delete habit
POST  /api/habits/:id/log   → Log completion → { streak: 7 }


🔧 Environment Variables
Backend (.env)

PORT=5000
CLERK_SECRET_KEY=sk_test_xxx
SUPABASE_URL=https://xxx.supabase.co
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.xxx
OPENAI_API_KEY=sk-proj-xxx
RESEND_API_KEY=re_xxx

☁️ Production Deployment
Backend (Render)

1. render.com → New Web Service
2. Build: npm install
3. Start: npm start
4. Add .env variables

 🎨 UI/UX Features
🔹 Glassmorphism design (backdrop-blur)
🔹 Dark emerald theme (no blue)
🔹 Framer Motion animations
🔹 Responsive grid (mobile-first)
🔹 Loading states + error handling
🔹 Toast notifications (Sonner)
🔹 Accessibility (Radix UI)

📂 Project Structure

healthy-habits-Backend/
├── routes/             # API endpoints
├── models/             # Supabase queries
├── services/           # AI + Email
├── middleware/         # Auth + Validation
└── utils/              # Helpers
