import * as fs from 'fs';
import * as path from 'path';
import * as fsPromises from 'fs/promises';

export interface SelectedComponents {
  agents: string[];
  commands: string[];
  hooks: string[];
  mcps: string[];
}

export interface UserRequirements {
  projectType?: string;
  programmingLanguages?: string[];
  frameworks?: string[];
  features?: string[];
  complexity?: 'simple' | 'medium' | 'complex';
  experienceLevel?: 'beginner' | 'intermediate' | 'advanced';
  [key: string]: any;
}

export interface Iteration {
  id: string;
  timestamp: string;
  selectedComponents: SelectedComponents;
  userRequirements: UserRequirements;
}

export interface IterationComparison {
  added: SelectedComponents;
  removed: SelectedComponents;
  unchanged: SelectedComponents;
}

/**
 * Creates the .configurator folder and saves a new iteration
 * @param projectDir The project directory path
 * @param selectedComponents The selected components for this iteration
 * @param userRequirements The user requirements for this iteration
 * @returns The ID of the saved iteration
 */
export async function saveIteration(
  projectDir: string,
  selectedComponents: SelectedComponents,
  userRequirements: UserRequirements
): Promise<string> {
  const timestamp = new Date().toISOString();
  const iterationId = timestamp.replace(/[:.]/g, '-');

  // Create .configurator folder if it doesn't exist
  const configuratorPath = path.join(projectDir, '.configurator');
  await fsPromises.mkdir(configuratorPath, { recursive: true });

  // Create iterations folder if it doesn't exist
  const iterationsPath = path.join(configuratorPath, 'iterations');
  await fsPromises.mkdir(iterationsPath, { recursive: true });

  // Create iteration data
  const iterationData: Iteration = {
    id: iterationId,
    timestamp,
    selectedComponents,
    userRequirements,
  };

  // Save iteration to file
  const iterationFilePath = path.join(iterationsPath, `${iterationId}.json`);
  await fsPromises.writeFile(iterationFilePath, JSON.stringify(iterationData, null, 2), 'utf8');

  return iterationId;
}

/**
 * Lists all saved iterations
 * @param projectDir The project directory path
 * @returns Array of iterations with basic information
 */
export async function listIterations(
  projectDir: string
): Promise<{ id: string; timestamp: string }[]> {
  const iterationsPath = path.join(projectDir, '.configurator', 'iterations');

  try {
    await fsPromises.access(iterationsPath, fs.constants.F_OK);
  } catch {
    return []; // No iterations folder exists
  }

  const entries = await fsPromises.readdir(iterationsPath, { withFileTypes: true });
  const iterations: { id: string; timestamp: string }[] = [];

  for (const entry of entries) {
    if (entry.isFile() && entry.name.endsWith('.json')) {
      const iterationId = entry.name.replace('.json', '');
      const iterationFilePath = path.join(iterationsPath, entry.name);

      try {
        const content = await fsPromises.readFile(iterationFilePath, 'utf8');
        const iterationData: Iteration = JSON.parse(content);
        iterations.push({
          id: iterationData.id,
          timestamp: iterationData.timestamp,
        });
      } catch (error) {
        // Skip invalid iteration files
        console.warn(`Skipping invalid iteration file: ${entry.name}`);
      }
    }
  }

  // Sort iterations by timestamp (newest first)
  iterations.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

  return iterations;
}

/**
 * Gets detailed information about a specific iteration
 * @param projectDir The project directory path
 * @param iterationId The ID of the iteration to retrieve
 * @returns Detailed iteration information
 */
export async function getIterationDetails(
  projectDir: string,
  iterationId: string
): Promise<Iteration> {
  const iterationFilePath = path.join(
    projectDir,
    '.configurator',
    'iterations',
    `${iterationId}.json`
  );

  try {
    const content = await fsPromises.readFile(iterationFilePath, 'utf8');
    const iterationData: Iteration = JSON.parse(content);
    return iterationData;
  } catch (error) {
    throw new Error(
      `Failed to retrieve iteration ${iterationId}: ${error instanceof Error ? error.message : String(error)}`
    );
  }
}

/**
 * Compares two iterations and shows the differences
 * @param projectDir The project directory path
 * @param iterationId1 The ID of the first iteration
 * @param iterationId2 The ID of the second iteration
 * @returns Comparison of the two iterations
 */
export async function compareIterations(
  projectDir: string,
  iterationId1: string,
  iterationId2: string
): Promise<IterationComparison> {
  const iteration1 = await getIterationDetails(projectDir, iterationId1);
  const iteration2 = await getIterationDetails(projectDir, iterationId2);

  // Helper function to calculate differences
  const calculateDifferences = (
    arr1: string[],
    arr2: string[]
  ): { added: string[]; removed: string[]; unchanged: string[] } => {
    const set1 = new Set(arr1);
    const set2 = new Set(arr2);

    const added = [...set2].filter(item => !set1.has(item));
    const removed = [...set1].filter(item => !set2.has(item));
    const unchanged = [...set1].filter(item => set2.has(item));

    return { added, removed, unchanged };
  };

  // Calculate differences for each component type
  const agentsDiff = calculateDifferences(
    iteration1.selectedComponents.agents,
    iteration2.selectedComponents.agents
  );
  const commandsDiff = calculateDifferences(
    iteration1.selectedComponents.commands,
    iteration2.selectedComponents.commands
  );
  const hooksDiff = calculateDifferences(
    iteration1.selectedComponents.hooks,
    iteration2.selectedComponents.hooks
  );
  const mcpsDiff = calculateDifferences(
    iteration1.selectedComponents.mcps,
    iteration2.selectedComponents.mcps
  );

  return {
    added: {
      agents: agentsDiff.added,
      commands: commandsDiff.added,
      hooks: hooksDiff.added,
      mcps: mcpsDiff.added,
    },
    removed: {
      agents: agentsDiff.removed,
      commands: commandsDiff.removed,
      hooks: hooksDiff.removed,
      mcps: mcpsDiff.removed,
    },
    unchanged: {
      agents: agentsDiff.unchanged,
      commands: commandsDiff.unchanged,
      hooks: hooksDiff.unchanged,
      mcps: mcpsDiff.unchanged,
    },
  };
}
