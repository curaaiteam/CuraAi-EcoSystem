import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#1617F5',
          hover: '#0e10d4',
          light: '#4547f7',
          pale: '#e8e8fe',
          muted: '#c9cafd',
        },
        accent: {
          DEFAULT: '#FF3B8E',
          hover: '#e62d7e',
          light: '#ff6aaa',
          pale: '#ffe0ef',
        },
        background: '#FBFFFF',
        'background-warm': '#FAF9F7',
        surface: {
          DEFAULT: '#FFFFFF',
          2: '#F8F8F8',
          3: '#F0F3F3',
          4: '#E8ECEC',
        },
        dark: {
          bg: '#0F111E',
          surface: '#151827',
          'surface-2': '#1C1F30',
          border: '#2A2D45',
        },
        border: {
          DEFAULT: '#C2C2C2',
          light: '#DEE5E9',
          lighter: '#EEEEEE',
        },
        'app-text': '#111111',
        muted: '#717070',
        dim: '#AAAAAA',
      },
      fontFamily: {
        sans: ['var(--font-sans)', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
      borderRadius: {
        xl: '0.75rem',
        '2xl': '1rem',
        '3xl': '1.5rem',
        '4xl': '2rem',
      },
      boxShadow: {
        'primary': '0 4px 16px rgba(22, 23, 245, 0.3)',
        'primary-sm': '0 2px 8px rgba(22, 23, 245, 0.2)',
        card: '0 2px 12px rgba(0, 0, 0, 0.06)',
        modal: '0 24px 80px rgba(0, 0, 0, 0.15)',
      },
      animation: {
        'spin-slow': 'spin 3s linear infinite',
        'pulse-slow': 'pulse 3s ease-in-out infinite',
      },
    },
  },
  plugins: [],
};

export default config;
