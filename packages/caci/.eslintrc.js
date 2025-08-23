module.exports = {
  root: true,
  env: {
    node: true,
    es2022: true,
    jest: true,
  },
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:@typescript-eslint/recommended-requiring-type-checking',
    'plugin:node/recommended',
    'plugin:jest/recommended',
    'prettier', // Must be last to override other configs
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 2022,
    sourceType: 'module',
    project: './tsconfig.lint.json',
  },
  plugins: [
    '@typescript-eslint',
    'node',
    'jest',
  ],
  settings: {
    node: {
      tryExtensions: ['.ts', '.tsx', '.js', '.jsx', '.json'],
      resolvePaths: ['node_modules/@types'],
      version: '>=18.0.0',
    },
  },
  rules: {
    // TypeScript specific rules
    '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
    '@typescript-eslint/explicit-function-return-type': 'off',
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    '@typescript-eslint/no-explicit-any': 'warn',
    '@typescript-eslint/no-unsafe-assignment': 'warn',
    '@typescript-eslint/no-unsafe-member-access': 'warn',
    '@typescript-eslint/no-unsafe-call': 'warn',
    '@typescript-eslint/no-unsafe-return': 'warn',
    '@typescript-eslint/restrict-template-expressions': 'warn',
    '@typescript-eslint/prefer-nullish-coalescing': 'error',
    '@typescript-eslint/prefer-optional-chain': 'error',
    '@typescript-eslint/consistent-type-definitions': ['error', 'interface'],
    '@typescript-eslint/consistent-type-imports': 'error',
    '@typescript-eslint/no-floating-promises': 'error',
    '@typescript-eslint/await-thenable': 'error',
    
    // General ESLint rules
    'no-console': 'off', // Allow console in CLI tools
    'no-debugger': 'error',
    'no-alert': 'error',
    'no-eval': 'error',
    'no-implied-eval': 'error',
    'no-new-func': 'error',
    'no-script-url': 'error',
    'prefer-const': 'error',
    'no-var': 'error',
    'object-shorthand': 'error',
    'prefer-template': 'error',
    'prefer-rest-params': 'error',
    'prefer-spread': 'error',
    'no-param-reassign': ['error', { props: false }],
    'no-return-assign': 'error',
    'no-sequences': 'error',
    'no-throw-literal': 'error',
    'no-unmodified-loop-condition': 'error',
    'no-unused-expressions': ['error', { allowShortCircuit: true, allowTernary: true }],
    'radix': 'error',
    'require-await': 'off', // Handled by TypeScript version
    'yoda': 'error',
    
    // Node.js specific rules
    'node/no-missing-import': 'off', // TypeScript handles this better
    'node/no-unsupported-features/es-syntax': 'off', // We use TypeScript
    'node/no-unsupported-features/node-builtins': 'off', // We target Node.js 18+
    'node/no-unsupported-features/es-builtins': 'off', // We target Node.js 18+ (allows Object.fromEntries)
    'node/no-unpublished-import': 'off', // Allow dev dependencies in tests
    'node/shebang': 'off', // Handled by build process
    'node/prefer-global/buffer': 'error',
    'node/prefer-global/console': 'error',
    'node/prefer-global/process': 'error',
    'node/prefer-global/url-search-params': 'error',
    'node/prefer-global/url': 'error',
    'node/prefer-promises/dns': 'error',
    'node/prefer-promises/fs': 'error',
    
    // Jest specific rules
    'jest/expect-expect': 'error',
    'jest/no-disabled-tests': 'warn',
    'jest/no-focused-tests': 'error',
    'jest/no-identical-title': 'error',
    'jest/valid-expect': 'error',
    'jest/consistent-test-it': 'error',
    'jest/prefer-to-be': 'error',
    'jest/prefer-to-have-length': 'error',
    'jest/prefer-strict-equal': 'error',
    'jest/require-top-level-describe': 'error',
    'jest/no-test-return-statement': 'error',
    
    // Code quality rules
    'complexity': ['warn', 10],
    'max-depth': ['warn', 4],
    'max-lines': ['warn', 300],
    'max-lines-per-function': ['warn', 50],
    'max-params': ['warn', 4],
    'max-statements': ['warn', 20],
  },
  overrides: [
    // Test files have more relaxed rules
    {
      files: ['**/*.test.ts', '**/*.test.js', '**/*.spec.ts', '**/*.spec.js'],
      rules: {
        '@typescript-eslint/no-explicit-any': 'off',
        '@typescript-eslint/no-unsafe-assignment': 'off',
        '@typescript-eslint/no-unsafe-member-access': 'off',
        '@typescript-eslint/no-unsafe-call': 'off',
        'max-lines-per-function': 'off',
        'max-statements': 'off',
      },
    },
    // Configuration files
    {
      files: ['*.config.js', '*.config.ts', 'jest.config.js', '.eslintrc.js'],
      rules: {
        'node/no-unpublished-require': 'off',
        '@typescript-eslint/no-var-requires': 'off',
      },
    },
    // Build and script files
    {
      files: ['scripts/**/*', 'build/**/*'],
      rules: {
        'no-console': 'off',
        'node/no-unpublished-require': 'off',
        'node/no-unpublished-import': 'off',
      },
    },
  ],
  ignorePatterns: [
    'dist/',
    'node_modules/',
    'coverage/',
    '*.min.js',
    '*.bundle.js',
    'build/',
    'lib/',
    '.next/',
    'out/',
    'public/sw.js',
    'public/workbox-*.js',
    'docker-compose.yml',
    'Dockerfile',
    '*.md',
    '*.json',
    '*.yml',
    '*.yaml',
    '.github/',
    '**/*.d.ts',
    '**/*.js.map',
    '**/*.d.ts.map',
    'tests/**/*.js',
    'tests/**/*.d.ts',
  ],
};