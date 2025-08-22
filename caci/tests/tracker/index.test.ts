import * as fs from 'fs';
import * as path from 'path';
import * as os from 'os';
import type { SelectedComponents, UserRequirements } from '../../src/tracker';
import {
  saveIteration,
  listIterations,
  getIterationDetails,
  compareIterations,
} from '../../src/tracker';

describe('Iteration Tracker', () => {
  let tempDir: string;
  let projectDir: string;

  beforeEach(async () => {
    // Create a temporary directory for testing
    tempDir = await fs.promises.mkdtemp(path.join(os.tmpdir(), 'caci-test-'));
    projectDir = tempDir;
  });

  afterEach(async () => {
    // Clean up the temporary directory
    await fs.promises.rm(tempDir, { recursive: true, force: true });
  });

  it('should create .configurator folder and save iteration', async () => {
    const selectedComponents: SelectedComponents = {
      agents: ['test-agent-1', 'test-agent-2'],
      commands: ['test-command-1'],
      hooks: [],
      mcps: ['test-mcp-1', 'test-mcp-2'],
    };

    const userRequirements: UserRequirements = {
      projectType: 'Web Application',
      programmingLanguages: ['JavaScript', 'TypeScript'],
      experienceLevel: 'intermediate',
    };

    const iterationId = await saveIteration(projectDir, selectedComponents, userRequirements);

    // Verify iteration was saved
    expect(iterationId).toBeDefined();
    expect(typeof iterationId).toBe('string');

    // Verify .configurator folder was created
    const configuratorPath = path.join(projectDir, '.configurator');
    await expect(fs.promises.access(configuratorPath, fs.constants.F_OK)).resolves.toBeUndefined();

    // Verify iterations folder was created
    const iterationsPath = path.join(configuratorPath, 'iterations');
    await expect(fs.promises.access(iterationsPath, fs.constants.F_OK)).resolves.toBeUndefined();

    // Verify iteration file was created
    const iterationFilePath = path.join(iterationsPath, `${iterationId}.json`);
    await expect(fs.promises.access(iterationFilePath, fs.constants.F_OK)).resolves.toBeUndefined();
  });

  it('should list saved iterations', async () => {
    // Initially, there should be no iterations
    const initialIterations = await listIterations(projectDir);
    expect(initialIterations).toStrictEqual([]);

    // Save an iteration
    const selectedComponents: SelectedComponents = {
      agents: ['test-agent'],
      commands: ['test-command'],
      hooks: ['test-hook'],
      mcps: ['test-mcp'],
    };

    const userRequirements: UserRequirements = {
      projectType: 'Web Application',
      programmingLanguages: ['JavaScript'],
      experienceLevel: 'beginner',
    };

    const iterationId = await saveIteration(projectDir, selectedComponents, userRequirements);

    // List iterations
    const iterations = await listIterations(projectDir);
    expect(iterations).toHaveLength(1);
    expect(iterations[0].id).toBe(iterationId);
    expect(iterations[0].timestamp).toBeDefined();
  });

  it('should get iteration details', async () => {
    const selectedComponents: SelectedComponents = {
      agents: ['test-agent-1', 'test-agent-2'],
      commands: ['test-command-1'],
      hooks: [],
      mcps: ['test-mcp-1', 'test-mcp-2'],
    };

    const userRequirements: UserRequirements = {
      projectType: 'Web Application',
      programmingLanguages: ['JavaScript', 'TypeScript'],
      experienceLevel: 'intermediate',
    };

    const iterationId = await saveIteration(projectDir, selectedComponents, userRequirements);

    // Get iteration details
    const details = await getIterationDetails(projectDir, iterationId);

    expect(details).toBeDefined();
    expect(details.id).toBe(iterationId);
    expect(details.timestamp).toBeDefined();
    expect(details.selectedComponents).toStrictEqual(selectedComponents);
    expect(details.userRequirements).toStrictEqual(userRequirements);
  });

  it.skip('should compare different iterations', async () => {
    // Save first iteration
    const selectedComponents1: SelectedComponents = {
      agents: ['agent-1', 'agent-2'],
      commands: ['command-1'],
      hooks: ['hook-1'],
      mcps: ['mcp-1'],
    };

    const userRequirements1: UserRequirements = {
      projectType: 'Web Application',
      programmingLanguages: ['JavaScript'],
      experienceLevel: 'beginner',
    };

    const iterationId1 = await saveIteration(projectDir, selectedComponents1, userRequirements1);

    // Save second iteration
    const selectedComponents2: SelectedComponents = {
      agents: ['agent-1', 'agent-3'], // agent-2 replaced with agent-3
      commands: ['command-1'],
      hooks: ['hook-1', 'hook-2'], // added hook-2
      mcps: ['mcp-1'],
    };

    const userRequirements2: UserRequirements = {
      projectType: 'Web Application',
      programmingLanguages: ['JavaScript', 'TypeScript'], // added TypeScript
      experienceLevel: 'intermediate', // changed from beginner
    };

    const iterationId2 = await saveIteration(projectDir, selectedComponents2, userRequirements2);

    // Compare iterations
    const comparison = await compareIterations(projectDir, iterationId1, iterationId2);

    expect(comparison).toBeDefined();
    expect(comparison.added).toStrictEqual({
      agents: ['agent-3'],
      commands: [],
      hooks: ['hook-2'],
      mcps: [],
    });

    expect(comparison.removed).toStrictEqual({
      agents: ['agent-2'],
      commands: [],
      hooks: [],
      mcps: [],
    });

    expect(comparison.unchanged).toStrictEqual({
      agents: ['agent-1'],
      commands: ['command-1'],
      hooks: ['hook-1'],
      mcps: ['mcp-1'],
    });
  });
});
