# Contributing to CACI

First off, thank you for considering contributing to CACI (Code Assistant Configuration Interface)! It's people like you that make this tool an exceptional resource for developers working with Claude Code.

## Code of Conduct

This project and everyone participating in it is governed by our [Code of Conduct](CODE-OF-CONDUCT.md). By participating, you are expected to uphold this code. Please report unacceptable behavior to elad12390@gmail.com.

## Table of Contents

- [How Can I Contribute?](#how-can-i-contribute)
- [Development Environment Setup](#development-environment-setup)
- [Project Architecture](#project-architecture)
- [Testing Strategy](#testing-strategy)
- [Code Quality Standards](#code-quality-standards)
- [CI/CD Pipeline](#cicd-pipeline)
- [Docker Development](#docker-development)
- [Security Guidelines](#security-guidelines)
- [Pull Request Process](#pull-request-process)
- [Styleguides](#styleguides)
- [Issue and PR Labels](#issue-and-pull-request-labels)

## How Can I Contribute?

### Reporting Bugs

Before creating bug reports, please check the existing issues to avoid duplicates. When creating a bug report, include:

**Required Information:**
* Clear and descriptive title
* Steps to reproduce the problem (detailed)
* Expected behavior vs. actual behavior
* Environment details:
  - Operating system (Windows, macOS, Linux)
  - Node.js version
  - CACI version (`caci --version`)
  - Shell/terminal being used
* Error messages or console output
* Screenshots or terminal recordings if applicable

**Bug Report Template:**
```markdown
**Environment:**
- OS: [e.g., Ubuntu 22.04, macOS 13.2, Windows 11]
- Node.js: [e.g., 18.17.0]
- CACI: [e.g., 1.0.0]
- Shell: [e.g., bash, zsh, PowerShell]

**Steps to Reproduce:**
1. Navigate to project directory
2. Run `caci configure`
3. Select specific options...

**Expected Behavior:**
[What you expected to happen]

**Actual Behavior:**
[What actually happened]

**Error Output:**
```
[Paste any error messages or console output]
```

**Additional Context:**
[Any additional information, screenshots, or context]
```

### Suggesting Enhancements

Enhancement suggestions help CACI evolve. When suggesting enhancements:

* Use a clear, descriptive title
* Provide step-by-step description of the proposed enhancement
* Explain the current behavior and desired behavior
* Describe why this enhancement would benefit CACI users
* Consider backward compatibility implications
* Include mockups or examples if applicable

### Reporting Security Vulnerabilities

**DO NOT** create public issues for security vulnerabilities. Instead:

1. Email elad12390@gmail.com with:
   - Description of the vulnerability
   - Steps to reproduce
   - Potential impact assessment
   - Suggested fix (if any)

2. Allow 90 days for response and resolution before public disclosure
3. Coordinate disclosure timeline if needed

## Development Environment Setup

### Prerequisites

- **Node.js**: v18.x, v20.x, or v22.x (v20.x recommended)
- **npm**: v8.x or higher
- **Git**: Latest stable version
- **Google API Key**: Required for AI features (optional for basic development)

### Quick Start

```bash
# 1. Fork and clone the repository
git clone https://github.com/YOUR_USERNAME/claude-code-configurator.git
cd claude-code-configurator

# 2. Navigate to the CACI directory
cd caci

# 3. Install dependencies
npm install

# 4. Build the project
npm run build

# 5. Run tests to verify setup
npm test

# 6. (Optional) Set up AI features
export GOOGLE_API_KEY="your_api_key_here"

# 7. Test the CLI locally
npm run dev configure
```

### Development Commands

**Core Workflow:**
```bash
# Development and testing
npm run build          # Build TypeScript to JavaScript
npm run build:clean    # Clean build (removes dist/ first)
npm test              # Run all tests
npm run test:watch    # Run tests in watch mode
npm run test:coverage # Run tests with coverage report
npm run dev          # Run CLI in development mode

# Code quality
npm run lint         # Run ESLint
npm run lint:fix     # Auto-fix ESLint issues
npm run format       # Format code with Prettier
npm run format:check # Check code formatting
npm run type-check   # TypeScript type checking
npm run validate     # Run all quality checks

# Testing variants
npm run test:ci           # CI-optimized test run
npm run test:integration  # Integration tests only
npm run test:e2e         # End-to-end tests

# Release and maintenance
npm run clean        # Clean build artifacts
npm run audit:fix    # Fix npm audit issues
npm run deps:check   # Check for outdated dependencies
npm run size         # Check package size
```

### Environment Variables

```bash
# Required for AI-powered recommendations
export GOOGLE_API_KEY="your_google_api_key"

# Optional: Development settings
export NODE_ENV="development"
export LOG_LEVEL="debug"

# Optional: Testing settings
export CI="true"  # Enable CI-specific behaviors
```

## Project Architecture

CACI follows a modular architecture with clear separation of concerns:

### Directory Structure
```
caci/
├── src/                 # Source code (TypeScript)
│   ├── analyzer/        # Component analysis & AI recommendations
│   ├── cli/            # Command-line interface
│   ├── integration/    # Workflow orchestration
│   ├── manager/        # Configuration management
│   └── tracker/        # Iteration tracking
├── tests/              # Test files (mirror src structure)
├── dist/               # Compiled JavaScript (build output)
├── bin/                # Executable scripts
├── coverage/           # Test coverage reports
└── docs/               # Documentation
```

### Key Modules

**Analyzer Module** (`src/analyzer/`):
- `parser.ts`: Component data parsing
- `requirementCollector.ts`: Interactive user prompts
- `ai-recommender.ts`: AI-powered component selection
- `display.ts`: Terminal output formatting

**Manager Module** (`src/manager/`):
- Configuration backup/restore
- `.claude` folder management
- File operations with error handling

**Tracker Module** (`src/tracker/`):
- Iteration history storage
- Configuration comparison
- Rollback capabilities

**Integration Module** (`src/integration/`):
- End-to-end workflow orchestration
- Error handling and user feedback

## Testing Strategy

CACI maintains comprehensive test coverage across all modules:

### Test Types

**Unit Tests**: Individual module functionality
```bash
npm test                    # All tests
npm test -- parser.test.ts  # Specific test file
npm test -- --watch        # Watch mode
```

**Integration Tests**: Cross-module workflows
```bash
npm run test:integration
```

**End-to-End Tests**: Complete CLI workflows
```bash
npm run test:e2e
```

### Coverage Requirements

- **Minimum**: 80% overall coverage
- **Statements**: 85%+
- **Branches**: 80%+
- **Functions**: 85%+
- **Lines**: 85%+

```bash
npm run test:coverage  # Generate coverage report
# View: caci/coverage/lcov-report/index.html
```

### Writing Tests

Follow these testing patterns:

```typescript
// Example test structure
describe('ComponentParser', () => {
  describe('parseComponents', () => {
    it('should parse valid components.json', async () => {
      // Arrange
      const mockData = { agents: {}, commands: {} };
      
      // Act
      const result = await parseComponents(mockData);
      
      // Assert
      expect(result).toBeDefined();
      expect(result.agents).toEqual({});
    });

    it('should handle invalid JSON gracefully', async () => {
      // Test error cases
      await expect(parseComponents(null)).rejects.toThrow();
    });
  });
});
```

**Testing Best Practices:**
- Write tests before implementing features (TDD)
- Test both happy path and error cases
- Use descriptive test names
- Mock external dependencies
- Avoid testing implementation details

## Code Quality Standards

CACI enforces strict code quality standards through automated tooling:

### TypeScript

- **Target**: ES2022
- **Module**: CommonJS
- **Strict mode**: Enabled
- **Declaration files**: Generated

**TypeScript Configuration:**
```json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "commonjs",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "declaration": true,
    "outDir": "./dist"
  }
}
```

### ESLint Configuration

**Rules Overview:**
- **Base**: `eslint:recommended`, `@typescript-eslint/recommended`
- **Plugins**: TypeScript, Node.js, Jest
- **Style**: Prettier integration
- **Complexity**: Max 10 cyclomatic complexity
- **Function size**: Max 50 lines per function

**Key Rules:**
```javascript
{
  // TypeScript
  "@typescript-eslint/no-unused-vars": "error",
  "@typescript-eslint/no-explicit-any": "warn",
  "@typescript-eslint/prefer-optional-chain": "error",
  
  // Code Quality
  "complexity": ["warn", 10],
  "max-lines-per-function": ["warn", 50],
  "no-console": "off", // Allowed in CLI tools
  
  // Jest
  "jest/expect-expect": "error",
  "jest/no-focused-tests": "error"
}
```

### Prettier Configuration

**Code Formatting:**
- **Line width**: 80 characters
- **Tabs**: 2 spaces
- **Semicolons**: Required
- **Quotes**: Single quotes
- **Trailing commas**: ES5

### Code Quality Checks

```bash
# Run all quality checks
npm run validate

# Individual checks
npm run type-check    # TypeScript compilation
npm run lint         # ESLint rules
npm run format:check # Prettier formatting
npm test            # Test suite
```

**Pre-commit Validation:**
All code changes must pass:
1. TypeScript compilation
2. ESLint rules (no errors)
3. Prettier formatting
4. Test suite (100% pass rate)
5. Coverage thresholds

## CI/CD Pipeline

CACI uses GitHub Actions for continuous integration and deployment:

### Pipeline Overview

**Triggered by:**
- Push to `main`, `master`, `develop` branches
- Pull requests to main branches
- Manual workflow dispatch

**Multi-platform Testing:**
- **OS**: Ubuntu, macOS, Windows
- **Node.js**: v18, v20, v22
- **Parallel execution**: 9 total combinations

### Pipeline Stages

**1. Test Matrix** (Parallel across platforms):
```yaml
strategy:
  matrix:
    os: [ubuntu-latest, macos-latest, windows-latest]
    node-version: [18, 20, 22]
```

**2. Quality Checks:**
- Dependency installation and caching
- TypeScript compilation
- ESLint validation
- Test execution with coverage
- Flakiness detection (3x test runs)

**3. Build Verification:**
- Production build creation
- Artifact validation
- CLI installation testing

**4. Integration Testing:**
- Real-world component testing
- CLI command verification
- Cross-platform compatibility

**5. Reporting:**
- Coverage upload to Codecov
- SonarCloud analysis
- Artifact storage

### GitHub Actions Files

- **`ci.yml`**: Main CI pipeline
- **`lint.yml`**: Code quality checks
- **`security.yml`**: Security scanning
- **`e2e.yml`**: End-to-end testing
- **`publish-npm.yml`**: NPM package publishing
- **`benchmark.yml`**: Performance benchmarking

## Docker Development

CACI supports containerized development for consistent environments:

### Docker Setup

```bash
# Build development container
npm run docker:build

# Run in container
npm run docker:run

# Or use Docker Compose
docker-compose up --build
```

### Dockerfile Features

- **Base**: Node.js 20 Alpine
- **Multi-stage**: Development and production builds
- **Security**: Non-root user, minimal attack surface
- **Performance**: Layer optimization, dependency caching

**Development Container:**
```dockerfile
FROM node:20-alpine
WORKDIR /workspace
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build
```

## Security Guidelines

### Vulnerability Reporting

**Process:**
1. Email security issues to elad12390@gmail.com
2. Include detailed vulnerability description
3. Provide reproduction steps
4. Suggest potential fixes if known
5. Allow 90 days for resolution

**Do NOT:**
- Create public issues for security vulnerabilities
- Share vulnerabilities in public forums
- Attempt to exploit vulnerabilities

### Security Best Practices

**When Contributing:**
- Never commit secrets or API keys
- Use environment variables for sensitive data
- Validate all user inputs
- Follow principle of least privilege
- Review dependencies for vulnerabilities

**Automated Security:**
- GitHub Dependabot: Dependency vulnerability scanning
- NPM audit: Regular vulnerability checks
- GitHub Security Advisories: Automated alerts
- SonarCloud: Security hotspot detection

**Security Commands:**
```bash
npm audit          # Check for vulnerabilities
npm audit fix      # Auto-fix vulnerabilities
npm run security   # Run security linting
```

## Pull Request Process

### Before Creating a PR

**Checklist:**
- [ ] Create feature branch from `main`/`master`
- [ ] Write comprehensive tests
- [ ] Ensure all tests pass locally
- [ ] Run code quality checks
- [ ] Update documentation if needed
- [ ] Test across different Node.js versions (if possible)
- [ ] Verify no security vulnerabilities

### PR Requirements

**Required:**
1. **Descriptive title**: Clear, concise description
2. **Detailed description**: 
   - What changes were made
   - Why changes were necessary
   - How to test the changes
3. **Tests**: New/updated tests for all changes
4. **Documentation**: Updated docs for user-facing changes
5. **Backward compatibility**: Maintain compatibility or provide migration path

**PR Template:**
```markdown
## Summary
Brief description of changes made.

## Type of Change
- [ ] Bug fix (non-breaking change fixing an issue)
- [ ] New feature (non-breaking change adding functionality)
- [ ] Breaking change (fix/feature causing existing functionality to change)
- [ ] Documentation update

## Testing
- [ ] Unit tests pass (`npm test`)
- [ ] Integration tests pass (`npm run test:integration`)
- [ ] Manual testing completed
- [ ] Cross-platform testing (if applicable)

## Checklist
- [ ] Code follows project style guidelines
- [ ] Self-review completed
- [ ] Comments added for complex code
- [ ] Documentation updated
- [ ] No security vulnerabilities introduced
```

### Review Process

**Automated Checks:**
- CI/CD pipeline must pass (all platforms)
- Code coverage maintained/improved
- No security vulnerabilities
- Code quality metrics met

**Manual Review:**
- Code functionality and logic
- Test coverage and quality
- Documentation completeness
- Security implications
- Performance impact

**Reviewer Guidelines:**
- Be constructive and respectful
- Focus on code, not the person
- Suggest specific improvements
- Approve when all requirements met

### Merging Requirements

**All Required:**
- [ ] All CI checks pass
- [ ] At least one approving review
- [ ] No requested changes outstanding
- [ ] Branch is up-to-date with target
- [ ] No merge conflicts

## Styleguides

### Git Commit Messages

Follow conventional commits format:

```
type(scope): subject

body

footer
```

**Types:**
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, etc.)
- `refactor`: Code refactoring
- `test`: Adding/modifying tests
- `chore`: Maintenance tasks

**Examples:**
```
feat(analyzer): add support for custom component filters

fix(cli): resolve configuration backup creation issue

docs(readme): update installation instructions for Node.js 20

test(integration): add end-to-end workflow validation
```

**Guidelines:**
- Use present tense ("add feature" not "added feature")
- Use imperative mood ("move cursor to..." not "moves cursor to...")
- Limit first line to 72 characters
- Reference issues: `fixes #123`, `closes #456`
- Include breaking change notes in footer

### TypeScript Style Guide

**General Principles:**
- Explicit typing over `any`
- Interface over type aliases for object shapes
- Prefer immutability
- Use meaningful variable names
- Document complex logic

**Code Examples:**
```typescript
// ✅ Good: Explicit interface
interface UserRequirements {
  projectType?: string;
  programmingLanguages: string[];
  complexity: 'simple' | 'medium' | 'complex';
}

// ❌ Avoid: any type
function processData(data: any): any {
  return data.someProperty;
}

// ✅ Good: Typed function
function processRequirements(
  requirements: UserRequirements
): ProcessedRequirements {
  return {
    ...requirements,
    processedAt: new Date().toISOString(),
  };
}

// ✅ Good: Error handling
async function parseComponents(
  data: unknown
): Promise<ComponentsData> {
  try {
    return ComponentsSchema.parse(data);
  } catch (error) {
    throw new Error(`Invalid components data: ${error.message}`);
  }
}
```

**Naming Conventions:**
- **Classes**: PascalCase (`ComponentParser`)
- **Functions**: camelCase (`parseComponents`)
- **Variables**: camelCase (`userRequirements`)
- **Constants**: UPPER_SNAKE_CASE (`DEFAULT_TIMEOUT`)
- **Interfaces**: PascalCase (`ComponentsData`)
- **Types**: PascalCase (`ConfigurationState`)

### Documentation Style Guide

**Code Documentation:**
```typescript
/**
 * Parses components.json file and validates structure
 * @param filePath - Absolute path to components.json file
 * @param options - Parsing options
 * @returns Validated components data
 * @throws {Error} When file is invalid or missing
 * @example
 * ```typescript
 * const components = await parseComponents('/path/to/components.json');
 * console.log(components.agents);
 * ```
 */
async function parseComponents(
  filePath: string,
  options: ParseOptions = {}
): Promise<ComponentsData> {
  // Implementation
}
```

**Markdown Documentation:**
- Use clear headings hierarchy
- Include code examples for functions
- Provide usage examples
- Link to related documentation
- Keep line length under 80 characters

## Issue and Pull Request Labels

### Issue Labels

**Type Labels:**
- `bug` - Something isn't working
- `enhancement` - New feature or request
- `documentation` - Improvements to documentation
- `question` - Further information is requested
- `security` - Security-related issues

**Priority Labels:**
- `priority: critical` - Urgent fixes needed
- `priority: high` - Important issues
- `priority: medium` - Standard priority
- `priority: low` - Nice to have

**Difficulty Labels:**
- `good first issue` - Good for newcomers
- `help wanted` - Extra attention needed
- `difficulty: easy` - Simple fixes
- `difficulty: medium` - Moderate complexity
- `difficulty: hard` - Complex changes needed

**Component Labels:**
- `analyzer` - AI recommendation system
- `cli` - Command-line interface
- `manager` - Configuration management
- `tracker` - Iteration tracking
- `integration` - Workflow orchestration

### Pull Request Labels

**Status Labels:**
- `work in progress` - Still being developed
- `needs review` - Ready for code review
- `under review` - Currently being reviewed
- `requires changes` - Changes requested by reviewers
- `needs testing` - Manual testing required
- `ready to merge` - Approved and ready

**Change Type Labels:**
- `breaking change` - Breaking API changes
- `feature` - New functionality
- `bugfix` - Bug fixes
- `refactor` - Code improvements
- `dependencies` - Dependency updates

## Communication and Support

### Getting Help

**Preferred Channels:**
1. **GitHub Issues**: Bug reports, feature requests
2. **GitHub Discussions**: Questions, ideas, general discussion
3. **Email**: elad12390@gmail.com (security issues, private matters)

**Response Times:**
- **Issues**: Within 48 hours
- **Pull Requests**: Within 72 hours
- **Security Reports**: Within 24 hours

### Community Guidelines

**Be Respectful:**
- Use inclusive language
- Be patient with newcomers
- Provide constructive feedback
- Respect different perspectives

**Be Helpful:**
- Search existing issues before creating new ones
- Provide detailed information
- Share knowledge and experience
- Help others when possible

## Recognition

Contributors are recognized in several ways:
- **README**: Contributor list
- **CHANGELOG**: Feature/fix attributions
- **Releases**: Release notes mentions
- **GitHub**: Contributor statistics

## Getting Started Checklist

Ready to contribute? Here's your quickstart checklist:

- [ ] Read this contributing guide
- [ ] Review the [Code of Conduct](CODE-OF-CONDUCT.md)
- [ ] Set up development environment
- [ ] Run tests to verify setup
- [ ] Look for `good first issue` labels
- [ ] Join GitHub Discussions for questions
- [ ] Fork repository and create feature branch
- [ ] Make your first contribution!

## Additional Resources

- **[CLAUDE.md](CLAUDE.md)**: Project overview and architecture
- **[README.md](README.md)**: Installation and usage guide
- **[CHANGELOG.md](CHANGELOG.md)**: Version history and changes
- **[Documentation](docs/)**: Detailed technical documentation
- **[GitHub Discussions](https://github.com/eladbenhaim/claude-code-configurator/discussions)**: Community discussions

---

Thank you for contributing to CACI! Your efforts help make Claude Code configuration accessible and powerful for developers worldwide.