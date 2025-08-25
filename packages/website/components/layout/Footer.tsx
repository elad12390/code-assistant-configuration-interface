'use client'

import React from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Terminal, Github, ExternalLink, FileText, Package, MessageSquare, Users, Heart, Sparkles, Twitter } from 'lucide-react'
import { NewsletterSignup } from '@/components/ui/newsletter-signup'

export const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear()

  const footerSections = {
    product: {
      title: 'Product',
      links: [
        { name: 'Getting Started', href: '#getting-started' },
        { name: 'Features', href: '#features' },
        { name: 'Documentation', href: 'https://github.com/elad12390/claude-code-configurator/blob/main/README.md', external: true },
        { name: 'Changelog', href: 'https://github.com/elad12390/claude-code-configurator/releases', external: true },
        { name: 'npm Package', href: 'https://www.npmjs.com/package/code-assistant-config-interface', external: true }
      ]
    },
    developers: {
      title: 'Developers',
      links: [
        { name: 'GitHub', href: 'https://github.com/elad12390/claude-code-configurator', external: true },
        { name: 'Contributing', href: 'https://github.com/elad12390/claude-code-configurator/blob/main/CONTRIBUTING.md', external: true },
        { name: 'Issues', href: 'https://github.com/elad12390/claude-code-configurator/issues', external: true },
        { name: 'Discussions', href: 'https://github.com/elad12390/claude-code-configurator/discussions', external: true }
      ]
    },
    community: {
      title: 'Community',
      links: [
        { name: 'Discord', href: '#', external: true },
        { name: 'X (Twitter)', href: 'https://x.com/DevCaci1', external: true },
        { name: 'Blog', href: '#', external: true },
        { name: 'Newsletter', href: '#newsletter', external: false }
      ]
    }
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  }

  return (
    <footer className="bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-950 border-t border-gray-200/50 dark:border-gray-800/50">
      <div className="max-w-7xl mx-auto px-4 py-16">
        {/* Newsletter Section */}
        <motion.div
          id="newsletter"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-16 text-center"
        >
          <div className="max-w-2xl mx-auto">
            <h3 className="text-2xl font-bold text-foreground mb-2">
              Stay Updated with CACI
            </h3>
            <p className="text-muted-foreground mb-6">
              Get notified about new features, updates, and improvements. No spam, just valuable updates.
            </p>
            <NewsletterSignup 
              variant="default"
              placeholder="Enter your email for CACI updates"
              buttonText="Get Updates"
            />
          </div>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-8 md:gap-12">
          {/* Brand Section - Larger column */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="md:col-span-2 space-y-4"
          >
            <div className="flex items-center space-x-2 group">
              <motion.div
                whileHover={{ rotate: 360 }}
                transition={{ duration: 0.5 }}
                className="relative"
              >
                <Terminal className="w-10 h-10 text-primary" />
                <Sparkles className="w-4 h-4 text-secondary absolute -top-1 -right-1" />
              </motion.div>
              <span className="text-2xl font-bold text-foreground">
                CACI
              </span>
            </div>
            <p className="text-muted-foreground max-w-xs">
              Intelligent Claude Code configuration that understands your project needs and sets up everything perfectly in minutes.
            </p>
            <div className="flex items-center gap-4 pt-2">
              <motion.a
                href="https://github.com/elad12390/claude-code-configurator"
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                <Github className="w-6 h-6" />
              </motion.a>
              <motion.a
                href="https://www.npmjs.com/package/code-assistant-config-interface"
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                <Package className="w-6 h-6" />
              </motion.a>
              <motion.a
                href="https://x.com/DevCaci1"
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                <Twitter className="w-6 h-6" />
              </motion.a>
            </div>
          </motion.div>

          {/* Links Sections */}
          {Object.entries(footerSections).map(([key, section], index) => (
            <motion.div
              key={key}
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="space-y-4"
            >
              <motion.h3 
                variants={itemVariants}
                className="font-semibold text-foreground"
              >
                {section.title}
              </motion.h3>
              <ul className="space-y-3">
                {section.links.map((link) => (
                  <motion.li key={link.name} variants={itemVariants}>
                    <Link 
                      href={link.href}
                      className="text-sm text-muted-foreground hover:text-primary transition-colors inline-flex items-center gap-1 group"
                      target={link.external ? '_blank' : undefined}
                      rel={link.external ? 'noopener noreferrer' : undefined}
                    >
                      {link.name}
                      {link.external && (
                        <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                      )}
                    </Link>
                  </motion.li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>

        {/* Bottom Section */}
        <motion.div 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-800"
        >
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-6 text-sm text-muted-foreground">
              <span>© {currentYear} CACI</span>
              <Link href="/privacy" className="hover:text-primary transition-colors">
                Privacy
              </Link>
              <Link href="/terms" className="hover:text-primary transition-colors">
                Terms
              </Link>
            </div>
            <motion.div 
              className="flex items-center gap-2 text-sm text-muted-foreground"
              animate={{ scale: [1, 1.05, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <span>Made with</span>
              <Heart className="w-4 h-4 text-red-500 fill-red-500" />
              <span>by</span>
              <Link 
                href="https://github.com/elad12390" 
                target="_blank" 
                rel="noopener noreferrer"
                className="hover:text-primary transition-colors font-medium"
              >
                Elad Ben Haim
              </Link>
              <span>&</span>
              <Link 
                href="https://github.com/smartari1" 
                target="_blank" 
                rel="noopener noreferrer"
                className="hover:text-primary transition-colors font-medium"
              >
                Ari Kliger
              </Link>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </footer>
  )
}