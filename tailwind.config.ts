import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './index.html',
    './node_modules/tw-elements-react/dist/js/**/*.js',
  ],
  keyframes: {
    'fade-in': {
      '0%': { opacity: '0' },
      '100%': { opacity: '0.2' },
    },
  },
  // animation
  animation: {
    'fade-in': 'fade-in 1s ease-in-out',
  },
  plugins: [
    require('@tailwindcss/typography'),
    require('tw-elements-react/dist/plugin.cjs'),
  ],
  darkMode: 'class',
}
export default config
