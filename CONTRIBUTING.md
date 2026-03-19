# Contributing to Echo (Development Guide)

Welcome to the **Echo** development community! This project is a multi-tier system that bridges high-performance Node.js with specialized Python signal processing.

## 📁 Project Structure

-   `server/`: Node.js (Bun) server that manages the database, identification logic, and extension API.
-   `fingerprint-generator/`: Python FastAPI service for spectral peak detection and hashing.
-   `chrome_extension/`: React (Vite) frontend with TabCapture permissions.
-   `audios/`: Local directory for song data to be indexed.

## 🛠️ Technical Deep Dive

### Signal Processing (Python)
We use the **Dejavu-inspired algorithm** for fingerprinting:
1.  **FFT Generation**: Audio is decomposed into frequencies over time.
2.  **Peak Detection**: We look for high-amplitude "peaks" in the spectrogram.
3.  **Hashing**: We take a "base" peak and connect it to a "fan" of neighboring peaks within a time-window. Each pair generates a hash (`hash(f1, f2, delta_time)`) and an `offset_val` (the time of the first peak).

### Identification Matching (SQL)
To prevent false positives, we don't just count matching hashes. We perform a **Time-Alignment Validation**:
-   `time_diff = song_offset - recording_offset`
-   If many matching hashes share the same `time_diff`, it's a true match. This is performed using an efficient `WITH` clause and a `GROUP BY` on the calculated offset difference.

## 🚀 Setting Up for Development

### 1. The Python Worker
-   Create a virtual environment: `python -m venv .venv`
-   Install core math/audio libs: `.\.venv\Scripts\python -m pip install -r requirements.txt` (including `librosa`, `numpy`, `scipy`, `fastapi`, `uvicorn`, `PyJWT`).
-   Verify with `.\.venv\Scripts\python main.py`.

### 2. The Bun Server
-   Install Bun: `powershell -c "irm bun.sh/install.ps1 | iex"` (on Windows).
-   Run `bun install` followed by `bun run dev`.
-   **Important**: The server automatically initializes the schema from `schema.sql` on startup.

### 3. The Chrome Extension
-   Load `chrome_extension/dist` as an unpacked extension.
-   Use `bun run dev` for HMR during development.

## 📊 Database Schema

Our PostgreSQL schema is optimized for fast hash lookups:
-   `songs`: Store metadata (name, artist).
-   `fingerprints`: Stores the `hash` (TEXT) and `offset_val` (INTEGER).
-   **Indices**: We have a B-tree index on the `hash` column to ensure identification remains sub-second even with millions of fingerprints.

## 🤝 Contribution Workflow

1.  **Pick an ID**: If you're adding a feature, mention the project goal (**Echo Recognition Performance**) in your PR.
2.  **Test Locally**: Always test your changes with **real audio files** from the `/audios` directory.
3.  **No Placeholders**: Never use placeholder images or mock data in the extension UI.
4.  **Premium Aesthetic**: Follow the light-themed, minimalist design system using **Lucide Icons** and **Inter/Outfit** fonts.

## 📄 Reporting Bugs

Provide:
-   **Context**: Are you in batch mode or real-time?
-   **Terminal Logs**: Include both Node.js and FastAPI logs.
-   **Environment**: Your OS and Python version.

Thank you for contributing to the future of open-source audio recognition!
