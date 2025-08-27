#!/bin/bash
# 🚀 sNDa Full-Stack Deployment Orchestrator
# This script coordinates deployment of both frontend and backend

set -e

echo "🥪 Starting sNDa Full-Stack Deployment..."

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

# Get the project root directory
PROJECT_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"

print_status "Project root: $PROJECT_ROOT"

# Deploy Backend
print_status "Deploying backend..."
cd "$PROJECT_ROOT/infra/scripts"
if [ -f "deploy-backend.sh" ]; then
    ./deploy-backend.sh
    print_success "Backend deployment script completed"
else
    echo "❌ Backend deploy-backend.sh not found"
    exit 1
fi

# Deploy Frontend
print_status "Deploying frontend..."
cd "$PROJECT_ROOT/infra/scripts"
if [ -f "deploy-frontend.sh" ]; then
    ./deploy-frontend.sh "Full-stack deploy: $(date '+%Y-%m-%d %H:%M:%S')"
    print_success "Frontend deployment script completed"
else
    print_error "Frontend deploy-frontend.sh not found"
    exit 1
fi

print_success "🎉 Full-stack deployment completed!"
print_status "Frontend: https://snda.netlify.app"
print_status "Backend: https://snda-backend.onrender.com"
print_status "Health Check: https://snda-backend.onrender.com/api/health/"