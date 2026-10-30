import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  plugins: [react(), tailwindcss()],
  // relative paths so the build also works from a subdirectory (e.g. GitHub Pages)
  base: './',
  test: {
    environment: 'node',
  },
});
