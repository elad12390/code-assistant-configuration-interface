'use client'

/**
 * Solution Section Component
 * Agent: architect
 * Owner: architect
 * Editors: pm, dev
 * Redesigned with Patio.so-inspired impact quote style
 */

import React from 'react'
import { motion } from 'framer-motion'
import { useInView } from '@/hooks/useInView'
import { Card } from '@/components/ui/card'
import { 
  MessageSquare, 
  Cpu, 
  Rocket,
  CheckCircle,
  ArrowRight,
  Sparkles
} from 'lucide-react'

interface ProcessStep {
  number: string
  title: string
  description: string
  icon: React.ReactNode
  duration: string
}

export const SolutionSection: React.FC = () => {
  const [ref, isInView] = useInView(0.2)

  const processSteps: ProcessStep[] = [
    {
      number: '01',
      title: 'Quick Interview',
      description: 'Answer a few targeted questions about your project, tech stack, and workflow preferences',
      icon: <MessageSquare className="w-6 h-6" />,
      duration: '2 min'
    },
    {
      number: '02',
      title: 'Intelligent Generation',
      description: 'CACI creates tailored sub-agents, hooks, and MCP configurations based on industry best practices',
      icon: <Cpu className="w-6 h-6" />,
      duration: '30 sec'
    },
    {
      number: '03',
      title: 'Instant Setup',
      description: 'Complete Claude Code configuration deployed in minutes, not days',
      icon: <Rocket className="w-6 h-6" />,
      duration: '1 min'
    }
  ]

  // Word-by-word animation for the main quote
  const words = "CACI: Your Claude Code Setup, Automated".split(' ')

  return (
    <section ref={ref} className="py-20 px-4 bg-gradient-to-b from-gray-50/50 to-white dark:from-gray-900/50 dark:to-background">
      <div className="max-w-6xl mx-auto">
        {/* Impactful Quote Section - Patio.so Style */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          className="text-center mb-20"
        >
          <h2 className="text-4xl md:text-6xl font-bold mb-8 leading-tight">
            {words.map((word, index) => (
              <motion.span
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: index * 0.1 }}
                className={`inline-block mr-3 ${
                  ['CACI:', 'Automated'].includes(word) 
                    ? 'text-transparent bg-gradient-to-r from-primary to-secondary bg-clip-text' 
                    : ''
                }`}
              >
                {word}
              </motion.span>
            ))}
          </h2>
          
          <motion.div
            initial={{ opacity: 0, scale: 0 }}
            animate={isInView ? { opacity: 1, scale: 1 } : {}}
            transition={{ delay: 0.5, type: "spring" }}
            className="inline-block"
          >
            <Sparkles className="w-8 h-8 text-primary animate-pulse" />
          </motion.div>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.6 }}
            className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto mt-6"
          >
            One CLI. A few questions. Production-ready Claude Code configuration.
          </motion.p>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.7 }}
            className="text-lg text-gray-500 dark:text-gray-400 mt-4"
          >
            CACI is the configuration interface that asks you smart questions and 
            automatically generates optimized Claude Code setups.
          </motion.p>
        </motion.div>

        {/* Process Cards with Enhanced Animations */}
        <div className="grid md:grid-cols-3 gap-8 relative">
          {/* Animated Connection Line */}
          <motion.div
            initial={{ scaleX: 0 }}
            animate={isInView ? { scaleX: 1 } : {}}
            transition={{ duration: 1, delay: 0.3 }}
            className="absolute top-1/2 left-0 right-0 h-0.5 bg-gradient-to-r from-primary/20 via-primary to-secondary/20 hidden md:block origin-left"
          />

          {processSteps.map((step, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 50 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ 
                duration: 0.6, 
                delay: 0.2 + index * 0.2,
                type: "spring",
                stiffness: 100
              }}
              className="relative"
            >
              <Card className="p-6 h-full hover-lift bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-gray-200/50 dark:border-gray-700/50">
                {/* Animated Step Number */}
                <motion.div
                  initial={{ scale: 0, rotate: -180 }}
                  animate={isInView ? { scale: 1, rotate: 0 } : {}}
                  transition={{ delay: 0.4 + index * 0.2, type: "spring" }}
                  className="absolute -top-4 -left-4 w-12 h-12 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center text-white font-bold shadow-lg"
                >
                  {step.number}
                </motion.div>

                {/* Icon with Float Animation */}
                <div className="mb-4 text-primary animate-float">
                  {step.icon}
                </div>

                {/* Content */}
                <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
                <p className="text-gray-600 dark:text-gray-300 mb-4">
                  {step.description}
                </p>

                {/* Duration Badge with Pulse */}
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-accent/20 text-accent rounded-full text-sm animate-pulse">
                  <CheckCircle className="w-4 h-4" />
                  <span>{step.duration}</span>
                </div>

                {/* Animated Arrow */}
                {index < processSteps.length - 1 && (
                  <motion.div
                    initial={{ opacity: 0, x: -10 }}
                    animate={isInView ? { opacity: 1, x: 0 } : {}}
                    transition={{ delay: 0.6 + index * 0.2 }}
                    className="hidden md:block absolute top-1/2 -right-4 transform -translate-y-1/2"
                  >
                    <ArrowRight className="w-8 h-8 text-primary animate-pulse" />
                  </motion.div>
                )}
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Bottom Summary with Floating Animation */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 1 }}
          className="mt-16 text-center"
        >
          <motion.div
            animate={isInView ? { y: [0, -10, 0] } : {}}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            className="inline-flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-primary/10 to-secondary/10 backdrop-blur-sm rounded-full shadow-lg"
          >
            <Rocket className="w-5 h-5 text-primary" />
            <span className="text-lg font-medium bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Total setup time: Under 5 minutes
            </span>
          </motion.div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">
            No more hunting through documentation or debugging config files.
          </p>
        </motion.div>
      </div>
    </section>
  )
}