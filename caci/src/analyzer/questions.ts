export interface Question {
  id: string;
  text: string;
  type: 'text' | 'single-choice' | 'multiple-choice';
  options?: string[];
  required?: boolean;
}

export const PROJECT_REQUIREMENTS_QUESTIONS: Question[] = [
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
      'Other'
    ],
    required: true
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
      'Other'
    ]
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
      'Not Applicable'
    ]
  },
  {
    id: 'experience-level',
    text: 'What is your experience level with AI-assisted development tools?',
    type: 'single-choice',
    options: [
      'Beginner - New to AI-assisted development',
      'Intermediate - Some experience',
      'Advanced - Extensive experience'
    ]
  },
  {
    id: 'project-description',
    text: 'Please provide a brief description of your project (what problem does it solve, who is it for, etc.):',
    type: 'text'
  }
];