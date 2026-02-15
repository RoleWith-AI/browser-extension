#!/usr/bin/env node
/**
 * Build script for RoleWith.AI Browser Extension
 *
 * Assembles browser-specific extensions by combining shared code
 * with browser-specific manifests and configurations.
 *
 * Usage:
 *   node scripts/build.js chrome   # Build Chrome/Edge/Opera extension
 *   node scripts/build.js firefox  # Build Firefox extension
 *   node scripts/build.js all      # Build all browsers
 */

const fs = require('fs');
const path = require('path');

const ROOT_DIR = path.join(__dirname, '..');
const SRC_DIR = path.join(ROOT_DIR, 'src');
const DIST_DIR = path.join(ROOT_DIR, 'dist');
const ICONS_DIR = path.join(ROOT_DIR, 'icons');

// Files to copy from shared folder
const SHARED_FILES = [
  'popup.html',
  'popup.js',
  'styles.css',
  'config.js',
  'api.js',
];

// Browser configurations
const BROWSERS = {
  chrome: {
    name: 'Chrome/Edge/Opera',
    srcDir: 'chromium',
    distDir: 'chrome',
    files: ['manifest.json', 'background.js'],
  },
  firefox: {
    name: 'Firefox',
    srcDir: 'firefox',
    distDir: 'firefox',
    files: ['manifest.json', 'background.js'],
  },
};

/**
 * Ensure directory exists
 */
function ensureDir(dir) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

/**
 * Copy file with optional transform
 */
function copyFile(src, dest, transform = null) {
  let content = fs.readFileSync(src, 'utf8');
  if (transform) {
    content = transform(content);
  }
  fs.writeFileSync(dest, content);
  console.log(`  ✓ ${path.basename(dest)}`);
}

/**
 * Copy directory recursively
 */
function copyDir(src, dest) {
  ensureDir(dest);
  const entries = fs.readdirSync(src, { withFileTypes: true });

  for (const entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);

    if (entry.isDirectory()) {
      copyDir(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

/**
 * Build extension for a specific browser
 */
function buildBrowser(browserKey) {
  const browser = BROWSERS[browserKey];
  if (!browser) {
    console.error(`Unknown browser: ${browserKey}`);
    process.exit(1);
  }

  console.log(`\n🔨 Building for ${browser.name}...`);

  const outputDir = path.join(DIST_DIR, browser.distDir);
  ensureDir(outputDir);

  // Copy shared files
  console.log('  Copying shared files:');
  for (const file of SHARED_FILES) {
    const src = path.join(SRC_DIR, 'shared', file);
    const dest = path.join(outputDir, file);
    if (fs.existsSync(src)) {
      copyFile(src, dest);
    } else {
      console.warn(`  ⚠ Missing: ${file}`);
    }
  }

  // Copy browser-specific files
  console.log('  Copying browser-specific files:');
  for (const file of browser.files) {
    const src = path.join(SRC_DIR, browser.srcDir, file);
    const dest = path.join(outputDir, file);
    if (fs.existsSync(src)) {
      copyFile(src, dest);
    } else {
      console.warn(`  ⚠ Missing: ${file}`);
    }
  }

  // Copy icons
  console.log('  Copying icons:');
  const iconsOutputDir = path.join(outputDir, 'icons');
  if (fs.existsSync(ICONS_DIR)) {
    copyDir(ICONS_DIR, iconsOutputDir);
    console.log('  ✓ icons/');
  } else {
    console.warn('  ⚠ Icons directory not found - using placeholders');
    ensureDir(iconsOutputDir);
    // Create placeholder message
    fs.writeFileSync(
      path.join(iconsOutputDir, 'README.txt'),
      'Add icon files here: icon-16.png, icon-32.png, icon-48.png, icon-128.png'
    );
  }

  console.log(`✅ ${browser.name} build complete: dist/${browser.distDir}/`);
}

/**
 * Build all browsers
 */
function buildAll() {
  console.log('🚀 Building RoleWith.AI Extension for all browsers...');

  // Clean dist directory
  if (fs.existsSync(DIST_DIR)) {
    fs.rmSync(DIST_DIR, { recursive: true });
  }

  for (const browserKey of Object.keys(BROWSERS)) {
    buildBrowser(browserKey);
  }

  console.log('\n🎉 All builds complete!');
}

// Main execution
const target = process.argv[2] || 'all';

if (target === 'all') {
  buildAll();
} else {
  buildBrowser(target);
}
