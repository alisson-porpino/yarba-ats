import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')

  return {
    base: env.VITE_BASE_URL || '/',

    plugins: [react()],

    server: {
      host: true,
      port: 5173,
      hmr: {
        host: 'localhost',
        port: 5173,
      },
      watch: {
        usePolling: true,
        interval: 300,
      },
    },
    test: {
      environment: 'jsdom',
      globals: true,
      setupFiles: './src/test/setup.js',
      include: ['src/**/*.test.js'],
      coverage: {
        reporter: ['text', 'html'],
      },
    },
  }
})
