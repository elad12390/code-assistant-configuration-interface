/**
 * Solution Section Component
 * Agent: architect
 * Owner: architect
 * Editors: pm, dev
 */

import React from 'react'
import { motion } from 'framer-motion'
import { useInView } from '@/hooks/useInView'
import { Card } from '@/components/ui/card'
import { GradientText } from '@/components/ui/gradient-text'
import { 
  MessageSquare, 
  Cpu, 
  Rocket,
  CheckCircle,
  ArrowRight
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

  const staggerChildren = {
    animate: {
      transition: {
        staggerChildren: 0.2
      }
    }
  }

  return (
    <section ref={ref} className="py-20 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            <GradientText>CACI: Your Claude Code Setup, Automated</GradientText>
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            One CLI. A few questions. Production-ready Claude Code configuration.
          </p>
          <p className="text-lg text-gray-500 dark:text-gray-400 mt-4">
            CACI is the configuration interface that asks you smart questions and 
            automatically generates optimized Claude Code setups.
          </p>
        </motion.div>

        {/* Process Timeline */}
        <motion.div
          variants={staggerChildren}
          initial="initial"
          animate={isInView ? "animate" : "initial"}
          className="relative"
        >
          {/* Timeline Line */}
          <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-gradient-to-r from-blue-200 via-blue-400 to-cyan-200 dark:from-blue-800 dark:via-blue-600 dark:to-cyan-800 hidden md:block" />

          {/* Process Steps */}
          <div className="grid md:grid-cols-3 gap-8 relative">
            {processSteps.map((step, index) => (
              <motion.div
                key={index}
                variants={{
                  initial: { opacity: 0, y: 50 },
                  animate: { opacity: 1, y: 0 }
                }}
                transition={{ duration: 0.5, delay: index * 0.2 }}
                className="relative"
              >
                <Card className="p-6 h-full hover:shadow-xl transition-all duration-300 group bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
                  {/* Step Number */}
                  <div className="absolute -top-4 -left-4 w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-full flex items-center justify-center text-white font-bold shadow-lg">
                    {step.number}
                  </div>

                  {/* Icon */}
                  <div className="mb-4 text-blue-600 dark:text-blue-400 group-hover:scale-110 transition-transform">
                    {step.icon}
                  </div>

                  {/* Content */}
                  <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
                  <p className="text-gray-600 dark:text-gray-300 mb-4">
                    {step.description}
                  </p>

                  {/* Duration Badge */}
                  <div className="inline-flex items-center gap-2 px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded-full text-sm">
                    <CheckCircle className="w-4 h-4" />
                    <span>{step.duration}</span>
                  </div>

                  {/* Arrow (except last item) */}
                  {index < processSteps.length - 1 && (
                    <div className="hidden md:block absolute top-1/2 -right-4 transform -translate-y-1/2">
                      <ArrowRight className="w-8 h-8 text-blue-400 dark:text-blue-600" />
                    </div>
                  )}
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Bottom Summary */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="mt-16 text-center"
        >
          <div className="inline-flex items-center gap-3 px-6 py-3 bg-blue-50 dark:bg-blue-900/20 rounded-full">
            <Rocket className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            <span className="text-lg font-medium text-blue-700 dark:text-blue-300">
              Total setup time: Under 5 minutes
            </span>
          </div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">
            No more hunting through documentation or debugging config files.
          </p>
        </motion.div>
      </div>
    </section>
  )
}