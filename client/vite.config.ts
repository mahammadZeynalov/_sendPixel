/* eslint-disable import/no-extraneous-dependencies */
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

// https://vitejs.dev/config/
// IMP START - Bundler Issues
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      crypto: "empty-module",
    },
  },
  define: {
    global: "globalThis",
  },
  build: {
    outDir: "dist",
    rollupOptions: {
      output: {
        manualChunks: {
          "react-vendor": ["react", "react-router-dom", "react-dom"],
          "wagmi-vendor": ["wagmi", "viem"],
        },
      },
    },
  },
  // IMP END - Bundler Issues
});
