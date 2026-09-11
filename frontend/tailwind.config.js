export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        navy: {
          950: '#030D23',
          900: '#071A45', // Deep navy primary
          800: '#0E2969',
          700: '#14388D',
          600: '#1C52C2', // Accent blue
          500: '#2A68E6',
        },
        accent: {
          blue: '#1C52C2',
          gold: '#FFC000',
          goldLight: '#FFF0B3',
        },
        canvas: {
          soft: '#DFE4EE',
          bg: '#F4F6FB',
          card: '#FFFFFF',
        },
        primary: {
          50: '#f0f4ff',
          100: '#dfe4ee',
          500: '#1c52c2',
          600: '#1542a3',
          700: '#0e2969',
          900: '#071a45',
        }
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        display: ['Outfit', 'sans-serif'],
      },
      boxShadow: {
        'soft-lg': '0 10px 30px -5px rgba(7, 26, 69, 0.08), 0 4px 6px -2px rgba(7, 26, 69, 0.03)',
        'soft-xl': '0 20px 40px -10px rgba(7, 26, 69, 0.12), 0 8px 10px -3px rgba(7, 26, 69, 0.04)',
        'glow-blue': '0 0 25px rgba(28, 82, 194, 0.35)',
        'glow-gold': '0 0 25px rgba(255, 192, 0, 0.35)',
      }
    },
  },
  plugins: [],
}
