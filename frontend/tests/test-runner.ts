#!/usr/bin/env node

/**
 * Frontend Test Runner for sNDa
 * Comprehensive testing suite with multiple test modes
 */

import { execSync } from 'child_process';
import { existsSync } from 'fs';

const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
};

function log(message: string, color = colors.reset) {
  console.log(`${color}${message}${colors.reset}`);
}

function runCommand(command: string, description: string) {
  log(`\n${colors.blue}🔄 ${description}...${colors.reset}`);
  try {
    execSync(command, { stdio: 'inherit', cwd: process.cwd() });
    log(`${colors.green}✅ ${description} completed successfully${colors.reset}`);
    return true;
  } catch (error) {
    log(`${colors.red}❌ ${description} failed${colors.reset}`);
    return false;
  }
}

function checkPrerequisites() {
  log(`${colors.cyan}🔍 Checking prerequisites...${colors.reset}`);
  
  if (!existsSync('package.json')) {
    log(`${colors.red}❌ package.json not found. Run from frontend directory.${colors.reset}`);
    process.exit(1);
  }
  
  if (!existsSync('node_modules')) {
    log(`${colors.yellow}⚠️  node_modules not found. Installing dependencies...${colors.reset}`);
    runCommand('npm install', 'Installing dependencies');
  }
  
  log(`${colors.green}✅ Prerequisites check passed${colors.reset}`);
}

function showUsage() {
  log(`
${colors.bright}sNDa Frontend Test Runner${colors.reset}

${colors.cyan}Usage:${colors.reset}
  npm run test:runner <command>
  
${colors.cyan}Commands:${colors.reset}
  ${colors.green}all${colors.reset}          - Run complete test suite (unit + e2e + coverage)
  ${colors.green}unit${colors.reset}         - Run unit tests only
  ${colors.green}e2e${colors.reset}          - Run end-to-end tests
  ${colors.green}coverage${colors.reset}     - Generate coverage report
  ${colors.green}watch${colors.reset}        - Run tests in watch mode
  ${colors.green}lint${colors.reset}         - Run linting and type checking
  ${colors.green}build${colors.reset}        - Test production build
  ${colors.green}ci${colors.reset}           - Run CI pipeline (lint + test + build)
  ${colors.green}components${colors.reset}   - Test components only
  ${colors.green}auth${colors.reset}         - Test authentication flows
  ${colors.green}coordinator${colors.reset}  - Test coordinator dashboard
  ${colors.green}volunteer${colors.reset}    - Test volunteer features
  ${colors.green}donor${colors.reset}        - Test donation features

${colors.cyan}Examples:${colors.reset}
  npm run test:runner all
  npm run test:runner unit --watch
  npm run test:runner e2e --headed
`);
}

async function main() {
  const command = process.argv[2];
  
  if (!command || command === 'help' || command === '--help') {
    showUsage();
    return;
  }
  
  checkPrerequisites();
  
  log(`${colors.bright}🚀 Starting sNDa Frontend Tests${colors.reset}`);
  log(`${colors.cyan}Command: ${command}${colors.reset}\n`);
  
  let success = true;
  
  switch (command) {
    case 'all':
      success = runCommand('npm run lint', 'Linting and type checking') &&
                runCommand('npm run test', 'Unit tests') &&
                runCommand('npm run test -- --coverage', 'Coverage report') &&
                runCommand('npm run e2e', 'End-to-end tests');
      break;
      
    case 'unit':
      success = runCommand('npm run test', 'Unit tests');
      break;
      
    case 'e2e':
      const e2eArgs = process.argv.slice(3).join(' ');
      success = runCommand(`npm run e2e ${e2eArgs}`, 'End-to-end tests');
      break;
      
    case 'coverage':
      success = runCommand('npm run test -- --coverage', 'Coverage report');
      break;
      
    case 'watch':
      success = runCommand('npm run test:watch', 'Watch mode tests');
      break;
      
    case 'lint':
      success = runCommand('npm run lint', 'Linting') &&
                runCommand('npm run typecheck', 'Type checking');
      break;
      
    case 'build':
      success = runCommand('npm run build', 'Production build test');
      break;
      
    case 'ci':
      success = runCommand('npm run lint', 'Linting') &&
                runCommand('npm run typecheck', 'Type checking') &&
                runCommand('npm run test', 'Unit tests') &&
                runCommand('npm run build', 'Production build');
      break;
      
    case 'components':
      success = runCommand('npm run test -- tests/components', 'Component tests');
      break;
      
    case 'auth':
      success = runCommand('npm run test -- tests/components/auth tests/e2e/auth', 'Authentication tests');
      break;
      
    case 'coordinator':
      success = runCommand('npm run test -- tests/components/coordinator tests/e2e/coordinator', 'Coordinator tests');
      break;
      
    case 'volunteer':
      success = runCommand('npm run test -- tests/components/volunteer tests/e2e/volunteer', 'Volunteer tests');
      break;
      
    case 'donor':
      success = runCommand('npm run test -- tests/components/donor tests/e2e/donor', 'Donor tests');
      break;
      
    default:
      log(`${colors.red}❌ Unknown command: ${command}${colors.reset}`);
      showUsage();
      process.exit(1);
  }
  
  if (success) {
    log(`\n${colors.green}🎉 All tests completed successfully!${colors.reset}`);
    log(`${colors.cyan}📊 Check coverage report at: .vitest-coverage/index.html${colors.reset}`);
  } else {
    log(`\n${colors.red}💥 Some tests failed. Check the output above.${colors.reset}`);
    process.exit(1);
  }
}

main().catch(console.error);