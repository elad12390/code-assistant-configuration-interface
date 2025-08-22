'use client'

/**
 * FAQ Section Component
 * Agent: po
 * Owner: po
 * Editors: pm, qa
 */

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useInView } from '@/hooks/useInView'
import { Card } from '@/components/ui/card'
import { ChevronDown, HelpCircle } from 'lucide-react'

interface FAQItem {
  question: string
  answer: string
}

export const FAQSection: React.FC = () => {
  const [ref, isInView] = useInView(0.2)
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  const faqs: FAQItem[] = [
    {
      question: 'Do I need to know Claude Code to use CACI?',
      answer: "No! CACI is designed for developers who want Claude Code's power without needing to master its configuration complexity. We handle all the technical details for you."
    },
    {
      question: 'Will this work with my existing projects?',
      answer: 'Yes. CACI generates configurations that integrate seamlessly with existing codebases and development workflows. It detects your project structure and adapts accordingly.'
    },
    {
      question: 'What if I need to customize the generated config?',
      answer: "CACI generates standard Claude Code configurations that you can modify using normal Claude Code tools. You're never locked into our approach - think of it as a professional starting point."
    },
    {
      question: 'Is my project data safe?',
      answer: 'Absolutely. CACI runs locally on your machine and only asks questions about your setup preferences. Your code and project details never leave your machine.'
    },
    {
      question: 'What languages and frameworks does CACI support?',
      answer: 'CACI supports all major programming languages and frameworks including JavaScript/TypeScript, Python, Java, Go, Rust, and more. It automatically detects your tech stack and configures accordingly.'
    },
    {
      question: 'How often is CACI updated?',
      answer: 'CACI is updated weekly to stay current with the latest Claude Code features and best practices. Your configurations automatically benefit from these improvements.'
    },
    {
      question: 'Can I use CACI with my team?',
      answer: 'Yes! CACI generates shareable configurations that work perfectly for teams. You can commit the generated configs to your repository for consistent setup across all team members.'
    },
    {
      question: 'What if I encounter issues?',
      answer: 'CACI includes comprehensive error handling and helpful troubleshooting guidance. You can also reach out through our GitHub issues for community support.'
    }
  ]

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index)
  }

  return (
    <section ref={ref} className="py-20 px-4 bg-gray-50 dark:bg-gray-900/50">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 dark:bg-blue-900/20 rounded-full mb-6">
            <HelpCircle className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            <span className="text-sm font-medium text-blue-700 dark:text-blue-300">
              Got questions? We've got answers
            </span>
          </div>
          
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Frequently Asked Questions
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300">
            Everything you need to know about CACI
          </p>
        </motion.div>

        {/* FAQ List */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="space-y-4"
        >
          {faqs.map((faq, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.1 * index }}
            >
              <Card 
                className="cursor-pointer hover:shadow-md transition-all duration-200"
                onClick={() => toggleFAQ(index)}
              >
                <div className="p-6">
                  <div className="flex items-start justify-between gap-4">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                      {faq.question}
                    </h3>
                    <ChevronDown 
                      className={`w-5 h-5 text-gray-500 flex-shrink-0 transition-transform duration-200 ${
                        openIndex === index ? 'rotate-180' : ''
                      }`}
                    />
                  </div>
                  
                  <AnimatePresence>
                    {openIndex === index && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="overflow-hidden"
                      >
                        <p className="mt-4 text-gray-600 dark:text-gray-300">
                          {faq.answer}
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        {/* Additional Help */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="mt-12 text-center"
        >
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            Still have questions?
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="https://github.com/elad12390/claude-code-configurator/issues"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 bg-white dark:bg-gray-800 rounded-lg shadow-sm hover:shadow-md transition-shadow"
            >
              <span>Ask on GitHub</span>
            </a>
            <a
              href="/docs"
              className="inline-flex items-center gap-2 px-6 py-3 bg-white dark:bg-gray-800 rounded-lg shadow-sm hover:shadow-md transition-shadow"
            >
              <span>Read the Docs</span>
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  )
}