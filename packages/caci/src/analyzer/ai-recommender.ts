import { ChatOpenAI } from '@langchain/openai';
import { HumanMessage, SystemMessage } from '@langchain/core/messages';
import { z } from 'zod';
import type { ComponentsData, UserRequirements, Component } from './index';

// Define the schema for AI response
const RecommendationSchema = z.object({
  agents: z.array(z.string()),
  commands: z.array(z.string()),
  hooks: z.array(z.string()),
  mcps: z.array(z.string()),
});

type Recommendation = z.infer<typeof RecommendationSchema>;

/**
 * Initialize OpenRouter chat model
 */
function initializeOpenRouterModel(apiKey: string) {
  if (!apiKey) {
    throw new Error('OpenRouter API key is required');
  }

  return new ChatOpenAI({
    apiKey,
    model: 'anthropic/claude-3.5-sonnet',
    temperature: 0,
    maxTokens: 2000,
    configuration: {
      baseURL: 'https://openrouter.ai/api/v1',
    },
  });
}

/**
 * Calls OpenRouter using LangChain with structured output
 */
async function callAI(prompt: string, apiKey: string): Promise<string> {
  const model = initializeOpenRouterModel(apiKey);

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
      new HumanMessage(prompt),
    ]);

    return response.content as string;
  } catch (error) {
    throw new Error(
      `Failed to query OpenRouter: ${error instanceof Error ? error.message : String(error)}`
    );
  }
}

/**
 * Calculate core usage score for a component
 */
function getCoreUsageScore(name: string, _content: string, _description: string): number {
  let score = 30; // Conservative base score

  // Universal high-usage patterns
  if (name.includes('context7')) return 95;
  if (name.includes('business-analyst') || name.includes('task-decomposition')) return 85;

  // Core development tools
  if (name.includes('react') || name.includes('typescript') || name.includes('javascript'))
    score += 35;
  if (name.includes('frontend') || name.includes('backend') || name.includes('fullstack'))
    score += 30;
  if (name.includes('test') || name.includes('lint') || name.includes('format')) score += 25;
  if (name.includes('git') || name.includes('commit') || name.includes('build')) score += 25;

  return score;
}

/**
 * Apply framework-specific score adjustments
 */
function applyFrameworkAdjustments(name: string, baseScore: number): number {
  let score = baseScore;
  if (name.includes('next') || name.includes('vue') || name.includes('angular')) score += 20;
  if (name.includes('node') || name.includes('express') || name.includes('api')) score += 20;
  if (name.includes('docker') || name.includes('deploy') || name.includes('ci')) score += 15;
  return score;
}

/**
 * Apply MCP category adjustments
 */
function applyMcpAdjustments(name: string, baseScore: number): number {
  let score = Math.max(baseScore - 20, 20);
  if (name.includes('github') || name.includes('file') || name.includes('database')) score += 15;
  return score;
}

/**
 * Apply hooks category adjustments
 */
function applyHooksAdjustments(name: string, baseScore: number): number {
  let score = baseScore;
  if (name.includes('commit') || name.includes('push') || name.includes('save')) score += 20;
  if (name.includes('test') || name.includes('lint') || name.includes('format')) score += 15;
  return score;
}

/**
 * Calculate category-specific usage adjustments
 */
function getCategoryUsageAdjustments(name: string, category: string, baseScore: number): number {
  let score = applyFrameworkAdjustments(name, baseScore);

  if (category === 'mcps') {
    score = applyMcpAdjustments(name, score);
  } else if (category === 'hooks') {
    score = applyHooksAdjustments(name, score);
  }

  return Math.min(score, 100);
}

/**
 * Calculate realistic usage statistics based on component characteristics
 */
function calculateUsageStats(componentsData: ComponentsData) {
  const getUsageScore = (component: Component, category: string): number => {
    const content = component.content || '';
    const description = component.description || '';
    const name = component.name.toLowerCase();

    const coreScore = getCoreUsageScore(name, content, description);
    return getCategoryUsageAdjustments(name, category, coreScore);
  };

  const createUsageMap = (components: Record<string, Component>, category: string) => {
    const entries: [string, number][] = [];
    for (const [name, comp] of Object.entries(components)) {
      entries.push([name, getUsageScore(comp, category)]);
    }
    return Object.fromEntries(entries);
  };

  return {
    agents: createUsageMap(componentsData.agents, 'agents'),
    commands: createUsageMap(componentsData.commands, 'commands'),
    hooks: createUsageMap(componentsData.hooks, 'hooks'),
    mcps: createUsageMap(componentsData.mcps, 'mcps'),
  };
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

  // Calculate usage statistics
  const usageStats = calculateUsageStats(componentsData);

  // Create component lists with usage information
  const formatComponentList = (components: Record<string, Component>, usage: Record<string, number>) => {
    return Object.keys(components)
      .map(name => `${name} (avg usage: ${usage[name] || 50}%)`)
      .join(', ');
  };

  // Extract experience level and adjust recommendations accordingly
  const experienceLevel = userRequirements['experience-level'] as string || '';
  const isBeginnerLevel = experienceLevel.includes('Beginner');
  const isIntermediateLevel = experienceLevel.includes('Intermediate');
  const isAdvancedLevel = experienceLevel.includes('Advanced');

  let experienceGuidance = '';
  let componentCountGuidance = '';
  
  if (isBeginnerLevel) {
    experienceGuidance = `
CRITICAL: This is a BEGINNER user. Focus on:
- Easy-to-use, well-documented components with high usage scores (70%+)
- Components with clear, simple workflows
- Avoid complex or specialized tools
- Prioritize components that "just work" out of the box
- Include components with good error messages and helpful guides`;
    componentCountGuidance = '6-10 components per category (simpler setup)';
  } else if (isIntermediateLevel) {
    experienceGuidance = `
IMPORTANT: This is an INTERMEDIATE user. Focus on:
- Balance of ease-of-use and capability
- Include some advanced tools but ensure good documentation
- Mix high-usage components (60%+) with some specialized ones
- Components that can grow with their skills`;
    componentCountGuidance = '8-12 components per category (balanced setup)';
  } else if (isAdvancedLevel) {
    experienceGuidance = `
NOTE: This is an ADVANCED user. Focus on:
- Include powerful, specialized components even if complex
- Prioritize capability over ease-of-use
- Include cutting-edge tools and advanced workflows
- Mix proven high-usage components with innovative/specialized ones`;
    componentCountGuidance = '10-15 components per category (comprehensive setup)';
  }

  return `You are an expert AI assistant that helps developers select the most appropriate Claude Code components for their projects.

User Requirements:
${JSON.stringify(userRequirements, null, 2)}

Project Description: ${projectDescription}

Project Structure Analysis:
${projectStructure}

Available Components with Usage Statistics:
- Agents: ${formatComponentList(componentsData.agents, usageStats.agents)}
- Commands: ${formatComponentList(componentsData.commands, usageStats.commands)}
- Hooks: ${formatComponentList(componentsData.hooks, usageStats.hooks)}
- MCPs: ${formatComponentList(componentsData.mcps, usageStats.mcps)}

${experienceGuidance}

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
  "agents": ["list-appropriate-for-experience-level"],
  "commands": ["list-appropriate-for-experience-level"], 
  "hooks": ["list-appropriate-for-experience-level"],
  "mcps": ["list-appropriate-for-experience-level"]
}

CRITICAL REQUIREMENTS:
1. All component names must exist in the provided lists above
2. ${componentCountGuidance}
3. USE USAGE STATISTICS as guidance and MATCH TO EXPERIENCE LEVEL:
   - Beginners: Prioritize 70%+ usage components, avoid <50% usage
   - Intermediate: Focus on 60%+ usage, include some specialized tools
   - Advanced: Mix high-usage with cutting-edge/specialized components
4. Mix technical AND non-technical roles (include business analysts, project managers)
5. Consider the ENTIRE team and project needs, not just immediate coding
6. Balance popular components with project-specific specialized ones
7. Include project management, documentation, testing, deployment, monitoring tools
8. Analyze project structure to understand tech stack and customize accordingly
9. Build a COHESIVE environment that supports the full development lifecycle
10. EXPERIENCE LEVEL IS THE PRIMARY FILTER - match complexity to user capability

RESPOND WITH ONLY THE JSON OBJECT`;
}

/**
 * Provides default component recommendations when no API key is available
 */
function getDefaultRecommendations(componentsData: ComponentsData, userRequirements?: UserRequirements): Recommendation {
  const experienceLevel = userRequirements?.['experience-level'] as string || '';
  const isBeginnerLevel = experienceLevel.includes('Beginner');
  const isIntermediateLevel = experienceLevel.includes('Intermediate');
  
  // Adjust count based on experience level
  let agentCount = 10, commandCount = 10, hookCount = 8, mcpCount = 8;
  
  if (isBeginnerLevel) {
    agentCount = 6; commandCount = 6; hookCount = 4; mcpCount = 4;
  } else if (isIntermediateLevel) {
    agentCount = 8; commandCount = 8; hookCount = 6; mcpCount = 6;
  }

  const getTopComponents = (components: Record<string, Component>, count: number) => {
    // For beginners, prioritize high-usage components
    if (isBeginnerLevel) {
      const essentialComponents = Object.keys(components).filter(name => {
        const usage = getCoreUsageScore(name, components[name].content, components[name].description);
        return usage >= 70; // High usage only
      }).slice(0, count);
      
      // If not enough high-usage components, fill with the most popular ones
      if (essentialComponents.length < count) {
        const remaining = Object.keys(components).slice(0, count - essentialComponents.length);
        return [...essentialComponents, ...remaining.filter(c => !essentialComponents.includes(c))];
      }
      return essentialComponents;
    }
    
    return Object.keys(components).slice(0, count);
  };

  return {
    agents: getTopComponents(componentsData.agents, agentCount),
    commands: getTopComponents(componentsData.commands, commandCount),
    hooks: getTopComponents(componentsData.hooks, hookCount),
    mcps: getTopComponents(componentsData.mcps, mcpCount),
  };
}

/**
 * Parse AI response and handle markdown code blocks
 */
function parseAIResponse(response: string): unknown {
  let jsonText = response.trim();
  
  // Remove any markdown code blocks if present
  const jsonMatch = jsonText.match(/```(?:json)?\s*(\{[\s\S]*?\})\s*```/);
  if (jsonMatch) {
    jsonText = jsonMatch[1];
  }
  
  try {
    return JSON.parse(jsonText);
  } catch (error) {
    throw new Error(`AI provider returned invalid JSON: ${response}`);
  }
}

/**
 * Filter out non-existent components from recommendations
 */
function filterValidComponents(recommendation: Recommendation, componentsData: ComponentsData): Recommendation {
  return {
    agents: recommendation.agents.filter(name => componentsData.agents[name]),
    commands: recommendation.commands.filter(name => componentsData.commands[name]),
    hooks: recommendation.hooks.filter(name => componentsData.hooks[name]),
    mcps: recommendation.mcps.filter(name => componentsData.mcps[name]),
  };
}

/**
 * Merge default components with AI recommendations
 */
function mergeWithDefaults(recommendation: Recommendation, componentsData: ComponentsData): Recommendation {
  const defaults = {
    mcps: ['context7'],
    agents: ['business-analyst', 'task-decomposition-expert'],
    commands: ['setup-linting', 'optimize-build'],
    hooks: [],
  };

  return {
    agents: [...new Set([...recommendation.agents, ...defaults.agents.filter(name => componentsData.agents[name])])],
    commands: [...new Set([...recommendation.commands, ...defaults.commands.filter(name => componentsData.commands[name])])],
    hooks: [...new Set([...recommendation.hooks, ...defaults.hooks.filter(name => componentsData.hooks[name])])],
    mcps: [...new Set([...recommendation.mcps, ...defaults.mcps.filter(name => componentsData.mcps[name])])],
  };
}

/**
 * Recommends components based on user requirements using AI
 */
export async function recommendComponents(
  userRequirements: UserRequirements,
  componentsData: ComponentsData,
  apiKey?: string
): Promise<Recommendation> {
  if (!apiKey) {
    return getDefaultRecommendations(componentsData, userRequirements);
  }

  const prompt = generatePrompt(userRequirements, componentsData);

  try {
    const response = await callAI(prompt, apiKey);
    const parsedRecommendation = parseAIResponse(response);
    const validatedRecommendation = RecommendationSchema.parse(parsedRecommendation);
    const filteredRecommendation = filterValidComponents(validatedRecommendation, componentsData);
    
    return mergeWithDefaults(filteredRecommendation, componentsData);
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    if (errorMessage.includes('No API key found')) {
      throw new Error('OpenRouter API key required. Please use OAuth authentication or provide an OpenRouter API key.');
    }
    throw new Error(`Failed to get AI recommendations: ${errorMessage}`);
  }
}
