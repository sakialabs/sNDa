# 🥪 sNDa - Solidarity Network for Development & Action

> Pronounced **sun-dah (سندة)** - Arabic for "support" and Sudanese slang for "a little snack"

A platform that **wraps children and communities in care**, connecting volunteers, donors, and coordinators to support vulnerable kids in Sudan and beyond. Built with Django, React, and AI-powered features.

**🌐 Live Demo:** https://snda.netlify.app

## 📚 Table of Contents

- [🎯 Mission & Vision](#-mission--vision)
- [✨ Core Features](#-core-features)
- [🛠 Tech Stack](#-tech-stack)
- [🚀 Quick Start](#-quick-start)
- [📚 Documentation](#-documentation)
- [🤝 Contributing](#-contributing)
- [🌟 Recent Updates](#-recent-updates)
- [📜 License](#-license)

## 📚 Documentation

| Guide | Description |
|-------|-------------|
| [🚀 Quick Start](./docs/QUICK_START.md) | Get running in 5 minutes |
| [🌐 Deployment](./docs/DEPLOYMENT_GUIDE.md) | Production deployment guide |
| [📧 Email System](./docs/EMAIL_SYSTEM.md) | Email automation & templates |
| [🧪 Testing](./docs/TESTING.md) | Testing strategy & quality assurance |
| [🤝 Contributing](./docs/CONTRIBUTING.md) | How to contribute |
| [🔒 Security](./docs/SECURITY.md) | Security policy & vulnerability reporting |
| [📦 Changelog](./docs/CHANGELOG.md) | Version history & updates |

## 🎯 Mission & Vision

Every child deserves dignity, care, and opportunity. sNDa connects **kids, families, volunteers, donors, and hospitals** into a seamless ecosystem where:

- **Help arrives faster** through smart triage and assignment
- **Support is transparent** with real-time tracking and impact metrics
- **Technology works offline** via SMS and low-bandwidth forms
- **Communities lead the way** with local volunteers and coordinators

## ✨ Core Features

### 🎯 Case Management
- **Smart Intake Forms** (Arabic/English) with photo consent and offline support
- **Coordinator Dashboard** with real-time filtering and case assignment
- **Progress Tracking** with status updates and outcome reporting

### 👥 Volunteer Experience
- **Personal Dashboard** with assignment tracking and impact metrics
- **Story Sharing Platform** with rich media uploads and community engagement
- **Gamification System** with badges, streaks, and leaderboards
- ** Boba AI Assistant** for personalized recommendations

### 🌟 Community & Engagement
- **Wall of Love** showcasing volunteer stories and impact
- **Community Goals** with shared milestones and progress tracking
- **Email Automation** with 3-step onboarding and motivational content

### 💰 Donor Platform
- **Campaign Management** with Stripe integration and recurring donations
- **Impact Visualization** with real-time progress and transparency
- **Donor Recognition** with public appreciation and supporter highlights

## 🛠 Tech Stack

**Frontend:** Next.js 15, TypeScript, Tailwind CSS, Shadcn/UI  
**Backend:** Django 4.x, PostgreSQL, JWT Authentication, Django REST Framework  
**Infrastructure:** Render (backend), Netlify (frontend), Stripe (payments)  
**AI/ML:** Python, scikit-learn, PyTorch for urgency scoring and volunteer matching  
**Features:** Email automation, gamification, real-time notifications, offline support

## 🚀 Quick Start

```bash
# Backend setup
cd backend && python -m venv .venv && source .venv/bin/activate
pip install -r requirements.txt && python manage.py migrate && python manage.py runserver

# Frontend setup (new terminal)
cd frontend && npm install && npm run dev
```

**🌐 Access:** http://localhost:3000  
**📖 Full Guide:** [Quick Start Documentation](./docs/QUICK_START.md)

## 🤝 Contributing

We welcome **coders, designers, researchers, and changemakers**!

**Areas to Help:**
- 🐛 Bug fixes and improvements
- ✨ New features and enhancements
- 📚 Documentation and guides
- 🌍 Translations (Arabic, French, etc.)
- 🧪 Testing and quality assurance

**Get Started:**
1. Fork & clone the repository
2. Follow the [Quick Start Guide](./docs/QUICK_START.md)
3. Check [Contributing Guidelines](./docs/CONTRIBUTING.md)
4. Submit PRs with clear descriptions

**Contact:** snda@hey.com

## 🌟 Recent Updates

### v0.4.0 - Production-Ready Platform
- 🧪 **100% API Coverage** - All 27 endpoints tested and verified
- 🚀 **Full Deployment** - Live on Netlify (frontend) and Render (backend)
- 🏆 **Advanced Gamification** - Complete badge system with automated awarding
- 📖 **Rich Story Platform** - Media uploads with community engagement
- 📧 **Smart Email System** - Automated onboarding and motivational content
- 🤖 **Boba AI Integration** - Personalized recommendations and notifications

**📦 Full History:** [CHANGELOG.md](./docs/CHANGELOG.md)

## 📂 Repository Structure

```plaintext
sNDa/
├── backend/         # Django API with gamification & AI features
├── frontend/        # Next.js app with volunteer & donor platforms
├── docs/            # Comprehensive documentation
├── comms/           # Email templates & communication assets
└── infra/           # Docker configs & deployment scripts
```

## 🌐 Internationalization

- **Arabic & English** at launch with full RTL support
- **Roadmap:** French, Spanish, and more languages
- **Cultural Adaptation** with localized content and design

## 📜 License

MIT — use it, remix it, and spread the love!

## 📝 Credits

Built with 💖 for children everywhere.