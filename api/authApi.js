import { API_BASE_URL } from '../constants/api';

const AUTH_ENDPOINTS = {
  LOGIN: '/auth/login',
  REGISTER: '/auth/register',
  LOGOUT: '/auth/logout',
  REFRESH: '/auth/refresh',
};

export const authApi = {
  login: async (email, password) => {
    try {
      const response = await fetch(`${API_BASE_URL}${AUTH_ENDPOINTS.LOGIN}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });
      
      if (!response.ok) {
        throw new Error('Login failed');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  },

  register: async (userData) => {
    try {
      const response = await fetch(`${API_BASE_URL}${AUTH_ENDPOINTS.REGISTER}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });
      
      if (!response.ok) {
        throw new Error('Registration failed');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
  },

  logout: async (token) => {
    try {
      const response = await fetch(`${API_BASE_URL}${AUTH_ENDPOINTS.LOGOUT}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      
      return response.ok;
    } catch (error) {
      console.error('Logout error:', error);
      throw error;
    }
  },

  refreshToken: async (refreshToken) => {
    try {
      const response = await fetch(`${API_BASE_URL}${AUTH_ENDPOINTS.REFRESH}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ refreshToken }),
      });
      
      if (!response.ok) {
        throw new Error('Token refresh failed');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Token refresh error:', error);
      throw error;
    }
  },
};