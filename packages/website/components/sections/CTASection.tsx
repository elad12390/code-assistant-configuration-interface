'use client'

/**
 * CTA Section Component
 * Agent: ux-expert
 * Owner: ux-expert
 * Editors: pm, po
 */

import React from 'react'
import { motion } from 'framer-motion'
import { useInView } from '@/hooks/useInView'
import { Button } from '@/components/ui/button'
import { Terminal } from '@/components/ui/terminal'
import { GradientText } from '@/components/ui/gradient-text'
import { ArrowRight, Zap, CheckCircle } from 'lucide-react'

export const CTASection: React.FC = () => {
  const [ref, isInView] = useInView(0.2)

  const benefits = [
    'Professional Claude Code setup in minutes',
    'Best practices built into every configuration',
    'Save hours of setup and debugging time',
    'Start shipping features immediately'
  ]

  return (
    <section ref={ref} className="py-20 px-4 bg-gradient-to-b from-blue-50 to-cyan-50 dark:from-blue-950/20 dark:to-cyan-950/20">
      <div className="max-w-4xl mx-auto text-center">
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100 dark:bg-blue-900/30 rounded-full mb-8"
        >
          <Zap className="w-4 h-4 text-blue-600 dark:text-blue-400" />
          <span className="text-sm font-medium text-blue-700 dark:text-blue-300">
            Join thousands of developers shipping faster
          </span>
        </motion.div>

        {/* Headline */}
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-4xl md:text-5xl font-bold mb-6"
        >
          <GradientText>
            The Bottom Line
          </GradientText>
        </motion.h2>

        {/* Main Message */}
        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-xl md:text-2xl text-gray-700 dark:text-gray-300 mb-8 leading-relaxed"
        >
          CACI transforms Claude Code from a powerful tool you'll 
          <span className="font-semibold"> eventually configure</span> to 
          a productivity superpower you can 
          <span className="font-semibold text-blue-600 dark:text-blue-400"> use today</span>.
        </motion.p>

        {/* Benefits List */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="grid md:grid-cols-2 gap-4 max-w-2xl mx-auto mb-12"
        >
          {benefits.map((benefit, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.4 + index * 0.1 }}
              className="flex items-center gap-3 text-left"
            >
              <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
              <span className="text-gray-700 dark:text-gray-300">{benefit}</span>
            </motion.div>
          ))}
        </motion.div>

        {/* Terminal Example */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="mb-12 max-w-xl mx-auto"
        >
          <Terminal title="Get Started">
            <div className="font-mono text-sm">
              <span className="text-green-500">$</span> npx caci init
              <br />
              <br />
              <span className="text-gray-500">
                ✨ Welcome to CACI!
                <br />
                <br />
                This wizard will help you create a perfect Claude Code
                <br />
                configuration for your project in just a few steps.
                <br />
                <br />
                Ready to supercharge your development workflow?
              </span>
            </div>
          </Terminal>
        </motion.div>

        {/* Final CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="space-y-4"
        >
          <p className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-6">
            Stop letting configuration complexity slow you down.
            <br />
            Start shipping faster with Claude Code configurations that actually work.
          </p>
          
          <Button 
            size="lg" 
            className="group px-8 py-6 text-lg font-semibold"
            onClick={() => document.getElementById('getting-started')?.scrollIntoView({ behavior: 'smooth' })}
          >
            Get Started with CACI
            <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Button>
          
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-4">
            Free to use • Open source • No account required
          </p>
        </motion.div>
      </div>
    </section>
  )
}