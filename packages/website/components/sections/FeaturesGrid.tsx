'use client'

/**
 * Features Grid Component
 * Agent: pm
 * Owner: pm
 * Editors: architect, ux-expert
 * Redesigned with Patio.so-inspired animations and hover effects
 */

import React from 'react'
import { motion } from 'framer-motion'
import { useInView } from '@/hooks/useInView'
import { Card } from '@/components/ui/card'
import { 
  Bot, 
  Zap, 
  Plug, 
  Terminal,
  ArrowRight,
  Code,
  TestTube,
  FileText,
  GitBranch,
  Database,
  Rocket,
  Shield
} from 'lucide-react'

interface Feature {
  title: string
  icon: React.ReactNode
  description: string
  examples: string[]
  color: string
}

export const FeaturesGrid: React.FC = () => {
  const [ref, isInView] = useInView(0.2)

  const features: Feature[] = [
    {
      title: 'Smart Sub-Agents',
      icon: <Bot className="w-8 h-8" />,
      description: 'Pre-configured specialists for your exact needs',
      examples: [
        'Code reviewers tuned to your style guide',
        'Debuggers for your tech stack',
        'Test generators for your framework',
        'Documentation writers for your project type'
      ],
      color: 'from-blue-500 to-blue-600'
    },
    {
      title: 'Workflow Hooks',
      icon: <Zap className="w-8 h-8" />,
      description: 'Automated actions that just work',
      examples: [
        'Auto-formatting on file saves',
        'Compliance logging for enterprise',
        'Smart notifications for your workflow',
        'Custom validation rules'
      ],
      color: 'from-purple-500 to-purple-600'
    },
    {
      title: 'MCP Integrations',
      icon: <Plug className="w-8 h-8" />,
      description: 'Seamless connections to your tools',
      examples: [
        'Database query assistants',
        'API testing helpers',
        'Deployment automation',
        'Monitoring integrations'
      ],
      color: 'from-green-500 to-green-600'
    },
    {
      title: 'Custom Commands',
      icon: <Terminal className="w-8 h-8" />,
      description: 'Project-specific shortcuts that save hours',
      examples: [
        'Framework-specific generators',
        'Testing automation',
        'Build pipeline helpers',
        'Deployment scripts'
      ],
      color: 'from-orange-500 to-orange-600'
    }
  ]

  return (
    <section ref={ref} className="py-20 px-4 overflow-hidden">
      <div className="max-w-6xl mx-auto">
        {/* Header with word-by-word animation */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            {['What', 'You', 'Get'].map((word, index) => (
              <motion.span
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: index * 0.1 }}
                className="inline-block mr-2"
              >
                {word}
              </motion.span>
            ))}
          </h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.3 }}
            className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto"
          >
            CACI generates complete Claude Code configurations tailored to your specific needs
          </motion.p>
        </motion.div>

        {/* Features Grid with zoom-in effect */}
        <div className="grid md:grid-cols-2 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={isInView ? { opacity: 1, scale: 1 } : {}}
              transition={{ 
                duration: 0.5, 
                delay: index * 0.1,
                type: "spring",
                stiffness: 100
              }}
              whileHover={{ scale: 1.02 }}
              className="group"
            >
              <Card className="h-full p-8 hover-lift overflow-hidden relative bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
                {/* Animated gradient background */}
                <motion.div
                  className={`absolute inset-0 bg-gradient-to-br ${feature.color} opacity-0`}
                  whileHover={{ opacity: 0.05 }}
                  transition={{ duration: 0.3 }}
                />
                
                {/* Floating Icon */}
                <motion.div
                  animate={{ y: [0, -5, 0] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                  className={`mb-4 inline-flex p-3 rounded-lg bg-gradient-to-br ${feature.color} text-white shadow-lg`}
                >
                  {feature.icon}
                </motion.div>

                {/* Title with hover effect */}
                <h3 className="text-2xl font-bold mb-3 group-hover:text-primary transition-colors">
                  {feature.title}
                </h3>

                {/* Description */}
                <p className="text-gray-600 dark:text-gray-300 mb-6">
                  {feature.description}:
                </p>

                {/* Examples with stagger animation */}
                <ul className="space-y-2">
                  {feature.examples.map((example, idx) => (
                    <motion.li
                      key={idx}
                      initial={{ opacity: 0, x: -20 }}
                      animate={isInView ? { opacity: 1, x: 0 } : {}}
                      transition={{ delay: 0.3 + index * 0.1 + idx * 0.05 }}
                      className="flex items-start gap-2 text-sm text-gray-700 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-gray-200 transition-colors"
                    >
                      <ArrowRight className="w-4 h-4 mt-0.5 text-primary flex-shrink-0" />
                      <span>{example}</span>
                    </motion.li>
                  ))}
                </ul>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Additional Features with floating animation */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="mt-12 text-center"
        >
          <div className="inline-flex flex-wrap gap-4 justify-center">
            {[
              { icon: <Code className="w-5 h-5" />, text: 'TypeScript Support' },
              { icon: <TestTube className="w-5 h-5" />, text: 'Test Coverage' },
              { icon: <FileText className="w-5 h-5" />, text: 'Auto Documentation' },
              { icon: <GitBranch className="w-5 h-5" />, text: 'Git Integration' },
              { icon: <Database className="w-5 h-5" />, text: 'Database Tools' },
              { icon: <Rocket className="w-5 h-5" />, text: 'CI/CD Ready' },
              { icon: <Shield className="w-5 h-5" />, text: 'Security Best Practices' }
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0 }}
                animate={isInView ? { opacity: 1, scale: 1 } : {}}
                transition={{ 
                  delay: 0.7 + index * 0.05,
                  type: "spring",
                  stiffness: 200
                }}
                whileHover={{ scale: 1.1, y: -2 }}
                className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-800 rounded-full shadow-md hover:shadow-lg transition-shadow cursor-pointer"
              >
                <motion.div 
                  className="text-primary"
                  animate={{ rotate: [0, 360] }}
                  transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                >
                  {item.icon}
                </motion.div>
                <span className="text-sm font-medium">{item.text}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  )
}