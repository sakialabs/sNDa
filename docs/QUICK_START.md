# ⚡ sNDa Quick Start Guide

## 🚀 Get Running in 5 Minutes

### Prerequisites

- **Python 3.11+** and **Node.js 18+**
- **Git** and **Docker** (optional)

### 1. Clone & Setup

```bash
git clone <repository-url>
cd sNDa
```

### 2. Backend Setup

```bash
cd backend
python -m venv .venv
source .venv/bin/activate  # Linux/Mac
# .venv\Scripts\activate   # Windows

pip install -r requirements.txt
python manage.py migrate
python manage.py runserver
```

### 3. Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

### 4. Access the App

- **Frontend**: <http://localhost:3000>
- **Backend API**: <http://localhost:8000>
- **Admin Panel**: <http://localhost:8000/admin>

## 🎯 Key Features to Try

### For Coordinators

1. Visit `/coordinator` to manage cases
2. Create new cases and assign volunteers
3. Track case progress and updates

### For Volunteers

1. Visit `/volunteer` to see your dashboard
2. View assigned cases and update progress
3. Share stories and earn badges

### For Community

1. Visit `/community` for Wall of Love
2. See community goals and progress
3. Browse volunteer stories

## 🔧 Development Commands

```bash
# Backend
python manage.py test          # Run tests
python manage.py shell         # Django shell
python manage.py createsuperuser  # Create admin user

# Frontend
npm run build                  # Production build
npm run lint                   # Code linting
npm run typecheck              # TypeScript check
```

## 🐳 Docker Alternative

```bash
docker-compose up --build
```

## 📚 Next Steps

- Read [CONTRIBUTING.md](./CONTRIBUTING.md) to contribute
- Check [API_TESTING.md](./API_TESTING.md) for API docs
- Review [TESTING.md](./TESTING.md) for testing guide

## 🆘 Need Help?

- **Email**: <snda@hey.com>
- **Issues**: GitHub Issues
- **Docs**: Check `/docs` folder

---

Welcome to the **sNDa community**! 🥪❤️
