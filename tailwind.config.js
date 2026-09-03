/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,jsx}',
    './components/**/*.{js,jsx}',
    './lib/**/*.{js,jsx}',
  ],
  theme: {
    extend: {
      colors: {
        // Core brand palette -- LOVE ME AFTER
        obsidian: '#0A0A0A',
        platinum: '#E5E5E5',
        gold: {
          DEFAULT: '#B08D57',
          light: '#C9A96E',
          dark: '#8C6F44',
        },
      },
      fontFamily: {
        // Display serif for luxury headlines -- wired via next/font CSS variables in app/layout.js
        display: ['var(--font-display)', 'Georgia', 'serif'],
        // Neo-grotesque sans for UI/body copy
        sans: ['var(--font-sans)', 'system-ui', 'sans-serif'],
      },
      letterSpacing: {
        widest2: '0.2em',
      },
      transitionTimingFunction: {
        luxury: 'cubic-bezier(0.16, 1, 0.3, 1)',
      },
    },
  },
  plugins: [],
};
