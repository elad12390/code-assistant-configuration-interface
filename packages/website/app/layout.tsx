import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  metadataBase: new URL('https://caci.dev'),
  title: 'CACI - Code Assistant Configuration Interface',
  description: 'Stop wrestling with Claude Code configs. Start shipping faster with intelligent, automated Claude Code configuration.',
  keywords: ['Claude Code', 'configuration', 'automation', 'developer tools', 'CLI', 'AI assistant'],
  authors: [{ name: 'CACI Team' }],
  openGraph: {
    title: 'CACI - Code Assistant Configuration Interface',
    description: 'Automated Claude Code configuration in minutes, not days',
    type: 'website',
    url: 'https://caci.dev',
    images: ['/og-image.png']
  },
  twitter: {
    card: 'summary_large_image',
    title: 'CACI - Code Assistant Configuration Interface',
    description: 'Automated Claude Code configuration in minutes, not days',
    images: ['/twitter-image.png']
  }
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className={`${inter.className} antialiased`}>
        <Header />
        {children}
        <Footer />
      </body>
    </html>
  )
}