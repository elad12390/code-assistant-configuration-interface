import { displayComponents, displayRecommendations } from '../../src/analyzer/display';
import { ComponentsData } from '../../src/analyzer';

describe('Display Module', () => {
  const mockComponentsData: ComponentsData = {
    agents: {
      'test-agent': {
        name: 'test-agent',
        path: 'path/to/test-agent.md',
        category: 'test',
        type: 'agent',
        content: 'Test agent content',
        description: 'Test agent description'
      }
    },
    commands: {
      'test-command': {
        name: 'test-command',
        path: 'path/to/test-command.md',
        category: 'test',
        type: 'command',
        content: 'Test command content',
        description: 'Test command description'
      }
    },
    hooks: {
      'test-hook': {
        name: 'test-hook',
        path: 'path/to/test-hook.md',
        category: 'test',
        type: 'hook',
        content: 'Test hook content',
        description: 'Test hook description'
      }
    },
    mcps: {
      'test-mcp': {
        name: 'test-mcp',
        path: 'path/to/test-mcp.md',
        category: 'test',
        type: 'mcp',
        content: 'Test mcp content',
        description: 'Test mcp description'
      }
    },
    settings: {},
    templates: {}
  };

  // Mock console.log to capture output
  let mockConsoleLog: jest.SpyInstance;

  beforeEach(() => {
    mockConsoleLog = jest.spyOn(console, 'log').mockImplementation(() => {});
  });

  afterEach(() => {
    mockConsoleLog.mockRestore();
  });

  test('should display components with descriptions', () => {
    const components = ['test-agent'];
    
    displayComponents(components, 'Agents', mockComponentsData);
    
    expect(mockConsoleLog).toHaveBeenCalled();
  });

  test('should display message when no components are provided', () => {
    const components: string[] = [];
    
    displayComponents(components, 'Agents', mockComponentsData);
    
    expect(mockConsoleLog).toHaveBeenCalledWith(expect.stringContaining('Agents: None'));
  });

  test('should display recommendations for all categories', () => {
    const recommendations = {
      agents: ['test-agent'],
      commands: ['test-command'],
      hooks: ['test-hook'],
      mcps: ['test-mcp']
    };
    
    displayRecommendations(recommendations, mockComponentsData);
    
    expect(mockConsoleLog).toHaveBeenCalled();
  });
});