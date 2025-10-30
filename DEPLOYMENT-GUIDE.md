# Marina Glen Holiday Resort - Production Deployment Guide

## 🚀 Complete Deployment Process

### Phase 1: Database Setup (PostgreSQL)

#### Option A: Railway (Recommended - Free $5/month credit)
1. Go to https://railway.app
2. Sign up with GitHub
3. Create new project → "Provision PostgreSQL"
4. Copy connection details:
   - Host, Port, Database, Username, Password
   - Connection URL format: `postgresql://username:password@host:port/database`

#### Option B: Supabase (Alternative - Free tier)
1. Go to https://supabase.com
2. Create new project
3. Go to Settings → Database
4. Copy connection string

### Phase 2: Backend Deployment (Node.js API)

#### Option A: Railway Deployment
1. **Prepare Backend**:
   ```bash
   cd backend
   npm run build
   ```

2. **Create railway.json**:
   ```json
   {
     "$schema": "https://railway.app/railway.schema.json",
     "build": {
       "builder": "NIXPACKS"
     },
     "deploy": {
       "startCommand": "npm start",
       "healthcheckPath": "/api/health"
     }
   }
   ```

3. **Environment Variables** (Set in Railway dashboard):
   ```
   NODE_ENV=production
   PORT=3007
   DB_HOST=your-railway-postgres-host
   DB_PORT=5432
   DB_NAME=railway
   DB_USER=postgres
   DB_PASSWORD=your-password
   JWT_SECRET=your-super-secret-jwt-key-change-this
   STRIPE_SECRET_KEY=your-stripe-secret-key
   ```

4. **Deploy to Railway**:
   - Connect GitHub repository
   - Railway auto-deploys on push
   - Your API will be available at: `https://your-app.railway.app`

#### Option B: Render Deployment
1. Go to https://render.com
2. Connect GitHub repository (backend folder)
3. Set build command: `npm install && npm run build`
4. Set start command: `npm start`
5. Add environment variables (same as above)

### Phase 3: Frontend Deployment (React)

#### Option A: Vercel Deployment (Recommended)
1. **Prepare Frontend**:
   ```bash
   cd frontend
   npm run build
   ```

2. **Create vercel.json**:
   ```json
   {
     "builds": [
       {
         "src": "package.json",
         "use": "@vercel/static-build",
         "config": {
           "distDir": "dist"
         }
       }
     ],
     "routes": [
       {
         "src": "/main-site/(.*)",
         "dest": "/main-site/$1"
       },
       {
         "src": "/(.*)",
         "dest": "/index.html"
       }
     ],
     "functions": {
       "app.js": {
         "runtime": "nodejs18.x"
       }
     }
   }
   ```

3. **Environment Variables** (Set in Vercel dashboard):
   ```
   VITE_API_URL=https://your-backend.railway.app
   VITE_STRIPE_PUBLIC_KEY=your-stripe-public-key
   ```

4. **Deploy to Vercel**:
   ```bash
   npx vercel --prod
   ```

#### Option B: Netlify Deployment
1. **Create _redirects file** in `frontend/public/`:
   ```
   /api/* https://your-backend.railway.app/api/:splat 200
   /* /index.html 200
   ```

2. **Deploy**:
   ```bash
   npm run build
   netlify deploy --prod --dir=dist
   ```

### Phase 4: Domain Configuration

#### For marinaglen.co.za:
1. **DNS Settings** (in your domain registrar):
   ```
   A Record:    @ → Vercel IP (or use CNAME)
   CNAME:       www → your-app.vercel.app
   CNAME:       booking → your-app.vercel.app (optional subdomain)
   ```

2. **Vercel Domain Setup**:
   - Go to Vercel project settings
   - Add custom domain: `marinaglen.co.za`
   - Add custom domain: `www.marinaglen.co.za`

### Phase 5: SSL & Security
- ✅ Vercel provides automatic SSL
- ✅ Railway provides automatic SSL
- ✅ Configure CORS for production domains

## 📋 Pre-Deployment Checklist

### Backend Preparation:
- [ ] Add health check endpoint: `/api/health`
- [ ] Configure CORS for production domain
- [ ] Set up proper error logging
- [ ] Add rate limiting for production
- [ ] Configure database connection pooling
- [ ] Set up environment-specific configs

### Frontend Preparation:
- [ ] Update API endpoints to production URLs
- [ ] Configure environment variables
- [ ] Test build process locally
- [ ] Optimize images and assets
- [ ] Add production error handling
- [ ] Configure analytics (optional)

### Database Preparation:
- [ ] Run migrations in production
- [ ] Set up database backups
- [ ] Configure connection limits
- [ ] Add monitoring

## 🔧 Quick Start Commands

### 1. Prepare for Deployment:
```bash
# Test builds locally
cd frontend && npm run build
cd ../backend && npm run build

# Check for any build errors
npm run lint
```

### 2. Deploy Backend to Railway:
```bash
# Install Railway CLI
npm install -g @railway/cli

# Login and deploy
railway login
railway link
railway up
```

### 3. Deploy Frontend to Vercel:
```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
cd frontend
vercel --prod
```

## 💰 Cost Estimate (Monthly)
- **Database (Railway)**: $5/month
- **Backend (Railway)**: $5/month  
- **Frontend (Vercel)**: Free
- **Domain**: Existing
- **Total**: ~$10/month

## 🔒 Security Considerations
- Use strong JWT secrets
- Enable HTTPS only
- Configure proper CORS
- Set up rate limiting
- Regular security updates
- Database connection encryption

## 📞 Support & Monitoring
- Set up uptime monitoring (UptimeRobot - free)
- Configure error tracking (Sentry - free tier)
- Set up backup strategies
- Monitor database performance

---
*This guide will take your Marina Glen booking platform from development to production in about 2-3 hours.*