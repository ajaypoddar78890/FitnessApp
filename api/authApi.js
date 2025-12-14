import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_ENDPOINTS, findWorkingApiUrl, getApiBaseUrl, setApiBaseUrl } from '../constants/api';

/**
 * Authentication API service functions
 * Matches NestJS backend endpoints
 */
export const authApi = {
  /**
   * Login user with email/password
   * @param {string} email
   * @param {string} password
   * @returns {Promise<{accessToken: string, refreshToken: string, user: object}>}
   */
  async login(email, password) {
    let baseUrl = getApiBaseUrl();
    console.log('🌐 Making login API request to:', `${baseUrl}${API_ENDPOINTS.AUTH.LOGIN}`);

    const attemptLogin = async (url) => {
      const res = await fetch(`${url}${API_ENDPOINTS.AUTH.LOGIN}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      return res;
    };

    try {
      // If baseUrl is localhost or an emulator address, attempt auto-detection first
      if (!baseUrl || baseUrl.includes('localhost') || baseUrl.includes('127.0.0.1') || baseUrl.includes('10.0.2.2')) {
        const detected = await findWorkingApiUrl();
        if (detected && detected !== baseUrl) {
          setApiBaseUrl(detected);
          baseUrl = detected;
          console.log('Login: using detected base url before initial attempt:', baseUrl);
        }
      }

      let response = await attemptLogin(baseUrl);
      console.log('📡 Login API response status:', response.status);

      if (!response.ok) {
        const data = await response.json();
        console.log('❌ Login API error response:', data);
        throw new Error(data.message || 'Login failed');
      }

      const responseData = await response.json();
      console.log('📦 Login API success response:', responseData);
      console.log('🔑 Response has accessToken?', !!responseData.accessToken);
      console.log('👤 Response has user?', !!responseData.user);
      return responseData;
    } catch (initialErr) {
      console.warn('Login: initial request failed:', initialErr.message || initialErr);
      // Try auto-detection and retry once
      try {
        const fallback = await findWorkingApiUrl();
        if (fallback && fallback !== baseUrl) {
          console.log('Login: found fallback API host:', fallback);
          setApiBaseUrl(fallback);
          baseUrl = fallback;
          const retryResponse = await attemptLogin(baseUrl);
          console.log('📡 Login API response status (retry):', retryResponse.status);
          if (!retryResponse.ok) {
            const data = await retryResponse.json();
            console.log('❌ Login API error response (retry):', data);
            throw new Error(data.message || 'Login failed (retry)');
          }
          return await retryResponse.json();
        }
      } catch (fallbackErr) {
        console.warn('Login: fallback detection/retry failed:', fallbackErr.message || fallbackErr);
      }
      throw initialErr;
    }
  },

  /**
   * Login via Firebase SSO
   * @param {string} idToken - Firebase ID token
   * @returns {Promise<{accessToken: string, refreshToken: string, user: object}>}
   */
  async firebaseLogin(idToken) {
    console.log('🔥 Making Firebase login API request');
    
    const baseUrl = getApiBaseUrl();
    const response = await fetch(`${baseUrl}${API_ENDPOINTS.AUTH.FIREBASE_LOGIN}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ idToken }),
    });

    if (!response.ok) {
      const data = await response.json();
      throw new Error(data.message || 'Firebase login failed');
    }

    return response.json();
  },

  /**
   * Register new user
   * @param {object} userData - { email, password, name, photo? }
   * @returns {Promise<{accessToken: string, refreshToken: string, user: object}>}
   */
  async register(userData) {
    const baseUrl = getApiBaseUrl();
    const response = await fetch(`${baseUrl}${API_ENDPOINTS.AUTH.REGISTER}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    });

    if (!response.ok) {
      const data = await response.json();
      throw new Error(data.message || 'Registration failed');
    }

    return response.json();
  },

  /**
   * Refresh access token
   * @param {string} refreshToken - Refresh token
   * @returns {Promise<{accessToken: string}>}
   */
  async refreshToken(refreshToken) {
    const baseUrl = getApiBaseUrl();
    const response = await fetch(`${baseUrl}${API_ENDPOINTS.AUTH.REFRESH}`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${refreshToken}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Token refresh failed');
    }

    return response.json();
  },

  /**
   * Get current user profile (requires JWT)
   * @param {string} accessToken - Access token
   * @returns {Promise<object>} User profile
   */
  async getProfile(accessToken) {
    const baseUrl = getApiBaseUrl();
    const fullUrl = `${baseUrl}${API_ENDPOINTS.AUTH.PROFILE}`;
    console.log('🔗 Full API URL (GET):', fullUrl);
    console.log('📨 HTTP Method: GET');
    console.log('🔑 Authorization: Bearer [TOKEN]');
    
    const response = await fetch(fullUrl, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const data = await response.json();
      throw new Error(data.message || 'Failed to get profile');
    }

    return response.json();
  },

  /**
   * Update user profile (requires JWT)
   * @param {string} accessToken - Access token
   * @param {object} profileData - { name?, photo? }
   * @returns {Promise<object>} Updated profile
   */
  async updateProfile(accessToken, profileData) {
    const baseUrl = getApiBaseUrl();
    const fullUrl = `${baseUrl}${API_ENDPOINTS.AUTH.PROFILE}`;
    console.log('🔗 Full API URL:', fullUrl);
    console.log('📨 HTTP Method: PUT');
    console.log('🔑 Authorization: Bearer [TOKEN]');
    console.log('📦 Request Body:', JSON.stringify(profileData, null, 2));
    
    const response = await fetch(fullUrl, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(profileData),
    });

    if (!response.ok) {
      const data = await response.json();
      throw new Error(data.message || 'Failed to update profile');
    }

    return response.json();
  },

  /**
   * Update user fitness profile (weight, fitness goals, etc.)
   * @param {string} accessToken - Access token
   * @param {object} fitnessData - { weight?, fitnessGoal?, height? }
   * @returns {Promise<object>} Updated fitness profile
   */
  async updateFitnessProfile(accessToken, fitnessData) {
    const baseUrl = getApiBaseUrl();
    const fullUrl = `${baseUrl}${API_ENDPOINTS.AUTH.FITNESS_PROFILE}`;
    console.log('🔗 Full API URL:', fullUrl);
    console.log('📨 HTTP Method: PUT');
    console.log('🔑 Authorization: Bearer [TOKEN]');
    console.log('📦 Request Body:', JSON.stringify(fitnessData, null, 2));
    
    const response = await fetch(fullUrl, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(fitnessData),
    });

    if (!response.ok) {
      const data = await response.json();
      throw new Error(data.message || 'Failed to update fitness profile');
    }

    return response.json();
  },

  /**
   * Sign up new user
   * @param {string} email
   * @param {string} password
   * @param {string} name
   * @returns {Promise<object>} response data
   */
  async signUp(email, password, name) {
  const url = `${getApiBaseUrl()}${API_ENDPOINTS.AUTH.REGISTER}`;

  try {
    console.log('SignUp: Making request to:', url);
    console.log('SignUp: Request payload:', { email, password: '***', name });
    
    // Create a timeout promise
    const timeoutPromise = new Promise((_, reject) => {
      setTimeout(() => reject(new Error('Request timeout after 10 seconds')), 10000);
    });

    // Create the fetch promise
    const fetchPromise = fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email,
        password,
        name,
      }),
    });

    console.log('SignUp: Waiting for response...');
    
    // Race between fetch and timeout
    const response = await Promise.race([fetchPromise, timeoutPromise]);

    console.log('SignUp: Response received!');
    console.log('SignUp: Response status:', response.status);
    console.log('SignUp: Response ok:', response.ok);

    // Check if response is JSON
    const contentType = response.headers.get('content-type');
    console.log('SignUp: Content-Type:', contentType);

    if (!contentType || !contentType.includes('application/json')) {
      const text = await response.text();
      console.log('SignUp: Non-JSON response:', text);
      throw new Error('Server returned non-JSON response: ' + text);
    }

    const data = await response.json();
    console.log('SignUp: Response data:', data);

    if (response.ok) {
      // Store the access token for future requests
      if (data.accessToken) {
        await AsyncStorage.setItem('accessToken', data.accessToken);
        console.log('SignUp: Access token stored');
      }

      console.log('SignUp: Success!');
      return data;
    }

    const message = data && data.message ? data.message : 'Sign up failed';
    throw new Error(message);
  } catch (error) {
    // Normalize unknown errors
    console.log('SignUp: Error occurred:', error);
    const errMsg = error instanceof Error ? error.message : String(error);
    console.error('signUp error:', errMsg);
    
    // Check if it's a network error
    if (errMsg.includes('Network request failed') || errMsg.includes('fetch')) {
      throw new Error('Cannot connect to server. Make sure your backend is running on http://10.0.2.2:4000');
    }
    
    throw new Error(errMsg);
  }
},

  /**
   * Logout user
   * @returns {Promise<void>}
   */
  async logout() {
    try {
      const baseUrl = getApiBaseUrl();
      const token = await AsyncStorage.getItem('accessToken');

      console.log('🚪 Making logout API request to:', `${baseUrl}${API_ENDPOINTS.AUTH.LOGOUT}`);

      const response = await fetch(`${baseUrl}${API_ENDPOINTS.AUTH.LOGOUT}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': token ? `Bearer ${token}` : ''
        },
        body: '{}' // Empty JSON body as required by the endpoint
      });

      if (response.ok) {
        console.log('✅ Logout API success');
      } else {
        console.log('⚠️ Logout API returned non-OK status:', response.status);
      }

      // Clear stored tokens regardless of API response
      await AsyncStorage.removeItem('accessToken');
      await AsyncStorage.removeItem('refreshToken');
      console.log('🧹 Cleared stored tokens');

    } catch (error) {
      console.log('❌ Logout API error:', error);
      // Even if API call fails, clear local tokens
      try {
        await AsyncStorage.removeItem('accessToken');
        await AsyncStorage.removeItem('refreshToken');
        console.log('🧹 Cleared stored tokens despite API error');
      } catch (storageError) {
        console.log('❌ Failed to clear stored tokens:', storageError);
      }
      throw error;
    }
  },

  /**
   * Get authentication headers for API requests
   * @returns {Promise<{Authorization?: string}>}
   */
  async getAuthHeaders() {
    try {
      const token = await AsyncStorage.getItem('accessToken');
      if (token) {
        return { Authorization: `Bearer ${token}` };
      }
    } catch (error) {
      console.log('❌ Error getting auth token:', error);
    }
    return {};
  }
};
