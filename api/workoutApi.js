import { API_ENDPOINTS, getApiBaseUrl } from '../constants/api';

/**
 * Workout API service functions
 */
export const workoutApi = {
  /**
   * Get all workouts for the authenticated user
   * @param {string} token - Authentication token
   * @returns {Promise<{workouts: Array}>}
   */
  async getWorkouts(token) {
    const baseUrl = getApiBaseUrl();
    const response = await fetch(`${baseUrl}${API_ENDPOINTS.WORKOUTS.LIST}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch workouts: ${response.statusText}`);
    }

    return response.json();
  },

  /**
   * Get all exercises
   * @param {string} token - Authentication token
   * @returns {Promise<{exercises: Array}>}
   */
  async getExercises(token) {
    const baseUrl = getApiBaseUrl();
    const response = await fetch(`${baseUrl}${API_ENDPOINTS.EXERCISES.LIST}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch exercises: ${response.statusText}`);
    }

    return response.json();
  },

  /**
   * Create a new workout
   * @param {string} token - Authentication token
   * @param {Object} workoutData - Workout data
   * @returns {Promise<{workout: Object}>}
   */
  async createWorkout(token, workoutData) {
    const baseUrl = getApiBaseUrl();
    const response = await fetch(`${baseUrl}${API_ENDPOINTS.WORKOUTS.CREATE}`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(workoutData),
    });

    if (!response.ok) {
      throw new Error(`Failed to create workout: ${response.statusText}`);
    }

    return response.json();
  },

  /**
   * Update an existing workout
   * @param {string} token - Authentication token
   * @param {string} workoutId - Workout ID
   * @param {Object} workoutData - Updated workout data
   * @returns {Promise<{workout: Object}>}
   */
  async updateWorkout(token, workoutId, workoutData) {
    const baseUrl = getApiBaseUrl();
    const url = `${baseUrl}${API_ENDPOINTS.WORKOUTS.UPDATE}`.replace(':id', workoutId);
    
    const response = await fetch(url, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(workoutData),
    });

    if (!response.ok) {
      throw new Error(`Failed to update workout: ${response.statusText}`);
    }

    return response.json();
  },

  /**
   * Delete a workout
   * @param {string} token - Authentication token
   * @param {string} workoutId - Workout ID
   * @returns {Promise<boolean>}
   */
  async deleteWorkout(token, workoutId) {
    const baseUrl = getApiBaseUrl();
    const url = `${baseUrl}${API_ENDPOINTS.WORKOUTS.DELETE}`.replace(':id', workoutId);
    
    const response = await fetch(url, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to delete workout: ${response.statusText}`);
    }

    // Return true for successful deletion
    return true;
  },

  /**
   * Start a workout session
   * @param {string} token - Authentication token
   * @param {string} workoutId - Workout ID
   * @returns {Promise<{session: Object}>}
   */
  async startWorkoutSession(token, workoutId) {
    const baseUrl = getApiBaseUrl();
    const response = await fetch(`${baseUrl}${API_ENDPOINTS.WORKOUTS.SESSIONS}`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ workoutId }),
    });

    if (!response.ok) {
      throw new Error(`Failed to start workout session: ${response.statusText}`);
    }

    return response.json();
  },

  /**
   * End a workout session
   * @param {string} token - Authentication token
   * @param {string} sessionId - Session ID
   * @param {Object} sessionData - Session completion data
   * @returns {Promise<{session: Object}>}
   */
  async endWorkoutSession(token, sessionId, sessionData) {
    const baseUrl = getApiBaseUrl();
    const response = await fetch(`${baseUrl}${API_ENDPOINTS.WORKOUTS.SESSIONS}/${sessionId}/end`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(sessionData),
    });

    if (!response.ok) {
      throw new Error(`Failed to end workout session: ${response.statusText}`);
    }

    return response.json();
  },
};