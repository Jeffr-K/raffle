import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'raffle-bg': '#CCCCCC',
        'raffle-black': '#000000',
        'raffle-white': '#FFFFFF',
      },
    },
  },
  plugins: [],
};

export default config;
