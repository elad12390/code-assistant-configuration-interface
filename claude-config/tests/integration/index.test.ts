import * as fs from 'fs';
import * as path from 'path';
import * as os from 'os';
import { runConfigurationWorkflow } from '../../src/integration';

// Mock the AI recommender to avoid API calls during testing
jest.mock('../../src/analyzer/ai-recommender', () => ({
  recommendComponents: jest.fn().mockResolvedValue({
    agents: ['test-agent-1', 'test-agent-2'],
    commands: ['test-command-1'],
    hooks: ['test-hook-1'],
    mcps: ['test-mcp-1']
  })
}));

// Mock inquirer to avoid interactive prompts during testing
jest.mock('inquirer', () => ({
  __esModule: true,
  default: {
    prompt: jest.fn().mockImplementation((questions) => {
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
    })
  }
}));

describe('CLI Integration', () => {
  let tempDir: string;
  let projectDir: string;

  beforeEach(async () => {
    // Create a temporary directory for testing
    tempDir = await fs.promises.mkdtemp(path.join(os.tmpdir(), 'claude-config-test-'));
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
          description: 'Test agent 1 description'
        },
        'test-agent-2': {
          name: 'test-agent-2',
          path: 'path/to/test-agent-2.md',
          category: 'test',
          type: 'agent',
          content: 'Test agent 2 content',
          description: 'Test agent 2 description'
        }
      },
      commands: {
        'test-command-1': {
          name: 'test-command-1',
          path: 'path/to/test-command-1.md',
          category: 'test',
          type: 'command',
          content: 'Test command 1 content',
          description: 'Test command 1 description'
        }
      },
      hooks: {
        'test-hook-1': {
          name: 'test-hook-1',
          path: 'path/to/test-hook-1.md',
          category: 'test',
          type: 'hook',
          content: 'Test hook 1 content',
          description: 'Test hook 1 description'
        }
      },
      mcps: {
        'test-mcp-1': {
          name: 'test-mcp-1',
          path: 'path/to/test-mcp-1.md',
          category: 'test',
          type: 'mcp',
          content: 'Test mcp 1 content',
          description: 'Test mcp 1 description'
        }
      },
      settings: {},
      templates: {}
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

  test('should run complete configuration workflow', async () => {
    // Mock process.env for API key
    const originalEnv = process.env.GOOGLE_API_KEY;
    process.env.GOOGLE_API_KEY = 'test-api-key';
    
    try {
      // Run the configuration workflow
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
      
    } finally {
      // Restore original environment
      if (originalEnv !== undefined) {
        process.env.GOOGLE_API_KEY = originalEnv;
      } else {
        delete process.env.GOOGLE_API_KEY;
      }
    }
  });

  test('should handle missing components.json file', async () => {
    // Remove the components.json file
    await fs.promises.rm(path.join(projectDir, 'components.json'));
    
    // Mock process.env for API key
    const originalEnv = process.env.GOOGLE_API_KEY;
    process.env.GOOGLE_API_KEY = 'test-api-key';
    
    try {
      // Run the configuration workflow
      const result = await runConfigurationWorkflow(projectDir);
      
      // Verify the workflow failed due to missing components.json
      expect(result).toBeDefined();
      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
      
    } finally {
      // Restore original environment
      if (originalEnv !== undefined) {
        process.env.GOOGLE_API_KEY = originalEnv;
      } else {
        delete process.env.GOOGLE_API_KEY;
      }
    }
  });

  test('should handle missing API key', async () => {
    // Remove the API key
    const originalEnv = process.env.GOOGLE_API_KEY;
    delete process.env.GOOGLE_API_KEY;
    
    try {
      // Run the configuration workflow
      const result = await runConfigurationWorkflow(projectDir);
      
      // Verify the workflow failed due to missing API key
      expect(result).toBeDefined();
      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
      
    } finally {
      // Restore original environment
      if (originalEnv !== undefined) {
        process.env.GOOGLE_API_KEY = originalEnv;
      }
    }
  });
});