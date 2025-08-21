import * as path from 'path';
import { collectUserRequirements } from '../analyzer/requirementCollector';
import { parseComponentsFile } from '../analyzer/parser';
import { recommendComponents } from '../analyzer/ai-recommender';
import { applyConfiguration, backupClaudeFolder, claudeFolderExists } from '../manager';
import { saveIteration } from '../tracker';
import { ComponentsData, SelectedComponents, UserRequirements } from '../analyzer';

export interface WorkflowResult {
  success: boolean;
  message?: string;
  error?: string;
  iterationId?: string;
}

/**
 * Runs the complete configuration workflow from start to finish
 * @param projectDir The project directory path
 * @returns Workflow result with success status and any messages
 */
export async function runConfigurationWorkflow(projectDir: string): Promise<WorkflowResult> {
  try {
    console.log('🚀 Starting CACI Configuration Workflow...');
    
    // Step 1: Parse components.json file
    console.log('🔍 Parsing components.json file...');
    const componentsFilePath = path.join(projectDir, 'components.json');
    let componentsData: ComponentsData;
    
    try {
      componentsData = parseComponentsFile(componentsFilePath);
      console.log(`✅ Successfully parsed ${Object.keys(componentsData.agents).length} agents, ${Object.keys(componentsData.commands).length} commands, ${Object.keys(componentsData.hooks).length} hooks, and ${Object.keys(componentsData.mcps).length} MCPs`);
    } catch (error) {
      return {
        success: false,
        error: `Failed to parse components.json: ${error instanceof Error ? error.message : String(error)}`
      };
    }
    
    // Step 2: Collect user requirements
    console.log('📝 Collecting user requirements...');
    let userRequirements: UserRequirements;
    
    try {
      userRequirements = await collectUserRequirements();
      console.log('✅ Successfully collected user requirements');
    } catch (error) {
      return {
        success: false,
        error: `Failed to collect user requirements: ${error instanceof Error ? error.message : String(error)}`
      };
    }
    
    // Step 3: Use AI to recommend components
    console.log('🤖 Using AI to recommend components...');
    
    // Check if API key is set
    if (!process.env.GOOGLE_API_KEY) {
      return {
        success: false,
        error: 'GOOGLE_API_KEY environment variable is not set. Please set it to use AI-powered recommendations.'
      };
    }
    
    let selectedComponents: SelectedComponents;
    
    try {
      selectedComponents = await recommendComponents(userRequirements, componentsData);
      console.log('✅ Successfully generated AI recommendations');
    } catch (error) {
      return {
        success: false,
        error: `Failed to generate AI recommendations: ${error instanceof Error ? error.message : String(error)}`
      };
    }
    
    // Step 4: Backup existing .claude folder if it exists
    console.log('💾 Checking for existing .claude folder...');
    
    try {
      const claudeExists = await claudeFolderExists(projectDir);
      if (claudeExists) {
        console.log('📦 Creating backup of existing .claude folder...');
        const backupInfo = await backupClaudeFolder(projectDir);
        console.log(`✅ Successfully backed up .claude folder to ${backupInfo.backupPath}`);
      } else {
        console.log('ℹ️  No existing .claude folder found');
      }
    } catch (error) {
      return {
        success: false,
        error: `Failed to backup .claude folder: ${error instanceof Error ? error.message : String(error)}`
      };
    }
    
    // Step 5: Apply configuration
    console.log('⚙️  Applying configuration...');
    
    try {
      await applyConfiguration(projectDir, selectedComponents, componentsData);
      console.log('✅ Successfully applied configuration');
    } catch (error) {
      return {
        success: false,
        error: `Failed to apply configuration: ${error instanceof Error ? error.message : String(error)}`
      };
    }
    
    // Step 6: Save iteration history
    console.log('🕒 Saving iteration history...');
    
    try {
      const iterationId = await saveIteration(projectDir, selectedComponents, userRequirements);
      console.log(`✅ Successfully saved iteration ${iterationId}`);
      
      return {
        success: true,
        message: 'CACI configuration workflow completed successfully!',
        iterationId
      };
    } catch (error) {
      return {
        success: false,
        error: `Failed to save iteration history: ${error instanceof Error ? error.message : String(error)}`
      };
    }
  } catch (error) {
    return {
      success: false,
      error: `Unexpected error during configuration workflow: ${error instanceof Error ? error.message : String(error)}`
    };
  }
}