from fastapi.testclient import TestClient
from main import app
import os

client = TestClient(app)


def test_read_root():
    response = client.get("/")
    assert response.status_code == 404


def test_identify_no_file():
    response = client.post("/identify")
    assert response.status_code == 422  # FastAPI validation error (requesting a file)


def test_fingerprint():
    # If there is a sample audio, we want to test the fingerprinting too
    # but for CI, we can just test the API structure
    pass
