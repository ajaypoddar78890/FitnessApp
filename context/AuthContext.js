import React, { createContext, useContext, useState, useEffect } from 'react';
import { Alert } from 'react-native';
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
      const savedToken = await storageService.getToken();
      const savedUser = await storageService.getUser();

      if (savedToken && savedUser) {
        setToken(savedToken);
        setUser(savedUser);
        setIsAuthenticated(true);
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
      
      if (response.token && response.user) {
        await storageService.saveToken(response.token);
        await storageService.saveUser(response.user);
        
        setToken(response.token);
        setUser(response.user);
        setIsAuthenticated(true);
        
        return { success: true };
      } else {
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
      
      if (response.token && response.user) {
        await storageService.saveToken(response.token);
        await storageService.saveUser(response.user);
        
        setToken(response.token);
        setUser(response.user);
        setIsAuthenticated(true);
        
        return { success: true };
      } else {
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
      if (token) {
        await authApi.logout(token);
      }
    } catch (error) {
      console.error('Logout API error:', error);
      // Continue with local logout even if API call fails
    } finally {
      await storageService.clearAll();
      setToken(null);
      setUser(null);
      setIsAuthenticated(false);
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