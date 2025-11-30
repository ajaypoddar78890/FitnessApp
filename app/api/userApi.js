import { API_BASE_URL } from '../../constants/api';

const USER_ENDPOINTS = {
  PROFILE: '/user/profile',
  STATS: '/user/stats',
  GOALS: '/user/goals',
  ACHIEVEMENTS: '/user/achievements',
};

export const userApi = {
  getProfile: async (token) => {
    try {
      const response = await fetch(`${API_BASE_URL}${USER_ENDPOINTS.PROFILE}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch profile');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Get profile error:', error);
      throw error;
    }
  },

  updateProfile: async (token, profileData) => {
    try {
      const response = await fetch(`${API_BASE_URL}${USER_ENDPOINTS.PROFILE}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(profileData),
      });
      
      if (!response.ok) {
        throw new Error('Failed to update profile');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Update profile error:', error);
      throw error;
    }
  },

  getStats: async (token, period = 'week') => {
    try {
      const response = await fetch(`${API_BASE_URL}${USER_ENDPOINTS.STATS}?period=${period}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch stats');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Get stats error:', error);
      throw error;
    }
  },

  getGoals: async (token) => {
    try {
      const response = await fetch(`${API_BASE_URL}${USER_ENDPOINTS.GOALS}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch goals');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Get goals error:', error);
      throw error;
    }
  },

  updateGoals: async (token, goals) => {
    try {
      const response = await fetch(`${API_BASE_URL}${USER_ENDPOINTS.GOALS}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(goals),
      });
      
      if (!response.ok) {
        throw new Error('Failed to update goals');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Update goals error:', error);
      throw error;
    }
  },

  getAchievements: async (token) => {
    try {
      const response = await fetch(`${API_BASE_URL}${USER_ENDPOINTS.ACHIEVEMENTS}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch achievements');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Get achievements error:', error);
      throw error;
    }
  },
};

export default function UserApiRoute() {
  return null; // This is an API route, not a component
}