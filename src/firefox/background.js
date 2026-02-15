/**
 * RoleWith.AI Extension Background Script (Firefox - Manifest V2)
 *
 * Handles background tasks and extension lifecycle events.
 * Uses the `browser` API (Firefox) with `chrome` API fallback.
 */

const browserAPI = typeof browser !== 'undefined' ? browser : chrome;

// Extension installed or updated
browserAPI.runtime.onInstalled.addListener((details) => {
  if (details.reason === 'install') {
    console.log('[RoleWith.AI] Extension installed');
  } else if (details.reason === 'update') {
    console.log('[RoleWith.AI] Extension updated to version', browserAPI.runtime.getManifest().version);
  }
});

// Listen for messages from popup or content scripts
browserAPI.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === 'GET_AUTH_TOKEN') {
    sendResponse({ token: null });
  }

  if (message.type === 'OPEN_ROLEWITH') {
    browserAPI.tabs.create({ url: message.url });
    sendResponse({ success: true });
  }

  return false;
});
