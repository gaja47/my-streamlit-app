import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: {
          DEFAULT: "#0a0a0c",
          50: "#131316",
          100: "#17171b",
          200: "#1c1c20",
          300: "#22222a",
          400: "#2b2b34",
          500: "#3a3a44",
        },
        bone: {
          DEFAULT: "#f5f5f0",
          dim: "#a8a8ad",
          mute: "#6b6b72",
          ghost: "#3a3a40",
        },
        readiness: "#95c9a6",
        sleep: "#8aa2d8",
        activity: "#e0a589",
        strain: "#c98ba8",
        hrv: "#b8a4d4",
      },
      fontFamily: {
        sans: ["ui-sans-serif", "system-ui", "-apple-system", "Inter", "sans-serif"],
        display: ["ui-sans-serif", "system-ui", "Inter", "sans-serif"],
      },
      letterSpacing: {
        tightest: "-0.04em",
      },
    },
  },
  plugins: [],
};

export default config;
