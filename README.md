<div align="center">
  <img src="chrome_extension/public/logo.svg" width="120" alt="Echo Logo" />
  <h1>Echo: High-Resolution Audio Recognition</h1>
</div>

**Echo** is a state-of-the-art audio identification system that recognizes music directly from browser tabs. It uses a **distributed microservice architecture** and a **spectral-fingerprint matching algorithm** to ensure high accuracy and low latency.

## 🚀 Key Features

*   **Real-time Tab Capture**: Seamlessly intercept audio from any Chrome tab without external recording hardware.
*   **Acoustic Fingerprinting**: Converts audio into a spectral "peak constellation" map, making it resistant to noise and compression.
*   **Time-Alignment Validation**: Rejects false positives by verifying that matching hashes appear in the same chronological sequence as the original recording.
*   **Production-Grade Architecture**:
    *   **In-Memory Processing**: Uses memory buffers instead of temporary files to eliminate disk I/O bottlenecks.
    *   **Scalable FastAPI Worker**: A dedicated Python service handles heavy signal processing (FFT and peak detection).
    *   **Secure Webhooks**: Synchronize large fingerprint datasets from the generator to the database using JWT-authenticated streams.

## 🏗️ System Architecture

```mermaid
graph TD
    A[Chrome Extension] -->|Audio Chunks| B(Node.js Server)
    B -->|Buffer| C(Python FastAPI Worker)
    C -->|Spectral Hashes| B
    B -->|Time-Aligned Query| D[(PostgreSQL)]
    D -->|Match Result| B
    B -->|JSON Response| A
```

## 🛠️ Technology Stack

*   **Backend (Orchestration)**: [Bun](https://bun.sh/) + [Express](https://expressjs.com/)
*   **Signal Processing (Worker)**: [FastAPI](https://fastapi.tiangolo.com/), [librosa](https://librosa.org/), [NumPy](https://numpy.org/), [SciPy](https://scipy.org/)
*   **Database**: [PostgreSQL](https://www.postgresql.org/)
*   **Frontend**: [React](https://reactjs.org/), [Vite](https://vitejs.dev/), [Lucide Icons](https://lucide.dev/)
*   **Authentication**: [JSON Web Tokens (JWT)](https://jwt.io/)

## 📝 How it Works

1.  **Spectrogram Analysis**: The Python worker converts audio into a spectrogram using a Fast Fourier Transform (FFT).
2.  **Peak Detection**: It identifies "islands" of high-energy frequencies (peaks) in the spectrogram.
3.  **Constellation Mapping**: Pairs of peaks are hashed together with their time-distance to create a unique "fingerprint".
4.  **Database Lookup**: The server queries PostgreSQL for matching hashes.
5.  **Alignment Verification**: The system calculates the time difference between the recorded peak and the original peak. If multiple hashes share the same constant time difference, a match is confirmed.

## 📦 Installation & Setup

### 1. Database
```bash
docker-compose up -d
```

### 2. server/ (`.env`)
```env
PORT=3001
JWT_SECRET=your_secure_random_key
DATABASE_URL=postgresql://postgres:password@localhost:5432/echo_shazam
WORKER_API_URL=http://localhost:8000/identify
```
Run with `bun run dev`.

### 3. fingerprint-generator/ (`.env`)
```env
SERVER_URL=http://localhost:3001/webhook/upload_hashes
JWT_SECRET=your_secure_random_key
AUDIO_DIR=../audios
```
Run with `.\.venv\Scripts\python main.py`.

### 4. chrome_extension/
1. `bun install`
2. `bun run build`
3. Load the `/dist` folder in Chrome (Manage Extensions > Load unpacked).

## 🧪 Deployment & Synchronization

### Populating the Database
Place your target music files in `/audios` and synchronize them with the production database:
```bash
python main.py --batch
```

### Resetting the Library
Clear all songs and fingerprints for a fresh start:
```bash
cd server
npm run db:reset
```

## 📄 License
MIT License. See [LICENSE](LICENSE) for details.