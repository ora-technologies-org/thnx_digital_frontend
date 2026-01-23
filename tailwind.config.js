/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#3b82f6", // blue-500
          light: "#60a5fa", // blue-400
          dark: "#2563eb", // blue-600
        },
        secondary: {
          DEFAULT: "#ef4444", // red-500
          light: "#f87171", // red-400
          dark: "#dc2626", // red-600
        },
        accent: {
          DEFAULT: "#9333ea", // purple-600
          dark: "#7e22ce", // purple-700
        },
        danger: {
          DEFAULT: "#dc2626", // red-600
          dark: "#b91c1c", // red-700
        },
      },
      backgroundImage: {
        "gradient-primary": "linear-gradient(to right, #2563eb, #8B5CF6)",
        "gradient-secondary": "linear-gradient(to right, #ef4444, #f97316)",
      },
      animation: {
        gradient: "gradient 8s linear infinite",
        float: "float 6s ease-in-out infinite",
        glow: "glow 2s ease-in-out infinite",
        shimmer: "shimmer 2s linear infinite",
      },
      keyframes: {
        gradient: {
          "0%, 100%": {
            "background-size": "200% 200%",
            "background-position": "left center",
          },
          "50%": {
            "background-size": "200% 200%",
            "background-position": "right center",
          },
        },
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-20px)" },
        },
        glow: {
          "0%, 100%": { opacity: 1 },
          "50%": { opacity: 0.5 },
        },
        shimmer: {
          "0%": { transform: "translateX(-100%)" },
          "100%": { transform: "translateX(100%)" },
        },
      },
    },
  },
  plugins: [],
};
