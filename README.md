# Workflow Builder Lite

A production-ready full-stack automation engine where users can create, run, and manage text processing workflows using AI.

## Architecture Overview

```
workflow-builder/
├── server/                 # Backend (Node.js + Express)
│   ├── prisma/
│   │   └── schema.prisma   # Database schema
│   └── src/
│       ├── app.js          # Express application entry point
│       ├── controllers/    # Request handlers
│       ├── routes/         # API route definitions
│       ├── services/       # Business logic
│       └── utils/          # Utility functions
│
├── client/                 # Frontend (React + Vite)
│   ├── src/
│   │   ├── pages/          # Page components
│   │   ├── components/     # Reusable components
│   │   └── services/       # API client
│   └── index.html
│
└── docs/                   # Documentation
```

### Tech Stack

| Layer | Technology |
|-------|------------|
| Backend | Node.js + Express |
| Database | PostgreSQL |
| ORM | Prisma |
| Frontend | React (Vite) |
| LLM Provider | Google Gemini (Free Tier) |

## Features

- **Create Workflows**: Build workflows with 2-4 sequential processing steps
- **Run Workflows**: Execute workflows on input text with live progress
- **View Results**: See output of each step with execution times
- **Run History**: View last 5 workflow runs
- **Health Status**: Monitor server, database, and LLM connectivity

### Available Step Types

| Step Type | Description | Uses LLM |
|-----------|-------------|----------|
| `clean` | Remove extra whitespace, normalize text | No |
| `summarize` | Generate a concise summary | Yes |
| `extract_keypoints` | Extract key points as bullet list | Yes |
| `tag_category` | Assign category tags | Yes |
| `sentiment` | Analyze sentiment and tone | Yes |
| `generate_title` | Generate a descriptive title | Yes |

## Setup Instructions

### Prerequisites

- Node.js 18+ 
- PostgreSQL database (local or cloud like Neon)
- Google Gemini API key (free at https://aistudio.google.com/app/apikey)

### 1. Clone and Install Dependencies

```bash
# Install backend dependencies
cd server
npm install

# Install frontend dependencies
cd ../client
npm install
```

### 2. Configure Environment Variables

Copy the example environment file and fill in your values:

```bash
cd server
cp .env.example .env
```

Edit `.env`:

```env
DATABASE_URL="postgresql://user:password@host:5432/database?schema=public"
GEMINI_API_KEY="your-gemini-api-key"
PORT=3001
```

### 3. Set Up Database

```bash
cd server

# Generate Prisma client
npm run prisma:generate

# Run migrations (development)
npm run prisma:migrate

# Or push schema directly (production/Neon)
npm run prisma:push
```

### 4. Start the Application

**Development mode:**

```bash
# Terminal 1 - Backend
cd server
npm run dev

# Terminal 2 - Frontend
cd client
npm run dev
```

**Production mode:**

```bash
# Backend
cd server
npm start

# Frontend (build and serve)
cd client
npm run build
npm run preview
```

### 5. Access the Application

- Frontend: http://localhost:5173
- Backend API: http://localhost:3001/api

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/workflows` | Create a new workflow |
| `GET` | `/api/workflows` | Get all workflows |
| `GET` | `/api/workflows/:id` | Get a specific workflow |
| `DELETE` | `/api/workflows/:id` | Delete a workflow |
| `GET` | `/api/workflows/steps` | Get available step types |
| `POST` | `/api/run` | Execute a workflow |
| `GET` | `/api/runs` | Get run history (default limit: 5) |
| `GET` | `/api/runs/:id` | Get a specific run |
| `GET` | `/api/health` | Health check endpoint |

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `DATABASE_URL` | PostgreSQL connection string | Yes |
| `GEMINI_API_KEY` | Google Gemini API key (free) | Yes |
| `PORT` | Server port (default: 3001) | No |
| `NODE_ENV` | Environment (development/production) | No |

## What Is Implemented

- [x] Full workflow CRUD operations
- [x] 6 step types (1 non-LLM, 5 LLM-based)
- [x] Sequential workflow execution engine
- [x] Execution time tracking per step
- [x] Run history with last 5 runs
- [x] Health check endpoint (server, DB, LLM)
- [x] Input validation
- [x] Error handling
- [x] Clean React frontend with routing
- [x] Responsive UI design

## What Is NOT Implemented

- [ ] User authentication
- [ ] Workflow editing (only create/delete)
- [ ] Parallel step execution
- [ ] Workflow versioning
- [ ] Rate limiting
- [ ] Caching
- [ ] Unit/Integration tests
- [ ] Step retry logic
- [ ] Webhook notifications
- [ ] Export/Import workflows

## Deployment Notes

### Backend Deployment

Deploy the `server/` directory to any Node.js hosting:
- Render
- Railway
- Fly.io
- Heroku
- AWS/GCP/Azure

Set environment variables in the hosting dashboard.

### Frontend Deployment

Build and deploy the `client/` directory:

```bash
cd client
npm run build
```

Deploy the `dist/` folder to:
- Vercel
- Netlify
- Cloudflare Pages
- AWS S3 + CloudFront

**Important:** Update the Vite proxy config or set `VITE_API_URL` to point to your deployed backend.

### Database (Neon PostgreSQL)

1. Create a Neon project at https://neon.tech
2. Copy the connection string
3. Set `DATABASE_URL` in your backend environment
4. Run `npm run prisma:push` to sync schema

## License

MIT
