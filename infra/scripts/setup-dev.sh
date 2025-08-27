#!/bin/bash
# 🛠️ sNDa Development Environment Setup Script

set -e

echo "🥪 Setting up sNDa development environment..."

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

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    print_error "Docker is not installed. Please install Docker first."
    exit 1
fi

# Check if Docker Compose is installed
if ! command -v docker-compose &> /dev/null; then
    print_error "Docker Compose is not installed. Please install Docker Compose first."
    exit 1
fi

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    print_warning "Node.js is not installed. Installing via Docker only."
else
    NODE_VERSION=$(node --version)
    print_status "Node.js version: $NODE_VERSION"
fi

# Check if Python is installed
if ! command -v python3 &> /dev/null; then
    print_warning "Python 3 is not installed. Installing via Docker only."
else
    PYTHON_VERSION=$(python3 --version)
    print_status "Python version: $PYTHON_VERSION"
fi

# Create environment files if they don't exist
print_status "Creating environment files..."

# Backend .env
if [ ! -f "backend/.env" ]; then
    cat > backend/.env << EOF
# Django Configuration
DEBUG=True
SECRET_KEY=dev-secret-key-change-in-production
ALLOWED_HOSTS=localhost,127.0.0.1,backend
CORS_ALLOWED_ORIGINS=http://localhost:3000

# Database
DATABASE_URL=postgresql://snda_user:snda_password@localhost:5432/snda_dev

# Redis
REDIS_URL=redis://localhost:6379/0

# Email (Development)
EMAIL_BACKEND=django.core.mail.backends.console.EmailBackend
DEFAULT_FROM_EMAIL=dev@snda.local

# Stripe (Development - use test keys)
STRIPE_PUBLISHABLE_KEY=pk_test_your_test_key_here
STRIPE_SECRET_KEY=sk_test_your_test_key_here
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret_here

# Application URLs
FRONTEND_URL=http://localhost:3000
BACKEND_URL=http://localhost:8000
EOF
    print_success "Created backend/.env"
else
    print_status "backend/.env already exists"
fi

# Frontend .env.local
if [ ! -f "frontend/.env.local" ]; then
    cat > frontend/.env.local << EOF
# API Configuration
NEXT_PUBLIC_API_URL=http://localhost:8000
NEXT_PUBLIC_FRONTEND_URL=http://localhost:3000

# Stripe (Development - use test keys)
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_your_test_key_here

# Development Settings
NODE_ENV=development
NEXT_TELEMETRY_DISABLED=1
EOF
    print_success "Created frontend/.env.local"
else
    print_status "frontend/.env.local already exists"
fi

# Start Docker services
print_status "Starting Docker services..."
cd infra/docker
docker-compose up -d db redis

# Wait for services to be ready
print_status "Waiting for services to be ready..."
sleep 10

# Install backend dependencies (if Python is available locally)
if command -v python3 &> /dev/null; then
    print_status "Installing backend dependencies..."
    cd ../../backend
    
    # Create virtual environment if it doesn't exist
    if [ ! -d ".venv" ]; then
        python3 -m venv .venv
        print_success "Created Python virtual environment"
    fi
    
    # Activate virtual environment and install dependencies
    source .venv/bin/activate
    pip install --upgrade pip
    pip install -r requirements.txt
    print_success "Backend dependencies installed"
    
    # Run migrations
    print_status "Running database migrations..."
    python manage.py migrate
    print_success "Database migrations completed"
    
    # Create superuser (optional)
    print_status "Creating superuser (optional)..."
    echo "from django.contrib.auth import get_user_model; User = get_user_model(); User.objects.create_superuser('admin', 'admin@snda.local', 'admin123') if not User.objects.filter(username='admin').exists() else None" | python manage.py shell
    print_success "Superuser created (admin/admin123)"
    
    cd ..
fi

# Install frontend dependencies (if Node.js is available locally)
if command -v node &> /dev/null; then
    print_status "Installing frontend dependencies..."
    cd frontend
    npm install
    print_success "Frontend dependencies installed"
    cd ..
fi

# Create media directories
print_status "Creating media directories..."
mkdir -p backend/media/case_media
mkdir -p backend/media/story_media
mkdir -p backend/media/story_thumbnails
print_success "Media directories created"

# Set up Git hooks (if .git exists)
if [ -d ".git" ]; then
    print_status "Setting up Git hooks..."
    
    # Pre-commit hook
    cat > .git/hooks/pre-commit << 'EOF'
#!/bin/bash
# sNDa pre-commit hook

echo "🔍 Running pre-commit checks..."

# Check if backend tests pass
if [ -d "backend" ]; then
    cd backend
    if [ -f ".venv/bin/activate" ]; then
        source .venv/bin/activate
        python -m pytest --tb=short -q
        if [ $? -ne 0 ]; then
            echo "❌ Backend tests failed"
            exit 1
        fi
    fi
    cd ..
fi

# Check if frontend builds
if [ -d "frontend" ]; then
    cd frontend
    if [ -f "package.json" ]; then
        npm run lint
        if [ $? -ne 0 ]; then
            echo "❌ Frontend linting failed"
            exit 1
        fi
        
        npm run typecheck
        if [ $? -ne 0 ]; then
            echo "❌ TypeScript check failed"
            exit 1
        fi
    fi
    cd ..
fi

echo "✅ Pre-commit checks passed"
EOF
    
    chmod +x .git/hooks/pre-commit
    print_success "Git pre-commit hook installed"
fi

print_success "🎉 Development environment setup completed!"
print_status ""
print_status "Next steps:"
print_status "1. Start the development servers:"
print_status "   Backend:  cd backend && source .venv/bin/activate && python manage.py runserver"
print_status "   Frontend: cd frontend && npm run dev"
print_status ""
print_status "2. Or use Docker:"
print_status "   cd infra/docker && docker-compose up"
print_status ""
print_status "3. Access the application:"
print_status "   Frontend: http://localhost:3000"
print_status "   Backend:  http://localhost:8000"
print_status "   Admin:    http://localhost:8000/admin (admin/admin123)"
print_status ""
print_status "4. Update environment variables with your actual API keys"
print_status ""
print_success "Happy coding! 🚀"