import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        coral: {
          DEFAULT: "#FF6B6B",
          light: "#FFE8E8",
          dark: "#E55555",
          // "deep" = dashboard-only, higher-contrast shade for text on *-light
          // badge backgrounds. Kept separate from "dark" (the marketing site's
          // dark-mode accent shade) so neither surface has to compromise.
          deep: "#C04040",
        },
        lavender: {
          DEFAULT: "#B8A9E0",
          light: "#F0ECFB",
          dark: "#9B8BC8",
          deep: "#534AB7",
        },
        mint: {
          DEFAULT: "#6BCFB8",
          light: "#E4F7F3",
          dark: "#4DB8A0",
          deep: "#065F46",
        },
        amber: {
          DEFAULT: "#F59E0B",
          light: "#FEF3C7",
          deep: "#92400E",
        },
        charcoal: {
          DEFAULT: "#1E293B",
          light: "#334155",
        },
        nira: {
          dark: "#1E293B",
          muted: "#94A3B8",
          border: "#E2E8F0",
          bg: "#F8F7FF",
        },
        // Business dashboard page background (nira/web) — distinct name from
        // "nira.bg" (same hex) so dashboard code reads naturally as `bg-page`.
        page: "#F8F7FF",
      },
      fontFamily: {
        sans: ["var(--font-dm-sans)", "Arial", "sans-serif"],
        serif: ["var(--font-dm-serif)", "Georgia", "serif"],
      },
      borderRadius: {
        card: "16px",
        btn: "10px",
        input: "10px",
      },
      boxShadow: {
        card: "0 2px 8px rgba(0,0,0,0.06)",
        "card-hover": "0 4px 16px rgba(0,0,0,0.10)",
        "btn-coral": "0 4px 12px rgba(255,107,107,0.30)",
      },
      keyframes: {
        dashShimmer: {
          "0%": { backgroundPosition: "-400px 0" },
          "100%": { backgroundPosition: "400px 0" },
        },
      },
      animation: {
        "dash-shimmer": "dashShimmer 1.4s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};

export default config;
