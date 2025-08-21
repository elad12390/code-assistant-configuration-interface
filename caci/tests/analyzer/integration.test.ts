import * as path from 'path';
import { parseComponentsFile } from '../../src/analyzer/parser';
import { collectUserRequirements } from '../../src/analyzer/requirementCollector';
import { recommendComponents } from '../../src/analyzer/ai-recommender';

// Mock inquirer to avoid interactive prompts during testing
jest.mock('inquirer', () => ({
  __esModule: true,
  default: {
    prompt: jest.fn().mockResolvedValue({ value: 'test-response' }),
  },
}));

// Mock the LangChain modules
jest.mock('@langchain/google-genai', () => {
  return {
    ChatGoogleGenerativeAI: jest.fn().mockImplementation(() => {
      return {
        invoke: jest.fn().mockResolvedValue({
          content: JSON.stringify({
            agents: ['hackathon-ai-strategist'],
            commands: ['project-init'],
            hooks: ['pre-commit-hook'],
            mcps: ['github-mcp'],
          }),
        }),
      };
    }),
  };
});

describe('Analyzer Integration', () => {
  const componentsFilePath = path.join(__dirname, '../../../components.json');

  beforeEach(() => {
    // Set a mock API key
    process.env.GOOGLE_API_KEY = 'test-api-key';
  });

  afterEach(() => {
    // Clear the mock API key
    delete process.env.GOOGLE_API_KEY;
    jest.clearAllMocks();
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
    const userRequirements = await collectUserRequirements();

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
