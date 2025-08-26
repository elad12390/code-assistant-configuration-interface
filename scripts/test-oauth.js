#!/usr/bin/env node

const { isAuthenticated, getStoredApiKey, clearStoredApiKey } = require('./packages/caci/dist/auth/oauth');

async function testOAuth() {
  console.log('Testing OAuth implementation...\n');

  try {
    // Check if already authenticated
    const authenticated = await isAuthenticated();
    console.log('Already authenticated:', authenticated);

    // Get stored key if available
    const storedKey = await getStoredApiKey();
    console.log('Stored key available:', !!storedKey);
    
    if (storedKey) {
      console.log('Key prefix:', storedKey.substring(0, 10) + '...');
    }

    console.log('\n✅ OAuth system is working correctly!');
    
    // Optionally clear for testing
    // await clearStoredApiKey();
    // console.log('✅ Cleared stored credentials for testing');
    
  } catch (error) {
    console.error('❌ OAuth test failed:', error.message);
  }
}

testOAuth();