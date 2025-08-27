# 🏗️ sNDa Infrastructure

This directory contains all infrastructure configurations, deployment scripts, and DevOps tooling for the sNDa platform.

## 📁 Directory Structure

```
infra/
├── docker/                 # Docker configurations
│   ├── docker-compose.yml  # Local development environment
│   ├── Dockerfile.backend  # Backend container
│   └── Dockerfile.frontend # Frontend container
├── deployment/             # Deployment configurations
│   ├── netlify.toml        # Frontend deployment (Netlify)
│   ├── render.yaml         # Backend deployment (Render)
│   └── vercel.json         # Alternative frontend deployment
├── monitoring/             # Monitoring and observability
│   ├── health-checks.md    # Health check endpoints
│   └── alerts.yml          # Alert configurations
├── security/               # Security configurations
│   ├── security-headers.md # Security headers documentation
│   └── ssl-config.md       # SSL/TLS configuration
├── scripts/                # Automation scripts
│   ├── deploy-all.sh       # Full-stack deployment orchestrator
│   ├── deploy-backend.sh   # Backend deployment script (Bash)
│   ├── deploy-backend.ps1  # Backend deployment script (PowerShell)
│   ├── deploy-frontend.sh  # Frontend deployment script (Bash)
│   ├── deploy-frontend.ps1 # Frontend deployment script (PowerShell)
│   └── setup-dev.sh        # Development environment setup
└── ci-cd/                  # CI/CD configurations
    ├── github-actions.yml  # GitHub Actions workflows
    └── pre-commit.yml       # Pre-commit hooks
```

## 🚀 Quick Start

### Local Development
```bash
# Start full development environment
cd infra && docker-compose up --build

# Setup development environment
./scripts/setup-dev.sh
```

### Production Deployment
```bash
# Full-stack deployment (orchestrates both frontend and backend)
./scripts/deploy-all.sh

# Or deploy individually:
# Backend: ./scripts/deploy-backend.sh (or deploy-backend.ps1 on Windows)
# Frontend: ./scripts/deploy-frontend.sh (or deploy-frontend.ps1 on Windows)
```

## 🔧 Configuration Management

- **Environment Variables**: Managed through `.env` files and deployment platform settings
- **Secrets**: Stored securely in deployment platform secret managers
- **Database**: PostgreSQL with automated backups and migrations
- **Cache**: Redis for session storage and caching
- **CDN**: Static assets served through deployment platform CDN

## 📊 Monitoring

- **Health Checks**: `/api/health/` endpoint for service monitoring
- **Logging**: Structured logging with deployment platform integration
- **Metrics**: Application performance monitoring through deployment platforms
- **Alerts**: Automated alerts for service disruptions

## 🔒 Security

- **SSL/TLS**: Enforced HTTPS with security headers
- **CORS**: Configured for frontend-backend communication
- **Authentication**: JWT-based with secure token handling
- **Data Protection**: GDPR-compliant data handling and privacy controls