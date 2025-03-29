/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
      './app/**/*.{js,ts,jsx,tsx,mdx}',
      './pages/**/*.{js,ts,jsx,tsx,mdx}',
      './components/**/*.{js,ts,jsx,tsx,mdx}',
    ],
    theme: {
      extend: {
        colors: {
          border: 'hsl(var(--border))',
        },
        backgroundImage: {
          'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
          'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
        },
        animation: {
          'scan': 'scan 8s linear infinite',
          'pulse': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
          'ping': 'ping 2s cubic-bezier(0, 0, 0.2, 1) infinite',
          'shine': 'shine 8s linear infinite',
        },
        keyframes: {
          scan: {
            '0%': { transform: 'translateX(-100%)' },
            '100%': { transform: 'translateX(100%)' },
          },
          pulse: {
            '0%, 100%': { opacity: '1' },
            '50%': { opacity: '0.5' },
          },
          ping: {
            '75%, 100%': {
              transform: 'scale(2)',
              opacity: '0',
            },
          },
          shine: {
            'to': {
              backgroundPosition: '200% center',
            },
          },
        },
        fontFamily: {
          sans: ['sans-serif'],
        },
      },
    },
    plugins: [],
  }
  
  