import type { Config } from "tailwindcss";

export default {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
      },
      screens: {
        'xs-box': { 'raw': '(min-width: 310px) and (min-height: 620px)'}, 
        'sm-box': { 'raw': '(min-width: 400px) and (min-height: 800px)'}, 
        'md-box': { 'raw': '(min-width: 510px) and (min-height: 1020px)'}, 
        'lg-box': { 'raw': '(min-width: 550px) and (min-height: 1400px)'}, 
      },
    },
  },
  plugins: [],
} satisfies Config;
