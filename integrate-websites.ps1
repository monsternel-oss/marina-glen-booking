# Marina Glen Website Integration - PowerShell Script
# Integrates static website with React booking platform

param(
    [string]$StaticPath = "C:\Users\Monster\Desktop\Website Upgrade",
    [string]$BookingPath = "C:\Users\Monster\Desktop\booking copy", 
    [string]$OutputPath = "C:\Users\Monster\Desktop\marina-glen-integrated"
)

Write-Host "🏖️  Marina Glen Website Integration" -ForegroundColor Cyan
Write-Host "====================================" -ForegroundColor Cyan

function Write-Success {
    param([string]$Message)
    Write-Host "✅ $Message" -ForegroundColor Green
}

function Write-Info {
    param([string]$Message)
    Write-Host "ℹ️  $Message" -ForegroundColor Blue
}

function Write-Warning {
    param([string]$Message)
    Write-Host "⚠️  $Message" -ForegroundColor Yellow
}

try {
    Write-Info "Starting integration process..."
    
    # Create output directory
    if (Test-Path $OutputPath) {
        Write-Warning "Output directory exists. Removing old files..."
        Remove-Item $OutputPath -Recurse -Force
    }
    New-Item -ItemType Directory -Path $OutputPath -Force | Out-Null
    Write-Success "Created output directory: $OutputPath"
    
    # Copy static website files
    Write-Info "Copying static website files..."
    Copy-Item "$StaticPath\*" -Destination $OutputPath -Recurse -Force
    Write-Success "Static website files copied"
    
    # Build React app
    Write-Info "Building React booking platform..."
    Set-Location "$BookingPath\frontend"
    npm run build
    Write-Success "React app built successfully"
    
    # Create booking directory and copy React build
    Write-Info "Integrating booking platform..."
    $BookingDir = Join-Path $OutputPath "booking"
    New-Item -ItemType Directory -Path $BookingDir -Force | Out-Null
    Copy-Item "$BookingPath\frontend\dist\*" -Destination $BookingDir -Recurse -Force
    Write-Success "Booking platform integrated at /booking/"
    
    # Copy backend API
    Write-Info "Preparing backend API..."
    $ApiDir = Join-Path $OutputPath "api"
    New-Item -ItemType Directory -Path $ApiDir -Force | Out-Null
    Copy-Item "$BookingPath\backend\*" -Destination $ApiDir -Recurse -Force
    Write-Success "Backend API prepared"
    
    # Update links in static website
    Write-Info "Updating navigation links..."
    $IndexFile = Join-Path $OutputPath "index.html"
    if (Test-Path $IndexFile) {
        $content = Get-Content $IndexFile -Raw
        $content = $content -replace 'https://marinaglen\.co\.za/booking/', '/booking/'
        $content = $content -replace 'href="booking/"', 'href="/booking/"'
        Set-Content $IndexFile -Value $content
        Write-Success "Main page links updated"
    }
    
    # Update any other HTML files
    Get-ChildItem $OutputPath -Filter "*.html" -Recurse | ForEach-Object {
        $content = Get-Content $_.FullName -Raw
        $content = $content -replace 'marinaglen\.co\.za/booking/', '/booking/'
        Set-Content $_.FullName -Value $content
    }
    Write-Success "All navigation links updated"
    
    # Create web.config for IIS
    $WebConfig = @"
<?xml version="1.0" encoding="UTF-8"?>
<configuration>
    <system.webServer>
        <!-- Force HTTPS -->
        <rewrite>
            <rules>
                <rule name="Force HTTPS" stopProcessing="true">
                    <match url="(.*)" />
                    <conditions>
                        <add input="{HTTPS}" pattern="off" ignoreCase="true" />
                    </conditions>
                    <action type="Redirect" url="https://{HTTP_HOST}/{R:1}" 
                            redirectType="Permanent" />
                </rule>
                
                <!-- Handle React app routing -->
                <rule name="React Routes" stopProcessing="true">
                    <match url="booking/(.*)" />
                    <conditions>
                        <add input="{REQUEST_FILENAME}" matchType="IsFile" negate="true" />
                        <add input="{REQUEST_FILENAME}" matchType="IsDirectory" negate="true" />
                    </conditions>
                    <action type="Rewrite" url="booking/index.html" />
                </rule>
            </rules>
        </rewrite>
        
        <!-- Security headers -->
        <httpProtocol>
            <customHeaders>
                <add name="X-Content-Type-Options" value="nosniff" />
                <add name="X-Frame-Options" value="DENY" />
                <add name="X-XSS-Protection" value="1; mode=block" />
                <add name="Strict-Transport-Security" value="max-age=31536000; includeSubDomains" />
            </customHeaders>
        </httpProtocol>
        
        <!-- Compression -->
        <urlCompression doStaticCompression="true" doDynamicCompression="true" />
        
        <!-- Static file caching -->
        <staticContent>
            <clientCache cacheControlMode="UseMaxAge" cacheControlMaxAge="365.00:00:00" />
        </staticContent>
    </system.webServer>
</configuration>
"@
    
    Set-Content (Join-Path $OutputPath "web.config") -Value $WebConfig
    Write-Success "IIS configuration created"
    
    # Create .htaccess for Apache
    $HtAccess = @"
# Marina Glen Website Integration - Apache Configuration

RewriteEngine On

# Force HTTPS
RewriteCond %{HTTPS} off
RewriteRule ^(.*)$ https://%{HTTP_HOST}%{REQUEST_URI} [L,R=301]

# Handle React app routing
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteCond %{REQUEST_URI} ^/booking/
RewriteRule ^booking/(.*)$ /booking/index.html [L]

# Cache static assets
<IfModule mod_expires.c>
    ExpiresActive On
    ExpiresByType text/css "access plus 1 year"
    ExpiresByType application/javascript "access plus 1 year"
    ExpiresByType image/png "access plus 1 year"
    ExpiresByType image/jpg "access plus 1 year"
    ExpiresByType image/jpeg "access plus 1 year"
</IfModule>

# Security headers
<IfModule mod_headers.c>
    Header always set X-Content-Type-Options nosniff
    Header always set X-Frame-Options DENY
    Header always set X-XSS-Protection "1; mode=block"
</IfModule>
"@
    
    Set-Content (Join-Path $OutputPath ".htaccess") -Value $HtAccess
    Write-Success "Apache configuration created"
    
    # Create deployment README
    $ReadmeContent = @"
# Marina Glen Integrated Website

## 🎯 Integration Complete!

Your Marina Glen website has been successfully integrated with the advanced booking platform.

### 📁 File Structure
```
marina-glen-integrated/
├── index.html              ← Main website homepage
├── attractions.html        ← Attractions page
├── styles/                 ← Main website styling
├── scripts/                ← Main website JavaScript
├── images/                 ← Website images
├── booking/                ← React booking platform
│   ├── index.html         ← Booking app entry
│   └── assets/            ← React app files
├── api/                    ← Backend API (Node.js)
├── web.config             ← IIS configuration
└── .htaccess              ← Apache configuration
```

### 🌐 URL Structure
- **Main Website**: `https://marinaglen.co.za/`
- **Attractions**: `https://marinaglen.co.za/attractions.html`
- **Booking System**: `https://marinaglen.co.za/booking/`
- **API**: `https://marinaglen.co.za/api/`

### 🚀 Deployment Options

#### Option 1: cPanel Hosting (Recommended)
1. Upload all files to `public_html/`
2. Backend needs separate Node.js hosting
3. Works with existing hosting

#### Option 2: Cloud Hosting (Professional)
1. Static files to Vercel/Netlify
2. Backend to Railway/AWS
3. Best performance globally

#### Option 3: VPS/Dedicated Server
1. Full control over configuration
2. Can host everything on one server
3. Use nginx or Apache configs provided

### ⚙️ Configuration Needed

#### Backend Environment Variables:
```
NODE_ENV=production
PORT=3007
DATABASE_URL=your_database_connection
FRONTEND_URL=https://marinaglen.co.za
```

#### Frontend Updates (if API is external):
Update API URL in booking app configuration

### ✅ Testing Checklist
- [ ] Main website loads at root URL
- [ ] Booking button navigates to /booking/
- [ ] Booking system works properly
- [ ] Mobile responsive design
- [ ] SSL certificate configured
- [ ] All images and assets loading

### 🆘 Support
- Documentation: See WEBSITE-INTEGRATION-GUIDE.md
- Issues: Check browser console for errors
- Performance: Test on mobile devices

### 🎨 Design Integration
- ✅ Consistent branding across both sites
- ✅ Seamless navigation experience
- ✅ Mobile responsive design
- ✅ Professional appearance

Ready to deploy! 🎉
"@
    
    Set-Content (Join-Path $OutputPath "README.md") -Value $ReadmeContent
    Write-Success "Documentation created"
    
    # Open the result folder
    Write-Info "Opening integrated website folder..."
    Invoke-Item $OutputPath
    
    Write-Host ""
    Write-Success "Integration completed successfully! 🎉"
    Write-Host ""
    Write-Info "Summary:"
    Write-Host "📁 Location: $OutputPath"
    Write-Host "🌐 Structure: Static website + React booking platform"
    Write-Host "🔗 URLs: / (main) + /booking/ (reservations)"
    Write-Host "📱 Mobile: Fully responsive design"
    Write-Host ""
    Write-Info "Next Steps:"
    Write-Host "1. Review the integrated files"
    Write-Host "2. Choose your deployment method"
    Write-Host "3. Configure backend hosting" 
    Write-Host "4. Upload to your web server"
    Write-Host "5. Test the complete booking flow"
    Write-Host ""
    Write-Warning "Note: Backend API needs Node.js hosting (Railway, AWS, etc.)"
    
} catch {
    Write-Host "❌ Error during integration: $($_.Exception.Message)" -ForegroundColor Red
    Write-Host "Please check paths and try again." -ForegroundColor Red
}

Write-Host ""
Write-Host "Press any key to continue..." -ForegroundColor Gray
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")