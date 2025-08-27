# 🚀 sNDa Backend Deployment Script for Render (PowerShell)
# Expert-level deployment automation for Windows

param(
    [switch]$SkipChecks = $false
)

# Colors for PowerShell output
function Write-Status { 
    Write-Host "[INFO] $args" -ForegroundColor Blue 
}
function Write-Success { 
    Write-Host "[SUCCESS] $args" -ForegroundColor Green 
}
function Write-Warning { 
    Write-Host "[WARNING] $args" -ForegroundColor Yellow 
}
function Write-Error { 
    Write-Host "[ERROR] $args" -ForegroundColor Red 
}

Write-Host "🚀 Starting sNDa Backend Deployment to Render..." -ForegroundColor Cyan

# Get the project root directory
$ProjectRoot = Split-Path -Parent (Split-Path -Parent $PSScriptRoot)
$BackendDir = Join-Path $ProjectRoot "backend"

Write-Status "Project root: $ProjectRoot"
Write-Status "Backend directory: $BackendDir"

# Change to backend directory
Set-Location $BackendDir

# Check if we're in the right directory
if (-not (Test-Path "manage.py")) {
    Write-Error "Backend directory not found or invalid: $BackendDir"
    exit 1
}

Write-Status "Validating Django configuration..."

# Check Python version
$pythonVersion = python --version 2>&1
Write-Status "Python version: $pythonVersion"

if (-not $SkipChecks) {
    Write-Status "Installing/upgrading dependencies..."
    python -m pip install --upgrade pip
    pip install -r requirements.txt
    
    Write-Status "Running Django system checks..."
    python manage.py check
    
    Write-Status "Testing database connection..."
    python manage.py shell -c "from django.db import connection; connection.ensure_connection(); print('✅ Database connection successful')"
}

Write-Status "Collecting static files..."
python manage.py collectstatic --noinput

Write-Status "Checking migrations..."
python manage.py showmigrations

Write-Status "Testing health endpoint..."
python manage.py shell -c @"
from api.health import health_check
from django.http import HttpRequest
import json
req = HttpRequest()
req.method = 'GET'
response = health_check(req)
data = json.loads(response.content.decode())
print('✅ Health check passed:', data['status'])
print('📊 Database status:', data['database'])
"@

Write-Success "✅ Deployment preparation complete!"
Write-Host ""
Write-Status "🌐 Your backend is ready for Render deployment"
Write-Status "📋 Next steps:"
Write-Host "   1. Push code to GitHub: git add . && git commit -m 'Ready for Render' && git push"
Write-Host "   2. Create Render account at render.com"
Write-Host "   3. Follow docs/DEPLOYMENT_GUIDE.md"
Write-Host "   4. Your API will be live at: https://snda-backend.onrender.com"
Write-Host ""
Write-Success "🎯 sNDa platform ready to serve communities worldwide!"

# Optional: Open deployment guide
$openGuide = Read-Host "Open deployment guide? (y/N)"
if ($openGuide -eq 'y' -or $openGuide -eq 'Y') {
    $deploymentGuide = Join-Path $ProjectRoot "docs/DEPLOYMENT_GUIDE.md"
    if (Test-Path $deploymentGuide) {
        Start-Process $deploymentGuide
    } else {
        Write-Warning "Deployment guide not found at: $deploymentGuide"
    }
}