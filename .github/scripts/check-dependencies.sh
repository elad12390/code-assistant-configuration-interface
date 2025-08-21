#!/bin/bash
set -euo pipefail

# GitHub Actions Helper Script: Check Dependencies
# This script checks for dependency vulnerabilities, outdated packages, and license compliance

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/../.." && pwd)"

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

# Check for vulnerabilities using npm audit
check_vulnerabilities() {
    log_info "🔍 Checking for security vulnerabilities..."
    cd "$PROJECT_ROOT/caci"
    
    # Run npm audit
    if npm audit --audit-level=moderate --json > npm-audit-results.json 2>/dev/null; then
        log_success "No moderate or higher vulnerabilities found"
        return 0
    else
        local exit_code=$?
        
        if [[ -f npm-audit-results.json ]]; then
            # Parse audit results
            local critical=$(jq -r '.metadata.vulnerabilities.critical // 0' npm-audit-results.json 2>/dev/null || echo "0")
            local high=$(jq -r '.metadata.vulnerabilities.high // 0' npm-audit-results.json 2>/dev/null || echo "0")
            local moderate=$(jq -r '.metadata.vulnerabilities.moderate // 0' npm-audit-results.json 2>/dev/null || echo "0")
            local low=$(jq -r '.metadata.vulnerabilities.low // 0' npm-audit-results.json 2>/dev/null || echo "0")
            
            echo "Vulnerability Summary:"
            echo "  Critical: $critical"
            echo "  High: $high"
            echo "  Moderate: $moderate"
            echo "  Low: $low"
            
            if [[ "$critical" -gt 0 ]] || [[ "$high" -gt 0 ]]; then
                log_error "Critical or high severity vulnerabilities found!"
                
                # Show details
                log_info "Vulnerability details:"
                npm audit --audit-level=high 2>/dev/null || true
                
                return 1
            elif [[ "$moderate" -gt 0 ]]; then
                log_warning "Moderate severity vulnerabilities found"
                npm audit --audit-level=moderate 2>/dev/null || true
            fi
        fi
        
        return $exit_code
    fi
}

# Check for outdated packages
check_outdated_packages() {
    log_info "📦 Checking for outdated packages..."
    cd "$PROJECT_ROOT/caci"
    
    # Create outdated report
    if npm outdated --json > npm-outdated-results.json 2>/dev/null || true; then
        if [[ -s npm-outdated-results.json ]] && [[ "$(cat npm-outdated-results.json)" != "{}" ]]; then
            log_warning "Outdated packages found:"
            
            # Parse and display outdated packages
            jq -r 'to_entries[] | "\(.key): \(.value.current) -> \(.value.wanted) (latest: \(.value.latest))"' npm-outdated-results.json 2>/dev/null || {
                log_info "Raw outdated output:"
                npm outdated 2>/dev/null || true
            }
            
            # Count outdated packages
            local outdated_count
            outdated_count=$(jq 'length' npm-outdated-results.json 2>/dev/null || echo "0")
            log_warning "$outdated_count packages are outdated"
        else
            log_success "All packages are up to date"
        fi
    else
        log_warning "Could not check for outdated packages"
    fi
}

# Check licenses
check_licenses() {
    log_info "📄 Checking license compliance..."
    cd "$PROJECT_ROOT/caci"
    
    # Install license-checker if not present
    if ! command_exists license-checker; then
        log_info "Installing license-checker..."
        npm install -g license-checker >/dev/null 2>&1 || {
            log_warning "Could not install license-checker globally, trying locally..."
            npx license-checker --version >/dev/null 2>&1 || {
                log_error "Could not use license-checker"
                return 1
            }
        }
    fi
    
    # Allowed licenses
    local allowed_licenses="MIT;ISC;BSD-2-Clause;BSD-3-Clause;Apache-2.0;CC0-1.0;Unlicense;0BSD"
    
    # Check licenses
    if license-checker --onlyAllow "$allowed_licenses" --production --json > license-results.json 2>/dev/null; then
        log_success "All licenses are compliant"
        
        # Count licenses
        local license_count
        license_count=$(jq 'length' license-results.json 2>/dev/null || echo "0")
        log_info "$license_count packages checked"
        
    else
        log_error "License compliance issues found!"
        
        # Show problematic licenses
        log_info "Generating detailed license report..."
        license-checker --production --csv > license-report.csv 2>/dev/null || true
        
        if [[ -f license-report.csv ]]; then
            log_info "Problematic licenses:"
            grep -v "^module name,license,repository$" license-report.csv | \
            grep -v -E "(MIT|ISC|BSD-2-Clause|BSD-3-Clause|Apache-2.0|CC0-1.0|Unlicense|0BSD)" | \
            head -10 || log_info "No specific problematic licenses found in CSV"
        fi
        
        return 1
    fi
}

# Check package size
check_package_size() {
    log_info "📏 Checking package size..."
    cd "$PROJECT_ROOT/caci"
    
    # Get package size
    local size_output
    size_output=$(npm pack --dry-run 2>&1 | grep "package size" || echo "")
    
    if [[ -n "$size_output" ]]; then
        log_info "$size_output"
        
        # Extract size in bytes
        local size_bytes
        size_bytes=$(echo "$size_output" | grep -o '[0-9]\+ B' | grep -o '[0-9]\+' || echo "0")
        
        # Convert to KB
        local size_kb=$((size_bytes / 1024))
        
        if [[ $size_kb -gt 1024 ]]; then # > 1MB
            log_warning "Package size is quite large: ${size_kb}KB"
        elif [[ $size_kb -gt 512 ]]; then # > 512KB
            log_warning "Package size is moderate: ${size_kb}KB"
        else
            log_success "Package size is reasonable: ${size_kb}KB"
        fi
    else
        log_warning "Could not determine package size"
    fi
}

# Check dependency tree depth
check_dependency_depth() {
    log_info "🌳 Analyzing dependency tree..."
    cd "$PROJECT_ROOT/caci"
    
    # Get dependency tree
    if npm ls --depth=0 --json > dependency-tree.json 2>/dev/null; then
        local dep_count
        dep_count=$(jq '.dependencies | length' dependency-tree.json 2>/dev/null || echo "0")
        log_info "Direct dependencies: $dep_count"
        
        # Check for common problematic patterns
        if npm ls --json > full-dependency-tree.json 2>/dev/null; then
            # Check for duplicate packages (different versions)
            log_info "Checking for duplicate packages..."
            npm ls --depth=0 2>&1 | grep -i "deduped\|duplicate" || log_success "No obvious duplicates found"
        fi
    else
        log_warning "Could not analyze dependency tree"
    fi
}

# Check for known security advisories
check_security_advisories() {
    log_info "🛡️ Checking GitHub Security Advisories..."
    cd "$PROJECT_ROOT/caci"
    
    # This would typically use GitHub's security advisory API
    # For now, we'll rely on npm audit which checks the same database
    log_info "Security advisories are checked via npm audit"
}

# Generate dependency report
generate_report() {
    log_info "📊 Generating dependency report..."
    cd "$PROJECT_ROOT/caci"
    
    local report_file="dependency-report.md"
    
    cat > "$report_file" << EOF
# Dependency Report

Generated on: $(date)
Project: $(jq -r '.name // "unknown"' package.json 2>/dev/null)
Version: $(jq -r '.version // "unknown"' package.json 2>/dev/null)

## Summary

EOF
    
    # Add vulnerability summary if audit results exist
    if [[ -f npm-audit-results.json ]]; then
        echo "### Security Vulnerabilities" >> "$report_file"
        echo "" >> "$report_file"
        
        local critical=$(jq -r '.metadata.vulnerabilities.critical // 0' npm-audit-results.json 2>/dev/null || echo "0")
        local high=$(jq -r '.metadata.vulnerabilities.high // 0' npm-audit-results.json 2>/dev/null || echo "0")
        local moderate=$(jq -r '.metadata.vulnerabilities.moderate // 0' npm-audit-results.json 2>/dev/null || echo "0")
        local low=$(jq -r '.metadata.vulnerabilities.low // 0' npm-audit-results.json 2>/dev/null || echo "0")
        
        echo "- Critical: $critical" >> "$report_file"
        echo "- High: $high" >> "$report_file"
        echo "- Moderate: $moderate" >> "$report_file"
        echo "- Low: $low" >> "$report_file"
        echo "" >> "$report_file"
    fi
    
    # Add outdated packages summary
    if [[ -f npm-outdated-results.json ]]; then
        echo "### Outdated Packages" >> "$report_file"
        echo "" >> "$report_file"
        
        if [[ -s npm-outdated-results.json ]] && [[ "$(cat npm-outdated-results.json)" != "{}" ]]; then
            local outdated_count
            outdated_count=$(jq 'length' npm-outdated-results.json 2>/dev/null || echo "0")
            echo "- Outdated packages: $outdated_count" >> "$report_file"
        else
            echo "- All packages are up to date" >> "$report_file"
        fi
        echo "" >> "$report_file"
    fi
    
    # Add license summary
    if [[ -f license-results.json ]]; then
        echo "### License Compliance" >> "$report_file"
        echo "" >> "$report_file"
        
        local license_count
        license_count=$(jq 'length' license-results.json 2>/dev/null || echo "0")
        echo "- Packages checked: $license_count" >> "$report_file"
        echo "- All licenses are compliant with allowed list" >> "$report_file"
        echo "" >> "$report_file"
    fi
    
    log_success "Report generated: $report_file"
}

# Clean up temporary files
cleanup() {
    log_info "🧹 Cleaning up temporary files..."
    cd "$PROJECT_ROOT/caci"
    
    rm -f npm-audit-results.json
    rm -f npm-outdated-results.json
    rm -f license-results.json
    rm -f license-report.csv
    rm -f dependency-tree.json
    rm -f full-dependency-tree.json
    
    log_success "Cleanup complete"
}

# Main execution
main() {
    log_info "Starting dependency checks..."
    
    cd "$PROJECT_ROOT/caci"
    
    local exit_code=0
    
    # Run all checks
    check_vulnerabilities || exit_code=1
    check_outdated_packages
    check_licenses || exit_code=1
    check_package_size
    check_dependency_depth
    check_security_advisories
    
    # Generate report
    generate_report
    
    if [[ $exit_code -eq 0 ]]; then
        log_success "✅ All dependency checks passed!"
    else
        log_error "❌ Some dependency checks failed!"
    fi
    
    return $exit_code
}

# Handle script arguments
case "${1:-}" in
    --help|-h)
        echo "Usage: $0 [options]"
        echo "Options:"
        echo "  --help, -h          Show this help message"
        echo "  --vulnerabilities   Check vulnerabilities only"
        echo "  --outdated         Check outdated packages only"
        echo "  --licenses         Check licenses only"
        echo "  --size             Check package size only"
        echo "  --report           Generate report only"
        echo "  --cleanup          Clean up temporary files only"
        exit 0
        ;;
    --vulnerabilities)
        check_vulnerabilities
        ;;
    --outdated)
        check_outdated_packages
        ;;
    --licenses)
        check_licenses
        ;;
    --size)
        check_package_size
        ;;
    --report)
        generate_report
        ;;
    --cleanup)
        cleanup
        ;;
    "")
        main
        cleanup
        ;;
    *)
        log_error "Unknown option: $1"
        echo "Use --help for usage information"
        exit 1
        ;;
esac