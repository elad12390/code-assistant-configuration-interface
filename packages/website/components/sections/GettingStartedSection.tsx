'use client'

/**
 * Getting Started Section Component
 * Agent: dev
 * Owner: dev
 * Editors: qa, sm
 */

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { useInView } from '@/hooks/useInView'
import { Terminal } from '@/components/ui/terminal'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { 
  CheckCircle2, 
  Copy, 
  Check,
  ArrowRight,
  Sparkles,
  FileText,
  Users,
  Rocket,
  Terminal as TerminalIcon
} from 'lucide-react'

interface Step {
  number: number
  title: string
  description: string
  icon: React.ReactNode
}

export const GettingStartedSection: React.FC = () => {
  const [ref, isInView] = useInView(0.2)
  const [copiedCommand, setCopiedCommand] = useState(false)

  const handleCopyCommand = () => {
    navigator.clipboard.writeText('npx code-assistant-config-interface configure')
    setCopiedCommand(true)
    setTimeout(() => setCopiedCommand(false), 2000)
  }

  const steps: Step[] = [
    {
      number: 1,
      title: 'Run the command',
      description: 'Open your terminal in your project directory',
      icon: <TerminalIcon className="w-5 h-5" />
    },
    {
      number: 2,
      title: 'Answer questions',
      description: 'Tell CACI about your project and preferences',
      icon: <FileText className="w-5 h-5" />
    },
    {
      number: 3,
      title: 'Review configuration',
      description: 'See what CACI will set up for you',
      icon: <Users className="w-5 h-5" />
    },
    {
      number: 4,
      title: 'Start building',
      description: 'Claude Code is now perfectly configured',
      icon: <Rocket className="w-5 h-5" />
    }
  ]

  const checklistItems = [
    'Instant Setup - Complete Claude Code configuration generated',
    'Documentation - Clear explanations of what was configured and why',
    'Team Ready - Shareable configs for your entire development team',
    'Future-Proof - Easy updates as your needs evolve'
  ]

  return (
    <section ref={ref} id="getting-started" className="py-20 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-50 dark:bg-green-900/20 rounded-full mb-6">
            <Sparkles className="w-4 h-4 text-green-600 dark:text-green-400" />
            <span className="text-sm font-medium text-green-700 dark:text-green-300">
              Ready to use in 60 seconds
            </span>
          </div>
          
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Get Started in 60 Seconds
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            One command. A few questions. Complete Claude Code setup.
          </p>
        </motion.div>

        {/* Command Terminal */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="max-w-2xl mx-auto mb-16"
        >
          <Terminal showCopy={false}>
            <div className="flex items-center justify-between">
              <div className="font-mono text-lg text-green-400">
                <span className="text-green-500">$</span> npx code-assistant-config-interface configure
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleCopyCommand}
                className="text-gray-400 hover:text-white"
              >
                {copiedCommand ? (
                  <Check className="w-4 h-4 text-green-400" />
                ) : (
                  <Copy className="w-4 h-4" />
                )}
              </Button>
            </div>
          </Terminal>
          <p className="text-center text-sm text-gray-600 dark:text-gray-400 mt-4">
            That's it. Answer a few questions, and CACI handles the rest.
          </p>
        </motion.div>

        {/* Installation Options */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.25 }}
          className="max-w-4xl mx-auto mb-16"
        >
          <div className="text-center mb-6">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-2">
              Choose Your Installation Method
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Pick the option that works best for your workflow
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-4">
            {/* Quick Start */}
            <Card className="p-4 hover:shadow-md transition-shadow">
              <div className="text-center">
                <div className="w-12 h-12 mx-auto mb-3 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
                  <Rocket className="w-6 h-6 text-green-600 dark:text-green-400" />
                </div>
                <h4 className="font-semibold mb-2 text-green-700 dark:text-green-400">Quick Start</h4>
                <p className="text-xs text-gray-600 dark:text-gray-400 mb-3">
                  Try it now, no installation
                </p>
                <code className="block p-2 bg-gray-900 dark:bg-gray-800 rounded text-xs font-mono text-green-400 dark:text-green-400">
                  npx code-assistant-config-interface configure
                </code>
              </div>
            </Card>

            {/* Global Install */}
            <Card className="p-4 hover:shadow-md transition-shadow">
              <div className="text-center">
                <div className="w-12 h-12 mx-auto mb-3 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center">
                  <TerminalIcon className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                </div>
                <h4 className="font-semibold mb-2 text-blue-700 dark:text-blue-400">Global Install</h4>
                <p className="text-xs text-gray-600 dark:text-gray-400 mb-3">
                  For regular use across projects
                </p>
                <code className="block p-2 bg-gray-900 dark:bg-gray-800 rounded text-xs font-mono text-green-400 dark:text-green-400 leading-relaxed">
                  npm i -g code-assistant-config-interface<br/>
                  caci configure
                </code>
              </div>
            </Card>

            {/* Project Dependency */}
            <Card className="p-4 hover:shadow-md transition-shadow">
              <div className="text-center">
                <div className="w-12 h-12 mx-auto mb-3 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center">
                  <Users className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                </div>
                <h4 className="font-semibold mb-2 text-purple-700 dark:text-purple-400">Team Projects</h4>
                <p className="text-xs text-gray-600 dark:text-gray-400 mb-3">
                  Share configurations with your team
                </p>
                <code className="block p-2 bg-gray-900 dark:bg-gray-800 rounded text-xs font-mono text-green-400 dark:text-green-400 leading-relaxed">
                  npm i -D code-assistant-config-interface<br/>
                  npx caci configure
                </code>
              </div>
            </Card>
          </div>
        </motion.div>

        {/* Process Steps */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="grid md:grid-cols-4 gap-6 mb-16"
        >
          {steps.map((step, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.3 + index * 0.1 }}
              className="text-center"
            >
              <div className="relative">
                <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-full flex items-center justify-center text-white font-bold text-xl">
                  {step.number}
                </div>
                {index < steps.length - 1 && (
                  <ArrowRight className="hidden md:block absolute top-8 -right-3 w-6 h-6 text-gray-300 dark:text-gray-600" />
                )}
              </div>
              <h3 className="font-semibold mb-2">{step.title}</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {step.description}
              </p>
            </motion.div>
          ))}
        </motion.div>

        {/* What Happens Next */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="max-w-3xl mx-auto"
        >
          <Card className="p-8 bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20">
            <h3 className="text-2xl font-bold mb-6 text-center">What Happens Next?</h3>
            
            <div className="space-y-4">
              {checklistItems.map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={isInView ? { opacity: 1, x: 0 } : {}}
                  transition={{ duration: 0.5, delay: 0.6 + index * 0.1 }}
                  className="flex items-start gap-3"
                >
                  <CheckCircle2 className="w-6 h-6 text-green-500 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700 dark:text-gray-300">{item}</span>
                </motion.div>
              ))}
            </div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={isInView ? { opacity: 1 } : {}}
              transition={{ duration: 0.5, delay: 1 }}
              className="mt-8 text-center"
            >
              <Button 
                size="lg"
                className="px-8"
                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              >
                Get Started Now
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </motion.div>
          </Card>
        </motion.div>
      </div>
    </section>
  )
}