import { spawn } from 'child_process';
import { z } from 'zod';
import type { ComponentsData, UserRequirements } from './index';

// Define the schema for AI response
const RecommendationSchema = z.object({
  agents: z.array(z.string()),
  commands: z.array(z.string()),
  hooks: z.array(z.string()),
  mcps: z.array(z.string()),
});

type Recommendation = z.infer<typeof RecommendationSchema>;

/**
 * Checks if Claude CLI is available and user is logged in
 */
async function checkClaudeAvailability(): Promise<void> {
  return new Promise((resolve, reject) => {
    const claude = spawn('claude', ['--version'], { stdio: ['ignore', 'pipe', 'pipe'] });

    claude.on('close', code => {
      if (code === 0) {
        resolve();
      } else {
        reject(
          new Error(
            'Claude CLI not found. Please install Claude Code and run `claude /login` to authenticate.'
          )
        );
      }
    });

    claude.on('error', () => {
      reject(
        new Error(
          'Claude CLI not found. Please install Claude Code and run `claude /login` to authenticate.'
        )
      );
    });
  });
}

/**
 * Calls Claude CLI in headless mode
 */
async function callClaude(prompt: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const args = [
      '-p',
      prompt,
      '--output-format',
      'text',
      '--model',
      'sonnet',
      '--max-turns',
      '1',
      '--permission-mode',
      'plan',
      '--append-system-prompt',
      'You are a component recommendation API. Respond ONLY with valid JSON. No explanations, no questions, no markdown. Just output the JSON object exactly as specified in the prompt.',
    ];

    const claude = spawn('claude', args, { stdio: ['ignore', 'pipe', 'pipe'] });
    let stdout = '';
    let stderr = '';

    claude.stdout.on('data', (data: Buffer) => {
      stdout += data.toString();
    });

    claude.stderr.on('data', (data: Buffer) => {
      stderr += data.toString();
    });

    claude.on('close', code => {
      if (code === 0) {
        resolve(stdout.trim());
      } else {
        reject(new Error(stderr || `Claude CLI exited with code ${code}`));
      }
    });

    claude.on('error', error => {
      reject(new Error(`Failed to execute Claude CLI: ${error.message}`));
    });
  });
}

/**
 * Generates a prompt for the AI model based on user requirements and available components
 * @param userRequirements User's project requirements
 * @param componentsData Available components
 * @returns Formatted prompt for the AI model
 */
function generatePrompt(
  userRequirements: UserRequirements,
  componentsData: ComponentsData
): string {
  const projectStructure = userRequirements.projectStructure ?? 'No project structure available';
  const projectDescription =
    userRequirements['project-description'] ?? 'No project description provided';

  return `You are an expert AI assistant that helps developers select the most appropriate Claude Code components for their projects.

User Requirements:
${JSON.stringify(userRequirements, null, 2)}

Project Description: ${projectDescription}

Project Structure Analysis:
${projectStructure}

Available Components:
- Agents: ${Object.keys(componentsData.agents).join(', ')}
- Commands: ${Object.keys(componentsData.commands).join(', ')}
- Hooks: ${Object.keys(componentsData.hooks).join(', ')}
- MCPs: ${Object.keys(componentsData.mcps).join(', ')}

Based on the user's requirements, recommend the most relevant components from each category.

YOU ARE A JSON API. OUTPUT ONLY JSON. NO QUESTIONS. NO EXPLANATIONS.

Return ONLY this JSON structure with real component names from the available lists:
{
  "agents": ["agent-name-1", "agent-name-2"],
  "commands": ["command-name-1", "command-name-2"], 
  "hooks": ["hook-name-1", "hook-name-2"],
  "mcps": ["mcp-name-1", "mcp-name-2"]
}

Important guidelines:
1. Only recommend components that actually exist in the provided lists
2. Analyze the project structure to understand the tech stack, frameworks, and architecture
3. Consider the natural language project description to understand the project's purpose and requirements
4. Prioritize components that are most relevant to the detected tech stack and project goals
5. Include a reasonable number of recommendations (3-8 per category)
6. If a category is not relevant to the user's project, you can return an empty array for that category
7. Pay special attention to package.json, requirements.txt, or other dependency files in the structure

RESPOND WITH ONLY THE JSON OBJECT - NO OTHER TEXT OR FORMATTING`;
}

/**
 * Recommends components based on user requirements using AI
 * @param userRequirements User's project requirements
 * @param componentsData Available components
 * @returns Recommended components
 */
export async function recommendComponents(
  userRequirements: UserRequirements,
  componentsData: ComponentsData
): Promise<Recommendation> {
  // Check if Claude CLI is available
  await checkClaudeAvailability();

  // Prepare the prompt
  const prompt = generatePrompt(userRequirements, componentsData);

  try {
    // Generate the recommendation using Claude CLI
    const response = await callClaude(prompt);

    // Parse and validate the response
    let recommendation: unknown;
    try {
      // With --output-format text, Claude should return just the text response
      let jsonText = response.trim();

      // Remove any markdown code blocks if present
      const jsonMatch = jsonText.match(/```(?:json)?\s*(\{[\s\S]*?\})\s*```/);
      if (jsonMatch) {
        jsonText = jsonMatch[1];
      }

      // Try to parse as JSON
      recommendation = JSON.parse(jsonText);
    } catch (error) {
      throw new Error(`Claude returned invalid JSON: ${response}`);
    }

    // Validate the response structure
    const validatedRecommendation = RecommendationSchema.parse(recommendation);

    // Filter out any non-existent components
    const filteredRecommendation: Recommendation = {
      agents: validatedRecommendation.agents.filter(name => componentsData.agents[name]),
      commands: validatedRecommendation.commands.filter(name => componentsData.commands[name]),
      hooks: validatedRecommendation.hooks.filter(name => componentsData.hooks[name]),
      mcps: validatedRecommendation.mcps.filter(name => componentsData.mcps[name]),
    };

    return filteredRecommendation;
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    if (errorMessage.includes('Claude CLI not found')) {
      throw new Error(
        'Claude CLI not found. Please install Claude Code and run `claude /login` to authenticate.'
      );
    }
    throw new Error(`Failed to get AI recommendations: ${errorMessage}`);
  }
}
