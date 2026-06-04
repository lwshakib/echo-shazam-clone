# System Setup and Testing Guide

This guide covers how to set up the audio processing pipeline, index your audio files, and verify that the fingerprinting system is working perfectly.

## 1. Directory Structure

Place the audio files you want to index inside the `audios/` directory at the root of the project (create it if it doesn't exist). The system supports `.mp3`, `.wav`, and `.m4a` files.

```text
echo-shazam-clone/
├── audios/
│   ├── song_1.mp3
│   ├── song_2.wav
│   └── ...
├── apps/
│   ├── server/
│   ├── fingerprint-worker/
│   └── chrome-extension/
```

## 2. Infrastructure Setup

Before running the worker, ensure your database is running and accessible. The easiest way to start the PostgreSQL database is via Docker:

```bash
docker-compose up -d
```

Ensure your `apps/server/.env` and `apps/fingerprint-worker/.env` files are properly configured (copy from `.env.example`).

## 3. Starting the Orchestrator (Server)

The server must be running to receive the generated hashes and store them in the database.

```bash
cd apps/server
pnpm install
pnpm run dev
```

## 4. Generating Fingerprints (Batch Mode)

To process all audio files in your `audios/` directory and save their spectral fingerprints to the database, run the `fingerprint-worker` in batch mode.

1. Navigate to the worker directory and activate the virtual environment:

   ```bash
   cd apps/fingerprint-worker
   .\.venv\Scripts\activate  # On Windows
   # source .venv/bin/activate  # On macOS/Linux
   ```

2. Run the batch processor:
   ```bash
   python main.py --batch
   ```

You should see terminal output indicating that each file is being processed and its hashes are being uploaded to the server via the webhook.

## 5. Verifying the Fingerprints

To ensure the audio is being perfectly generated and stored:

1. **Check the Server Logs**: The Node.js server terminal should show `Receiving data for [Song Name] (X hashes)...` followed by a success message.
2. **Test via the Extension**:
   - Start the Chrome Extension (`pnpm run dev` in `apps/chrome-extension`) and load it unpacked in Chrome.
   - Start the worker API: `python main.py` (in `apps/fingerprint-worker`).
   - Play one of the songs you indexed on a browser tab.
   - Click the "Identify" pulse button in the extension.
   - If the setup is correct, the extension will display a success card with the song's name.

## Troubleshooting

- **Audio not recognized**: Ensure the volume is audible when capturing from the tab. Very quiet audio might not generate sufficient peaks.
- **Database Connection Error**: Verify `DATABASE_URL` in `apps/server/.env` matches your Docker configuration.
- **FastAPI worker not found**: Ensure `WORKER_API_URL` in `apps/server/.env` points to `http://localhost:8000/identify` or wherever your worker is running.
