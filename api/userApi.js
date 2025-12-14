import { API_ENDPOINTS, getApiBaseUrl } from '../constants/api';

/**
 * User API service functions
 * Matches NestJS backend /users endpoints
 */
export const userApi = {
  /**
   * Get current user details (requires JWT)
   * @param {string} token - Access token
   * @returns {Promise<object>} User details
   */
  async getMe(token) {
    const baseUrl = getApiBaseUrl();
    const response = await fetch(`${baseUrl}${API_ENDPOINTS.USERS.ME}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const data = await response.json();
      throw new Error(data.message || 'Failed to fetch user details');
    }

    return response.json();
  },

  /**
   * Update current user info (requires JWT)
   * @param {string} token - Access token
   * @param {object} userData - Updated user data
   * @returns {Promise<object>} Updated user
   */
  async updateMe(token, userData) {
    const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.USERS.ME}`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    });

    if (!response.ok) {
      const data = await response.json();
      throw new Error(data.message || 'Failed to update user');
    }

    return response.json();
  },

  /**
   * Delete current user account (requires JWT)
   * @param {string} token - Access token
   * @returns {Promise<boolean>}
   */
  async deleteMe(token) {
    const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.USERS.ME}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const data = await response.json();
      throw new Error(data.message || 'Failed to delete account');
    }

    return true;
  },

  // Legacy methods kept for backward compatibility - map to new endpoints
  async getProfile(token) {
    return this.getMe(token);
  },

  async updateProfile(token, profileData) {
    return this.updateMe(token, profileData);
  },
};