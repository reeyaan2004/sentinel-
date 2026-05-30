export default {
  content: ['./src/**/*.{ts,tsx}', './src/popup/index.html'],
  theme: {
    extend: {
      colors: {
        navy: '#060D1A',
        'navy-mid': '#0A1628',
        'navy-light': '#0F2040',
        aqua: '#00C8FF',
        amber: '#FFB347',
        danger: '#FF4D6D',
        safe: '#00E5A0',
      },
      fontFamily: {
        nunito: ['Nunito', 'sans-serif'],
      },
    },
  },
  plugins: [],
}