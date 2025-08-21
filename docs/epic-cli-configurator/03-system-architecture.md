# Architecture: Claude Code Configurator MVP

## 1. System Overview
The Claude Code Configurator is a Node.js CLI application that provides intelligent configuration management for Claude Code projects. It analyzes project requirements, recommends relevant components, and applies configurations while maintaining backups and iteration history.

## 2. Key Components

### 2.1 CLI Interface
- Entry point: `npx claude-config`
- Interactive prompts for requirement gathering
- Progress feedback and error handling

### 2.2 Configuration Analyzer
- Parses components.json
- Implements ranking algorithm for components
- Selects top components based on requirements

### 2.3 Configuration Manager
- Backs up existing .claude folder
- Applies selected components to project
- Manages .configurator folder for iteration tracking

### 2.4 Data Models
- Component representation
- Configuration state
- Iteration history

## 3. Technical Architecture

### 3.1 Technology Stack
- Language: TypeScript/Node.js
- Package Manager: npm
- Testing Framework: Jest
- CLI Framework: Commander.js or Inquirer.js

### 3.2 Module Structure
```
src/
├── cli/                 # CLI interface and commands
├── analyzer/            # Component analysis and ranking
├── manager/             # Configuration management
├── models/              # Data models and interfaces
├── utils/               # Utility functions
└── types/               # TypeScript types
```

### 3.3 Data Flow
1. User runs `npx claude-config`
2. CLI prompts for project requirements
3. Analyzer processes components.json
4. Analyzer ranks components based on requirements
5. User confirms or modifies selections
6. Manager backs up existing configuration
7. Manager applies new configuration
8. Manager saves iteration to .configurator folder

## 4. File Structure
```
claude-config/
├── bin/
│   └── claude-config    # Executable script
├── src/
│   ├── cli/
│   ├── analyzer/
│   ├── manager/
│   ├── models/
│   ├── utils/
│   └── types/
├── templates/
│   └── components.json  # Sample components file
├── tests/
├── package.json
├── README.md
└── LICENSE
```

## 5. APIs and Interfaces

### 5.1 CLI Interface
```
npx claude-config [options]
Options:
  -i, --init      Initialize configuration
  -u, --update    Update existing configuration
  -r, --reset     Reset to previous configuration
  -h, --help      Display help
```

### 5.2 Internal APIs
- `Analyzer.rankComponents(requirements, components)`
- `Manager.backupConfiguration()`
- `Manager.applyConfiguration(selectedComponents)`
- `Manager.saveIteration(iterationData)`

## 6. Data Models

### 6.1 Component
```typescript
interface Component {
  id: string;
  name: string;
  type: 'agent' | 'command' | 'mcp' | 'hook';
  description: string;
  tags: string[];
  version: string;
}
```

### 6.2 Configuration
```typescript
interface Configuration {
  projectId: string;
  timestamp: Date;
  selectedComponents: Component[];
  requirements: string[];
}
```

## 7. Error Handling
- File operation errors (permissions, missing files)
- JSON parsing errors
- Network errors (if any external calls are added)
- User input validation

## 8. Testing Strategy
- Unit tests for analyzer ranking algorithm
- Integration tests for configuration management
- CLI interaction tests
- Error condition tests

## 9. Deployment
- Published as npm package
- No build step required for end users
- Cross-platform compatibility