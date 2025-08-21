import inquirer from 'inquirer';
import { PROJECT_REQUIREMENTS_QUESTIONS, Question } from './questions';

export interface UserResponse {
  [key: string]: any;
}

/**
 * Collects user requirements through interactive CLI prompts
 * @returns Promise that resolves to user responses
 */
export async function collectUserRequirements(): Promise<UserResponse> {
  const responses: UserResponse = {};

  // Process each question
  for (const question of PROJECT_REQUIREMENTS_QUESTIONS) {
    let answer: any;

    switch (question.type) {
      case 'text':
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

  return responses;
}
