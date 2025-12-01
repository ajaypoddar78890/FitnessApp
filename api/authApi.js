import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_BASE_URL, API_ENDPOINTS } from '../constants/api';

/**
 * Authentication API service functions
 */
export const authApi = {
  /**
   * Login user
   * @param {string} email
   * @param {string} password
   * @returns {Promise<{token: string, user: object}>}
   */
  async login(email, password) {
    console.log('🌐 Making login API request to:', `${API_BASE_URL}${API_ENDPOINTS.AUTH.LOGIN}`);
    
    const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.AUTH.LOGIN}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });

    console.log('📡 Login API response status:', response.status);

    if (!response.ok) {
      const data = await response.json();
      console.log('❌ Login API error response:', data);
      throw new Error(data.message || 'Login failed');
    }

    const responseData = await response.json();
    console.log('📦 Login API success response:', responseData);
    console.log('🔑 Response has token?', !!responseData.token);
    console.log('👤 Response has user?', !!responseData.user);
    
    return responseData;
  },

  /**
   * Register new user
   * @param {object} userData - User registration data
   * @returns {Promise<{token: string, user: object}>}
   */
  async register(userData) {
    const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.AUTH.REGISTER}`, {
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
   * Logout user
   * @param {string} token - Authentication token
   */
  async logout(token) {
    const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.AUTH.LOGOUT}`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Logout failed');
    }

    return true;
  },

  /**
   * Refresh authentication token
   * @param {string} refreshToken - Refresh token
   * @returns {Promise<{token: string}>}
   */
  async refreshToken(refreshToken) {
    const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.AUTH.REFRESH}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ refreshToken }),
    });

    if (!response.ok) {
      throw new Error('Token refresh failed');
    }

    return response.json();
  },
};

/**
 * Sign up a new user using the central API base URL and endpoints.
 * @param {string} email
 * @param {string} password
 * @param {string} name
 * @returns {Promise<object>} response data
 */
export async function signUp(email, password, name) {
  const url = `${API_BASE_URL}${API_ENDPOINTS.AUTH.REGISTER}`;

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
}
