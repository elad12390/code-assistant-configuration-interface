#!/usr/bin/env node

// Test MCP parsing logic
const fs = require('fs');
const path = require('path');

// Load actual components data
const componentsPath = path.join(__dirname, 'components.json');
const { parseComponentsFile } = require('./packages/caci/dist/analyzer/parser.js');
const componentsData = parseComponentsFile(componentsPath);

console.log('🧪 Testing MCP Parsing Logic');
console.log('============================\n');

// Test a few MCPs to see what commands would be generated
const testMCPs = ['deepgraph-nextjs', 'context7', 'github-integration', 'filesystem-access'];

for (const mcpName of testMCPs) {
  const mcp = componentsData.mcps[mcpName];
  if (!mcp) {
    console.log(`❌ ${mcpName}: Not found in components`);
    continue;
  }

  console.log(`🔍 Testing ${mcpName}:`);
  console.log(`   Content length: ${mcp.content.length} chars`);
  
  try {
    const mcpContent = mcp.content;
    const mcpConfig = JSON.parse(mcpContent);
    console.log(`   ✅ Valid JSON config`);
    
    if (mcpConfig.mcpServers) {
      const serverName = Object.keys(mcpConfig.mcpServers)[0];
      const serverConfig = mcpConfig.mcpServers[serverName];
      console.log(`   Server: ${serverName}`);
      
      if (serverConfig.command && serverConfig.args) {
        const args = Array.isArray(serverConfig.args) ? serverConfig.args.join(' ') : serverConfig.args;
        const command = `claude mcp add ${mcpName} -- ${serverConfig.command} ${args}`;
        console.log(`   ✅ Generated command: ${command}`);
      } else if (serverConfig.url) {
        const transport = serverConfig.transport || 'http';
        const command = `claude mcp add --transport ${transport} ${mcpName} ${serverConfig.url}`;
        console.log(`   ✅ Generated command: ${command}`);
      } else {
        console.log(`   ❌ No command/url found in server config`);
      }
    } else {
      console.log(`   ❌ No mcpServers found in config`);
    }
  } catch (error) {
    console.log(`   ❌ JSON parse error: ${error.message}`);
    console.log(`   📄 Raw content: ${mcp.content.substring(0, 100)}...`);
  }
  
  console.log('');
}

console.log('✅ MCP parsing test completed!');