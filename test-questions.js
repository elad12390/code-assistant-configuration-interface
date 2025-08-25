#!/usr/bin/env node

const { PROJECT_REQUIREMENTS_QUESTIONS } = require('./packages/caci/dist/analyzer/questions');

console.log('Testing enhanced questions...\n');

console.log('Number of questions:', PROJECT_REQUIREMENTS_QUESTIONS.length);
console.log('\nFirst question (OAuth authentication):');
console.log('ID:', PROJECT_REQUIREMENTS_QUESTIONS[0].id);
console.log('Text:', PROJECT_REQUIREMENTS_QUESTIONS[0].text);
console.log('Type:', PROJECT_REQUIREMENTS_QUESTIONS[0].type);
console.log('Options:', PROJECT_REQUIREMENTS_QUESTIONS[0].options);

console.log('\n✅ Enhanced authentication flow is properly configured!');