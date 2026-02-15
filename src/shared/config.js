/**
 * RoleWith.AI Extension Configuration
 *
 * Central configuration for the extension.
 * Modify these values for different environments.
 */

const CONFIG = {
  // Base URL for the RoleWith.AI application
  APP_URL: 'https://www.rolewith.ai',

  // API URL for direct API calls (future: Job Assessment)
  API_URL: 'https://rolewith-api-gateway-main-03ec0e2.zuplo.app',

  // Deep link paths
  PATHS: {
    GENERATE: '/app/generate',
    ASSESS: '/api/v2/job-assessment',  // Future endpoint
  },

  // Feature flags
  FEATURES: {
    // Enable Job Assessment feature (set to true when backend is ready)
    JOB_ASSESSMENT: false,

    // Enable authentication for API calls
    REQUIRE_AUTH: false,
  },

  // Job board detection patterns
  // Used to provide better UX messaging
  JOB_BOARDS: [
    { pattern: /linkedin\.com\/jobs/i, name: 'LinkedIn' },
    { pattern: /indeed\.com/i, name: 'Indeed' },
    { pattern: /glassdoor\.com\/job/i, name: 'Glassdoor' },
    { pattern: /greenhouse\.io/i, name: 'Greenhouse' },
    { pattern: /lever\.co/i, name: 'Lever' },
    { pattern: /myworkday\.com/i, name: 'Workday' },
    { pattern: /ashbyhq\.com/i, name: 'Ashby' },
    { pattern: /jobs\.apple\.com/i, name: 'Apple Jobs' },
    { pattern: /careers\.google\.com/i, name: 'Google Careers' },
    { pattern: /amazon\.jobs/i, name: 'Amazon Jobs' },
    { pattern: /careers\.microsoft\.com/i, name: 'Microsoft Careers' },
  ],

  // URL patterns that are definitely NOT job postings
  EXCLUDED_PATTERNS: [
    /google\.com\/search/i,
    /bing\.com\/search/i,
    /facebook\.com/i,
    /twitter\.com/i,
    /youtube\.com/i,
    /reddit\.com/i,
    /github\.com/i,
    /stackoverflow\.com/i,
  ],
};

// Freeze config to prevent accidental modification
Object.freeze(CONFIG);
Object.freeze(CONFIG.PATHS);
Object.freeze(CONFIG.FEATURES);
Object.freeze(CONFIG.JOB_BOARDS);
Object.freeze(CONFIG.EXCLUDED_PATTERNS);
