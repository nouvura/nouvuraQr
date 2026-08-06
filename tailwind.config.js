/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,jsx}",
    "./components/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        void: {
          DEFAULT: "#050505",
          soft: "#0b0b0d",
          elevated: "#121214",
          line: "#221f1f",
        },
        oxblood: {
          DEFAULT: "#6E0F20",
          bright: "#B4152F",
          deep: "#3D0812",
        },
        gilt: {
          DEFAULT: "#C9A24B",
          bright: "#E8C874",
          dim: "#8A7038",
        },
        bone: {
          DEFAULT: "#EDEAE3",
          dim: "#9C978E",
          faint: "#5C5852",
        },
      },
      fontFamily: {
        display: ["var(--font-orbitron)", "sans-serif"],
        body: ["var(--font-rajdhani)", "sans-serif"],
        mono: ["var(--font-mono)", "monospace"],
      },
      backgroundImage: {
        "aurora-red":
          "radial-gradient(60% 60% at 20% 20%, rgba(180,21,47,0.35) 0%, rgba(180,21,47,0) 70%)",
        "aurora-gold":
          "radial-gradient(50% 50% at 80% 30%, rgba(201,162,75,0.25) 0%, rgba(201,162,75,0) 70%)",
        grain: "url('/grain.svg')",
      },
      boxShadow: {
        gilt: "0 0 0 1px rgba(201,162,75,0.35), 0 0 30px -8px rgba(201,162,75,0.55)",
        blood: "0 0 0 1px rgba(180,21,47,0.4), 0 0 40px -10px rgba(180,21,47,0.6)",
      },
      keyframes: {
        scanline: {
          "0%": { transform: "translateY(-100%)" },
          "100%": { transform: "translateY(100%)" },
        },
        pulseGlow: {
          "0%, 100%": { opacity: 0.5 },
          "50%": { opacity: 1 },
        },
        assemble: {
          "0%": { opacity: 0, transform: "scale(0.85)" },
          "100%": { opacity: 1, transform: "scale(1)" },
        },
      },
      animation: {
        scanline: "scanline 3.2s linear infinite",
        pulseGlow: "pulseGlow 2.4s ease-in-out infinite",
        assemble: "assemble 0.6s cubic-bezier(0.16,1,0.3,1) both",
      },
    },
  },
  plugins: [],
};
