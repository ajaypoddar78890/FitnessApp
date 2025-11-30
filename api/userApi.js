import { API_BASE_URL, API_ENDPOINTS } from '../constants/api';

/**
 * User API service functions
 */
export const userApi = {
  /**
   * Get user statistics
   * @param {string} token - Authentication token
   * @param {string} period - Time period for stats (e.g., 'week', 'month', 'year')
   * @returns {Promise<{stats: object}>}
   */
  async getStats(token, period = 'week') {
    const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.USER.STATS}?period=${period}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch user stats: ${response.statusText}`);
    }

    return response.json();
  },

  /**
   * Get user goals
   * @param {string} token - Authentication token
   * @returns {Promise<{goals: Array}>}
   */
  async getGoals(token) {
    const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.USER.GOALS}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch user goals: ${response.statusText}`);
    }

    return response.json();
  },

  /**
   * Update user goals
   * @param {string} token - Authentication token
   * @param {Array} goals - Updated goals data
   * @returns {Promise<{goals: Array}>}
   */
  async updateGoals(token, goals) {
    const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.USER.GOALS}`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ goals }),
    });

    if (!response.ok) {
      throw new Error(`Failed to update user goals: ${response.statusText}`);
    }

    return response.json();
  },

  /**
   * Get user profile
   * @param {string} token - Authentication token
   * @returns {Promise<{profile: object}>}
   */
  async getProfile(token) {
    const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.USER.PROFILE}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch user profile: ${response.statusText}`);
    }

    return response.json();
  },

  /**
   * Update user profile
   * @param {string} token - Authentication token
   * @param {object} profileData - Updated profile data
   * @returns {Promise<{profile: object}>}
   */
  async updateProfile(token, profileData) {
    const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.USER.PROFILE}`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(profileData),
    });

    if (!response.ok) {
      throw new Error(`Failed to update user profile: ${response.statusText}`);
    }

    return response.json();
  },

  /**
   * Get user achievements
   * @param {string} token - Authentication token
   * @returns {Promise<{achievements: Array}>}
   */
  async getAchievements(token) {
    const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.USER.ACHIEVEMENTS}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch user achievements: ${response.statusText}`);
    }

    return response.json();
  },

  /**
   * Get user preferences
   * @param {string} token - Authentication token
   * @returns {Promise<{preferences: object}>}
   */
  async getPreferences(token) {
    const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.USER.PREFERENCES}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch user preferences: ${response.statusText}`);
    }

    return response.json();
  },

  /**
   * Update user preferences
   * @param {string} token - Authentication token
   * @param {object} preferences - Updated preferences data
   * @returns {Promise<{preferences: object}>}
   */
  async updatePreferences(token, preferences) {
    const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.USER.PREFERENCES}`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(preferences),
    });

    if (!response.ok) {
      throw new Error(`Failed to update user preferences: ${response.statusText}`);
    }

    return response.json();
  },
};