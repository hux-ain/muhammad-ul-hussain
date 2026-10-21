import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./data/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: "#E50914",
        ink: "#050505",
        reel: "#0b0b0d",
      },
      fontFamily: {
        poster: ["var(--font-poster)", "Impact", "sans-serif"],
        title: ["var(--font-title)", "serif"],
        body: ["var(--font-body)", "system-ui", "sans-serif"],
        mono: ["var(--font-mono)", "ui-monospace", "monospace"],
      },
      boxShadow: {
        glow: "0 0 40px rgba(229,9,20,0.45)",
      },
      keyframes: {
        grain: {
          "0%, 100%": { transform: "translate(0,0)" },
          "10%": { transform: "translate(-5%,-10%)" },
          "30%": { transform: "translate(3%,-15%)" },
          "50%": { transform: "translate(12%,9%)" },
          "70%": { transform: "translate(9%,4%)" },
          "90%": { transform: "translate(-1%,7%)" },
        },
        flicker: {
          "0%, 100%": { opacity: "0.05" },
          "50%": { opacity: "0.09" },
        },
        scan: {
          "0%": { transform: "translateY(-100%)" },
          "100%": { transform: "translateY(100%)" },
        },
        bar: {
          "0%, 100%": { transform: "scaleY(0.3)" },
          "50%": { transform: "scaleY(1)" },
        },
      },
      animation: {
        grain: "grain 0.9s steps(6) infinite",
        flicker: "flicker 0.15s steps(2) infinite",
        scan: "scan 2.4s linear infinite",
        bar: "bar 0.9s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};

export default config;
