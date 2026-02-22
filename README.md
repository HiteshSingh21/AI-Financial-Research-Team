# 🤖 AI Financial Research Team

> **An AI-powered financial analysis platform** built with a multi-agent research team.
> Ask about any stock and receive a comprehensive investment report covering technical indicators, fundamental analysis from SEC filings, and real-time news sentiment — all synthesized into a single Buy/Sell/Hold verdict.

[![CI](https://github.com/HiteshSingh21/AI-Financial-Research-Team/actions/workflows/ci.yml/badge.svg)](https://github.com/HiteshSingh21/AI-Financial-Research-Team/actions/workflows/ci.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)
[![Python 3.11+](https://img.shields.io/badge/Python-3.11+-blue.svg)](https://www.python.org/)
[![Next.js 14](https://img.shields.io/badge/Next.js-14-black.svg)](https://nextjs.org/)

---

## 📐 Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    Frontend (Next.js 14)                     │
│   Command Center · Knowledge Vault · Archive · Settings     │
└─────────────────────────┬───────────────────────────────────┘
                          │  REST API (Axios)
┌─────────────────────────▼───────────────────────────────────┐
│                    Backend (FastAPI)                         │
│  ┌──────────────┐                                           │
│  │  Supervisor   │──────────────────────────────┐           │
│  └──────┬───────┘                               │           │
│    ┌────┼──────────────┐                        │           │
│    ▼         ▼              ▼                   ▼           │
│ Librarian   Quant       Journalist         Aggregator       │
│ (MCP)      (MCP)        (DuckDuckGo)      (Synthesis)       │
│   │         │                                               │
│   ▼         ▼                                               │
│ ┌───────────────┐                                           │
│ │ FastMCP Server│  <-- Strict JSON Schema Validation        │
│ └──────┬────────┘                                           │
│        ▼                                                    │
│ Services: finance_api · rag_service · search_tool           │
└─────────────────────────┬───────────────────────────────────┘
                          │
                ┌─────────▼───────────┐
                │  PostgreSQL / SQLite │
                └─────────────────────┘
```

### How It Works

1. You type a query like **"Analyze NVDA stock"** in the chat interface.
2. The **Supervisor Agent** receives the request and delegates to specialists:
   - 📚 **Librarian** — Searches your uploaded SEC filings (10-K, 10-Q) using RAG (FAISS + Gemini Embeddings)
   - 📊 **Quant** — Fetches live price data from Yahoo Finance, computes RSI, MACD, SMA, EMA
   - 📰 **Journalist** — Scans the web for recent news headlines and determines market sentiment
3. The **Aggregator** receives all findings and synthesizes a final Investment Report with a **Buy/Sell/Hold** verdict.
4. The report is saved to the database and displayed in the chat with Markdown rendering.

### Agent Roles

| Agent | Role | Tools Used |
|-------|------|-----------|
| **Supervisor** | Lead Financial Strategist | Delegates to all specialists |
| **Librarian** | Fundamental Analyst | RAG search over uploaded 10-K/10-Q PDFs |
| **Quant** | Technical Analyst | RSI, MACD, SMA, EMA via yfinance + ta library |
| **Journalist** | Sentiment Analyst | News search via Tavily or DuckDuckGo |
| **Aggregator** | Report Synthesizer | Combines all findings into a final report |

---

## �️ Features

- **Multi-Agent Analysis** — 5 AI agents collaborate to produce comprehensive investment reports
- **RAG Pipeline** — Upload PDF filings, auto-chunk, embed with Gemini, index with FAISS for semantic search
- **Technical Indicators** — RSI (14-day), MACD, SMA (20/50), EMA (20) with human-readable interpretations
- **News Sentiment** — Real-time news search with Tavily (premium) or DuckDuckGo (free fallback)
- **Chat Interface** — Markdown rendering, syntax highlighting, copy-to-clipboard, PDF export
- **Knowledge Vault** — Drag-and-drop PDF management with ingestion status tracking
- **Intelligence Archive** — Searchable history of all past analysis reports
- **Live Settings Dashboard** — Real-time system health with auto-refresh (agent status, DB, RAG, API keys)
- **Docker Ready** — Full containerized deployment with PostgreSQL, multi-stage builds, non-root users

---

## 🚀 Getting Started

### Prerequisites

- **Python 3.11+**
- **Node.js 18+** and **npm**
- **Git**
- **API Key**: [Google Gemini](https://aistudio.google.com/apikey) (required)
- *Optional*: [Tavily](https://tavily.com/) API key for improved news search
- *Optional*: **Docker & Docker Compose** for containerized deployment

---

### Option 1: Local Development (Recommended for first-time setup)

#### Step 1 — Clone the Repository

```bash
git clone https://github.com/HiteshSingh21/AI-Financial-Research-Team.git
cd AI-Financial-Research-Team
```

#### Step 2 — Configure Environment Variables

```bash
cp .env.example .env
```

Open `.env` in a text editor and add your API key:
```env
# ── Required ──
GEMINI_API_KEY=your-gemini-api-key-here

# ── Optional ──
TAVILY_API_KEY=your-tavily-api-key-here
```

#### Step 3 — Start the Backend

```bash
cd backend

# Create a virtual environment
python -m venv .venv

# Activate it
.venv\Scripts\activate        # Windows (Command Prompt)
.venv\Scripts\Activate.ps1    # Windows (PowerShell)
source .venv/bin/activate     # macOS / Linux

# Install dependencies
pip install -r requirements.txt

# Start the server
python -m app.main
```

The backend will start on **http://localhost:8000**. You should see:
```
INFO:     Uvicorn running on http://0.0.0.0:8000
```

#### Step 4 — Start the Frontend (New Terminal)

```bash
cd frontend

# Install dependencies
npm install

# Start the dev server
npm run dev
```

The frontend will start on **http://localhost:3000**.

#### Step 5 — Open the App

Navigate to **http://localhost:3000** in your browser. You're ready to go! 🎉

---

### Option 2: Docker Compose (One-command deployment)

```bash
# 1. Configure environment
cp .env.example .env
# Edit .env and add your GEMINI_API_KEY

# 2. Build and start all services
docker compose up --build
```

This starts three containers:
| Service | Port | Description |
|---------|------|-------------|
| **PostgreSQL** | 5432 | Database (with health checks) |
| **Backend** | 8000 | FastAPI server |
| **Frontend** | 3000 | Next.js application |

Open **http://localhost:3000** to use the app.

To stop: `docker compose down`
To stop and remove data: `docker compose down -v`

---

## 🔧 Environment Variables

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `GEMINI_API_KEY` | ✅ Yes | — | Google Gemini API key ([get one here](https://aistudio.google.com/apikey)) |
| `TAVILY_API_KEY` | ❌ No | — | Tavily search API key (falls back to DuckDuckGo if not set) |
| `DATABASE_URL` | ❌ No | `sqlite:///./financial_analyst.db` | Database connection string |
| `POSTGRES_USER` | ❌ No | `financial_ai` | Docker Postgres username |
| `POSTGRES_PASSWORD` | ❌ No | `financial_ai_pass` | Docker Postgres password |
| `GEMINI_MODEL` | ❌ No | `gemini-1.5-flash` | Which Gemini model to use |
| `FRONTEND_URL` | ❌ No | `http://localhost:3000` | Frontend URL for CORS (production) |

---

## 📡 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/health` | Quick health probe for Docker/CI |
| `GET` | `/api/v1/status` | Detailed system status (agents, DB, RAG, uptime) |
| `POST` | `/api/v1/analyze` | Run multi-agent stock analysis (`query` + `user_id` params) |
| `POST` | `/api/v1/ingest` | Upload a PDF for RAG ingestion (multipart file upload) |
| `GET` | `/api/v1/history/{user_id}` | Retrieve analysis history for a user |

---

## 📁 Project Structure

```
AI-Financial-Research-Team/
│
├── backend/                          # Python FastAPI backend
│   ├── app/
│   │   ├── __init__.py               # Package init
│   │   ├── main.py                   # FastAPI app, CORS, health/status endpoints
│   │   ├── agents/                   # AI Agent definitions (Agno + Gemini)
│   │   │   ├── __init__.py
│   │   │   ├── supervisor.py         # Lead Strategist — orchestrates all agents
│   │   │   ├── librarian.py          # Fundamental Analyst — RAG search over PDFs
│   │   │   ├── quant.py              # Technical Analyst — RSI, MACD, SMA, EMA
│   │   │   ├── journalist.py         # Sentiment Analyst — news search
│   │   │   └── aggregator.py         # Report Synthesizer — final Buy/Sell/Hold
│   │   ├── api/
│   │   │   ├── __init__.py
│   │   │   ├── dependencies.py       # FastAPI dependency injection (DB sessions)
│   │   │   └── v1/
│   │   │       ├── __init__.py
│   │   │       └── endpoints.py      # REST endpoints: analyze, ingest, history
│   │   ├── core/
│   │   │   ├── __init__.py           # Re-exports settings and get_logger
│   │   │   ├── config.py             # Pydantic Settings (env vars, defaults)
│   │   │   └── logging.py            # Centralized logging factory
│   │   ├── db/
│   │   │   ├── __init__.py
│   │   │   ├── models.py             # SQLModel tables: ChatHistory, AnalysisReport
│   │   │   └── session.py            # Engine creation, session management
│   │   └── services/
│   │       ├── __init__.py
│   │       ├── finance_api.py        # yfinance wrapper: prices, company info, technicals
│   │       ├── rag_service.py        # PDF ingestion → chunking → embedding → FAISS
│   │       └── search_tool.py        # News search: Tavily (premium) / DuckDuckGo (free)
│   ├── tests/
│   │   ├── __init__.py
│   │   ├── conftest.py               # Pytest fixtures (in-memory DB, test client)
│   │   ├── requirements-test.txt     # Test dependencies (pytest, httpx)
│   │   ├── test_api.py               # API endpoint tests (health, analyze, ingest, history)
│   │   ├── test_config.py            # Config, DB, and logger tests
│   │   └── test_services.py          # Service tests (FinanceAPI, RAG, Search)
│   ├── scripts/                      # Utility scripts
│   ├── Dockerfile                    # Python 3.11-slim, non-root user
│   ├── .dockerignore
│   └── requirements.txt              # Python dependencies
│
├── frontend/                         # Next.js 14 frontend
│   ├── src/
│   │   ├── app/
│   │   │   ├── globals.css           # Tailwind + custom dark theme (mint accents)
│   │   │   ├── layout.tsx            # Root layout: Inter font, Providers, Sidebar
│   │   │   ├── page.tsx              # Command Center — main chat interface
│   │   │   ├── history/page.tsx      # Intelligence Archive — past analyses
│   │   │   ├── knowledge-vault/page.tsx  # Knowledge Vault — PDF upload/management
│   │   │   └── settings/page.tsx     # Settings — live system health dashboard
│   │   ├── components/
│   │   │   ├── sidebar.tsx           # Navigation sidebar with links
│   │   │   ├── toaster.tsx           # Toast notification provider
│   │   │   └── ui/                   # Shadcn/UI primitives (11 components)
│   │   │       ├── badge.tsx
│   │   │       ├── button.tsx
│   │   │       ├── dialog.tsx
│   │   │       ├── dropdown-menu.tsx
│   │   │       ├── input.tsx
│   │   │       ├── progress.tsx
│   │   │       ├── scroll-area.tsx
│   │   │       ├── separator.tsx
│   │   │       ├── skeleton.tsx
│   │   │       ├── tabs.tsx
│   │   │       └── toast.tsx
│   │   └── lib/
│   │       ├── api.ts                # Axios client + typed API functions
│   │       ├── hooks.ts              # React Query hooks (useAnalyze, useHistory, etc.)
│   │       ├── providers.tsx         # QueryClientProvider (singleton pattern)
│   │       └── utils.ts              # Utility functions (cn, getUserId)
│   ├── public/                       # Static assets
│   ├── Dockerfile                    # 3-stage multi-stage build, non-root user
│   ├── .dockerignore
│   ├── .eslintrc.json                # ESLint config (next/core-web-vitals)
│   ├── next.config.js                # Next.js config (standalone output)
│   ├── tailwind.config.ts            # Tailwind config with custom theme
│   ├── tsconfig.json                 # TypeScript strict mode, path aliases
│   ├── postcss.config.js
│   ├── package.json
│   └── package-lock.json
│
├── data/
│   ├── faiss_index/                  # Persisted FAISS vector index (auto-created)
│   └── raw_pdfs/                     # Uploaded PDF documents (auto-created)
│
├── .github/
│   └── workflows/
│       └── ci.yml                    # CI pipeline: lint, test, build, Docker
│
├── .env.example                      # Template for environment variables
├── .gitignore                        # Git ignore rules
├── docker-compose.yml                # 3-service Docker Compose (Postgres, backend, frontend)
├── LICENSE                           # MIT License
├── README.md                         # This file
└── walkthrough.md                    # Detailed project walkthrough
```

---

## 🧪 Testing

### Backend Tests (15 tests)

```bash
cd backend

# Install test dependencies
pip install -r tests/requirements-test.txt

# Run all tests
pytest tests/ -v
```

Tests cover:
- **API endpoints** — health, analyze (mocked), ingest (mocked), history
- **Services** — FinanceAPI (live data), RAG (chunking, search), SearchTool (mocked)
- **Configuration** — settings loading, database init, model CRUD, logger

### Frontend Checks

```bash
cd frontend

# Type checking
npx tsc --noEmit

# Linting
npx next lint

# Production build
npm run build
```

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| **LLM** | Google Gemini 1.5 Flash via [Agno](https://github.com/agno-agi/agno) framework |
| **Backend** | FastAPI, Python 3.11, SQLModel, Pydantic Settings |
| **Tool Execution** | Model Context Protocol (FastMCP) for standardized secure tool calling |
| **Finance Data** | yfinance, ta (Technical Analysis library) |
| **RAG Pipeline** | PyPDF2 → Text Chunking → Gemini Embeddings → FAISS |
| **Web Search** | Tavily (premium) / DuckDuckGo (free fallback) |
| **Frontend** | Next.js 14, React 18, TypeScript |
| **Styling** | Tailwind CSS, Shadcn/UI, Framer Motion |
| **State Management** | React Query (TanStack Query v5) |
| **HTTP Client** | Axios |
| **Database** | SQLite (development) / PostgreSQL 15 (Docker/production) |
| **Containers** | Docker with multi-stage builds, Docker Compose |
| **CI/CD** | GitHub Actions (3-job pipeline: lint+test, build, Docker) |

---

## 📄 License

MIT License. See [LICENSE](LICENSE) for details.
