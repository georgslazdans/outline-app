import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  test: {
    environment: "jsdom",
    alias: {
      '@/': new URL('./', import.meta.url).pathname, 
    }
  },
});
