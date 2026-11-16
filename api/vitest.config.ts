import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    environment: 'node',
    include: ['tests/**/*.test.ts'],
    env: {
      NODE_ENV: 'test',
      MONGO_URI: 'mongodb://localhost:27017/cdiscam_test',
      JWT_SECRET: 'test-secret-with-at-least-32-characters-long',
    },
  },
})
