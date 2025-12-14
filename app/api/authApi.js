import { API_ENDPOINTS, findWorkingApiUrl, getApiBaseUrl, setApiBaseUrl } from '../../constants/api';

/**
 * Authentication API service functions
 * Matches NestJS backend /auth endpoints
 */
export const authApi = {
  /**
   * Login with email/password
   */
  login: async (email, password) => {
    let baseUrl = getApiBaseUrl();
    console.log('🌐 Making login API request to:', `${baseUrl}${API_ENDPOINTS.AUTH.LOGIN}`);

    const attemptLogin = async (url) => {
      const response = await fetch(`${url}${API_ENDPOINTS.AUTH.LOGIN}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });
      return response;
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

      // Try initial baseUrl
      let response = await attemptLogin(baseUrl);
      console.log('📡 Login API response status:', response.status);

      if (!response.ok) {
        const data = await response.json();
        console.log('❌ Login API error response:', data);
        throw new Error(data.message || 'Login failed');
      }

      return await response.json();
    } catch (initialErr) {
      console.warn('Login: initial request failed:', initialErr.message || initialErr);
      // Try to detect a working host and retry once
      try {
        const fallback = await findWorkingApiUrl();
        if (fallback && fallback !== baseUrl) {
          console.log('Login: found fallback API host:', fallback);
          setApiBaseUrl(fallback);
          baseUrl = fallback;
          const response = await attemptLogin(baseUrl);
          console.log('📡 Login API response status (retry):', response.status);
          if (!response.ok) {
            const data = await response.json();
            console.log('❌ Login API error response (retry):', data);
            throw new Error(data.message || 'Login failed (retry)');
          }
          return await response.json();
        }
      } catch (fallbackErr) {
        console.warn('Login: fallback detection failed or retry failed:', fallbackErr.message || fallbackErr);
      }
      // If we got here, rethrow the initial error
      console.error('Login error:', initialErr);
      throw initialErr;
    }
  },

  /**
   * Login via Firebase SSO
   */
  firebaseLogin: async (idToken) => {
    try {
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
      
      return await response.json();
    } catch (error) {
      console.error('Firebase login error:', error);
      throw error;
    }
  },

  /**
   * Register new user
   */
  register: async (userData) => {
    try {
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
      
      return await response.json();
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
  },

  /**
   * Refresh access token
   */
  refreshToken: async (refreshToken) => {
    try {
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
      
      return await response.json();
    } catch (error) {
      console.error('Token refresh error:', error);
      throw error;
    }
  },

  /**
   * Get current user profile (requires JWT)
   */
  getProfile: async (accessToken) => {
    try {
      const baseUrl = getApiBaseUrl();
      const response = await fetch(`${baseUrl}${API_ENDPOINTS.AUTH.PROFILE}`, {
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
      
      return await response.json();
    } catch (error) {
      console.error('Get profile error:', error);
      throw error;
    }
  },

  /**
   * Update user profile (requires JWT)
   */
  updateProfile: async (accessToken, profileData) => {
    try {
      const baseUrl = getApiBaseUrl();
      const response = await fetch(`${baseUrl}${API_ENDPOINTS.AUTH.PROFILE}`, {
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
      
      return await response.json();
    } catch (error) {
      console.error('Update profile error:', error);
      throw error;
    }
  },
};

export default function AuthApiRoute() {
  return null; // This is an API route, not a component
}
