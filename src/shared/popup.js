/**
 * RoleWith.AI Extension Popup Logic
 *
 * Handles user interactions and orchestrates extension functionality.
 */

// Use browser API abstraction for cross-browser compatibility
const browserAPI = typeof browser !== 'undefined' ? browser : chrome;

/**
 * DOM Elements
 */
const elements = {
  status: document.getElementById('job-status'),
  statusIcon: document.getElementById('status-icon'),
  statusText: document.getElementById('status-text'),
  urlDisplay: document.getElementById('url-display'),
  currentUrl: document.getElementById('current-url'),
  btnGenerate: document.getElementById('btn-generate'),
  btnAssess: document.getElementById('btn-assess'),
  assessmentResults: document.getElementById('assessment-results'),
  matchScore: document.getElementById('match-score'),
  assessmentDetails: document.getElementById('assessment-details'),
  errorDisplay: document.getElementById('error-display'),
  errorText: document.getElementById('error-text'),
};

/**
 * Current state
 */
let currentTab = null;
let detectedJobBoard = null;

/**
 * Initialize the popup
 */
async function init() {
  try {
    // Get current tab
    const tabs = await browserAPI.tabs.query({ active: true, currentWindow: true });
    currentTab = tabs[0];

    if (!currentTab?.url) {
      showError('Unable to access current page');
      return;
    }

    // Check if this looks like a job page
    analyzeCurrentPage(currentTab.url);

    // Set up event listeners
    setupEventListeners();

    // Show/hide Job Assessment button based on feature flag
    if (CONFIG.FEATURES.JOB_ASSESSMENT) {
      elements.btnAssess.classList.remove('hidden');
    }

  } catch (error) {
    console.error('Popup initialization error:', error);
    showError('Failed to initialize extension');
  }
}

/**
 * Analyze the current page URL to determine if it's a job posting
 */
function analyzeCurrentPage(url) {
  // Check if URL is excluded (definitely not a job)
  for (const pattern of CONFIG.EXCLUDED_PATTERNS) {
    if (pattern.test(url)) {
      setStatus('warning', '🔍', 'This doesn\'t look like a job posting');
      elements.btnGenerate.disabled = false; // Still allow, user might know better
      return;
    }
  }

  // Check if URL matches known job boards
  for (const board of CONFIG.JOB_BOARDS) {
    if (board.pattern.test(url)) {
      detectedJobBoard = board.name;
      setStatus('success', '✅', `${board.name} job detected`);
      showUrl(url);
      elements.btnGenerate.disabled = false;
      return;
    }
  }

  // Unknown page - still allow generation
  setStatus('success', '🔗', 'Ready to generate CV from this page');
  showUrl(url);
  elements.btnGenerate.disabled = false;
}

/**
 * Set status display
 */
function setStatus(type, icon, text) {
  elements.status.className = `status ${type}`;
  elements.statusIcon.textContent = icon;
  elements.statusText.textContent = text;
}

/**
 * Show the URL display
 */
function showUrl(url) {
  elements.urlDisplay.classList.remove('hidden');
  // Truncate URL for display
  const displayUrl = url.length > 60 ? url.substring(0, 60) + '...' : url;
  elements.currentUrl.textContent = displayUrl;
  elements.currentUrl.title = url; // Full URL on hover
}

/**
 * Show error message
 */
function showError(message) {
  elements.errorDisplay.classList.remove('hidden');
  elements.errorText.textContent = message;
}

/**
 * Hide error message
 */
function hideError() {
  elements.errorDisplay.classList.add('hidden');
}

/**
 * Set up event listeners
 */
function setupEventListeners() {
  // Generate CV button
  elements.btnGenerate.addEventListener('click', handleGenerateCV);

  // Assess Match button (future feature)
  elements.btnAssess.addEventListener('click', handleAssessJob);
}

/**
 * Handle Generate CV button click
 */
async function handleGenerateCV() {
  if (!currentTab?.url) {
    showError('No URL available');
    return;
  }

  hideError();

  try {
    // Build deep link URL
    const generateUrl = buildGenerateUrl(currentTab.url);

    // Open in new tab
    await browserAPI.tabs.create({ url: generateUrl });

    // Close popup
    window.close();

  } catch (error) {
    console.error('Generate CV error:', error);
    showError('Failed to open RoleWith.AI');
  }
}

/**
 * Build the generate CV deep link URL
 */
function buildGenerateUrl(jobUrl) {
  const encodedUrl = encodeURIComponent(jobUrl);
  return `${CONFIG.APP_URL}${CONFIG.PATHS.GENERATE}?job_url=${encodedUrl}`;
}

/**
 * Handle Assess Job button click (Future Feature)
 */
async function handleAssessJob() {
  if (!currentTab?.url) {
    showError('No URL available');
    return;
  }

  if (!CONFIG.FEATURES.JOB_ASSESSMENT) {
    showError('Job Assessment is coming soon!');
    return;
  }

  hideError();
  setButtonLoading(elements.btnAssess, true);

  try {
    const result = await RoleWithAPI.assessJob(currentTab.url);
    displayAssessmentResults(result);

  } catch (error) {
    console.error('Job assessment error:', error);
    showError(error.message || 'Assessment failed');

  } finally {
    setButtonLoading(elements.btnAssess, false);
  }
}

/**
 * Display assessment results (Future Feature)
 */
function displayAssessmentResults(result) {
  elements.assessmentResults.classList.remove('hidden');
  elements.matchScore.textContent = `${result.matchScore}%`;

  // Build details HTML
  let detailsHtml = '';

  if (result.matchingSkills?.length) {
    detailsHtml += '<div class="match-section">';
    detailsHtml += '<strong>Matching Skills:</strong>';
    result.matchingSkills.forEach(skill => {
      detailsHtml += `<div class="match-item positive">✓ ${skill}</div>`;
    });
    detailsHtml += '</div>';
  }

  if (result.missingSkills?.length) {
    detailsHtml += '<div class="match-section">';
    detailsHtml += '<strong>Skills to Highlight:</strong>';
    result.missingSkills.forEach(skill => {
      detailsHtml += `<div class="match-item negative">○ ${skill}</div>`;
    });
    detailsHtml += '</div>';
  }

  if (result.recommendation) {
    detailsHtml += `<div class="recommendation">${result.recommendation}</div>`;
  }

  elements.assessmentDetails.innerHTML = detailsHtml;
}

/**
 * Set button loading state
 */
function setButtonLoading(button, loading) {
  if (loading) {
    button.classList.add('loading');
    button.disabled = true;
  } else {
    button.classList.remove('loading');
    button.disabled = false;
  }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', init);
