import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    port: 8081,
    open: true,
  },
  build: {
    // Remove console.log and debugger statements in production
    minify: "esbuild",
    terserOptions: {
      compress: {
        drop_console: true, // remove console.* calls
        drop_debugger: true, // remove debugger statements
      },
    },
  },
});
