import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],

  css: {
    postcss: "./postcss.config.js",
  },

  resolve: {
    alias: {
      "@auth": path.resolve(process.cwd(), "./src/auth"),
      "@businesses": path.resolve(process.cwd(), "./src/businesses"),
      "@learning-path": path.resolve(process.cwd(), "./src/learning-path"),
      "@modules": path.resolve(process.cwd(), "./src/modules"),
      "@shared": path.resolve(process.cwd(), "./src/shared"),
    },
  },
});
