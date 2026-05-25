import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./app/**/*.{js,ts,jsx,tsx}', './components/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        pinterest: '#E60023',
        'pinterest-dark': '#ad081b',
      },
    },
  },
  plugins: [],
};

export default config;
