@echo off
title IPLH Monitoring System - Local Dev Launcher
echo ========================================================
echo   IPLH Monitoring System - Menjalankan Server Lokal
echo ========================================================
echo.

echo [1/2] Menjalankan Django Backend di http://localhost:8000 ...
start "Django Backend (Port 8000)" cmd /k "cd /d %~dp0backend && .\venv\Scripts\activate && python manage.py runserver 0.0.0.0:8000"

echo [2/2] Menjalankan Next.js Frontend di http://localhost:3000 ...
start "Next.js Frontend (Port 3000)" cmd /k "cd /d %~dp0frontend-nextjs && npm run dev"

echo.
echo ========================================================
echo   Selesai! Buka browser di: http://localhost:3000
echo ========================================================
pause

