# CACI Website

The official landing page for CACI (Code Assistant Configuration Interface).

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Run production build locally
npm run start
```

## 📁 Project Structure

```
packages/website/
├── app/                    # Next.js app directory
│   ├── layout.tsx         # Root layout
│   ├── page.tsx          # Homepage
│   └── globals.css       # Global styles
├── components/            # React components
│   ├── sections/         # Page sections
│   ├── ui/              # UI components
│   └── layout/          # Layout components
├── lib/                  # Utilities and helpers
├── hooks/               # Custom React hooks
├── tests/               # Test files
└── public/              # Static assets
```

## 🎨 Design System

- **Colors**: Blue/Cyan gradient theme
- **Typography**: Inter for body, JetBrains Mono for code
- **Components**: Built with shadcn/ui
- **Animations**: Powered by Framer Motion
- **Styling**: Tailwind CSS with custom configuration

## 🧪 Testing

```bash
# Run tests
npm test

# Run tests with coverage
npm run test:coverage

# Run tests in watch mode
npm run test:watch
```

## 🚀 Deployment

The website is automatically deployed to Vercel on push to the main branch.

### Manual Deployment

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy to preview
vercel

# Deploy to production
vercel --prod
```

### Environment Variables

No environment variables are required for the basic setup.

## 🛠️ Development

### Adding New Sections

1. Create a new component in `components/sections/`
2. Import and add to `app/page.tsx`
3. Follow the existing section pattern with agent annotations

### Modifying Styles

- Global styles: `app/globals.css`
- Component styles: Use Tailwind classes
- Theme configuration: `tailwind.config.js`

## 📝 Content Management

Content is currently hardcoded in components. Future versions may integrate with a CMS.

## 🤝 Contributing

1. Create a feature branch
2. Make your changes
3. Run tests
4. Submit a pull request

## 📄 License

MIT License - see LICENSE file in the root directory.