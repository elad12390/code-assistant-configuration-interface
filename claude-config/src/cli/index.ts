#!/usr/bin/env node

import { Command } from 'commander';
import { version } from '../../package.json';

const program = new Command();

program
  .version(version)
  .description('Intelligent CLI tool for configuring Claude Code projects')
  .option('-i, --init', 'Initialize configuration')
  .option('-u, --update', 'Update existing configuration')
  .option('-r, --reset', 'Reset to previous configuration')
  .option('-c, --configure', 'Run full configuration workflow')
  .parse(process.argv);

const options = program.opts();

// Display help if no arguments provided
if (!process.argv.slice(2).length) {
  program.outputHelp();
}

// Handle different commands
if (options.init) {
  console.log('Initializing configuration...');
  // Implementation will be added later
}

if (options.update) {
  console.log('Updating configuration...');
  // Implementation will be added later
}

if (options.reset) {
  console.log('Resetting configuration...');
  // Implementation will be added later
}

if (options.configure) {
  console.log('Running full configuration workflow...');
  // Import and run the configure command
  import('./configure').then(module => {
    // The configure command will run automatically when imported
  }).catch(error => {
    console.error('Failed to run configuration workflow:', error);
    process.exit(1);
  });
}