'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import { 
  Github, 
  Menu, 
  Users, 
  X,
  Terminal
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
    { name: 'Creator 1', github: 'https://github.com/creator1' },
    { name: 'Creator 2', github: 'https://github.com/creator2' }
  ]

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled 
          ? 'bg-white/80 dark:bg-gray-900/80 backdrop-blur-md shadow-md' 
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <div className="flex items-center">
              <Terminal className="w-8 h-8 text-blue-600 dark:text-blue-400" />
              <span className="ml-2 text-xl font-bold bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">
                CACI
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            <Link 
              href="https://github.com/your-repo/caci" 
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center space-x-2 text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
            >
              <Github className="w-5 h-5" />
              <span>GitHub</span>
            </Link>

            {/* Creators Dropdown */}
            <div className="relative group">
              <button className="flex items-center space-x-2 text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                <Users className="w-5 h-5" />
                <span>Creators</span>
              </button>
              
              <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                <div className="py-2">
                  {creators.map((creator, index) => (
                    <a
                      key={index}
                      href={creator.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                    >
                      {creator.name}
                    </a>
                  ))}
                </div>
              </div>
            </div>

            <Button 
              variant="default" 
              size="sm"
              onClick={() => document.getElementById('getting-started')?.scrollIntoView({ behavior: 'smooth' })}
            >
              Get Started
            </Button>
          </nav>

          {/* Mobile Menu Button */}
          <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
            <SheetTrigger asChild className="md:hidden">
              <Button variant="ghost" size="icon">
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px] sm:w-[400px]">
              <nav className="flex flex-col space-y-4 mt-8">
                <Link 
                  href="https://github.com/your-repo/caci" 
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center space-x-2 text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
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
                      className="block pl-7 text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400"
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
    </header>
  )
}