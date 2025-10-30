# Production Deployment Guide for Marina Glen Holiday Resort

## 🚀 Quick Deployment Options

### Option 1: Railway (Recommended for beginners)
```bash
# 1. Install Railway CLI
npm install -g @railway/cli

# 2. Login to Railway
railway login

# 3. Deploy backend
cd backend
railway deploy

# 4. Deploy frontend
cd ../frontend
railway deploy
```

### Option 2: Vercel + Supabase
```bash
# 1. Install Vercel CLI
npm install -g vercel

# 2. Deploy frontend to Vercel
cd frontend
vercel --prod

# 3. Backend can be deployed to Railway or AWS
cd ../backend
# Use Railway or AWS for backend
```

### Option 3: AWS (Professional setup)
```bash
# Use AWS Amplify for frontend
# Use AWS ECS/Lambda for backend
# Use AWS RDS for PostgreSQL
```

## 📋 Pre-Deployment Checklist

### 1. Database Setup
- [ ] Create PostgreSQL database (use Supabase, Railway, or AWS RDS)
- [ ] Run migration: `npm run migrate`
- [ ] Set up database backups
- [ ] Configure connection pooling

### 2. Environment Variables
- [ ] Copy `.env.example` to `.env`
- [ ] Set production database URL
- [ ] Generate secure JWT secret (32+ characters)
- [ ] Configure email SMTP settings
- [ ] Set up Stripe payment keys
- [ ] Configure AWS S3 for file uploads

### 3. Security
- [ ] Enable HTTPS (SSL/TLS)
- [ ] Set up CORS for production domain
- [ ] Configure rate limiting
- [ ] Set up error monitoring (Sentry)
- [ ] Enable security headers

### 4. Performance
- [ ] Enable gzip compression
- [ ] Set up CDN for static assets
- [ ] Configure caching headers
- [ ] Optimize database queries
- [ ] Set up monitoring

## 🛠 Production Environment Variables

### Frontend (.env.production)
```bash
VITE_API_URL=https://your-api-domain.com
VITE_STRIPE_PUBLISHABLE_KEY=pk_live_your_live_key
VITE_APP_URL=https://your-website.com
```

### Backend (.env)
```bash
NODE_ENV=production
PORT=3007
DATABASE_URL=postgresql://user:pass@host:5432/db
JWT_SECRET=your_super_secure_32_character_secret
FRONTEND_URL=https://your-website.com
STRIPE_SECRET_KEY=sk_live_your_live_key
```

## 🏗 Architecture Overview

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │   Backend API   │    │   Database      │
│   (React/Vite)  │◄──►│   (Express.js)  │◄──►│   (PostgreSQL)  │
│   Port: 3000    │    │   Port: 3007    │    │   Port: 5432    │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         │                       │                       │
         ▼                       ▼                       ▼
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   CDN/Hosting   │    │   Cloud Server  │    │   Cloud DB      │
│   (Vercel)      │    │   (Railway)     │    │   (Supabase)    │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

## 🔒 Security Features

### Implemented
- [x] Helmet.js for security headers
- [x] CORS configuration
- [x] Rate limiting
- [x] Input validation with Zod
- [x] JWT authentication
- [x] Password hashing with bcrypt
- [x] SQL injection prevention
- [x] XSS protection

### Additional Security
- [ ] WAF (Web Application Firewall)
- [ ] DDoS protection
- [ ] SSL/TLS certificates
- [ ] Database encryption at rest
- [ ] API key rotation
- [ ] Security monitoring

## 📊 Monitoring & Analytics

### Error Tracking
- Sentry for error monitoring
- Custom error logging
- Performance monitoring

### Analytics
- Google Analytics
- Custom booking analytics
- Revenue tracking
- User behavior analysis

## 🗄 Data Management

### Backup Strategy
- Automated daily database backups
- 30-day retention policy
- Point-in-time recovery
- Cross-region backup storage

### Data Migration
- localStorage to PostgreSQL migration script
- Data validation and cleanup
- Rollback procedures
- Testing environment setup

## 🚀 Deployment Commands

### Development
```bash
npm run dev          # Start both frontend and backend
npm run dev:frontend # Frontend only
npm run dev:backend  # Backend only
```

### Production Build
```bash
npm run build        # Build both applications
npm run build:frontend
npm run build:backend
```

### Database
```bash
npm run migrate      # Run database migrations
npm run seed         # Seed with sample data
npm run backup       # Create database backup
```

## 📞 Support & Maintenance

### Regular Tasks
- [ ] Monitor server performance
- [ ] Check database health
- [ ] Review security logs
- [ ] Update dependencies
- [ ] Backup verification
- [ ] SSL certificate renewal

### Emergency Procedures
- Database recovery steps
- Server rollback procedures
- Contact information for hosting providers
- Incident response plan