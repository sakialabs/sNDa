# 🧪 sNDa Testing & Development Guide

## Pre-GitHub Push Checklist

### ✅ Code Quality Checks

**1. TypeScript Compilation**
```bash
cd frontend
npx tsc --noEmit
```
**Expected:** No errors, clean compilation

**2. Linting**
```bash
npm run lint
```
**Expected:** No critical errors

**3. Build Test**
```bash
npm run build
```
**Expected:** Successful production build

### ✅ Feature Testing

#### Coordinator Dashboard (`/coordinator`)

**Overview Cards**
- [ ] Total Cases count displays correctly
- [ ] Pending Cases count (NEW, TRIAGED, ASSIGNED, IN_PROGRESS, ON_HOLD)
- [ ] Resolved Cases count
- [ ] High Urgency Cases count (urgency_score >= 7)

**Filtering System**
- [ ] Status filter: ALL, NEW, TRIAGED, ASSIGNED, IN_PROGRESS, ON_HOLD, RESOLVED
- [ ] Urgency filter: ALL, Low (1-2), Medium (3-4), High (5-7), Critical (8-10)
- [ ] Search filter: Case titles and descriptions
- [ ] Combined filters work together

**Case Table**
- [ ] All case data displays: title, description, subject name, status, urgency, assigned volunteer, created date
- [ ] "View" button navigates to case detail (even if not implemented yet)
- [ ] Handles empty state ("No cases found")
- [ ] Urgency score shows "N/A" for null values

**Responsive Design**
- [ ] Mobile viewport (< 768px)
- [ ] Tablet viewport (768px - 1024px)
- [ ] Desktop viewport (> 1024px)

#### Authentication Flow
- [ ] Login redirects work
- [ ] Protected routes redirect to login
- [ ] User context maintains state
- [ ] Logout functionality

#### API Integration
- [ ] Cases load from backend API
- [ ] Volunteers load from backend API
- [ ] Loading states display during API calls
- [ ] Error handling for failed requests
- [ ] Graceful handling of empty responses

### 🔧 Technical Validation

**Dependencies**
- [ ] All npm packages installed without vulnerabilities
- [ ] recharts dependency properly installed
- [ ] No missing TypeScript declarations

**Type Safety**
- [ ] No TypeScript errors in coordinator components
- [ ] Consistent Case interface across all files
- [ ] Proper null/undefined handling for urgency_score

**Performance**
- [ ] Fast initial load
- [ ] Smooth filtering interactions
- [ ] No console errors in browser

### 🚀 Deployment Readiness

**Environment Setup**
- [ ] Environment variables configured
- [ ] API endpoints properly set
- [ ] Build process works without errors

**Documentation**
- [ ] README.md updated with latest features
- [ ] Code comments for complex logic
- [ ] Type definitions documented

## Manual Testing Script

### 1. Start Development Environment
```bash
# Terminal 1 - Backend
cd backend
python manage.py runserver

# Terminal 2 - Frontend
cd frontend
npm run dev
```

### 2. Test Coordinator Dashboard
1. Navigate to `http://localhost:3001/coordinator`
2. Verify overview cards show realistic numbers
3. Test status filter dropdown - select each option
4. Test urgency filter dropdown - select each option
5. Type in search box - verify real-time filtering
6. Combine multiple filters
7. Click "View" on several cases
8. Resize browser window to test responsiveness

### 3. Test Edge Cases
- Empty search results
- No cases in database
- Network errors (disconnect internet briefly)
- Very long case titles/descriptions
- Cases with null urgency_score

### 4. Browser Testing
- Chrome/Chromium
- Firefox
- Safari (if on Mac)
- Mobile browsers

## Common Issues & Solutions

**TypeScript Errors**
- Ensure all imports use consistent paths
- Check Case interface matches across files
- Verify null vs undefined handling

**API Connection Issues**
- Confirm backend is running on correct port
- Check CORS settings
- Verify API endpoints match frontend calls

**Styling Issues**
- Ensure Tailwind classes are properly applied
- Check responsive breakpoints
- Verify dark/light mode compatibility

## Success Criteria

✅ **Ready for GitHub Push when:**
- All TypeScript compilation passes
- No critical lint errors
- Coordinator dashboard fully functional
- All filters and search work correctly
- Responsive design works on all screen sizes
- No console errors in browser
- Documentation is up to date

## 🐳 Docker Backend Setup

### Quick Start with Docker

**Prerequisites:**
- Docker & Docker Compose installed
- Conda environment `snda_env` activated (optional)

**1. Environment Setup**
```bash
# Create .env file in backend directory
cd backend
cp .env.example .env  # Create from template

# Required environment variables:
SECRET_KEY=your-secret-key-here
DEBUG=True
DATABASE_URL=postgresql://snda_user:snda_pass@db:5432/snda_db
ALLOWED_HOSTS=localhost,127.0.0.1
```

**2. Build & Run**
```bash
# From project root
docker-compose up --build

# Or run in background
docker-compose up -d --build
```

**3. Database Setup**
```bash
# Run migrations
docker-compose exec backend python manage.py migrate

# Create superuser
docker-compose exec backend python manage.py createsuperuser

# Load sample data (optional)
docker-compose exec backend python manage.py loaddata fixtures/sample_data.json
```

**4. Access Points**
- Backend API: `http://localhost:8000`
- Admin Panel: `http://localhost:8000/admin`
- Database: `localhost:5432` (external access)

### Development with Conda

**Alternative: Local Development**
```bash
# Activate conda environment
conda activate snda_env

# Install dependencies
cd backend
pip install -r requirements.txt

# Run migrations
python manage.py migrate

# Start development server
python manage.py runserver
```

### Docker Commands Reference

```bash
# View logs
docker-compose logs backend
docker-compose logs db

# Stop services
docker-compose down

# Rebuild after code changes
docker-compose up --build

# Access backend shell
docker-compose exec backend python manage.py shell

# Database backup
docker-compose exec db pg_dump -U snda_user snda_db > backup.sql
```

### Troubleshooting

**Port Conflicts:**
- Backend: Change `8000:8000` to `8001:8000` in docker-compose.yml
- Database: Change `5432:5432` to `5433:5432` in docker-compose.yml

**Permission Issues:**
```bash
# Fix file permissions
sudo chown -R $USER:$USER .
```

**Database Connection:**
- Ensure PostgreSQL container is running: `docker-compose ps`
- Check database logs: `docker-compose logs db`

## Post-Push Verification

After pushing to GitHub:
1. Verify GitHub Actions pass (if configured)
2. Test deployment if auto-deploy is set up
3. Check that all files are properly committed
4. Verify README displays correctly on GitHub
