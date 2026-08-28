import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vite.dev/config/
export default defineConfig({
  base: '/',
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'https://shey-pos-server-psi.vercel.app',
        changeOrigin: true,
        secure: false,
      },
    },
  },
});
