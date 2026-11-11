/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        navy: {
          DEFAULT: '#17243A',
          deep: '#101929',
          hover: '#223452',
        },
        burgundy: {
          DEFAULT: '#722F43',
          hover: '#5D2435',
          tint: '#FAF4F6',
        },
        gold: {
          DEFAULT: '#B69A62',
          soft: '#F9F5EB',
        },
        ivory: '#F8F7F3',
        stone: '#E8E5DE',
        charcoal: '#25282D',
        slate: {
          muted: '#737780',
        },
        status: {
          success: '#52745C',
          warning: '#B58A46',
          danger: '#A34C4C',
        },
      },
      fontFamily: {
        sans: ['"Inter"', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
        serif: ['"DM Serif Display"', 'Georgia', 'Cambria', 'serif'],
      },
      borderColor: {
        subtle: '#E8E5DE',
      },
      boxShadow: {
        'subtle': '0 1px 2px rgba(23, 36, 58, 0.04)',
        'card': '0 2px 10px -2px rgba(23, 36, 58, 0.06), 0 1px 3px rgba(23, 36, 58, 0.04)',
        'card-hover': '0 10px 24px -6px rgba(23, 36, 58, 0.11), 0 4px 10px -4px rgba(23, 36, 58, 0.05)',
        'modal': '0 22px 50px -12px rgba(23, 36, 58, 0.28)',
      },
      borderRadius: {
        'sm': '6px',
        'md': '8px',
        'lg': '10px',
        'xl': '12px',
        '2xl': '14px',
      },
    },
  },
  plugins: [],
}
