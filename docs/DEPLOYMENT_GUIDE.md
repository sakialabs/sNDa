# 🚀 sNDa Production Deployment Guide
## Complete Full-Stack Deployment on Free Tier

### 🎯 **Deployment Strategy: Render + Netlify**
- **Frontend:** Netlify (Next.js) - already deployed at https://snda.netlify.app
- **Backend:** Render (Django) - completely FREE with 750 hours/month
- **Database:** PostgreSQL included free
- **Cache:** Redis included free
- **Email:** SendGrid integration
- **Payments:** Stripe integration

---

## 🌐 **Frontend Deployment (Netlify) - Already Complete ✅**

Your frontend is already live! But here's how to redeploy or update:

### **Quick Redeploy**
```bash
cd frontend
npm run build
# Netlify auto-deploys on git push
git add . && git commit -m "Frontend update" && git push
```

### **Environment Variables (Netlify Dashboard)**
```env
NEXT_PUBLIC_API_URL=https://snda-backend.onrender.com
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_key
```

### **Custom Domain (Optional)**
1. In Netlify dashboard → Domain settings
2. Add custom domain: `snda.org`
3. Update DNS records with your provider
4. SSL automatically provisioned

---

## 🎯 Why Render?
- ✅ **Completely FREE** - 750 hours/month (24/7 coverage)
- ✅ **PostgreSQL included** - Free database tier
- ✅ **Auto-deploy** from GitHub
- ✅ **HTTPS** automatic SSL certificates
- ✅ **Already in your project plan** (README.md line 151)

## 📋 Pre-Deployment Setup

### 1. Push to GitHub
```bash
# Make sure your code is pushed to GitHub
git add .
git commit -m "Prepare for Render deployment"
git push origin main
```

### 2. Create Render Account
1. Go to [render.com](https://render.com)
2. Sign up with GitHub (free)
3. Connect your GitHub account

## 🚀 Deployment Steps

### Step 1: Create PostgreSQL Database
1. In Render dashboard, click **"New +"**
2. Select **"PostgreSQL"**
3. Configure:
   - **Name:** `snda-db`
   - **Database:** `snda`
   - **User:** `snda_user`
   - **Region:** Choose closest to your users
   - **Plan:** Free tier
4. Click **"Create Database"**
5. **Save the connection details** (you'll need them)

### Step 2: Create Redis Instance
1. Click **"New +"** → **"Redis"**
2. Configure:
   - **Name:** `snda-redis`
   - **Plan:** Free tier (25MB)
3. Click **"Create Redis"**

### Step 3: Deploy Main Web Service
1. Click **"New +"** → **"Web Service"**
2. Connect your GitHub repository: `sNDa`
3. Configure:
   - **Name:** `snda-backend`
   - **Root Directory:** `backend`
   - **Environment:** `Python 3`
   - **Build Command:** `pip install -r requirements.txt`
   - **Start Command:** `gunicorn config.wsgi:application --bind 0.0.0.0:$PORT`

### Step 4: Environment Variables
Add these in the **Environment** tab:

```env
# Django Core
SECRET_KEY=your-super-secret-django-key-here-make-it-long-and-random
DEBUG=False
DJANGO_SETTINGS_MODULE=config.settings

# Database (from Step 1)
DATABASE_URL=postgresql://snda_user:password@host:port/snda

# Redis (from Step 2)  
REDIS_URL=redis://red-xxxxx:6379
CELERY_BROKER_URL=redis://red-xxxxx:6379
CELERY_RESULT_BACKEND=redis://red-xxxxx:6379

# CORS & Frontend
ALLOWED_HOSTS=snda-backend.onrender.com,snda.netlify.app
CORS_ALLOWED_ORIGINS=https://snda.netlify.app
FRONTEND_URL=https://snda.netlify.app

# Email (SendGrid)
EMAIL_BACKEND=sendgrid_backend.SendgridBackend
SENDGRID_API_KEY=your_sendgrid_api_key_here
EMAIL_HOST_USER=noreply@snda.org
DEFAULT_FROM_EMAIL=sNDa Platform <noreply@snda.org>

# Stripe
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key
STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_publishable_key

# Security
SECURE_SSL_REDIRECT=True
SECURE_PROXY_SSL_HEADER=HTTP_X_FORWARDED_PROTO,https
```

### Step 5: Deploy Celery Workers (Optional for MVP)
1. **Celery Worker:**
   - Click **"New +"** → **"Background Worker"**
   - Same repo, `backend` directory
   - **Start Command:** `celery -A config worker -l info --concurrency=1`
   - Same environment variables as web service

2. **Celery Beat (Scheduler):**
   - Click **"New +"** → **"Background Worker"**
   - Same repo, `backend` directory  
   - **Start Command:** `celery -A config beat -l info`
   - Same environment variables as web service

## 🔧 Post-Deployment Setup

### Run Database Migrations
1. Go to your web service dashboard
2. Click **"Shell"** tab
3. Run these commands:
```bash
python manage.py migrate
python manage.py collectstatic --noinput
python manage.py createsuperuser
```

### Test Your Deployment
```bash
# Health check
curl https://snda-backend.onrender.com/api/health/

# API endpoints
curl https://snda-backend.onrender.com/api/cases/
```

## 🔄 Update Frontend Configuration

Update your frontend environment variables in Netlify:
```env
NEXT_PUBLIC_API_URL=https://snda-backend.onrender.com
```

## ⚠️ Important Notes

### Free Tier Limitations
- **Sleep after 15 minutes** of inactivity (cold starts ~30 seconds)
- **750 hours/month** total (enough for 24/7)
- **PostgreSQL:** 1GB storage, 97 connections
- **Redis:** 25MB storage

### Keeping Service Awake (Optional)
For production, you can use a simple ping service:
```javascript
// Add to your frontend (runs every 10 minutes)
setInterval(() => {
  fetch('https://snda-backend.onrender.com/api/health/')
}, 600000);
```

## 🚨 Troubleshooting

### Build Failures
```bash
# Check build logs in Render dashboard
# Common issues:
# 1. Missing requirements.txt
# 2. Wrong Python version
# 3. Database connection errors
```

### Database Connection Issues
```bash
# Verify DATABASE_URL format:
postgresql://user:password@host:port/database

# Test connection in shell:
python manage.py dbshell
```

### Static Files Not Loading
```bash
# Run in shell:
python manage.py collectstatic --noinput

# Check STATIC_URL in settings.py
```

## ✅ **Complete Deployment Checklist**

### 🔧 **Pre-Deployment (Local)**
- [ ] All tests passing: `python manage.py test`
- [ ] No Django warnings: `python manage.py check --deploy`
- [ ] Static files collect: `python manage.py collectstatic --noinput`
- [ ] Strong `SECRET_KEY` generated (50+ characters)
- [ ] `requirements.txt` up to date

### 🚀 **Render Deployment**
- [ ] PostgreSQL database created and connected
- [ ] Redis instance created
- [ ] Web service deployed successfully
- [ ] Environment variables configured
- [ ] Auto-deploy enabled
- [ ] Health check path: `/api/health/`

### 🔄 **Post-Deployment**
- [ ] Database migrations completed: `python manage.py migrate`
- [ ] Superuser created: `python manage.py createsuperuser`
- [ ] Health check responding: `curl https://snda-backend.onrender.com/api/health/`
- [ ] Admin panel accessible: `/admin/`
- [ ] API endpoints working: `/api/cases/`, `/api/users/`

### 🌐 **Frontend Integration**
- [ ] Netlify environment updated: `NEXT_PUBLIC_API_URL=https://snda-backend.onrender.com`
- [ ] Frontend build and deploy successful
- [ ] Login/logout flow working
- [ ] Data fetching successful
- [ ] CORS headers present in responses

### 🧪 **End-to-End Testing**
- [ ] User registration and login
- [ ] Coordinator dashboard loads with data
- [ ] Volunteer hub displays assignments
- [ ] Story sharing and media upload
- [ ] Donation flow with Stripe
- [ ] Page load times < 3 seconds
- [ ] Mobile responsiveness verified

## 🎯 **Email System Setup (Optional for MVP)**

### **SendGrid Configuration**
1. Create SendGrid account: https://sendgrid.com
2. Generate API key with full access
3. Verify sender identity: `noreply@snda.org`
4. Add to Render environment variables:
```env
EMAIL_BACKEND=sendgrid_backend.SendgridBackend
SENDGRID_API_KEY=your_sendgrid_api_key_here
EMAIL_HOST_USER=noreply@snda.org
DEFAULT_FROM_EMAIL=sNDa Platform <noreply@snda.org>
```

### **Email Templates Ready**
- ✅ Welcome email (Day 0)
- ✅ Layer up email (Day 2-3) 
- ✅ Engagement email (Day 5-7)
- ✅ Assignment notifications
- ✅ Story published confirmations
- ✅ Chuma weekly motivation

## 🎮 **Gamification System**
- ✅ Badge awarding on case completion
- ✅ Streak tracking with visual progress
- ✅ Points accumulation system
- ✅ Community leaderboards
- ✅ Wall of Love stories
- ✅ Chuma AI Integration with sandwich metaphor

## 🚨 **Emergency Rollback**
**If deployment fails:**
1. Check Render build logs
2. Verify environment variables
3. Test database connectivity
4. Check CORS configuration

**Quick rollback:**
1. Revert to previous GitHub commit
2. Trigger new Render deployment
3. Update frontend API URL if needed

## 🌟 **You're Live!**

Your complete sNDa platform will be available at:
- **Frontend:** https://snda.netlify.app ✅ (Already deployed)
- **Backend API:** https://snda-backend.onrender.com (Deploy following steps above)

### **Final Integration Step**
After backend deployment, update Netlify environment:
```bash
# In Netlify dashboard, update:
NEXT_PUBLIC_API_URL=https://snda-backend.onrender.com
```

**🎯 Complete full-stack platform ready to serve communities worldwide!**

### **What You Get**
- ✅ **Volunteer Management** - Assignment tracking, story sharing, gamification
- ✅ **Donor Platform** - Stripe integration, campaign management, impact tracking  
- ✅ **Community Features** - Wall of Love, leaderboards, badges, streaks
- ✅ **Email System** - Onboarding sequences, notifications, Chuma AI motivation
- ✅ **Admin Dashboard** - Case management, coordinator tools, analytics

---

**💡 Pro Tip:** Both platforms are on generous free tiers perfect for MVP validation and growth.
