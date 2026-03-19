import os
import librosa
import numpy as np
import json
import hashlib
import requests
import jwt
from scipy.ndimage import maximum_filter, binary_erosion
from dotenv import load_dotenv
from fastapi import FastAPI, UploadFile, File
import uvicorn
import shutil
import tempfile

# Load configuration
load_dotenv()

# Parameters from .env or defaults
AUDIO_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "audios"))
RESULTS_FILE = os.path.abspath(
    os.path.join(os.path.dirname(__file__), "..", "fingerprints.json")
)
SERVER_URL = os.environ.get("SERVER_URL", "http://localhost:3001/webhook/upload_hashes")
JWT_SECRET = os.environ.get("JWT_SECRET", "your_secret_key")

# Fingerprinting Parameters (tuned for better recognition)
FAN_VALUE = 20
AMP_MIN = 5
PEAK_NEIGHBORHOOD_SIZE = 20
MIN_HASH_TIME_DELTA = 0
MAX_HASH_TIME_DELTA = 200

# Initialize FastAPI app
app = FastAPI(title="Fingerprint Worker API")


def get_2d_peaks(data, neighborhood_size=PEAK_NEIGHBORHOOD_SIZE, amp_min=AMP_MIN):
    struct = np.ones((neighborhood_size, neighborhood_size))
    local_max = maximum_filter(data, footprint=struct) == data
    background = data == 0
    eroded_background = binary_erosion(background, structure=struct, border_value=1)
    detected_peaks = local_max ^ eroded_background
    amps = data[detected_peaks]
    j, i = np.where(detected_peaks)

    peaks = []
    for x, y, amp in zip(i, j, amps):
        if amp > amp_min:
            peaks.append((y, x))
    return peaks


def generate_hashes(peaks, fan_value=FAN_VALUE):
    peaks.sort(key=lambda x: x[1])
    hashes = []
    for i in range(len(peaks)):
        for j in range(1, fan_value):
            if (i + j) < len(peaks):
                freq1, t1 = peaks[i]
                freq2, t2 = peaks[i + j]
                t_delta = t2 - t1
                if MIN_HASH_TIME_DELTA <= t_delta <= MAX_HASH_TIME_DELTA:
                    h = hashlib.sha1(
                        f"{freq1}|{freq2}|{t_delta}".encode("utf-8")
                    ).hexdigest()[:20]
                    hashes.append((h, int(t1)))
    return hashes


def fingerprint_file(file_path):
    y, sr = librosa.load(file_path, sr=22050)
    S = librosa.stft(y)
    S_db = librosa.amplitude_to_db(np.abs(S))
    peaks = get_2d_peaks(S_db)
    hashes = generate_hashes(peaks)
    return hashes


def upload_to_server(song_name, hashes):
    token = jwt.encode({"user": "generator"}, JWT_SECRET, algorithm="HS256")
    headers = {"Authorization": f"Bearer {token}", "Content-Type": "application/json"}
    payload = {"song": song_name, "hashes": hashes}

    try:
        response = requests.post(SERVER_URL, json=payload, headers=headers)
        return response.status_code == 200
    except Exception:
        return False


@app.post("/identify")
async def identify_audio(audio: UploadFile = File(...)):
    """
    Receives an audio file, fingerprints it, and returns hashes.
    """
    # Create temporary file
    temp_fd, temp_path = tempfile.mkstemp(suffix=".webm")
    try:
        with os.fdopen(temp_fd, "wb") as tmp:
            shutil.copyfileobj(audio.file, tmp)

        hashes = fingerprint_file(temp_path)
        return hashes
    except Exception as e:
        return {"error": str(e)}
    finally:
        if os.path.exists(temp_path):
            os.remove(temp_path)


def main():
    import sys

    # Directory scanning mode (CLI)
    if not os.path.exists(AUDIO_DIR):
        print(f"Error: Audio directory {AUDIO_DIR} not found.")
        return

    audio_files = [
        f for f in os.listdir(AUDIO_DIR) if f.endswith((".mp3", ".wav", ".m4a"))
    ]
    if not audio_files:
        print("No audio files found.")
        return

    for audio_file in audio_files:
        file_path = os.path.join(AUDIO_DIR, audio_file)
        try:
            hashes = fingerprint_file(file_path)
            upload_to_server(audio_file, hashes)
        except Exception as e:
            print(f"  Error processing {audio_file}: {e}")
    print(f"Batch processing complete.")


if __name__ == "__main__":
    import sys

    if len(sys.argv) > 1 and sys.argv[1] == "--batch":
        main()
    else:
        # Default mode: API
        port = int(os.environ.get("PORT", 8000))
        uvicorn.run(app, host="0.0.0.0", port=port)
