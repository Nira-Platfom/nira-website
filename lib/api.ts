import axios from "axios";

// Hardcoded fallback, same defensive pattern used for the backend's CORS
// origins and self-ping URL: NEXT_PUBLIC_API_URL has already gone missing
// from the hosting platform's own dashboard once before without anyone
// noticing at build time — Next.js can't inline a value that was never
// set, so it silently compiles to a runtime `process.env` lookup that
// resolves to undefined in the browser, and every request quietly goes to
// a relative path on this site's own origin instead of the backend. That
// exact failure is what caused "can't log in" / "backend not connected"
// even though the backend itself was working correctly the whole time.
const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "https://nira-backend-w7p9.onrender.com",
  withCredentials: true,
  timeout: 15000,
});

api.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("nira_token");
    if (token) config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (res) => res,
  async (err) => {
    if (err.response?.status === 401 && typeof window !== "undefined") {
      localStorage.removeItem("nira_token");
      if (!window.location.pathname.startsWith("/login")) {
        window.location.href = "/login";
      }
    }
    return Promise.reject(err);
  }
);

// Two different shapes come back from this backend on failure: a normal
// error is {detail: "..."}, but the rate limiter's handler (main.py) returns
// {error, message, retry_after} instead — a caller that only checks
// `.detail` sees neither, and a rate-limited request looks identical to
// "something went wrong" or falls back to a stock message that hides what
// actually happened. Centralized here so every call site handles both.
export function apiErrorMessage(e: any, fallback: string): string {
  const data = e?.response?.data;
  if (data?.detail) {
    // A Pydantic/FastAPI validation failure (weak password, bad field,
    // etc.) sends detail as an ARRAY of {msg, loc, ...} objects, not a
    // string — passing that straight to a toast rendered as an unreadable
    // blank/garbled message instead of the actual reason, which is
    // exactly what a register/login form validation error looks like.
    // Pydantic also prefixes a field_validator's own raised message with
    // "Value error, " — stripped here so the user sees the real text
    // ("Password must be at least 8 characters"), not Pydantic's wrapper.
    if (Array.isArray(data.detail)) {
      const messages = data.detail
        .map((d: any) => (typeof d?.msg === "string" ? d.msg.replace(/^Value error,\s*/, "") : null))
        .filter(Boolean);
      if (messages.length) return messages.join(" ");
    } else if (typeof data.detail === "string") {
      return data.detail;
    }
  }
  if (e?.response?.status === 429) {
    const retryAfter = data?.retry_after;
    return retryAfter
      ? `Too many attempts. Try again in ${retryAfter} seconds.`
      : "Too many attempts. Please wait a moment and try again.";
  }
  if (data?.message) return data.message;
  if (e?.code === "ECONNABORTED") return "The server took too long to respond. Please try again.";
  if (!e?.response) return "Couldn't reach the server. Check your connection and try again.";
  return fallback;
}

export default api;
