# Echo Chrome Extension

The **Echo Chrome Extension** is a professional-grade React application powered by **Vite** and **CRXJS**. It intercepts tab audio streams and identifies the music playing in real-time.

---

## 🚀 Getting Started

### 1. Prerequisites
- [Bun 1.1 or higher](https://bun.sh/)
- [Google Chrome](https://www.google.com/chrome/)

### 2. Installation
1.  Navigate to the directory: `cd chrome_extension`
2.  Install dependencies: `bun install`

### 3. Build & Load
1.  Generate production bundle:
    ```bash
    bun run build
    ```
2.  Open Chrome and navigate to `chrome://extensions/`.
3.  Enable **Developer mode** (top right).
4.  Click **Load unpacked** and select the `/chrome_extension/dist` folder.

---

## 🛠️ Configuration

Create a `.env` file based on `.env.example`:
```env
VITE_API_URL=http://localhost:3001
```

## 📊 Core Features
- **🎯 Tab Capture**: High-fidelity audio interception from active tabs.
- **⚡ Real-time Identification**: Streamlined UI for one-click identification.
- **✨ Premium UI**: Clean, responsive design using **Lucide Icons** and **Inter** typography.

## 🧪 Development
For hot-module replacement (HMR) during extension development:
```bash
bun run dev
```
Then load the `dist` folder as per the standard instructions.
