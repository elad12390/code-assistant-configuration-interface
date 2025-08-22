// Jest setup file for handling timeouts and cleanup

describe('Jest Setup', () => {
  // Global test setup to prevent hanging
  beforeEach(() => {
    // Clear all active timers before each test
    jest.clearAllTimers();
  });

  afterEach(() => {
    // Clean up any remaining timers and handles
    jest.clearAllTimers();
    jest.restoreAllMocks();
  });
});

// Set up proper test environment
jest.setTimeout(30000);

// Override process exit to prevent hanging in CI
const originalProcessExit = process.exit;
const overrideProcessExit = (code?: number) => {
  // In test environment, just throw instead of exiting
  if (process.env.NODE_ENV === 'test' || process.env.JEST_WORKER_ID) {
    throw new Error(`Process exit called with code: ${code ?? 0}`);
  }
  return originalProcessExit(code);
};
process.exit = overrideProcessExit as typeof process.exit;