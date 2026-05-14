# Contributing to Echo

Welcome to the **Echo** development community! We're excited that you're interested in contributing to our audio recognition system. This guide will walk you through the process of setting up and contributing to the project.

---

## 📁 Project Structure

-   **`server/`**: Node.js (Bun) server that manages the database, identification logic, and extension API.
-   **`fingerprint-generator/`**: Python FastAPI service for spectral peak detection and hashing (FFT processing).
-   **`chrome_extension/`**: React (Vite) frontend with TabCapture permissions.
-   **`audios/`**: Local directory for indexing your music library.

## 🚀 Setting Up for Development

Each component has a detailed setup guide. Below is a quick overview:

### 1. The Python Worker (`/fingerprint-generator`)
-   Create a virtual environment: `python -m venv .venv`
-   Activate environment: `.\.venv\Scripts\activate` (Windows) or `source .venv/bin/activate` (Unix).
-   Install dependencies: `pip install -r requirements.txt`.
-   Verify with `python main.py`.

### 2. The Bun Server (`/server`)
-   Install dependencies: `bun install`.
-   Run `bun run dev`.
-   **Important**: The server automatically initializes the schema from `schema.sql` on startup.

### 3. The Chrome Extension (`/chrome_extension`)
-   Install dependencies: `bun install`.
-   Run `bun run build`.
-   Load `chrome_extension/dist` as an unpacked extension.

---

## 🤝 Standard Contribution Workflow

We follow a standard **Fork-and-Branch** workflow to ensure code quality and project stability.

### 1. Fork and Clone
1.  Navigate to the [main repository](https://github.com/lwshakib/echo-shazam-clone).
2.  Click the **Fork** button (top right).
3.  Clone your fork locally: `git clone https://github.com/YOUR_USERNAME/echo-shazam-clone.git`.

### 2. Create a Feature Branch
-   Always create a new branch for your specific feature or fix:
    ```bash
    git checkout -b feature/your-awesome-feature
    ```

### 3. Make Your Changes
-   Implement your feature or fix.
-   Follow the **Premium Aesthetic** guidelines for any UI changes:
    -   Maintain a minimal, modern, and clean interface.
    -   Use **Prettier** for formatting.

### 4. Push and Create a Pull Request
1.  Push your branch to your fork: `git push origin feature/your-awesome-feature`.
2.  Navigate to the original Echo repository and click **New Pull Request**.
3.  Describe your changes in detail and link any related issues.

---

## 📊 Technical Standards

-   **Signal Processing**: Changes to the Python worker should be verified with `librosa`.
-   **SQL Optimization**: Any changes to indexing or the SQL-based time-alignment logic must maintain sub-second lookup performance.
-   **Dependencies**: Avoid adding heavy external libraries unless absolutely necessary. We prefer specialized, lightweight solutions.

## 📄 Reporting Bugs

If you find a bug, please open an **Issue** with the following information:
-   **Environment**: OS, Browser version, Python version.
-   **Reproduction Steps**: Detailed steps to trigger the bug.
-   **Logs**: Terminal output from both the Node.js server and the Python worker.

---

Thank you for contributing to the future of open-source audio recognition!
