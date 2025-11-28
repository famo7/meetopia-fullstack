#!/bin/bash

# ===========================================
# Meetopia Deployment Script
# ===========================================
# Usage: ./deploy.sh [command]
# Commands: setup, deploy, update, logs, stop, restart

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Configuration
APP_DIR="/opt/meetopia"
REPO_URL="https://github.com/famo7/meetopia-fullstack.git"  # Update with your repo URL

print_status() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARN]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Initial server setup
setup() {
    print_status "Starting initial server setup..."
    
    # Update system
    sudo apt update && sudo apt upgrade -y
    
    # Install Docker if not present
    if ! command -v docker &> /dev/null; then
        print_status "Installing Docker..."
        curl -fsSL https://get.docker.com -o get-docker.sh
        sudo sh get-docker.sh
        sudo usermod -aG docker $USER
        rm get-docker.sh
    fi
    
    # Install Docker Compose plugin if not present
    if ! docker compose version &> /dev/null; then
        print_status "Installing Docker Compose..."
        sudo apt install docker-compose-plugin -y
    fi
    
    # Install Nginx
    if ! command -v nginx &> /dev/null; then
        print_status "Installing Nginx..."
        sudo apt install nginx -y
    fi
    
    # Install Certbot
    if ! command -v certbot &> /dev/null; then
        print_status "Installing Certbot..."
        sudo apt install certbot python3-certbot-nginx -y
    fi
    
    # Create app directory
    sudo mkdir -p $APP_DIR
    sudo chown $USER:$USER $APP_DIR
    
    print_status "Setup complete! Please run: newgrp docker (or log out and back in)"
}

# Deploy application
deploy() {
    print_status "Deploying application..."
    
    cd $APP_DIR
    
    # Check if .env.prod exists
    if [ ! -f ".env.prod" ]; then
        print_error ".env.prod file not found!"
        print_warning "Copy .env.prod.example to .env.prod and configure it"
        exit 1
    fi
    
    # Pull latest changes if git repo exists
    if [ -d ".git" ]; then
        print_status "Pulling latest changes..."
        git pull origin master
    fi
    
    # Build and start containers
    print_status "Building and starting containers..."
    docker compose -f docker-compose.prod.yml --env-file .env.prod up -d --build
    
    # Run database migrations
    print_status "Running database migrations..."
    sleep 10  # Wait for database to be ready
    docker compose -f docker-compose.prod.yml exec backend npx prisma migrate deploy
    
    print_status "Deployment complete!"
}

# Update application (faster than full deploy)
update() {
    print_status "Updating application..."
    
    cd $APP_DIR
    
    # Pull latest changes
    git pull origin master
    
    # Rebuild and restart
    docker compose -f docker-compose.prod.yml --env-file .env.prod up -d --build
    
    # Run migrations
    sleep 5
    docker compose -f docker-compose.prod.yml exec backend npx prisma migrate deploy
    
    print_status "Update complete!"
}

# View logs
logs() {
    cd $APP_DIR
    docker compose -f docker-compose.prod.yml logs -f
}

# Stop application
stop() {
    print_status "Stopping application..."
    cd $APP_DIR
    docker compose -f docker-compose.prod.yml down
    print_status "Application stopped!"
}

# Restart application
restart() {
    print_status "Restarting application..."
    cd $APP_DIR
    docker compose -f docker-compose.prod.yml restart
    print_status "Application restarted!"
}

# SSL setup
ssl() {
    print_status "Setting up SSL certificates..."
    
    # Replace with your actual domain
    read -p "Enter your main domain (e.g., meetopia.com): " DOMAIN
    read -p "Enter your email for SSL notifications: " EMAIL
    
    # Get SSL certificates
    sudo certbot --nginx -d $DOMAIN -d www.$DOMAIN -d api.$DOMAIN --email $EMAIL --agree-tos --no-eff-email
    
    print_status "SSL setup complete!"
}

# Database backup
backup() {
    print_status "Creating database backup..."
    cd $APP_DIR
    
    BACKUP_FILE="backup_$(date +%Y%m%d_%H%M%S).sql"
    docker compose -f docker-compose.prod.yml exec -T postgres pg_dump -U meetopia_user meetopiadb > "backups/$BACKUP_FILE"
    
    print_status "Backup created: backups/$BACKUP_FILE"
}

# Show help
help() {
    echo "Meetopia Deployment Script"
    echo ""
    echo "Usage: ./deploy.sh [command]"
    echo ""
    echo "Commands:"
    echo "  setup    - Initial server setup (install Docker, Nginx, etc.)"
    echo "  deploy   - Full deployment (build and start all services)"
    echo "  update   - Quick update (pull changes and rebuild)"
    echo "  logs     - View application logs"
    echo "  stop     - Stop all services"
    echo "  restart  - Restart all services"
    echo "  ssl      - Setup SSL certificates with Certbot"
    echo "  backup   - Create database backup"
    echo "  help     - Show this help message"
}

# Main
case "$1" in
    setup)
        setup
        ;;
    deploy)
        deploy
        ;;
    update)
        update
        ;;
    logs)
        logs
        ;;
    stop)
        stop
        ;;
    restart)
        restart
        ;;
    ssl)
        ssl
        ;;
    backup)
        backup
        ;;
    help|*)
        help
        ;;
esac
