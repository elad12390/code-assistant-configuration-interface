#!/usr/bin/env node

import { Command } from 'commander';
import { version } from '../../package.json';
import { runConfigurationWorkflow } from '../integration';
import { listBackups, restoreBackup } from '../manager';
import { listIterations } from '../tracker';
import * as path from 'path';
import inquirer from 'inquirer';

const program = new Command();

program
  .name('caci')
  .version(version)
  .description(
    'CACI (Code Assistant Configuration Interface) - Intelligent CLI tool for project configuration'
  )
  .option('-p, --project-dir <path>', 'Project directory path', process.cwd());

program
  .command('configure')
  .description('Run full configuration workflow with AI recommendations')
  .action(async () => {
    const options = program.opts();
    const projectDir = path.resolve(options.projectDir as string);
    await runConfigurationCommand(projectDir);
  });

program
  .command('init')
  .description('Initialize CACI configuration for your project')
  .action(async () => {
    const options = program.opts();
    const projectDir = path.resolve(options.projectDir as string);
    await runConfigurationCommand(projectDir);
  });

program
  .command('update')
  .description('Update existing CACI configuration')
  .action(async () => {
    const options = program.opts();
    const projectDir = path.resolve(options.projectDir as string);
    await runConfigurationCommand(projectDir);
  });

program
  .command('reset')
  .description('Reset to previous configuration from backup')
  .action(async () => {
    const options = program.opts();
    const projectDir = path.resolve(options.projectDir as string);
    await resetConfiguration(projectDir);
  });

program
  .command('history')
  .description('View configuration iteration history')
  .action(async () => {
    const options = program.opts();
    const projectDir = path.resolve(options.projectDir as string);
    await viewHistory(projectDir);
  });

async function runConfigurationCommand(projectDir: string) {
  // Clear terminal for clean display
  console.clear();

  console.log('🔧 CACI (Code Assistant Configuration Interface)');
  console.log('===============================================\n');
  console.log(`📁 Project directory: ${projectDir}\n`);

  const result = await runConfigurationWorkflow(projectDir);

  if (result.success) {
    console.log('\n🎉 Configuration completed successfully!');
    console.log(`📋 Iteration ID: ${result.iterationId}`);
    console.log('\n✨ Your project is now configured with AI-recommended components.');
    console.log('   You can view your configuration history using: caci history');
  } else {
    console.error('\n❌ Configuration failed!');
    console.error(`   Error: ${result.error}`);
    console.log('\n💡 Troubleshooting tips:');
    console.log('   - Use OAuth authentication or provide an OpenRouter API key when prompted');
    console.log('   - Check that you have write permissions in the project directory');
    console.log('   - Get your OpenRouter API key from: https://openrouter.ai/keys');
    throw new Error('Configuration failed');
  }
}

async function resetConfiguration(projectDir: string) {
  console.log('🔄 Reset CACI Configuration');
  console.log('============================\n');

  try {
    const backups = await listBackups(projectDir);

    if (backups.length === 0) {
      console.log('❌ No backups found. Cannot reset configuration.');
      console.log('   Backups are created automatically when you run configuration updates.');
      return;
    }

    console.log('📦 Available backups:');
    const choices = backups.map((backup, index) => ({
      name: `${index + 1}. ${new Date(backup.timestamp).toLocaleString()}`,
      value: backup.backupPath,
    }));

    const { selectedBackup } = await inquirer.prompt([
      {
        type: 'list',
        name: 'selectedBackup',
        message: 'Select a backup to restore:',
        choices,
      },
    ]);

    await restoreBackup(projectDir, selectedBackup as string);
    console.log('\n✅ Configuration restored successfully!');
  } catch (error) {
    console.error('\n❌ Reset failed!');
    console.error(`   Error: ${error instanceof Error ? error.message : String(error)}`);
    throw error;
  }
}

async function viewHistory(projectDir: string) {
  console.log('📚 CACI Configuration History');
  console.log('===========================\n');

  try {
    const iterations = await listIterations(projectDir);

    if (iterations.length === 0) {
      console.log('📄 No configuration history found.');
      console.log('   History is created when you run configuration workflows.');
      return;
    }

    console.log(`Found ${iterations.length} configuration iterations:\n`);

    iterations.forEach((iteration, index) => {
      const date = new Date(iteration.timestamp).toLocaleString();
      console.log(`${index + 1}. ${iteration.id}`);
      console.log(`   📅 Date: ${date}\n`);
    });
  } catch (error) {
    console.error('\n❌ Failed to view history!');
    console.error(`   Error: ${error instanceof Error ? error.message : String(error)}`);
    throw error;
  }
}

// Parse command line arguments
program.parse(process.argv);

// Show help if no command is provided
if (!process.argv.slice(2).length) {
  program.outputHelp();
  process.exit(1);
}
