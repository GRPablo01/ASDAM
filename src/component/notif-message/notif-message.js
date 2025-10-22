module.exports = {
    theme: {
      extend: {
        keyframes: {
          'slide-in-from-right-full': {
            '0%': { transform: 'translateX(100%)', opacity: 0 },
            '100%': { transform: 'translateX(0)', opacity: 1 },
          },
          'slide-out-to-right-full': {
            '0%': { transform: 'translateX(0)', opacity: 1 },
            '100%': { transform: 'translateX(100%)', opacity: 0 },
          },
        },
        animation: {
          'in': 'slide-in-from-right-full 0.3s ease-out forwards',
          'out': 'slide-out-to-right-full 0.3s ease-out forwards',
        },
      },
    },
    plugins: [
      require('tailwindcss-animate'), // plugin tailwind officiel pour data-*
    ],
};