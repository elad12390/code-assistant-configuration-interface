'use client'

/**
 * Problem Section Component
 * Agent: analyst
 * Owner: analyst
 * Editors: pm, ux-expert
 */

import React from 'react'
import { motion } from 'framer-motion'
import { useInView } from '@/hooks/useInView'
import { Card } from '@/components/ui/card'
import { 
  Clock, 
  FileCode, 
  Bug, 
  BookOpen,
  AlertCircle,
  Settings 
} from 'lucide-react'

export const ProblemSection: React.FC = () => {
  const [ref, isInView] = useInView(0.2)

  const problemPoints = [
    {
      icon: <BookOpen className="w-5 h-5" />,
      title: 'Sub-agents',
      description: 'for specialized tasks'
    },
    {
      icon: <Settings className="w-5 h-5" />,
      title: 'Hooks',
      description: 'for automated workflows'
    },
    {
      icon: <FileCode className="w-5 h-5" />,
      title: 'MCP integrations',
      description: 'for external tools'
    },
    {
      icon: <AlertCircle className="w-5 h-5" />,
      title: 'Custom commands',
      description: 'for your specific needs'
    }
  ]

  const painPoints = [
    {
      icon: <Clock className="w-6 h-6 text-orange-500" />,
      text: 'Days spent reading documentation'
    },
    {
      icon: <FileCode className="w-6 h-6 text-red-500" />,
      text: 'Complex YAML configurations'
    },
    {
      icon: <Bug className="w-6 h-6 text-purple-500" />,
      text: 'Debugging integration issues'
    }
  ]

  return (
    <section ref={ref} className="py-20 px-4 bg-gray-50 dark:bg-gray-900/50">
      <div className="max-w-6xl mx-auto">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Left: Problem Description */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              The Problem Every Developer Faces
            </h2>
            
            <p className="text-lg text-gray-600 dark:text-gray-300 mb-8">
              You know Claude Code can transform your development workflow with:
            </p>

            <div className="grid grid-cols-2 gap-4 mb-8">
              {problemPoints.map((point, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={isInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-start gap-3"
                >
                  <div className="mt-1 text-blue-600 dark:text-blue-400">
                    {point.icon}
                  </div>
                  <div>
                    <p className="font-semibold">{point.title}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {point.description}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>

            <p className="text-lg text-gray-700 dark:text-gray-300 font-medium">
              But between reading documentation, writing YAML configs, setting up 
              file structures, and debugging integration issues...
            </p>

            <div className="mt-8 space-y-4">
              {painPoints.map((pain, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={isInView ? { opacity: 1, x: 0 } : {}}
                  transition={{ delay: 0.4 + index * 0.1 }}
                  className="flex items-center gap-4"
                >
                  {pain.icon}
                  <span className="text-gray-700 dark:text-gray-300">
                    {pain.text}
                  </span>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Right: Visual Representation */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="relative"
          >
            <Card className="p-6 bg-gray-900 text-green-400 font-mono text-sm overflow-hidden group">
              <div className="absolute inset-0 bg-gradient-to-br from-red-500/10 to-orange-500/10 group-hover:opacity-0 transition-opacity duration-500" />
              
              <div className="relative">
                <div className="mb-4 text-gray-500">
                  # claude-config.yaml
                </div>
                <pre className="text-xs leading-relaxed">
{`sub_agents:
  code_reviewer:
    name: "Code Review Expert"
    instructions: |
      You are a senior developer...
      Focus on code quality...
      # 200+ lines of config...
    
hooks:
  pre_commit:
    - name: "Format Check"
      command: |
        # Complex bash scripts...
        # More configuration...
    
mcp_servers:
  database:
    command: "node"
    args: ["server.js"]
    env:
      # Environment setup...
      # Integration configs...`}
                </pre>
                
                <motion.div
                  className="mt-4 text-center text-red-400"
                  animate={isInView ? { opacity: [0.5, 1, 0.5] } : {}}
                  transition={{ repeat: Infinity, duration: 2 }}
                >
                  ⚠️ Error: Invalid configuration
                </motion.div>
              </div>
            </Card>

            <motion.p
              initial={{ opacity: 0 }}
              animate={isInView ? { opacity: 1 } : {}}
              transition={{ delay: 0.8 }}
              className="text-center mt-6 text-gray-600 dark:text-gray-400 italic"
            >
              You're looking at days of setup time—if you get it right the first time.
            </motion.p>
          </motion.div>
        </div>
      </div>
    </section>
  )
}