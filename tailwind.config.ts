import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#38BDF8', // Sky Blue
          light: 'rgba(56, 189, 248, 0.08)',
          dark: '#0EA5E9',
        },
        accent: '#FF4D2E', // Sharp Red for urgency
        background: '#FAFAFA', // Original Light Gray
        surface: '#FFFFFF',
        card: 'rgba(255, 255, 255, 0.7)',
        text: {
          primary: '#1A1A2E', // Deep Charcoal
          secondary: '#64748B', // Slate Gray
          muted: '#94A3B8',
        },
        border: 'rgba(0, 0, 0, 0.06)',
        cat: {
          exams: { border: '#38BDF8', bg: '#F0F9FF', text: '#0369A1' },
          placements: { border: '#10B981', bg: '#F0FDF4', text: '#15803D' },
          hostel: { border: '#F59E0B', bg: '#FFFBEB', text: '#B45309' },
          professors: { border: '#3B82F6', bg: '#EFF6FF', text: '#1D4ED8' },
          fees: { border: '#EC4899', bg: '#FDF2F8', text: '#BE185D' },
          family: { border: '#10B981', bg: '#ECFDF5', text: '#047857' },
          mental: { border: '#8B5CF6', bg: '#F5F3FF', text: '#6D28D9' },
          other: { border: '#6B7280', bg: '#F9FAFB', text: '#4B5563' },
        }
      },
      fontFamily: {
        sans: ['var(--font-outfit)', 'sans-serif'],
      },
      fontSize: {
        'hero': 'clamp(2rem, 5vw, 3.5rem)',
      },
      animation: {
        'fade-slide': 'fadeSlide 400ms cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'shake': 'shake 300ms ease-in-out',
        'toast': 'toastSlide 2.5s ease-in-out forwards',
        'glow-pulse': 'glowPulse 2s ease-in-out infinite',
        'scale-pop': 'scalePop 200ms cubic-bezier(0.34, 1.56, 0.64, 1)',
        'shimmer': 'shimmer 2s linear infinite',
        'count-up': 'fadeSlide 600ms cubic-bezier(0.16, 1, 0.3, 1) forwards',
      },
      keyframes: {
        fadeSlide: {
          '0%': { opacity: '0', transform: 'translateY(12px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        shake: {
          '0%, 100%': { transform: 'translateX(0)' },
          '25%': { transform: 'translateX(-4px)' },
          '50%': { transform: 'translateX(4px)' },
          '75%': { transform: 'translateX(-4px)' },
        },
        toastSlide: {
          '0%': { opacity: '0', transform: 'translateY(100%)' },
          '10%, 90%': { opacity: '1', transform: 'translateY(0)' },
          '100%': { opacity: '0', transform: 'translateY(100%)' },
        },
        glowPulse: {
          '0%, 100%': { boxShadow: '0 0 20px rgba(56, 189, 248, 0.15)' },
          '50%': { boxShadow: '0 0 30px rgba(56, 189, 248, 0.3), 0 0 60px rgba(56, 189, 248, 0.05)' },
        },
        scalePop: {
          '0%': { transform: 'scale(1)' },
          '50%': { transform: 'scale(1.25)' },
          '100%': { transform: 'scale(1)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
      },
    },
  },
  plugins: [require('@tailwindcss/typography')],
};
export default config;