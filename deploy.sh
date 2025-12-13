#!/bin/bash

# DrinfinityAI Deployment Script
echo "🚀 Deploying Dr. Infinity AI..."

# Set deployment directory
DEPLOY_DIR="/opt/drinfinityai"

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Create directories
echo "📁 Creating directories..."
sudo mkdir -p $DEPLOY_DIR/{backend/{logs,llama.cpp/models},frontend/logs}

# Install system dependencies
echo -e "${YELLOW}📦 Installing system dependencies...${NC}"
sudo apt update
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs python3 python3-pip python3-venv nginx
sudo npm install -g pm2

# Setup Python virtual environment
echo -e "${YELLOW}🐍 Setting up Python virtual environment...${NC}"
cd $DEPLOY_DIR/backend
if [ ! -d "venv" ]; then
    python3 -m venv venv
fi
source venv/bin/activate
pip install --upgrade pip
pip install -r requirements.txt
deactivate

# Install Node.js dependencies and build
echo -e "${YELLOW}⚛️ Building frontend...${NC}"
cd $DEPLOY_DIR/frontend
npm install
npm run build

# Check if model exists
MODEL_FILE="$DEPLOY_DIR/backend/llama.cpp/models/BioMistral-7B.Q4_K_M.gguf"
if [ ! -f "$MODEL_FILE" ]; then
    echo -e "${YELLOW}📥 Downloading BioMistral model (4.4GB)...${NC}"
    cd $DEPLOY_DIR/backend/llama.cpp/models
    wget https://huggingface.co/MaziyarPanahi/BioMistral-7B-GGUF/resolve/main/BioMistral-7B.Q4_K_M.gguf -O BioMistral-7B.Q4_K_M.gguf
fi

# Stop existing PM2 processes
echo -e "${YELLOW}🛑 Stopping existing services...${NC}"
pm2 delete drinfinity-ai-backend drinfinity-ai-frontend 2>/dev/null || true

# Start services with unified PM2 config
echo -e "${YELLOW}🔥 Starting services with PM2...${NC}"
cd $DEPLOY_DIR
pm2 start ecosystem.config.js

# Save PM2 configuration
pm2 save

# Setup PM2 to start on boot (run the generated command)
echo -e "${YELLOW}⚙️  Setting up PM2 startup...${NC}"
sudo env PATH=$PATH:/usr/bin /usr/lib/node_modules/pm2/bin/pm2 startup systemd -u $USER --hp $HOME

echo ""
echo -e "${GREEN}✅ Deployment complete!${NC}"
echo ""
echo "📊 Service Status:"
pm2 status
echo ""
echo -e "${YELLOW}📝 Next steps:${NC}"
echo "   1. Configure SSL certificate (if not done)"
echo "   2. Restart Nginx: sudo systemctl restart nginx"
echo "   3. Check logs: pm2 logs"
echo ""
echo -e "${GREEN}🌐 Your application:${NC}"
echo "   Backend API: http://localhost:8000"
echo "   Backend Health: http://localhost:8000/health"
echo "   Frontend: http://localhost:3000"
echo "   Public URL: https://ai.drinfinityai.com"
echo ""
echo -e "${YELLOW}🔧 Useful PM2 commands:${NC}"
echo "   pm2 status              - Check all services"
echo "   pm2 logs                - View all logs"
echo "   pm2 logs backend        - View backend logs only"
echo "   pm2 logs frontend       - View frontend logs only"
echo "   pm2 restart all         - Restart all services"
echo "   pm2 stop all            - Stop all services"
echo "   pm2 monit               - Monitor resources"