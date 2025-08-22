'use client'

/**
 * Hero Section Component
 * Agent: ux-expert
 * Owner: ux-expert
 * Editors: pm, po
 * Inspired by Patio.so with floating elements and playful animations
 */

import React, { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Terminal } from '@/components/ui/terminal'
import { ArrowRight, Code2, Terminal as TerminalIcon, Settings, Sparkles, GitBranch, Package, Zap, Layers } from 'lucide-react'

// Floating icon component
const FloatingIcon = ({ icon: Icon, className, delay = 0 }: { icon: any, className?: string, delay?: number }) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, delay }}
      className={`absolute ${className}`}
    >
      <div className="animate-drift">
        <div className="p-3 bg-white dark:bg-gray-800 rounded-xl shadow-lg">
          <Icon className="w-6 h-6 text-primary" />
        </div>
      </div>
    </motion.div>
  )
}

export const HeroSection: React.FC = () => {
  const [typedText, setTypedText] = useState('')
  const fullText = 'Configure Claude Code in Minutes, Not Hours'
  
  // Typewriter effect
  useEffect(() => {
    let currentIndex = 0
    const interval = setInterval(() => {
      if (currentIndex <= fullText.length) {
        setTypedText(fullText.slice(0, currentIndex))
        currentIndex++
      } else {
        clearInterval(interval)
      }
    }, 50)
    
    return () => clearInterval(interval)
  }, [])

  const handleGetStarted = () => {
    document.getElementById('getting-started')?.scrollIntoView({ 
      behavior: 'smooth',
      block: 'start'
    })
  }

  return (
    <section className="relative min-h-screen flex items-center justify-center px-4 py-20 overflow-hidden bg-gradient-to-b from-background to-gray-50/50 dark:to-gray-900/50">
      {/* Floating Icons - Patio.so style */}
      <FloatingIcon icon={Code2} className="top-20 left-10 lg:left-20" delay={0.2} />
      <FloatingIcon icon={TerminalIcon} className="top-40 right-10 lg:right-32" delay={0.4} />
      <FloatingIcon icon={Settings} className="bottom-32 left-5 lg:left-16" delay={0.6} />
      <FloatingIcon icon={GitBranch} className="bottom-20 right-20 lg:right-40" delay={0.8} />
      <FloatingIcon icon={Package} className="top-1/3 left-1/4 hidden lg:block" delay={1} />
      <FloatingIcon icon={Zap} className="bottom-1/3 right-1/4 hidden lg:block" delay={1.2} />
      <FloatingIcon icon={Layers} className="top-1/2 right-10 hidden lg:block" delay={1.4} />

      <div className="relative z-10 max-w-6xl mx-auto text-center">
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 backdrop-blur-sm rounded-full">
            <Sparkles className="w-4 h-4 text-primary animate-pulse" />
            <span className="text-sm font-medium text-primary">
              AI-Powered Configuration
            </span>
          </div>
        </motion.div>

        {/* Main Headline with typewriter effect */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-5xl md:text-7xl font-bold mb-6 leading-tight"
        >
          <span className="text-foreground">{typedText}</span>
          <span className="animate-pulse">|</span>
        </motion.h1>

        {/* Subheadline */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="text-xl md:text-2xl text-muted-foreground mb-12 max-w-3xl mx-auto"
        >
          Let AI analyze your project and recommend the perfect Claude Code setup. 
          <span className="text-primary font-semibold"> Save hours</span> of configuration time.
        </motion.p>

        {/* CTA Button */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="mb-16"
        >
          <Button
            size="lg"
            onClick={handleGetStarted}
            className="group px-8 py-6 text-lg font-semibold hover-lift bg-primary hover:bg-primary/90 text-white shadow-xl"
          >
            Configure Now
            <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Button>
        </motion.div>

        {/* Terminal Preview */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="max-w-2xl mx-auto"
        >
          <div className="relative">
            <div className="absolute -inset-4 bg-gradient-to-r from-primary/20 to-secondary/20 blur-xl opacity-50" />
            <Terminal className="relative">
              <div className="font-mono text-sm">
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5, delay: 1 }}
                >
                  <span className="text-green-500">$</span> npx caci configure
                </motion.div>
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5, delay: 1.5 }}
                  className="text-gray-500 mt-2"
                >
                  🎨 Analyzing your project structure...
                </motion.div>
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5, delay: 2 }}
                  className="text-gray-500"
                >
                  🤖 AI recommending optimal configuration...
                </motion.div>
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5, delay: 2.5 }}
                  className="text-gray-500"
                >
                  ✨ Ready to transform your development experience!
                </motion.div>
              </div>
            </Terminal>
          </div>
        </motion.div>
      </div>
    </section>
  )
}