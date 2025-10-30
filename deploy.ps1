# Marina Glen Holiday Resort - Deployment Script (PowerShell)
# Run this script to deploy your booking platform

Write-Host "🌊 Marina Glen Holiday Resort - Deployment Script" -ForegroundColor Cyan
Write-Host "==================================================" -ForegroundColor Cyan

# Function to check if CLI is installed
function Check-CLI {
    param($name, $package)
    if (!(Get-Command $name -ErrorAction SilentlyContinue)) {
        Write-Host "❌ $name CLI not found. Please install it first:" -ForegroundColor Red
        Write-Host "   npm install -g $package" -ForegroundColor Yellow
        exit 1
    }
}

# Function to deploy backend
function Deploy-Backend {
    Write-Host "📡 Deploying Backend to Railway..." -ForegroundColor Blue
    Set-Location backend
    
    # Build the backend
    Write-Host "🔨 Building backend..." -ForegroundColor Yellow
    npm run build
    
    if ($LASTEXITCODE -ne 0) {
        Write-Host "❌ Backend build failed!" -ForegroundColor Red
        exit 1
    }
    
    # Deploy to Railway
    railway up
    
    Write-Host "✅ Backend deployed!" -ForegroundColor Green
    Set-Location ..
}

# Function to deploy frontend
function Deploy-Frontend {
    Write-Host "🌐 Deploying Frontend to Vercel..." -ForegroundColor Blue
    Set-Location frontend
    
    # Build the frontend
    Write-Host "🔨 Building frontend..." -ForegroundColor Yellow
    npm run build
    
    if ($LASTEXITCODE -ne 0) {
        Write-Host "❌ Frontend build failed!" -ForegroundColor Red
        exit 1
    }
    
    # Deploy to Vercel
    vercel --prod
    
    Write-Host "✅ Frontend deployed!" -ForegroundColor Green
    Set-Location ..
}

# Main deployment process
function Main {
    Write-Host "🚀 Starting deployment process..." -ForegroundColor Green
    
    # Check for required CLIs
    Check-CLI "railway" "@railway/cli"
    Check-CLI "vercel" "vercel"
    
    # Deploy backend first
    Deploy-Backend
    
    # Deploy frontend
    Deploy-Frontend
    
    Write-Host ""
    Write-Host "🎉 Deployment complete!" -ForegroundColor Green
    Write-Host "📋 Next steps:" -ForegroundColor Yellow
    Write-Host "   1. Configure your domain DNS settings" -ForegroundColor White
    Write-Host "   2. Set up monitoring and backups" -ForegroundColor White
    Write-Host "   3. Test all functionality in production" -ForegroundColor White
    Write-Host ""
    Write-Host "🌐 Your Marina Glen booking platform is now live!" -ForegroundColor Cyan
}

# Run the deployment
Main