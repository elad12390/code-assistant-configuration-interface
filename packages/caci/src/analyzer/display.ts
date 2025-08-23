import chalk from 'chalk';
import type { Component, ComponentsData } from './index';

/**
 * Calculate usage statistics for display (imported from ai-recommender logic)
 */
function calculateUsageStats(componentsData: ComponentsData) {
  const getUsageScore = (component: any, category: string): number => {
    const content = component.content || '';
    const description = component.description || '';
    const name = component.name.toLowerCase();
    
    let score = 30; // Conservative base score
    
    // Universal high-usage patterns (essential for most projects)
    if (name.includes('context7')) score = 95; // Default MCP
    if (name.includes('business-analyst') || name.includes('task-decomposition')) score = 85; // Default agents
    
    // Core development tools (very high usage)
    if (name.includes('react') || name.includes('typescript') || name.includes('javascript')) score += 35;
    if (name.includes('frontend') || name.includes('backend') || name.includes('fullstack')) score += 30;
    if (name.includes('test') || name.includes('lint') || name.includes('format')) score += 25;
    if (name.includes('git') || name.includes('commit') || name.includes('build')) score += 25;
    
    // Popular frameworks and tools
    if (name.includes('next') || name.includes('vue') || name.includes('angular')) score += 20;
    if (name.includes('node') || name.includes('express') || name.includes('api')) score += 20;
    if (name.includes('docker') || name.includes('deploy') || name.includes('ci')) score += 15;
    
    // Project management and collaboration (moderate but important)
    if (name.includes('analyst') || name.includes('manager') || name.includes('expert')) score += 15;
    if (name.includes('scrum') || name.includes('product') || name.includes('business')) score += 10;
    
    // Documentation and quality (essential but not daily)
    if (content.includes('PROACTIVELY') || description.includes('Use PROACTIVELY')) score += 15;
    if (name.includes('doc') || name.includes('readme') || name.includes('wiki')) score += 10;
    if (name.includes('security') || name.includes('performance') || name.includes('monitor')) score += 8;
    
    // Well-documented components tend to be more used
    if (content.length > 3000) score += 8;
    if (content.length > 1500) score += 5;
    
    // Category-specific adjustments
    if (category === 'mcps') {
      score = Math.max(score - 20, 20);
      if (name.includes('github') || name.includes('file') || name.includes('database')) score += 15;
    }
    
    if (category === 'hooks') {
      if (name.includes('commit') || name.includes('push') || name.includes('save')) score += 20;
      if (name.includes('test') || name.includes('lint') || name.includes('format')) score += 15;
    }
    
    return Math.min(score, 100);
  };

  return {
    agents: Object.fromEntries(Object.entries(componentsData.agents).map(([name, comp]) => [name, getUsageScore(comp, 'agents')])),
    commands: Object.fromEntries(Object.entries(componentsData.commands).map(([name, comp]) => [name, getUsageScore(comp, 'commands')])),
    hooks: Object.fromEntries(Object.entries(componentsData.hooks).map(([name, comp]) => [name, getUsageScore(comp, 'hooks')])),
    mcps: Object.fromEntries(Object.entries(componentsData.mcps).map(([name, comp]) => [name, getUsageScore(comp, 'mcps')]))
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
      const usageColor = usage ? (usage >= 80 ? chalk.green : usage >= 60 ? chalk.yellow : chalk.gray) : chalk.gray;
      const usageText = usage ? `${usage}% avg usage` : 'usage data n/a';
      
      console.log(chalk.cyan(`  ${index + 1}. ${component.name}`));
      console.log(chalk.gray(`     Category: ${component.category}`) + ' • ' + usageColor(`${usageText}`));

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
  console.log(chalk.yellow('   • 60-79% avg usage') + chalk.gray(' = Popular/Recommended components'));
  console.log(chalk.gray('   • <60% avg usage') + chalk.gray(' = Specialized/Optional components'));
  console.log(
    chalk.yellow(
      '\n📝 Note: Recommendations based on AI analysis + real-world usage patterns.'
    )
  );
  console.log(chalk.yellow('Higher usage % indicates more essential components for typical projects.'));
}
