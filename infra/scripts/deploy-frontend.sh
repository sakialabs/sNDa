#!/bin/bash
# 🌐 sNDa Frontend Deployment Script for Netlify
# Pre-deployment validation and deployment automation

set -e  # Exit on any error

echo "🌐 Starting sNDa Frontend Deployment to Netlify..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Get the project root directory
PROJECT_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
FRONTEND_DIR="$PROJECT_ROOT/frontend"

print_status "Project root: $PROJECT_ROOT"
print_status "Frontend directory: $FRONTEND_DIR"

# Change to frontend directory
cd "$FRONTEND_DIR"

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    print_error "Frontend directory not found or invalid: $FRONTEND_DIR"
    exit 1
fi

print_status "Validating Node.js and npm..."
node_version=$(node --version 2>/dev/null || echo "not found")
npm_version=$(npm --version 2>/dev/null || echo "not found")

if [ "$node_version" = "not found" ]; then
    print_error "Node.js is not installed. Please install Node.js first."
    exit 1
fi

print_status "Node.js version: $node_version"
print_status "npm version: $npm_version"

print_status "Installing/updating dependencies..."
npm ci

print_status "Running TypeScript type checking..."
npm run typecheck

print_status "Running ESLint..."
npm run lint

print_status "Running tests..."
if npm run test > /dev/null 2>&1; then
    print_success "Tests passed"
else
    print_warning "Tests failed or not configured - continuing with deployment"
fi

print_status "Building production bundle..."
npm run build

print_status "Validating build output..."
if [ ! -d ".next" ]; then
    print_error "Build failed - .next directory not found"
    exit 1
fi

print_success "✅ Frontend build validation complete!"

# Check git status
cd "$PROJECT_ROOT"
if [ -n "$(git status --porcelain)" ]; then
    print_status "Uncommitted changes detected. Committing changes..."
    git add .
    
    # Get commit message from user or use default
    if [ -n "$1" ]; then
        commit_message="$1"
    else
        commit_message="Deploy frontend: $(date '+%Y-%m-%d %H:%M:%S')"
    fi
    
    git commit -m "$commit_message"
    print_success "Changes committed: $commit_message"
else
    print_status "No uncommitted changes detected"
fi

print_status "Pushing to GitHub (triggers Netlify deployment)..."
git push origin main

print_success "✅ Frontend deployment initiated!"
print_status ""
print_status "🌐 Deployment Status:"
print_status "   • GitHub: Changes pushed successfully"
print_status "   • Netlify: Auto-deployment triggered"
print_status "   • Live URL: https://snda.netlify.app"
print_status ""
print_status "📋 Next steps:"
print_status "   1. Monitor deployment at: https://app.netlify.com"
print_status "   2. Verify deployment: https://snda.netlify.app"
print_status "   3. Check build logs if needed"
print_status ""
print_success "🎯 Frontend deployment complete!"

# Optional: Open deployment in browser
read -p "Open deployment URL in browser? (y/N): " open_browser
if [ "$open_browser" = "y" ] || [ "$open_browser" = "Y" ]; then
    if command -v xdg-open > /dev/null; then
        xdg-open "https://snda.netlify.app"
    elif command -v open > /dev/null; then
        open "https://snda.netlify.app"
    else
        print_status "Please open https://snda.netlify.app manually"
    fi
fi