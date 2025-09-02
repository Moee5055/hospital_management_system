import { defineConfig } from "vite";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import path from "path";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    allowedHosts: ["d12fdac0be4a.ngrok-free.app"],
    host: true, // accept external connections
    cors: true, // allow all origins
    strictPort: false, // optional, avoid port conflicts
  },
});
