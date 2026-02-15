/**
 * RoleWith.AI Extension API Client
 *
 * Handles API calls for features that require backend communication.
 * Currently a placeholder for future Job Assessment feature.
 */

const RoleWithAPI = {
  /**
   * Get stored authentication token.
   * @returns {Promise<string|null>} The auth token or null if not authenticated
   */
  async getAuthToken() {
    // Future: Retrieve token from extension storage
    // return new Promise((resolve) => {
    //   chrome.storage.local.get(['authToken'], (result) => {
    //     resolve(result.authToken || null);
    //   });
    // });
    return null;
  },

  /**
   * Check if user is authenticated.
   * @returns {Promise<boolean>}
   */
  async isAuthenticated() {
    const token = await this.getAuthToken();
    return token !== null;
  },

  /**
   * Perform Job Assessment (Future Feature)
   *
   * Calls the backend to assess how well the user matches a job posting.
   *
   * @param {string} jobUrl - The URL of the job posting
   * @returns {Promise<AssessmentResult>} Assessment results
   *
   * @typedef {Object} AssessmentResult
   * @property {number} matchScore - Overall match percentage (0-100)
   * @property {string} matchLevel - 'excellent' | 'good' | 'fair' | 'poor'
   * @property {string[]} matchingSkills - Skills that match the job
   * @property {string[]} missingSkills - Required skills user doesn't have
   * @property {string[]} strengths - Key strengths for this role
   * @property {string[]} gaps - Areas that could be improved
   * @property {string} recommendation - Brief recommendation text
   */
  async assessJob(jobUrl) {
    if (!CONFIG.FEATURES.JOB_ASSESSMENT) {
      throw new Error('Job Assessment feature is not yet enabled');
    }

    const token = await this.getAuthToken();
    if (!token && CONFIG.FEATURES.REQUIRE_AUTH) {
      throw new Error('Please log in to RoleWith.AI to use Job Assessment');
    }

    const response = await fetch(`${CONFIG.API_URL}${CONFIG.PATHS.ASSESS}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
      },
      body: JSON.stringify({ job_url: jobUrl }),
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error.detail || `Assessment failed: ${response.status}`);
    }

    return response.json();
  },

  /**
   * Store authentication token (called after user logs in)
   * @param {string} token - The auth token to store
   */
  async setAuthToken(token) {
    // Future: Store token in extension storage
    // return new Promise((resolve) => {
    //   chrome.storage.local.set({ authToken: token }, resolve);
    // });
  },

  /**
   * Clear authentication token (logout)
   */
  async clearAuthToken() {
    // Future: Clear token from extension storage
    // return new Promise((resolve) => {
    //   chrome.storage.local.remove(['authToken'], resolve);
    // });
  },
};

// Freeze API object to prevent modification
Object.freeze(RoleWithAPI);
