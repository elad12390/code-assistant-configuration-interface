# Use Node.js LTS version with Alpine for smaller image size
FROM node:20-alpine

# Set metadata labels
LABEL maintainer="Elad Benhaim"
LABEL description="CACI - Code Assistant Configuration Interface for intelligent project setup"
LABEL version="1.1.8"
LABEL org.opencontainers.image.source="https://github.com/elad12390/claude-code-configurator"

# Create a non-root user for security
RUN addgroup -g 1001 -S nodejs && \
    adduser -S caci -u 1001 -G nodejs

# Set working directory
WORKDIR /app

# Copy package files first for better layer caching
COPY package*.json ./
COPY tsconfig.json ./
COPY components.json ./

# Copy source code needed for build
COPY src/ ./src/

# Install dependencies only (skip prepare script to avoid build attempt without source)
RUN npm ci --ignore-scripts && npm cache clean --force

# Copy bin after build
COPY bin/ ./bin/

# Make the CLI globally accessible and ensure it's executable
RUN npm link && \
    chmod +x /app/bin/caci

# Remove dev dependencies and source files to reduce image size
RUN npm prune --production && \
    rm -rf src/ tsconfig.json node_modules/@types

# Set up workspace directory for mounted projects
RUN mkdir -p /workspace && \
    chown -R caci:nodejs /workspace /app

# Switch to non-root user
USER caci

# Set workspace as working directory for project operations
WORKDIR /workspace

# Add health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
  CMD caci --version || exit 1

# Set the entrypoint to the CLI tool
ENTRYPOINT ["caci"]

# Default command shows help
CMD ["--help"]