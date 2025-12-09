// API Configuration
import { Platform } from 'react-native';

// For Android emulator: http://10.0.2.2:4000
// For iOS simulator: http://localhost:4000
// For physical device: use your computer's IP address (e.g., http://192.168.1.9:4000)

const getBaseUrl = () => {
  if (Platform.OS === 'android') {
    // adb reverse tcp:4000 tcp:4000 is active
    // This maps emulator localhost:4000 to host localhost:4000
    return 'http://localhost:4000'; // Android emulator with adb reverse
  } else {
    return 'http://localhost:4000'; // iOS simulator
  }
};

export const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL || getBaseUrl();

// API Endpoints - Matching NestJS Backend
export const API_ENDPOINTS = {
  // Authentication Endpoints (/auth)
  AUTH: {
    REGISTER: '/auth/register',           // POST - Register new user
    LOGIN: '/auth/login',                  // POST - Login with email/password
    FIREBASE_LOGIN: '/auth/firebase-login', // POST - Login via Firebase SSO
    REFRESH: '/auth/refresh',              // POST - Refresh access token
    PROFILE: '/auth/profile',              // GET/PUT - Get/Update current user profile
  },
  
  // User Management Endpoints (/users)
  USERS: {
    ME: '/users/me',                       // GET/PUT/DELETE - Current user details
  },
  
  // Fitness Tracking Endpoints (/fitness-tracking)
  FITNESS: {
    LIVE_WORKOUT: '/fitness-tracking/live-workout',     // POST - Start/end live workout
    WORKOUTS: '/fitness-tracking/workouts',             // GET - Get user's workouts
    SHARE_WORKOUT: '/fitness-tracking/share-workout',   // POST - Share a workout
    SHARED_WORKOUTS: '/fitness-tracking/shared-workouts', // GET - Get shared workouts
    NOTIFICATIONS: '/fitness-tracking/notifications',   // GET/POST - Notifications
  },
  
  // Nutrition Endpoints (/nutrition)
  NUTRITION: {
    MEALS: '/nutrition/meals',             // GET/POST - Get/Add meals
    MEAL: '/nutrition/meals/:id',          // PUT/DELETE - Update/Delete meal
  },
  
  // Workouts Endpoints (/workouts)
  WORKOUTS: {
    LIST: '/workouts',                     // GET - Get user's workouts
    CREATE: '/workouts',                   // POST - Create workout
    UPDATE: '/workouts/:id',               // PUT - Update workout
    DELETE: '/workouts/:id',               // DELETE - Delete workout
  },
  
  // Exercises Endpoints (/exercises)
  EXERCISES: {
    LIST: '/exercises',                    // GET - Get all exercises
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

// Rate limiting info (for reference)
export const RATE_LIMIT = {
  maxRequests: 100,
  windowMs: 60000, // 1 minuter
};