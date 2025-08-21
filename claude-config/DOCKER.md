# Docker Usage Guide for Claude Code Configurator

This guide explains how to build and use the Claude Code Configurator CLI tool in a Docker container.

## Prerequisites

- Docker Engine 20.10+ or Docker Desktop
- Docker Compose (optional, for development workflow)
- Google API Key for AI functionality

## Quick Start

### 1. Build the Docker Image

```bash
# Navigate to the claude-config directory
cd claude-config

# Build the Docker image
docker build -t claude-config .
```

### 2. Basic Usage

Run the configurator on your project:

```bash
# Replace /path/to/your/project with your actual project path
# Replace your-google-api-key with your actual API key
docker run -it --rm \
  -v /path/to/your/project:/workspace \
  -e GOOGLE_API_KEY=your-google-api-key \
  claude-config configure
```

## Detailed Usage

### Available Commands

```bash
# Show help
docker run --rm claude-config --help

# Show version
docker run --rm claude-config --version

# Configure a project (interactive mode)
docker run -it --rm \
  -v /path/to/your/project:/workspace \
  -e GOOGLE_API_KEY=your-api-key \
  claude-config configure

# Run specific configuration command
docker run -it --rm \
  -v /path/to/your/project:/workspace \
  -e GOOGLE_API_KEY=your-api-key \
  claude-config configure --template react
```

### Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `GOOGLE_API_KEY` | Yes | Your Google API key for AI functionality |
| `NODE_ENV` | No | Set to 'development' or 'production' (default: production) |

### Volume Mounts

- **`/workspace`**: Mount your project directory here (required)
- The container runs with a non-root user for security

### Security Considerations

- The container runs as a non-root user (`claude:nodejs`)
- Project files are mounted with appropriate permissions
- No privileged access required
- Health checks ensure the CLI is functional

## Development Workflow with Docker Compose

For development and testing, use the provided Docker Compose setup:

### 1. Setup Environment

```bash
# Copy the example environment file
cp .env.example .env

# Edit .env with your values
# GOOGLE_API_KEY=your-actual-api-key
# PROJECT_PATH=/absolute/path/to/your/project
```

### 2. Development Mode

```bash
# Start development container
docker-compose up claude-config

# Or run in detached mode
docker-compose up -d claude-config

# Execute commands in the running container
docker-compose exec claude-config claude-config configure

# Access shell for debugging
docker-compose exec claude-config sh
```

### 3. Production Testing

```bash
# Test production-like environment
docker-compose --profile production up claude-config-prod
```

## Common Use Cases

### Configure a React Project

```bash
docker run -it --rm \
  -v "$(pwd)/my-react-app:/workspace" \
  -e GOOGLE_API_KEY="$GOOGLE_API_KEY" \
  claude-config configure --type react
```

### Configure a Node.js API

```bash
docker run -it --rm \
  -v "$(pwd)/my-api:/workspace" \
  -e GOOGLE_API_KEY="$GOOGLE_API_KEY" \
  claude-config configure --type nodejs
```

### Batch Processing Multiple Projects

```bash
#!/bin/bash
# Script to configure multiple projects

PROJECTS=("project1" "project2" "project3")
GOOGLE_API_KEY="your-api-key"

for project in "${PROJECTS[@]}"; do
    echo "Configuring $project..."
    docker run -it --rm \
        -v "$(pwd)/$project:/workspace" \
        -e GOOGLE_API_KEY="$GOOGLE_API_KEY" \
        claude-config configure --auto
done
```

## Troubleshooting

### Permission Issues

If you encounter permission issues with mounted volumes:

```bash
# Check the container user ID
docker run --rm claude-config id

# Adjust file permissions on host if needed
sudo chown -R 1001:1001 /path/to/your/project

# Or run with current user (less secure)
docker run -it --rm \
  --user "$(id -u):$(id -g)" \
  -v /path/to/your/project:/workspace \
  -e GOOGLE_API_KEY=your-api-key \
  claude-config configure
```

### Debug Mode

Enable verbose logging:

```bash
docker run -it --rm \
  -v /path/to/your/project:/workspace \
  -e GOOGLE_API_KEY=your-api-key \
  -e DEBUG=claude-config:* \
  claude-config configure
```

### Container Shell Access

Access the container shell for debugging:

```bash
# Using docker run
docker run -it --rm \
  -v /path/to/your/project:/workspace \
  -e GOOGLE_API_KEY=your-api-key \
  --entrypoint sh \
  claude-config

# Using docker-compose
docker-compose exec claude-config sh
```

## Image Optimization

The Docker image is optimized for:
- **Size**: Uses Alpine Linux base image
- **Security**: Non-root user, minimal packages
- **Performance**: Multi-stage build, layer caching
- **Reliability**: Health checks, proper signal handling

### Image Details

- **Base Image**: `node:18-alpine`
- **Final Size**: ~150MB (approximate)
- **User**: `claude:nodejs` (UID: 1001, GID: 1001)
- **Working Directory**: `/workspace`
- **Entry Point**: `claude-config`

## Building for Different Architectures

```bash
# Build for current architecture
docker build -t claude-config .

# Build for multiple architectures (requires buildx)
docker buildx create --use
docker buildx build --platform linux/amd64,linux/arm64 -t claude-config .
```

## Integration with CI/CD

### GitHub Actions Example

```yaml
name: Configure Project
on:
  push:
    branches: [main]

jobs:
  configure:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Configure with Claude Config
        run: |
          docker run --rm \
            -v ${{ github.workspace }}:/workspace \
            -e GOOGLE_API_KEY=${{ secrets.GOOGLE_API_KEY }} \
            claude-config configure --auto
```

### GitLab CI Example

```yaml
configure:
  image: docker:latest
  services:
    - docker:dind
  script:
    - docker build -t claude-config .
    - docker run --rm 
        -v $(pwd):/workspace 
        -e GOOGLE_API_KEY=$GOOGLE_API_KEY 
        claude-config configure --auto
```

## Support

For issues related to the Docker setup:
1. Check the container logs: `docker logs <container-id>`
2. Verify environment variables are set correctly
3. Ensure proper volume mount permissions
4. Check that the Google API key is valid

For CLI-specific issues, refer to the main README.md file.