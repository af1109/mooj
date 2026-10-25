import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        gulf: "#064B50",
        ocean: "#087E83",
        turquoise: "#21B6B0",
        sand: "#F4E8D2",
        cream: "#FFF9F0",
        terracotta: "#B96548",
        ink: "#17363A",
        muted: "#64777A",
      },
      fontFamily: { sans: ["var(--font-tajawal)", "system-ui", "sans-serif"] },
      boxShadow: { card: "0 8px 24px rgba(6, 75, 80, 0.10)" },
      borderRadius: { card: "24px" },
    },
  },
  plugins: [],
};
export default config;