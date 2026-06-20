/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        // Primary brand palette (from PDF)
        ink: {
          DEFAULT: '#0B1220', // أزرق ليلي — Night Blue
          900: '#0B1220',
          800: '#111A2E',
          700: '#1A2540',
        },
        emerald: {
          brand: '#13BD84', // أخضر زمردي — Emerald Green
          soft: '#2BD89A',
          deep: '#0E9968',
        },
        cream: {
          DEFAULT: '#F7F0F5', // أبيض وردي هادئ — Soft Pinkish White
          100: '#FBF7FA',
          200: '#F7F0F5',
          300: '#EFE3EB',
        },
        // Sector secondaries (from PDF — for cross-page theming)
        sector: {
          ads: '#FF6B2C',     // Aromatic Orange — Advertising
          events: '#2C5BFF',  // Neon Blue — Events & Accommodation
          electric: '#FFD400',// Bright Yellow — Electricity
          travel: '#5BD8E8',  // Light Turquoise — Travel & Tourism
          catering: '#FF7A93',// Warm Pink — Catering
        },
      },
      fontFamily: {
        // Primary Arabic
        hakm: ['"VIP Hakm"', '"Tajawal"', 'system-ui', 'sans-serif'],
        hala: ['"VIP Hala"', '"Cairo"', '"VIP Hakm"', 'system-ui', 'sans-serif'],
        // Secondary
        camel: ['"The Year Of The Camel"', '"Reem Kufi"', '"VIP Hakm"', 'serif'],
        // Default body
        sans: ['"VIP Hakm"', '"Tajawal"', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        brand: '14px',
        'brand-lg': '22px',
      },
      boxShadow: {
        glow: '0 10px 40px -10px rgba(19,189,132,0.45)',
        card: '0 18px 60px -20px rgba(11,18,32,0.55)',
      },
      backgroundImage: {
        'grain': "radial-gradient(circle at 1px 1px, rgba(255,255,255,0.08) 1px, transparent 0)",
        'emerald-fade': 'linear-gradient(135deg, #13BD84 0%, #0E9968 100%)',
        'ink-fade': 'linear-gradient(135deg, #0B1220 0%, #1A2540 100%)',
      },
      keyframes: {
        floatY: {
          '0%,100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-8px)' },
        },
        pulseDot: {
          '0%,100%': { opacity: 1, transform: 'scale(1)' },
          '50%': { opacity: 0.6, transform: 'scale(1.2)' },
        },
      },
      animation: {
        floatY: 'floatY 4s ease-in-out infinite',
        pulseDot: 'pulseDot 2.4s ease-in-out infinite',
      },
    },
  },
  plugins: [],
};
