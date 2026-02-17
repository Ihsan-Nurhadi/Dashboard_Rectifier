#!/bin/bash

echo "====================================="
echo "Rectifier Monitoring Dashboard Setup"
echo "====================================="
echo ""

# Check if Redis is running
echo "Checking Redis..."
if ! redis-cli ping > /dev/null 2>&1; then
    echo "❌ Redis is not running!"
    echo "Please start Redis with: redis-server"
    exit 1
fi
echo "✓ Redis is running"
echo ""

# Backend setup
echo "Setting up Backend..."
cd backend

if [ ! -d "venv" ]; then
    echo "Creating virtual environment..."
    python3 -m venv venv
fi

echo "Activating virtual environment..."
source venv/bin/activate

echo "Installing Python dependencies..."
pip install -q -r requirements.txt

echo "Running migrations..."
python manage.py makemigrations --noinput
python manage.py migrate --noinput

echo ""
echo "✓ Backend setup complete!"
echo ""

# Frontend setup
echo "Setting up Frontend..."
cd ../frontend

if [ ! -d "node_modules" ]; then
    echo "Installing Node dependencies..."
    npm install
fi

echo ""
echo "✓ Frontend setup complete!"
echo ""

# Instructions
echo "====================================="
echo "Setup Complete! 🎉"
echo "====================================="
echo ""
echo "To start the application:"
echo ""
echo "1. Start Backend (terminal 1):"
echo "   cd backend"
echo "   source venv/bin/activate"
echo "   python manage.py runserver"
echo ""
echo "2. Start Frontend (terminal 2):"
echo "   cd frontend"
echo "   npm run dev"
echo ""
echo "3. Test with MQTT (terminal 3 - optional):"
echo "   python mqtt_test_publisher.py"
echo ""
echo "Then open: http://localhost:5173"
echo ""
