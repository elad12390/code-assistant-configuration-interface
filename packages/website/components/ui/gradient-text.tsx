/**
 * Gradient Text Component
 * Applies gradient effect to text
 */

import React from 'react'
import { cn } from '@/lib/utils'

interface GradientTextProps {
  children: React.ReactNode
  className?: string
  gradient?: 'blue-cyan' | 'purple-pink' | 'green-teal' | 'orange-red'
}

export const GradientText: React.FC<GradientTextProps> = ({ 
  children, 
  className,
  gradient = 'blue-cyan'
}) => {
  const gradients = {
    'blue-cyan': 'from-blue-600 to-cyan-500',
    'purple-pink': 'from-purple-600 to-pink-500',
    'green-teal': 'from-green-600 to-teal-500',
    'orange-red': 'from-orange-600 to-red-500'
  }

  return (
    <span 
      className={cn(
        'bg-gradient-to-r bg-clip-text text-transparent',
        gradients[gradient],
        className
      )}
    >
      {children}
    </span>
  )
}