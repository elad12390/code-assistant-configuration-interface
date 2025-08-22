import * as fs from 'fs';
import type { ComponentsData, Component } from './index';

/**
 * Converts array format to object format for components
 * @param components Array of components
 * @returns Object with component names as keys
 */
function arrayToObject(components: Component[]): Record<string, Component> {
  const result: Record<string, Component> = {};
  for (const component of components) {
    result[component.name] = component;
  }
  return result;
}

/**
 * Parses the components.json file and returns the structured data
 * @param filePath Path to the components.json file
 * @returns Parsed components data
 */
export function parseComponentsFile(filePath: string): ComponentsData {
  try {
    // Check if file exists
    if (!fs.existsSync(filePath)) {
      throw new Error(`Components file not found at path: ${filePath}`);
    }

    // Read and parse the JSON file
    const rawData = fs.readFileSync(filePath, 'utf-8');
    const rawComponentsData = JSON.parse(rawData);

    // Convert array format to object format if needed
    const componentsData: ComponentsData = {
      agents: Array.isArray(rawComponentsData.agents)
        ? arrayToObject(rawComponentsData.agents as Component[])
        : rawComponentsData.agents || {},
      commands: Array.isArray(rawComponentsData.commands)
        ? arrayToObject(rawComponentsData.commands as Component[])
        : rawComponentsData.commands || {},
      hooks: Array.isArray(rawComponentsData.hooks)
        ? arrayToObject(rawComponentsData.hooks as Component[])
        : rawComponentsData.hooks || {},
      mcps: Array.isArray(rawComponentsData.mcps)
        ? arrayToObject(rawComponentsData.mcps as Component[])
        : rawComponentsData.mcps || {},
      settings: rawComponentsData.settings || {},
      templates: rawComponentsData.templates || {},
    };

    return componentsData;
  } catch (error: any) {
    if (error.code === 'ENOENT') {
      throw new Error(`Components file not found at path: ${filePath}`);
    } else if (error instanceof SyntaxError) {
      throw new Error(`Invalid JSON in components file: ${error.message}`);
    } else {
      throw new Error(`Error reading components file: ${error.message}`);
    }
  }
}

/**
 * Gets a specific component by name and type
 * @param componentsData Parsed components data
 * @param name Name of the component
 * @param type Type of the component (agent, command, hook, mcp)
 * @returns The component or undefined if not found
 */
export function getComponent(
  componentsData: ComponentsData,
  name: string,
  type: string
): Component | undefined {
  switch (type.toLowerCase()) {
    case 'agent':
      return componentsData.agents[name];
    case 'command':
      return componentsData.commands[name];
    case 'hook':
      return componentsData.hooks[name];
    case 'mcp':
      return componentsData.mcps[name];
    default:
      return undefined;
  }
}

/**
 * Gets all components of a specific type
 * @param componentsData Parsed components data
 * @param type Type of components to retrieve
 * @returns Array of components of the specified type
 */
export function getComponentsByType(componentsData: ComponentsData, type: string): Component[] {
  switch (type.toLowerCase()) {
    case 'agent':
      return Object.values(componentsData.agents);
    case 'command':
      return Object.values(componentsData.commands);
    case 'hook':
      return Object.values(componentsData.hooks);
    case 'mcp':
      return Object.values(componentsData.mcps);
    default:
      return [];
  }
}
