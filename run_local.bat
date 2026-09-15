@echo off
title AI Organizational Memory Platform - Local Runner
echo ==========================================================
echo  Launching AI Organizational Memory & Decision Intelligence
echo ==========================================================
echo.

REM Start Backend
echo [*] Starting Backend Server (FastAPI on port 8000)...
start "Backend - FastAPI" cmd /k "cd backend && python main.py"

REM Wait 2 seconds
timeout /t 2 /nobreak >nul

REM Start Frontend
echo [*] Starting Frontend (React + Vite on port 3000)...
start "Frontend - Vite" cmd /k "cd frontend && npm run dev"

REM Wait 3 seconds
timeout /t 3 /nobreak >nul

REM Open Browser
echo [*] Opening Web Demo in browser...
start http://localhost:3000

echo.
echo ==========================================================
echo  App is live!
echo  - Frontend: http://localhost:3000
echo  - Backend:  http://localhost:8000
echo  - Docs:     http://localhost:8000/docs
echo ==========================================================
echo.
pause
