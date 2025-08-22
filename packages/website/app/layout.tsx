import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import Script from 'next/script'
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
      <body className={`${inter.className} antialiased bg-grid bg-gradient-radial min-h-screen`}>
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-ZZ4E9TKZ9K"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-ZZ4E9TKZ9K');
          `}
        </Script>
        <div className="relative z-10">
          <Header />
          {children}
          <Footer />
        </div>
      </body>
    </html>
  )
}