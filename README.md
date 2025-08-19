# 🥪 sNDa 🥪

**A Sandwich of Support for Sudanese Kids 🥪💖🌍**  

## 📖 About sNDa

> Pronounced **sun-dah (سندة)**, the name comes from Sudanese slang for sandwich, a metaphor for support, care, and community. Like a sandwich, it layers health, education, nutrition, and shelter to wrap children in the care they need. The platform combines human solidarity with smart technology using Django, React, and PyTorch. Starting with Sudanese children in urgent medical need, it will expand into education, food, shelter, fitness, and digital access. Built to empower communities and foster meaningful connections, it is open-source, community-powered and resilient, designed to work even in low-bandwidth, offline-first, and crisis conditions.

## 🎯 Mission and Vision

Every child deserves dignity, care, and opportunity. While the initial focus is on Sudanese kids, the platform is designed to **grow globally**, supporting vulnerable children anywhere in the world. It connects **kids, families, volunteers, donors, and hospitals** into a seamless ecosystem where:

- **Help arrives faster** through referrals, triage, and hospital assignments  
- **Support is transparent** with donor campaigns and outcome tracking  
- **Technology works even offline** via SMS and low-bandwidth forms  
- **The community leads the way** with volunteers, coordinators, and local insight

## ✨ Core (MVP) Features

- 📋 **Referral Webform (AR/EN):** Intake with photos & consent, offline + SMS fallback  
- 🧭 **Coordinator Dashboard:** Triage cases, assign volunteers, track outcomes  
- 🙌 **Volunteer Onboarding:** Smart ML matching based on skills and availability  
- 💸 **Donor Portal:** Transparent campaigns, receipts, impact analytics  
- 🔮 **ML v1:** Urgency scoring + volunteer matching (with future potential for detecting unusual case patterns and predicting upcoming needs to proactively allocate support)

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

- **Next.js** – React framework for SSR & routing
- **Tailwind CSS** – Styling utilities
- **Shadcn/UI** – Prebuilt accessible components
- **TypeScript** – Strongly typed development

### Backend

- **Django (with DRF)** – Backend framework & REST API
- **PostgreSQL** – Database (hosted on Render free tier)

### Infrastructure / Hosting

- **Render** – Free-tier hosting for backend + PostgreSQL
- **Vercel** – Free hosting for frontend
- **Docker** – Local dev + containerization
- **GitHub Actions** – automated testing, CI/CD, and deployment workflows

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
├── backend/        # Django API (DRF), models, auth, ML endpoints
├── frontend/       # Next.js dashboards, forms, i18n
├── ml/             # ML notebooks, experiments, saved models
├── mobile/         # Offline-first mobile intake app
├── comms/          # Consent forms, templates, campaigns
├── infra/          # Docker, configs, CI/CD
└── docs/           # Research, SOPs, legal, outreach
```

## 🚀 Quick Start

**Backend**  

```bash
cd backend
python -m venv .venv && source .venv/bin/activate   # Windows: .venv\Scripts\activate
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

## 🤝 Contributing

We welcome **coders, designers, researchers, and changemakers**!

1. **Explore Issues:** Look for "Good First Issue" or "Feature Request" tags.
2. **Fork & Branch:** Create a feature branch for your work.
3. **Pull Requests:** Submit PRs with clear descriptions and, if possible, tests or examples.
4. **Feedback & Ideas:** Share insights from the field or suggest improvements, every perspective counts.
5. **Stay Respectful:** Collaborate with kindness, transparency, and solidarity above all.

Together, we build **impactful, inclusive, and sustainable solutions** for communities everywhere.

## 📜 License

MIT — use it, remix it, spread the love!
