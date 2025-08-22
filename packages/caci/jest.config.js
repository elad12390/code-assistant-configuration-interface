module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  roots: ['<rootDir>/src', '<rootDir>/tests'],
  testMatch: ['**/__tests__/**/*.(ts|tsx)', '**/*.test.(ts|tsx)'],
  collectCoverageFrom: [
    'src/**/*.{ts,tsx}',
    '!src/**/*.d.ts'
  ],
  coverageDirectory: 'coverage',
  coverageReporters: ['text', 'lcov', 'html'],
  verbose: true,
  // Transform node_modules that contain ES modules
  transformIgnorePatterns: [
    '/node_modules/(?!(chalk)/)'
  ],
  // Fix module resolution for chalk 4.x CommonJS
  moduleNameMapper: {
    '^chalk$': 'chalk'
  },
  // Reduce timeout for faster CI feedback
  testTimeout: 30000,
  maxWorkers: process.platform === 'win32' ? 1 : '50%',
  // Clean exit settings for CI stability
  forceExit: true,
  detectOpenHandles: true,
  // Prevent Jest from hanging on timeouts
  setupFilesAfterEnv: ['<rootDir>/tests/jest.setup.ts']
};