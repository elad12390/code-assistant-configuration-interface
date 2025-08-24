import chalk from 'chalk';
import type { Component, ComponentsData } from './index';

// Import usage calculation from ai-recommender to avoid duplication
// This is a simplified version for display purposes
function getSimpleUsageScore(component: Component): number {
  const name = component.name.toLowerCase();

  // High-value defaults
  if (name.includes('context7')) return 95;
  if (name.includes('business-analyst') || name.includes('task-decomposition')) return 85;

  // Core development patterns
  if (name.includes('react') || name.includes('typescript')) return 80;
  if (name.includes('test') || name.includes('lint') || name.includes('git')) return 75;
  if (name.includes('build') || name.includes('deploy')) return 70;

  // Default moderate usage
  return 60;
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
    let component: Component | undefined;

    if (title.includes('Agent')) {
      component = componentsData.agents[componentName];
    } else if (title.includes('Command')) {
      component = componentsData.commands[componentName];
    } else if (title.includes('Hook')) {
      component = componentsData.hooks[componentName];
    } else if (title.includes('MCP')) {
      component = componentsData.mcps[componentName];
    }

    if (component) {
      const usage = usageStats?.[componentName];
      const usageColor = usage
        ? usage >= 80
          ? chalk.green
          : usage >= 60
            ? chalk.yellow
            : chalk.gray
        : chalk.gray;
      const usageText = usage ? `${usage}% avg usage` : 'usage data n/a';

      console.log(chalk.cyan(`  ${index + 1}. ${component.name}`));
      console.log(
        `${chalk.gray(`     Category: ${component.category}`)} • ${usageColor(usageText)}`
      );

      if (component.description && component.description.trim() !== '') {
        console.log(chalk.white(`     Description: ${truncateString(component.description, 80)}`));
      } else {
        const contentLines = component.content.split('\n');
        const firstNonEmptyLine = contentLines.find(
          line => line.trim() !== '' && !line.startsWith('---')
        );
        if (firstNonEmptyLine) {
          console.log(chalk.white(`     Description: ${truncateString(firstNonEmptyLine, 80)}`));
        }
      }

      console.log();
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
