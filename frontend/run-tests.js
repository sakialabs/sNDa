#!/usr/bin/env node

/**
 * Simple test runner for sNDa Frontend
 * Helps run specific test suites and handle common issues
 */

const { spawn } = require('child_process');
const path = require('path');

const testSuites = {
  unit: 'tests/components/**/*.test.tsx',
  integration: 'tests/e2e/**/*.spec.ts',
  auth: 'tests/components/auth/**/*.test.tsx',
  components: 'tests/components/**/*.test.tsx',
  utils: 'tests/utils/**/*.test.ts',
};

function runTests(pattern = '', options = []) {
  const args = ['vitest', 'run'];
  
  if (pattern) {
    args.push(pattern);
  }
  
  args.push(...options);
  
  console.log(`Running: npx ${args.join(' ')}`);
  
  const child = spawn('npx', args, {
    stdio: 'inherit',
    shell: true,
    cwd: process.cwd(),
  });
  
  child.on('close', (code) => {
    process.exit(code);
  });
  
  child.on('error', (err) => {
    console.error('Failed to start test process:', err);
    process.exit(1);
  });
}

function showHelp() {
  console.log(`
sNDa Frontend Test Runner

Usage:
  node run-tests.js [suite] [options]

Test Suites:
  unit         - Run unit tests (components)
  integration  - Run integration tests (e2e)
  auth         - Run authentication tests
  components   - Run all component tests
  utils        - Run utility tests
  all          - Run all tests (default)

Options:
  --watch      - Run in watch mode
  --coverage   - Generate coverage report
  --ui         - Open test UI
  --reporter   - Specify reporter (default, verbose, json)

Examples:
  node run-tests.js                    # Run all tests
  node run-tests.js auth               # Run auth tests only
  node run-tests.js unit --watch       # Run unit tests in watch mode
  node run-tests.js all --coverage     # Run all tests with coverage
`);
}

const [,, suite = 'all', ...options] = process.argv;

if (suite === '--help' || suite === '-h') {
  showHelp();
  process.exit(0);
}

if (suite === 'all') {
  runTests('', options);
} else if (testSuites[suite]) {
  runTests(testSuites[suite], options);
} else {
  console.error(`Unknown test suite: ${suite}`);
  console.error('Run "node run-tests.js --help" for available options');
  process.exit(1);
}