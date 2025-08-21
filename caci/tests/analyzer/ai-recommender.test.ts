import { recommendComponents } from '../../src/analyzer/ai-recommender';
import type { ComponentsData, UserRequirements } from '../../src/analyzer';

// Mock the LangChain modules
jest.mock('@langchain/google-genai', () => {
  return {
    ChatGoogleGenerativeAI: jest.fn().mockImplementation(() => {
      return {
        invoke: jest.fn().mockResolvedValue({
          content: JSON.stringify({
            agents: ['test-agent'],
            commands: ['test-command'],
            hooks: ['test-hook'],
            mcps: ['test-mcp'],
          }),
        }),
      };
    }),
  };
});

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

  beforeEach(() => {
    // Set a mock API key
    process.env.GOOGLE_API_KEY = 'test-api-key';
  });

  afterEach(() => {
    // Clear the mock API key
    delete process.env.GOOGLE_API_KEY;
    jest.clearAllMocks();
  });

  it('should throw error when GOOGLE_API_KEY is not set', async () => {
    delete process.env.GOOGLE_API_KEY;

    await expect(recommendComponents(mockUserRequirements, mockComponentsData)).rejects.toThrow(
      'GOOGLE_API_KEY environment variable is not set'
    );
  });

  it('should recommend components based on user requirements', async () => {
    const recommendation = await recommendComponents(mockUserRequirements, mockComponentsData);

    expect(recommendation).toBeDefined();
    expect(Array.isArray(recommendation.agents)).toBe(true);
    expect(Array.isArray(recommendation.commands)).toBe(true);
    expect(Array.isArray(recommendation.hooks)).toBe(true);
    expect(Array.isArray(recommendation.mcps)).toBe(true);
  });

  it('should filter out non-existent components', async () => {
    // Mock the LangChain modules with non-existent components
    jest.mock('@langchain/google-genai', () => {
      return {
        ChatGoogleGenerativeAI: jest.fn().mockImplementation(() => {
          return {
            invoke: jest.fn().mockResolvedValue({
              content: JSON.stringify({
                agents: ['test-agent', 'non-existent-agent'],
                commands: ['test-command', 'non-existent-command'],
                hooks: ['test-hook', 'non-existent-hook'],
                mcps: ['test-mcp', 'non-existent-mcp'],
              }),
            }),
          };
        }),
      };
    });

    const recommendation = await recommendComponents(mockUserRequirements, mockComponentsData);

    // Should only include existing components
    expect(recommendation.agents).toContain('test-agent');
    expect(recommendation.agents).not.toContain('non-existent-agent');
    expect(recommendation.commands).toContain('test-command');
    expect(recommendation.commands).not.toContain('non-existent-command');
  });
});
