import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        dpr: {
          red: "#8B0000",
          "red-bright": "#C8102E",
          "red-dark": "#5C0000",
          gold: "#D4AF37",
          "gold-light": "#F7E792",
          "gold-dark": "#B45309",
          navy: "#0A111E",
          "navy-card": "#131D31",
          emerald: "#065F46",
          "emerald-bright": "#059669",
          "emerald-dark": "#044E38",
          slate: "#0F172A",
          muted: "#94A3B8",
          // Light Mode specifics
          "light-bg": "#F8FAFC",
          "light-card": "#FFFFFF",
          "light-border": "#E2E8F0",
          "light-text": "#0F172A",
          "light-muted": "#64748B",
        },
      },
      fontFamily: {
        sans: ["var(--font-sans)", "Plus Jakarta Sans", "Inter", "sans-serif"],
        serif: ["var(--font-serif)", "Lora", "Playfair Display", "Georgia", "serif"],
      },
      backgroundImage: {
        "hero-gradient": "linear-gradient(135deg, #0A111E 0%, #1A050A 50%, #0A111E 100%)",
        "hero-gradient-light": "linear-gradient(135deg, #F8FAFC 0%, #E6F4EA 50%, #F1F5F9 100%)",
        "gold-gradient": "linear-gradient(135deg, #D4AF37 0%, #FFF3B0 50%, #B38F24 100%)",
        "emerald-gradient": "linear-gradient(135deg, #065F46 0%, #059669 100%)",
        "red-gradient": "linear-gradient(135deg, #8B0000 0%, #C8102E 100%)",
        "glass-gradient": "linear-gradient(135deg, rgba(255, 255, 255, 0.05) 0%, rgba(255, 255, 255, 0.01) 100%)",
      },
      boxShadow: {
        "gold-glow": "0 0 25px -5px rgba(212, 175, 55, 0.3)",
        "red-glow": "0 0 25px -5px rgba(200, 16, 46, 0.3)",
        "emerald-glow": "0 0 25px -5px rgba(6, 95, 70, 0.3)",
        "card-hover": "0 20px 40px -15px rgba(0, 0, 0, 0.15)",
      },
      animation: {
        "pulse-slow": "pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "float": "float 6s ease-in-out infinite",
        "ticker": "ticker 30s linear infinite",
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-10px)" },
        },
        ticker: {
          "0%": { transform: "translateX(0%)" },
          "100%": { transform: "translateX(-50%)" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
