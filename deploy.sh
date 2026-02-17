#!/bin/bash

# Quick Deploy Script for Rectifier Monitoring Dashboard
# Usage: ./deploy.sh

set -e

echo "=========================================="
echo "Rectifier Monitoring - Quick Deploy"
echo "=========================================="
echo ""

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    echo "❌ Docker not found. Please install Docker first."
    exit 1
fi

# Check if Docker Compose is installed
if ! command -v docker-compose &> /dev/null; then
    echo "❌ Docker Compose not found. Please install Docker Compose first."
    exit 1
fi

# Check if .env exists
if [ ! -f "backend/.env" ]; then
    echo "⚠️  backend/.env not found. Creating from example..."
    cp backend/.env.example backend/.env
    echo "📝 Please edit backend/.env with your configuration"
    echo "   Then run this script again."
    exit 1
fi

if [ ! -f "frontend-nextjs/.env.production" ]; then
    echo "⚠️  frontend/.env.production not found. Creating..."
    echo "NEXT_PUBLIC_API_URL=http://localhost/api" > frontend-nextjs/.env.production
fi

echo "✓ Configuration files found"
echo ""

# Build images
echo "🔨 Building Docker images..."
docker-compose build

echo ""
echo "🚀 Starting services..."
docker-compose up -d

echo ""
echo "⏳ Waiting for services to be ready..."
sleep 10

# Run migrations
echo ""
echo "📊 Running database migrations..."
docker-compose exec -T backend python manage.py migrate

echo ""
echo "📁 Collecting static files..."
docker-compose exec -T backend python manage.py collectstatic --noinput

echo ""
echo "=========================================="
echo "✅ Deployment Complete!"
echo "=========================================="
echo ""
echo "Services are running:"
docker-compose ps

echo ""
echo "🌐 Access your dashboard:"
echo "   Frontend: http://your-domain.com"
echo "   API:      http://your-domain.com/api/"
echo "   Admin:    http://your-domain.com/admin/"
echo ""
echo "📝 Next steps:"
echo "   1. Create superuser: docker-compose exec backend python manage.py createsuperuser"
echo "   2. Setup SSL: See DEPLOYMENT.md for Let's Encrypt setup"
echo "   3. Configure domain in nginx/conf.d/default.conf"
echo ""
echo "📋 Useful commands:"
echo "   View logs:    docker-compose logs -f"
echo "   Stop all:     docker-compose down"
echo "   Restart:      docker-compose restart"
echo ""
