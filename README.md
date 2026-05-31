# 🛡️ Sentinel

A browser extension that detects and protects against phishing attacks, job scams, and other malicious content using AI-powered analysis.

## Overview

Sentinel is a Chrome browser extension built with **TypeScript** and **React** that analyzes emails, messages, and web content to identify phishing attempts, credential harvesting, domain spoofing, and other social engineering attacks. It uses a backend API to perform vector-based threat analysis and provides real-time protection recommendations.

## Features

- **Threat Detection**: Identifies multiple attack vectors including:
  - Urgency manipulation
  - Domain spoofing
  - Credential harvesting
  - Impersonation
  - Emotional manipulation
  - URL anomalies
  - Attack patterns
  - Linguistic tells

- **Multi-Tab Interface**:
  - **Home Tab**: Scan content for threats
  - **Results Tab**: View detailed threat analysis
  - **Monitor Tab**: Track protection activities

- **Visual Threat Analysis**: Vector-based scoring system with color-coded threat indicators

- **Quick Examples**: Built-in examples for phishing, job scams, and legitimate messages

## Tech Stack

- **Frontend**: React 18+ with TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **Package Manager**: npm

## Project Structure

```
sentinel-/
├── src/
│   ├── popup/
│   │   ├── App.tsx              # Main popup UI component
│   │   ├── constants.ts         # API base URL, threat labels, colors
│   │   ├── types.ts             # TypeScript interfaces
│   │   ├── index.html           # Popup HTML
│   │   ├── main.tsx             # React entry point
│   │   ├── components/          # Popup UI components
│   │   └── styles/              # Styling files
│   ├── background/              # Service worker / background script
│   ├── content/                 # Content script for page analysis
│   └── main.tsx                 # Root entry point
├── vite.config.ts               # Vite configuration
├── tailwind.config.js           # Tailwind CSS config
├── tsconfig.json                # TypeScript configuration
├── postcss.config.js            # PostCSS configuration
└── package.json                 # Dependencies and scripts
```

## Getting Started

### Prerequisites

- Node.js 16+
- npm 7+
- Chrome/Chromium browser

### Installation

1. Clone the repository:
```bash
git clone https://github.com/reeyaan2004/sentinel-.git
cd sentinel-
```

2. Install dependencies:
```bash
npm install
```

### Development

1. Start the development server:
```bash
npm run dev
```

2. Build the extension:
```bash
npm run build
```

3. Load the extension in Chrome:
   - Open `chrome://extensions/`
   - Enable "Developer mode"
   - Click "Load unpacked"
   - Select the `dist/` folder

### Build

```bash
npm run build
```

This creates an optimized build in the `dist/` folder with separate bundles for:
- Popup UI (`assets/`)
- Background service worker (`background.js`)
- Content script (`content.js`)

## Configuration

Update the API base URL in `src/popup/constants.ts`:

```typescript
export const API_BASE = 'http://127.0.0.1:8000' // Change to your backend URL
```

## Architecture

### Popup (`src/popup/`)
The main UI displayed when users click the extension icon. Allows users to:
- Paste content to scan
- View threat analysis results
- Monitor protection activity
- Access example phishing/scam messages

### Background Script (`src/background/`)
Handles extension-level logic and communication between content scripts and the popup.

### Content Script (`src/content/`)
Injects analysis capabilities directly into web pages for real-time threat detection.

## API Integration

The extension communicates with a backend API for threat analysis. The API returns vector-based scores for different threat categories.

## Browser Support

- Chrome 88+
- Edge 88+
- Brave
- Other Chromium-based browsers


## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## Authors

[@reeyaan2004](https://github.com/reeyaan2004)
[@IsabelRomero](https://github.com/Isabel-M-Romero)
