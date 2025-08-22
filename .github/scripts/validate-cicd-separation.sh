#!/bin/bash

# CI/CD Separation Validation Script
# This script validates that package and website CI/CD pipelines are properly separated

set -e

echo "🔍 Validating CI/CD Pipeline Separation..."
echo "=========================================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Counters
PASS=0
FAIL=0

# Helper function to validate
validate() {
    local test_name="$1"
    local condition="$2"
    
    if [ "$condition" = "true" ]; then
        echo -e "✅ ${GREEN}PASS${NC}: $test_name"
        ((PASS++))
    else
        echo -e "❌ ${RED}FAIL${NC}: $test_name"
        ((FAIL++))
    fi
}

echo ""
echo "📦 Testing Package Workflows..."
echo "--------------------------------"

# Test 1: Package workflows exist
PACKAGE_WORKFLOWS=$(find .github/workflows -name "*.yml" -exec grep -l "working-directory: packages/caci" {} \; 2>/dev/null | wc -l)
validate "Package workflows exist" "$([ $PACKAGE_WORKFLOWS -gt 0 ] && echo true || echo false)"

# Test 2: Package workflows have correct path filters
PACKAGE_PATH_FILTERS=$(grep -r "packages/caci/\*\*" .github/workflows/*.yml 2>/dev/null | wc -l)
validate "Package workflows have packages/caci/** path filters" "$([ $PACKAGE_PATH_FILTERS -gt 0 ] && echo true || echo false)"

# Test 3: Package workflows don't reference website paths
PACKAGE_WEBSITE_REFS=$(grep -r "packages/website" .github/workflows/ci.yml .github/workflows/publish-npm.yml .github/workflows/security.yml 2>/dev/null | wc -l)
validate "Package workflows don't reference website paths" "$([ $PACKAGE_WEBSITE_REFS -eq 0 ] && echo true || echo false)"

echo ""
echo "🌐 Testing Website Workflows..."
echo "--------------------------------"

# Test 4: Website workflows exist
WEBSITE_WORKFLOWS=$(find .github/workflows -name "*.yml" -exec grep -l "packages/website" {} \; 2>/dev/null | wc -l)
validate "Website workflows exist" "$([ $WEBSITE_WORKFLOWS -gt 0 ] && echo true || echo false)"

# Test 5: Website workflows have correct path filters
WEBSITE_PATH_FILTERS=$(grep -r "packages/website/\*\*" .github/workflows/*.yml 2>/dev/null | wc -l)
validate "Website workflows have packages/website/** path filters" "$([ $WEBSITE_PATH_FILTERS -gt 0 ] && echo true || echo false)"

# Test 6: Website workflows don't reference package paths  
WEBSITE_PACKAGE_REFS=$(grep -r "working-directory: packages/caci" .github/workflows/website-ci.yml .github/workflows/deploy-website.yml 2>/dev/null | wc -l)
validate "Website workflows don't reference package paths" "$([ $WEBSITE_PACKAGE_REFS -eq 0 ] && echo true || echo false)"

echo ""
echo "🏷️ Testing Workflow Naming..."
echo "------------------------------"

# Test 7: Package workflows have clear naming
PACKAGE_NAMED_WORKFLOWS=$(grep -r "name:.*CACI Package" .github/workflows/*.yml 2>/dev/null | wc -l)
validate "Package workflows use 'CACI Package' naming" "$([ $PACKAGE_NAMED_WORKFLOWS -gt 0 ] && echo true || echo false)"

# Test 8: Website workflows have clear naming
WEBSITE_NAMED_WORKFLOWS=$(grep -r "name:.*Website" .github/workflows/*.yml 2>/dev/null | wc -l)
validate "Website workflows use 'Website' naming" "$([ $WEBSITE_NAMED_WORKFLOWS -gt 0 ] && echo true || echo false)"

echo ""
echo "🔧 Testing Directory Structure..."
echo "----------------------------------"

# Test 9: Package directory exists
validate "Package directory (packages/caci/) exists" "$([ -d "packages/caci" ] && echo true || echo false)"

# Test 10: Website directory exists
validate "Website directory (packages/website/) exists" "$([ -d "packages/website" ] && echo true || echo false)"

# Test 11: Package has package.json
validate "Package has package.json" "$([ -f "packages/caci/package.json" ] && echo true || echo false)"

# Test 12: Website has package.json
validate "Website has package.json" "$([ -f "packages/website/package.json" ] && echo true || echo false)"

echo ""
echo "📄 Testing Exclusion Patterns..."
echo "---------------------------------"

# Test 13: Package workflows exclude build artifacts
PACKAGE_EXCLUDES=$(grep -r "!packages/caci/node_modules" .github/workflows/*.yml 2>/dev/null | wc -l)
validate "Package workflows exclude build artifacts" "$([ $PACKAGE_EXCLUDES -gt 0 ] && echo true || echo false)"

# Test 14: Website workflows exclude build artifacts
WEBSITE_EXCLUDES=$(grep -r "!packages/website/node_modules" .github/workflows/*.yml 2>/dev/null | wc -l)
validate "Website workflows exclude build artifacts" "$([ $WEBSITE_EXCLUDES -gt 0 ] && echo true || echo false)"

echo ""
echo "📊 Summary"
echo "=========="
echo -e "✅ ${GREEN}Passed${NC}: $PASS tests"
echo -e "❌ ${RED}Failed${NC}: $FAIL tests"
echo -e "🎯 ${YELLOW}Total${NC}: $((PASS + FAIL)) tests"

if [ $FAIL -eq 0 ]; then
    echo ""
    echo -e "🎉 ${GREEN}All tests passed! CI/CD separation is properly configured.${NC}"
    exit 0
else
    echo ""
    echo -e "⚠️  ${RED}Some tests failed. Please review the CI/CD configuration.${NC}"
    exit 1
fi