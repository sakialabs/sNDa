import { defineConfig } from 'vitest/config';
import path from 'path';

export default defineConfig({
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./tests/setup.ts'],
    css: false, // Disable CSS processing for tests
    coverage: {
      provider: 'v8',
      reportsDirectory: './.vitest-coverage',
      reporter: ['text', 'html'],
      exclude: ['**/node_modules/**', '**/e2e/**', '**/tests/**']
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
});
