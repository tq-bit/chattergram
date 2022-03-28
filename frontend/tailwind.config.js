module.exports = {
  content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  purge: ['./src/**/*.vue'],
  darkMode: 'class', // or 'media' or 'class'
  theme: {
    extend: {
      height: (theme) => ({
        'screen/2': '50vh',
        'screen/3': 'calc(100vh / 3)',
        'screen/4': 'calc(100vh / 4)',
        'screen/5': 'calc(100vh / 5)',
      }),
    },

    // Sizes

    // Fonts
    // fontFamily: {
    //   sans: ["Roboto", "sans-serif"],
    //   serif: ["Prata", "serif"]
    // },
    // Colors
    textColor: (theme) => ({
      ...theme('colors'),
      'q-purple': '#9e4d90',
      'q-blue': '#4693c8',
    }),

    backgroundColor: (theme) => ({
      ...theme('colors'),
      'q-purple': '#9e4d90',
      'q-blue': '#4693c8',
    }),

    borderColor: (theme) => ({
      ...theme('colors'),
      'q-purple': '#9e4d90',
      'q-blue': '#4693c8',
    }),

    gradientColorStops: (theme) => ({
      ...theme('colors'),
      'q-purple': '#9e4d90',
      'q-blue': '#4693c8',
    }),

    boxShadow: {
      sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
      DEFAULT: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
      md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
      lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
      xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
      '2xl': '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
      primary: '0 0 4px 1px #4693c8',
      inner: 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.06)',
      none: 'none',
    },
  },
  variants: {},
  plugins: [],
};
