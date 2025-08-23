#!/usr/bin/env node

// Test with real API to verify the integration works
const { spawn } = require('child_process');

// Test the actual CLI with environment simulation
function testWithAPIKey(provider, envVar, apiKey) {
  return new Promise((resolve, reject) => {
    console.log(`🧪 Testing ${provider} integration...`);
    
    const env = { ...process.env };
    // Clear other API keys
    delete env.ANTHROPIC_API_KEY;
    delete env.GOOGLE_API_KEY;
    delete env.OPENAI_API_KEY;
    // Set the test key
    env[envVar] = apiKey;
    
    const cli = spawn('node', ['/home/eladbenhaim/dev/personal/claude-code-configurator/packages/caci/bin/caci', 'configure'], {
      cwd: '/tmp/caci-test-clean',
      env,
      stdio: ['pipe', 'pipe', 'pipe']
    });

    let output = '';
    let hasError = false;

    cli.stdout.on('data', (data) => {
      output += data.toString();
      console.log(`📄 ${provider}:`, data.toString().trim());
    });

    cli.stderr.on('data', (data) => {
      output += data.toString();
      console.log(`⚠️  ${provider} stderr:`, data.toString().trim());
      hasError = true;
    });

    // Send automated responses for the prompts
    setTimeout(() => {
      cli.stdin.write('Other\n'); // Project type
    }, 2000);
    
    setTimeout(() => {
      cli.stdin.write(' \n'); // Programming languages (skip)
    }, 3000);
    
    setTimeout(() => {
      cli.stdin.write(' \n'); // Frameworks (skip)
    }, 4000);
    
    setTimeout(() => {
      cli.stdin.write('Advanced - Extensive experience\n'); // Experience
    }, 5000);
    
    setTimeout(() => {
      cli.stdin.write('Test project\n'); // Description
    }, 6000);

    // Kill after reasonable time
    const timeout = setTimeout(() => {
      cli.kill('SIGTERM');
      resolve({
        provider,
        success: !hasError && output.includes('Successfully generated AI recommendations'),
        output: output,
        timedOut: true
      });
    }, 30000);

    cli.on('close', (code) => {
      clearTimeout(timeout);
      resolve({
        provider,
        success: code === 0 && output.includes('Successfully generated AI recommendations'),
        output: output,
        exitCode: code,
        timedOut: false
      });
    });

    cli.on('error', (error) => {
      clearTimeout(timeout);
      reject(error);
    });
  });
}

async function runTests() {
  console.log('🚀 Testing CACI Real API Integration\n');
  
  // Test with mock/demo keys (these will fail but should show proper error handling)
  const tests = [
    { provider: 'Gemini', envVar: 'GOOGLE_API_KEY', key: 'demo-key-123' }
  ];

  for (const test of tests) {
    try {
      const result = await testWithAPIKey(test.provider, test.envVar, test.key);
      
      console.log(`\n📊 ${test.provider} Test Results:`);
      console.log(`   Success: ${result.success}`);
      console.log(`   Exit Code: ${result.exitCode}`);
      console.log(`   Timed Out: ${result.timedOut}`);
      
      if (result.output.includes('Failed to generate AI recommendations')) {
        console.log(`✅ ${test.provider}: Properly detected API failure`);
      } else if (result.output.includes('Successfully generated AI recommendations')) {
        console.log(`🎉 ${test.provider}: Successfully generated recommendations!`);
      } else {
        console.log(`ℹ️  ${test.provider}: Unclear result, check output above`);
      }
    } catch (error) {
      console.error(`❌ ${test.provider} test failed: ${error.message}`);
    }
    
    console.log('\n' + '='.repeat(50) + '\n');
  }
}

runTests().catch(error => {
  console.error(`💥 Test suite failed: ${error.message}`);
  process.exit(1);
});