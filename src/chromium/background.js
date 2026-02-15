/**
 * RoleWith.AI Extension Background Service Worker (Chromium - Manifest V3)
 *
 * Handles background tasks and extension lifecycle events.
 * Currently minimal - will expand for Job Assessment feature.
 */

// Extension installed or updated
chrome.runtime.onInstalled.addListener((details) => {
  if (details.reason === 'install') {
    console.log('[RoleWith.AI] Extension installed');
    // Future: Open onboarding page
    // chrome.tabs.create({ url: 'https://www.rolewith.ai/extension-welcome' });
  } else if (details.reason === 'update') {
    console.log('[RoleWith.AI] Extension updated to version', chrome.runtime.getManifest().version);
  }
});

// Listen for messages from popup or content scripts
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === 'GET_AUTH_TOKEN') {
    // Future: Return stored auth token for API calls
    sendResponse({ token: null });
  }

  if (message.type === 'OPEN_ROLEWITH') {
    // Open RoleWith.AI in a new tab
    chrome.tabs.create({ url: message.url });
    sendResponse({ success: true });
  }

  // Return true to indicate async response (if needed)
  return false;
});

// Future: Context menu for right-click on job links
// chrome.contextMenus.create({
//   id: 'generate-cv',
//   title: 'Generate CV with RoleWith.AI',
//   contexts: ['link'],
//   documentUrlPatterns: ['*://*.linkedin.com/*', '*://*.indeed.com/*', ...]
// });
//
// chrome.contextMenus.onClicked.addListener((info, tab) => {
//   if (info.menuItemId === 'generate-cv' && info.linkUrl) {
//     const url = `https://www.rolewith.ai/app/generate?job_url=${encodeURIComponent(info.linkUrl)}`;
//     chrome.tabs.create({ url });
//   }
// });
