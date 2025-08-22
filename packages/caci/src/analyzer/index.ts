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
  settings: any;
  templates: any;
}

export interface SelectedComponents {
  agents: string[];
  commands: string[];
  hooks: string[];
  mcps: string[];
}

export interface UserRequirements {
  projectType?: string;
  programmingLanguages?: string[];
  frameworks?: string[];
  features?: string[];
  complexity?: 'simple' | 'medium' | 'complex';
  experienceLevel?: 'beginner' | 'intermediate' | 'advanced';
  // Add more fields as needed
}

export interface RankedComponent {
  component: Component;
  score: number;
  category: string;
}
