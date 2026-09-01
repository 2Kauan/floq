/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        bg: 'var(--bg)',
        surface: 'var(--surface)',
        ink: {
          DEFAULT: 'var(--ink)',
          muted: 'var(--ink-muted)',
        },
        accent: {
          DEFAULT: 'var(--accent)',
          hover: 'var(--accent-hover)',
        },
        border: 'var(--border)',
        destructive: 'var(--destructive)',
        success: 'var(--success)',
      },
      fontFamily: {
        serif: ['Lora', 'serif'],
        sans: ['Inter', 'sans-serif'],
      },
      aspectRatio: {
        '2/3': '2 / 3',
      },
      boxShadow: {
        'cover': '0 2px 8px rgba(0, 0, 0, 0.12)',
        'cover-hover': '0 6px 20px rgba(0, 0, 0, 0.18)',
        'modal': '0 20px 60px rgba(0, 0, 0, 0.3)',
      },
    },
  },
  plugins: [],
}
