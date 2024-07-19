import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      colors: {
        'primary': 'rgba(225, 225, 225, 1)',
        'secondary': 'rgba(210, 210, 210, 1)',
        'bg-bar': 'rgba(255, 0, 0, 1)',
        'input': 'rgba(220, 220, 220, 1)',
        'bg-btn-primary': 'rgba(255, 0, 0, 1)',
        'bg-btn-secondary': 'rgba(255, 255, 255, 1)',

      },
      textColor: {
        'default': 'rgba(30, 30, 30, 1)',
        'btn-primary': 'rgba(255, 255, 255, 1)',
        'subtitle': 'rgba(100, 100, 100, 1)',
        'text-subtitle': 'rgba(100, 100, 100, 1)',
      },
      gridTemplateColumns: {
        "auto-fit-cards": "repeat(auto-fit, minmax(277px, 1fr))",
      }
    },
  },
  plugins: [],
};
export default config;
