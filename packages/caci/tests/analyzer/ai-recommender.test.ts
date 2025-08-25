import { recommendComponents } from '../../src/analyzer/ai-recommender';
import type { ComponentsData, UserRequirements } from '../../src/analyzer';

// Mock LangChain providers
jest.mock('@langchain/google-genai', () => ({
  ChatGoogleGenerativeAI: jest.fn().mockImplementation(() => ({
    invoke: jest.fn().mockResolvedValue({
      content: JSON.stringify({
        agents: ['test-agent', 'non-existent-agent'],
        commands: ['test-command', 'non-existent-command'],
        hooks: ['test-hook', 'non-existent-hook'],
        mcps: ['test-mcp', 'non-existent-mcp'],
      }),
    }),
  })),
}));

jest.mock('@langchain/anthropic', () => ({
  ChatAnthropic: jest.fn(),
}));

jest.mock('@langchain/openai', () => ({
  ChatOpenAI: jest.fn().mockImplementation(() => ({
    invoke: jest.fn().mockResolvedValue({
      content: JSON.stringify({
        agents: ['test-agent', 'non-existent-agent'],
        commands: ['test-command', 'non-existent-command'],
        hooks: ['test-hook', 'non-existent-hook'],
        mcps: ['test-mcp', 'non-existent-mcp'],
      }),
    }),
  })),
}));

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
      'business-analyst': {
        name: 'business-analyst',
        path: 'agents/business-analyst.md',
        category: 'business',
        type: 'agent',
        content: 'Business analyst content',
        description: 'Business analyst agent',
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
      context7: {
        name: 'context7',
        path: 'mcps/context7.json',
        category: 'documentation',
        type: 'mcp',
        content:
          '{"mcpServers": {"context7": {"command": "npx", "args": ["@upstash/context7-mcp"]}}}',
        description: 'Documentation lookup MCP',
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
    jest.clearAllMocks();
  });

  it('should return default recommendations when no API key is provided', async () => {
    // Test with no API key - should return default recommendations
    const result = await recommendComponents(mockUserRequirements, mockComponentsData);
    
    expect(result).toBeDefined();
    expect(result.agents).toBeDefined();
    expect(result.commands).toBeDefined();
    expect(result.hooks).toBeDefined();
    expect(result.mcps).toBeDefined();
    
    // Should contain some default recommendations
    expect(result.agents.length).toBeGreaterThan(0);
    expect(result.commands.length).toBeGreaterThan(0);
  });

  it('should recommend components based on user requirements', async () => {
    // Test with mock API key
    const mockApiKey = 'sk-test-api-key';

    const recommendation = await recommendComponents(mockUserRequirements, mockComponentsData, mockApiKey);

    expect(recommendation).toBeDefined();
    expect(Array.isArray(recommendation.agents)).toBe(true);
    expect(Array.isArray(recommendation.commands)).toBe(true);
    expect(Array.isArray(recommendation.hooks)).toBe(true);
    expect(Array.isArray(recommendation.mcps)).toBe(true);

    // Should include defaults
    expect(recommendation.mcps).toContain('context7');
    expect(recommendation.agents).toContain('business-analyst');
  });

  it('should filter out non-existent components', async () => {
    // The global mock will return the default response which includes non-existent components
    // This test verifies filtering works correctly

    const mockApiKey = 'sk-test-api-key';
    const recommendation = await recommendComponents(mockUserRequirements, mockComponentsData, mockApiKey);

    // Should only include existing components
    expect(recommendation.agents).toContain('test-agent');
    expect(recommendation.agents).not.toContain('non-existent-agent');
    expect(recommendation.commands).toContain('test-command');
    expect(recommendation.commands).not.toContain('non-existent-command');
  });
});
