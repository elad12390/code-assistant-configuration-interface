export interface Component {
  name: string;
  path: string;
  category: string;
  type: string;
  content: string;
  description: string;
}

export interface ComponentsData {
  agents: Record<string, Component>;
  commands: Record<string, Component>;
  hooks: Record<string, Component>;
  mcps: Record<string, Component>;
  settings: Record<string, unknown>;
  templates: Record<string, unknown>;
}

export interface SelectedComponents {
  agents: string[];
  commands: string[];
  hooks: string[];
  mcps: string[];
}

export interface UserRequirements {
  [key: string]: unknown;
  projectType?: string;
  programmingLanguages?: string[];
  frameworks?: string[];
  features?: string[];
  complexity?: 'simple' | 'medium' | 'complex';
  experienceLevel?: 'beginner' | 'intermediate' | 'advanced';
  projectStructure?: string;
  'project-description'?: string;
  'project-type'?: string;
  'programming-languages'?: string[];
  'web-frameworks'?: string[];
  'experience-level'?: string;
}

export interface RankedComponent {
  component: Component;
  score: number;
  category: string;
}
