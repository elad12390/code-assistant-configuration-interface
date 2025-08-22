import { recommendComponents } from '../../src/analyzer/ai-recommender';
import type { ComponentsData, UserRequirements } from '../../src/analyzer';
import type { ChildProcess } from 'child_process';
import { spawn } from 'child_process';

// Mock the child_process spawn
jest.mock('child_process', () => ({
  spawn: jest.fn(),
}));

const mockSpawn = spawn as jest.MockedFunction<typeof spawn>;

describe('AI Recommender', () => {
  const mockComponentsData: ComponentsData = {
    agents: {
      'test-agent': {
        name: 'test-agent',
        path: 'path/to/test-agent.md',
        category: 'test',
        type: 'agent',
        content: 'Test agent content',
        description: 'Test agent description',
      },
    },
    commands: {
      'test-command': {
        name: 'test-command',
        path: 'path/to/test-command.md',
        category: 'test',
        type: 'command',
        content: 'Test command content',
        description: 'Test command description',
      },
    },
    hooks: {
      'test-hook': {
        name: 'test-hook',
        path: 'path/to/test-hook.md',
        category: 'test',
        type: 'hook',
        content: 'Test hook content',
        description: 'Test hook description',
      },
    },
    mcps: {
      'test-mcp': {
        name: 'test-mcp',
        path: 'path/to/test-mcp.md',
        category: 'test',
        type: 'mcp',
        content: 'Test mcp content',
        description: 'Test mcp description',
      },
    },
    settings: {},
    templates: {},
  };

  const mockUserRequirements: UserRequirements = {
    projectType: 'Web Application',
    programmingLanguages: ['JavaScript/TypeScript'],
    frameworks: ['React'],
    experienceLevel: 'intermediate',
  };

  const mockEventEmitter = {
    on: jest.fn(),
    stdout: { on: jest.fn() },
    stderr: { on: jest.fn() },
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should throw error when Claude CLI is not available', async () => {
    // Mock claude --version command to fail
    const mockFailProcess: any = {
      ...mockEventEmitter,
      on: jest.fn((event: string, callback: (code: number) => void) => {
        if (event === 'close') {
          setTimeout(() => callback(1), 0); // Exit with code 1 (failure)
        }
        return mockFailProcess;
      }),
    };
    
    mockSpawn.mockReturnValueOnce(mockFailProcess as ChildProcess);

    await expect(recommendComponents(mockUserRequirements, mockComponentsData)).rejects.toThrow(
      'Claude CLI not found'
    );
  });

  it('should recommend components based on user requirements', async () => {
    // Mock claude --version (success)
    const mockVersionCheck: any = {
      ...mockEventEmitter,
      on: jest.fn((event: string, callback: (code: number) => void) => {
        if (event === 'close') {
          setTimeout(() => callback(0), 0); // Exit with code 0 (success)
        }
        return mockVersionCheck;
      }),
    };

    // Mock claude command with JSON response
    const mockClaudeCommand: any = {
      ...mockEventEmitter,
      stdout: {
        on: jest.fn((event: string, callback: (data: Buffer) => void) => {
          if (event === 'data') {
            const jsonResponse = JSON.stringify({
              agents: ['test-agent'],
              commands: ['test-command'],
              hooks: ['test-hook'],
              mcps: ['test-mcp'],
            });
            setTimeout(() => callback(Buffer.from(jsonResponse)), 0);
          }
          return mockClaudeCommand.stdout;
        }),
      },
      stderr: { on: jest.fn() },
      on: jest.fn((event: string, callback: (code: number) => void) => {
        if (event === 'close') {
          setTimeout(() => callback(0), 0); // Exit with code 0 (success)
        }
        return mockClaudeCommand;
      }),
    };

    mockSpawn
      .mockReturnValueOnce(mockVersionCheck as ChildProcess)
      .mockReturnValueOnce(mockClaudeCommand as ChildProcess);

    const recommendation = await recommendComponents(mockUserRequirements, mockComponentsData);

    expect(recommendation).toBeDefined();
    expect(Array.isArray(recommendation.agents)).toBe(true);
    expect(Array.isArray(recommendation.commands)).toBe(true);
    expect(Array.isArray(recommendation.hooks)).toBe(true);
    expect(Array.isArray(recommendation.mcps)).toBe(true);
  });

  it('should filter out non-existent components', async () => {
    // Mock claude --version (success)
    const mockVersionCheck: any = {
      ...mockEventEmitter,
      on: jest.fn((event: string, callback: (code: number) => void) => {
        if (event === 'close') {
          setTimeout(() => callback(0), 0);
        }
        return mockVersionCheck;
      }),
    };

    // Mock claude command with non-existent components in response
    const mockClaudeCommand: any = {
      ...mockEventEmitter,
      stdout: {
        on: jest.fn((event: string, callback: (data: Buffer) => void) => {
          if (event === 'data') {
            const jsonResponse = JSON.stringify({
              agents: ['test-agent', 'non-existent-agent'],
              commands: ['test-command', 'non-existent-command'],
              hooks: ['test-hook', 'non-existent-hook'],
              mcps: ['test-mcp', 'non-existent-mcp'],
            });
            setTimeout(() => callback(Buffer.from(jsonResponse)), 0);
          }
          return mockClaudeCommand.stdout;
        }),
      },
      stderr: { on: jest.fn() },
      on: jest.fn((event: string, callback: (code: number) => void) => {
        if (event === 'close') {
          setTimeout(() => callback(0), 0);
        }
        return mockClaudeCommand;
      }),
    };

    mockSpawn
      .mockReturnValueOnce(mockVersionCheck as ChildProcess)
      .mockReturnValueOnce(mockClaudeCommand as ChildProcess);

    const recommendation = await recommendComponents(mockUserRequirements, mockComponentsData);

    // Should only include existing components
    expect(recommendation.agents).toContain('test-agent');
    expect(recommendation.agents).not.toContain('non-existent-agent');
    expect(recommendation.commands).toContain('test-command');
    expect(recommendation.commands).not.toContain('non-existent-command');
  });
});
