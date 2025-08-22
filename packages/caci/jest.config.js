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
  // Keep default transformIgnorePatterns since chalk 4.x is CommonJS
  transformIgnorePatterns: [
    '/node_modules/'
  ],
  // Windows compatibility - increase timeout for slower Windows CI
  testTimeout: 60000,
  maxWorkers: process.platform === 'win32' ? 1 : '50%',
  // Remove chalk module mapping since we're using the CommonJS version (4.1.2)
  // moduleNameMapper not needed for chalk 4.x
  // Force exit to prevent hanging on Windows
  forceExit: true,
  // Detect open handles to help debug hanging tests
  detectOpenHandles: true
};