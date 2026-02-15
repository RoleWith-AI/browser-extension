#!/usr/bin/env node
/**
 * Package script for RoleWith.AI Browser Extension
 *
 * Creates ZIP files ready for store submission.
 *
 * Usage:
 *   node scripts/package.js         # Package all built extensions
 *   node scripts/package.js chrome  # Package Chrome extension only
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const ROOT_DIR = path.join(__dirname, '..');
const DIST_DIR = path.join(ROOT_DIR, 'dist');

const BROWSERS = ['chrome', 'firefox'];

/**
 * Package a browser extension into a ZIP file
 */
function packageBrowser(browser) {
  const browserDir = path.join(DIST_DIR, browser);

  if (!fs.existsSync(browserDir)) {
    console.warn(`⚠ No build found for ${browser}. Run 'npm run build:${browser}' first.`);
    return false;
  }

  const zipFile = path.join(DIST_DIR, `rolewith-${browser}-v1.0.0.zip`);

  // Remove existing zip if present
  if (fs.existsSync(zipFile)) {
    fs.unlinkSync(zipFile);
  }

  console.log(`📦 Packaging ${browser}...`);

  // Use system zip command (cross-platform alternatives available)
  try {
    // Change to the browser directory and zip contents
    execSync(`cd "${browserDir}" && zip -r "../rolewith-${browser}-v1.0.0.zip" .`, {
      stdio: 'inherit',
    });
    console.log(`✅ Created: dist/rolewith-${browser}-v1.0.0.zip`);
    return true;
  } catch (error) {
    // Fallback: try using PowerShell on Windows
    try {
      execSync(
        `powershell Compress-Archive -Path "${browserDir}/*" -DestinationPath "${zipFile}" -Force`,
        { stdio: 'inherit' }
      );
      console.log(`✅ Created: dist/rolewith-${browser}-v1.0.0.zip`);
      return true;
    } catch (psError) {
      console.error(`❌ Failed to package ${browser}:`, error.message);
      console.log('   Install "archiver" package or ensure zip/PowerShell is available.');
      return false;
    }
  }
}

/**
 * Package all browsers
 */
function packageAll() {
  console.log('📦 Packaging all browser extensions...\n');

  let success = 0;
  for (const browser of BROWSERS) {
    if (packageBrowser(browser)) {
      success++;
    }
  }

  console.log(`\n✅ Packaged ${success}/${BROWSERS.length} extensions`);
}

// Main execution
const target = process.argv[2];

if (target && BROWSERS.includes(target)) {
  packageBrowser(target);
} else if (target) {
  console.error(`Unknown browser: ${target}`);
  console.log(`Available: ${BROWSERS.join(', ')}`);
  process.exit(1);
} else {
  packageAll();
}
