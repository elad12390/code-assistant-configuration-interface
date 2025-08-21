#!/bin/bash
set -euo pipefail

# GitHub Actions Helper Script: Setup Test Environment
# This script sets up a consistent testing environment across different CI/CD workflows

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/../.." && pwd)"

echo "🔧 Setting up test environment..."
echo "Project root: $PROJECT_ROOT"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

log_info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

log_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

log_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Function to check if command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Check Node.js version
check_node_version() {
    log_info "Checking Node.js version..."
    if command_exists node; then
        NODE_VERSION=$(node --version)
        log_success "Node.js version: $NODE_VERSION"
    else
        log_error "Node.js is not installed"
        exit 1
    fi
}

# Check npm version
check_npm_version() {
    log_info "Checking npm version..."
    if command_exists npm; then
        NPM_VERSION=$(npm --version)
        log_success "npm version: $NPM_VERSION"
    else
        log_error "npm is not installed"
        exit 1
    fi
}

# Install dependencies if needed
install_dependencies() {
    log_info "Installing dependencies..."
    cd "$PROJECT_ROOT/caci"
    
    if [[ ! -d "node_modules" ]] || [[ ! -f "node_modules/.package-lock.json" ]]; then
        log_info "Running npm ci..."
        npm ci
        log_success "Dependencies installed"
    else
        log_info "Dependencies already installed, skipping..."
    fi
}

# Build project
build_project() {
    log_info "Building project..."
    cd "$PROJECT_ROOT/caci"
    
    if [[ ! -d "dist" ]] || [[ "src" -nt "dist" ]]; then
        log_info "Running npm run build..."
        npm run build
        log_success "Project built successfully"
    else
        log_info "Project already built, skipping..."
    fi
}

# Setup test workspace
setup_test_workspace() {
    log_info "Setting up test workspace..."
    cd "$PROJECT_ROOT/caci"
    
    # Create test workspace directory
    mkdir -p test-workspace
    
    # Create a basic components.json for testing
    if [[ ! -f "test-workspace/components.json" ]]; then
        cat > test-workspace/components.json << 'EOF'
{
  "$schema": "https://ui.shadcn.com/schema.json",
  "style": "default",
  "rsc": false,
  "tsx": true,
  "tailwind": {
    "config": "tailwind.config.js",
    "css": "app/globals.css",
    "baseColor": "slate",
    "cssVariables": true
  },
  "aliases": {
    "components": "@/components",
    "utils": "@/lib/utils"
  }
}
EOF
        log_success "Created test components.json"
    fi
    
    # Create test component files
    mkdir -p test-workspace/components/ui
    
    if [[ ! -f "test-workspace/components/ui/button.tsx" ]]; then
        cat > test-workspace/components/ui/button.tsx << 'EOF'
import React from 'react'
import { cn } from '@/lib/utils'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link'
  size?: 'default' | 'sm' | 'lg' | 'icon'
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'default', size = 'default', ...props }, ref) => {
    return (
      <button
        className={cn('inline-flex items-center justify-center', className)}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = 'Button'

export { Button, type ButtonProps }
EOF
        log_success "Created test Button component"
    fi
    
    if [[ ! -f "test-workspace/components/ui/card.tsx" ]]; then
        cat > test-workspace/components/ui/card.tsx << 'EOF'
import React from 'react'
import { cn } from '@/lib/utils'

const Card = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn('rounded-lg border bg-card', className)} {...props} />
  )
)
Card.displayName = 'Card'

const CardHeader = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn('flex flex-col space-y-1.5 p-6', className)} {...props} />
  )
)
CardHeader.displayName = 'CardHeader'

export { Card, CardHeader }
EOF
        log_success "Created test Card component"
    fi
    
    log_success "Test workspace setup complete"
}

# Verify installation
verify_installation() {
    log_info "Verifying installation..."
    cd "$PROJECT_ROOT/caci"
    
    # Check if dist directory exists
    if [[ ! -d "dist" ]]; then
        log_error "dist directory not found"
        return 1
    fi
    
    # Check if main entry point exists
    if [[ ! -f "dist/index.js" ]]; then
        log_error "dist/index.js not found"
        return 1
    fi
    
    # Try to run the CLI
    if node dist/index.js --version >/dev/null 2>&1; then
        log_success "CLI is working correctly"
    else
        log_warning "CLI version check failed, but continuing..."
    fi
    
    log_success "Installation verified"
}

# Create coverage directory
setup_coverage() {
    log_info "Setting up coverage directory..."
    cd "$PROJECT_ROOT/caci"
    mkdir -p coverage
    log_success "Coverage directory created"
}

# Clean previous test artifacts
clean_test_artifacts() {
    log_info "Cleaning previous test artifacts..."
    cd "$PROJECT_ROOT/caci"
    
    # Remove test output files
    find . -name "*.test.log" -type f -delete 2>/dev/null || true
    find . -name "test-results.xml" -type f -delete 2>/dev/null || true
    find . -name "junit.xml" -type f -delete 2>/dev/null || true
    
    # Clean temporary directories
    rm -rf tmp/ temp/ .tmp/ || true
    
    log_success "Test artifacts cleaned"
}

# Set environment variables for testing
set_test_env_vars() {
    log_info "Setting test environment variables..."
    
    # Set NODE_ENV to test
    export NODE_ENV=test
    
    # Set CI flag
    export CI=true
    
    # Set test timeout
    export JEST_TIMEOUT=30000
    
    # Disable update notifications
    export NO_UPDATE_NOTIFIER=1
    
    # Set cache directory
    export NPM_CONFIG_CACHE="$PROJECT_ROOT/.npm-cache"
    mkdir -p "$NPM_CONFIG_CACHE"
    
    log_success "Environment variables set"
}

# Print environment info
print_env_info() {
    log_info "Environment Information:"
    echo "  Node.js: $(node --version 2>/dev/null || echo 'not found')"
    echo "  npm: $(npm --version 2>/dev/null || echo 'not found')"
    echo "  OS: $(uname -s 2>/dev/null || echo 'unknown')"
    echo "  Architecture: $(uname -m 2>/dev/null || echo 'unknown')"
    echo "  Working Directory: $(pwd)"
    echo "  NODE_ENV: ${NODE_ENV:-not set}"
    echo "  CI: ${CI:-not set}"
}

# Main execution
main() {
    log_info "Starting test environment setup..."
    
    print_env_info
    check_node_version
    check_npm_version
    clean_test_artifacts
    set_test_env_vars
    install_dependencies
    build_project
    setup_test_workspace
    setup_coverage
    verify_installation
    
    log_success "✅ Test environment setup complete!"
}

# Handle script arguments
case "${1:-}" in
    --help|-h)
        echo "Usage: $0 [options]"
        echo "Options:"
        echo "  --help, -h    Show this help message"
        echo "  --info        Show environment info only"
        echo "  --clean       Clean test artifacts only"
        echo "  --build       Build project only"
        echo "  --verify      Verify installation only"
        exit 0
        ;;
    --info)
        print_env_info
        exit 0
        ;;
    --clean)
        clean_test_artifacts
        exit 0
        ;;
    --build)
        build_project
        exit 0
        ;;
    --verify)
        verify_installation
        exit 0
        ;;
    "")
        main
        ;;
    *)
        log_error "Unknown option: $1"
        echo "Use --help for usage information"
        exit 1
        ;;
esac