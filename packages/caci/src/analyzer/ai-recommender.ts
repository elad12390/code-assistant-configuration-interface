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

CRITICAL RULES:
- Output ONLY the JSON object, no explanations or markdown
- All component names must exist in the provided lists
- Think HOLISTICALLY about the entire project lifecycle and team needs
- Include 8-15 components per category for comprehensive coverage
- Consider technical AND non-technical needs (PMs, POs, analysts, etc.)
- Include both development tools AND project management components
- Think about what a COMPLETE professional development setup needs
- Default recommendations should cover: coding, testing, deployment, project management, documentation, code quality
- Select components that work together as a cohesive development environment`;


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

ANALYZE the project requirements and recommend a COMPREHENSIVE development environment setup.

YOU ARE A JSON API. OUTPUT ONLY JSON. NO QUESTIONS. NO EXPLANATIONS.

Think about the COMPLETE project lifecycle and recommend components for:
- Technical development (developers, architects, specialists)
- Project management (PMs, POs, scrum masters, analysts)  
- Code quality (linting, testing, formatting, security)
- Development workflow (building, deploying, monitoring)
- Documentation and collaboration tools
- Database and API integrations

Return ONLY this JSON structure with real component names from the available lists:
{
  "agents": ["comprehensive-list-of-8-to-15-agents"],
  "commands": ["comprehensive-list-of-8-to-15-commands"], 
  "hooks": ["comprehensive-list-of-8-to-15-hooks"],
  "mcps": ["comprehensive-list-of-8-to-15-mcps"]
}

CRITICAL REQUIREMENTS:
1. All component names must exist in the provided lists above
2. Include 8-15 components per category for a COMPLETE professional setup
3. Mix technical AND non-technical roles (include PM, PO, QA, analyst agents)
4. Consider the ENTIRE team and project needs, not just immediate coding
5. Include project management, documentation, testing, deployment, monitoring tools
6. Analyze project structure to understand tech stack and customize accordingly
7. Build a COHESIVE environment that supports the full development lifecycle

RESPOND WITH ONLY THE JSON OBJECT`;
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

    // Add essential defaults for all projects
    const defaults = {
      mcps: ['context7'], // Essential for documentation lookup
      agents: ['business-analyst', 'task-decomposition-expert'], // Project management roles always useful
      commands: ['setup-linting', 'optimize-build'], // Basic development commands
      hooks: [] // Will be determined by AI based on project needs
    };

    // Merge defaults with AI recommendations (avoid duplicates)
    const finalRecommendation: Recommendation = {
      agents: [...new Set([...filteredRecommendation.agents, ...defaults.agents.filter(name => componentsData.agents[name])])],
      commands: [...new Set([...filteredRecommendation.commands, ...defaults.commands.filter(name => componentsData.commands[name])])],
      hooks: [...new Set([...filteredRecommendation.hooks, ...defaults.hooks.filter(name => componentsData.hooks[name])])],
      mcps: [...new Set([...filteredRecommendation.mcps, ...defaults.mcps.filter(name => componentsData.mcps[name])])],
    };

    return finalRecommendation;
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
