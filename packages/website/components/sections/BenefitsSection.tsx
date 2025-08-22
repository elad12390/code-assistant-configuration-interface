'use client'

/**
 * Benefits Section Component
 * Agent: analyst
 * Owner: analyst
 * Editors: pm, po
 * Redesigned with Patio.so-inspired floating tag cloud
 */

import React from 'react'
import { motion } from 'framer-motion'
import { useInView } from '@/hooks/useInView'
import { Card } from '@/components/ui/card'
import { 
  Clock, 
  TrendingUp, 
  DollarSign, 
  Rocket, 
  RefreshCw,
  CheckCircle,
  Zap,
  Shield,
  Users,
  GitBranch,
  Code,
  Sparkles
} from 'lucide-react'

interface Benefit {
  icon: React.ReactNode
  title: string
  description: string
  metrics: string[]
  color: string
}

interface FloatingTag {
  text: string
  icon?: React.ReactNode
  size: 'sm' | 'md' | 'lg'
  color: string
  position: { x: number, y: number }
}

export const BenefitsSection: React.FC = () => {
  const [ref, isInView] = useInView(0.2)

  const mainBenefits: Benefit[] = [
    {
      icon: <Clock className="w-6 h-6" />,
      title: 'Minutes, Not Days',
      description: 'What takes experienced developers hours to configure manually, CACI does in under 5 minutes. Get back to building.',
      metrics: [
        'Setup time: 5 minutes vs 2-5 days',
        '95% faster configuration',
        'Zero learning curve'
      ],
      color: 'from-blue-400 to-blue-600'
    },
    {
      icon: <TrendingUp className="w-6 h-6" />,
      title: 'Best Practices Built-In',
      description: 'Every configuration follows proven patterns from successful development teams. No guesswork, no trial and error.',
      metrics: [
        'Industry-standard patterns',
        'Validated configurations',
        'Continuous improvements'
      ],
      color: 'from-purple-400 to-purple-600'
    },
    {
      icon: <DollarSign className="w-6 h-6" />,
      title: 'Cheaper Development',
      description: 'Stop paying developers to read documentation and debug configs. One CACI setup replaces hours of expensive engineering time.',
      metrics: [
        'Save $500-2000 per setup',
        'Reduce onboarding costs by 80%',
        'Eliminate configuration debt'
      ],
      color: 'from-green-400 to-green-600'
    }
  ]

  // Floating tags inspired by Patio.so
  const floatingTags: FloatingTag[] = [
    { text: '40% faster delivery', icon: <Rocket className="w-4 h-4" />, size: 'lg', color: 'bg-orange-100 text-orange-700', position: { x: 10, y: 20 } },
    { text: 'Save $1,250 per setup', size: 'md', color: 'bg-green-100 text-green-700', position: { x: 70, y: 10 } },
    { text: 'Auto-updated weekly', icon: <RefreshCw className="w-4 h-4" />, size: 'md', color: 'bg-blue-100 text-blue-700', position: { x: 30, y: 60 } },
    { text: '95% fewer errors', size: 'sm', color: 'bg-purple-100 text-purple-700', position: { x: 80, y: 40 } },
    { text: 'Industry standards', icon: <Shield className="w-4 h-4" />, size: 'md', color: 'bg-indigo-100 text-indigo-700', position: { x: 15, y: 80 } },
    { text: 'Team productivity +40%', icon: <Users className="w-4 h-4" />, size: 'lg', color: 'bg-pink-100 text-pink-700', position: { x: 60, y: 75 } },
    { text: 'Git workflow ready', icon: <GitBranch className="w-4 h-4" />, size: 'sm', color: 'bg-cyan-100 text-cyan-700', position: { x: 45, y: 30 } },
    { text: 'Zero config debt', size: 'md', color: 'bg-red-100 text-red-700', position: { x: 25, y: 45 } },
    { text: 'Best practices', icon: <Code className="w-4 h-4" />, size: 'sm', color: 'bg-teal-100 text-teal-700', position: { x: 85, y: 65 } },
    { text: 'Immediate ROI', icon: <Zap className="w-4 h-4" />, size: 'md', color: 'bg-yellow-100 text-yellow-700', position: { x: 50, y: 50 } }
  ]

  return (
    <section ref={ref} className="py-20 px-4 overflow-hidden">
      <div className="max-w-7xl mx-auto">
        {/* Header with animated text */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-5xl font-bold mb-6">
            {['Why', 'Choose', 'CACI?'].map((word, index) => (
              <motion.span
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: index * 0.1 }}
                className="inline-block mr-3"
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
            Transform Claude Code from a powerful tool you'll eventually configure 
            to a productivity superpower you can use today
          </motion.p>
        </motion.div>

        {/* Main Benefits Cards */}
        <div className="grid md:grid-cols-3 gap-8 mb-20">
          {mainBenefits.map((benefit, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={isInView ? { opacity: 1, scale: 1 } : {}}
              transition={{ 
                duration: 0.5, 
                delay: index * 0.1,
                type: "spring"
              }}
              whileHover={{ y: -5 }}
            >
              <Card className="p-6 h-full hover-lift bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
                <div className={`inline-flex p-3 rounded-lg bg-gradient-to-br ${benefit.color} text-white mb-4`}>
                  {benefit.icon}
                </div>
                <h3 className="text-xl font-bold mb-3">{benefit.title}</h3>
                <p className="text-gray-600 dark:text-gray-300 mb-4 text-sm">
                  {benefit.description}
                </p>
                <ul className="space-y-2">
                  {benefit.metrics.map((metric, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-sm">
                      <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                      <span className="text-gray-700 dark:text-gray-400">{metric}</span>
                    </li>
                  ))}
                </ul>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Floating Tags Cloud - Patio.so Style */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ delay: 0.5 }}
          className="relative h-96 mb-16"
        >
          <div className="absolute inset-0 flex items-center justify-center">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 50, repeat: Infinity, ease: "linear" }}
              className="absolute"
            >
              <Sparkles className="w-8 h-8 text-primary/20" />
            </motion.div>
          </div>

          {floatingTags.map((tag, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0 }}
              animate={isInView ? { 
                opacity: 1, 
                scale: 1,
                x: [0, Math.random() * 20 - 10, 0],
                y: [0, Math.random() * 20 - 10, 0]
              } : {}}
              transition={{ 
                opacity: { delay: 0.6 + index * 0.1 },
                scale: { delay: 0.6 + index * 0.1, type: "spring" },
                x: { duration: 5 + Math.random() * 5, repeat: Infinity, ease: "easeInOut" },
                y: { duration: 4 + Math.random() * 6, repeat: Infinity, ease: "easeInOut" }
              }}
              className="absolute"
              style={{ 
                left: `${tag.position.x}%`, 
                top: `${tag.position.y}%`,
                transform: 'translate(-50%, -50%)'
              }}
            >
              <motion.button
                whileHover={{ scale: 1.1, rotate: [-1, 1, -1, 0] }}
                whileTap={{ scale: 0.95 }}
                className={`
                  ${tag.size === 'lg' ? 'px-6 py-3 text-base' : 
                    tag.size === 'md' ? 'px-4 py-2 text-sm' : 
                    'px-3 py-1.5 text-xs'}
                  ${tag.color}
                  rounded-full shadow-md hover:shadow-lg transition-shadow
                  flex items-center gap-2 font-medium cursor-pointer
                `}
              >
                {tag.icon}
                {tag.text}
              </motion.button>
            </motion.div>
          ))}
        </motion.div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.8 }}
          className="text-center"
        >
          <p className="text-lg text-gray-600 dark:text-gray-300 mb-2">
            Join thousands of developers who've already supercharged their Claude Code experience
          </p>
          <motion.div
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="inline-flex items-center gap-2 text-primary font-semibold"
          >
            <Zap className="w-5 h-5" />
            <span>Experience the difference today</span>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}