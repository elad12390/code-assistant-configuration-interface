import * as fs from 'fs';
import * as path from 'path';
import * as os from 'os';
import type { ChildProcess } from 'child_process';
import { spawn } from 'child_process';
import { runConfigurationWorkflow } from '../../src/integration';

// Mock child_process spawn
jest.mock('child_process', () => ({
  spawn: jest.fn(),
}));

const mockSpawn = spawn as jest.MockedFunction<typeof spawn>;

// Mock the AI recommender to avoid API calls during testing
jest.mock('../../src/analyzer/ai-recommender', () => ({
  recommendComponents: jest.fn().mockResolvedValue({
    agents: ['test-agent-1', 'test-agent-2'],
    commands: ['test-command-1'],
    hooks: ['test-hook-1'],
    mcps: ['test-mcp-1'],
  }),
}));

// Mock inquirer to avoid interactive prompts during testing
jest.mock('inquirer', () => ({
  __esModule: true,
  default: {
    prompt: jest.fn().mockImplementation(questions => {
      // Return mock answers for the questions
      const answers: any = {};
      questions.forEach((question: any) => {
        if (question.type === 'input') {
          answers[question.name] = 'Test answer';
        } else if (question.type === 'list' || question.type === 'checkbox') {
          answers[question.name] = question.choices ? question.choices[0] : 'Test choice';
        }
      });
      return Promise.resolve(answers);
    }),
  },
}));

describe('CACI CLI Integration', () => {
  let tempDir: string;
  let projectDir: string;

  beforeEach(async () => {
    jest.clearAllMocks();

    // Mock tree/find commands for project structure analysis
    const mockTreeProcess: any = {
      on: jest.fn((event: string, callback: (code: number) => void) => {
        if (event === 'close') {
          setTimeout(() => callback(0), 0);
        }
        return mockTreeProcess;
      }),
      stdout: {
        on: jest.fn((event: string, callback: (data: Buffer) => void) => {
          if (event === 'data') {
            setTimeout(() => callback(Buffer.from('test-project/\n├── package.json\n└── src/')), 0);
          }
          return mockTreeProcess.stdout;
        }),
      },
      stderr: { on: jest.fn() },
    };

    mockSpawn.mockReturnValue(mockTreeProcess as ChildProcess);

    // Create a temporary directory for testing
    tempDir = await fs.promises.mkdtemp(path.join(os.tmpdir(), 'caci-test-'));
    projectDir = tempDir;

    // Create a mock components.json file
    const componentsData = {
      agents: {
        'test-agent-1': {
          name: 'test-agent-1',
          path: 'path/to/test-agent-1.md',
          category: 'test',
          type: 'agent',
          content: 'Test agent 1 content',
          description: 'Test agent 1 description',
        },
        'test-agent-2': {
          name: 'test-agent-2',
          path: 'path/to/test-agent-2.md',
          category: 'test',
          type: 'agent',
          content: 'Test agent 2 content',
          description: 'Test agent 2 description',
        },
      },
      commands: {
        'test-command-1': {
          name: 'test-command-1',
          path: 'path/to/test-command-1.md',
          category: 'test',
          type: 'command',
          content: 'Test command 1 content',
          description: 'Test command 1 description',
        },
      },
      hooks: {
        'test-hook-1': {
          name: 'test-hook-1',
          path: 'path/to/test-hook-1.md',
          category: 'test',
          type: 'hook',
          content: 'Test hook 1 content',
          description: 'Test hook 1 description',
        },
      },
      mcps: {
        'test-mcp-1': {
          name: 'test-mcp-1',
          path: 'path/to/test-mcp-1.md',
          category: 'test',
          type: 'mcp',
          content: 'Test mcp 1 content',
          description: 'Test mcp 1 description',
        },
      },
      settings: {},
      templates: {},
    };

    await fs.promises.writeFile(
      path.join(projectDir, 'components.json'),
      JSON.stringify(componentsData, null, 2),
      'utf8'
    );
  });

  afterEach(async () => {
    // Clean up the temporary directory
    await fs.promises.rm(tempDir, { recursive: true, force: true });
  });

  it('should run complete configuration workflow', async () => {
    // Run the configuration workflow (no API key needed for Claude CLI)
    const result = await runConfigurationWorkflow(projectDir);

    // Verify the workflow completed successfully
    expect(result).toBeDefined();
    expect(result.success).toBe(true);

    // Verify .claude folder was created
    const claudePath = path.join(projectDir, '.claude');
    await expect(fs.promises.access(claudePath, fs.constants.F_OK)).resolves.toBeUndefined();

    // Verify .configurator folder was created
    const configuratorPath = path.join(projectDir, '.configurator');
    await expect(fs.promises.access(configuratorPath, fs.constants.F_OK)).resolves.toBeUndefined();

    // Verify iterations folder was created
    const iterationsPath = path.join(configuratorPath, 'iterations');
    await expect(fs.promises.access(iterationsPath, fs.constants.F_OK)).resolves.toBeUndefined();
  });

  it('should handle missing components.json file', async () => {
    // This test is no longer relevant since components.json is now bundled with the package
    // Instead test that the workflow succeeds even without components.json in project directory
    await fs.promises.rm(path.join(projectDir, 'components.json'));

    // Run the configuration workflow (should work with bundled components.json)
    const result = await runConfigurationWorkflow(projectDir);

    // Verify the workflow completed successfully using bundled components.json
    expect(result).toBeDefined();
    expect(result.success).toBe(true);
  });

  it('should handle Claude CLI unavailable', async () => {
    // This test is no longer about missing API key since we use Claude CLI
    // Instead test that the workflow gracefully handles Claude CLI being unavailable

    // Mock AI recommender to throw Claude CLI error
    const aiRecommender = await import('../../src/analyzer/ai-recommender');
    (aiRecommender.recommendComponents as jest.Mock).mockRejectedValueOnce(
      new Error(
        'Claude CLI not found. Please install Claude Code and run `claude /login` to authenticate.'
      )
    );

    // Run the configuration workflow
    const result = await runConfigurationWorkflow(projectDir);

    // Verify the workflow failed due to Claude CLI unavailability
    expect(result).toBeDefined();
    expect(result.success).toBe(false);
    expect(result.error).toBeDefined();
    expect(result.error).toContain('Claude CLI not found');
  });
});
