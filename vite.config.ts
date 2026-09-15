import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  // Inline (empty) PostCSS config so Vite never walks up to a stray
  // postcss.config in a parent directory.
  css: { postcss: { plugins: [] } },
});
