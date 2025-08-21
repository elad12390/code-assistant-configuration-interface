import { ChatGoogleGenerativeAI } from '@langchain/google-genai';
import { HumanMessage } from '@langchain/core/messages';
import { z } from 'zod';
import { ComponentsData, Component, UserRequirements } from './index';

// Define the schema for AI response
const RecommendationSchema = z.object({
  agents: z.array(z.string()),
  commands: z.array(z.string()),
  hooks: z.array(z.string()),
  mcps: z.array(z.string())
});

type Recommendation = z.infer<typeof RecommendationSchema>;

// Initialize the Google Generative AI client
let model: ChatGoogleGenerativeAI | null = null;

function initializeAI() {
  const apiKey = process.env.GOOGLE_API_KEY;
  if (!apiKey) {
    throw new Error('GOOGLE_API_KEY environment variable is not set. Please set it to use AI-powered recommendations.');
  }
  
  model = new ChatGoogleGenerativeAI({
    model: 'gemini-2.5-pro',
    apiKey: apiKey
  });
}

/**
 * Generates a prompt for the AI model based on user requirements and available components
 * @param userRequirements User's project requirements
 * @param componentsData Available components
 * @returns Formatted prompt for the AI model
 */
function generatePrompt(userRequirements: UserRequirements, componentsData: ComponentsData): string {
  return `You are an expert AI assistant that helps developers select the most appropriate components for their projects.

User Requirements:
${JSON.stringify(userRequirements, null, 2)}

Available Components:
- Agents: ${Object.keys(componentsData.agents).join(', ')}
- Commands: ${Object.keys(componentsData.commands).join(', ')}
- Hooks: ${Object.keys(componentsData.hooks).join(', ')}
- MCPs: ${Object.keys(componentsData.mcps).join(', ')}

Based on the user's requirements, please recommend the most relevant components from each category.
Return your response as a JSON object with the following structure:
{
  "agents": ["agent-name-1", "agent-name-2", ...],
  "commands": ["command-name-1", "command-name-2", ...],
  "hooks": ["hook-name-1", "hook-name-2", ...],
  "mcps": ["mcp-name-1", "mcp-name-2", ...]
}

Important guidelines:
1. Only recommend components that actually exist in the provided lists
2. Prioritize components that are most relevant to the user's project type and requirements
3. Include a reasonable number of recommendations (3-8 per category)
4. If a category is not relevant to the user's project, you can return an empty array for that category
5. Do not include any explanations or markdown formatting, just the JSON object`;
}

/**
 * Recommends components based on user requirements using AI
 * @param userRequirements User's project requirements
 * @param componentsData Available components
 * @returns Recommended components
 */
export async function recommendComponents(userRequirements: UserRequirements, componentsData: ComponentsData): Promise<Recommendation> {
  // Initialize AI client if not already done
  if (!model) {
    initializeAI();
  }
  
  // Prepare the prompt
  const prompt = generatePrompt(userRequirements, componentsData);
  
  try {
    // Generate the recommendation
    const response = await model!.invoke([
      new HumanMessage(prompt)
    ]);
    
    // Parse and validate the response
    let recommendation: any;
    try {
      // Extract content from the response
      const content = typeof response.content === 'string' ? response.content : JSON.stringify(response.content);
      recommendation = JSON.parse(content);
    } catch (error) {
      throw new Error(`AI returned invalid JSON: ${response.content}`);
    }
    
    // Validate the response structure
    const validatedRecommendation = RecommendationSchema.parse(recommendation);
    
    // Filter out any non-existent components
    const filteredRecommendation: Recommendation = {
      agents: validatedRecommendation.agents.filter(name => componentsData.agents[name]),
      commands: validatedRecommendation.commands.filter(name => componentsData.commands[name]),
      hooks: validatedRecommendation.hooks.filter(name => componentsData.hooks[name]),
      mcps: validatedRecommendation.mcps.filter(name => componentsData.mcps[name])
    };
    
    return filteredRecommendation;
  } catch (error: any) {
    if (error.message?.includes('API_KEY')) {
      throw new Error('Invalid GOOGLE_API_KEY. Please check your API key and try again.');
    }
    throw new Error(`Failed to get AI recommendations: ${error.message}`);
  }
}