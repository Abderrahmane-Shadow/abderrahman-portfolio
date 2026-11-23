/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#eff6ff',
          100: '#dbeafe',
          200: '#bfdbfe',
          300: '#93c5fd',
          400: '#60a5fa',
          500: '#3b82f6',
          600: '#2563eb', // Primary Blue
          700: '#1d4ed8',
          800: '#1e40af',
          900: '#1e3a8a',
          950: '#172554',
        },
        light: {
          bg: '#FFFFFF',
          secondaryBg: '#F4F8FF',
          card: '#FFFFFF',
          text: '#0F172A',
          secondaryText: '#64748B',
          border: '#E2E8F0',
        },
        dark: {
          bg: '#0B1120',
          secondaryBg: '#111C30',
          card: '#162238',
          text: '#F8FAFC',
          secondaryText: '#A1AEC0',
          border: '#26364D',
          hoverBorder: '#3b82f6',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        arabic: ['Cairo', 'Tajawal', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'soft-glow': '0 0 35px -10px rgba(37, 99, 235, 0.25)',
        'card-light': '0 4px 20px -2px rgba(15, 23, 42, 0.05), 0 2px 6px -1px rgba(15, 23, 42, 0.03)',
        'card-dark': '0 4px 25px -2px rgba(0, 0, 0, 0.4), 0 0 1px 1px rgba(255, 255, 255, 0.05)',
      }
    },
  },
  plugins: [],
}
