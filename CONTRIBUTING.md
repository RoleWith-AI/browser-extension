# Contributing to RoleWith.AI Browser Extension

Thank you for your interest in contributing! This document provides guidelines for contributing to the RoleWith.AI browser extension.

## Quick Start

1. Fork the repository
2. Clone your fork: `git clone https://github.com/YOUR_USERNAME/browser-extension.git`
3. Create a branch: `git checkout -b feature/your-feature-name`
4. Make your changes
5. Test locally (see below)
6. Commit and push
7. Open a Pull Request

## Project Structure

```
├── src/
│   ├── shared/           # Shared code (used by all browsers)
│   │   ├── popup.html    # Extension popup UI
│   │   ├── popup.js      # Main popup logic
│   │   ├── styles.css    # Styles
│   │   ├── config.js     # Configuration
│   │   └── api.js        # API client (future features)
│   │
│   ├── chromium/         # Chrome/Edge/Opera specific
│   │   ├── manifest.json # Manifest V3
│   │   └── background.js # Service worker
│   │
│   └── firefox/          # Firefox specific
│       ├── manifest.json # Manifest V2
│       └── background.js # Background script
│
├── icons/                # Extension icons
├── scripts/              # Build scripts
└── dist/                 # Built extensions (gitignored)
```

## Development Setup

### Prerequisites

- Node.js 16+
- A browser for testing (Chrome, Firefox, etc.)

### Local Development

1. Install dependencies (optional, only needed for packaging):
   ```bash
   npm install
   ```

2. Build the extension:
   ```bash
   npm run build:chrome   # or build:firefox
   ```

3. Load in browser:

   **Chrome/Edge:**
   - Go to `chrome://extensions`
   - Enable "Developer mode"
   - Click "Load unpacked"
   - Select `dist/chrome/`

   **Firefox:**
   - Go to `about:debugging#/runtime/this-firefox`
   - Click "Load Temporary Add-on"
   - Select `dist/firefox/manifest.json`

4. Make changes to files in `src/`
5. Rebuild and reload the extension

## Adding a New Browser

To add support for a new browser (e.g., Safari, Brave):

1. Create a new directory: `src/your-browser/`
2. Add the browser-specific `manifest.json`
3. Add any browser-specific scripts
4. Update `scripts/build.js` to include the new browser
5. Update the README with installation instructions
6. Test thoroughly

### Example: Adding Safari Support

Safari requires an Xcode project. See Apple's documentation:
- [Converting a web extension for Safari](https://developer.apple.com/documentation/safariservices/safari_web_extensions/converting_a_web_extension_for_safari)

1. Create `src/safari/` directory
2. Use `xcrun safari-web-extension-converter` to generate Xcode project
3. Add build instructions to `scripts/build-safari.sh`

## Code Guidelines

### JavaScript

- Use ES6+ features
- Prefer `const` over `let`, avoid `var`
- Use meaningful variable names
- Add comments for complex logic
- Use the browser API abstraction:
  ```javascript
  const browserAPI = typeof browser !== 'undefined' ? browser : chrome;
  ```

### CSS

- Use CSS custom properties for theming
- Keep selectors simple
- Mobile-first responsive design

### Commits

- Use conventional commits: `feat:`, `fix:`, `docs:`, `chore:`
- Keep commits focused and atomic
- Write clear commit messages

## Testing

Currently, testing is manual:

1. Build the extension
2. Load in target browser
3. Navigate to various job boards (LinkedIn, Indeed, etc.)
4. Click the extension icon
5. Verify the popup works correctly
6. Click "Generate CV" and verify RoleWith.AI opens with the URL

### Test Checklist

- [ ] Extension loads without errors
- [ ] Popup displays correctly
- [ ] Job board detection works (LinkedIn, Indeed, etc.)
- [ ] "Generate CV" button opens correct URL
- [ ] Works on non-job pages (graceful handling)
- [ ] No console errors

## Pull Request Process

1. Ensure your code follows the style guidelines
2. Update documentation if needed
3. Test on at least one browser
4. Fill out the PR template
5. Wait for review

## Feature Requests

We welcome feature ideas! Please open an issue with:

- Clear description of the feature
- Use case / why it's useful
- Any technical considerations

### Planned Features

- **Job Assessment**: Quick match score before generating CV
- **Context Menu**: Right-click on job links to generate CV
- **Safari Support**: Native Safari extension
- **Authentication**: Login to RoleWith.AI from extension

## Questions?

- Open an issue for bugs or questions
- Visit [RoleWith.AI](https://www.rolewith.ai) for product info
- Email: support@rolewith.ai

## License

By contributing, you agree that your contributions will be licensed under the MIT License.
