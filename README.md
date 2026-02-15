# RoleWith.AI Browser Extension

One-click CV generation from any job posting page.

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Chrome Web Store](https://img.shields.io/badge/Chrome-Extension-green)](https://chrome.google.com/webstore)
[![Firefox Add-ons](https://img.shields.io/badge/Firefox-Add--on-orange)](https://addons.mozilla.org)

## What it does

When you're viewing a job posting on LinkedIn, Indeed, Glassdoor, or any job board:

1. Click the RoleWith.AI extension icon
2. RoleWith.AI opens with the job details auto-extracted
3. Generate a tailored CV in seconds

## Supported Browsers

| Browser | Status | Install |
|---------|--------|---------|
| Chrome | ✅ Ready | [Chrome Web Store](#) |
| Edge | ✅ Ready | [Edge Add-ons](#) |
| Opera | ✅ Ready | [Opera Add-ons](#) |
| Firefox | ✅ Ready | [Firefox Add-ons](#) |
| Safari | 🚧 Planned | Coming soon |

## Installation

### From Store (Recommended)

- **Chrome/Edge/Opera**: [Chrome Web Store link](#)
- **Firefox**: [Firefox Add-ons link](#)

### From Source (Development)

#### Chrome / Edge / Opera

1. Clone this repo
2. Open `chrome://extensions` (or `edge://extensions`, `opera://extensions`)
3. Enable "Developer mode"
4. Click "Load unpacked"
5. Select the `src/chromium` folder

#### Firefox

1. Clone this repo
2. Open `about:debugging#/runtime/this-firefox`
3. Click "Load Temporary Add-on"
4. Select `src/firefox/manifest.json`

#### Safari

See [Safari Build Instructions](#safari-build-instructions) below.

## Project Structure

```
├── src/
│   ├── shared/           # Shared code across all browsers
│   │   ├── popup.html    # Extension popup UI
│   │   ├── popup.js      # Core logic
│   │   └── styles.css    # Popup styles
│   │
│   ├── chromium/         # Chrome, Edge, Opera (Manifest V3)
│   │   ├── manifest.json
│   │   └── ... (copies shared files)
│   │
│   ├── firefox/          # Firefox (Manifest V2)
│   │   ├── manifest.json
│   │   └── ... (copies shared files)
│   │
│   └── safari/           # Safari Web Extension
│       └── (Xcode project)
│
├── icons/                # Extension icons (all sizes)
├── scripts/              # Build scripts
└── dist/                 # Built extensions (gitignored)
```

## Building

```bash
# Build all browsers
npm run build

# Build specific browser
npm run build:chrome
npm run build:firefox
npm run build:safari

# Package for store submission
npm run package
```

## How It Works

The extension is intentionally simple and transparent:

```javascript
// Get current tab URL
const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

// Open RoleWith.AI with the job URL
const roleWithUrl = `https://www.rolewith.ai/app/generate?job_url=${encodeURIComponent(tab.url)}`;
chrome.tabs.create({ url: roleWithUrl });
```

That's it. No data collection, no tracking, no background processes.

## Privacy

This extension:
- ✅ Only reads the URL of the current tab when you click the icon
- ✅ Only opens rolewith.ai with that URL
- ❌ Does NOT track your browsing
- ❌ Does NOT collect any data
- ❌ Does NOT run in the background

## Contributing

We welcome contributions! See [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.

### Adding a New Browser

1. Create a new folder under `src/` for your browser
2. Add the browser-specific `manifest.json`
3. Copy shared files or symlink them
4. Add build script to `scripts/`
5. Update this README
6. Submit a PR!

### Safari Build Instructions

Safari requires Xcode and an Apple Developer account:

1. Install Xcode from the App Store
2. Open `src/safari/RoleWith.xcodeproj`
3. Build and run in Xcode
4. Enable the extension in Safari → Preferences → Extensions

For App Store distribution, you'll need an Apple Developer account ($99/year).

## Supported Job Boards

The extension works on any website, but is optimized for:

- LinkedIn
- Indeed
- Glassdoor
- Greenhouse
- Lever
- Workday
- Ashby
- And any other job posting page!

## License

MIT License - see [LICENSE](LICENSE)

## Links

- [RoleWith.AI](https://www.rolewith.ai) - Main application
- [Report an Issue](https://github.com/RoleWith-AI/browser-extension/issues)
- [Request a Feature](https://github.com/RoleWith-AI/browser-extension/issues/new)
