/**
 * TDD Test Suite for CACI Landing Page Documentation
 * Following BMad methodology for comprehensive testing
 */

import { describe, it, expect, beforeEach } from '@jest/globals'
import { DocumentationValidator } from '../lib/documentation-validator'
import { BMadAgentIntegration } from '../lib/bmad-agent-integration'
import { ContentAnalyzer } from '../lib/content-analyzer'

describe('CACI Landing Page Documentation Tests', () => {
  let docValidator: DocumentationValidator
  let agentIntegration: BMadAgentIntegration
  let contentAnalyzer: ContentAnalyzer

  beforeEach(() => {
    docValidator = new DocumentationValidator()
    agentIntegration = new BMadAgentIntegration()
    contentAnalyzer = new ContentAnalyzer()
  })

  describe('Content Structure Validation', () => {
    it('should validate all required landing page sections exist', () => {
      const requiredSections = [
        'hero',
        'problem',
        'solution',
        'features',
        'benefits',
        'audience',
        'cta'
      ]
      
      const sections = docValidator.validateSections()
      requiredSections.forEach(section => {
        expect(sections).toContain(section)
      })
    })

    it('should ensure each section has proper metadata', () => {
      const sections = docValidator.getAllSections()
      
      sections.forEach(section => {
        expect(section).toHaveProperty('title')
        expect(section).toHaveProperty('content')
        expect(section).toHaveProperty('order')
        expect(section).toHaveProperty('agent')
      })
    })

    it('should validate content follows BMad documentation standards', () => {
      const validation = docValidator.validateBMadStandards()
      
      expect(validation.hasProperYAMLHeader).toBe(true)
      expect(validation.hasAgentOwnership).toBe(true)
      expect(validation.hasElicitationPoints).toBe(true)
      expect(validation.followsTemplateFormat).toBe(true)
    })
  })

  describe('BMad Agent Integration', () => {
    it('should properly assign agents to documentation sections', () => {
      const assignments = agentIntegration.getAgentAssignments()
      
      expect(assignments['hero']).toBe('ux-expert')
      expect(assignments['problem']).toBe('analyst')
      expect(assignments['solution']).toBe('architect')
      expect(assignments['features']).toBe('pm')
      expect(assignments['benefits']).toBe('analyst')
      expect(assignments['audience']).toBe('pm')
      expect(assignments['cta']).toBe('ux-expert')
    })

    it('should validate agent permissions for section editing', () => {
      const heroSection = { owner: 'ux-expert', editors: ['pm', 'po'] }
      
      expect(agentIntegration.canEdit('ux-expert', heroSection)).toBe(true)
      expect(agentIntegration.canEdit('pm', heroSection)).toBe(true)
      expect(agentIntegration.canEdit('dev', heroSection)).toBe(false)
    })

    it('should execute create-doc workflow correctly', () => {
      const workflow = agentIntegration.executeCreateDoc('landing-page-tmpl')
      
      expect(workflow.status).toBe('success')
      expect(workflow.sections.length).toBeGreaterThan(0)
      expect(workflow.elicitationPoints.length).toBeGreaterThan(0)
    })
  })

  describe('Content Quality Assurance', () => {
    it('should analyze content clarity and messaging', () => {
      const heroContent = 'Stop wrestling with Claude Code configs. Start shipping faster.'
      const analysis = contentAnalyzer.analyzeClarity(heroContent)
      
      expect(analysis.readabilityScore).toBeGreaterThan(80)
      expect(analysis.messagingStrength).toBe('strong')
      expect(analysis.callToActionPresent).toBe(true)
    })

    it('should validate technical accuracy of examples', () => {
      const codeExample = 'npx caci init'
      const validation = contentAnalyzer.validateCodeExample(codeExample)
      
      expect(validation.isValid).toBe(true)
      expect(validation.commandExists).toBe(true)
      expect(validation.syntaxCorrect).toBe(true)
    })

    it('should ensure consistency across all sections', () => {
      const consistency = contentAnalyzer.checkConsistency()
      
      expect(consistency.voiceTone).toBe('consistent')
      expect(consistency.terminology).toBe('consistent')
      expect(consistency.brandingElements).toBe('consistent')
    })
  })

  describe('SEO and Accessibility', () => {
    it('should validate SEO metadata', () => {
      const seo = docValidator.validateSEO()
      
      expect(seo.hasMetaDescription).toBe(true)
      expect(seo.hasKeywords).toBe(true)
      expect(seo.titleLength).toBeLessThanOrEqual(60)
      expect(seo.descriptionLength).toBeLessThanOrEqual(160)
    })

    it('should ensure accessibility standards', () => {
      const a11y = docValidator.checkAccessibility()
      
      expect(a11y.hasProperHeadingHierarchy).toBe(true)
      expect(a11y.hasAltTextForImages).toBe(true)
      expect(a11y.hasSemanticHTML).toBe(true)
      expect(a11y.colorContrastPasses).toBe(true)
    })
  })

  describe('User Journey Validation', () => {
    it('should validate logical flow through sections', () => {
      const flow = contentAnalyzer.analyzeUserJourney()
      
      expect(flow.hasClearProgression).toBe(true)
      expect(flow.ctaPlacement).toBe('optimal')
      expect(flow.informationDensity).toBe('balanced')
    })

    it('should ensure each section builds on previous', () => {
      const sections = docValidator.getAllSections()
      
      for (let i = 1; i < sections.length; i++) {
        const connection = contentAnalyzer.analyzeSectionConnection(
          sections[i - 1],
          sections[i]
        )
        expect(connection.hasLogicalFlow).toBe(true)
      }
    })
  })

  describe('Interactive Elements', () => {
    it('should validate all interactive elements function correctly', () => {
      const elements = docValidator.getInteractiveElements()
      
      elements.forEach(element => {
        expect(element.hasAccessibleLabel).toBe(true)
        expect(element.hasKeyboardSupport).toBe(true)
        expect(element.hasFocusIndicator).toBe(true)
      })
    })

    it('should ensure code snippets are copyable', () => {
      const codeSnippets = docValidator.getCodeSnippets()
      
      codeSnippets.forEach(snippet => {
        expect(snippet.hasCopyButton).toBe(true)
        expect(snippet.hasSyntaxHighlighting).toBe(true)
        expect(snippet.isAccessible).toBe(true)
      })
    })
  })

  describe('Performance and Optimization', () => {
    it('should validate documentation loads efficiently', () => {
      const performance = docValidator.measurePerformance()
      
      expect(performance.loadTime).toBeLessThan(3000) // 3 seconds
      expect(performance.imageOptimization).toBe('optimized')
      expect(performance.lazyLoadingEnabled).toBe(true)
    })

    it('should ensure mobile responsiveness', () => {
      const responsive = docValidator.checkResponsiveness()
      
      expect(responsive.mobileOptimized).toBe(true)
      expect(responsive.touchTargetsAdequate).toBe(true)
      expect(responsive.readableOnMobile).toBe(true)
    })
  })

  describe('Integration with CACI System', () => {
    it('should validate links to CACI CLI', () => {
      const links = docValidator.getInternalLinks()
      
      links.forEach(link => {
        expect(link.isValid).toBe(true)
        expect(link.targetExists).toBe(true)
      })
    })

    it('should ensure documentation aligns with CACI features', () => {
      const alignment = contentAnalyzer.checkFeatureAlignment()
      
      expect(alignment.allFeaturesDocumented).toBe(true)
      expect(alignment.noOrphanedFeatures).toBe(true)
      expect(alignment.accurateDescriptions).toBe(true)
    })
  })
})