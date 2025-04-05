import { defineConfig } from "vite";
import tailwindcss from "@tailwindcss/vite";
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [tailwindcss(), react()],
  optimizeDeps: {
    exclude: ['react/jsx-dev-runtime']
  },
  server: {
    port: 5173,
    host: true
  }
});
