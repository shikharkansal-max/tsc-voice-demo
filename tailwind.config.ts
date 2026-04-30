import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        "tsc-red": "#CC0000",
        "tsc-red-dark": "#AA0000",
        "tsc-red-light": "#E60000",
        "tsc-green": "#2D5F2D",
        "tsc-green-dark": "#1E4620",
        "tsc-green-light": "#3A7D3A",
        "tsc-olive": "#4A6741",
        "tsc-black": "#1A1A1A",
        "tsc-gray": "#F5F5F5",
        "tsc-text-muted": "#6B7280",
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
      },
      boxShadow: {
        card: "0 4px 24px rgba(0,0,0,0.10)",
        "card-lg": "0 8px 40px rgba(0,0,0,0.15)",
      },
    },
  },
  plugins: [],
};
export default config;
