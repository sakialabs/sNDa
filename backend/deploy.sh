#!/bin/bash
# 🚀 sNDa Backend Deployment Script for Render
# Expert-level deployment automation

set -e  # Exit on any error

echo "🚀 Starting sNDa Backend Deployment to Render..."

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

# Check if we're in the right directory
if [ ! -f "manage.py" ]; then
    print_error "Please run this script from the backend directory"
    exit 1
fi

print_status "Validating Django configuration..."

# Check if all required environment variables are set
required_vars=("SECRET_KEY" "DATABASE_URL" "ALLOWED_HOSTS")
for var in "${required_vars[@]}"; do
    if [ -z "${!var}" ]; then
        print_warning "Environment variable $var is not set"
    fi
done

print_status "Installing dependencies..."
pip install --upgrade pip
pip install -r requirements.txt

print_status "Running Django checks..."
python manage.py check --deploy

print_status "Collecting static files..."
python manage.py collectstatic --noinput

print_status "Running database migrations..."
python manage.py migrate

print_status "Testing health endpoint..."
python manage.py shell -c "
from api.health import health_check
from django.http import HttpRequest
req = HttpRequest()
req.method = 'GET'
response = health_check(req)
print('Health check response:', response.content.decode())
"

print_success "✅ Deployment preparation complete!"
print_status "🌐 Your backend is ready for Render deployment"
print_status "📋 Next steps:"
echo "   1. Push code to GitHub"
echo "   2. Create Render account"
echo "   3. Follow RENDER_DEPLOYMENT.md guide"
echo "   4. Your API will be live at: https://snda-backend.onrender.com"

print_success "🎯 sNDa platform ready to serve communities worldwide!"
