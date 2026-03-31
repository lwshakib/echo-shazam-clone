# Echo Orchestrator (Bun Server)

The **Echo Orchestrator** is a central Node.js service powered by **Bun** and **Express**. It manages the PostgreSQL database, orchestrates identification between the Chrome extension and the Python worker, and handles metadata synchronization.

---

## 🚀 Getting Started

### 1. Prerequisites
- [Bun 1.1 or higher](https://bun.sh/)
- [PostgreSQL](https://www.postgresql.org/) (Docker-ready)

### 2. Installation
1.  Navigate to the directory: `cd server`
2.  Install dependencies: `bun install`

### 3. Database Initialization
Ensure your database is running and then start the server to automatically synchronize the schema:
```bash
bun run dev
```

---

## 🛠️ Configuration

Create a `.env` file based on `.env.example`:
```env
PORT=3001
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
bun run db:reset
```

### Production Build
While `bun run dev` is suitable for local development, you can generate a bundle:
```bash
bun compile index.ts
```
