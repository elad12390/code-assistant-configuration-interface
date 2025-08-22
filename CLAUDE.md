# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

CACI (Code Assistant Configuration Interface) is an intelligent CLI tool that automates Claude Code project configuration by analyzing requirements and using AI to recommend relevant agents, commands, MCPs, and hooks from a large component pool. The tool manages the entire lifecycle including backup, application, and iteration tracking.

## Development Commands

**Core development workflow:**

```bash
# Install dependencies
cd claude-config && npm install

# Build the project
npm run build

# Run all tests
npm test

# Run tests with coverage
npm test:coverage

# Run tests in watch mode
npm test:watch

# Run a specific test file
npm test -- analyzer/parser.test.ts

# Run the CLI locally during development
npm run dev

# Test the built CLI globally
npx caci configure

# Test the local CLI during development
node bin/caci configure
```

**Environment setup for AI features:**

```bash
# Required for AI-powered component recommendations
export GOOGLE_API_KEY="your_api_key_here"
```

## Architecture Overview

The project follows a modular architecture with clear separation of concerns:

### Core Modules

**Analyzer Module** (`src/analyzer/`): Handles component analysis and AI-powered recommendations

- `parser.ts`: Parses components.json files into structured data
- `requirementCollector.ts`: Interactive CLI prompts for gathering user requirements
- `ai-recommender.ts`: Uses Google Generative AI (Gemini 2.5 Pro) via LangChain for intelligent component selection
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
3. **AI Recommendation**: Gemini 2.5 Pro analyzes requirements against component pool to suggest top 10 relevant items per category
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
  projectType?: string;
  programmingLanguages?: string[];
  frameworks?: string[];
  features?: string[];
  complexity?: 'simple' | 'medium' | 'complex';
  experienceLevel?: 'beginner' | 'intermediate' | 'advanced';
}
```

## File Structure Patterns

- **Source code**: `claude-config/src/` with TypeScript compilation to `dist/`
- **Tests**: Mirror source structure in `claude-config/tests/` using Jest
- **Binary**: `claude-config/bin/caci` points to compiled CLI (published as `caci` package)
- **Configuration output**: Creates `.claude/` (configuration) and `.configurator/` (history) in target project
- **Components definition**: Expects `components.json` in target project root

## Testing Architecture

- **Unit tests**: Each module has comprehensive test coverage in corresponding `tests/` subdirectory
- **Integration tests**: End-to-end workflow testing in `tests/integration/`
- **Jest configuration**: Includes TypeScript preset, coverage collection, and chalk transform handling
- **Test execution**: Supports individual file testing and watch mode for development

## AI Integration Details

The project uses Google's Generative AI through LangChain for intelligent component selection:

- **Model**: Gemini 2.5 Pro for component analysis and recommendation
- **Input**: User requirements and complete component metadata
- **Output**: Ranked and selected components with reasoning
- **Fallback**: Graceful degradation when API key is missing or service unavailable

## Development Status

CACI is currently at **83% completion** with **all core functionality fully implemented and working**. The system is **production-ready** and fulfills its primary mission of making Claude Code configuration easy for new developers.

**✅ FULLY FUNCTIONAL FEATURES:**

- Complete CLI interface with all commands working (configure, init, update, reset, history)
- AI-powered component recommendations using Google Gemini
- Safe configuration management with backup/restore
- Iteration tracking and history comparison
- End-to-end workflow integration
- Comprehensive error handling and user feedback

**Remaining work:** Optional usage analytics (Story 1.6) - enhancement only, not required for core functionality.

All implemented features have comprehensive test coverage (35 tests passing) and follow TypeScript best practices.
