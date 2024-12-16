import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";  // Import `path` module for resolving absolute paths

const host = process.env.TAURI_DEV_HOST;

export default defineConfig({
  plugins: [react()],
  css: {
    postcss: './postcss.config.js',
  },
  clearScreen: false,  // Disable Vite's clearing of the console screen
  server: {
    port: 1420,
    strictPort: true,
    host: host || false,  // Conditional on whether the host is defined
    hmr: host
      ? {
          protocol: "ws",
          host,
          port: 1421,
        }
      : undefined,
    watch: {
      ignored: ["**/src-tauri/**"],
    },
  },
  resolve: {
    alias: {
      // Resolving @tauri-apps/api to ensure correct module import
      '@tauri-apps/api': path.resolve(__dirname, 'node_modules/@tauri-apps/api'), // Fix for Tauri API import
    },
  },
});
