# Fingerprint Generator Worker

The **Fingerprint Generator** is a specialized Python service responsible for high-performance acoustic signal processing. It converts raw audio into spectral peak "constellations" and generates unique hashes used for music identification.

---

## 🚀 Getting Started

### 1. Prerequisites
- [Python 3.12 or higher](https://www.python.org/)

### 2. Environment Setup (Recommended)
We recommend using a virtual environment (`.venv`) to isolate dependencies.

**Create and Activate:**
```powershell
# Windows
python -m venv .venv
.\.venv\Scripts\activate

# Unix/macOS
python -m venv .venv
source .venv/bin/activate
```

**Install Dependencies:**
```bash
pip install -r requirements.txt
```

### 3. Generate `requirements.txt`
If you add new dependencies, keep the requirements file in sync:
```bash
# Ensure your .venv is active
pip freeze > requirements.txt
```

---

## 🛠️ Configuration

Create a `.env` file based on `.env.example`:
```env
SERVER_URL=http://localhost:3001/webhook/upload_hashes
JWT_SECRET=your_secure_secret
AUDIO_DIR=../audios
```

## 📊 Processing Modes

### 1. API Mode (Real-time)
Starts a FastAPI server to process incoming audio chunks from the orchestrator:
```bash
python main.py
```

### 2. Batch Processing Mode
Scans the `/audios` directory and uploads fingerprints for all discovered tracks to the production database:
```bash
python main.py --batch
```

## 🧪 Technical Details
- **Spectral Analysis**: Uses Fast Fourier Transform (FFT) via `librosa`.
- **Peak Identification**: Implements a 2D maximum filter for peak detection in spectrograms.
- **Hashing Algorithm**: Pairs peaks into hashes (`freq1|freq2|delta_time`) to create robust acoustic signatures.
