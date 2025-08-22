'use client'

/**
 * Problem Section Component
 * Agent: analyst
 * Owner: analyst
 * Editors: pm, ux-expert
 * Redesigned with Patio.so-inspired sliding cards
 */

import React from 'react'
import { motion } from 'framer-motion'
import { useInView } from '@/hooks/useInView'
import { Card } from '@/components/ui/card'
import { 
  Clock, 
  FileCode, 
  Bug, 
  Settings,
  GitBranch,
  Zap
} from 'lucide-react'

export const ProblemSection: React.FC = () => {
  const [ref, isInView] = useInView(0.2)

  const problems = [
    {
      title: 'Manual Configuration Hell',
      description: 'Hours spent writing YAML configs, setting up agents, and debugging integrations',
      icon: <FileCode className="w-8 h-8" />,
      color: 'from-red-500 to-orange-500',
      image: (
        <div className="p-4 bg-gray-900 rounded-lg font-mono text-xs text-green-400">
          <div className="opacity-60">sub_agents:</div>
          <div className="ml-4">code_reviewer:</div>
          <div className="ml-8 opacity-40">name: "Expert"</div>
          <div className="ml-8 opacity-40">instructions: |</div>
          <div className="text-red-400 mt-2">⚠️ Error: Invalid config</div>
        </div>
      )
    },
    {
      title: 'Lost in Documentation',
      description: 'Endless docs to understand agents, MCPs, hooks, and commands for Claude Code',
      icon: <Clock className="w-8 h-8" />,
      color: 'from-blue-500 to-cyan-500',
      image: (
        <div className="space-y-2">
          <div className="h-2 bg-gray-300 rounded w-full animate-pulse" />
          <div className="h-2 bg-gray-300 rounded w-4/5 animate-pulse delay-75" />
          <div className="h-2 bg-gray-300 rounded w-3/4 animate-pulse delay-100" />
          <div className="h-2 bg-gray-300 rounded w-5/6 animate-pulse delay-150" />
          <div className="h-2 bg-gray-300 rounded w-2/3 animate-pulse delay-200" />
        </div>
      )
    },
    {
      title: 'Missing Best Practices',
      description: 'No guidance on optimal setups for your specific project type and needs',
      icon: <GitBranch className="w-8 h-8" />,
      color: 'from-purple-500 to-pink-500',
      image: (
        <div className="flex flex-col items-center justify-center h-full">
          <div className="text-6xl mb-2">🤷</div>
          <div className="text-sm text-gray-500">Where do I start?</div>
        </div>
      )
    }
  ]

  return (
    <section ref={ref} className="py-20 px-4 overflow-hidden">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Stop the Configuration Struggle
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Every developer faces the same challenges when setting up Claude Code
          </p>
        </motion.div>

        {/* Sliding Cards Container */}
        <div className="space-y-8">
          {problems.map((problem, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: index % 2 === 0 ? -100 : 100 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              transition={{ 
                duration: 0.8, 
                delay: index * 0.2,
                type: "spring",
                stiffness: 100
              }}
            >
              <Card className="p-8 hover-lift overflow-hidden group">
                <div className="grid md:grid-cols-2 gap-8 items-center">
                  {/* Content Side */}
                  <div className={index % 2 === 0 ? 'order-1' : 'order-2'}>
                    <div className={`inline-flex p-3 rounded-xl bg-gradient-to-br ${problem.color} text-white mb-4`}>
                      {problem.icon}
                    </div>
                    <h3 className="text-2xl font-bold mb-3">{problem.title}</h3>
                    <p className="text-lg text-muted-foreground">{problem.description}</p>
                  </div>

                  {/* Visual Side */}
                  <div className={`${index % 2 === 0 ? 'order-2' : 'order-1'} relative h-48 rounded-lg bg-gray-50 dark:bg-gray-800 p-6 group-hover:scale-105 transition-transform duration-300`}>
                    <div className="absolute inset-0 bg-gradient-to-br opacity-10 rounded-lg" 
                         style={{ backgroundImage: `linear-gradient(135deg, var(--tw-gradient-stops))` }} />
                    {problem.image}
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="text-center mt-16"
        >
          <p className="text-xl text-muted-foreground mb-2">
            What if there was a better way?
          </p>
          <div className="flex items-center justify-center gap-2 text-primary">
            <Zap className="w-5 h-5" />
            <span className="font-semibold">There is.</span>
          </div>
        </motion.div>
      </div>
    </section>
  )
}