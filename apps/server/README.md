# Echo Orchestrator (Node.js Server)

The **Echo Orchestrator** is a central Node.js service powered by **pnpm** and **Express**. It manages the PostgreSQL database, orchestrates identification between the Chrome extension and the Python worker, and handles metadata synchronization.

---

## 🚀 Getting Started

### 1. Prerequisites

- [Node.js 20 or higher](https://nodejs.org/)
- [pnpm 9 or higher](https://pnpm.io/)
- [PostgreSQL](https://www.postgresql.org/) (Docker-ready)

### 2. Installation

1.  Navigate to the directory: `cd apps/server`
2.  Install dependencies: `pnpm install`

### 3. Database Initialization

Ensure your database is running and then start the server to automatically synchronize the schema:

```bash
pnpm run dev
```

---

## 🛠️ Configuration

Create a `.env` file based on `.env.example`:

```env
PORT=4000
JWT_SECRET=your_secure_secret
DATABASE_URL=postgresql://postgres:password@localhost:5432/echo_shazam
WORKER_API_URL=http://localhost:8000/identify
```

## 📊 Core Functionality

### 1. Identification (`/identify`)

- Receives audio chunks from the Chrome extension.
- Proxies processing to the Python worker.
- Executes the **SQL Time-Alignment Validation** to confirm matches.

### 2. Synchronization (`/webhook/upload_hashes`)

- Receives batch fingerprint uploads from the generator.
- Atomically populates the `fingerprints` and `songs` tables.

## 🧪 Deployment Commands

### Reset Database

Clear all existing metadata and fingerprints for a clean start:

```bash
pnpm run db:reset
```

### Production Build

Build the TypeScript source into the `dist/` directory:

```bash
pnpm run build
```
