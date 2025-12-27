module.exports = {
  content: [
    './index.html',
    './src/**/*.{ts,tsx,js,jsx,html}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#FF77A9',
          100: '#FFC0CB',
        },
        accent: '#FFF3B0',
        bg: '#FFF0E6',
        lilac: '#CDA4FF',
        text: '#333333',
      },
      borderRadius: {
        'kawaii-sm': '8px',
        'kawaii-lg': '24px',
      },
      boxShadow: {
        'soft': '0 6px 18px rgba(0,0,0,0.06)',
      },
      fontFamily: {
        sans: ['Poppins', 'sans-serif'],
        decorative: ['"Baloo 2"', 'cursive'],
      },
    },
  },
  plugins: [],
}
