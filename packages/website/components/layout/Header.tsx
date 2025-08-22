'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import { 
  Github, 
  Menu, 
  Users, 
  X,
  Terminal,
  Sparkles
} from 'lucide-react'

export const Header: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const creators = [
    { name: 'Ari Kliger', github: 'https://github.com/smartari1' },
    { name: 'Elad Ben Haim', github: 'https://github.com/elad12390' }
  ]

  return (
    <motion.header 
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5, type: "spring" }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled 
          ? 'bg-white/95 dark:bg-gray-900/95 backdrop-blur-lg shadow-sm py-2' 
          : 'bg-transparent py-4'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between">
          {/* Logo with animation */}
          <Link href="/" className="flex items-center space-x-2 group">
            <motion.div 
              className="flex items-center"
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 400 }}
            >
              <div className="relative">
                <Terminal className="w-8 h-8 text-primary" />
                <motion.div
                  className="absolute -top-1 -right-1"
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <Sparkles className="w-3 h-3 text-secondary" />
                </motion.div>
              </div>
              <span className="ml-2 text-xl font-bold text-foreground">
                CACI
              </span>
            </motion.div>
          </Link>

          {/* Desktop Navigation - Minimal like Patio.so */}
          <nav className="hidden md:flex items-center space-x-8">
            <motion.a 
              href="https://github.com/elad12390/claude-code-configurator" 
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
              whileHover={{ y: -2 }}
              transition={{ type: "spring", stiffness: 400 }}
            >
              GitHub
            </motion.a>

            {/* Creators with hover effect */}
            <div className="relative group">
              <motion.button 
                className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1"
                whileHover={{ y: -2 }}
                transition={{ type: "spring", stiffness: 400 }}
              >
                Creators
              </motion.button>
              
              <AnimatePresence>
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  whileHover={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-xl shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 overflow-hidden"
                >
                  <div className="py-1">
                    {creators.map((creator, index) => (
                      <motion.a
                        key={index}
                        href={creator.github}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block px-4 py-3 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                        whileHover={{ x: 4 }}
                        transition={{ type: "spring", stiffness: 400 }}
                      >
                        {creator.name}
                      </motion.a>
                    ))}
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>

            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              transition={{ type: "spring", stiffness: 400 }}
            >
              <Button 
                size="sm"
                onClick={() => document.getElementById('getting-started')?.scrollIntoView({ behavior: 'smooth' })}
                className="bg-primary hover:bg-primary/90 text-white shadow-md hover:shadow-lg transition-all"
              >
                Get Started
              </Button>
            </motion.div>
          </nav>

          {/* Mobile Menu Button */}
          <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
            <SheetTrigger asChild className="md:hidden">
              <motion.div
                whileTap={{ scale: 0.9 }}
                transition={{ type: "spring", stiffness: 400 }}
              >
                <Button variant="ghost" size="icon">
                  <Menu className="h-6 w-6" />
                </Button>
              </motion.div>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px] sm:w-[400px]">
              <nav className="flex flex-col space-y-4 mt-8">
                <Link 
                  href="https://github.com/elad12390/claude-code-configurator" 
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center space-x-2 text-gray-700 dark:text-gray-300 hover:text-primary transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <Github className="w-5 h-5" />
                  <span>GitHub</span>
                </Link>

                <div className="space-y-2">
                  <p className="text-sm font-semibold text-gray-600 dark:text-gray-400">Creators</p>
                  {creators.map((creator, index) => (
                    <a
                      key={index}
                      href={creator.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block pl-7 text-gray-700 dark:text-gray-300 hover:text-primary transition-colors"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      {creator.name}
                    </a>
                  ))}
                </div>

                <Button 
                  variant="default" 
                  className="w-full"
                  onClick={() => {
                    setIsMobileMenuOpen(false)
                    document.getElementById('getting-started')?.scrollIntoView({ behavior: 'smooth' })
                  }}
                >
                  Get Started
                </Button>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </motion.header>
  )
}