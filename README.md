# Foliosense — GS ELS 2026

AI-explained portfolio recommendations with risk-aware allocation, CAPM-based return projections, and Monte Carlo / stress-test analytics.

> Built for the **Goldman Sachs Emerging Leaders Series 2026**.

## Live

- **Web app:** _your Vercel URL here_
- **API health check:** https://gs-els-2026-mmx3.onrender.com/api/health

## What it does

A user enters their financial profile (age, income, savings, risk tolerance, life goals) plus a set of tickers and an investment horizon. The backend pulls live market data from Yahoo Finance, computes expected returns via CAPM, models taxes and expense ratios, then runs Monte Carlo simulations and historical stress tests. An OpenAI-powered service generates plain-English explanations of *why* a given allocation makes sense for that user — and lets them highlight any part of the portfolio to ask follow-up questions.

## Features

- Risk-tolerance-aware portfolio presets
- CAPM-based expected return calculations using live market data
- Tax and expense-ratio modeling on projected returns
- Monte Carlo simulation, scenario analysis, and historical stress tests
- AI explanations of portfolio decisions (OpenAI `gpt-5-nano`)
- Interactive "highlight & ask" — select any portion of a chart or recommendation to get a contextual AI answer
- User accounts via Clerk

## Tech stack

| Layer    | Tech                                |
|----------|-------------------------------------|
| Frontend | React 19, Vite 7, TypeScript        |
| Backend  | Spring Boot 4, Java 21              |
| Auth     | Clerk                               |
| Storage  | Supabase (user profiles)            |
| Market data | Yahoo Finance (public, unauthenticated) |
| AI       | OpenAI Responses API                |
| Hosting  | Vercel (frontend) · Render (backend, Docker) |

## Repo layout

```
foliosense/
├── backend/    Spring Boot REST API
├── frontend/   React + Vite UI
└── README.md
```

## Local development

### Prerequisites
- Java 21+ (17 also works)
- Node 20+
- An OpenAI API key (optional — non-AI features work without it)

### Run it

**Terminal 1 — backend:**
```powershell
cd backend
$env:OPENAI_API_KEY = "sk-..."   # optional, only needed for AI features
.\mvnw.cmd spring-boot:run
```
Backend listens on http://localhost:8080. Verify with:
```powershell
curl http://localhost:8080/api/health
```

**Terminal 2 — frontend:**
```powershell
cd frontend
npm install
npm run dev
```
Open http://localhost:5173. The Vite dev server proxies `/api/*` to the backend, so no CORS setup is needed locally.

## Environment variables

### Backend
| Variable          | Required for | Notes                                |
|-------------------|--------------|--------------------------------------|
| `OPENAI_API_KEY`  | AI endpoints | OpenAI secret key                    |
| `PORT`            | hosting      | Auto-set by Render; defaults to 8080 |

### Frontend
| Variable                       | Required for       | Notes                                                       |
|--------------------------------|--------------------|-------------------------------------------------------------|
| `VITE_API_URL`                 | production         | Backend URL (e.g. `https://...onrender.com`). Omit for local dev — Vite proxy handles it. |
| `VITE_CLERK_PUBLISHABLE_KEY`   | always             | Clerk auth (public key)                                     |
| `VITE_SUPABASE_URL`            | always             | Supabase project URL                                        |
| `VITE_SUPABASE_ANON_KEY`       | always             | Supabase anon (public) key                                  |

## API endpoints

All paths are relative to the backend root.

| Method | Path                            | Purpose                                       |
|--------|---------------------------------|-----------------------------------------------|
| GET    | `/api/health`                   | Liveness probe                                |
| POST   | `/api/portfolio/recommend`      | Compute allocation, returns, taxes, fees      |
| POST   | `/api/presets/recommend`        | Risk-profile-based preset selection           |
| POST   | `/api/analytics/montecarlo`     | Monte Carlo simulation                        |
| POST   | `/api/analytics/scenarios`      | Pre-defined scenario projections              |
| POST   | `/api/analytics/stress`         | Historical stress events                      |
| POST   | `/api/ai/portfolio-explanation` | AI explanation of recommended portfolio       |
| POST   | `/api/ai/explain-selection`     | AI answer to a user-highlighted question      |
| GET    | `/api/funds`                    | Available fund metadata                       |

## Backend architecture

Layered Spring Boot:
- `controller/` — HTTP entrypoints
- `service/` — business logic (allocation, analytics, market data, AI)
- `dto/` — request/response payloads
- `config/` — CORS and other configuration

Note: the Java package is still `com.gs.mutualfundcalc` from the project's pre-rename name. Not user-facing; left alone to avoid touching every file.

## Deployment

- **Frontend → Vercel:** root directory `frontend/`, framework Vite, auto-deploys on push to `main`.
- **Backend → Render:** root directory `backend/`, runtime Docker (uses the included `Dockerfile`). Set `OPENAI_API_KEY` in Render's environment variables.

## Team

Goldman Sachs Emerging Leaders Series — Spring 2026 cohort.
