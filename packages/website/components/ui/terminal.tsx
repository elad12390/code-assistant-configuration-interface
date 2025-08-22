'use client'

/**
 * Terminal Component
 * Reusable terminal mockup with syntax highlighting
 */

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Copy, Check, Terminal as TerminalIcon } from 'lucide-react'
import { cn } from '@/lib/utils'

interface TerminalProps {
  children: React.ReactNode
  className?: string
  showCopy?: boolean
  title?: string
}

export const Terminal: React.FC<TerminalProps> = ({ 
  children, 
  className,
  showCopy = true,
  title = 'Terminal'
}) => {
  const [copied, setCopied] = useState(false)

  const handleCopy = () => {
    const content = extractTextContent(children)
    navigator.clipboard.writeText(content)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const extractTextContent = (node: React.ReactNode): string => {
    if (typeof node === 'string') return node
    if (React.isValidElement(node)) {
      const children = React.Children.toArray(node.props.children)
      return children.map(child => extractTextContent(child)).join('')
    }
    if (Array.isArray(node)) {
      return node.map(n => extractTextContent(n)).join('')
    }
    return ''
  }

  return (
    <div className={cn('rounded-lg overflow-hidden shadow-2xl', className)}>
      {/* Terminal Header */}
      <div className="bg-gray-800 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="flex gap-2">
            <div className="w-3 h-3 rounded-full bg-red-500" />
            <div className="w-3 h-3 rounded-full bg-yellow-500" />
            <div className="w-3 h-3 rounded-full bg-green-500" />
          </div>
          <span className="text-gray-400 text-sm ml-4 flex items-center gap-2">
            <TerminalIcon className="w-4 h-4" />
            {title}
          </span>
        </div>
        
        {showCopy && (
          <button
            onClick={handleCopy}
            className="text-gray-400 hover:text-white transition-colors p-1 rounded"
            aria-label="Copy to clipboard"
          >
            {copied ? (
              <Check className="w-4 h-4 text-green-400" />
            ) : (
              <Copy className="w-4 h-4" />
            )}
          </button>
        )}
      </div>

      {/* Terminal Content */}
      <div className="bg-gray-900 p-6 overflow-x-auto">
        <div className="relative">
          {children}
          
          {/* Blinking Cursor */}
          <motion.span
            className="inline-block w-2 h-5 bg-gray-300 ml-1 align-text-bottom"
            animate={{ opacity: [1, 0] }}
            transition={{ repeat: Infinity, duration: 1, repeatType: 'loop' }}
          />
        </div>
      </div>
    </div>
  )
}