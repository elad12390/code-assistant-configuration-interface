#!/usr/bin/env node

const { spawn } = require('child_process');

// Test the actual Claude CLI call that CACI makes
const prompt = `You are an expert AI assistant that helps developers select the most appropriate Claude Code components for their projects.

User Requirements:
{
  "project-type": "Other",
  "programming-languages": ["JavaScript/TypeScript"],
  "web-frameworks": ["React", "Next.js", "Other"],
  "experience-level": "Advanced - Extensive experience",
  "project-description": "CACI tool"
}

Project Description: CACI tool

Project Structure Analysis:
claude-code-configurator/
├── CHANGELOG.md
├── CLAUDE.md
├── README.md
├── package.json
├── packages/
├── docs/
└── components.json

Available Components:
- Agents: agent-fullstack-vue-nuxt-developer, agent-nodejs-developer, agent-react-developer, agent-typescript-developer
- Commands: npm-install, npm-run-build, npm-run-dev, npm-run-test
- Hooks: pre-commit-format, pre-commit-lint, pre-commit-test
- MCPs: github-mcp, filesystem-mcp

Based on the user's requirements, recommend the most relevant components from each category.

YOU ARE A JSON API. OUTPUT ONLY JSON. NO QUESTIONS. NO EXPLANATIONS.

Return ONLY this JSON structure with real component names from the available lists:
{
  "agents": ["agent-name-1", "agent-name-2"],
  "commands": ["command-name-1", "command-name-2"], 
  "hooks": ["hook-name-1", "hook-name-2"],
  "mcps": ["mcp-name-1", "mcp-name-2"]
}

Important guidelines:
1. Only recommend components that actually exist in the provided lists
2. Analyze the project structure to understand the tech stack, frameworks, and architecture
3. Consider the natural language project description to understand the project's purpose and requirements
4. Prioritize components that are most relevant to the detected tech stack and project goals
5. Include a reasonable number of recommendations (3-8 per category)
6. If a category is not relevant to the user's project, you can return an empty array for that category
7. Pay special attention to package.json, requirements.txt, or other dependency files in the structure

RESPOND WITH ONLY THE JSON OBJECT - NO OTHER TEXT OR FORMATTING`;

function testClaude() {
  return new Promise((resolve, reject) => {
    console.log('🔍 Testing Claude CLI with actual CACI prompt...\n');
    
    const args = [
      '-p', prompt,
      '--output-format', 'text',
      '--model', 'sonnet',
      '--permission-mode', 'plan',
      '--append-system-prompt', 'You are a component recommendation API. Respond ONLY with valid JSON. No explanations, no questions, no markdown. Just output the JSON object exactly as specified in the prompt.'
    ];
    
    const claude = spawn('claude', args, { stdio: ['ignore', 'pipe', 'pipe'] });
    let stdout = '';
    let stderr = '';
    
    claude.stdout.on('data', (data) => {
      stdout += data.toString();
    });
    
    claude.stderr.on('data', (data) => {
      stderr += data.toString();
    });
    
    claude.on('close', (code) => {
      console.log(`📊 Claude CLI Exit Code: ${code}`);
      console.log(`📝 Raw Claude Response:`);
      console.log('=' * 50);
      console.log(stdout);
      console.log('=' * 50);
      
      if (stderr) {
        console.log(`⚠️  Claude CLI Stderr:`);
        console.log(stderr);
      }
      
      // Try to parse as JSON
      try {
        let jsonText = stdout.trim();
        
        // Remove any markdown code blocks if present
        const jsonMatch = jsonText.match(/```(?:json)?\s*(\{[\s\S]*?\})\s*```/);
        if (jsonMatch) {
          console.log(`🔍 Found JSON in markdown block`);
          jsonText = jsonMatch[1];
        }
        
        const parsed = JSON.parse(jsonText);
        console.log(`✅ Successfully parsed JSON:`);
        console.log(JSON.stringify(parsed, null, 2));
        resolve(parsed);
      } catch (error) {
        console.log(`❌ JSON Parse Error: ${error.message}`);
        console.log(`📄 Attempted to parse: "${stdout.trim()}"`);
        reject(error);
      }
    });
    
    claude.on('error', (error) => {
      console.error(`❌ Claude CLI Error: ${error.message}`);
      reject(error);
    });
  });
}

testClaude().catch(error => {
  console.error(`💥 Test failed: ${error.message}`);
  process.exit(1);
});