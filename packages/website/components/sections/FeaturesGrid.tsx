'use client'

/**
 * Features Grid Component
 * Agent: pm
 * Owner: pm
 * Editors: architect, ux-expert
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

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5
      }
    }
  }

  return (
    <section ref={ref} className="py-20 px-4 bg-gray-50 dark:bg-gray-900/50">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            What You Get
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            CACI generates complete Claude Code configurations tailored to your specific needs
          </p>
        </motion.div>

        {/* Features Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="grid md:grid-cols-2 gap-8"
        >
          {features.map((feature, index) => (
            <motion.div key={index} variants={itemVariants}>
              <Card className="h-full p-8 hover:shadow-xl transition-all duration-300 group overflow-hidden relative">
                {/* Gradient Background */}
                <div className={`absolute inset-0 bg-gradient-to-br ${feature.color} opacity-0 group-hover:opacity-5 transition-opacity duration-300`} />
                
                {/* Icon */}
                <div className={`mb-4 inline-flex p-3 rounded-lg bg-gradient-to-br ${feature.color} text-white`}>
                  {feature.icon}
                </div>

                {/* Title */}
                <h3 className="text-2xl font-bold mb-3">{feature.title}</h3>

                {/* Description */}
                <p className="text-gray-600 dark:text-gray-300 mb-6">
                  {feature.description}:
                </p>

                {/* Examples */}
                <ul className="space-y-2">
                  {feature.examples.map((example, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-sm text-gray-700 dark:text-gray-400">
                      <ArrowRight className="w-4 h-4 mt-0.5 text-gray-400 flex-shrink-0" />
                      <span>{example}</span>
                    </li>
                  ))}
                </ul>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        {/* Additional Features */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.4 }}
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
              <div
                key={index}
                className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-800 rounded-full shadow-sm"
              >
                <div className="text-blue-600 dark:text-blue-400">
                  {item.icon}
                </div>
                <span className="text-sm font-medium">{item.text}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  )
}