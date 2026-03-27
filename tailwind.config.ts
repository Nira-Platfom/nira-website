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
        },
        lavender: {
          DEFAULT: "#B8A9E0",
          light: "#F0ECFB",
          dark: "#9B8BC8",
        },
        mint: {
          DEFAULT: "#6BCFB8",
          light: "#E4F7F3",
          dark: "#4DB8A0",
        },
        nira: {
          dark: "#1E293B",
          muted: "#94A3B8",
          border: "#E2E8F0",
          bg: "#F8F7FF",
        },
      },
      fontFamily: {
        sans: ["var(--font-dm-sans)", "Arial", "sans-serif"],
        serif: ["var(--font-dm-serif)", "Georgia", "serif"],
      },
    },
  },
  plugins: [],
};

export default config;
