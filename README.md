# 🥪 sNDa 🥪

**sNDa** stands for **Solidarity Network for Development & Action**. 

> Pronounced **sun-dah (سندة)**, the name layers meaning on meaning:
> - **Sudanese slang:** a snack or sandwich that packs a little boost, just like the support we serve to communities  
> - **Arabic:** support, symbolizing care, solidarity, and having each other’s back

It’s a platform built to **wrap children and communities in care**, blending **grassroots warmth** with a **global vision**. By combining human solidarity with smart technology (Django, React, PyTorch), it supports kids in Sudan today and vulnerable communities worldwide tomorrow.

## 📚 Table of Contents
- [Mission and Vision](#-mission-and-vision)  
- [Core Features](#-core-features)  
- [Architecture](#-architecture)  
- [Tech Stack](#-tech-stack)  
- [System Map](#-system-map)  
- [Inclusivity & i18n](#-inclusivity--i18n)  
- [Repo Structure](#-repo-structure)  
- [Quick Start](#-quick-start)  
- [Testing & Quality](#-testing--quality)  
- [Design System](#-design-system)  
- [Contributing](#-contributing)  
- [Recent Updates](#-recent-updates)  
- [License](#-license)
- [Credits](#-credits)

## 🎯 Mission and Vision

Every child deserves dignity, care, and opportunity. While the initial focus is on Sudanese kids, the platform is designed to **grow globally**, supporting vulnerable children anywhere in the world. It connects **kids, families, volunteers, donors, and hospitals** into a seamless ecosystem where:

- **Help arrives faster** through referrals, triage, and hospital assignments  
- **Support is transparent** with donor campaigns and outcome tracking  
- **Technology works even offline** via SMS and low-bandwidth forms  
- **The community leads the way** with volunteers, coordinators, and local insight

## ✨ Core Features

### 🎯 Case Management

- 📋 **Referral Webform (AR/EN):** Intake with photos & consent, offline + SMS fallback  
- 🧭 **Coordinator Dashboard:** Advanced triage with real-time filtering, case assignment, and progress tracking
- 📊 **Enhanced Overview Cards:** Live statistics with skeleton loading animations
- 🔍 **Smart Filtering:** Multi-dimensional case filtering by status, urgency, and search terms

### 👥 Volunteer Experience

- 🙌 **Volunteer Hub:** Complete dashboard with assignment tracking and impact metrics
- 📖 **Story Sharing Platform:** Rich media uploads, link sharing, and community engagement
- 📸 **Media Upload:** Support for photos, videos, and external links with drag-and-drop interface
- 🏷️ **Tagging System:** Organize stories with custom tags and categories
- ❤️ **Community Interaction:** Like, comment, and share volunteer experiences

### 💰 Donor Platform

- 🎯 **Campaign Management:** Multiple active campaigns with progress tracking
- 💳 **Stripe Integration:** Secure payment processing with recurring donation options
- 📈 **Impact Visualization:** Real-time donation progress and community impact metrics
- 🏆 **Donor Recognition:** Public appreciation and recent supporter highlights
- 📊 **Preset & Custom Amounts:** Flexible donation options with impact descriptions

### 🎨 Enhanced UX

- ✨ **Unified Loading States:** Beautiful skeleton components and shimmer animations
- 🌊 **Smooth Transitions:** Fade-in animations and slide transitions throughout the app
- 📱 **Responsive Design:** Optimized for mobile, tablet, and desktop experiences

### 🔮 ML & Intelligence

- 🧠 **Urgency Scoring:** ML-powered case prioritization
- 🤝 **Volunteer Matching:** Smart assignment based on skills and availability
- 📈 **Predictive Analytics:** Future potential for detecting patterns and predicting needs

## 🧱 Architecture

```plaintext
1. Referral Intake → 2. Secure DB → 3. ML Layer → 4. Coordinator Dashboard → 5. Hospital Assignment
                                           │
                                           ▼
                               6. Donor Portal → 7. Reports / Analytics
```

### 📐 Design Principles

- **Offline-first** capture with sync-on-connect
- **Low-bandwidth** by design (works during outages)
- **Privacy & consent** built in

## 🗺️ System Map

```plaintext
[1. Referral Intake] → [2. Webform / Mobile Offline Form] → [3. Secure DB]
                                      │
                                      ▼
                                  [4. ML Layer]
                                 ┌───────────────┐
                                 │               │
                  [4a. Case Prioritization]  [4b. Volunteer Matching]
                                 │               │
                                 └─────> [5. Coordinator Dashboard]
                                              │
                                              ▼
                                     [6. Hospital Assignment]
                                              │
                                              ▼
                               [7. Treatment Outcome / Feedback]
                                              │
                                              ▼
                                [8. Donor Dashboard / Campaigns]
                                              │
                                              ▼
                           [9. Reports / Analytics] → [10. Cooperative Insights]

```

## 🛠 Tech Stack

### Frontend

- **Next.js 14** – React framework with App Router, SSR & optimized routing
- **TypeScript** – Strongly typed development with enhanced type safety
- **Tailwind CSS** – Utility-first styling with custom animations and themes
- **Shadcn/UI** – Accessible component library with enhanced skeleton components
- **Sonner** – Beautiful toast notifications with top-center positioning
- **Lucide React** – Comprehensive icon library for consistent UI
- **Custom Animations** – Shimmer effects, fade-in transitions, and loading states

### Backend

- **Django 4.x** – Robust backend framework with Django REST Framework
- **PostgreSQL** – Production database with optimized queries
- **JWT Authentication** – Secure token-based authentication system
- **File Upload Support** – Media handling for volunteer story sharing
- **RESTful API Design** – Clean, consistent API endpoints

### Infrastructure / Hosting

- **Render** – Backend hosting with PostgreSQL database
- **Vercel** – Frontend hosting with automatic deployments
- **Stripe** – Secure payment processing for donations
- **Docker** – Local development environment and containerization
- **GitHub Actions** – Automated testing, CI/CD, and deployment workflows

### Machine Learning

- **Python (scikit-learn, PyTorch)** – ML models for urgency scoring, volunteer matching
- **Jupyter Notebooks** – Model experimentation and testing

## 🌐 Inclusivity & i18n

- **Arabic and English at launch** (RTL/LTR support baked in)  
- Roadmap: French, Spanish, and beyond  
- **Family vibe** design language → warm, accessible, global

## 📂 Repo Structure

```plaintext
sNDa/
├── backend/                  # Django API (DRF), models, auth, ML endpoints
│   ├── api/                  # Case management models and views
│   ├── users/                # User authentication and profiles
│   └── config/               # Django settings and configuration
├── frontend/                 # Next.js application
│   ├── src/app/              # App Router pages
│   │   ├── coordinator/      # Coordinator dashboard
│   │   ├── volunteer/        # Volunteer hub with story sharing
│   │   └── donate/           # Donor platform with Stripe
│   ├── src/components/       # Reusable UI components
│   │   ├── ui/               # Enhanced Shadcn components
│   │   ├── coordinator/      # Dashboard-specific components
│   │   ├── volunteer/        # Story sharing components
│   │   └── donor/            # Donation platform components
│   └── src/contexts/         # React contexts (Auth, etc.)
├── ml/                       # ML notebooks, experiments, saved models
├── mobile/                   # Offline-first mobile intake app
├── comms/                    # Consent forms, templates, campaigns
├── infra/                    # Docker, configs, CI/CD
└── docs/                     # Research, SOPs, legal, outreach
    └── TESTING.md            # Comprehensive testing guide
```

## 🚀 Quick Start

**Backend**  

```bash
cd backend
python -m venv .venv && source .venv/bin/activate
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver
```

**Frontend**  

```bash
cd frontend
npm install
npm run dev
```

**Access the Application:**
- 🏠 **Homepage:** http://localhost:3000
- 🧭 **Coordinator Dashboard:** http://localhost:3000/coordinator
- 👥 **Volunteer Hub:** http://localhost:3000/volunteer
- 💰 **Donation Platform:** http://localhost:3000/donate

## 🧪 Testing & Quality

We maintain high code quality with comprehensive testing:

- **Pre-commit Checklist:** TypeScript compilation, linting, and build verification
- **Feature Testing:** Complete coordinator dashboard, volunteer hub, and donor platform testing
- **UX Validation:** Responsive design, loading states, and accessibility checks
- **API Integration:** Backend connectivity and error handling verification

See [TESTING.md](./docs/TESTING.md) for detailed testing procedures.

## 🎨 Design System

### Color Palette

- **Warm Theme:** Earth tones with sand and ink colors for accessibility
- **Dark Mode:** Full dark theme support with consistent contrast ratios
- **Semantic Colors:** Meaningful color usage for status, urgency, and actions

### Animation Philosophy

- **Purposeful Motion:** Animations that enhance UX without distraction
- **Performance First:** Optimized animations that work on all devices
- **Accessibility:** Respects user preferences for reduced motion

## 🤝 Contributing

We welcome **coders, designers, researchers, and changemakers**!

1. **Explore Issues:** Look for "Good First Issue" or "Feature Request" tags
2. **Fork & Branch:** Create a feature branch for your work
3. **Test Thoroughly:** Run the testing checklist before submitting
4. **Pull Requests:** Submit PRs with clear descriptions and examples
5. **Feedback & Ideas:** Share insights from the field or suggest improvements
6. **Stay Respectful:** Collaborate with kindness, transparency, and solidarity

### Development Workflow

```bash
# 1. Start development environment
npm run dev          # Frontend (localhost:3000)
python manage.py runserver  # Backend (localhost:8000)

# 2. Run quality checks
npx tsc --noEmit     # TypeScript compilation
npm run lint         # Code linting
npm run build        # Production build test

# 3. Test features manually
# Follow docs/TESTING.md checklist
```

Together, we build **impactful, inclusive, and sustainable solutions** for communities everywhere.

## 🌟 Recent Updates

### v0.2.0 - Enhanced UX & Community Features

- ✨ **Unified Loading Experience:** Beautiful skeleton components with shimmer animations
- 🎯 **Improved Toast Notifications:** Top-center positioning for better visibility
- 📖 **Volunteer Story Sharing:** Rich media upload, link sharing, and community engagement
- 💰 **Comprehensive Donor Platform:** Stripe integration with campaign management
- 🎨 **Enhanced Design System:** Smooth animations and responsive layouts
- 🧭 **Advanced Coordinator Tools:** Real-time filtering and enhanced case management

## 📜 License

MIT — use it, remix it, and spread the love!

## 📝 Credits

Built with 💖 for children everywhere.
