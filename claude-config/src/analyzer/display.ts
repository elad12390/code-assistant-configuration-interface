import chalk from 'chalk';
import { Component, ComponentsData } from './index';

function truncateString(str: string, maxLength: number): string {
  if (str.length <= maxLength) {
    return str;
  }
  return str.substring(0, maxLength - 3) + '...';
}

export function displayComponents(components: string[], title: string, componentsData: ComponentsData): void {
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
      console.log(chalk.cyan(`  ${index + 1}. ${component.name}`));
      console.log(chalk.gray(`     Category: ${component.category}`));
      
      if (component.description && component.description.trim() !== '') {
        console.log(chalk.white(`     Description: ${truncateString(component.description, 80)}`));
      } else {
        const contentLines = component.content.split('\n');
        const firstNonEmptyLine = contentLines.find(line => line.trim() !== '' && !line.startsWith('---'));
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
  console.log(chalk.green.bold('\n🎯 Recommended Components'));
  console.log(chalk.green('='.repeat(50)));
  
  displayComponents(recommendations.agents, 'Agents', componentsData);
  displayComponents(recommendations.commands, 'Commands', componentsData);
  displayComponents(recommendations.hooks, 'Hooks', componentsData);
  displayComponents(recommendations.mcps, 'MCPs', componentsData);
  
  console.log(chalk.green('='.repeat(50)));
  console.log(chalk.yellow('\n📝 Note: These recommendations are based on AI analysis of your project requirements.'));
  console.log(chalk.yellow('You can modify these selections before applying the configuration.'));
}