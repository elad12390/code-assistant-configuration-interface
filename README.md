# Claude Code Configurator

An interactive CLI tool for configuring Claude Code projects.

## Overview

The Claude Code Configurator is a command-line interface tool that simplifies the process of setting up and managing Claude Code configurations in your projects. It provides an intuitive way to analyze your project components, recommend relevant agents and commands, and safely apply configurations.

## Features

- **Interactive CLI Interface**: Easy-to-use menu-driven interface for configuration selection
- **Component Analysis**: Parses your project's `components.json` to understand available agents, commands, MCPs, and hooks
- **Intelligent Recommendations**: Context-aware suggestions for the most relevant components based on your project
- **Safe Configuration Management**: Automatically backs up existing configurations before making changes
- **Configuration History**: Tracks all configuration iterations for easy rollback and comparison

## Installation

```bash
npx claude-config
```

## Usage

1. Navigate to your Claude Code project directory
2. Run the configurator:
   ```bash
   npx claude-config
   ```
3. Follow the interactive prompts to:
   - Analyze your project components
   - Review recommended agents, commands, MCPs, and hooks
   - Select components to include in your configuration
   - Apply the configuration to your project

## How It Works

1. **Project Analysis**: The tool parses your `components.json` file to understand all available components
2. **Recommendation Engine**: Provides context-aware suggestions for the most relevant components
3. **Configuration Selection**: Interactive prompts allow you to accept, modify, or reject recommendations
4. **Safe Application**: Automatically backs up your existing `.claude` folder before applying changes
5. **History Tracking**: All configurations are saved in the `.configurator` folder for future reference

## Project Structure

```
your-project/
├── .claude/              # Claude Code configuration (managed by this tool)
├── .configurator/        # Configuration history and tracking (created by this tool)
├── components.json       # Available components definition
└── ...
```

## Development

To work on this project:

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Run the CLI locally:
   ```bash
   node bin/cli.js
   ```

## Contributing

Contributions are welcome! Please read our [Contributing Guide](CONTRIBUTING.md) for details on how to submit pull requests, report issues, and suggest improvements.

## Code of Conduct

Please note that this project is released with a [Contributor Code of Conduct](CODE-OF-CONDUCT.md). By participating in this project, you agree to abide by its terms.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Changelog

For a complete history of changes, please see the [CHANGELOG.md](CHANGELOG.md) file.