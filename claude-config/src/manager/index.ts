import * as fs from 'fs';
import * as path from 'path';
import * as fsPromises from 'fs/promises';
import { createWriteStream } from 'fs';

export interface BackupInfo {
  timestamp: string;
  backupPath: string;
}

/**
 * Checks if the .claude folder exists in the project directory
 * @param projectDir The project directory path
 * @returns True if .claude folder exists, false otherwise
 */
export async function claudeFolderExists(projectDir: string): Promise<boolean> {
  const claudePath = path.join(projectDir, '.claude');
  try {
    await fsPromises.access(claudePath, fs.constants.F_OK);
    return true;
  } catch {
    return false;
  }
}

/**
 * Creates a backup of the existing .claude folder
 * @param projectDir The project directory path
 * @returns Information about the backup
 */
export async function backupClaudeFolder(projectDir: string): Promise<BackupInfo> {
  const claudePath = path.join(projectDir, '.claude');
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const backupPath = path.join(projectDir, '.configurator', 'backups', `claude-backup-${timestamp}`);
  
  // Create the backup directory if it doesn't exist
  const backupDir = path.dirname(backupPath);
  await fsPromises.mkdir(backupDir, { recursive: true });
  
  // Copy the .claude folder to the backup location
  await copyFolder(claudePath, backupPath);
  
  return {
    timestamp,
    backupPath
  };
}

/**
 * Copies a folder recursively
 * @param source Source folder path
 * @param destination Destination folder path
 */
async function copyFolder(source: string, destination: string): Promise<void> {
  try {
    // Create destination folder
    await fsPromises.mkdir(destination, { recursive: true });
    
    // Read source folder contents
    const entries = await fsPromises.readdir(source, { withFileTypes: true });
    
    // Copy each entry
    for (const entry of entries) {
      const srcPath = path.join(source, entry.name);
      const destPath = path.join(destination, entry.name);
      
      if (entry.isDirectory()) {
        await copyFolder(srcPath, destPath);
      } else {
        await fsPromises.copyFile(srcPath, destPath);
      }
    }
  } catch (error) {
    throw new Error(`Failed to copy folder from ${source} to ${destination}: ${error instanceof Error ? error.message : String(error)}`);
  }
}

/**
 * Applies selected components to the .claude folder
 * @param projectDir The project directory path
 * @param selectedComponents The components to apply
 * @param componentsData The full components data
 */
export async function applyConfiguration(
  projectDir: string,
  selectedComponents: { agents: string[]; commands: string[]; hooks: string[]; mcps: string[] },
  componentsData: any
): Promise<void> {
  const claudePath = path.join(projectDir, '.claude');
  
  // Create .claude folder if it doesn't exist
  await fsPromises.mkdir(claudePath, { recursive: true });
  
  // Apply agents
  if (selectedComponents.agents.length > 0) {
    const agentsPath = path.join(claudePath, 'agents');
    await fsPromises.mkdir(agentsPath, { recursive: true });
    
    for (const agentName of selectedComponents.agents) {
      const agent = componentsData.agents[agentName];
      if (agent) {
        const agentFilePath = path.join(agentsPath, `${agentName}.md`);
        await fsPromises.writeFile(agentFilePath, agent.content, 'utf8');
      }
    }
  }
  
  // Apply commands
  if (selectedComponents.commands.length > 0) {
    const commandsPath = path.join(claudePath, 'commands');
    await fsPromises.mkdir(commandsPath, { recursive: true });
    
    for (const commandName of selectedComponents.commands) {
      const command = componentsData.commands[commandName];
      if (command) {
        const commandFilePath = path.join(commandsPath, `${commandName}.md`);
        await fsPromises.writeFile(commandFilePath, command.content, 'utf8');
      }
    }
  }
  
  // Apply hooks
  if (selectedComponents.hooks.length > 0) {
    const hooksPath = path.join(claudePath, 'hooks');
    await fsPromises.mkdir(hooksPath, { recursive: true });
    
    for (const hookName of selectedComponents.hooks) {
      const hook = componentsData.hooks[hookName];
      if (hook) {
        const hookFilePath = path.join(hooksPath, `${hookName}.md`);
        await fsPromises.writeFile(hookFilePath, hook.content, 'utf8');
      }
    }
  }
  
  // Apply MCPs
  if (selectedComponents.mcps.length > 0) {
    const mcpsPath = path.join(claudePath, 'mcps');
    await fsPromises.mkdir(mcpsPath, { recursive: true });
    
    for (const mcpName of selectedComponents.mcps) {
      const mcp = componentsData.mcps[mcpName];
      if (mcp) {
        const mcpFilePath = path.join(mcpsPath, `${mcpName}.md`);
        await fsPromises.writeFile(mcpFilePath, mcp.content, 'utf8');
      }
    }
  }
}

/**
 * Lists available backups
 * @param projectDir The project directory path
 * @returns Array of backup information
 */
export async function listBackups(projectDir: string): Promise<BackupInfo[]> {
  const backupsDir = path.join(projectDir, '.configurator', 'backups');
  
  try {
    await fsPromises.access(backupsDir, fs.constants.F_OK);
  } catch {
    return []; // No backups directory exists
  }
  
  const entries = await fsPromises.readdir(backupsDir, { withFileTypes: true });
  const backups: BackupInfo[] = [];
  
  for (const entry of entries) {
    if (entry.isDirectory() && entry.name.startsWith('claude-backup-')) {
      const timestamp = entry.name.replace('claude-backup-', '').replace(/-/g, ':');
      backups.push({
        timestamp,
        backupPath: path.join(backupsDir, entry.name)
      });
    }
  }
  
  // Sort backups by timestamp (newest first)
  backups.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  
  return backups;
}

/**
 * Restores a backup
 * @param projectDir The project directory path
 * @param backupPath The path to the backup to restore
 */
export async function restoreBackup(projectDir: string, backupPath: string): Promise<void> {
  const claudePath = path.join(projectDir, '.claude');
  
  // Remove existing .claude folder if it exists
  if (await claudeFolderExists(projectDir)) {
    await fsPromises.rm(claudePath, { recursive: true, force: true });
  }
  
  // Copy backup to .claude folder
  await copyFolder(backupPath, claudePath);
}