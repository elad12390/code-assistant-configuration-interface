# Project Infrastructure

## Technology Stack
- Node.js
- TypeScript
- Jest (testing)
- Inquirer.js (CLI prompts)

## Project Structure
```
claude-config/
├── bin/                 # Executable scripts
├── src/                 # Source code
│   ├── cli/             # CLI interface
│   ├── analyzer/        # Component analysis
│   ├── manager/         # Configuration management
│   └── tracker/         # History tracking
├── tests/               # Test files
├── package.json         # Project metadata
└── README.md            # Documentation
```

## Development Setup
1. `npm install` - Install dependencies
2. `npm run build` - Compile TypeScript
3. `npm run test` - Run tests
4. `npm link` - Link for local development

## Build and Deployment
- `npm run build` - Creates dist/ folder
- Published as npm package
- No build step required for end users