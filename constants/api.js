// API Configuration
import { Platform } from 'react-native';

// For Android emulator: http://10.0.2.2:4000
// For iOS simulator: http://localhost:4000
// For physical device: use your computer's IP address (e.g., http://192.168.1.9:4000)

const getBaseUrl = () => {
  if (Platform.OS === 'android') {
    // For Android, we'll use auto-detection from Metro bundler
    // This will automatically get your computer's current IP
    return 'http://localhost:4000'; // Fallback, will be auto-detected
  } else {
    return 'http://localhost:4000'; // iOS simulator
  }
};

/**
 * Try to get API URL from runtime environment. We're not using `expo-constants` so
 * we fallback in this order:
 * 1. `process.env.EXPO_PUBLIC_API_URL` (if the bundler injected it)
 * 2. Derive from React Native packager `NativeModules.SourceCode.scriptURL` (dev only) and use port 4000
 * 3. Null (so a subsequent fallback function can be used)
 */
const getEnvApiUrl = () => {
  if (typeof process !== 'undefined' && process.env && process.env.EXPO_PUBLIC_API_URL) {
    try { console.log('API detection: process.env.EXPO_PUBLIC_API_URL present', process.env.EXPO_PUBLIC_API_URL); } catch(e) {}
    return process.env.EXPO_PUBLIC_API_URL;
  }

  // If running inside a dev environment, we can inspect the packager script URL
  // Example scriptURL: http://192.168.1.5:8081/index.bundle?platform=android&dev=true&minify=false
  try {
    // require react-native dynamically (safe for bundler)
    const { NativeModules } = require('react-native');
    const scriptURL = NativeModules?.SourceCode?.scriptURL || null;
    try { console.log('API detection: scriptURL from NativeModules:', scriptURL); } catch(e) {}
    if (scriptURL) {
      const match = scriptURL.match(/^(https?):\/\/([^:\/]+)(?::(\d+))?/);
      if (match) {
        const protocol = match[1] || 'http';
        const host = match[2];
        
        // Skip localhost/127.0.0.1 for physical devices - they won't work
        if (Platform.OS === 'android' && (host === 'localhost' || host === '127.0.0.1')) {
          console.log('⚠️  Detected localhost from Metro - skipping for physical device');
          return null;
        }
        
        // We assume the backend runs on port 4000 in dev (same IP as packager host)
        return `${protocol}://${host}:4000`;
      }
    }
  } catch (err) {
    // ignore
  }

  return null;
};

// Export a mutable API base and accessors so other modules can update it when
// auto-detection finds a working backend host (e.g., on physical device).
let _API_BASE_URL = null;

// Initialize with auto-detection on startup
const initializeApiUrl = () => {
  // Try auto-detection first
  const envUrl = getEnvApiUrl();
  if (envUrl) {
    console.log('🚀 Initial API URL from auto-detection:', envUrl);
    return envUrl;
  }
  
  // Fallback to platform-specific default
  const fallback = getBaseUrl();
  console.log('🏠 Using fallback API URL:', fallback);
  return fallback;
};

_API_BASE_URL = initializeApiUrl();

export function getApiBaseUrl() { return _API_BASE_URL; }
export function setApiBaseUrl(newUrl) { 
  console.log('🔄 API URL updated to:', newUrl);
  _API_BASE_URL = newUrl; 
}

// Candidate hosts to try (in priority order)
function buildCandidateList() {
  const candidates = [];
  
  // 1) Auto-detect from Metro bundler (only if not localhost for Android)
  try {
    const { NativeModules } = require('react-native');
    const scriptURL = NativeModules?.SourceCode?.scriptURL || null;
    console.log('🔍 Metro bundler scriptURL:', scriptURL);
    if (scriptURL) {
      const m = scriptURL.match(/^(https?):\/\/([^:\/]+)(?::(\d+))?/);
      if (m) {
        const protocol = m[1] || 'http';
        const host = m[2];
        
        // Skip localhost for Android physical devices
        if (Platform.OS === 'android' && (host === 'localhost' || host === '127.0.0.1')) {
          console.log('⚠️  Skipping localhost Metro URL for Android device');
        } else {
          const metroUrl = `${protocol}://${host}:4000`;
          console.log(`🎯 Auto-detected computer IP: ${metroUrl}`);
          candidates.push(metroUrl);
        }
      }
    }
  } catch (_) {}

  // 2) Known working IP for Android physical devices (your previous working IP)
  if (Platform.OS === 'android') {
    const knownWorkingIp = 'http://192.168.1.5:4000';
    console.log(`📱 Adding known working Android IP: ${knownWorkingIp}`);
    if (!candidates.includes(knownWorkingIp)) {
      candidates.push(knownWorkingIp);
    }
  }

  // 3) Local dev override file - if present, export DEV_API_URL
  try { 
    const { DEV_API_URL } = require('./dev.local'); 
    if (DEV_API_URL) {
      console.log('📝 Using dev.local override:', DEV_API_URL);
      if (!candidates.includes(DEV_API_URL)) {
        candidates.push(DEV_API_URL);
      }
    }
  } catch (e) {}
  
  // 4) Explicit env var
  const envUrl = getEnvApiUrl();
  if (envUrl) {
    console.log('🔧 Using environment URL:', envUrl);
    if (!candidates.includes(envUrl)) {
      candidates.push(envUrl);
    }
  }

  // 5) Common emulator fallbacks (lower priority)
  const emulatorCandidates = [
    'http://10.0.2.2:4000', // Android emulator (default)
    'http://10.0.3.2:4000', // Genymotion
    'http://127.0.0.1:4000',
    'http://localhost:4000',
  ];
  for (const c of emulatorCandidates) {
    if (!candidates.includes(c)) {
      candidates.push(c);
    }
  }

  console.log('📋 All API candidates:', candidates);
  return candidates;
}

// Finds the first candidate that responds (not network error) to a GET to '/'
export async function findWorkingApiUrl(timeoutMs = 2000) {
  const candidates = buildCandidateList();
  // eslint-disable-next-line no-console
  console.log('API detection: trying candidates', candidates);

  for (const candidate of candidates) {
    try {
      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), timeoutMs);
      const res = await fetch(candidate + '/', { method: 'GET', signal: controller.signal });
      clearTimeout(timer);
      if (res) {
        // If we got a response (even 404) it's reachable
        // eslint-disable-next-line no-console
        console.log('API detection: reachable', candidate, 'status', res.status);
        return candidate;
      }
    } catch (e) {
      // network error or timeout - continue
    }
  }
  return null;
}

// Debug log
try { console.log('📡 Initial API_BASE_URL:', _API_BASE_URL); } catch(e) {}

// Helpful debug logging for development
try {
  // eslint-disable-next-line no-console
  console.log('📡 Selected API_BASE_URL at module load:', _API_BASE_URL);
} catch (e) {}

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