import * as fs from 'fs';
import * as path from 'path';
import { parseComponentsFile, getComponent, getComponentsByType } from '../../src/analyzer/parser';
import { ComponentsData } from '../../src/analyzer';

describe('Component Parser', () => {
  const componentsFilePath = path.join(__dirname, '../../../components.json');

  test('should parse components.json file successfully', () => {
    const componentsData = parseComponentsFile(componentsFilePath);
    
    expect(componentsData).toBeDefined();
    expect(componentsData.agents).toBeDefined();
    expect(componentsData.commands).toBeDefined();
    expect(componentsData.hooks).toBeDefined();
    expect(componentsData.mcps).toBeDefined();
    
    // Check that we have the expected number of components
    expect(Object.keys(componentsData.agents).length).toBeGreaterThan(0);
    expect(Object.keys(componentsData.commands).length).toBeGreaterThan(0);
    expect(Object.keys(componentsData.hooks).length).toBeGreaterThan(0);
    expect(Object.keys(componentsData.mcps).length).toBeGreaterThan(0);
  });

  test('should throw error for non-existent file', () => {
    expect(() => {
      parseComponentsFile('/path/that/does/not/exist.json');
    }).toThrow('Components file not found at path: /path/that/does/not/exist.json');
  });

  test('should get a specific component by name and type', () => {
    const componentsData = parseComponentsFile(componentsFilePath);
    
    // Get the first agent as an example
    const agentNames = Object.keys(componentsData.agents);
    if (agentNames.length > 0) {
      const firstAgentName = agentNames[0];
      const agent = getComponent(componentsData, firstAgentName, 'agent');
      
      expect(agent).toBeDefined();
      expect(agent?.name).toBeDefined();
      expect(agent?.type).toBe('agent');
    }
  });

  test('should return undefined for non-existent component', () => {
    const componentsData = parseComponentsFile(componentsFilePath);
    const component = getComponent(componentsData, 'non-existent-component', 'agent');
    
    expect(component).toBeUndefined();
  });

  test('should get all components of a specific type', () => {
    const componentsData = parseComponentsFile(componentsFilePath);
    
    const agents = getComponentsByType(componentsData, 'agent');
    const commands = getComponentsByType(componentsData, 'command');
    const hooks = getComponentsByType(componentsData, 'hook');
    const mcps = getComponentsByType(componentsData, 'mcp');
    
    expect(agents.length).toBe(Object.keys(componentsData.agents).length);
    expect(commands.length).toBe(Object.keys(componentsData.commands).length);
    expect(hooks.length).toBe(Object.keys(componentsData.hooks).length);
    expect(mcps.length).toBe(Object.keys(componentsData.mcps).length);
    
    // Check that all returned components have the correct type
    agents.forEach(agent => expect(agent.type).toBe('agent'));
    commands.forEach(command => expect(command.type).toBe('command'));
    hooks.forEach(hook => expect(hook.type).toBe('hook'));
    mcps.forEach(mcp => expect(mcp.type).toBe('mcp'));
  });

  test('should return empty array for invalid component type', () => {
    const componentsData = parseComponentsFile(componentsFilePath);
    const invalidTypeComponents = getComponentsByType(componentsData, 'invalid-type');
    
    expect(invalidTypeComponents).toEqual([]);
  });
});