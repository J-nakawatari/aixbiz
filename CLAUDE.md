# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**AI導入ナビゲーター (AI Implementation Navigator)** - A diagnostic service for small and medium-sized businesses to leverage generative AI like ChatGPT for business improvement.

- **Domain**: aixbiz.jp
- **Target Users**: Small/medium businesses lacking AI knowledge
- **Purpose**: Provide AI utilization proposals without system development

## Essential Commands

### Frontend (Next.js)
```bash
cd frontend
npm run dev          # Development server on port 3000
npm run build        # Build for production
npm run start        # Production server on port 3004
npm run lint         # Run linter
```

### Backend (Express/TypeScript)
```bash
cd backend
npm run dev          # Development with nodemon
npm run build        # Compile TypeScript
npm run start        # Production server
npm run lint         # TypeScript type checking
```

### Deployment
```bash
git push origin main  # Triggers webhook auto-deployment
```

## Architecture

### Tech Stack
- **Frontend**: Next.js 15 (App Router), Tailwind CSS, Radix UI
- **Backend**: Express 5, TypeScript, MongoDB (mongoose)
- **Infrastructure**: Xserver VPS, Nginx, PM2, Let's Encrypt SSL
- **External APIs**: OpenAI GPT API (planned)

### Port Configuration
- **Production**:
  - 3004: Next.js (internal)
  - 4004: Express API (internal)
  - 27020: MongoDB (internal)
- **Development**:
  - 3000: Next.js
  - 4000: Express API
  - 27017: MongoDB

### Project Structure
```
aixbiz/
├── frontend/
│   ├── app/              # Next.js app router
│   ├── components/lp/    # Landing page components
│   └── components/ui/    # Reusable UI components
├── backend/
│   └── src/
│       ├── controllers/  # Route handlers
│       ├── models/       # MongoDB schemas
│       └── routes/       # API endpoints
└── docs/                 # Technical documentation (gitignored)
```

## Current Implementation Status

### Completed
- Landing page UI components
- Basic Express server setup
- Nginx configuration with SSL
- Auto-deployment via GitHub webhooks
- Git hooks for automatic builds

### Not Yet Implemented
- API endpoints for report generation
- MongoDB models and schemas
- OpenAI API integration
- Form validation and submission
- PDF report generation
- Admin panel
- Rate limiting implementation

## Key API Endpoints (Planned)

```
POST /api/report/generate
  - Generate AI utilization report
  - Input: industry, challenges, company size
  - Output: recommendations, prompt examples

POST /api/prompt/generate
  - Generate ChatGPT prompts for specific tasks
  - Free tier: 1 per day per IP
```

## Security Considerations
- Environment variables in .env files (never commit)
- CORS configured for aixbiz.jp only
- Rate limiting prepared but not implemented
- Input validation required on all forms
- reCAPTCHA v3 planned for forms

## Important Notes
- docs/ directory contains sensitive configuration files and is gitignored
- The service provides proposals only - no system development or implementation
- Frontend runs on port 3004 in production (not 3000)
- MongoDB uses custom port 27020 (not default 27017)
- All internal ports are blocked from external access