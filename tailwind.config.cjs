module.exports = {
  content: [
    './index.html',
    './src/**/*.{ts,tsx,js,jsx,html}',
  ],
  theme: {
    extend: {
      colors: {
        'pink-candy': '#FFD1DC',
        'pink-milk': '#FFF0F5',
        'soft-gold': '#FDE68A',
        'hello-black': '#333333',
      },
      borderRadius: {
        'kawaii': '24px',
        'kawaii-lg': '32px',
      },
      boxShadow: {
        'kawaii': '0 10px 25px rgba(255, 209, 220, 0.3)',
      },
      fontFamily: {
        'quicksand': ['Quicksand', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
