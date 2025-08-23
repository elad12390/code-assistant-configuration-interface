import inquirer from 'inquirer';
import { spawn } from 'child_process';
import { PROJECT_REQUIREMENTS_QUESTIONS } from './questions';

export interface UserResponse {
  [key: string]: unknown;
  projectStructure?: string;
}

/**
 * Fallback function when tree command is not available
 */
function tryFindFallback(projectDir: string, resolve: (value: string) => void): void {
  const ls = spawn(
    'find',
    [
      projectDir,
      '-maxdepth',
      '2',
      '-type',
      'f',
      '-not',
      '-path',
      '*/node_modules/*',
      '-not',
      '-path',
      '*/.git/*',
    ],
    { stdio: ['ignore', 'pipe', 'pipe'] }
  );
  let lsOutput = '';

  ls.stdout.on('data', (data: Buffer) => {
    lsOutput += data.toString();
  });

  ls.on('close', () => {
    resolve(lsOutput || 'Unable to analyze project structure');
  });

  ls.on('error', () => {
    resolve('Unable to analyze project structure');
  });
}

/**
 * Generates project structure using tree command, excluding common dependency folders
 */
async function generateProjectStructure(projectDir: string): Promise<string> {
  return new Promise(resolve => {
    const excludePatterns = [
      'node_modules',
      '.git',
      'dist',
      'build',
      '.next',
      'target',
      '__pycache__',
      '.venv',
      'venv',
      'env',
      '.env',
      'vendor',
      'coverage',
      '.nyc_output',
    ];

    const args = [
      projectDir,
      '-I',
      excludePatterns.join('|'),
      '-L',
      '3', // Limit depth to 3 levels
      '--dirsfirst',
      '-a',
    ];

    const tree = spawn('tree', args, { stdio: ['ignore', 'pipe', 'pipe'] });
    let output = '';
    let hasTree = true;

    tree.stdout.on('data', (data: Buffer) => {
      output += data.toString();
    });

    tree.on('error', () => {
      hasTree = false;
    });

    tree.on('close', code => {
      if (!hasTree || code !== 0) {
        tryFindFallback(projectDir, resolve);
      } else {
        resolve(output);
      }
    });
  });
}

/**
 * Collects user requirements through interactive CLI prompts
 * @param projectDir The project directory to analyze
 * @returns Promise that resolves to user responses
 */
export async function collectUserRequirements(projectDir: string): Promise<UserResponse> {
  const responses: UserResponse = {};

  // Ensure clean terminal state
  console.log('\n'); // Add some spacing

  // Process each question with clean formatting
  for (const question of PROJECT_REQUIREMENTS_QUESTIONS) {
    let answer: { value: unknown };

    // Add spacing between questions for better readability
    if (question.type !== 'text') {
      console.log('');
    }

    switch (question.type) {
      case 'text':
        // Add spacing before text input questions for better readability
        console.log('');
        answer = await inquirer.prompt([
          {
            type: 'input',
            name: 'value',
            message: question.text,
            validate: (input: string) => {
              if (question.required && !input.trim()) {
                return 'This field is required';
              }
              return true;
            },
          },
        ]);
        responses[question.id] = answer.value;
        break;

      case 'single-choice':
        answer = await inquirer.prompt([
          {
            type: 'list',
            name: 'value',
            message: question.text,
            choices: question.options,
            validate: (input: string) => {
              if (question.required && !input) {
                return 'This field is required';
              }
              return true;
            },
          },
        ]);
        responses[question.id] = answer.value;
        break;

      case 'multiple-choice':
        answer = await inquirer.prompt([
          {
            type: 'checkbox',
            name: 'value',
            message: question.text,
            choices: question.options,
            validate: (input: string[]) => {
              if (question.required && (!input || input.length === 0)) {
                return 'This field is required';
              }
              return true;
            },
          },
        ]);
        responses[question.id] = answer.value;
        break;

      default:
        answer = await inquirer.prompt([
          {
            type: 'input',
            name: 'value',
            message: question.text,
          },
        ]);
        responses[question.id] = answer.value;
        break;
    }
  }

  // Generate project structure analysis
  console.log('📁 Analyzing project structure...');
  const projectStructure = await generateProjectStructure(projectDir);
  responses.projectStructure = projectStructure;

  return responses;
}
