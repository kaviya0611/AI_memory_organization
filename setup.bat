@echo off
echo 🚀 Setting up Organizational Memory Platform...
echo.

REM Check for Docker
docker --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Docker is not installed. Please install Docker Desktop first.
    exit /b 1
)

echo ✅ Docker found
echo.

REM Check for .env file
if not exist backend\.env (
    echo 📝 Creating backend\.env from template...
    copy backend\.env.example backend\.env
    echo ⚠️  Please edit backend\.env and add your OPENAI_API_KEY
) else (
    echo ✅ backend\.env exists
)

echo.
echo 🐳 Starting Docker containers...
docker-compose up -d

echo.
echo ⏳ Waiting for services to be ready...
timeout /t 5 /nobreak

echo.
echo ✅ Services are starting!
echo.
echo 📋 Access points:
echo    Frontend: http://localhost:3000
echo    Backend:  http://localhost:8000
echo    API Docs: http://localhost:8000/docs
echo.
echo 📖 Quick start:
echo    1. Open http://localhost:3000 in your browser
echo    2. Create a new decision
echo    3. Try the AI extraction feature
echo.
echo 🛑 To stop: docker-compose down
