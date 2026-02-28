// config/clerk.js - EXPRESS VERSION (Working 100%)
import { clerkMiddleware } from '@clerk/express'

export const authMiddleware = clerkMiddleware()

export default authMiddleware
