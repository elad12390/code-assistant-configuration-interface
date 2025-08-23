import { ChatAnthropic } from '@langchain/anthropic';
import { ChatGoogleGenerativeAI } from '@langchain/google-genai';
import { ChatOpenAI } from '@langchain/openai';
import { HumanMessage, SystemMessage } from '@langchain/core/messages';
import { z } from 'zod';
import type { ComponentsData, UserRequirements } from './index';

// Define available AI providers
type AIProvider = 'anthropic' | 'gemini' | 'openai';

// Environment variable mapping for each provider
const ENV_VARS = {
  anthropic: 'ANTHROPIC_API_KEY',
  gemini: 'GOOGLE_API_KEY', 
  openai: 'OPENAI_API_KEY'
} as const;

// Define the schema for AI response
const RecommendationSchema = z.object({
  agents: z.array(z.string()),
  commands: z.array(z.string()),
  hooks: z.array(z.string()),
  mcps: z.array(z.string()),
});

type Recommendation = z.infer<typeof RecommendationSchema>;

/**
 * Detect which AI provider to use based on available API keys
 */
function detectAvailableProvider(): AIProvider {
  // Check in order of preference: Anthropic > Gemini > OpenAI
  if (process.env.ANTHROPIC_API_KEY) {
    return 'anthropic';
  }
  if (process.env.GOOGLE_API_KEY) {
    return 'gemini';
  }
  if (process.env.OPENAI_API_KEY) {
    return 'openai';
  }
  
  throw new Error(`No API key found. Please set one of: ANTHROPIC_API_KEY, GOOGLE_API_KEY, or OPENAI_API_KEY`);
}

/**
 * Initialize the appropriate chat model based on provider
 */
function initializeChatModel(provider: AIProvider) {
  const apiKey = process.env[ENV_VARS[provider]];
  
  if (!apiKey) {
    throw new Error(`${ENV_VARS[provider]} environment variable is not set.`);
  }

  switch (provider) {
    case 'anthropic':
      return new ChatAnthropic({
        apiKey,
        model: 'claude-3-5-sonnet-20241022',
        temperature: 0,
        maxTokens: 2000,
      });
    case 'gemini':
      return new ChatGoogleGenerativeAI({
        apiKey,
        model: 'gemini-1.5-pro',
        temperature: 0,
        maxOutputTokens: 2000,
      });
    case 'openai':
      return new ChatOpenAI({
        apiKey,
        model: 'gpt-4o',
        temperature: 0,
        maxTokens: 2000,
      });
    default:
      throw new Error(`Unsupported provider: ${provider}`);
  }
}

/**
 * Calls AI provider using LangChain with structured output
 */
async function callAI(prompt: string): Promise<string> {
  const provider = detectAvailableProvider();
  const model = initializeChatModel(provider);
  
  try {
    const systemPrompt = `You are a component recommendation API. You must respond with ONLY a valid JSON object matching this exact schema:

{
  "agents": ["array", "of", "component", "names"],
  "commands": ["array", "of", "component", "names"],
  "hooks": ["array", "of", "component", "names"],
  "mcps": ["array", "of", "component", "names"]
}

Rules:
- Output ONLY the JSON object
- No explanations, no markdown, no additional text
- All component names must exist in the provided lists
- Include 3-8 components per category
- Use empty arrays [] if no relevant components exist for a category`;

    const response = await model.invoke([
      new SystemMessage(systemPrompt),
      new HumanMessage(prompt)
    ]);

    return response.content as string;
  } catch (error) {
    throw new Error(`Failed to query ${provider}: ${error instanceof Error ? error.message : String(error)}`);
  }
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
  // Prepare the prompt
  const prompt = generatePrompt(userRequirements, componentsData);

  try {
    // Generate the recommendation using available AI provider
    const response = await callAI(prompt);

    // Parse and validate the response
    let recommendation: unknown;
    try {
      // LangChain providers may return JSON in markdown blocks
      let jsonText = response.trim();

      // Remove any markdown code blocks if present
      const jsonMatch = jsonText.match(/```(?:json)?\s*(\{[\s\S]*?\})\s*```/);
      if (jsonMatch) {
        jsonText = jsonMatch[1];
      }

      // Try to parse as JSON
      recommendation = JSON.parse(jsonText);
    } catch (error) {
      throw new Error(`AI provider returned invalid JSON: ${response}`);
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
    if (errorMessage.includes('No API key found')) {
      throw new Error(
        'No AI provider API key found. Please set one of: ANTHROPIC_API_KEY, GOOGLE_API_KEY, or OPENAI_API_KEY'
      );
    }
    throw new Error(`Failed to get AI recommendations: ${errorMessage}`);
  }
}
