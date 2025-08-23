#!/usr/bin/env node

// Test usage statistics calculation and display
const fs = require('fs');
const path = require('path');

// Load components data
const componentsPath = path.join(__dirname, 'components.json');
const componentsData = JSON.parse(fs.readFileSync(componentsPath, 'utf8'));

// Import the display function
const { displayRecommendations } = require('./packages/caci/dist/analyzer/display.js');

// Parse components into the expected object format (like the parser does)
const { parseComponentsFile } = require('./packages/caci/dist/analyzer/parser.js');
const parsedComponents = parseComponentsFile(componentsPath);

// Create a sample recommendation to test display with real component names
const sampleRecommendations = {
  agents: ['business-analyst', 'task-decomposition-expert', 'hackathon-ai-strategist', 'prompt-engineer'],
  commands: ['setup-linting', 'optimize-build', 'fix-github-issue'],
  hooks: ['ai-commit-message', 'claude-debug-assistant'], 
  mcps: ['context7']
};

console.log('🧪 Testing Usage Statistics Display');
console.log('===================================\n');

try {
  displayRecommendations(sampleRecommendations, parsedComponents);
  console.log('\n✅ Usage statistics display test completed!');
} catch (error) {
  console.error(`❌ Test failed: ${error.message}`);
  process.exit(1);
}