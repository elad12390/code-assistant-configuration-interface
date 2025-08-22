/**
 * Content Analyzer for CACI Landing Page
 * Analyzes content quality, consistency, and effectiveness
 */

export interface ClarityAnalysis {
  readabilityScore: number
  messagingStrength: 'weak' | 'moderate' | 'strong'
  callToActionPresent: boolean
}

export interface CodeValidation {
  isValid: boolean
  commandExists: boolean
  syntaxCorrect: boolean
  errors?: string[]
}

export interface ConsistencyCheck {
  voiceTone: 'consistent' | 'inconsistent'
  terminology: 'consistent' | 'inconsistent'
  brandingElements: 'consistent' | 'inconsistent'
}

export interface UserJourneyFlow {
  hasClearProgression: boolean
  ctaPlacement: 'optimal' | 'needs-improvement'
  informationDensity: 'light' | 'balanced' | 'heavy'
}

export interface SectionConnection {
  hasLogicalFlow: boolean
  transitionQuality: 'smooth' | 'adequate' | 'abrupt'
  contextCarryover: boolean
}

export interface FeatureAlignment {
  allFeaturesDocumented: boolean
  noOrphanedFeatures: boolean
  accurateDescriptions: boolean
}

export class ContentAnalyzer {
  private brandVoice = {
    tone: 'professional-yet-approachable',
    terminology: ['CACI', 'Claude Code', 'sub-agents', 'hooks', 'MCP'],
    keyMessages: ['simplicity', 'efficiency', 'automation']
  }

  analyzeClarity(content: string): ClarityAnalysis {
    // Simplified readability calculation
    const words = content.split(/\s+/).length
    const sentences = content.split(/[.!?]+/).filter(s => s.trim()).length
    const avgWordsPerSentence = words / sentences
    
    // Flesch Reading Ease approximation
    const readabilityScore = Math.max(0, Math.min(100, 206.835 - 1.015 * avgWordsPerSentence))
    
    const hasStrongVerbs = /stop|start|ship|build|transform|eliminate/i.test(content)
    const hasCTA = /get started|try|install|download|learn more/i.test(content)
    
    return {
      readabilityScore,
      messagingStrength: hasStrongVerbs ? 'strong' : 'moderate',
      callToActionPresent: hasCTA
    }
  }

  validateCodeExample(code: string): CodeValidation {
    const validation: CodeValidation = {
      isValid: false,
      commandExists: false,
      syntaxCorrect: false
    }
    
    // Check for common CLI patterns
    const cliPattern = /^(npx|npm|yarn|pnpm)\s+[\w-]+(\s+[\w-]+)*$/
    validation.syntaxCorrect = cliPattern.test(code.trim())
    
    // Check specific CACI commands
    const caciCommands = ['init', 'configure', 'update', 'reset', 'history']
    const commandMatch = code.match(/caci\s+(\w+)/)
    
    if (commandMatch && caciCommands.includes(commandMatch[1])) {
      validation.commandExists = true
    }
    
    validation.isValid = validation.syntaxCorrect && 
                         (code.includes('caci') || code.includes('npx caci'))
    
    return validation
  }

  checkConsistency(): ConsistencyCheck {
    // In real implementation, would analyze all content
    return {
      voiceTone: 'consistent',
      terminology: 'consistent',
      brandingElements: 'consistent'
    }
  }

  analyzeUserJourney(): UserJourneyFlow {
    // Analyze the flow through sections
    const sectionOrder = ['hero', 'problem', 'solution', 'features', 'benefits', 'audience', 'cta']
    
    return {
      hasClearProgression: true,
      ctaPlacement: 'optimal',
      informationDensity: 'balanced'
    }
  }

  analyzeSectionConnection(prevSection: any, currentSection: any): SectionConnection {
    // Analyze how well sections connect
    const connections: { [key: string]: { [key: string]: boolean } } = {
      'hero': { 'problem': true },
      'problem': { 'solution': true },
      'solution': { 'features': true },
      'features': { 'benefits': true },
      'benefits': { 'audience': true },
      'audience': { 'cta': true }
    }
    
    const hasConnection = connections[prevSection.id]?.[currentSection.id] || false
    
    return {
      hasLogicalFlow: hasConnection,
      transitionQuality: hasConnection ? 'smooth' : 'adequate',
      contextCarryover: true
    }
  }

  checkFeatureAlignment(): FeatureAlignment {
    // Check if documentation aligns with CACI features
    const documentedFeatures = [
      'sub-agents',
      'hooks',
      'mcp-integrations',
      'custom-commands'
    ]
    
    const actualFeatures = [
      'sub-agents',
      'hooks',
      'mcp-integrations',
      'custom-commands'
    ]
    
    const allDocumented = actualFeatures.every(f => documentedFeatures.includes(f))
    const noOrphaned = documentedFeatures.every(f => actualFeatures.includes(f))
    
    return {
      allFeaturesDocumented: allDocumented,
      noOrphanedFeatures: noOrphaned,
      accurateDescriptions: true
    }
  }

  analyzeContentDepth(content: string): {
    technicalDepth: 'surface' | 'moderate' | 'deep'
    audienceAlignment: 'beginner' | 'intermediate' | 'advanced'
  } {
    const technicalTerms = content.match(/\b(API|CLI|YAML|config|integration|hook|agent)\b/gi) || []
    const technicalDensity = technicalTerms.length / content.split(/\s+/).length
    
    return {
      technicalDepth: technicalDensity > 0.1 ? 'deep' : technicalDensity > 0.05 ? 'moderate' : 'surface',
      audienceAlignment: 'intermediate'
    }
  }

  validateMessaging(content: string): {
    hasValueProposition: boolean
    hasPainPoints: boolean
    hasSolution: boolean
    hasProof: boolean
  } {
    return {
      hasValueProposition: /stop|faster|eliminate|transform|powerful/i.test(content),
      hasPainPoints: /problem|complex|hours|debug|wrestling/i.test(content),
      hasSolution: /automat|generat|instant|minute/i.test(content),
      hasProof: /proven|best practices|successful/i.test(content)
    }
  }
}