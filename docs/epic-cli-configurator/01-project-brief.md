# Project Brief: CACI MVP

## Project Overview
Create CACI (Code Assistant Configuration Interface) - an automated configuration system for Claude Code that can intelligently select and configure agents, commands, MCPs, and hooks based on project requirements.

## Problem Statement
Currently, configuring Claude Code for a project requires manual setup of agents, commands, MCPs, and hooks. This process is time-consuming and error-prone, especially when dealing with a large number of available components (102 agents).

## Solution
A CLI tool (`npx caci`) that:
1. Analyzes project requirements
2. Intelligently selects the best components from a large pool
3. Backs up existing configuration
4. Applies new configuration
5. Tracks configuration iterations

## Key Features
- Interactive CLI interface similar to BMAD-method installer
- Component analysis and intelligent selection
- Configuration backup and versioning
- Iteration tracking
- Easy project-specific customization

## Technical Requirements
- Node.js CLI application
- JSON configuration parsing
- File system operations
- Backup functionality
- Iteration tracking

## Success Metrics
- Reduction in configuration time from hours to minutes
- High accuracy in component selection
- Easy rollback capability
- User-friendly interface

## Constraints
- Must work with existing .claude folder structure
- Must preserve existing configurations through backups
- Must be non-destructive by default