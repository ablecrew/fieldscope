import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import type { ProxyOptions } from 'vite';

export default defineConfig(({ command }) => {
  const proxy: Record<string, string | ProxyOptions> | undefined =
    command === 'serve'
      ? {
          '/api': {
            target: 'http://127.0.0.1:9000',
            changeOrigin: true,
            secure: false,
          },
        }
      : undefined;

  return {
    plugins: [react()],
    server: {
      port: 5180,
      proxy,
    },
    build: {
      outDir: 'dist',
      sourcemap: false,
      rollupOptions: {
        output: {
          manualChunks(id) {
            if (id.includes('node_modules')) {
              if (id.includes('react') || id.includes('react-dom') || id.includes('react-router-dom')) {
                return 'vendor';
              }

              if (id.includes('lucide-react')) {
                return 'icons';
              }

              return 'dependencies';
            }
          },
        },
      },
    },
  };
});