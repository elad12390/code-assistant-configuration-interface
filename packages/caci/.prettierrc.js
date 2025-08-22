module.exports = {
  // Basic formatting
  printWidth: 100,
  tabWidth: 2,
  useTabs: false,
  semi: true,
  singleQuote: true,
  quoteProps: 'as-needed',
  trailingComma: 'es5',
  bracketSpacing: true,
  bracketSameLine: false,
  arrowParens: 'avoid',
  
  // Range formatting
  rangeStart: 0,
  rangeEnd: Infinity,
  
  // Parser selection
  requirePragma: false,
  insertPragma: false,
  proseWrap: 'preserve',
  
  // HTML formatting
  htmlWhitespaceSensitivity: 'css',
  
  // Vue files formatting
  vueIndentScriptAndStyle: false,
  
  // End of line
  endOfLine: 'lf',
  
  // Embedded language formatting
  embeddedLanguageFormatting: 'auto',
  
  // Single attribute per line in HTML, Vue, JSX
  singleAttributePerLine: false,
  
  // Override for specific file types
  overrides: [
    {
      files: '*.json',
      options: {
        printWidth: 80,
        tabWidth: 2,
      },
    },
    {
      files: '*.md',
      options: {
        printWidth: 80,
        proseWrap: 'always',
        tabWidth: 2,
      },
    },
    {
      files: '*.yml',
      options: {
        tabWidth: 2,
        singleQuote: false,
      },
    },
    {
      files: '*.yaml',
      options: {
        tabWidth: 2,
        singleQuote: false,
      },
    },
    {
      files: 'package.json',
      options: {
        printWidth: 80,
        tabWidth: 2,
      },
    },
    {
      files: 'tsconfig.json',
      options: {
        printWidth: 80,
        tabWidth: 2,
        trailingComma: 'none',
      },
    },
  ],
};