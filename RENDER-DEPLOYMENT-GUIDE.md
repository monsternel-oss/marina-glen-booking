# Marina Glen Holiday Resort - Render Deployment Guide

## 🌊 Deploying to Render Platform

Render is a modern cloud platform that's perfect for hosting your Marina Glen booking system. This guide will walk you through deploying both your backend API and PostgreSQL database.

## Prerequisites ✅

1. **GitHub Account** - Your code needs to be in a GitHub repository
2. **Render Account** - Sign up at [render.com](https://render.com)
3. **Domain Access** - For marinaglen.co.za configuration

## Cost Overview 💰

- **Backend Service**: Free tier available (sleeps after inactivity), or $7/month for always-on
- **PostgreSQL Database**: Free for 90 days, then $7/month
- **Total Monthly Cost**: $0-14/month depending on plan choice

## Step 1: Prepare Your Repository 📚

### Push to GitHub
```bash
# Initialize git repository (if not already done)
git init
git add .
git commit -m "Initial Marina Glen booking platform"

# Create repository on GitHub and push
git remote add origin https://github.com/yourusername/marina-glen-booking.git
git branch -M main
git push -u origin main
```

## Step 2: Deploy Database 🗄️

### Create PostgreSQL Database
1. Log into [Render Dashboard](https://dashboard.render.com)
2. Click **"New +"** → **"PostgreSQL"**
3. Configure database:
   - **Name**: `marina-glen-db`
   - **Database**: `marina_glen_booking`
   - **User**: `marina_admin`
   - **Region**: Choose closest to your users
   - **Plan**: Start with **Free** (90 days free)
4. Click **"Create Database"**
5. **Save the connection details** (Database URL, Host, Port, etc.)

### Database Schema Setup
Once database is created, you'll need to run your schema setup:
```sql
-- Connect to your database and run your schema creation scripts
-- (Your existing SQL schema files)
```

## Step 3: Deploy Backend API 🚀

### Create Web Service
1. In Render Dashboard, click **"New +"** → **"Web Service"**
2. Connect your GitHub repository
3. Configure service:
   - **Name**: `marina-glen-backend`
   - **Root Directory**: `backend`
   - **Environment**: `Node`
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm start`
   - **Plan**: Start with **Free** (sleeps after 15min inactivity)

### Environment Variables
Add these environment variables in Render:

```env
NODE_ENV=production
PORT=10000
DATABASE_URL=[Your Render PostgreSQL connection string]
JWT_SECRET=[Generate a secure random string]
CORS_ORIGIN=https://marinaglen.co.za
STRIPE_SECRET_KEY=[Your Stripe secret key if using payments]
EMAIL_HOST=[Your email provider if using email notifications]
EMAIL_USER=[Email username]
EMAIL_PASS=[Email password]
```

**Important**: Render automatically provides the `PORT` environment variable, but set it to 10000 for consistency.

## Step 4: Deploy Frontend 🌐

### Deploy to Vercel (Recommended)
Your frontend will still deploy to Vercel as planned, but update the backend URL:

1. In your frontend `.env.production`:
```env
VITE_API_URL=https://marina-glen-backend.onrender.com
```

2. Deploy frontend:
```bash
cd frontend
vercel --prod
```

### Alternative: Deploy Frontend to Render
If you prefer to keep everything on Render:

1. Create another **Web Service** for frontend
2. Configure:
   - **Name**: `marina-glen-frontend`
   - **Root Directory**: `frontend`
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm run preview`
   - **Environment Variables**:
     ```env
     VITE_API_URL=https://marina-glen-backend.onrender.com
     ```

## Step 5: Custom Domain Setup 🌍

### Backend Domain (Optional)
1. In your backend service settings
2. Go to **"Custom Domains"**
3. Add: `api.marinaglen.co.za`
4. Update DNS records as instructed by Render

### Frontend Domain
1. In Vercel (or Render frontend service)
2. Add custom domain: `marinaglen.co.za`
3. Configure DNS records

## Step 6: Health Check Endpoint 🔍

Ensure your backend has a health check endpoint. Update your `backend/src/server.ts`:

```typescript
// Add health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({ 
    status: 'healthy', 
    timestamp: new Date().toISOString(),
    service: 'Marina Glen Booking API'
  });
});
```

## Step 7: Database Migrations 📊

### Initial Setup
1. Connect to your Render PostgreSQL database
2. Run your schema creation scripts
3. Insert initial data (room types, admin user, etc.)

### Create Admin User
```sql
INSERT INTO users (email, password_hash, role, created_at) 
VALUES (
  'admin@marinaglen.co.za', 
  '[hashed_password]', 
  'admin', 
  NOW()
);
```

## Step 8: SSL & Security 🔒

### Automatic SSL
- Render provides automatic SSL certificates
- No additional configuration needed
- Certificates auto-renew

### CORS Configuration
Update your backend CORS settings:
```typescript
app.use(cors({
  origin: [
    'https://marinaglen.co.za',
    'https://www.marinaglen.co.za',
    'http://localhost:5173' // For development
  ],
  credentials: true
}));
```

## Step 9: Monitoring & Logs 📈

### Render Monitoring
- Built-in logs and metrics
- Real-time log streaming
- Performance monitoring
- Automatic crash recovery

### Set Up Alerts
1. Go to service settings
2. Configure notification preferences
3. Set up email alerts for downtime

## Step 10: Testing Production 🧪

### Test Complete Flow
1. Visit `https://marinaglen.co.za`
2. Navigate to booking system
3. Test room availability
4. Complete a test booking
5. Test admin login: `admin@marinaglen.co.za` / `Marina@2025`
6. Verify email notifications (if configured)

## Common Issues & Solutions 🔧

### Backend Won't Start
- Check build logs in Render dashboard
- Verify all environment variables are set
- Ensure database connection string is correct

### Database Connection Failed
- Verify DATABASE_URL format
- Check database is running and accessible
- Ensure your backend service region matches database region

### CORS Errors
- Update CORS_ORIGIN environment variable
- Check frontend is making requests to correct backend URL
- Verify SSL certificates are working

## Performance Optimization ⚡

### Backend Optimization
- Use connection pooling for database
- Implement caching for frequently accessed data
- Optimize database queries

### Frontend Optimization
- Use Vercel's CDN for static assets
- Implement lazy loading for components
- Optimize images and assets

## Backup Strategy 💾

### Database Backups
- Render provides automatic daily backups
- Manual backups available in dashboard
- Export data regularly for local backup

### Code Backups
- GitHub repository serves as code backup
- Tag releases for easy rollback
- Keep deployment configurations in version control

## Scaling Considerations 📊

### When to Upgrade
- **Free Tier Limitations**: Services sleep after 15min inactivity
- **Upgrade Triggers**: Consistent traffic, need for always-on service
- **Database Growth**: Monitor storage usage

### Scaling Options
- Upgrade to **Starter Plan** ($7/month) for always-on service
- **Standard Plan** ($25/month) for higher performance
- **Pro Plan** ($85/month) for production workloads

## Cost Optimization 💡

### Free Tier Strategy
- Start with free tiers for testing
- Monitor usage and performance
- Upgrade components as needed

### Production Ready
- Backend: **Starter Plan** ($7/month)
- Database: **Starter Plan** ($7/month)
- Frontend: **Vercel Free** (sufficient for most sites)
- **Total**: ~$14/month

## Go-Live Checklist ✅

### Pre-Launch
- [ ] Database deployed and configured
- [ ] Backend API deployed and tested
- [ ] Frontend deployed and connected
- [ ] Domain DNS configured
- [ ] SSL certificates active
- [ ] Admin access verified
- [ ] Test bookings completed

### Post-Launch
- [ ] Monitor logs for errors
- [ ] Set up backup schedule
- [ ] Configure monitoring alerts
- [ ] Update documentation
- [ ] Train staff on admin system

## Support & Resources 📞

### Render Support
- **Documentation**: [render.com/docs](https://render.com/docs)
- **Community**: [community.render.com](https://community.render.com)
- **Support**: Available via dashboard

### Emergency Contacts
- **Render Status**: [status.render.com](https://status.render.com)
- **Your GitHub Repository**: Backup of all code
- **Database Backups**: Available in Render dashboard

---

## Quick Deployment Commands

### Using Render Blueprint (Automated)
```bash
# Deploy using render.yaml blueprint
# Upload render.yaml to your repository
# Connect repository to Render
# Render will automatically deploy based on blueprint
```

### Manual Deployment
```bash
# 1. Push code to GitHub
git add .
git commit -m "Deploy to Render"
git push origin main

# 2. Create services in Render dashboard
# 3. Connect GitHub repository
# 4. Configure environment variables
# 5. Deploy!
```

---

🎯 **Result**: Your Marina Glen Holiday Resort will be live at `marinaglen.co.za` with a robust, scalable backend hosted on Render!

📈 **Benefits of Render**:
- Automatic deployments from GitHub
- Built-in SSL certificates
- Automatic scaling
- Excellent developer experience
- Competitive pricing
- Great performance