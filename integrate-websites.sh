#!/bin/bash

# Marina Glen Website Integration Deployment Script
# This script integrates the static website with the React booking platform

set -e

echo "🏖️  Marina Glen Website Integration Deployment"
echo "=============================================="

# Color codes for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

print_status() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_info() {
    echo -e "${BLUE}ℹ️  $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

# Configuration
STATIC_WEBSITE_PATH="C:\\Users\\Monster\\Desktop\\Website Upgrade"
BOOKING_PLATFORM_PATH="C:\\Users\\Monster\\Desktop\\booking copy"
OUTPUT_PATH="C:\\Users\\Monster\\Desktop\\marina-glen-integrated"

print_info "Starting Marina Glen website integration..."

# Create output directory
mkdir -p "$OUTPUT_PATH"
print_status "Created integration directory: $OUTPUT_PATH"

# Copy static website files
print_info "Copying static website files..."
cp -r "$STATIC_WEBSITE_PATH"/* "$OUTPUT_PATH/"
print_status "Static website files copied"

# Build React booking platform
print_info "Building React booking platform..."
cd "$BOOKING_PLATFORM_PATH/frontend"
npm run build
print_status "React app built successfully"

# Copy React build to /booking/ subfolder
print_info "Integrating booking platform..."
mkdir -p "$OUTPUT_PATH/booking"
cp -r "$BOOKING_PLATFORM_PATH/frontend/dist"/* "$OUTPUT_PATH/booking/"
print_status "Booking platform integrated"

# Copy backend for deployment
print_info "Preparing backend API..."
mkdir -p "$OUTPUT_PATH/api"
cp -r "$BOOKING_PLATFORM_PATH/backend"/* "$OUTPUT_PATH/api/"
print_status "Backend API prepared"

# Update static website links to point to integrated booking
print_info "Updating navigation links..."

# Update index.html booking links
sed -i 's|https://marinaglen.co.za/booking/|/booking/|g' "$OUTPUT_PATH/index.html"
sed -i 's|href="booking/"|href="/booking/"|g' "$OUTPUT_PATH/index.html"

# Update any other HTML files
find "$OUTPUT_PATH" -name "*.html" -type f -exec sed -i 's|marinaglen.co.za/booking/|/booking/|g' {} \;

print_status "Navigation links updated"

# Create .htaccess for proper routing
cat > "$OUTPUT_PATH/.htaccess" << 'EOF'
# Marina Glen Website Integration - Apache Configuration

# Enable mod_rewrite
RewriteEngine On

# Force HTTPS
RewriteCond %{HTTPS} off
RewriteRule ^(.*)$ https://%{HTTP_HOST}%{REQUEST_URI} [L,R=301]

# Handle React app routing for booking section
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteCond %{REQUEST_URI} ^/booking/
RewriteRule ^booking/(.*)$ /booking/index.html [L]

# Handle API requests (if backend is on same server)
RewriteCond %{REQUEST_URI} ^/api/
RewriteRule ^api/(.*)$ /api/index.php?request=$1 [QSA,L]

# Cache static assets
<IfModule mod_expires.c>
    ExpiresActive On
    ExpiresByType text/css "access plus 1 year"
    ExpiresByType application/javascript "access plus 1 year"
    ExpiresByType image/png "access plus 1 year"
    ExpiresByType image/jpg "access plus 1 year"
    ExpiresByType image/jpeg "access plus 1 year"
    ExpiresByType image/gif "access plus 1 year"
    ExpiresByType image/svg+xml "access plus 1 year"
</IfModule>

# Security headers
<IfModule mod_headers.c>
    Header always set X-Content-Type-Options nosniff
    Header always set X-Frame-Options DENY
    Header always set X-XSS-Protection "1; mode=block"
    Header always set Strict-Transport-Security "max-age=31536000; includeSubDomains"
</IfModule>

# Compress files for faster loading
<IfModule mod_deflate.c>
    AddOutputFilterByType DEFLATE text/plain
    AddOutputFilterByType DEFLATE text/html
    AddOutputFilterByType DEFLATE text/xml
    AddOutputFilterByType DEFLATE text/css
    AddOutputFilterByType DEFLATE application/xml
    AddOutputFilterByType DEFLATE application/xhtml+xml
    AddOutputFilterByType DEFLATE application/rss+xml
    AddOutputFilterByType DEFLATE application/javascript
    AddOutputFilterByType DEFLATE application/x-javascript
</IfModule>
EOF

print_status "Apache configuration created"

# Create nginx configuration alternative
cat > "$OUTPUT_PATH/nginx.conf" << 'EOF'
# Marina Glen Website Integration - Nginx Configuration

server {
    listen 80;
    listen [::]:80;
    server_name marinaglen.co.za www.marinaglen.co.za;
    
    # Redirect HTTP to HTTPS
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    listen [::]:443 ssl http2;
    server_name marinaglen.co.za www.marinaglen.co.za;
    
    # SSL configuration
    ssl_certificate /path/to/certificate.crt;
    ssl_certificate_key /path/to/private.key;
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers ECDHE-RSA-AES256-GCM-SHA512:DHE-RSA-AES256-GCM-SHA512;
    
    # Document root
    root /var/www/marinaglen;
    index index.html;
    
    # Static website files
    location / {
        try_files $uri $uri/ /index.html;
        
        # Cache static assets
        location ~* \.(css|js|png|jpg|jpeg|gif|svg|ico)$ {
            expires 1y;
            add_header Cache-Control "public, immutable";
        }
    }
    
    # React booking app
    location /booking/ {
        alias /var/www/marinaglen/booking/;
        try_files $uri $uri/ /booking/index.html;
        
        # Handle React routing
        location ~ ^/booking/(.*)$ {
            try_files $uri $uri/ /booking/index.html;
        }
    }
    
    # API backend (if on same server)
    location /api/ {
        proxy_pass http://localhost:3007;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
    
    # Security headers
    add_header X-Content-Type-Options nosniff;
    add_header X-Frame-Options DENY;
    add_header X-XSS-Protection "1; mode=block";
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains";
    
    # Gzip compression
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_types text/plain text/css text/xml text/javascript application/javascript application/xml+rss application/json;
}
EOF

print_status "Nginx configuration created"

# Create deployment package info
cat > "$OUTPUT_PATH/DEPLOYMENT-INFO.md" << 'EOF'
# Marina Glen Integrated Website Deployment

## 📁 Package Contents

```
marina-glen-integrated/
├── index.html              (Main website homepage)
├── attractions.html        (Attractions page) 
├── styles/                 (Static website CSS)
├── scripts/                (Static website JS)
├── images/                 (Static website images)
├── booking/                (React booking platform)
│   ├── index.html         (React app entry)
│   ├── assets/            (React build files)
│   └── ...                (React app components)
├── api/                    (Backend API - deploy separately)
├── .htaccess              (Apache configuration)
├── nginx.conf             (Nginx configuration)
└── DEPLOYMENT-INFO.md     (This file)
```

## 🚀 Deployment Options

### Option 1: cPanel/Shared Hosting
1. Upload all files to public_html/
2. Backend API needs separate Node.js hosting
3. Update API URLs in booking app

### Option 2: VPS/Dedicated Server
1. Use nginx.conf for server configuration
2. Deploy backend API on same server
3. Complete integration with single domain

### Option 3: Cloud Hosting
1. Static files to CDN (Vercel/Netlify)
2. Backend to cloud platform (Railway/AWS)
3. Configure CORS for cross-origin requests

## 🔧 Configuration Required

### Environment Variables
```bash
# Backend API
NODE_ENV=production
PORT=3007
DATABASE_URL=your_database_url
FRONTEND_URL=https://marinaglen.co.za

# Frontend (if needed)
VITE_API_URL=https://marinaglen.co.za/api
```

### DNS Configuration
```
A Record: marinaglen.co.za → Your server IP
CNAME: www.marinaglen.co.za → marinaglen.co.za
```

## 🌐 URL Structure
- Main Website: https://marinaglen.co.za/
- Attractions: https://marinaglen.co.za/attractions.html
- Booking System: https://marinaglen.co.za/booking/
- API Endpoints: https://marinaglen.co.za/api/

## ✅ Testing Checklist
- [ ] Main website loads correctly
- [ ] Navigation between sections works
- [ ] Booking system functions properly
- [ ] Mobile responsiveness verified
- [ ] SSL certificate installed
- [ ] All links working correctly
EOF

print_status "Deployment info created"

# Create summary
echo ""
print_status "Integration completed successfully! 🎉"
echo ""
print_info "Summary:"
echo "📁 Integrated website: $OUTPUT_PATH"
echo "🌐 Structure: Static site + React booking platform"
echo "🔗 URLs: Main site (/) + Booking (/booking/)"
echo "📱 Mobile: Fully responsive design"
echo ""
print_info "Next steps:"
echo "1. Review files in: $OUTPUT_PATH"
echo "2. Choose deployment method (see DEPLOYMENT-INFO.md)"
echo "3. Configure backend API hosting"
echo "4. Upload to your web server"
echo "5. Test complete user journey"
echo ""
print_info "Support: See WEBSITE-INTEGRATION-GUIDE.md for detailed instructions"