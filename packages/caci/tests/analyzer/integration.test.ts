import * as path from 'path';
import type { ChildProcess } from 'child_process';
import { spawn } from 'child_process';
import { parseComponentsFile } from '../../src/analyzer/parser';
import { collectUserRequirements } from '../../src/analyzer/requirementCollector';
import { recommendComponents } from '../../src/analyzer/ai-recommender';

// Mock child_process spawn
jest.mock('child_process', () => ({
  spawn: jest.fn(),
}));

// Mock OAuth module to avoid ES module issues in tests
jest.mock('../../src/auth/oauth', () => ({
  getStoredApiKey: jest.fn().mockResolvedValue(null),
  isAuthenticated: jest.fn().mockResolvedValue(false),
  performOAuthFlow: jest.fn().mockResolvedValue('mock-api-key'),
  getApiKey: jest.fn().mockResolvedValue(null),
  clearStoredApiKey: jest.fn().mockResolvedValue(undefined),
}));

const mockSpawn = spawn as jest.MockedFunction<typeof spawn>;

// Mock inquirer to avoid interactive prompts during testing
jest.mock('inquirer', () => ({
  __esModule: true,
  default: {
    prompt: jest.fn().mockResolvedValue({ value: 'test-response' }),
  },
}));

// Mock AI recommender to avoid Claude CLI calls
jest.mock('../../src/analyzer/ai-recommender', () => ({
  recommendComponents: jest.fn().mockResolvedValue({
    agents: ['hackathon-ai-strategist'],
    commands: ['project-init'],
    hooks: ['pre-commit-hook'],
    mcps: ['github-mcp'],
  }),
}));

describe('Analyzer Integration', () => {
  const componentsFilePath = path.join(__dirname, '../../../../components.json');

  beforeEach(() => {
    jest.clearAllMocks();

    // Mock tree command for project structure analysis
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
  });

  it('should parse components file and recommend components', async () => {
    // Parse components
    const componentsData = parseComponentsFile(componentsFilePath);

    expect(componentsData).toBeDefined();
    expect(componentsData.agents).toBeDefined();
    expect(componentsData.commands).toBeDefined();
    expect(componentsData.hooks).toBeDefined();
    expect(componentsData.mcps).toBeDefined();

    // Collect user requirements (mocked)
    const userRequirements = await collectUserRequirements(process.cwd());

    expect(userRequirements).toBeDefined();

    // Recommend components (mocked)
    const recommendations = await recommendComponents(userRequirements, componentsData);

    expect(recommendations).toBeDefined();
    expect(Array.isArray(recommendations.agents)).toBe(true);
    expect(Array.isArray(recommendations.commands)).toBe(true);
    expect(Array.isArray(recommendations.hooks)).toBe(true);
    expect(Array.isArray(recommendations.mcps)).toBe(true);
  });
});
