# Use Node.js LTS version with Alpine for smaller image size
FROM node:20-alpine

# Set metadata labels
LABEL maintainer="Elad Benhaim"
LABEL description="Claude Code Configurator - Intelligent CLI tool for configuring Claude Code projects"
LABEL version="1.0.0"
LABEL org.opencontainers.image.source="https://github.com/eladbenhaim/claude-code-configurator"

# Create a non-root user for security
RUN addgroup -g 1001 -S nodejs && \
    adduser -S claude -u 1001 -G nodejs

# Set working directory
WORKDIR /app

# Copy package files first for better layer caching
COPY package*.json ./
COPY tsconfig.json ./

# Install all dependencies (including dev dependencies for building)
RUN npm ci && npm cache clean --force

# Copy source code and build configuration
COPY src/ ./src/
COPY bin/ ./bin/

# Build the TypeScript project
RUN npm run build

# Remove dev dependencies and source files to reduce image size
RUN npm prune --production && \
    rm -rf src/ tsconfig.json node_modules/@types

# Make the CLI globally accessible and ensure it's executable
RUN npm link && \
    chmod +x /app/bin/claude-config

# Set up workspace directory for mounted projects
RUN mkdir -p /workspace && \
    chown -R claude:nodejs /workspace /app

# Switch to non-root user
USER claude

# Set workspace as working directory for project operations
WORKDIR /workspace

# Add health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
  CMD claude-config --version || exit 1

# Set the entrypoint to the CLI tool
ENTRYPOINT ["claude-config"]

# Default command shows help
CMD ["--help"]