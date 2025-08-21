#!/usr/bin/env node

import * as path from 'path';
import { Command } from 'commander';
import { runConfigurationWorkflow } from '../integration';
import { version } from '../../package.json';

const program = new Command();

program
  .version(version)
  .description('Configure Claude Code project with AI-powered recommendations')
  .option('-p, --project-dir <path>', 'Project directory path', process.cwd())
  .parse(process.argv);

const options = program.opts();

async function main() {
  console.log('🔧 Claude Code Configurator');
  console.log('=============================\\n');
  
  const projectDir = path.resolve(options.projectDir);
  console.log(`📁 Project directory: ${projectDir}\\n`);
  
  const result = await runConfigurationWorkflow(projectDir);
  
  if (result.success) {
    console.log('\\n🎉 Configuration completed successfully!');
    console.log(`📋 Iteration ID: ${result.iterationId}`);
    console.log('\\n✨ Your Claude Code project is now configured with AI-recommended components.');
    console.log('   You can view your configuration history using the iteration tracking commands.');
  } else {
    console.error('\\n❌ Configuration failed!');
    console.error(`   Error: ${result.error}`);
    console.log('\\n💡 Troubleshooting tips:');
    console.log('   - Make sure components.json exists in your project directory');
    console.log('   - Ensure GOOGLE_API_KEY environment variable is set for AI recommendations');
    console.log('   - Check that you have write permissions in the project directory');
    process.exit(1);
  }
}

if (require.main === module) {
  main().catch(error => {
    console.error('Unexpected error:', error);
    process.exit(1);
  });
}