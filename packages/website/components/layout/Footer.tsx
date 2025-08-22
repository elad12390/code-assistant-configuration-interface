import React from 'react'
import Link from 'next/link'
import { Terminal, Github, Twitter, Mail } from 'lucide-react'

export const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear()

  const quickLinks = [
    { name: 'Documentation', href: '/docs' },
    { name: 'GitHub', href: 'https://github.com/elad12390/claude-code-configurator' },
    { name: 'npm Package', href: 'https://www.npmjs.com/package/caci' },
    { name: 'Changelog', href: '/changelog' }
  ]

  const socialLinks = [
    { name: 'GitHub', icon: Github, href: 'https://github.com/elad12390/claude-code-configurator' },
    { name: 'Twitter', icon: Twitter, href: 'https://twitter.com/caci' },
    { name: 'Email', icon: Mail, href: 'mailto:hello@caci.dev' }
  ]

  return (
    <footer className="bg-gray-50 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800">
      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="grid md:grid-cols-3 gap-8">
          {/* Brand Section */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Terminal className="w-10 h-10 text-blue-600 dark:text-blue-400" />
              <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">
                CACI
              </span>
            </div>
            <p className="text-gray-600 dark:text-gray-400">
              Code Assistant Configuration Interface - Automated Claude Code setup in minutes.
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="font-semibold text-gray-900 dark:text-gray-100">Quick Links</h3>
            <ul className="space-y-2">
              {quickLinks.map((link) => (
                <li key={link.name}>
                  <Link 
                    href={link.href}
                    className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                    target={link.href.startsWith('http') ? '_blank' : undefined}
                    rel={link.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Social Links */}
          <div className="space-y-4">
            <h3 className="font-semibold text-gray-900 dark:text-gray-100">Connect</h3>
            <div className="flex space-x-4">
              {socialLinks.map((link) => {
                const Icon = link.icon
                return (
                  <a
                    key={link.name}
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                    aria-label={link.name}
                  >
                    <Icon className="w-6 h-6" />
                  </a>
                )
              })}
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="mt-8 pt-8 border-t border-gray-200 dark:border-gray-800">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              © {currentYear} CACI. All rights reserved.
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Created with ❤️ by the CACI Team
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}