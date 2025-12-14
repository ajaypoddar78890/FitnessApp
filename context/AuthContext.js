import React, { createContext, useContext, useEffect, useState } from 'react';
import { authApi } from '../api/authApi';
import { storageService } from '../storage/storageService';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    checkAuthState();
  }, []);

  const checkAuthState = async () => {
    try {
      setIsLoading(true);
      console.log('🔍 Checking for persisted authentication...');
      
      const savedToken = await storageService.getToken();
      const savedUser = await storageService.getUser();

      console.log('💾 Stored auth data found:', {
        hasToken: !!savedToken,
        hasUser: !!savedUser,
        userEmail: savedUser?.email || 'N/A'
      });

      if (savedToken && savedUser) {
        setToken(savedToken);
        setUser(savedUser);
        setIsAuthenticated(true);
        console.log('✅ Authentication restored from storage - user stays logged in');
      } else {
        console.log('❌ No valid authentication found - user needs to login');
      }
    } catch (error) {
      console.error('Error checking auth state:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (email, password) => {
    try {
      setIsLoading(true);
      const response = await authApi.login(email, password);
      
      // Handle both 'token' and 'accessToken' from backend
      const token = response.token || response.accessToken;
      const refreshToken = response.refreshToken;
      
      if (token && response.user) {
        await storageService.saveToken(token);
        await storageService.saveUser(response.user);
        
        // Save refresh token if available
        if (refreshToken) {
          await storageService.saveRefreshToken(refreshToken);
          console.log('💾 Refresh token saved for persistence');
        }
        
        setToken(token);
        setUser(response.user);
        setIsAuthenticated(true);
        
        console.log('💾 User credentials persisted - will stay logged in after app restart');
        return { success: true };
      } else {
        console.log('❌ Missing required fields in response:', {
          hasToken: !!token,
          hasUser: !!response.user,
          responseKeys: Object.keys(response)
        });
        throw new Error('Invalid response from server');
      }
    } catch (error) {
      console.error('Login error:', error);
      return { 
        success: false, 
        error: error.message || 'Login failed' 
      };
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (userData) => {
    try {
      setIsLoading(true);
      const response = await authApi.register(userData);
      
      // Handle both 'token' and 'accessToken' from backend
      const token = response.token || response.accessToken;
      const refreshToken = response.refreshToken;
      
      if (token && response.user) {
        await storageService.saveToken(token);
        await storageService.saveUser(response.user);
        
        // Save refresh token if available
        if (refreshToken) {
          await storageService.saveRefreshToken(refreshToken);
          console.log('💾 Refresh token saved during registration');
        }
        
        setToken(token);
        setUser(response.user);
        setIsAuthenticated(true);
        
        console.log('💾 Registration successful - credentials persisted');
        return { success: true };
      } else {
        console.log('❌ Missing required fields in registration response:', {
          hasToken: !!token,
          hasUser: !!response.user,
          responseKeys: Object.keys(response)
        });
        throw new Error('Invalid response from server');
      }
    } catch (error) {
      console.error('Registration error:', error);
      return { 
        success: false, 
        error: error.message || 'Registration failed' 
      };
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      console.log('🚪 Starting logout process...');
      
      if (token) {
        console.log('📤 Calling logout API...');
        await authApi.logout(token);
        console.log('✅ Logout API call successful');
      } else {
        console.log('⚠️ No token found, proceeding with local logout');
      }
    } catch (error) {
      console.error('❌ Logout API error:', error);
      // Continue with local logout even if API call fails
    } finally {
      console.log('🧹 Clearing local storage and state...');
      await storageService.clearAll();
      setToken(null);
      setUser(null);
      setIsAuthenticated(false);
      
      console.log('🔄 User logged out');
      // Navigation is handled by AppNavigator based on isAuthenticated state
      console.log('✅ Logout process completed');
    }
  };

  const updateUser = async (userData) => {
    try {
      const updatedUser = { ...user, ...userData };
      await storageService.saveUser(updatedUser);
      setUser(updatedUser);
      return { success: true };
    } catch (error) {
      console.error('Update user error:', error);
      return { 
        success: false, 
        error: error.message || 'Failed to update user' 
      };
    }
  };

  const refreshToken = async () => {
    try {
      const refreshTokenValue = await storageService.getRefreshToken();
      if (!refreshTokenValue) {
        throw new Error('No refresh token available');
      }

      const response = await authApi.refreshToken(refreshTokenValue);
      
      if (response.token) {
        await storageService.saveToken(response.token);
        setToken(response.token);
        return response.token;
      } else {
        throw new Error('Invalid refresh response');
      }
    } catch (error) {
      console.error('Token refresh error:', error);
      await logout();
      throw error;
    }
  };

  const value = {
    user,
    token,
    isLoading,
    isAuthenticated,
    login,
    register,
    logout,
    updateUser,
    refreshToken,
    checkAuthState,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};