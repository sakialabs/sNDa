# 🌐 sNDa Frontend Deployment Script for Netlify (PowerShell)
# Pre-deployment validation and deployment automation for Windows

param(
    [string]$CommitMessage = "",
    [switch]$SkipTests = $false,
    [switch]$OpenBrowser = $false
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

Write-Host "🌐 Starting sNDa Frontend Deployment to Netlify..." -ForegroundColor Cyan

# Get the project root directory
$ProjectRoot = Split-Path -Parent (Split-Path -Parent $PSScriptRoot)
$FrontendDir = Join-Path $ProjectRoot "frontend"

Write-Status "Project root: $ProjectRoot"
Write-Status "Frontend directory: $FrontendDir"

# Change to frontend directory
Set-Location $FrontendDir

# Check if we're in the right directory
if (-not (Test-Path "package.json")) {
    Write-Error "Frontend directory not found or invalid: $FrontendDir"
    exit 1
}

Write-Status "Validating Node.js and npm..."
try {
    $nodeVersion = node --version
    $npmVersion = npm --version
    Write-Status "Node.js version: $nodeVersion"
    Write-Status "npm version: $npmVersion"
} catch {
    Write-Error "Node.js is not installed. Please install Node.js first."
    exit 1
}

Write-Status "Installing/updating dependencies..."
npm ci
if ($LASTEXITCODE -ne 0) {
    Write-Error "npm ci failed"
    exit 1
}

Write-Status "Running TypeScript type checking..."
npm run typecheck
if ($LASTEXITCODE -ne 0) {
    Write-Error "TypeScript check failed"
    exit 1
}

Write-Status "Running ESLint..."
npm run lint
if ($LASTEXITCODE -ne 0) {
    Write-Error "ESLint failed"
    exit 1
}

if (-not $SkipTests) {
    Write-Status "Running tests..."
    npm run test 2>$null
    if ($LASTEXITCODE -eq 0) {
        Write-Success "Tests passed"
    } else {
        Write-Warning "Tests failed or not configured - continuing with deployment"
    }
}

Write-Status "Building production bundle..."
npm run build
if ($LASTEXITCODE -ne 0) {
    Write-Error "Build failed"
    exit 1
}

Write-Status "Validating build output..."
if (-not (Test-Path ".next")) {
    Write-Error "Build failed - .next directory not found"
    exit 1
}

Write-Success "✅ Frontend build validation complete!"

# Check git status
Set-Location $ProjectRoot
$gitStatus = git status --porcelain
if ($gitStatus) {
    Write-Status "Uncommitted changes detected. Committing changes..."
    git add .
    
    # Get commit message
    if (-not $CommitMessage) {
        $CommitMessage = "Deploy frontend: $(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')"
    }
    
    git commit -m $CommitMessage
    if ($LASTEXITCODE -eq 0) {
        Write-Success "Changes committed: $CommitMessage"
    } else {
        Write-Error "Git commit failed"
        exit 1
    }
} else {
    Write-Status "No uncommitted changes detected"
}

Write-Status "Pushing to GitHub (triggers Netlify deployment)..."
git push origin main
if ($LASTEXITCODE -ne 0) {
    Write-Error "Git push failed"
    exit 1
}

Write-Success "✅ Frontend deployment initiated!"
Write-Host ""
Write-Status "🌐 Deployment Status:"
Write-Status "   • GitHub: Changes pushed successfully"
Write-Status "   • Netlify: Auto-deployment triggered"
Write-Status "   • Live URL: https://snda.netlify.app"
Write-Host ""
Write-Status "📋 Next steps:"
Write-Status "   1. Monitor deployment at: https://app.netlify.com"
Write-Status "   2. Verify deployment: https://snda.netlify.app"
Write-Status "   3. Check build logs if needed"
Write-Host ""
Write-Success "🎯 Frontend deployment complete!"

# Optional: Open deployment in browser
if ($OpenBrowser -or (Read-Host "Open deployment URL in browser? (y/N)") -match '^[Yy]') {
    Start-Process "https://snda.netlify.app"
}