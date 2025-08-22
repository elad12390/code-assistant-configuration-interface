'use client'

/**
 * Hero Section Component
 * Agent: ux-expert
 * Owner: ux-expert
 * Editors: pm, po
 */

import React from 'react'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Terminal } from '@/components/ui/terminal'
import { GradientText } from '@/components/ui/gradient-text'
import { ArrowRight, Sparkles } from 'lucide-react'

export const HeroSection: React.FC = () => {
  const fadeInUp = {
    initial: { opacity: 0, y: 30 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6, ease: 'easeOut' }
  }

  const handleGetStarted = () => {
    // Scroll to getting started section
    document.getElementById('getting-started')?.scrollIntoView({ 
      behavior: 'smooth',
      block: 'start'
    })
  }

  return (
    <section className="relative min-h-screen flex items-center justify-center px-4 py-20 overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-grid-pattern opacity-5" />
      
      {/* Gradient Orbs */}
      <div className="absolute top-1/4 -left-1/4 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 -right-1/4 w-96 h-96 bg-cyan-500/20 rounded-full blur-3xl" />

      <div className="relative z-10 max-w-6xl mx-auto text-center">
        <motion.div
          initial={fadeInUp.initial}
          animate={fadeInUp.animate}
          transition={fadeInUp.transition}
          className="mb-6"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 dark:bg-blue-900/20 rounded-full mb-8">
            <Sparkles className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            <span className="text-sm font-medium text-blue-700 dark:text-blue-300">
              Claude Code Configuration Made Simple
            </span>
          </div>
        </motion.div>

        <motion.h1
          initial={fadeInUp.initial}
          animate={fadeInUp.animate}
          transition={{ ...fadeInUp.transition, delay: 0.1 }}
          className="text-5xl md:text-7xl font-bold mb-6"
        >
          <GradientText>
            Stop Wrestling with
            <br />
            Claude Code Configs
          </GradientText>
        </motion.h1>

        <motion.p
          initial={fadeInUp.initial}
          animate={fadeInUp.animate}
          transition={{ ...fadeInUp.transition, delay: 0.2 }}
          className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 mb-12 max-w-3xl mx-auto"
        >
          Start shipping faster with intelligent, automated Claude Code configuration 
          that understands your project and sets up everything perfectly in minutes.
        </motion.p>

        <motion.div
          initial={fadeInUp.initial}
          animate={fadeInUp.animate}
          transition={{ ...fadeInUp.transition, delay: 0.3 }}
          className="mb-16"
        >
          <Button
            size="lg"
            onClick={handleGetStarted}
            className="group px-8 py-6 text-lg font-semibold"
          >
            Get Started Now
            <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Button>
        </motion.div>

        <motion.div
          initial={fadeInUp.initial}
          animate={fadeInUp.animate}
          transition={{ ...fadeInUp.transition, delay: 0.4 }}
          className="max-w-2xl mx-auto"
        >
          <Terminal>
            <div className="font-mono text-sm">
              <span className="text-green-500">$</span> npx caci init
              <br />
              <span className="text-gray-500">
                <br />
                🚀 Welcome to CACI - Claude Code Configuration Interface
                <br />
                <br />
                ? What type of project are you building? (Use arrow keys)
                <br />
                <span className="text-cyan-400">❯ Full-stack web application</span>
                <br />
                {'  '}Backend API service
                <br />
                {'  '}CLI tool
                <br />
                {'  '}Mobile application
                <br />
                {'  '}Other
              </span>
            </div>
          </Terminal>
        </motion.div>
      </div>
    </section>
  )
}