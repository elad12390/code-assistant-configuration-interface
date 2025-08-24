import * as fs from 'fs';
import * as path from 'path';
import * as os from 'os';
import {
  claudeFolderExists,
  backupClaudeFolder,
  applyConfiguration,
  listBackups,
  restoreBackup,
} from '../../src/manager';

describe('Configuration Manager', () => {
  let tempDir: string;
  let projectDir: string;

  beforeEach(async () => {
    // Create a temporary directory for testing
    tempDir = await fs.promises.mkdtemp(path.join(os.tmpdir(), 'caci-test-'));
    projectDir = tempDir;
  });

  afterEach(async () => {
    // Clean up the temporary directory
    await fs.promises.rm(tempDir, { recursive: true, force: true });
  });

  it('should check if .claude folder exists', async () => {
    // Initially, .claude folder should not exist
    expect(await claudeFolderExists(projectDir)).toBe(false);

    // Create .claude folder
    const claudePath = path.join(projectDir, '.claude');
    await fs.promises.mkdir(claudePath, { recursive: true });

    // Now .claude folder should exist
    expect(await claudeFolderExists(projectDir)).toBe(true);
  });

  it('should create backup of .claude folder', async () => {
    // Create .claude folder with some content
    const claudePath = path.join(projectDir, '.claude');
    await fs.promises.mkdir(claudePath, { recursive: true });

    // Create a test file in the .claude folder
    const testFilePath = path.join(claudePath, 'test.txt');
    await fs.promises.writeFile(testFilePath, 'test content', 'utf8');

    // Create backup
    const backupInfo = await backupClaudeFolder(projectDir);

    // Verify backup was created
    expect(backupInfo).toBeDefined();
    expect(backupInfo.timestamp).toBeDefined();
    expect(backupInfo.backupPath).toBeDefined();

    // Verify backup contains the test file
    const backupTestFilePath = path.join(backupInfo.backupPath, 'test.txt');
    await expect(
      fs.promises.access(backupTestFilePath, fs.constants.F_OK)
    ).resolves.toBeUndefined();

    const content = await fs.promises.readFile(backupTestFilePath, 'utf8');
    expect(content).toBe('test content');
  });

  it('should apply configuration to .claude folder', async () => {
    const selectedComponents = {
      agents: ['test-agent'],
      commands: ['test-command'],
      hooks: ['test-hook'],
      mcps: ['test-mcp'],
    };

    const componentsData = {
      agents: {
        'test-agent': {
          name: 'test-agent',
          path: 'agents/test-agent.md',
          category: 'development',
          type: 'agent',
          content: 'Test agent content',
          description: 'Test agent for unit testing',
        },
      },
      commands: {
        'test-command': {
          name: 'test-command',
          path: 'commands/test-command.md',
          category: 'utility',
          type: 'command',
          content: 'Test command content',
          description: 'Test command for unit testing',
        },
      },
      hooks: {
        'test-hook': {
          name: 'test-hook',
          path: 'hooks/test-hook.md',
          category: 'automation',
          type: 'hook',
          content: 'Test hook content',
          description: 'Test hook for unit testing',
        },
      },
      mcps: {
        'test-mcp': {
          name: 'test-mcp',
          path: 'mcps/test-mcp.json',
          category: 'integration',
          type: 'mcp',
          content:
            '{"mcpServers": {"test-server": {"command": "test-command", "args": ["--test"]}}}',
          description: 'Test MCP for unit testing',
        },
      },
      settings: {},
      templates: {},
    };

    // Apply configuration
    await applyConfiguration(projectDir, selectedComponents, componentsData);

    // Verify .claude folder was created
    const claudePath = path.join(projectDir, '.claude');
    await expect(fs.promises.access(claudePath, fs.constants.F_OK)).resolves.toBeUndefined();

    // Verify agents folder and file were created
    const agentFilePath = path.join(claudePath, 'agents', 'test-agent.md');
    await expect(fs.promises.access(agentFilePath, fs.constants.F_OK)).resolves.toBeUndefined();
    const agentContent = await fs.promises.readFile(agentFilePath, 'utf8');
    expect(agentContent).toBe('Test agent content');

    // Verify commands folder and file were created
    const commandFilePath = path.join(claudePath, 'commands', 'test-command.md');
    await expect(fs.promises.access(commandFilePath, fs.constants.F_OK)).resolves.toBeUndefined();
    const commandContent = await fs.promises.readFile(commandFilePath, 'utf8');
    expect(commandContent).toBe('Test command content');

    // Verify hooks folder and file were created
    const hookFilePath = path.join(claudePath, 'hooks', 'test-hook.md');
    await expect(fs.promises.access(hookFilePath, fs.constants.F_OK)).resolves.toBeUndefined();
    const hookContent = await fs.promises.readFile(hookFilePath, 'utf8');
    expect(hookContent).toBe('Test hook content');

    // MCPs are now added via 'claude mcp add' commands, not files
    // Verify that the MCP command was logged (we can see it in the console output)
    // The actual MCP is added to .mcp.json in the project root, not in .claude folder
  });

  it('should list available backups', async () => {
    // Initially, there should be no backups
    const backups = await listBackups(projectDir);
    expect(backups).toStrictEqual([]);

    // Create .claude folder with some content
    const claudePath = path.join(projectDir, '.claude');
    await fs.promises.mkdir(claudePath, { recursive: true });

    // Create a test file in the .claude folder
    const testFilePath = path.join(claudePath, 'test.txt');
    await fs.promises.writeFile(testFilePath, 'test content', 'utf8');

    // Create backup
    const backupInfo = await backupClaudeFolder(projectDir);

    // List backups
    const backupsAfter = await listBackups(projectDir);
    expect(backupsAfter).toHaveLength(1);
    expect(backupsAfter[0].backupPath).toBe(backupInfo.backupPath);
  });

  it('should restore backup', async () => {
    // Create .claude folder with some content
    const claudePath = path.join(projectDir, '.claude');
    await fs.promises.mkdir(claudePath, { recursive: true });

    // Create a test file in the .claude folder
    const testFilePath = path.join(claudePath, 'test.txt');
    await fs.promises.writeFile(testFilePath, 'original content', 'utf8');

    // Create backup
    const backupInfo = await backupClaudeFolder(projectDir);

    // Modify the original file
    await fs.promises.writeFile(testFilePath, 'modified content', 'utf8');

    // Restore backup
    await restoreBackup(projectDir, backupInfo.backupPath);

    // Verify the file was restored to its original content
    const restoredContent = await fs.promises.readFile(testFilePath, 'utf8');
    expect(restoredContent).toBe('original content');
  });
});
