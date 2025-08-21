# CACI Website Development Plan: Next.js + shadcn/ui

## Project Structure

```
caci-cli/                          # Main CLI project root
├── packages/
│   ├── cli/                       # Your existing CLI code
│   └── website/                   # New website package
│       ├── .next/
│       ├── components/
│       │   ├── ui/                # shadcn/ui components
│       │   ├── sections/          # Page sections
│       │   └── layout/            # Layout components
│       ├── app/                   # Next.js 13+ app directory
│       │   ├── globals.css
│       │   ├── layout.tsx
│       │   ├── page.tsx
│       │   └── favicon.ico
│       ├── lib/
│       │   └── utils.ts
│       ├── public/
│       │   ├── logo.svg
│       │   └── images/
│       ├── .gitignore
│       ├── package.json
│       ├── tailwind.config.js
│       ├── tsconfig.json
│       ├── components.json        # shadcn config
│       └── next.config.js
├── package.json                   # Root workspace config
└── vercel.json                    # Vercel deployment config
```

---

## Setup Instructions

### 1. Initialize Workspace Structure

```bash
# From caci-cli root
mkdir -p packages/website
cd packages/website

# Initialize Next.js with TypeScript
npx create-next-app@latest . --typescript --tailwind --eslint --app --src-dir=false --import-alias="@/*"
```

### 2. Setup shadcn/ui

```bash
# Install shadcn/ui
npx shadcn@latest init

# Install required components
npx shadcn@latest add button
npx shadcn@latest add card
npx shadcn@latest add badge
npx shadcn@latest add separator
npx shadcn@latest add navigation-menu
npx shadcn@latest add sheet
npx shadcn@latest add scroll-area
npx shadcn@latest add toast
npx shadcn@latest add progress
```

### 3. Configure Workspace

**Root `package.json`:**
```json
{
  "name": "caci",
  "private": true,
  "workspaces": [
    "packages/*"
  ],
  "scripts": {
    "dev:website": "cd packages/website && npm run dev",
    "build:website": "cd packages/website && npm run build",
    "deploy": "cd packages/website && vercel --prod"
  }
}
```

**Website `package.json`:**
```json
{
  "name": "@caci/website",
  "private": true,
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint"
  },
  "dependencies": {
    "next": "^14.0.0",
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "tailwindcss": "^3.3.0",
    "framer-motion": "^10.16.0",
    "lucide-react": "^0.294.0"
  }
}
```

---

## Component Architecture

### 1. Layout Components (`components/layout/`)

**Header.tsx**
```typescript
// Sticky navigation with logo, GitHub link, creators
- Logo component (SVG)
- Navigation menu (desktop/mobile)
- GitHub link with icon
- Creators dropdown/tooltip
- Mobile menu sheet
```

**Footer.tsx**
```typescript
// Simple footer with links and credits
- Logo (larger version)
- Quick links
- Social links
- Creators acknowledgment
- Copyright info
```

### 2. Section Components (`components/sections/`)

**HeroSection.tsx**
```typescript
// Main hero with gradient text and CTA
- Animated headline with gradient
- Terminal-style code snippet
- Primary CTA button
- Background grid pattern
```

**ProblemSection.tsx**
```typescript
// Two-column problem statement
- Text content with animations
- Code config mockup (animated)
- Intersection observer animations
```

**SolutionSection.tsx**
```typescript
// Three-step process timeline
- Horizontal timeline component
- Step cards with icons
- Progressive reveal animations
```

**FeaturesGrid.tsx**
```typescript
// 2x2 feature grid with cards
- Feature cards with icons
- Hover animations
- Responsive grid layout
```

**BenefitsSection.tsx**
```typescript
// Zigzag alternating layout
- Benefit cards with visuals
- Alternating left/right layout
- Parallax effects on scroll
```

**AudienceSection.tsx**
```typescript
// "Perfect For" four-column grid
- Role-specific cards
- Icons and descriptions
- Responsive grid
```

**CTASection.tsx**
```typescript
// Final call-to-action with terminal
- Terminal mockup component
- Animated checklist
- Large CTA button
```

### 3. UI Components (`components/ui/`)

**Terminal.tsx**
```typescript
// Reusable terminal component
- Syntax highlighting
- Blinking cursor animation
- Copy-to-clipboard functionality
- Customizable content
```

**AnimatedCard.tsx**
```typescript
// Enhanced card with animations
- Hover effects
- Scroll-triggered animations
- Customizable content slots
```

**GradientText.tsx**
```typescript
// Gradient text component
- Configurable gradient colors
- Animation support
- Responsive sizing
```

---

## Page Structure (`app/page.tsx`)

```typescript
import { HeroSection } from '@/components/sections/HeroSection'
import { ProblemSection } from '@/components/sections/ProblemSection'
// ... other sections

export default function HomePage() {
  return (
    <main className="min-h-screen">
      <HeroSection />
      <ProblemSection />
      <SolutionSection />
      <FeaturesGrid />
      <BenefitsSection />
      <AudienceSection />
      <CTASection />
    </main>
  )
}
```

---

## Styling Strategy

### 1. Tailwind Configuration (`tailwind.config.js`)

```javascript
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#eff6ff',
          500: '#3b82f6',
          900: '#1e3a8a',
        },
        accent: {
          500: '#06b6d4',
        }
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      animation: {
        'fade-in-up': 'fadeInUp 0.6s ease-out',
        'pulse-soft': 'pulseSoft 2s infinite',
      }
    },
  },
  plugins: [require('tailwindcss-animate')],
}
```

### 2. Global Styles (`app/globals.css`)

```css
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');
@import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500&display=swap');

/* Custom animations */
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Gradient text utilities */
.gradient-text {
  background: linear-gradient(135deg, #3b82f6, #06b6d4);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}
```

---

## Animation Strategy

### 1. Framer Motion Setup

```typescript
// lib/animations.ts
export const fadeInUp = {
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6, ease: "easeOut" }
}

export const staggerChildren = {
  animate: {
    transition: {
      staggerChildren: 0.1
    }
  }
}
```

### 2. Intersection Observer Hook

```typescript
// hooks/useInView.ts
import { useEffect, useRef, useState } from 'react'

export function useInView(threshold = 0.25) {
  const [isInView, setIsInView] = useState(false)
  const ref = useRef<HTMLElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => setIsInView(entry.isIntersecting),
      { threshold }
    )
    
    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [threshold])

  return [ref, isInView] as const
}
```

---

## Vercel Deployment Configuration

### 1. Vercel Configuration (`vercel.json`)

```json
{
  "version": 2,
  "builds": [
    {
      "src": "packages/website/package.json",
      "use": "@vercel/next"
    }
  ],
  "routes": [
    {
      "src": "/(.*)",
      "dest": "packages/website/$1"
    }
  ],
  "buildCommand": "cd packages/website && npm run build",
  "outputDirectory": "packages/website/.next"
}
```

### 2. Environment Setup

```bash
# Install Vercel CLI
npm i -g vercel

# From project root, link to Vercel
vercel link

# Set build settings in Vercel dashboard:
# - Framework: Next.js
# - Root Directory: packages/website
# - Build Command: npm run build
# - Output Directory: .next
```

---

## Development Workflow

### 1. Local Development

```bash
# Start development server
npm run dev:website

# Build for production
npm run build:website

# Preview production build
cd packages/website && npm run start
```

### 2. Deployment

```bash
# Deploy to preview
cd packages/website && vercel

# Deploy to production
npm run deploy
```

### 3. CI/CD Integration

**GitHub Actions** (`.github/workflows/deploy.yml`):
```yaml
name: Deploy to Vercel
on:
  push:
    branches: [main]
    paths: ['packages/website/**']

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
      - run: npm ci
      - run: npm run build:website
      - uses: amondnet/vercel-action@v20
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.ORG_ID }}
          vercel-project-id: ${{ secrets.PROJECT_ID }}
          working-directory: ./packages/website
```

---

## Performance Optimizations

### 1. Next.js Configuration (`next.config.js`)

```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    optimizeCss: true,
  },
  images: {
    domains: [],
    formats: ['image/webp', 'image/avif'],
  },
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },
}

module.exports = nextConfig
```

### 2. Bundle Analysis

```bash
# Install bundle analyzer
npm install --save-dev @next/bundle-analyzer

# Analyze bundle
ANALYZE=true npm run build
```

This setup provides a solid foundation for building the CACI website with modern tooling, excellent performance, and seamless deployment to Vercel while maintaining the workspace structure within your CLI project.