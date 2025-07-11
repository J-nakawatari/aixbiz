#!/bin/bash

# 色付きのメッセージ
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${YELLOW}Starting deployment process...${NC}"

# Git pull
echo -e "${GREEN}[1/6] Pulling latest changes from git...${NC}"
git pull origin main
if [ $? -ne 0 ]; then
    echo -e "${RED}Git pull failed!${NC}"
    exit 1
fi

# Frontend
echo -e "${GREEN}[2/6] Installing frontend dependencies...${NC}"
cd frontend
npm install
if [ $? -ne 0 ]; then
    echo -e "${RED}Frontend npm install failed!${NC}"
    exit 1
fi

echo -e "${GREEN}[3/6] Building frontend...${NC}"
npm run build
if [ $? -ne 0 ]; then
    echo -e "${RED}Frontend build failed!${NC}"
    exit 1
fi

# Backend
echo -e "${GREEN}[4/6] Installing backend dependencies...${NC}"
cd ../backend
npm install
if [ $? -ne 0 ]; then
    echo -e "${RED}Backend npm install failed!${NC}"
    exit 1
fi

echo -e "${GREEN}[5/6] Building backend...${NC}"
npm run build
if [ $? -ne 0 ]; then
    echo -e "${RED}Backend build failed!${NC}"
    exit 1
fi

# PM2でアプリケーション再起動
echo -e "${GREEN}[6/6] Restarting applications with PM2...${NC}"
cd ..

# PM2が起動しているか確認
if pm2 list | grep -q "aixbiz-frontend\|aixbiz-backend"; then
    # 既存のプロセスを再起動
    pm2 restart aixbiz-frontend aixbiz-backend
else
    # 新規でプロセスを起動
    cd frontend
    pm2 start npm --name "aixbiz-frontend" -- start
    cd ../backend
    pm2 start npm --name "aixbiz-backend" -- start
    cd ..
fi

# PM2の設定を保存
pm2 save

echo -e "${GREEN}Deployment completed successfully!${NC}"
echo -e "${YELLOW}Current PM2 processes:${NC}"
pm2 list