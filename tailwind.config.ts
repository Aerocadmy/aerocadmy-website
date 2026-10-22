import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          blue: "#0097B2",
          "blue-hover": "#007f96",
          green: "#18CB96",
          "green-hover": "#14b081",
          navy: "#081C2B",
          "navy-light": "#0b3347",
          ink: "#4a5b68",
          line: "#e3eef0",
          tint: "rgba(24,203,150,0.10)",
          tint2: "rgba(0,151,178,0.08)",
          bg: "#fbfdfd",
        },
      },
      fontFamily: {
        sans: ["var(--font-plus-jakarta)", "system-ui", "sans-serif"],
      },
      boxShadow: {
        cta: "0 8px 18px -10px rgba(0,151,178,0.55)",
        "cta-hover": "0 12px 22px -10px rgba(0,151,178,0.6)",
        primary: "0 14px 26px -12px rgba(8,28,43,0.7)",
        card: "0 10px 26px -14px rgba(8,28,43,0.15)",
        "card-hover": "0 20px 35px -15px rgba(0,151,178,0.25)",
      },
      keyframes: {
        pingSlow: {
          "0%": { transform: "scale(0.6)", opacity: "1" },
          "100%": { transform: "scale(2.2)", opacity: "0" },
        },
        floatSlow: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-8px)" },
        },
      },
      animation: {
        "ping-slow": "pingSlow 2s cubic-bezier(0, 0, 0.2, 1) infinite",
        "float-slow": "floatSlow 4s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};
export default config;

