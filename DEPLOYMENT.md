# Deployment Guide

This guide covers deploying Agenda Sync to production using popular platforms.

---

## Backend Deployment

### Option 1: Railway.app (Recommended - Easiest)

**Why Railway?** Free Postgres database, automatic deployments, simple setup.

#### Step 1: Prepare Your Repo
```bash
cd backend
# Ensure Procfile exists or add:
echo "web: npm start" > Procfile
```

#### Step 2: Deploy
1. Go to [railway.app](https://railway.app/)
2. Click **Start Project** → **GitHub Repo**
3. Select your `agenda-sync` repository
4. Railway automatically detects Node.js project

#### Step 3: Configure Environment
1. In Railway dashboard, click your project
2. Go to **Variables**
3. Add all variables from `.env`:
   - `PORT=5000`
   - `NODE_ENV=production`
   - `DB_HOST` (Railway provides this)
   - `DB_PORT`, `DB_NAME`, `DB_USER`, `DB_PASSWORD` (Railway creates Postgres automatically)
   - `JWT_SECRET` (generate a random string)
   - Google OAuth credentials
   - Microsoft OAuth credentials
   - `FRONTEND_URL=https://your-frontend-domain.com`

#### Step 4: Update OAuth Redirect URIs
- Google Cloud Console: Update redirect URI to `https://your-railway-domain/api/auth/google/callback`
- Azure Portal: Update redirect URI to `https://your-railway-domain/api/auth/microsoft/callback`

#### Step 5: Verify
```
Domain: https://your-project-xxxxx.railway.app
Check health: https://your-project-xxxxx.railway.app/health
```

---

### Option 2: Heroku

#### Step 1: Install Heroku CLI
```bash
brew tap heroku/brew && brew install heroku
heroku login
```

#### Step 2: Create & Deploy
```bash
cd backend
heroku create agenda-sync-backend
git push heroku main
```

#### Step 3: Set Environment Variables
```bash
heroku config:set GOOGLE_CLIENT_ID=your_id
heroku config:set GOOGLE_CLIENT_SECRET=your_secret
heroku config:set MICROSOFT_CLIENT_ID=your_id
heroku config:set MICROSOFT_CLIENT_SECRET=your_secret
heroku config:set JWT_SECRET=your_random_secret
heroku config:set FRONTEND_URL=https://your-frontend.vercel.app
```

#### Step 4: Set Up Database
```bash
heroku addons:create heroku-postgresql:hobby-dev
# Get credentials from heroku config:get DATABASE_URL
```

---

### Option 3: AWS (More Complex)

Use AWS Elastic Beanstalk or ECS with RDS for database.

1. Install AWS CLI and configure credentials
2. Create RDS PostgreSQL instance
3. Deploy to Elastic Beanstalk or ECS
4. Set environment variables in AWS Console

---

## Frontend Deployment

### Option 1: Vercel (Recommended)

**Why Vercel?** Built for React/Vite, instant deployments, free tier.

#### Step 1: Deploy
1. Go to [vercel.com](https://vercel.com/)
2. Click **Import Project**
3. Select your GitHub repo
4. Configure:
   - Framework: **Vite**
   - Root Directory: `frontend`
   - Build command: `npm run build`
   - Output: `dist`

#### Step 2: Set Environment
1. In project settings, go to **Environment Variables**
2. Add:
   - `VITE_API_URL=https://your-backend-domain.com/api`

#### Step 3: Domain
- Vercel provides free domain: `https://agenda-sync.vercel.app`
- Or add custom domain in settings

---

### Option 2: Netlify

1. Go to [netlify.com](https://netlify.com/)
2. Click **New site from Git**
3. Select your repo
4. Configure:
   - Base directory: `frontend`
   - Build command: `npm run build`
   - Publish: `dist`
5. Add environment variables in site settings
6. Deploy!

---

### Option 3: GitHub Pages

For static hosting (free but limited):

```bash
cd frontend
npm run build
# Push dist/ folder to gh-pages branch
git subtree push --prefix dist origin gh-pages
```

---

## Database Deployment

### Using Railway (Easiest)
- Railway automatically creates Postgres database
- Connection details available in Variables tab
- Connection pooling handled automatically

### Using AWS RDS
1. Create RDS instance (PostgreSQL 12+)
2. Get connection string
3. Set DB environment variables:
   ```
   DB_HOST=xxx.rds.amazonaws.com
   DB_PORT=5432
   DB_NAME=agenda_sync
   DB_USER=postgres
   DB_PASSWORD=xxx
   ```

### Using Heroku Postgres
```bash
heroku addons:create heroku-postgresql
```

---

## Update OAuth Credentials for Production

### Google Cloud Console
1. Add your production domain to **Authorized redirect URIs**:
   ```
   https://api.yourdomain.com/api/auth/google/callback
   ```

### Azure Portal
1. Go to App Registration
2. Update **Redirect URIs** to:
   ```
   https://api.yourdomain.com/api/auth/microsoft/callback
   ```

---

## SSL/HTTPS

All major platforms (Vercel, Railway, Heroku) provide free SSL/HTTPS.

Ensure:
- Backend: `https://your-domain.com`
- Frontend: `https://your-domain.com`
- OAuth requires HTTPS (no localhost)

---

## Environment Variables Summary

### Backend Production
```env
NODE_ENV=production
PORT=5000
DB_HOST=your-db-host
DB_PORT=5432
DB_NAME=agenda_sync
DB_USER=postgres
DB_PASSWORD=secure_password
JWT_SECRET=generate_random_long_string
GOOGLE_CLIENT_ID=xxx
GOOGLE_CLIENT_SECRET=xxx
GOOGLE_REDIRECT_URI=https://api.yourdomain.com/api/auth/google/callback
MICROSOFT_CLIENT_ID=xxx
MICROSOFT_CLIENT_SECRET=xxx
MICROSOFT_REDIRECT_URI=https://api.yourdomain.com/api/auth/microsoft/callback
FRONTEND_URL=https://yourdomain.com
```

### Frontend Production
```env
VITE_API_URL=https://api.yourdomain.com/api
```

---

## Health Checks

After deployment, verify everything works:

```bash
# Check backend health
curl https://api.yourdomain.com/health

# Check frontend loads
curl https://yourdomain.com

# Test OAuth flow
# Visit https://yourdomain.com/oauth-login
# Click Google/Microsoft login
# Should redirect to provider's login page
```

---

## Monitoring & Logs

### Railway
- Dashboard shows live logs
- Metrics tab shows performance

### Heroku
```bash
heroku logs --tail
heroku metrics
```

### Vercel
- Analytics tab shows build times
- Function logs available

---

## Troubleshooting Deployment

| Issue | Solution |
|-------|----------|
| 502 Bad Gateway | Check backend is running, verify ENV vars |
| Build fails | Check Node version, verify package.json |
| Database connection error | Verify DB connection string, check firewall |
| OAuth redirect fails | Verify redirect URIs in provider settings |
| CORS errors | Check FRONTEND_URL in backend ENV |

---

## Next Steps

1. **Monitor**: Set up error tracking (Sentry, LogRocket)
2. **Scale**: Configure auto-scaling if needed
3. **Backup**: Enable database backups
4. **Security**: Enable 2FA on cloud accounts
5. **CI/CD**: Set up automated tests before deployment
