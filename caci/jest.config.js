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
  transformIgnorePatterns: [
    '/node_modules/(?!chalk)/'
  ],
  // Windows compatibility - increase timeout for slower Windows CI
  testTimeout: 60000,
  maxWorkers: process.platform === 'win32' ? 1 : '50%',
  // Handle chalk ESM module transformation
  moduleNameMapper: {
    '^chalk$': '<rootDir>/node_modules/chalk/source/index.js'
  },
  // Force exit to prevent hanging on Windows
  forceExit: true,
  // Detect open handles to help debug hanging tests
  detectOpenHandles: true
};