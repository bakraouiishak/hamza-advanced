import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  // server: { port: 5173, open: true },
  base: '/',

  build: {
    chunkSizeWarningLimit: 1500, // Silences the warning since we bundled into one file
    rollupOptions: {
      output: {
        manualChunks: undefined,
      },
    }
  }
});