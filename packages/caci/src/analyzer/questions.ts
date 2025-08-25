export interface Question {
  id: string;
  text: string;
  type: 'text' | 'single-choice' | 'multiple-choice';
  options?: string[];
  required?: boolean;
  showForLevels?: ('beginner' | 'intermediate' | 'advanced')[];
}

export const PROJECT_REQUIREMENTS_QUESTIONS: Question[] = [
  {
    id: 'enable-ai-auth',
    text: 'How would you like to enable AI-powered recommendations?',
    type: 'single-choice',
    options: [
      'Browser OAuth (recommended)',
      'Manual API key entry', 
      'Skip AI recommendations'
    ],
    required: false,
    showForLevels: ['beginner', 'intermediate', 'advanced'],
  },
  {
    id: 'experience-level',
    text: 'What is your experience level with AI-assisted development tools?',
    type: 'single-choice',
    options: [
      'Beginner - New to AI-assisted development',
      'Intermediate - Some experience',
      'Advanced - Extensive experience',
    ],
    required: true,
    showForLevels: ['beginner', 'intermediate', 'advanced'],
  },
  {
    id: 'project-type',
    text: 'What type of project are you working on?',
    type: 'single-choice',
    options: [
      'Web Application',
      'Mobile Application',
      'Desktop Application',
      'API Service',
      'Library/Package',
      'Data Analysis/ML Project',
      'DevOps/Infrastructure',
      'Other',
    ],
    required: true,
    showForLevels: ['beginner', 'intermediate', 'advanced'],
  },
  {
    id: 'programming-languages',
    text: 'What programming languages are you planning to use? (Select all that apply)',
    type: 'multiple-choice',
    options: [
      'JavaScript/TypeScript',
      'Python',
      'Java',
      'C#',
      'Go',
      'Rust',
      'C++',
      'PHP',
      'Ruby',
      'Other',
    ],
    showForLevels: ['intermediate', 'advanced'],
  },
  {
    id: 'web-frameworks',
    text: 'What web frameworks are you considering? (Select all that apply)',
    type: 'multiple-choice',
    options: [
      'React',
      'Vue.js',
      'Angular',
      'Next.js',
      'Nuxt.js',
      'Svelte',
      'Express',
      'FastAPI',
      'Django',
      'Flask',
      'Spring Boot',
      'ASP.NET Core',
      'Other',
      'Not Applicable',
    ],
    showForLevels: ['advanced'],
  },
  {
    id: 'project-description',
    text: 'Describe your project (problem, audience, features, goals):',
    type: 'text',
    showForLevels: ['beginner', 'intermediate', 'advanced'],
  },
];
