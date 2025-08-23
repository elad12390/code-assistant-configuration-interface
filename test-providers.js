#!/usr/bin/env node

// Test the multi-provider LangChain integration
const { recommendComponents } = require('./packages/caci/dist/analyzer/ai-recommender.js');

const mockUserRequirements = {
  'project-type': 'Web Application',
  'programming-languages': ['JavaScript/TypeScript'],
  'web-frameworks': ['React', 'Next.js'],
  'experience-level': 'Advanced - Extensive experience',
  'project-description': 'A test project for CACI validation',
  projectStructure: 'test-project/\n├── package.json\n├── src/\n└── README.md'
};

const mockComponentsData = {
  agents: {
    'react-expert': { name: 'react-expert', description: 'React development expert' },
    'typescript-developer': { name: 'typescript-developer', description: 'TypeScript specialist' },
    'fullstack-developer': { name: 'fullstack-developer', description: 'Full-stack developer' }
  },
  commands: {
    'npm-install': { name: 'npm-install', description: 'Install npm packages' },
    'npm-test': { name: 'npm-test', description: 'Run npm tests' },
    'build-project': { name: 'build-project', description: 'Build the project' }
  },
  hooks: {
    'pre-commit-lint': { name: 'pre-commit-lint', description: 'Lint before commit' },
    'pre-push-test': { name: 'pre-push-test', description: 'Test before push' }
  },
  mcps: {
    'github-mcp': { name: 'github-mcp', description: 'GitHub integration' },
    'filesystem-mcp': { name: 'filesystem-mcp', description: 'File system operations' }
  },
  settings: {},
  templates: {}
};

async function testProviders() {
  console.log('🧪 Testing CACI Multi-Provider Integration\n');

  // Test 1: No API keys (should fail gracefully)
  console.log('📋 Test 1: No API keys provided');
  delete process.env.ANTHROPIC_API_KEY;
  delete process.env.GOOGLE_API_KEY;
  delete process.env.OPENAI_API_KEY;
  
  try {
    await recommendComponents(mockUserRequirements, mockComponentsData);
    console.log('❌ Unexpected success - should have failed');
  } catch (error) {
    console.log(`✅ Correctly failed: ${error.message}`);
  }

  // Test 2: With Google API key (if available)
  console.log('\n📋 Test 2: Testing provider detection');
  if (process.env.TEST_GOOGLE_API_KEY) {
    process.env.GOOGLE_API_KEY = process.env.TEST_GOOGLE_API_KEY;
    try {
      console.log('🔍 Testing with Gemini API key...');
      const result = await recommendComponents(mockUserRequirements, mockComponentsData);
      console.log('✅ Success! Received recommendations:');
      console.log(`   Agents: ${result.agents.length} items`);
      console.log(`   Commands: ${result.commands.length} items`);
      console.log(`   Hooks: ${result.hooks.length} items`);
      console.log(`   MCPs: ${result.mcps.length} items`);
      console.log('📊 Sample results:', JSON.stringify(result, null, 2));
    } catch (error) {
      console.log(`❌ Failed with Gemini: ${error.message}`);
    }
  } else {
    console.log('ℹ️  Skipping Gemini test (set TEST_GOOGLE_API_KEY to test)');
  }

  // Test 3: Test provider priority
  console.log('\n📋 Test 3: Testing provider priority');
  process.env.GOOGLE_API_KEY = 'fake-google-key';
  process.env.ANTHROPIC_API_KEY = 'fake-anthropic-key';
  
  try {
    await recommendComponents(mockUserRequirements, mockComponentsData);
  } catch (error) {
    const errorMsg = error.message;
    if (errorMsg.includes('anthropic')) {
      console.log('✅ Correctly prioritized Anthropic over Gemini');
    } else if (errorMsg.includes('gemini')) {
      console.log('⚠️  Used Gemini (may be correct if Anthropic failed)');
    } else {
      console.log(`ℹ️  Provider test result: ${errorMsg}`);
    }
  }

  console.log('\n🎉 Provider integration tests completed!');
}

testProviders().catch(error => {
  console.error(`💥 Test failed: ${error.message}`);
  process.exit(1);
});