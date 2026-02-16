# 🤖 Financial Intelligence Suite

> **AI-powered financial analysis platform** using a multi-agent research team.
> Technical, fundamental, and sentiment analysis in one unified dashboard.

---

## 📐 Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    Frontend (Next.js)                    │
│  Command Center · Knowledge Vault · Archive · Settings  │
└───────────────────────┬─────────────────────────────────┘
                        │  REST API
┌───────────────────────▼─────────────────────────────────┐
│                  Backend (FastAPI)                       │
│  ┌─────────────┐                                        │
│  │  Supervisor  │─────────────────────────────┐         │
│  └──────┬──────┘                              │         │
│    ┌────┼─────────────┐                       │         │
│    ▼         ▼              ▼                 ▼         │
│ Librarian  Quant       Journalist       Aggregator      │
│ (RAG/FAISS)(yfinance)  (DuckDuckGo)    (Synthesis)      │
│                                                         │
│  Services: finance_api · rag_service · search_tool      │
└───────────────────────┬─────────────────────────────────┘
                        │
              ┌─────────▼──────────┐
              │  PostgreSQL / SQLite │
              └────────────────────┘
```

### Agent Roles

| Agent        | Role                       | Tools                                  |
|-------------|---------------------------|----------------------------------------|
| **Supervisor**  | Lead Strategist            | Delegates to specialists               |
| **Librarian**   | Fundamental Analyst        | RAG search over 10-K/10-Q filings      |
| **Quant**       | Technical Analyst          | RSI, MACD, SMA, EMA via yfinance       |
| **Journalist**  | Sentiment Analyst          | News search via Tavily / DuckDuckGo    |
| **Aggregator**  | Report Synthesizer         | Combines all findings into final report|

---

## 🚀 Quick Start

### Prerequisites

- **Python 3.11+** and **Node.js 18+**
- **Docker & Docker Compose** (optional, for containerized deployment)
- **API Keys**: Gemini (required), Tavily (optional)

### Option 1: Local Development

```bash
# 1. Clone the repository
git clone https://github.com/HiteshSingh21/AI-Financial-Research-Team.git
cd AI-Financial-Research-Team

# 2. Configure environment
cp .env.example .env
# Edit .env and add your GEMINI_API_KEY

# 3. Backend
cd backend
python -m venv .venv
.venv\Scripts\activate        # Windows
# source .venv/bin/activate   # macOS/Linux
pip install -r requirements.txt
python -m app.main

# 4. Frontend (new terminal)
cd frontend
npm install
npm run dev
```

Open **http://localhost:3000** in your browser.

### Option 2: Docker Compose

```bash
# 1. Configure environment
cp .env.example .env
# Edit .env and add your GEMINI_API_KEY

# 2. Build and start all services
docker compose up --build
```

This starts:
- **PostgreSQL** on port 5432
- **Backend** on port 8000
- **Frontend** on port 3000

---

## 🔧 Environment Variables

| Variable           | Required | Default              | Description                          |
|-------------------|----------|----------------------|--------------------------------------|
| `GEMINI_API_KEY`   | ✅       | —                    | Google Gemini API key                |
| `TAVILY_API_KEY`   | ❌       | —                    | Tavily search API (falls back to DDG)|
| `DATABASE_URL`     | ❌       | `sqlite:///./financial_analyst.db` | Database connection string |
| `POSTGRES_USER`    | ❌       | `financial_ai`       | Docker Postgres username             |
| `POSTGRES_PASSWORD`| ❌       | `financial_ai_pass`  | Docker Postgres password             |
| `GEMINI_MODEL`     | ❌       | `gemini-1.5-flash`   | Gemini model to use                  |

---

## 📁 Project Structure

```
AI-Financial-Research-Team/
├── backend/
│   ├── app/
│   │   ├── agents/          # Supervisor, Librarian, Quant, Journalist, Aggregator
│   │   ├── api/v1/          # FastAPI endpoints (analyze, ingest, history, status)
│   │   ├── core/            # Config, logging
│   │   ├── db/              # SQLModel models, session management
│   │   └── services/        # finance_api, rag_service, search_tool
│   ├── tests/               # Pytest test suite
│   ├── Dockerfile
│   └── requirements.txt
├── frontend/
│   ├── src/
│   │   ├── app/             # Pages: dashboard, knowledge-vault, history, settings
│   │   ├── components/      # Sidebar, UI components (Shadcn/UI)
│   │   └── lib/             # API client, React Query hooks, utilities
│   ├── Dockerfile
│   └── package.json
├── data/
│   ├── faiss_index/         # Persisted FAISS vector index
│   └── raw_pdfs/            # Uploaded PDF documents
├── docker-compose.yml
├── .github/workflows/ci.yml
└── .env.example
```

---

## 🧪 Testing

```bash
# Backend tests
cd backend
pip install -r tests/requirements-test.txt
pytest tests/ -v

# Frontend build check
cd frontend
npm run build
```

---

## 📡 API Endpoints

| Method | Endpoint                     | Description                              |
|--------|------------------------------|------------------------------------------|
| `GET`  | `/health`                    | Quick health probe                       |
| `GET`  | `/api/v1/status`             | Detailed system status (agents, DB, RAG) |
| `POST` | `/api/v1/analyze`            | Run multi-agent stock analysis           |
| `POST` | `/api/v1/ingest`             | Upload PDF for RAG ingestion             |
| `GET`  | `/api/v1/history/{user_id}`  | Retrieve analysis history                |

---

## 🖥️ Features

- **Multi-Agent Analysis** — Supervisor orchestrates 4 specialist agents for comprehensive reports
- **RAG Pipeline** — Upload 10-K/10-Q filings, auto-chunk, embed with Gemini, index with FAISS
- **Technical Indicators** — RSI, MACD, SMA, EMA computed via yfinance and ta library
- **News Sentiment** — Real-time news search with Tavily or DuckDuckGo fallback
- **Chat Interface** — Markdown rendering, syntax highlighting, PDF export
- **Knowledge Vault** — Drag-and-drop PDF management with ingestion status tracking
- **Intelligence Archive** — Searchable history of all past analysis reports
- **Live Settings** — Real-time system health dashboard with auto-refresh
- **Docker Ready** — Full containerized deployment with PostgreSQL

---

## 📄 License

MIT License. See [LICENSE](LICENSE) for details.
