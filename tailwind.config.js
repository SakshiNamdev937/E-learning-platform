/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./public/index.html"
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: "#eff6ff",
          100: "#dbeafe",
          200: "#bfdbfe",
          300: "#93c5fd",
          400: "#60a5fa",
          500: "#3b82f6",
          600: "#2563eb", // Brand Primary
          700: "#1d4ed8",
          800: "#1e40af",
          900: "#1e3a8a",
        },

        secondary: {
          50: "#f0fdf4",
          100: "#dcfce7",
          200: "#bbf7d0",
          300: "#86efac",
          400: "#4ade80",
          500: "#22c55e",
          600: "#16a34a", // Brand Accent
          700: "#15803d",
          800: "#166534",
          900: "#14532d",
        },

        neutral: {
          50: "#f8fafc",
          100: "#f1f5f9",
          200: "#e2e8f0",
          300: "#cbd5e1",
          400: "#94a3b8",
          500: "#64748b",
          600: "#475569",
          700: "#334155",
          800: "#1e293b",
          900: "#0f172a",
        },

        semantic: {
          success: "#16a34a",
          warning: "#f59e0b",
          error: "#ef4444",
          info: "#2563eb",
        },
      },

      fontFamily: {
        heading: ["Outfit", "sans-serif"],
        body: ["Inter", "sans-serif"],
      },

      borderRadius: {
        lg: "0.5rem",
        xl: "0.75rem",
        "2xl": "1rem",
      },

      boxShadow: {
        premium:
          "0 4px 20px -2px rgba(37,99,235,0.08), 0 2px 8px -1px rgba(37,99,235,0.05)",

        "premium-hover":
          "0 12px 32px -4px rgba(22,163,74,0.15), 0 6px 18px -2px rgba(37,99,235,0.12)",
      },

      backgroundImage: {
        "hero-gradient":
          "linear-gradient(135deg,#2563eb 0%,#16a34a 100%)",

        "card-gradient":
          "linear-gradient(180deg,#ffffff 0%,#f8fafc 100%)",
      },
    },
  },
  plugins: [],
};