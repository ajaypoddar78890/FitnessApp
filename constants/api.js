// API Configuration
// For Android emulator: http://10.0.2.2:4000
// For iOS simulator: http://localhost:4000
// For physical device: use your computer's IP address (e.g., http://192.168.1.100:4000)
export const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL || 'http://192.168.1.34:4000';

// API Endpoints
export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    LOGOUT: '/auth/logout',
    REFRESH: '/auth/refresh',
    FORGOT_PASSWORD: '/auth/forgot-password',
    RESET_PASSWORD: '/auth/reset-password',
  },
  USER: {
    PROFILE: '/user/profile',
    STATS: '/user/stats',
    GOALS: '/user/goals',
    ACHIEVEMENTS: '/user/achievements',
    PREFERENCES: '/user/preferences',
  },
  WORKOUTS: {
    LIST: '/workouts',
    CREATE: '/workouts',
    UPDATE: '/workouts/:id',
    DELETE: '/workouts/:id',
    SESSIONS: '/workouts/sessions',
  },
  EXERCISES: {
    LIST: '/exercises',
    SEARCH: '/exercises/search',
    CATEGORIES: '/exercises/categories',
  },
};

// Request timeout
export const REQUEST_TIMEOUT = 30000; // 30 seconds

// Retry configuration
export const RETRY_CONFIG = {
  maxRetries: 3,
  retryDelay: 1000, // 1 second
  retryDelayMultiplier: 2,
};