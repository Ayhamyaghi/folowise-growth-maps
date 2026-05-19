# Folowise Roadmap Manager

An internal web application for managing individualized trainee learning roadmaps.  
Managers create and review roadmaps; trainees track progress and propose changes.

---

## Repository Structure

```
folowise-growth-maps/
├── apps/
│   ├── backend/          Kotlin + Spring Boot REST API
│   └── web/              React + TypeScript frontend (Vite)
├── docs/                 Project documentation and metadata
├── scripts/              Utility / CI scripts
├── docker-compose.yml    PostgreSQL local database
├── CLAUDE.md             AI-assisted development instructions
├── SPEC.md               Product specification
└── package.json          Root convenience scripts (no dependencies)
```

---

## Prerequisites

| Tool | Version |
|------|---------|
| Java | 17+ |
| Node.js | 18+ |
| PostgreSQL | 15+ (or Docker) |

---

## Running Locally

### 1 — Database

```bash
docker-compose up -d
```

Creates a local PostgreSQL instance at `localhost:5432` with database `folowise_dev`.

---

### 2 — Backend

```bash
cd apps/backend
```

Create a local environment file (first time only):

```bash
copy .env.example .env        # Windows
cp  .env.example .env         # macOS / Linux
```

Edit `.env` and set a real `JWT_SECRET` (32+ characters).

Start the API server:

```bash
# Windows
set SPRING_PROFILES_ACTIVE=dev
gradlew.bat bootRun

# macOS / Linux
export SPRING_PROFILES_ACTIVE=dev
./gradlew bootRun
```

The API is available at `http://localhost:8080`.  
Swagger UI: `http://localhost:8080/swagger-ui.html`

---

### 3 — Frontend

```bash
cd apps/web
npm install
npm run dev
```

Or from the repo root:

```bash
npm run dev:web
```

The frontend runs at `http://localhost:3000` and proxies `/api` requests to the backend.

---

## Root Convenience Scripts

These scripts delegate to the frontend without adding dependencies to the root.

| Command | Description |
|---------|-------------|
| `npm run dev:web` | Start the Vite dev server |
| `npm run build:web` | Production build |
| `npm run lint:web` | TypeScript check (`tsc --noEmit`) |
| `npm run clean:web` | Remove `apps/web/dist/` |

---

## Environment Variables

### Backend — `apps/backend/.env`

| Variable | Description |
|----------|-------------|
| `DB_URL` | JDBC URL, e.g. `jdbc:postgresql://localhost:5432/folowise_dev` |
| `DB_USERNAME` | Database user |
| `DB_PASSWORD` | Database password |
| `JWT_SECRET` | Base64-encoded secret, minimum 32 bytes |
| `JWT_EXPIRATION_MS` | Token lifetime in ms (default: `86400000` = 24 h) |

See `apps/backend/.env.example` for a template.

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Backend language | Kotlin |
| Backend framework | Spring Boot 3 |
| Database | PostgreSQL 16 |
| Migrations | Flyway |
| Security | Spring Security + JWT |
| Frontend framework | React 19 |
| Frontend language | TypeScript |
| Bundler | Vite 6 |
| Styling | Tailwind CSS v4 |
| Animation | Motion (Framer) |
