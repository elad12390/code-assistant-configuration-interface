/**
 * BMad Agent Integration for CACI Landing Page
 * Manages agent assignments and workflows
 */

export interface AgentAssignments {
  [sectionId: string]: string
}

export interface SectionPermissions {
  owner: string
  editors?: string[]
  readonly?: boolean
}

export interface WorkflowResult {
  status: 'success' | 'failure' | 'in-progress'
  sections: any[]
  elicitationPoints: any[]
  errors?: string[]
}

export class BMadAgentIntegration {
  private agentAssignments: AgentAssignments = {
    hero: 'ux-expert',
    problem: 'analyst',
    solution: 'architect',
    features: 'pm',
    benefits: 'analyst',
    audience: 'pm',
    cta: 'ux-expert'
  }

  private agentCapabilities = {
    'ux-expert': ['design', 'user-experience', 'visual-elements'],
    'analyst': ['research', 'problem-analysis', 'market-insights'],
    'architect': ['system-design', 'technical-solutions', 'integration'],
    'pm': ['product-features', 'roadmap', 'prioritization'],
    'po': ['requirements', 'acceptance-criteria', 'validation'],
    'dev': ['implementation', 'coding', 'technical-details'],
    'qa': ['testing', 'quality-assurance', 'validation'],
    'sm': ['process', 'workflow', 'team-coordination']
  }

  getAgentAssignments(): AgentAssignments {
    return this.agentAssignments
  }

  canEdit(agent: string, section: SectionPermissions): boolean {
    if (section.readonly) {
      return false
    }
    
    if (agent === section.owner) {
      return true
    }
    
    if (section.editors && section.editors.includes(agent)) {
      return true
    }
    
    return false
  }

  executeCreateDoc(templateName: string): WorkflowResult {
    const workflow = this.initializeWorkflow(templateName)
    
    // Simulate BMad create-doc workflow
    const sections = this.generateSections(templateName)
    const elicitationPoints = this.identifyElicitationPoints(sections)
    
    return {
      status: 'success',
      sections,
      elicitationPoints
    }
  }

  private initializeWorkflow(templateName: string): any {
    return {
      template: templateName,
      mode: 'interactive',
      elicitationEnabled: true,
      agents: Object.keys(this.agentAssignments)
    }
  }

  private generateSections(templateName: string): any[] {
    return Object.entries(this.agentAssignments).map(([sectionId, agent]) => ({
      id: sectionId,
      agent,
      status: 'draft',
      content: this.generateSectionContent(sectionId, agent),
      metadata: {
        createdAt: new Date(),
        lastModified: new Date(),
        version: 1
      }
    }))
  }

  private generateSectionContent(sectionId: string, agent: string): string {
    const contentTemplates: { [key: string]: string } = {
      hero: 'Stop wrestling with Claude Code configs. Start shipping faster.',
      problem: 'Analysis of developer pain points with configuration complexity...',
      solution: 'Architectural approach to automated configuration generation...',
      features: 'Key product features and capabilities overview...',
      benefits: 'Detailed benefit analysis for target users...',
      audience: 'Target audience segmentation and use cases...',
      cta: 'Clear call-to-action with immediate next steps...'
    }
    
    return contentTemplates[sectionId] || 'Content pending...'
  }

  private identifyElicitationPoints(sections: any[]): any[] {
    return sections.flatMap(section => {
      const points = []
      
      // Each section has at least one elicitation point
      points.push({
        sectionId: section.id,
        type: 'content-review',
        description: `Review and refine ${section.id} section content`,
        methods: this.getElicitationMethods(section.agent)
      })
      
      // Critical sections get additional elicitation
      if (['hero', 'problem', 'solution'].includes(section.id)) {
        points.push({
          sectionId: section.id,
          type: 'deep-analysis',
          description: `Deep dive into ${section.id} messaging`,
          methods: ['tree-of-thoughts', 'stakeholder-roundtable']
        })
      }
      
      return points
    })
  }

  private getElicitationMethods(agent: string): string[] {
    const methodsByAgent: { [key: string]: string[] } = {
      'ux-expert': ['expand-contract', 'critique-refine', 'agile-team-perspective'],
      'analyst': ['identify-risks', 'assess-alignment', 'hindsight-reflection'],
      'architect': ['tree-of-thoughts', 'meta-prompting', 'red-team-blue-team'],
      'pm': ['stakeholder-roundtable', 'innovation-tournament', 'assess-alignment']
    }
    
    return methodsByAgent[agent] || ['critique-refine', 'expand-contract']
  }

  validateAgentWorkflow(agent: string, action: string): boolean {
    const capabilities = this.agentCapabilities[agent] || []
    
    // Map actions to required capabilities
    const requiredCapabilities: { [key: string]: string[] } = {
      'create-content': ['design', 'user-experience', 'product-features'],
      'analyze-problem': ['research', 'problem-analysis'],
      'design-solution': ['system-design', 'technical-solutions'],
      'review-quality': ['testing', 'quality-assurance']
    }
    
    const required = requiredCapabilities[action] || []
    return required.some(cap => capabilities.includes(cap))
  }

  getRecommendedAgent(taskType: string): string {
    const taskAgentMap: { [key: string]: string } = {
      'visual-design': 'ux-expert',
      'content-analysis': 'analyst',
      'technical-design': 'architect',
      'feature-planning': 'pm',
      'quality-review': 'qa',
      'process-optimization': 'sm'
    }
    
    return taskAgentMap[taskType] || 'bmad-orchestrator'
  }
}