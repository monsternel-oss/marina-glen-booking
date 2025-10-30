# Marina Glen Holiday Resort - Render Deployment Script (PowerShell)
# Run this script to prepare and deploy your booking platform to Render

Write-Host "🌊 Marina Glen Holiday Resort - Render Deployment Script" -ForegroundColor Cyan
Write-Host "=========================================================" -ForegroundColor Cyan

# Function to check if CLI is installed
function Check-CLI {
    param($name, $package)
    if (!(Get-Command $name -ErrorAction SilentlyContinue)) {
        Write-Host "❌ $name CLI not found. Please install it first:" -ForegroundColor Red
        Write-Host "   npm install -g $package" -ForegroundColor Yellow
        return $false
    }
    return $true
}

# Function to check git status
function Check-Git {
    if (!(Get-Command git -ErrorAction SilentlyContinue)) {
        Write-Host "❌ Git not found. Please install Git first." -ForegroundColor Red
        exit 1
    }
    
    # Check if we're in a git repository
    try {
        git status | Out-Null
        Write-Host "✅ Git repository detected" -ForegroundColor Green
    }
    catch {
        Write-Host "❌ Not in a git repository. Initializing..." -ForegroundColor Yellow
        git init
        git add .
        git commit -m "Initial Marina Glen booking platform for Render deployment"
        Write-Host "✅ Git repository initialized" -ForegroundColor Green
    }
}

# Function to build and test backend
function Test-Backend {
    Write-Host "🔧 Testing Backend Build..." -ForegroundColor Blue
    Set-Location backend
    
    # Install dependencies
    Write-Host "📦 Installing backend dependencies..." -ForegroundColor Yellow
    npm install
    
    if ($LASTEXITCODE -ne 0) {
        Write-Host "❌ Backend dependency installation failed!" -ForegroundColor Red
        exit 1
    }
    
    # Build the backend
    Write-Host "🔨 Building backend..." -ForegroundColor Yellow
    npm run build
    
    if ($LASTEXITCODE -ne 0) {
        Write-Host "❌ Backend build failed!" -ForegroundColor Red
        exit 1
    }
    
    Write-Host "✅ Backend build successful!" -ForegroundColor Green
    Set-Location ..
}

# Function to build and test frontend
function Test-Frontend {
    Write-Host "🔧 Testing Frontend Build..." -ForegroundColor Blue
    Set-Location frontend
    
    # Install dependencies
    Write-Host "📦 Installing frontend dependencies..." -ForegroundColor Yellow
    npm install
    
    if ($LASTEXITCODE -ne 0) {
        Write-Host "❌ Frontend dependency installation failed!" -ForegroundColor Red
        exit 1
    }
    
    # Copy Render environment file
    if (Test-Path ".env.render") {
        Write-Host "📋 Using Render environment configuration..." -ForegroundColor Yellow
        Copy-Item ".env.render" ".env.production"
    }
    
    # Build the frontend
    Write-Host "🔨 Building frontend..." -ForegroundColor Yellow
    npm run build
    
    if ($LASTEXITCODE -ne 0) {
        Write-Host "❌ Frontend build failed!" -ForegroundColor Red
        exit 1
    }
    
    Write-Host "✅ Frontend build successful!" -ForegroundColor Green
    Set-Location ..
}

# Function to push to GitHub
function Push-ToGitHub {
    Write-Host "📤 Pushing to GitHub..." -ForegroundColor Blue
    
    # Check if we have a remote
    $remotes = git remote
    if (-not $remotes) {
        Write-Host "⚠️  No Git remote found. Please add your GitHub repository:" -ForegroundColor Yellow
        Write-Host "   git remote add origin https://github.com/yourusername/marina-glen-booking.git" -ForegroundColor White
        Write-Host "   Then run this script again." -ForegroundColor White
        return $false
    }
    
    # Add all files and commit
    git add .
    $commitMessage = "Deploy Marina Glen to Render - $(Get-Date -Format 'yyyy-MM-dd HH:mm')"
    git commit -m $commitMessage
    
    # Push to GitHub
    try {
        git push origin main
        Write-Host "✅ Code pushed to GitHub successfully!" -ForegroundColor Green
        return $true
    }
    catch {
        Write-Host "❌ Failed to push to GitHub. Please check your remote configuration." -ForegroundColor Red
        return $false
    }
}

# Function to deploy frontend to Vercel
function Deploy-Frontend {
    Write-Host "🌐 Deploying Frontend to Vercel..." -ForegroundColor Blue
    
    if (!(Check-CLI "vercel" "vercel")) {
        return $false
    }
    
    Set-Location frontend
    
    # Deploy to Vercel
    Write-Host "🚀 Deploying to Vercel..." -ForegroundColor Yellow
    vercel --prod
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✅ Frontend deployed to Vercel!" -ForegroundColor Green
    } else {
        Write-Host "❌ Frontend deployment failed!" -ForegroundColor Red
    }
    
    Set-Location ..
}

# Function to display Render instructions
function Show-RenderInstructions {
    Write-Host ""
    Write-Host "🎯 Next Steps for Render Deployment:" -ForegroundColor Cyan
    Write-Host "====================================" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "1. 🗄️  Create PostgreSQL Database:" -ForegroundColor Yellow
    Write-Host "   • Go to https://dashboard.render.com" -ForegroundColor White
    Write-Host "   • Click 'New +' → 'PostgreSQL'" -ForegroundColor White
    Write-Host "   • Name: marina-glen-db" -ForegroundColor White
    Write-Host "   • Database: marina_glen_booking" -ForegroundColor White
    Write-Host "   • Plan: Free (90 days) or Starter ($7/month)" -ForegroundColor White
    Write-Host ""
    Write-Host "2. 🚀 Create Backend Web Service:" -ForegroundColor Yellow
    Write-Host "   • Click 'New +' → 'Web Service'" -ForegroundColor White
    Write-Host "   • Connect your GitHub repository" -ForegroundColor White
    Write-Host "   • Root Directory: backend" -ForegroundColor White
    Write-Host "   • Build Command: npm install && npm run build" -ForegroundColor White
    Write-Host "   • Start Command: npm start" -ForegroundColor White
    Write-Host "   • Add environment variables from backend/.env.render" -ForegroundColor White
    Write-Host ""
    Write-Host "3. 🌐 Update Frontend Configuration:" -ForegroundColor Yellow
    Write-Host "   • Update VITE_API_URL in frontend/.env.render" -ForegroundColor White
    Write-Host "   • Use your Render backend URL: https://marina-glen-backend.onrender.com" -ForegroundColor White
    Write-Host ""
    Write-Host "4. 🔧 Environment Variables for Backend:" -ForegroundColor Yellow
    Write-Host "   DATABASE_URL=[From Render PostgreSQL]" -ForegroundColor White
    Write-Host "   JWT_SECRET=[Generate secure random string]" -ForegroundColor White
    Write-Host "   CORS_ORIGIN=https://marinaglen.co.za" -ForegroundColor White
    Write-Host "   NODE_ENV=production" -ForegroundColor White
    Write-Host "   PORT=10000" -ForegroundColor White
    Write-Host ""
    Write-Host "5. 🌍 Configure Domain:" -ForegroundColor Yellow
    Write-Host "   • Point marinaglen.co.za to your Vercel deployment" -ForegroundColor White
    Write-Host "   • Backend will be at: https://marina-glen-backend.onrender.com" -ForegroundColor White
    Write-Host ""
    Write-Host "📋 Complete guide available in: RENDER-DEPLOYMENT-GUIDE.md" -ForegroundColor Green
}

# Main deployment process
function Main {
    Write-Host "🚀 Starting Render deployment preparation..." -ForegroundColor Green
    Write-Host ""
    
    # Check prerequisites
    Check-Git
    
    # Test builds
    Test-Backend
    Test-Frontend
    
    # Push to GitHub (required for Render)
    if (Push-ToGitHub) {
        Write-Host "✅ Code is ready for Render deployment!" -ForegroundColor Green
    } else {
        Write-Host "❌ Failed to prepare code for deployment." -ForegroundColor Red
        exit 1
    }
    
    # Deploy frontend to Vercel
    $deployFrontend = Read-Host "Deploy frontend to Vercel now? (y/N)"
    if ($deployFrontend -eq "y" -or $deployFrontend -eq "Y") {
        Deploy-Frontend
    }
    
    # Show Render instructions
    Show-RenderInstructions
    
    Write-Host ""
    Write-Host "🎉 Deployment preparation complete!" -ForegroundColor Green
    Write-Host "📂 Files ready:" -ForegroundColor White
    Write-Host "   ✅ render.yaml - Render service configuration" -ForegroundColor Gray
    Write-Host "   ✅ backend/.env.render - Backend environment template" -ForegroundColor Gray
    Write-Host "   ✅ frontend/.env.render - Frontend environment template" -ForegroundColor Gray
    Write-Host "   ✅ Code pushed to GitHub" -ForegroundColor Gray
    Write-Host ""
    Write-Host "🌐 Your Marina Glen booking platform is ready for Render!" -ForegroundColor Cyan
}

# Run the deployment preparation
Main