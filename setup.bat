@echo off
echo =====================================
echo Rectifier Monitoring Dashboard Setup
echo =====================================
echo.

REM Check if Python is installed
python --version >nul 2>&1
if errorlevel 1 (
    echo Error: Python is not installed!
    echo Please install Python 3.8 or higher
    pause
    exit /b 1
)

REM Check if Node.js is installed
node --version >nul 2>&1
if errorlevel 1 (
    echo Error: Node.js is not installed!
    echo Please install Node.js 16 or higher
    pause
    exit /b 1
)

REM Backend setup
echo Setting up Backend...
cd backend

if not exist "venv" (
    echo Creating virtual environment...
    python -m venv venv
)

echo Activating virtual environment...
call venv\Scripts\activate.bat

echo Installing Python dependencies...
pip install -q -r requirements.txt

echo Running migrations...
python manage.py makemigrations --noinput
python manage.py migrate --noinput

echo.
echo Backend setup complete!
echo.

REM Frontend setup
echo Setting up Frontend...
cd ..\frontend

if not exist "node_modules" (
    echo Installing Node dependencies...
    npm install
)

echo.
echo Frontend setup complete!
echo.

REM Instructions
echo =====================================
echo Setup Complete! 🎉
echo =====================================
echo.
echo To start the application:
echo.
echo 1. Start Redis (download from https://redis.io/download)
echo.
echo 2. Start Backend (Command Prompt 1):
echo    cd backend
echo    venv\Scripts\activate
echo    python manage.py runserver
echo.
echo 3. Start Frontend (Command Prompt 2):
echo    cd frontend
echo    npm run dev
echo.
echo 4. Test with MQTT (Command Prompt 3 - optional):
echo    python mqtt_test_publisher.py
echo.
echo Then open: http://localhost:5173
echo.

pause
