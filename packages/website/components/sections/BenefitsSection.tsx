/**
 * Benefits Section Component
 * Agent: analyst
 * Owner: analyst
 * Editors: pm, po
 */

import React from 'react'
import { motion } from 'framer-motion'
import { useInView } from '@/hooks/useInView'
import { Card } from '@/components/ui/card'
import { 
  Clock, 
  TrendingUp, 
  DollarSign, 
  Rocket, 
  RefreshCw,
  CheckCircle
} from 'lucide-react'

interface Benefit {
  icon: React.ReactNode
  title: string
  description: string
  metrics: string[]
  visual: React.ReactNode
}

export const BenefitsSection: React.FC = () => {
  const [ref, isInView] = useInView(0.2)

  const benefits: Benefit[] = [
    {
      icon: <Clock className="w-8 h-8" />,
      title: 'Minutes, Not Days',
      description: 'What takes experienced developers hours to configure manually, CACI does in under 5 minutes. Get back to building.',
      metrics: [
        'Setup time: 5 minutes vs 2-5 days',
        '95% faster configuration',
        'Zero learning curve'
      ],
      visual: <TimeComparisonVisual />
    },
    {
      icon: <TrendingUp className="w-8 h-8" />,
      title: 'Best Practices Built-In',
      description: 'Every configuration follows proven patterns from successful development teams. No guesswork, no trial and error.',
      metrics: [
        'Industry-standard patterns',
        'Validated configurations',
        'Continuous improvements'
      ],
      visual: <BestPracticesVisual />
    },
    {
      icon: <DollarSign className="w-8 h-8" />,
      title: 'Cheaper Development',
      description: 'Stop paying developers to read documentation and debug configs. One CACI setup replaces hours of expensive engineering time.',
      metrics: [
        'Save $500-2000 per setup',
        'Reduce onboarding costs by 80%',
        'Eliminate configuration debt'
      ],
      visual: <CostSavingsVisual />
    },
    {
      icon: <Rocket className="w-8 h-8" />,
      title: 'Faster Delivery',
      description: 'Ship features faster with Claude Code working optimally from day one. No ramp-up time, no suboptimal configurations.',
      metrics: [
        '40% faster feature delivery',
        'Immediate productivity',
        'Consistent team velocity'
      ],
      visual: <DeliverySpeedVisual />
    },
    {
      icon: <RefreshCw className="w-8 h-8" />,
      title: 'Always Up-to-Date',
      description: 'CACI stays current with Claude Code\'s latest features and best practices. Your config automatically benefits from the latest optimizations.',
      metrics: [
        'Weekly updates',
        'New features auto-integrated',
        'Breaking changes handled'
      ],
      visual: <UpdatesVisual />
    }
  ]

  return (
    <section ref={ref} className="py-20 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Why Choose CACI?
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Transform Claude Code from a powerful tool you'll eventually configure 
            to a productivity superpower you can use today
          </p>
        </motion.div>

        {/* Benefits List */}
        <div className="space-y-24">
          {benefits.map((benefit, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 50 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className={`grid md:grid-cols-2 gap-12 items-center ${
                index % 2 === 1 ? 'md:flex-row-reverse' : ''
              }`}
            >
              {/* Content */}
              <div className={index % 2 === 1 ? 'md:order-2' : ''}>
                <div className="flex items-center gap-4 mb-6">
                  <div className="p-3 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-500 text-white">
                    {benefit.icon}
                  </div>
                  <h3 className="text-2xl md:text-3xl font-bold">{benefit.title}</h3>
                </div>
                
                <p className="text-lg text-gray-600 dark:text-gray-300 mb-6">
                  {benefit.description}
                </p>

                <ul className="space-y-3">
                  {benefit.metrics.map((metric, idx) => (
                    <li key={idx} className="flex items-center gap-3">
                      <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                      <span className="text-gray-700 dark:text-gray-300">{metric}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Visual */}
              <div className={index % 2 === 1 ? 'md:order-1' : ''}>
                <Card className="p-8 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900">
                  {benefit.visual}
                </Card>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

// Visual Components
const TimeComparisonVisual: React.FC = () => (
  <div className="space-y-4">
    <div className="space-y-2">
      <div className="flex justify-between text-sm">
        <span>Manual Setup</span>
        <span className="text-red-500">2-5 days</span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-4">
        <div className="bg-red-500 h-4 rounded-full" style={{ width: '100%' }} />
      </div>
    </div>
    <div className="space-y-2">
      <div className="flex justify-between text-sm">
        <span>CACI Setup</span>
        <span className="text-green-500">5 minutes</span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-4">
        <div className="bg-green-500 h-4 rounded-full" style={{ width: '2%' }} />
      </div>
    </div>
  </div>
)

const BestPracticesVisual: React.FC = () => (
  <div className="grid grid-cols-2 gap-4">
    {['Security', 'Performance', 'Scalability', 'Maintainability'].map((practice) => (
      <div key={practice} className="text-center p-4 bg-white dark:bg-gray-800 rounded-lg">
        <CheckCircle className="w-8 h-8 text-green-500 mx-auto mb-2" />
        <p className="text-sm font-medium">{practice}</p>
      </div>
    ))}
  </div>
)

const CostSavingsVisual: React.FC = () => (
  <div className="text-center">
    <div className="text-5xl font-bold text-green-500 mb-2">$1,250</div>
    <p className="text-gray-600 dark:text-gray-400">Average saved per setup</p>
    <div className="mt-4 text-sm text-gray-500">
      Based on 10 hours saved at $125/hour developer rate
    </div>
  </div>
)

const DeliverySpeedVisual: React.FC = () => (
  <div className="space-y-4">
    <div className="flex items-center justify-between">
      <span className="text-sm">Feature Delivery</span>
      <span className="text-sm font-bold text-green-500">+40%</span>
    </div>
    <div className="flex items-center justify-between">
      <span className="text-sm">Time to First Commit</span>
      <span className="text-sm font-bold text-green-500">-90%</span>
    </div>
    <div className="flex items-center justify-between">
      <span className="text-sm">Configuration Errors</span>
      <span className="text-sm font-bold text-green-500">-95%</span>
    </div>
  </div>
)

const UpdatesVisual: React.FC = () => (
  <div className="text-center">
    <RefreshCw className="w-16 h-16 text-blue-500 mx-auto mb-4 animate-spin-slow" />
    <p className="text-lg font-semibold">Auto-Updated Weekly</p>
    <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
      Always compatible with the latest Claude Code features
    </p>
  </div>
)