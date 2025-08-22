# Docker Usage Guide for CACI

This comprehensive guide explains how to build, deploy, and use the CACI (Code
Assistant Configuration Interface) CLI tool in Docker containers. CACI automates
Claude Code project configuration by analyzing requirements and using AI to
recommend relevant agents, commands, MCPs, and hooks.

## Prerequisites

- Docker Engine 20.10+ or Docker Desktop
- Docker Compose v2.0+ (optional, for development workflow)
- Google API Key for AI-powered component recommendations
- Basic familiarity with Docker concepts and command-line operations

## Quick Start

### 1. Using Pre-built Images (Recommended)

```bash
# Pull from GitHub Container Registry (recommended)
docker pull ghcr.io/elad12390/caci:latest

# Or pull from Docker Hub
docker pull elad12390/caci:latest

# Verify the image
docker run --rm ghcr.io/elad12390/caci:latest --version
```

### 2. Build from Source (Development)

```bash
# Navigate to the caci directory
cd caci

# Build the Docker image
docker build -t caci:local .

# Build for multiple architectures (if buildx is set up)
docker buildx build --platform linux/amd64,linux/arm64 -t caci:multi .
```

### 3. Basic Usage

Run the configurator on your project:

```bash
# Using the official image from GitHub Container Registry
docker run -it --rm \
  -v "$(pwd)":/workspace \
  -e GOOGLE_API_KEY="your-google-api-key" \
  ghcr.io/elad12390/caci:latest configure

# Or using Docker Hub
docker run -it --rm \
  -v "$(pwd)":/workspace \
  -e GOOGLE_API_KEY="your-google-api-key" \
  elad12390/caci:latest configure

# For Windows users (PowerShell)
docker run -it --rm `
  -v "${PWD}:/workspace" `
  -e GOOGLE_API_KEY="your-google-api-key" `
  ghcr.io/elad12390/caci:latest configure
```

## Detailed Usage

### Available Commands

```bash
# Show help
docker run --rm ghcr.io/elad12390/caci:latest --help

# Show version
docker run --rm ghcr.io/elad12390/caci:latest --version

# Configure a project (interactive mode)
docker run -it --rm \
  -v "$(pwd)":/workspace \
  -e GOOGLE_API_KEY="your-api-key" \
  ghcr.io/elad12390/caci:latest configure

# Initialize a new project with components.json
docker run -it --rm \
  -v "$(pwd)":/workspace \
  ghcr.io/elad12390/caci:latest init

# Update existing configuration
docker run -it --rm \
  -v "$(pwd)":/workspace \
  -e GOOGLE_API_KEY="your-api-key" \
  ghcr.io/elad12390/caci:latest update

# Reset configuration to defaults
docker run -it --rm \
  -v "$(pwd)":/workspace \
  ghcr.io/elad12390/caci:latest reset

# View configuration history
docker run --rm \
  -v "$(pwd)":/workspace \
  ghcr.io/elad12390/caci:latest history
```

### Environment Variables

| Variable          | Required | Default    | Description                                        |
| ----------------- | -------- | ---------- | -------------------------------------------------- |
| `GOOGLE_API_KEY`  | Yes\*    | -          | Your Google API key for AI-powered recommendations |
| `NODE_ENV`        | No       | production | Set to 'development' or 'production'               |
| `DEBUG`           | No       | -          | Enable debug logging (e.g., `caci:*`)              |
| `CACI_CACHE_DIR`  | No       | /tmp/caci  | Directory for temporary files and cache            |
| `CACI_CONFIG_DIR` | No       | ./.claude  | Target directory for Claude Code configuration     |

\*Required for AI recommendations. Some commands (like `init`, `history`) work
without it.

### Volume Mounts

| Mount Point  | Purpose                   | Required | Notes                           |
| ------------ | ------------------------- | -------- | ------------------------------- |
| `/workspace` | Your project directory    | Yes      | Should be writable by container |
| `/tmp/caci`  | Cache and temporary files | No       | Improves performance if mounted |

### Multi-Platform Support

CACE supports multiple architectures:

- **linux/amd64**: Intel/AMD 64-bit (most common)
- **linux/arm64**: ARM 64-bit (Apple Silicon, ARM servers)

Docker automatically pulls the correct image for your platform.

### Security Considerations

- **Non-root execution**: Container runs as user `caci:nodejs` (UID: 1001,
  GID: 1001)
- **Minimal attack surface**: Based on Alpine Linux with only necessary packages
- **No privileged access**: Runs without elevated permissions
- **Read-only filesystem**: Only `/workspace` and `/tmp` are writable
- **Health checks**: Built-in monitoring ensures CLI functionality
- **Vulnerability scanning**: Automated security scans in CI/CD pipeline
- **No network privileges**: Runs with restricted network access

## Development Workflow with Docker Compose

For development and testing, use the provided Docker Compose setup:

### 1. Setup Environment

```bash
# Create environment file
cat > .env << 'EOF'
# Google API Key for AI functionality
GOOGLE_API_KEY=your-actual-api-key

# Project path to mount (use absolute path)
PROJECT_PATH=/absolute/path/to/your/project

# Optional: Override default settings
NODE_ENV=development
DEBUG=caci:*
EOF

# Make sure to set executable permissions
chmod 600 .env
```

### 2. Development Mode

```bash
# Start development container (interactive shell)
docker-compose up caci

# Or run in detached mode for background development
docker-compose up -d caci

# Execute CACI commands in the running container
docker-compose exec caci caci configure
docker-compose exec caci caci init
docker-compose exec caci caci history

# Access shell for debugging and exploration
docker-compose exec caci sh

# View logs
docker-compose logs -f caci

# Stop the development environment
docker-compose down
```

### 3. Production Testing

```bash
# Test production-like environment with read-only workspace
docker-compose --profile production up caci-prod

# Run one-off production tests
docker-compose run --rm caci-prod configure --help
```

## Common Use Cases

### Configure a React Project

```bash
# Navigate to your React project
cd my-react-app

# Initialize with components.json if needed
docker run -it --rm \
  -v "$(pwd):/workspace" \
  ghcr.io/elad12390/caci:latest init

# Configure with AI recommendations
docker run -it --rm \
  -v "$(pwd):/workspace" \
  -e GOOGLE_API_KEY="$GOOGLE_API_KEY" \
  ghcr.io/elad12390/caci:latest configure
```

### Configure a Node.js API Project

```bash
cd my-nodejs-api

# Configure with environment-specific settings
docker run -it --rm \
  -v "$(pwd):/workspace" \
  -e GOOGLE_API_KEY="$GOOGLE_API_KEY" \
  -e NODE_ENV="development" \
  ghcr.io/elad12390/caci:latest configure
```

### Configure a Python Data Science Project

```bash
cd my-python-project

# Configure for data science workflows
docker run -it --rm \
  -v "$(pwd):/workspace" \
  -e GOOGLE_API_KEY="$GOOGLE_API_KEY" \
  ghcr.io/elad12390/caci:latest configure
```

### Batch Processing Multiple Projects

```bash
#!/bin/bash
# Script to configure multiple projects with CACI

set -euo pipefail

PROJECTS=("frontend" "backend" "mobile-app" "data-pipeline")
GOOGLE_API_KEY="${GOOGLE_API_KEY:-}"
IMAGE="ghcr.io/elad12390/caci:latest"

if [[ -z "$GOOGLE_API_KEY" ]]; then
    echo "Error: GOOGLE_API_KEY environment variable is required"
    exit 1
fi

for project in "${PROJECTS[@]}"; do
    if [[ ! -d "$project" ]]; then
        echo "Warning: Directory $project does not exist, skipping..."
        continue
    fi

    echo "🔧 Configuring $project..."
    docker run -it --rm \
        -v "$(pwd)/$project:/workspace" \
        -e GOOGLE_API_KEY="$GOOGLE_API_KEY" \
        "$IMAGE" configure

    echo "✅ Completed $project"
    echo "---"
done

echo "🎉 All projects configured successfully!"
```

### Automated CI/CD Integration

```bash
# In your CI/CD pipeline (e.g., GitHub Actions, GitLab CI)
docker run --rm \
  -v "$PWD:/workspace" \
  -e GOOGLE_API_KEY="$GOOGLE_API_KEY" \
  ghcr.io/elad12390/caci:latest configure

# Check if configuration was applied
if [[ -d ".claude" ]]; then
    echo "✅ CACI configuration applied successfully"
else
    echo "❌ CACI configuration failed"
    exit 1
fi
```

## Troubleshooting

### Permission Issues

If you encounter permission issues with mounted volumes:

```bash
# Check the container user ID
docker run --rm ghcr.io/elad12390/caci:latest sh -c "id"
# Expected output: uid=1001(caci) gid=1001(nodejs)

# Option 1: Adjust file permissions on host (recommended)
sudo chown -R 1001:1001 /path/to/your/project
# Or just make it writable for the group
sudo chmod -R g+w /path/to/your/project

# Option 2: Run with current user (less secure but may be needed)
docker run -it --rm \
  --user "$(id -u):$(id -g)" \
  -v "$(pwd):/workspace" \
  -e GOOGLE_API_KEY="your-api-key" \
  ghcr.io/elad12390/caci:latest configure

# Option 3: Use Docker's user namespace mapping (advanced)
# Add to /etc/docker/daemon.json:
# {
#   "userns-remap": "default"
# }
```

### Google API Key Issues

```bash
# Test if your API key works
curl -H "Authorization: Bearer $GOOGLE_API_KEY" \
     "https://generativelanguage.googleapis.com/v1/models" \
     2>/dev/null | jq '.models[0].name' || echo "API key test failed"

# Run CACI without AI features (limited functionality)
docker run -it --rm \
  -v "$(pwd):/workspace" \
  ghcr.io/elad12390/caci:latest init  # This works without API key
```

### Network and Connectivity Issues

```bash
# Test container network connectivity
docker run --rm ghcr.io/elad12390/caci:latest sh -c "ping -c 1 google.com"

# Run with host network (if corporate firewall issues)
docker run -it --rm --network host \
  -v "$(pwd):/workspace" \
  -e GOOGLE_API_KEY="your-api-key" \
  ghcr.io/elad12390/caci:latest configure

# Check for proxy configuration
docker run --rm \
  -e HTTP_PROXY="$HTTP_PROXY" \
  -e HTTPS_PROXY="$HTTPS_PROXY" \
  -e NO_PROXY="$NO_PROXY" \
  -v "$(pwd):/workspace" \
  -e GOOGLE_API_KEY="your-api-key" \
  ghcr.io/elad12390/caci:latest configure
```

### Debug Mode

Enable verbose logging and debugging:

```bash
# Enable all CACI debug logs
docker run -it --rm \
  -v "$(pwd):/workspace" \
  -e GOOGLE_API_KEY="your-api-key" \
  -e DEBUG="caci:*" \
  -e NODE_ENV="development" \
  ghcr.io/elad12390/caci:latest configure

# Enable specific module debugging
docker run -it --rm \
  -v "$(pwd):/workspace" \
  -e GOOGLE_API_KEY="your-api-key" \
  -e DEBUG="caci:analyzer,caci:manager" \
  ghcr.io/elad12390/caci:latest configure

# Enable Node.js debugging
docker run -it --rm \
  -v "$(pwd):/workspace" \
  -e GOOGLE_API_KEY="your-api-key" \
  -e NODE_OPTIONS="--inspect=0.0.0.0:9229" \
  -p 9229:9229 \
  ghcr.io/elad12390/caci:latest configure
```

### Container Shell Access

Access the container shell for debugging:

```bash
# Using docker run with shell access
docker run -it --rm \
  -v "$(pwd):/workspace" \
  -e GOOGLE_API_KEY="your-api-key" \
  --entrypoint sh \
  ghcr.io/elad12390/caci:latest

# Using docker-compose for persistent debugging
docker-compose exec caci sh

# Run commands inside the container
docker run -it --rm \
  -v "$(pwd):/workspace" \
  --entrypoint sh \
  ghcr.io/elad12390/caci:latest \
  -c "ls -la /workspace && caci --version"
```

### Image and Platform Issues

```bash
# Check available platforms for the image
docker manifest inspect ghcr.io/elad12390/caci:latest

# Force specific platform (if needed)
docker run --platform linux/amd64 -it --rm \
  -v "$(pwd):/workspace" \
  -e GOOGLE_API_KEY="your-api-key" \
  ghcr.io/elad12390/caci:latest configure

# Pull latest image (force update)
docker pull ghcr.io/elad12390/caci:latest

# Check image details
docker inspect ghcr.io/elad12390/caci:latest | jq '.[0].Config'
```

## Performance Considerations

### Image Optimization

The Docker image is optimized for:

- **Size**: Uses Alpine Linux base image (~150MB total)
- **Security**: Non-root user, minimal attack surface
- **Performance**: Multi-stage build, efficient layer caching
- **Reliability**: Health checks, proper signal handling
- **Cross-platform**: Supports AMD64 and ARM64 architectures

### Image Details

| Property            | Value                                |
| ------------------- | ------------------------------------ |
| Base Image          | `node:20-alpine`                     |
| Final Size          | ~150MB (compressed: ~50MB)           |
| User                | `caci:nodejs` (UID: 1001, GID: 1001) |
| Working Directory   | `/workspace`                         |
| Entry Point         | `caci`                               |
| Supported Platforms | `linux/amd64`, `linux/arm64`         |
| Health Check        | `caci --version` every 30s           |

### Performance Tips

```bash
# Use volume for cache to improve repeated runs
docker run -it --rm \
  -v "$(pwd):/workspace" \
  -v caci-cache:/tmp/caci \
  -e GOOGLE_API_KEY="your-api-key" \
  ghcr.io/elad12390/caci:latest configure

# Limit resource usage for better system performance
docker run -it --rm \
  --memory="512m" \
  --cpus="0.5" \
  -v "$(pwd):/workspace" \
  -e GOOGLE_API_KEY="your-api-key" \
  ghcr.io/elad12390/caci:latest configure

# Use specific image digest for reproducible builds
docker run -it --rm \
  -v "$(pwd):/workspace" \
  -e GOOGLE_API_KEY="your-api-key" \
  ghcr.io/elad12390/caci@sha256:abcd1234... configure
```

## Building for Different Architectures

```bash
# Build for current architecture
docker build -t caci:local .

# Build for multiple architectures (requires buildx)
docker buildx create --name caci-builder --use
docker buildx build \
  --platform linux/amd64,linux/arm64 \
  --tag caci:multi-arch \
  --push \
  .

# Build and test locally for different architecture
docker buildx build \
  --platform linux/arm64 \
  --tag caci:arm64 \
  --load \
  .

# Inspect builder capabilities
docker buildx inspect caci-builder

# Clean up builder
docker buildx rm caci-builder
```

## Automated Docker Publishing Pipeline

CACE uses GitHub Actions for automated Docker image publishing:

### CI/CD Pipeline Features

- **Multi-platform builds**: Automatic builds for AMD64 and ARM64
- **Security scanning**: Vulnerability scans with Docker Scout and Snyk
- **Multi-registry publishing**: Images published to both GitHub Container
  Registry and Docker Hub
- **Automated testing**: Container functionality tests across platforms
- **Version tagging**: Semantic versioning with Git tags

### Pipeline Triggers

- **Manual dispatch**: Triggered manually with version parameters
- **Release tags**: Automatic builds on version tags (e.g., v1.0.0)
- **Schedule**: Weekly security scans and updates

### Image Registries

| Registry                  | Image Name               | Purpose                        |
| ------------------------- | ------------------------ | ------------------------------ |
| GitHub Container Registry | `ghcr.io/elad12390/caci` | Primary registry (recommended) |
| Docker Hub                | `elad12390/caci`         | Alternative registry           |

### Image Tags

- `latest`: Latest stable release
- `v1.0.0`: Specific version tags
- `main`: Latest development build
- `pr-123`: Pull request builds (for testing)

## Integration with CI/CD

### GitHub Actions Example

```yaml
name: Configure Project with CACI
on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  configure:
    runs-on: ubuntu-latest
    permissions:
      contents: read
      packages: read

    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Configure with CACI
        run: |
          docker run --rm \
            -v ${{ github.workspace }}:/workspace \
            -e GOOGLE_API_KEY=${{ secrets.GOOGLE_API_KEY }} \
            ghcr.io/elad12390/caci:latest configure

      - name: Verify configuration
        run: |
          if [[ -d ".claude" ]]; then
            echo "✅ CACI configuration applied successfully"
            ls -la .claude/
          else
            echo "❌ CACI configuration failed"
            exit 1
          fi

      - name: Commit configuration (if needed)
        if: github.event_name == 'push'
        run: |
          git config --local user.email "action@github.com"
          git config --local user.name "GitHub Action"
          git add .claude/ .configurator/
          git diff --staged --quiet || git commit -m "chore: update CACI configuration"
          git push
```

### GitLab CI Example

```yaml
stages:
  - configure
  - validate

variables:
  DOCKER_IMAGE: 'ghcr.io/elad12390/caci:latest'

configure:
  stage: configure
  image: docker:latest
  services:
    - docker:dind
  before_script:
    - docker info
    - docker pull $DOCKER_IMAGE
  script:
    - |
      docker run --rm \
        -v $CI_PROJECT_DIR:/workspace \
        -e GOOGLE_API_KEY=$GOOGLE_API_KEY \
        $DOCKER_IMAGE configure
  artifacts:
    paths:
      - .claude/
      - .configurator/
    expire_in: 1 week
  only:
    - main
    - develop

validate:
  stage: validate
  script:
    - test -d .claude || exit 1
    - echo "Configuration validation passed"
  dependencies:
    - configure
```

### Jenkins Pipeline Example

```groovy
pipeline {
    agent any

    environment {
        GOOGLE_API_KEY = credentials('google-api-key')
        CACI_IMAGE = 'ghcr.io/elad12390/caci:latest'
    }

    stages {
        stage('Pull CACI Image') {
            steps {
                sh 'docker pull ${CACI_IMAGE}'
            }
        }

        stage('Configure Project') {
            steps {
                sh '''
                    docker run --rm \
                        -v $WORKSPACE:/workspace \
                        -e GOOGLE_API_KEY="$GOOGLE_API_KEY" \
                        ${CACI_IMAGE} configure
                '''
            }
        }

        stage('Archive Configuration') {
            steps {
                archiveArtifacts artifacts: '.claude/**, .configurator/**', fingerprint: true
            }
        }
    }

    post {
        always {
            sh 'docker system prune -f'
        }
    }
}
```

### Azure DevOps Example

```yaml
trigger:
  - main

pool:
  vmImage: 'ubuntu-latest'

variables:
  CACI_IMAGE: 'ghcr.io/elad12390/caci:latest'

steps:
  - task: Docker@2
    displayName: 'Pull CACI Image'
    inputs:
      command: 'pull'
      arguments: '$(CACI_IMAGE)'

  - script: |
      docker run --rm \
        -v $(Build.SourcesDirectory):/workspace \
        -e GOOGLE_API_KEY="$(GOOGLE_API_KEY)" \
        $(CACI_IMAGE) configure
    displayName: 'Configure with CACI'

  - task: PublishBuildArtifacts@1
    displayName: 'Publish Configuration'
    inputs:
      pathToPublish: '$(Build.SourcesDirectory)/.claude'
      artifactName: 'claude-config'
```

## Advanced Usage

### Custom Dockerfile for Extensions

```dockerfile
# Extend CACI with custom tools
FROM ghcr.io/elad12390/caci:latest

# Switch to root for package installation
USER root

# Install additional tools
RUN apk add --no-cache git curl jq

# Add custom scripts
COPY scripts/ /usr/local/bin/
RUN chmod +x /usr/local/bin/*

# Switch back to caci user
USER caci

# Set custom entry point
ENTRYPOINT ["/usr/local/bin/custom-entrypoint.sh"]
```

### Using with Docker Networks

```bash
# Create a custom network for CACI
docker network create caci-network

# Run CACI in the custom network
docker run -it --rm \
  --network caci-network \
  -v "$(pwd):/workspace" \
  -e GOOGLE_API_KEY="your-api-key" \
  ghcr.io/elad12390/caci:latest configure

# Clean up
docker network rm caci-network
```

### Kubernetes Deployment

```yaml
apiVersion: batch/v1
kind: Job
metadata:
  name: caci-configure
spec:
  template:
    spec:
      containers:
        - name: caci
          image: ghcr.io/elad12390/caci:latest
          command: ['caci', 'configure']
          env:
            - name: GOOGLE_API_KEY
              valueFrom:
                secretKeyRef:
                  name: google-api-key
                  key: key
          volumeMounts:
            - name: workspace
              mountPath: /workspace
          securityContext:
            runAsUser: 1001
            runAsGroup: 1001
            allowPrivilegeEscalation: false
      volumes:
        - name: workspace
          persistentVolumeClaim:
            claimName: project-workspace
      restartPolicy: Never
  backoffLimit: 3
```

## Support and Troubleshooting

### Getting Help

For issues related to the Docker setup:

1. **Check container logs**: `docker logs <container-id>`
2. **Verify environment variables**: Ensure `GOOGLE_API_KEY` is set and valid
3. **Test volume mounts**: Verify permissions and path accessibility
4. **Check image version**: Ensure you're using the latest stable image
5. **Review network connectivity**: Test access to Google APIs

### Common Error Solutions

| Error                         | Solution                                        |
| ----------------------------- | ----------------------------------------------- |
| "Permission denied"           | Check file permissions or use `--user` flag     |
| "API key invalid"             | Verify `GOOGLE_API_KEY` is correctly set        |
| "No such file or directory"   | Ensure volume mount path is correct             |
| "Container exits immediately" | Check entry point and command syntax            |
| "Network timeout"             | Verify internet connectivity and proxy settings |

### Community and Documentation

- **GitHub Repository**:
  [https://github.com/elad12390/claude-code-configurator](https://github.com/elad12390/claude-code-configurator)
- **Docker Hub**:
  [https://hub.docker.com/r/elad12390/caci](https://hub.docker.com/r/elad12390/caci)
- **GitHub Container Registry**:
  [https://ghcr.io/elad12390/caci](https://ghcr.io/elad12390/caci)
- **Issues and Bug Reports**: GitHub Issues
- **CLI Documentation**: See main README.md file

### Version Information

```bash
# Check CACI version
docker run --rm ghcr.io/elad12390/caci:latest --version

# Check Docker image metadata
docker inspect ghcr.io/elad12390/caci:latest | jq '.[0].Config.Labels'

# List available image tags
curl -s https://api.github.com/repos/elad12390/claude-code-configurator/releases | jq -r '.[].tag_name'
```
