/** @type {import('tailwindcss').Config} */
export default {
  content: ['./app/**/*.{js,jsx,ts,tsx}'],
  darkMode: 'media', // Enable automatic dark mode based on system preference
  theme: {
    extend: {
      colors: {
        'accent-gold': 'var(--color-accent-gold)',
        'accent-oxblood': 'var(--color-accent-oxblood)',
        'accent-bronze': 'var(--color-accent-bronze)',
        sand: 'var(--color-sand)',
        desert: 'var(--color-desert)',
        terracotta: 'var(--color-terracotta)',
        dusk: 'var(--color-dusk)',
        sea: 'var(--color-sea)',
        'deep-sea': 'var(--color-deep-sea)',
        'light-sand': 'var(--color-light-sand)',
        'dark-sand': 'var(--color-dark-sand)',
        sunset: 'var(--color-sunset)',
        'text-primary': 'var(--color-text-primary)',
        'text-secondary': 'var(--color-text-secondary)',
        'accent-blue': 'var(--color-sea)'
      },
      fontFamily: {
        display: ['Cabinet Grotesk', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
        sans: ['Plus Jakarta Sans', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'sans-serif']
      },
      spacing: {
        128: '32rem',
        144: '36rem'
      },
      letterSpacing: {
        refined: '-0.02em',
        elegant: '0.05em'
      },
      container: {
        center: true,
        padding: {
          DEFAULT: '1rem',
          sm: '2rem',
          lg: '4rem',
          xl: '5rem',
          '2xl': '6rem'
        }
      },
      transitionDuration: {
        400: '400ms',
        600: '600ms'
      },
      backdropBlur: {
        xs: '2px'
      }
    }
  },
  plugins: []
};
