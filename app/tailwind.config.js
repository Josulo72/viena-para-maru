/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        ink: '#0F1620',
        surface: '#18232F',
        line: '#2B3948',
        'lang-es': '#E0A040',
        'lang-pt': '#48ADA4',
        text: '#E9EEF3',
        muted: '#8496A6',
      },
      fontFamily: {
        display: ['Unbounded', 'system-ui', 'sans-serif'],
        body: ['"Golos Text"', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'monospace'],
      },
      borderRadius: { bubble: '14px', ctl: '8px' },
    },
  },
  plugins: [],
}
