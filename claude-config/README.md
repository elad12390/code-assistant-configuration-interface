# Claude Config - Implementation

This directory contains the implementation of the Claude Code Configurator CLI tool.

## Getting Started

1. Install dependencies:
   ```bash
   npm install
   ```

2. Run tests:
   ```bash
   npm test
   ```

3. Build the project:
   ```bash
   npm run build
   ```

## Development Approach

We're using Test-Driven Development (TDD) to implement the features. Follow the stories in the `../docs/epic-cli-configurator/stories/` directory in order:

1. `cli-core` - Story 1.1: Implement Core CLI Interface
2. `component-analysis` - Story 1.2: Implement Component Analysis
3. `config-management` - Story 1.3: Implement Configuration Management
4. `iteration-tracking` - Story 1.4: Implement Iteration Tracking

## Project Structure

```
src/          # Source code
tests/        # Test files
bin/          # CLI entry point
```

## Commands

- `npm test` - Run tests
- `npm run test:watch` - Run tests in watch mode
- `npm run test:coverage` - Run tests with coverage report
- `npm run build` - Build the project
- `npm start` - Run the built project
- `npm run dev` - Run the project in development mode (if using ts-node)

## Implementation Guidelines

1. Follow TDD: Write tests first, then implementation
2. Maintain >90% test coverage
3. Follow the acceptance criteria in each story
4. Keep code clean and well-documented
5. Update the story documents as you implement features