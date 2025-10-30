#!/bin/bash

# Marina Glen Holiday Resort - Quick Deployment Script
# Run this script to deploy your booking platform

echo "🌊 Marina Glen Holiday Resort - Deployment Script"
echo "=================================================="

# Check if required CLIs are installed
check_cli() {
    if ! command -v $1 &> /dev/null; then
        echo "❌ $1 CLI not found. Please install it first:"
        echo "   npm install -g $2"
        exit 1
    fi
}

# Function to deploy backend
deploy_backend() {
    echo "📡 Deploying Backend to Railway..."
    cd backend
    
    # Build the backend
    echo "🔨 Building backend..."
    npm run build
    
    # Deploy to Railway
    railway up
    
    echo "✅ Backend deployed!"
    cd ..
}

# Function to deploy frontend
deploy_frontend() {
    echo "🌐 Deploying Frontend to Vercel..."
    cd frontend
    
    # Build the frontend
    echo "🔨 Building frontend..."
    npm run build
    
    # Deploy to Vercel
    vercel --prod
    
    echo "✅ Frontend deployed!"
    cd ..
}

# Main deployment process
main() {
    echo "🚀 Starting deployment process..."
    
    # Check for required CLIs
    check_cli "railway" "@railway/cli"
    check_cli "vercel" "vercel"
    
    # Deploy backend first
    deploy_backend
    
    # Deploy frontend
    deploy_frontend
    
    echo ""
    echo "🎉 Deployment complete!"
    echo "📋 Next steps:"
    echo "   1. Configure your domain DNS settings"
    echo "   2. Set up monitoring and backups"
    echo "   3. Test all functionality in production"
    echo ""
    echo "🌐 Your Marina Glen booking platform is now live!"
}

# Run the deployment
main