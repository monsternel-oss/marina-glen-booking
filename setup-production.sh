#!/bin/bash

# Marina Glen Holiday Resort - Production Setup Script
# This script helps set up the production environment

set -e

echo "🏖️  Marina Glen Holiday Resort - Production Setup"
echo "================================================="

# Color codes for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

print_info() {
    echo -e "${BLUE}ℹ️  $1${NC}"
}

# Check if required tools are installed
check_requirements() {
    print_info "Checking requirements..."
    
    # Check Node.js
    if ! command -v node &> /dev/null; then
        print_error "Node.js is not installed. Please install Node.js 18+ first."
        exit 1
    fi
    
    # Check npm
    if ! command -v npm &> /dev/null; then
        print_error "npm is not installed. Please install npm first."
        exit 1
    fi
    
    # Check PostgreSQL (optional for local development)
    if ! command -v psql &> /dev/null; then
        print_warning "PostgreSQL is not installed locally. You'll need a remote database."
    fi
    
    print_status "Requirements check completed"
}

# Install dependencies
install_dependencies() {
    print_info "Installing dependencies..."
    
    # Install root dependencies
    npm install
    
    # Install backend dependencies
    cd backend
    npm install
    cd ..
    
    # Install frontend dependencies
    cd frontend
    npm install
    cd ..
    
    print_status "Dependencies installed"
}

# Set up environment files
setup_environment() {
    print_info "Setting up environment files..."
    
    # Backend environment
    if [ ! -f "backend/.env" ]; then
        cp backend/.env.example backend/.env
        print_warning "Created backend/.env from example. Please update with your values."
    fi
    
    # Frontend environment
    if [ ! -f "frontend/.env.production" ]; then
        cat > frontend/.env.production << EOF
VITE_API_URL=http://localhost:3007
VITE_APP_URL=http://localhost:3000
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_key
EOF
        print_warning "Created frontend/.env.production. Please update with your values."
    fi
    
    print_status "Environment files ready"
}

# Database setup
setup_database() {
    print_info "Setting up database..."
    
    read -p "Do you want to run database migrations? (y/n): " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        cd backend
        npm run migrate
        cd ..
        print_status "Database migration completed"
    else
        print_warning "Skipping database migration"
    fi
}

# Build applications
build_applications() {
    print_info "Building applications..."
    
    # Build backend
    cd backend
    npm run build
    cd ..
    
    # Build frontend
    cd frontend
    npm run build
    cd ..
    
    print_status "Applications built successfully"
}

# Production deployment options
deployment_options() {
    echo
    print_info "Deployment Options:"
    echo "1. Railway (Recommended for beginners)"
    echo "2. Vercel + Supabase"
    echo "3. AWS (Professional setup)"
    echo "4. Docker deployment"
    echo "5. Skip deployment setup"
    echo
    
    read -p "Choose deployment option (1-5): " -n 1 -r
    echo
    
    case $REPLY in
        1)
            setup_railway
            ;;
        2)
            setup_vercel
            ;;
        3)
            setup_aws
            ;;
        4)
            setup_docker
            ;;
        5)
            print_info "Skipping deployment setup"
            ;;
        *)
            print_warning "Invalid option selected"
            ;;
    esac
}

# Railway deployment setup
setup_railway() {
    print_info "Setting up Railway deployment..."
    
    if ! command -v railway &> /dev/null; then
        print_warning "Railway CLI not found. Install it with: npm install -g @railway/cli"
        print_info "Then run: railway login && railway init"
    else
        print_status "Railway CLI found"
        print_info "Run 'railway deploy' in backend and frontend directories"
    fi
}

# Vercel deployment setup
setup_vercel() {
    print_info "Setting up Vercel deployment..."
    
    if ! command -v vercel &> /dev/null; then
        print_warning "Vercel CLI not found. Install it with: npm install -g vercel"
        print_info "Then run 'vercel' in the frontend directory"
    else
        print_status "Vercel CLI found"
        print_info "Run 'vercel --prod' in the frontend directory"
    fi
}

# AWS deployment setup
setup_aws() {
    print_info "Setting up AWS deployment..."
    print_warning "AWS deployment requires manual setup:"
    echo "1. Create AWS account and configure AWS CLI"
    echo "2. Set up RDS PostgreSQL database"
    echo "3. Deploy backend to ECS or Lambda"
    echo "4. Deploy frontend to S3 + CloudFront"
    echo "5. Configure Route 53 for custom domain"
    print_info "See DEPLOYMENT.md for detailed instructions"
}

# Docker deployment setup
setup_docker() {
    print_info "Setting up Docker deployment..."
    
    # Create Dockerfile for backend
    cat > backend/Dockerfile << EOF
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . .
RUN npm run build

EXPOSE 3007

CMD ["npm", "start"]
EOF

    # Create Dockerfile for frontend
    cat > frontend/Dockerfile << EOF
FROM node:18-alpine as builder

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/nginx.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
EOF

    # Create docker-compose.yml
    cat > docker-compose.yml << EOF
version: '3.8'

services:
  database:
    image: postgres:15
    environment:
      POSTGRES_DB: marina_glen_resort
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: password
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data

  backend:
    build: ./backend
    environment:
      NODE_ENV: production
      DATABASE_URL: postgresql://postgres:password@database:5432/marina_glen_resort
    ports:
      - "3007:3007"
    depends_on:
      - database

  frontend:
    build: ./frontend
    ports:
      - "80:80"
    depends_on:
      - backend

volumes:
  postgres_data:
EOF

    print_status "Docker files created"
    print_info "Run 'docker-compose up -d' to start all services"
}

# Main execution
main() {
    check_requirements
    install_dependencies
    setup_environment
    setup_database
    build_applications
    deployment_options
    
    echo
    print_status "Setup completed! 🎉"
    echo
    print_info "Next steps:"
    echo "1. Update environment variables in backend/.env"
    echo "2. Configure your database connection"
    echo "3. Set up payment processing (Stripe)"
    echo "4. Configure email settings"
    echo "5. Deploy to your chosen platform"
    echo
    print_info "For detailed instructions, see DEPLOYMENT.md"
    echo "For support, visit: https://github.com/your-repo/marina-glen-resort"
}

# Run main function
main "$@"