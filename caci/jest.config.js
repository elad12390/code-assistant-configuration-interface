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
  // Windows compatibility
  testTimeout: 30000,
  maxWorkers: '50%',
  // Handle chalk ESM module transformation
  moduleNameMapper: {
    '^chalk$': '<rootDir>/node_modules/chalk/source/index.js'
  }
};