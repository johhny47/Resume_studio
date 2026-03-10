/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        'poppins': ['Poppins', 'Arial', 'sans-serif'],
      },
      colors: {
        'primary': '#667eea',
        'primary-dark': '#764ba2',
        'secondary': '#f093fb',
        'accent': '#f5576c',
        'success': '#11998e',
        'success-light': '#38ef7d',
        'warning': '#f2994a',
        'warning-light': '#f2c94c',
        'danger': '#ff6b6b',
      },
      backgroundImage: {
        'gradient-primary': 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        'gradient-secondary': 'linear-gradient(135deg, #f093fb, #f5576c)',
        'gradient-success': 'linear-gradient(135deg, #11998e, #38ef7d)',
        'gradient-warning': 'linear-gradient(135deg, #f2994a, #f2c94c)',
        'gradient-danger': 'linear-gradient(135deg, #ff6b6b, #ee5a5a)',
      },
      boxShadow: {
        'menu': '0 10px 40px rgba(0, 0, 0, 0.2)',
        'canvas': '0 20px 60px rgba(0, 0, 0, 0.3)',
        'modal': '0 20px 60px rgba(0, 0, 0, 0.3)',
        'btn-primary': '0 4px 15px rgba(102, 126, 234, 0.4)',
        'btn-primary-hover': '0 6px 20px rgba(102, 126, 234, 0.6)',
        'btn-secondary': '0 4px 15px rgba(245, 87, 108, 0.4)',
        'btn-secondary-hover': '0 6px 20px rgba(245, 87, 108, 0.6)',
        'btn-success': '0 4px 15px rgba(56, 239, 125, 0.4)',
        'btn-success-hover': '0 6px 20px rgba(56, 239, 125, 0.6)',
        'btn-warning': '0 4px 15px rgba(242, 153, 74, 0.4)',
        'btn-warning-hover': '0 6px 20px rgba(242, 153, 74, 0.6)',
        'btn-danger': '0 4px 15px rgba(255, 107, 107, 0.4)',
        'btn-danger-hover': '0 6px 20px rgba(255, 107, 107, 0.6)',
        'height-control': '0 5px 20px rgba(0, 0, 0, 0.1)',
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease',
        'slide-in': 'slideIn 0.3s ease',
      },
      keyframes: {
        fadeIn: {
          'from': { opacity: '0', transform: 'scale(0.9)' },
          'to': { opacity: '1', transform: 'scale(1)' },
        },
        slideIn: {
          'from': { opacity: '0', transform: 'translateY(-20px)' },
          'to': { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [],
}

