'use client'

/**
 * Newsletter Signup Component
 * Collects emails for future updates and saves to Google Sheets
 */

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Mail, Check, AlertCircle, Loader2 } from 'lucide-react'

interface NewsletterSignupProps {
  variant?: 'default' | 'compact' | 'inline'
  className?: string
  placeholder?: string
  buttonText?: string
  showIcon?: boolean
}

export const NewsletterSignup: React.FC<NewsletterSignupProps> = ({
  variant = 'default',
  className = '',
  placeholder = 'Enter your email for updates',
  buttonText = 'Subscribe',
  showIcon = true
}) => {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [message, setMessage] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!email.trim()) {
      setStatus('error')
      setMessage('Please enter your email address')
      return
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      setStatus('error')
      setMessage('Please enter a valid email address')
      return
    }

    setStatus('loading')
    setMessage('')

    try {
      const response = await fetch('/api/newsletter', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: email.trim() }),
      })

      const data = await response.json()

      if (response.ok) {
        setStatus('success')
        setMessage('Thank you! You\'ll be notified about CACI updates.')
        setEmail('')
      } else {
        setStatus('error')
        setMessage(data.error || 'Something went wrong. Please try again.')
      }
    } catch (error) {
      setStatus('error')
      setMessage('Network error. Please try again.')
    }

    // Reset status after a few seconds
    setTimeout(() => {
      if (status !== 'success') {
        setStatus('idle')
        setMessage('')
      }
    }, 5000)
  }

  const getVariantStyles = () => {
    switch (variant) {
      case 'compact':
        return {
          container: 'flex flex-col space-y-2 max-w-xs',
          form: 'flex space-x-2',
          input: 'flex-1 px-3 py-2 text-sm',
          button: 'px-4 py-2 text-sm'
        }
      case 'inline':
        return {
          container: 'flex flex-col space-y-2 w-full',
          form: 'flex space-x-2',
          input: 'flex-1 px-4 py-2',
          button: 'px-6 py-2 whitespace-nowrap'
        }
      default:
        return {
          container: 'flex flex-col space-y-4 max-w-md mx-auto',
          form: 'flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2',
          input: 'flex-1 px-4 py-3',
          button: 'px-6 py-3 sm:px-8'
        }
    }
  }

  const styles = getVariantStyles()

  return (
    <div className={`${styles.container} ${className}`}>
      <form onSubmit={handleSubmit} className={styles.form}>
        <div className="relative flex-1">
          {showIcon && variant === 'default' && (
            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          )}
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder={placeholder}
            disabled={status === 'loading' || status === 'success'}
            className={`
              ${styles.input}
              ${showIcon && variant === 'default' ? 'pl-10' : ''}
              w-full border border-gray-300 dark:border-gray-600 
              rounded-lg bg-white dark:bg-gray-800 
              text-gray-900 dark:text-gray-100
              placeholder-gray-500 dark:placeholder-gray-400
              focus:ring-2 focus:ring-primary focus:border-transparent
              disabled:opacity-50 disabled:cursor-not-allowed
              transition-all duration-200
            `}
          />
        </div>
        
        <Button
          type="submit"
          disabled={status === 'loading' || status === 'success'}
          className={`
            ${styles.button}
            bg-primary hover:bg-primary/90 text-white font-medium
            disabled:opacity-50 disabled:cursor-not-allowed
            transition-all duration-200
          `}
        >
          {status === 'loading' && (
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
          )}
          {status === 'success' && (
            <Check className="w-4 h-4 mr-2" />
          )}
          {status === 'success' ? 'Subscribed!' : buttonText}
        </Button>
      </form>

      {/* Status Message */}
      {message && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className={`
            flex items-center gap-2 text-sm p-2 rounded
            ${status === 'success' 
              ? 'text-green-700 dark:text-green-300 bg-green-50 dark:bg-green-900/20' 
              : 'text-red-700 dark:text-red-300 bg-red-50 dark:bg-red-900/20'
            }
          `}
        >
          {status === 'success' ? (
            <Check className="w-4 h-4 flex-shrink-0" />
          ) : (
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
          )}
          <span>{message}</span>
        </motion.div>
      )}
    </div>
  )
}