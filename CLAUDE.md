# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

CACI (Code Assistant Configuration Interface) is an intelligent CLI tool that automates Claude Code project configuration by analyzing requirements and using Claude Code's headless mode to recommend relevant agents, commands, MCPs, and hooks from a large component pool. The tool manages the entire lifecycle including backup, application, and iteration tracking.

## Development Commands

**Core development workflow:**

> **⚠️ IMPORTANT: Git Workflow Change**  
> **From now on, ALL development must follow the issue → branch → PR → merge workflow.**  
> **Direct commits to master are blocked by branch protection rules.**

### Git Workflow

**For ALL changes, follow these steps:**

1. **Create an issue** for the feature/bug/task
2. **Create a feature branch** from master: `git checkout -b feature/issue-description`
3. **Make your changes** and commit to the feature branch
4. **Create a Pull Request** when ready
5. **Wait for CI/CD checks** to pass and get approvals
6. **Merge via GitHub** (squash merge recommended)

**Branch protection rules enforce:**

- ✅ Required status checks: Lint, Type Check, Format Check, Build & Package, Unit Tests, Integration Tests
- ✅ Required pull request reviews (1 approval required)
- ✅ Dismiss stale reviews when new commits are pushed
- ✅ No direct pushes to master (even for admins)
- ✅ No force pushes or branch deletion

```bash
# Install dependencies
cd packages/caci && npm install

# Build the project
npm run build

# Run all tests
npm test

# Run tests with coverage
npm run test:coverage

# Run tests in watch mode
npm run test:watch

# Run a specific test file
npm test -- analyzer/parser.test.ts

# Run the CLI locally during development
npm run dev

# Test the built CLI globally
npx code-assistant-config-interface configure

# Test the local CLI during development
node bin/caci configure

# Run E2E tests
cd ../../e2e-test && node test-e2e.js

# Local GitHub Actions Testing with act (RECOMMENDED)
# Test workflows locally before pushing to avoid CI failures
act --list                           # List all available workflows
act -W .github/workflows/ci.yml -j format-check --pull=false  # Test format check
act -W .github/workflows/ci.yml -j build --pull=false         # Test build job
act workflow_dispatch -W .github/workflows/e2e.yml -j e2e-file-operations --pull=false  # Test E2E
act workflow_dispatch -W .github/workflows/security.yml -j npm-audit --pull=false       # Test security

# Note: act provides containerized testing identical to GitHub Actions
# Use act to catch configuration issues before they cause CI failures

# Format code
npm run format

# Check formatting
npm run format:check

# Run type checking
npm run type-check

# Run linting
npm run lint

# Build for all workspaces
npm run test --workspaces
```

**Environment setup for AI features:**

```bash
# Required for AI-powered component recommendations
claude /login
```

**IMPORTANT: Release and Publishing Rules:**

```bash
# ❌ NEVER publish manually to npm
npm publish  # DON'T DO THIS

# ✅ ALWAYS use GitHub release workflows
gh workflow run "CACI Multi-Platform Release (Main)" -f tag_name=v1.x.x -f environment=production

# ✅ Alternative: Use clean release workflow
gh workflow run "CACI Multi-Platform Release (Main) - Clean" -f tag_name=v1.x.x -f environment=production

# ✅ Available automated workflows:
# - CACI Multi-Platform Release (Main): Complete release with all platforms
# - CACI Package NPM Publishing: NPM-only publishing
# - CACI Package Docker Publishing: Docker image publishing
# - Publish to APT Repository: Debian package publishing
# - Update Homebrew Formula: Homebrew package publishing

# The automated workflows handle:
# - Version validation and tagging
# - Cross-platform testing (Linux, macOS, Windows)
# - Automated npm publishing with proper validation
# - Docker image building and pushing
# - Release asset generation and distribution
# - Proper CI/CD validation before publishing
```

## Architecture Overview

The project follows a modular architecture with clear separation of concerns:

### Core Modules

**Analyzer Module** (`src/analyzer/`): Handles component analysis and AI-powered recommendations

- `parser.ts`: Parses components.json files into structured data
- `requirementCollector.ts`: Interactive CLI prompts for gathering user requirements
- `ai-recommender.ts`: Uses Claude Code headless mode for intelligent component selection
- `display.ts`: Colorful terminal output using chalk for recommendation display

**Manager Module** (`src/manager/`): Manages Claude Code configuration lifecycle

- Backup creation before any modifications
- Configuration application to `.claude` folder structure
- Restoration from previous backups
- File operations with comprehensive error handling

**Tracker Module** (`src/tracker/`): Iteration history and comparison

- Saves configuration iterations to `.configurator/iterations`
- Provides history viewing and iteration comparison
- Enables configuration rollback and decision tracking

**Integration Module** (`src/integration/`): Orchestrates the complete workflow

- `runConfigurationWorkflow()`: End-to-end process from requirement collection to configuration application
- Comprehensive error handling with user-friendly messages
- Progress feedback throughout the workflow

### CLI Interface

**Primary CLI** (`src/cli/index.ts`): Main entry point with Commander.js

- ✅ Complete command parsing and routing
- ✅ Help and version information
- ✅ All commands fully functional: configure, init, update, reset, history

**Configuration CLI** (`src/cli/configure.ts`): Dedicated configuration workflow

- ✅ Executes the complete integrated workflow successfully
- ✅ Provides detailed progress feedback and troubleshooting guidance
- ✅ Handles all error cases gracefully with user-friendly messages

### Data Flow

1. **Component Parsing**: Reads `components.json` containing available agents, commands, hooks, and MCPs
2. **Requirement Collection**: Interactive prompts gather user project details (languages, frameworks, complexity)
3. **AI Recommendation**: Claude analyzes requirements and project structure against component pool to suggest top 10 relevant items per category
4. **Configuration Management**: Backs up existing `.claude` folder, applies selected components
5. **Iteration Tracking**: Saves complete configuration state for future reference and comparison

### Key Interfaces

```typescript
interface ComponentsData {
  agents: Record<string, Component>;
  commands: Record<string, Component>;
  hooks: Record<string, Component>;
  mcps: Record<string, Component>;
}

interface SelectedComponents {
  agents: string[];
  commands: string[];
  hooks: string[];
  mcps: string[];
}

interface UserRequirements {
  [key: string]: unknown;
  projectType?: string;
  programmingLanguages?: string[];
  frameworks?: string[];
  features?: string[];
  complexity?: 'simple' | 'medium' | 'complex';
  experienceLevel?: 'beginner' | 'intermediate' | 'advanced';
  projectStructure?: string;
  'project-description'?: string;
}
```

## File Structure Patterns

- **Source code**: `packages/caci/src/` with TypeScript compilation to `dist/`
- **Tests**: Mirror source structure in `packages/caci/tests/` using Jest
- **Binary**: `packages/caci/bin/caci` points to compiled CLI (published as `code-assistant-config-interface` package)
- **Configuration output**: Creates `.claude/` (configuration) and `.configurator/` (history) in target project
- **Components definition**: Bundled `components.json` included with package
- **E2E Testing**: `e2e-test/test-e2e.js` validates published package functionality

## Testing Architecture

- **Unit tests**: Each module has comprehensive test coverage in corresponding `tests/` subdirectory
- **Integration tests**: End-to-end workflow testing in `tests/integration/`
- **E2E tests**: Real-world testing with published package in `e2e-test/`
- **Jest configuration**: Includes TypeScript preset, coverage collection, and chalk transform handling
- **Test execution**: Supports individual file testing and watch mode for development
- **CI/CD**: All tests run across multiple platforms (Linux, macOS, Windows) with Node.js 18/20/22

## AI Integration Details

The project uses Claude Code's headless mode for intelligent component selection:

- **Model**: Claude Sonnet via headless CLI (`claude -p`)
- **Input**: User requirements, project structure analysis, and complete component metadata
- **Output**: JSON-formatted component recommendations
- **Authentication**: Uses existing Claude Code authentication (no API keys required)
- **Fallback**: Graceful degradation when Claude CLI is unavailable

## Development Status

CACI is currently at **83% completion** with **all core functionality fully implemented and working**. The system is **production-ready** and fulfills its primary mission of making Claude Code configuration easy for new developers.

**✅ FULLY FUNCTIONAL FEATURES:**

- Complete CLI interface with all commands working (configure, init, update, reset, history)
- AI-powered component recommendations using Claude Code headless mode
- Project structure analysis with tree command integration
- Natural language project description support
- Safe configuration management with backup/restore
- Iteration tracking and history comparison
- End-to-end workflow integration
- Comprehensive error handling and user feedback
- Real E2E testing with published package validation

**Remaining work:** Optional usage analytics (Story 1.6) - enhancement only, not required for core functionality.

All implemented features have comprehensive test coverage (35 tests passing) and follow TypeScript best practices.
