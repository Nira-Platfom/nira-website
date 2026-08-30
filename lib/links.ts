// The business dashboard ((auth)/(dashboard) route groups) lives in this same
// app, so those links are plain relative paths — no separate origin/server.
export const DASHBOARD_LOGIN_URL = '/login'
export const DASHBOARD_REGISTER_URL = '/register'

// Shared Nira WhatsApp number (Ghala rails) — sourced from env so it can
// differ per environment without a code change. Must match the backend's
// NIRA_WHATSAPP_NUMBER.
export const WHATSAPP_NUMBER = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '255651723862'
export const WHATSAPP_CHAT_URL = `https://wa.me/${WHATSAPP_NUMBER}`
