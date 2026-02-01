import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        midnight: "#0b0f1c",
        ink: "#0f172a",
        cloud: "#f8fafc",
      },
      backgroundImage: {
        "hero-glow": "radial-gradient(circle at top, rgba(148,163,184,0.2), transparent 55%)",
      },
      boxShadow: {
        glow: "0 0 40px rgba(99,102,241,0.25)",
      },
    },
  },
  plugins: [],
};

export default config;
