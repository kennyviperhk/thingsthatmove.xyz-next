import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    screens: {
      'sm': '640px',
      'md': '768px',
      'lg': '1024px',
      'xl': '1280px',
      '2xl': '1536px',
    },
    maxWidth: {
      '7xl': '80rem',
    },
    extend: {
      colors: {
        foreground: 'rgb(var(--foreground-rgb))',
        background: 'rgb(var(--background-rgb))',
      },
    },
  },
  plugins: [],
}

export default config 