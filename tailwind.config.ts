import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend:{
      colors: {
        "black":"#0D0D0E",
        "white":"#F4F7F5",
        "primary": "#DA4167"
      }
    }
  },
  plugins: [],
};
export default config;
