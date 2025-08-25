import inquirer from 'inquirer';
import { spawn } from 'child_process';
import { PROJECT_REQUIREMENTS_QUESTIONS } from './questions';
import { getApiKey, isAuthenticated, storeApiKey } from '../auth/oauth';

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
 * Gets default selections based on experience level
 */
function getDefaultSelectionsForExperience(
  experienceLevel: string,
  projectType?: string
): Partial<UserResponse> {
  const defaults: Partial<UserResponse> = {};

  if (experienceLevel.includes('Beginner')) {
    // Auto-select popular choices for beginners
    defaults['programming-languages'] = ['JavaScript/TypeScript'];

    // Add framework defaults based on project type
    if (projectType === 'Web Application') {
      defaults['web-frameworks'] = ['React', 'Next.js'];
    } else if (projectType === 'API Service') {
      defaults['programming-languages'] = ['JavaScript/TypeScript', 'Python'];
      defaults['web-frameworks'] = ['Express', 'FastAPI'];
    } else if (projectType === 'Data Analysis/ML Project') {
      defaults['programming-languages'] = ['Python'];
      defaults['web-frameworks'] = ['Not Applicable'];
    } else {
      defaults['web-frameworks'] = ['React'];
    }
  } else if (experienceLevel.includes('Intermediate')) {
    // Pre-select common choices but allow modification
    defaults['programming-languages'] = ['JavaScript/TypeScript'];
    if (projectType === 'Web Application') {
      defaults['web-frameworks'] = ['React'];
    }
  }
  // Advanced users get no defaults - they choose everything

  return defaults;
}

/**
 * Collects user requirements through interactive CLI prompts
 * @param projectDir The project directory to analyze
 * @returns Promise that resolves to user responses
 */
export async function collectUserRequirements(projectDir: string): Promise<UserResponse> {
  const responses: UserResponse = {};
  let experienceLevel: string = '';

  // Ensure clean terminal state
  console.log('\n'); // Add some spacing

  // Process each question with clean formatting
  for (const question of PROJECT_REQUIREMENTS_QUESTIONS) {
    // Store experience level when we get it
    if (question.id === 'experience-level') {
      // Always ask the experience level question first
    } else if (experienceLevel && question.showForLevels) {
      // Skip questions not appropriate for this experience level
      const userLevel = experienceLevel.includes('Beginner')
        ? 'beginner'
        : experienceLevel.includes('Intermediate')
          ? 'intermediate'
          : 'advanced';

      if (!question.showForLevels.includes(userLevel)) {
        // Apply defaults for skipped questions if user is beginner
        if (userLevel === 'beginner') {
          const defaults = getDefaultSelectionsForExperience(
            experienceLevel,
            responses['project-type'] as string
          );
          if (defaults[question.id as keyof typeof defaults]) {
            responses[question.id] = defaults[question.id as keyof typeof defaults];

            // Show what was auto-selected for beginners
            if (question.id === 'programming-languages' || question.id === 'web-frameworks') {
              console.log(`\n✨ Auto-selected for you: ${question.text}`);
              console.log(
                `   ${
                  Array.isArray(responses[question.id])
                    ? (responses[question.id] as string[]).join(', ')
                    : responses[question.id]
                }`
              );
            }
          }
        }
        continue;
      }
    }

    let answer: { value: unknown };

    // Handle special OAuth authentication question
    if (question.id === 'enable-ai-auth') {
      // Check if already authenticated
      const alreadyAuth = await isAuthenticated();

      if (alreadyAuth) {
        console.log('🔐 Already authenticated - AI recommendations enabled');
        responses[question.id] = 'Browser OAuth (recommended)';
        responses['api-key'] = await getApiKey();
        continue;
      }

      // Ask user how they want to authenticate
      answer = await inquirer.prompt([
        {
          type: 'list',
          name: 'value',
          message: question.text,
          choices: question.options,
        },
      ]);

      responses[question.id] = answer.value;

      // Handle authentication based on user choice
      if (answer.value === 'Browser OAuth (recommended)') {
        const apiKey = await getApiKey();
        if (apiKey) {
          responses['api-key'] = apiKey;
          console.log('');
        } else {
          console.log('❌ OAuth authentication failed, proceeding without AI recommendations\n');
          responses['api-key'] = null;
        }
      } else if (answer.value === 'Manual API key entry') {
        try {
          console.log(
            '\n📝 You can get your OpenRouter API key from: https://openrouter.ai/keys\n'
          );

          const manualAnswer = await inquirer.prompt([
            {
              type: 'password',
              name: 'apiKey',
              message: 'Enter your OpenRouter API key:',
              validate: (input: string) => {
                if (!input.trim()) {
                  return 'API key is required';
                }
                if (!input.startsWith('sk-or-')) {
                  return 'OpenRouter API keys should start with "sk-or-"';
                }
                return true;
              },
              mask: '*',
            },
          ]);

          // Try to store in keychain
          try {
            await storeApiKey(manualAnswer.apiKey as string);
            console.log('✅ API key stored securely!');
          } catch (error) {
            console.log('⚠️  Could not store API key in keychain, but continuing...');
          }

          responses['api-key'] = manualAnswer.apiKey;
          console.log('');
        } catch (error) {
          console.log('❌ Manual authentication failed, proceeding without AI recommendations\n');
          responses['api-key'] = null;
        }
      } else {
        responses['api-key'] = null;
      }
      continue;
    }

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

      case 'multiple-choice': {
        // For intermediate users, pre-select smart defaults
        let defaultChoices: string[] = [];
        if (experienceLevel.includes('Intermediate')) {
          const defaults = getDefaultSelectionsForExperience(
            experienceLevel,
            responses['project-type'] as string
          );
          defaultChoices = (defaults[question.id as keyof typeof defaults] as string[]) || [];
        }

        answer = await inquirer.prompt([
          {
            type: 'checkbox',
            name: 'value',
            message: question.text,
            choices: question.options,
            default: defaultChoices,
            validate: (input: string[]) => {
              if (question.required && (!input || input.length === 0)) {
                return 'This field is required';
              }
              return true;
            },
          },
        ]);

        // Show helpful message if defaults were pre-selected
        if (defaultChoices.length > 0 && experienceLevel.includes('Intermediate')) {
          console.log(`   💡 Pre-selected common choices, modify as needed`);
        }

        responses[question.id] = answer.value;
        break;
      }

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

    // Store experience level for filtering subsequent questions
    if (question.id === 'experience-level') {
      experienceLevel = answer.value as string;

      // Show helpful message based on experience level
      if (experienceLevel.includes('Beginner')) {
        console.log(
          "\n🌟 Great! I'll streamline the setup process and auto-select common choices for you."
        );
      } else if (experienceLevel.includes('Intermediate')) {
        console.log(
          "\n🚀 Perfect! I'll ask key questions and provide smart defaults where helpful."
        );
      } else {
        console.log("\n⚡ Excellent! You'll have full control over all configuration options.");
      }
    }
  }

  // Generate project structure analysis
  console.log('📁 Analyzing project structure...');
  const projectStructure = await generateProjectStructure(projectDir);
  responses.projectStructure = projectStructure;

  return responses;
}
