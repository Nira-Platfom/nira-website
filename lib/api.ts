import axios from "axios";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
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
  if (data?.detail) return data.detail;
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
