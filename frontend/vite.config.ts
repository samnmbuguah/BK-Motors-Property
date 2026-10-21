import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  const target = env.VITE_APP_TARGET || (mode === 'motors' ? 'motors' : mode === 'properties' ? 'properties' : 'all');
  
  let outDir = 'dist';
  if (target === 'motors') {
    outDir = 'dist/motors';
  } else if (target === 'properties') {
    outDir = 'dist/properties';
  }

  return {
    plugins: [react()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
      },
    },
    build: {
      outDir,
      emptyOutDir: true,
    },
    server: {
      port: 3000,
    },
    define: {
      '__BUILD_TARGET__': JSON.stringify(target),
    },
  };
});
