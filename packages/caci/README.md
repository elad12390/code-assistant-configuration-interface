# CACI

CACI (Code Assistant Configuration Interface) - An intelligent CLI tool for configuring Claude Code projects.

## Overview

CACI (Code Assistant Configuration Interface) is an npm package that provides an interactive CLI interface to automate the configuration of Claude Code projects. It intelligently analyzes project requirements and selects the most relevant agents, commands, MCPs, and hooks from a large pool of available components.

## Features

- **Interactive CLI Interface**: Easy-to-use command-line interface similar to the BMAD-method installer
- **AI-Powered Component Selection**: Uses Google Generative AI (Gemini 2.5 Pro) to intelligently recommend components based on project requirements
- **Component Analysis**: Parses a large pool of components (102+ agents) and recommends the most relevant ones
- **Colorful Output**: User-friendly interface with colored output for better readability
- **Comprehensive Testing**: Full test coverage for all functionality

## Installation

```bash
npm install -g caci
```

## Usage

```bash
# Initialize a new configuration
caci configure

# Update existing configuration
caci update

# Reset to previous configuration
caci reset

# Display help
caci --help
```

## Commands

- `configure`: Start the configuration process for a new project
- `update`: Update the existing configuration
- `reset`: Restore the previous configuration
- `--help`: Display help information

## Requirements

To use the AI-powered component recommendation feature, you'll need a Google API key:

1. Go to https://aistudio.google.com/
2. Sign in with a Google account
3. Navigate to "API Keys" in the sidebar
4. Create a new API key
5. Set the key as an environment variable:

```bash
export GOOGLE_API_KEY=your_api_key_here
```

## Development

### Prerequisites

- Node.js (v14 or higher)
- npm

### Setup

```bash
git clone <repository-url>
cd caci
npm install
```

### Building

```bash
npm run build
```

### Testing

```bash
npm test
```

### Running locally

```bash
npm start
```

## Project Structure

```
src/
├── cli/                 # CLI interface and commands
├── analyzer/            # Component analysis and AI recommendations
│   ├── index.ts         # Data models and interfaces
│   ├── parser.ts        # Component JSON parsing
│   ├── questions.ts     # Interactive question flow
│   ├── requirementCollector.ts # CLI prompts for requirements
│   ├── ai-recommender.ts # AI-powered component recommendation
│   └── display.ts       # Recommendation display
└── types/               # TypeScript types

tests/
├── cli/                 # CLI interface tests
└── analyzer/            # Component analysis tests
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a pull request

## License

MIT

## Acknowledgements

- Uses Google Generative AI (Gemini) for AI-powered recommendations
- Built with Commander.js for CLI interface
- Uses Chalk for colorful terminal output
- Inspired by the BMAD-method installer# Test CI trigger
