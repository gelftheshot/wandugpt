#!/bin/bash

# DrinfinityAI Deployment Script
echo "🚀 Deploying What'sUp Doc AI..."

# Set deployment directory
DEPLOY_DIR="/opt/drinfinityai"

# Create directories
sudo mkdir -p $DEPLOY_DIR/{backend/{logs,llama.cpp/models},frontend/logs}

# Install system dependencies
echo "📦 Installing system dependencies..."
sudo apt update
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs python3 python3-pip nginx
sudo npm install -g pm2

# Install Python dependencies
echo "🐍 Installing Python dependencies..."
cd $DEPLOY_DIR/backend
pip3 install -r requirements.txt

# Install Node.js dependencies and build
echo "⚛️ Installing Node.js dependencies..."
cd $DEPLOY_DIR/frontend
npm install
npm run build

# Download model (if not exists)
MODEL_FILE="$DEPLOY_DIR/backend/llama.cpp/models/Mistral-7B-Instruct-v0.3.fp16.gguf"
if [ ! -f "$MODEL_FILE" ]; then
    echo "📥 Downloading AI model (4.1GB)..."
    cd $DEPLOY_DIR/backend/llama.cpp/models
    wget https://huggingface.co/TheBloke/Mistral-7B-Instruct-v0.3-GGUF/resolve/main/mistral-7b-instruct-v0.3.fp16.gguf -O Mistral-7B-Instruct-v0.3.fp16.gguf
fi

# Start services with PM2
echo "🔥 Starting services..."
cd $DEPLOY_DIR/backend && pm2 start ecosystem.config.js
cd $DEPLOY_DIR/frontend && pm2 start ecosystem.config.js

# Save PM2 configuration
pm2 save
pm2 startup

echo "✅ Deployment complete!"
echo "Backend: http://localhost:8000"
echo "Frontend: http://localhost:3000"
echo "Check status: pm2 status"