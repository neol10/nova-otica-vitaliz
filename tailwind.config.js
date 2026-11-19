/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    screens: {
      xs: '375px',
      sm: '640px',
      md: '768px',
      lg: '1024px',
      xl: '1280px',
      '2xl': '1536px',
    },
    container: {
      center: true,
      padding: {
        DEFAULT: '1.25rem',
        sm: '2rem',
        lg: '3rem',
        xl: '4rem',
      },
    },
    extend: {
      colors: {
        // Tokens semânticos do projeto Nova Ótica Vitaliz
        wine: {
          deep: '#220912',
          DEFAULT: '#220912',
          soft: '#381321',
        },
        champagne: {
          light: '#FAF7F2',
          DEFAULT: '#F7F2EC',
          dark: '#EBE2D5',
        },
        offwhite: {
          DEFAULT: '#FCFAF8',
          pure: '#FFFFFF',
          subtle: '#F6F3EE',
        },
        gold: {
          light: '#DFC184',
          DEFAULT: '#C5A059',
          dark: '#A6823B',
          glow: 'rgba(197, 160, 89, 0.25)',
        },
        graphite: {
          light: '#4A4A52',
          DEFAULT: '#1E1E22',
          dark: '#141416',
        },
      },
      fontFamily: {
        display: ['"Cormorant Garamond"', 'Georgia', 'serif'],
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
      fontSize: {
        // Escala tipográfica responsiva e editorial
        'hero-title': ['clamp(2.5rem, 6vw + 1rem, 5.5rem)', { lineHeight: '1.05', letterSpacing: '-0.02em' }],
        'section-title': ['clamp(2rem, 3.5vw + 0.5rem, 3.5rem)', { lineHeight: '1.15', letterSpacing: '-0.015em' }],
        'editorial-sub': ['clamp(1.125rem, 1.5vw + 0.5rem, 1.75rem)', { lineHeight: '1.35' }],
        'body-lg': ['1.125rem', { lineHeight: '1.65' }],
        'body-md': ['1rem', { lineHeight: '1.6' }],
        'body-sm': ['0.875rem', { lineHeight: '1.5' }],
        'caption': ['0.75rem', { lineHeight: '1.4', letterSpacing: '0.08em' }],
      },
      spacing: {
        '18': '4.5rem',
        '22': '5.5rem',
        '30': '7.5rem',
      },
      boxShadow: {
        'subtle-gold': '0 4px 20px -2px rgba(197, 160, 89, 0.15)',
        'elevated-wine': '0 20px 40px -15px rgba(34, 9, 18, 0.4)',
        'glass-rim': '0 0 0 1px rgba(197, 160, 89, 0.2)',
      },
      transitionTimingFunction: {
        'luxury': 'cubic-bezier(0.16, 1, 0.3, 1)',
      },
    },
  },
  plugins: [],
}
