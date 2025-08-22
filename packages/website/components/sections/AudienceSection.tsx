/**
 * Audience Section Component
 * Agent: pm
 * Owner: pm
 * Editors: analyst, po
 */

import React from 'react'
import { motion } from 'framer-motion'
import { useInView } from '@/hooks/useInView'
import { Card } from '@/components/ui/card'
import { 
  User, 
  Users, 
  UserCheck, 
  Settings,
  Code,
  Briefcase,
  Zap,
  Shield
} from 'lucide-react'

interface AudienceSegment {
  icon: React.ReactNode
  title: string
  description: string
  benefits: string[]
  highlightColor: string
}

export const AudienceSection: React.FC = () => {
  const [ref, isInView] = useInView(0.2)

  const segments: AudienceSegment[] = [
    {
      icon: <User className="w-8 h-8" />,
      title: 'Solo Developers',
      description: 'Get enterprise-level Claude Code configurations without the enterprise-level setup complexity.',
      benefits: [
        'Professional setup in minutes',
        'Best practices from day one',
        'No configuration learning curve',
        'Focus on building, not configuring'
      ],
      highlightColor: 'from-blue-500 to-blue-600'
    },
    {
      icon: <Users className="w-8 h-8" />,
      title: 'Development Teams',
      description: 'Standardize Claude Code across your entire team with consistent, optimized configurations.',
      benefits: [
        'Consistent setup for all developers',
        'Shared configuration standards',
        'Reduced onboarding time',
        'Team-wide productivity boost'
      ],
      highlightColor: 'from-purple-500 to-purple-600'
    },
    {
      icon: <UserCheck className="w-8 h-8" />,
      title: 'Tech Leads',
      description: 'Onboard new developers instantly with battle-tested Claude Code setups that work from day one.',
      benefits: [
        'Instant developer onboarding',
        'Enforce best practices',
        'Reduce support burden',
        'Track configuration standards'
      ],
      highlightColor: 'from-green-500 to-green-600'
    },
    {
      icon: <Settings className="w-8 h-8" />,
      title: 'DevOps Engineers',
      description: 'Integrate Claude Code into your CI/CD pipelines with pre-configured hooks and automations.',
      benefits: [
        'Pipeline-ready configurations',
        'Automated compliance checks',
        'Infrastructure as code support',
        'Monitoring integrations'
      ],
      highlightColor: 'from-orange-500 to-orange-600'
    }
  ]

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15
      }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5
      }
    }
  }

  return (
    <section ref={ref} className="py-20 px-4 bg-gray-50 dark:bg-gray-900/50">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Perfect For
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Whether you're coding solo or leading a team, CACI adapts to your needs
          </p>
        </motion.div>

        {/* Audience Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="grid md:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {segments.map((segment, index) => (
            <motion.div key={index} variants={itemVariants}>
              <Card className="h-full p-6 hover:shadow-xl transition-all duration-300 group relative overflow-hidden">
                {/* Hover Effect Background */}
                <div className={`absolute inset-0 bg-gradient-to-br ${segment.highlightColor} opacity-0 group-hover:opacity-5 transition-opacity duration-300`} />
                
                {/* Content */}
                <div className="relative z-10">
                  {/* Icon */}
                  <div className={`mb-4 inline-flex p-3 rounded-lg bg-gradient-to-br ${segment.highlightColor} text-white`}>
                    {segment.icon}
                  </div>

                  {/* Title */}
                  <h3 className="text-xl font-bold mb-3">{segment.title}</h3>

                  {/* Description */}
                  <p className="text-gray-600 dark:text-gray-300 mb-4 text-sm">
                    {segment.description}
                  </p>

                  {/* Benefits */}
                  <ul className="space-y-2">
                    {segment.benefits.map((benefit, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-sm">
                        <div className={`w-1.5 h-1.5 rounded-full bg-gradient-to-br ${segment.highlightColor} mt-1.5 flex-shrink-0`} />
                        <span className="text-gray-700 dark:text-gray-400">{benefit}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        {/* Additional Use Cases */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="mt-16 text-center"
        >
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Also perfect for:
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            {[
              { icon: <Code className="w-5 h-5" />, label: 'Freelancers' },
              { icon: <Briefcase className="w-5 h-5" />, label: 'Consultants' },
              { icon: <Zap className="w-5 h-5" />, label: 'Startups' },
              { icon: <Shield className="w-5 h-5" />, label: 'Enterprises' }
            ].map((item, index) => (
              <div
                key={index}
                className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-800 rounded-full shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="text-blue-600 dark:text-blue-400">
                  {item.icon}
                </div>
                <span className="font-medium">{item.label}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  )
}