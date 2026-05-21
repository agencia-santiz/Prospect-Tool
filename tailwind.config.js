const bloomColors = {
  brand: {
    600: '#e6003c',
    500: '#f0445e',
    100: '#fde7ed',
    50: '#fff0f3',
  },
  success: {
    600: '#12b76a',
    50: '#ecfdf3',
  },
  info: {
    600: '#2563eb',
    50: '#eff6ff',
  },
  warning: {
    600: '#f59e0b',
    50: '#fffbeb',
  },
  danger: {
    600: '#d92d20',
    50: '#fef3f2',
  },
  bg: '#f8f9fb',
  surface: '#ffffff',
  border: '#e6e8ef',
  borderMuted: '#f0f2f5',
  textPrimary: '#111827',
  textSecondary: '#667085',
  textMuted: '#98a2b3',
};

const nexusColors = {
  bg: bloomColors.bg,
  surface: bloomColors.surface,
  sidebar: '#111827',
  sidebarHover: '#1f2937',
  input: bloomColors.surface,
  slate: bloomColors.textSecondary,
  primary: bloomColors.brand[600],
  royal: bloomColors.brand[600],
  dark: bloomColors.textPrimary,
  border: bloomColors.border,
  accent: bloomColors.brand[50],
  gold: bloomColors.warning[600],
  goldLight: bloomColors.warning[50],
  crimsonLight: bloomColors.brand[500],
  crimsonDark: '#b42318',
  sand: '#d0d5dd',
  sandLight: bloomColors.borderMuted,
  charcoal: bloomColors.textPrimary,
  warmGray: bloomColors.textSecondary,
  offWhite: bloomColors.bg,
};

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
    './App.tsx',
    './components/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        bloom: bloomColors,
        nexus: nexusColors,
      },
      fontFamily: {
        sans: ['Inter', 'Helvetica Neue', 'Helvetica', 'Arial', 'sans-serif'],
      },
      boxShadow: {
        subtle: '0 1px 2px rgba(16, 24, 40, 0.04)',
        card: '0 1px 3px rgba(16, 24, 40, 0.06)',
        'card-hover': '0 4px 12px rgba(16, 24, 40, 0.08)',
        float: '0 12px 24px rgba(16, 24, 40, 0.12)',
        'crimson-glow': '0 0 0 3px rgba(230, 0, 60, 0.12)',
      },
      animation: {
        fadeIn: 'fadeIn 0.3s ease-out',
        slideIn: 'slideIn 0.3s ease-out',
        shimmer: 'shimmer 2s infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(4px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideIn: {
          '0%': { transform: 'translateX(100%)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' },
        },
        shimmer: {
          '0%': { transform: 'translateX(-100%) skewX(-12deg)' },
          '100%': { transform: 'translateX(200%) skewX(-12deg)' },
        },
      },
    },
  },
  plugins: [],
};
