#!/bin/bash

echo "🚀 Setting up Organizational Memory Platform..."
echo ""

# Check for required commands
command -v docker &> /dev/null || { echo "❌ Docker is not installed. Please install Docker first."; exit 1; }
command -v docker-compose &> /dev/null || { echo "❌ Docker Compose is not installed. Please install Docker Compose first."; exit 1; }

echo "✅ Docker and Docker Compose found"
echo ""

# Check for .env file
if [ ! -f backend/.env ]; then
    echo "📝 Creating backend/.env from template..."
    cp backend/.env.example backend/.env
    echo "⚠️  Please edit backend/.env and add your OPENAI_API_KEY"
else
    echo "✅ backend/.env exists"
fi

echo ""
echo "🐳 Starting Docker containers..."
docker-compose up -d

echo ""
echo "⏳ Waiting for services to be ready..."
sleep 5

# Check if services are running
if docker-compose ps | grep -q "Up"; then
    echo "✅ Services are running!"
    echo ""
    echo "📋 Access points:"
    echo "   Frontend: http://localhost:3000"
    echo "   Backend:  http://localhost:8000"
    echo "   API Docs: http://localhost:8000/docs"
    echo ""
    echo "📖 Quick start:"
    echo "   1. Open http://localhost:3000 in your browser"
    echo "   2. Create a new decision"
    echo "   3. Try the AI extraction feature"
    echo ""
    echo "🛑 To stop: docker-compose down"
else
    echo "❌ Failed to start services. Check logs with: docker-compose logs"
    exit 1
fi
