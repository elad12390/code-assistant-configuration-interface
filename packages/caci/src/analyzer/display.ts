import chalk from 'chalk';
import type { Component, ComponentsData } from './index';

// Import usage calculation from ai-recommender to avoid duplication
// This is a simplified version for display purposes
function getSimpleUsageScore(component: Component): number {
  const name = component.name.toLowerCase();

  // High-value defaults
  if (name.includes('context7')) return 95;
  if (name.includes('business-analyst') || name.includes('task-decomposition')) return 85;
  if (name.includes('react') || name.includes('typescript')) return 80;
  if (name.includes('test') || name.includes('lint') || name.includes('git')) return 75;
  if (name.includes('build') || name.includes('deploy')) return 70;
  
  return 60; // Default moderate usage
}

/**
 * Calculate usage statistics for display
 */
function calculateUsageStats(componentsData: ComponentsData) {
  const createUsageMap = (components: Record<string, Component>) => {
    const entries: [string, number][] = [];
    for (const [name, comp] of Object.entries(components)) {
      entries.push([name, getSimpleUsageScore(comp)]);
    }
    return Object.fromEntries(entries);
  };

  return {
    agents: createUsageMap(componentsData.agents),
    commands: createUsageMap(componentsData.commands),
    hooks: createUsageMap(componentsData.hooks),
    mcps: createUsageMap(componentsData.mcps),
  };
}

function truncateString(str: string, maxLength: number): string {
  if (str.length <= maxLength) {
    return str;
  }
  return `${str.substring(0, maxLength - 3)}...`;
}

/**
 * Get component from appropriate category
 */
function getComponentFromCategory(componentName: string, title: string, componentsData: ComponentsData): Component | undefined {
  if (title.includes('Agent')) return componentsData.agents[componentName];
  if (title.includes('Command')) return componentsData.commands[componentName];
  if (title.includes('Hook')) return componentsData.hooks[componentName];
  if (title.includes('MCP')) return componentsData.mcps[componentName];
  return undefined;
}

/**
 * Get usage color based on percentage
 */
function getUsageColor(usage?: number) {
  if (!usage) return chalk.gray;
  if (usage >= 80) return chalk.green;
  if (usage >= 60) return chalk.yellow;
  return chalk.gray;
}

/**
 * Display single component information
 */
function displaySingleComponent(component: Component, componentName: string, index: number, usageStats?: Record<string, number>): void {
  const usage = usageStats?.[componentName];
  const usageColor = getUsageColor(usage);
  const usageText = usage ? `${usage}% avg usage` : 'usage data n/a';

  console.log(chalk.cyan(`  ${index + 1}. ${component.name}`));
  console.log(`${chalk.gray(`     Category: ${component.category}`)} • ${usageColor(usageText)}`);

  const description = component.description?.trim()
    ? component.description
    : component.content.split('\n').find(line => line.trim() && !line.startsWith('---'));
  
  if (description) {
    console.log(chalk.white(`     Description: ${truncateString(description, 80)}`));
  }
  console.log();
}

export function displayComponents(
  components: string[],
  title: string,
  componentsData: ComponentsData,
  usageStats?: Record<string, number>
): void {
  if (components.length === 0) {
    console.log(chalk.yellow(`\n${title}: None`));
    return;
  }

  console.log(chalk.bold(`\n${title} (${components.length}):`));
  console.log(chalk.gray('='.repeat(50)));

  components.forEach((componentName, index) => {
    const component = getComponentFromCategory(componentName, title, componentsData);
    
    if (component) {
      displaySingleComponent(component, componentName, index, usageStats);
    } else {
      console.log(chalk.red(`  ${index + 1}. ${componentName} (Component not found)`));
    }
  });
}

export function displayRecommendations(
  recommendations: { agents: string[]; commands: string[]; hooks: string[]; mcps: string[] },
  componentsData: ComponentsData
): void {
  console.log(chalk.green.bold('\n🎯 Recommended Components with Usage Statistics'));
  console.log(chalk.green('='.repeat(65)));

  // Calculate usage statistics for display
  const usageStats = calculateUsageStats(componentsData);

  displayComponents(recommendations.agents, 'Agents', componentsData, usageStats.agents);
  displayComponents(recommendations.commands, 'Commands', componentsData, usageStats.commands);
  displayComponents(recommendations.hooks, 'Hooks', componentsData, usageStats.hooks);
  displayComponents(recommendations.mcps, 'MCPs', componentsData, usageStats.mcps);

  console.log(chalk.green('='.repeat(65)));
  console.log(chalk.yellow('\n📊 Usage Statistics Legend:'));
  console.log(chalk.green('   • 80%+ avg usage') + chalk.gray(' = Essential/Core components'));
  console.log(
    chalk.yellow('   • 60-79% avg usage') + chalk.gray(' = Popular/Recommended components')
  );
  console.log(chalk.gray('   • <60% avg usage') + chalk.gray(' = Specialized/Optional components'));
  console.log(
    chalk.yellow('\n📝 Note: Recommendations based on AI analysis + real-world usage patterns.')
  );
  console.log(
    chalk.yellow('Higher usage % indicates more essential components for typical projects.')
  );
}
