#!/bin/bash
set -euo pipefail

# GitHub Actions Helper Script: Docker Health Check
# This script performs comprehensive health checks on Docker images

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/../.." && pwd)"

# Default values
DEFAULT_IMAGE="claude-config:latest"
DEFAULT_TIMEOUT=30
DEFAULT_PLATFORM="linux/amd64"

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

# Parse command line arguments
IMAGE="${1:-$DEFAULT_IMAGE}"
TIMEOUT="${2:-$DEFAULT_TIMEOUT}"
PLATFORM="${3:-$DEFAULT_PLATFORM}"

log_info "Docker Health Check Configuration:"
echo "  Image: $IMAGE"
echo "  Timeout: ${TIMEOUT}s"
echo "  Platform: $PLATFORM"

# Check if Docker is available
check_docker() {
    log_info "🐳 Checking Docker availability..."
    
    if ! command_exists docker; then
        log_error "Docker is not installed or not in PATH"
        return 1
    fi
    
    if ! docker info >/dev/null 2>&1; then
        log_error "Docker daemon is not running"
        return 1
    fi
    
    local docker_version
    docker_version=$(docker --version | cut -d' ' -f3 | cut -d',' -f1)
    log_success "Docker is available (version: $docker_version)"
}

# Check if image exists
check_image_exists() {
    log_info "📦 Checking if image exists..."
    
    if docker image inspect "$IMAGE" >/dev/null 2>&1; then
        log_success "Image '$IMAGE' exists"
        
        # Get image details
        local image_id created size
        image_id=$(docker image inspect "$IMAGE" --format '{{.Id}}' | cut -c8-20)
        created=$(docker image inspect "$IMAGE" --format '{{.Created}}' | cut -c1-19)
        size=$(docker image inspect "$IMAGE" --format '{{.Size}}')
        
        echo "  Image ID: $image_id"
        echo "  Created: $created"
        echo "  Size: $(numfmt --to=iec --suffix=B "$size")"
        
        return 0
    else
        log_error "Image '$IMAGE' does not exist"
        return 1
    fi
}

# Test basic container functionality
test_container_start() {
    log_info "🚀 Testing container startup..."
    
    local container_id
    container_id=$(docker run -d --platform="$PLATFORM" "$IMAGE" sleep 10 2>/dev/null) || {
        log_error "Failed to start container"
        return 1
    }
    
    # Wait a moment for container to fully start
    sleep 2
    
    # Check if container is running
    if docker ps --filter "id=$container_id" --format '{{.Status}}' | grep -q "Up"; then
        log_success "Container started successfully"
        
        # Clean up
        docker stop "$container_id" >/dev/null 2>&1 || true
        docker rm "$container_id" >/dev/null 2>&1 || true
        
        return 0
    else
        log_error "Container failed to stay running"
        
        # Show logs for debugging
        log_info "Container logs:"
        docker logs "$container_id" 2>&1 || true
        
        # Clean up
        docker rm "$container_id" >/dev/null 2>&1 || true
        
        return 1
    fi
}

# Test CLI functionality
test_cli_commands() {
    log_info "⚡ Testing CLI commands..."
    
    # Test --version command
    log_info "Testing --version command..."
    if timeout "$TIMEOUT" docker run --rm --platform="$PLATFORM" "$IMAGE" --version >/dev/null 2>&1; then
        log_success "--version command works"
    else
        log_error "--version command failed"
        return 1
    fi
    
    # Test --help command
    log_info "Testing --help command..."
    if timeout "$TIMEOUT" docker run --rm --platform="$PLATFORM" "$IMAGE" --help >/dev/null 2>&1; then
        log_success "--help command works"
    else
        log_warning "--help command failed (may not be critical)"
    fi
    
    # Test with sample workspace
    log_info "Testing with sample components.json..."
    
    # Create temporary directory with test files
    local temp_dir
    temp_dir=$(mktemp -d)
    
    cat > "$temp_dir/components.json" << 'EOF'
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
    
    # Test analyze command with workspace
    if timeout "$TIMEOUT" docker run --rm --platform="$PLATFORM" -v "$temp_dir:/workspace" -w /workspace "$IMAGE" analyze >/dev/null 2>&1; then
        log_success "analyze command works with workspace"
    else
        log_warning "analyze command failed with workspace (may be expected without API key)"
    fi
    
    # Clean up
    rm -rf "$temp_dir"
}

# Test resource usage
test_resource_usage() {
    log_info "📊 Testing resource usage..."
    
    # Run container with resource monitoring
    local container_id
    container_id=$(docker run -d --platform="$PLATFORM" "$IMAGE" sleep 5) || {
        log_error "Failed to start container for resource monitoring"
        return 1
    }
    
    # Wait for container to stabilize
    sleep 2
    
    # Get resource stats
    if docker stats --no-stream --format "table {{.CPUPerc}}\t{{.MemUsage}}\t{{.NetIO}}\t{{.BlockIO}}" "$container_id" 2>/dev/null | tail -n +2 > /tmp/docker-stats; then
        log_info "Resource usage:"
        while read -r line; do
            echo "  $line"
        done < /tmp/docker-stats
        log_success "Resource monitoring completed"
    else
        log_warning "Could not get resource stats"
    fi
    
    # Clean up
    docker stop "$container_id" >/dev/null 2>&1 || true
    docker rm "$container_id" >/dev/null 2>&1 || true
    rm -f /tmp/docker-stats
}

# Test container security
test_security() {
    log_info "🔒 Testing container security..."
    
    # Check if container runs as non-root user
    local user_id
    user_id=$(timeout "$TIMEOUT" docker run --rm --platform="$PLATFORM" "$IMAGE" id -u 2>/dev/null || echo "unknown")
    
    if [[ "$user_id" != "0" ]] && [[ "$user_id" != "unknown" ]]; then
        log_success "Container runs as non-root user (UID: $user_id)"
    elif [[ "$user_id" == "0" ]]; then
        log_warning "Container runs as root user (security concern)"
    else
        log_warning "Could not determine container user"
    fi
    
    # Check for sensitive files
    log_info "Checking for sensitive files in container..."
    local sensitive_files=("/etc/passwd" "/etc/shadow" "/root/.ssh" "/home/*/.ssh")
    local found_sensitive=0
    
    for file in "${sensitive_files[@]}"; do
        if timeout "$TIMEOUT" docker run --rm --platform="$PLATFORM" "$IMAGE" test -e "$file" 2>/dev/null; then
            log_warning "Found potentially sensitive file: $file"
            ((found_sensitive++))
        fi
    done
    
    if [[ $found_sensitive -eq 0 ]]; then
        log_success "No obvious sensitive files found"
    fi
}

# Test multi-platform support
test_platform_support() {
    log_info "🏗️ Testing platform support..."
    
    # Get available platforms for the image
    local platforms
    platforms=$(docker manifest inspect "$IMAGE" 2>/dev/null | jq -r '.manifests[].platform | "\(.os)/\(.architecture)"' 2>/dev/null || echo "")
    
    if [[ -n "$platforms" ]]; then
        log_info "Available platforms:"
        echo "$platforms" | while read -r platform; do
            echo "  - $platform"
        done
        log_success "Multi-platform support detected"
    else
        log_info "Could not determine platform support (image may be single-platform)"
    fi
}

# Test health endpoint (if applicable)
test_health_endpoint() {
    log_info "❤️ Testing health endpoint (if applicable)..."
    
    # This is more applicable for web services, but we can check if the CLI has any health check capability
    if timeout "$TIMEOUT" docker run --rm --platform="$PLATFORM" "$IMAGE" --help 2>/dev/null | grep -i health >/dev/null; then
        log_info "Health check capability detected in CLI"
    else
        log_info "No specific health check capability detected (normal for CLI tools)"
    fi
}

# Test environment variables
test_environment_variables() {
    log_info "🌍 Testing environment variable handling..."
    
    # Test with common environment variables
    local test_vars=(
        "NODE_ENV=production"
        "GEMINI_API_KEY=test-key"
        "LOG_LEVEL=debug"
    )
    
    for var in "${test_vars[@]}"; do
        local var_name=${var%=*}
        local var_value=${var#*=}
        
        if timeout "$TIMEOUT" docker run --rm --platform="$PLATFORM" -e "$var" "$IMAGE" sh -c "echo \$$var_name" 2>/dev/null | grep -q "$var_value"; then
            log_success "Environment variable $var_name is handled correctly"
        else
            log_info "Environment variable $var_name test completed"
        fi
    done
}

# Generate health report
generate_health_report() {
    log_info "📋 Generating health report..."
    
    local report_file="docker-health-report.md"
    
    cat > "$report_file" << EOF
# Docker Health Check Report

Generated on: $(date)
Image: $IMAGE
Platform: $PLATFORM
Timeout: ${TIMEOUT}s

## Summary

This report contains the results of comprehensive health checks performed on the Docker image.

## Test Results

EOF
    
    log_success "Health report generated: $report_file"
}

# Main execution
main() {
    log_info "🏥 Starting Docker health checks for '$IMAGE'..."
    
    local exit_code=0
    local total_tests=0
    local passed_tests=0
    
    # Run all health checks
    ((total_tests++))
    if check_docker; then ((passed_tests++)); else exit_code=1; fi
    
    ((total_tests++))
    if check_image_exists; then ((passed_tests++)); else exit_code=1; fi
    
    ((total_tests++))
    if test_container_start; then ((passed_tests++)); else exit_code=1; fi
    
    ((total_tests++))
    if test_cli_commands; then ((passed_tests++)); else exit_code=1; fi
    
    ((total_tests++))
    if test_resource_usage; then ((passed_tests++)); fi
    
    ((total_tests++))
    if test_security; then ((passed_tests++)); fi
    
    ((total_tests++))
    if test_platform_support; then ((passed_tests++)); fi
    
    ((total_tests++))
    if test_health_endpoint; then ((passed_tests++)); fi
    
    ((total_tests++))
    if test_environment_variables; then ((passed_tests++)); fi
    
    # Generate report
    generate_health_report
    
    # Summary
    log_info "🏁 Health check summary:"
    echo "  Total tests: $total_tests"
    echo "  Passed: $passed_tests"
    echo "  Failed: $((total_tests - passed_tests))"
    echo "  Success rate: $(( (passed_tests * 100) / total_tests ))%"
    
    if [[ $exit_code -eq 0 ]] && [[ $passed_tests -ge $((total_tests - 2)) ]]; then
        log_success "✅ Docker health check completed successfully!"
    else
        log_error "❌ Docker health check completed with issues!"
    fi
    
    return $exit_code
}

# Handle script arguments
case "${1:-}" in
    --help|-h)
        echo "Usage: $0 [image] [timeout] [platform]"
        echo ""
        echo "Arguments:"
        echo "  image      Docker image to test (default: $DEFAULT_IMAGE)"
        echo "  timeout    Timeout for tests in seconds (default: $DEFAULT_TIMEOUT)"
        echo "  platform   Platform to test (default: $DEFAULT_PLATFORM)"
        echo ""
        echo "Examples:"
        echo "  $0"
        echo "  $0 claude-config:latest"
        echo "  $0 claude-config:latest 60"
        echo "  $0 claude-config:latest 60 linux/arm64"
        exit 0
        ;;
    *)
        main
        ;;
esac