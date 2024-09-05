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
        "red": "#DA4167",
        "gray": "#BDBDBD",
        "blue": "#1296b6",
        "dark-blue": "#2c7d94",
      }
    }
  },
  plugins: [],
};
export default config;
