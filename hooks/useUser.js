import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import { userApi } from '../api/userApi';
import { storageService } from '../storage/storageService';

export const useUserStats = (period = 'week') => {
  const { token } = useAuth();
  const [stats, setStats] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const loadStats = useCallback(async (selectedPeriod = period) => {
    try {
      setIsLoading(true);
      setError(null);
      
      const response = await userApi.getStats(token, selectedPeriod);
      setStats(response.stats);
    } catch (error) {
      console.error('Error loading user stats:', error);
      setError('Failed to load statistics');
    } finally {
      setIsLoading(false);
    }
  }, [token, period]);

  useEffect(() => {
    if (token) {
      loadStats();
    }
  }, [token, loadStats]);

  return {
    stats,
    isLoading,
    error,
    loadStats,
    refreshStats: () => loadStats(period),
  };
};

export const useUserGoals = () => {
  const { token } = useAuth();
  const [goals, setGoals] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const loadGoals = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const response = await userApi.getGoals(token);
      setGoals(response.goals || []);
    } catch (error) {
      console.error('Error loading goals:', error);
      setError('Failed to load goals');
    } finally {
      setIsLoading(false);
    }
  }, [token]);

  const updateGoals = useCallback(async (updatedGoals) => {
    try {
      setIsLoading(true);
      
      const response = await userApi.updateGoals(token, updatedGoals);
      if (response.goals) {
        setGoals(response.goals);
        return { success: true };
      } else {
        throw new Error('Invalid response from server');
      }
    } catch (error) {
      console.error('Error updating goals:', error);
      setError('Failed to update goals');
      return { success: false, error: error.message };
    } finally {
      setIsLoading(false);
    }
  }, [token]);

  const addGoal = useCallback(async (goalData) => {
    try {
      const newGoals = [...goals, { ...goalData, id: Date.now() }];
      const result = await updateGoals(newGoals);
      return result;
    } catch (error) {
      console.error('Error adding goal:', error);
      return { success: false, error: error.message };
    }
  }, [goals, updateGoals]);

  const updateGoal = useCallback(async (goalId, goalData) => {
    try {
      const updatedGoals = goals.map(goal =>
        goal.id === goalId ? { ...goal, ...goalData } : goal
      );
      const result = await updateGoals(updatedGoals);
      return result;
    } catch (error) {
      console.error('Error updating goal:', error);
      return { success: false, error: error.message };
    }
  }, [goals, updateGoals]);

  const deleteGoal = useCallback(async (goalId) => {
    try {
      const filteredGoals = goals.filter(goal => goal.id !== goalId);
      const result = await updateGoals(filteredGoals);
      return result;
    } catch (error) {
      console.error('Error deleting goal:', error);
      return { success: false, error: error.message };
    }
  }, [goals, updateGoals]);

  const updateGoalProgress = useCallback(async (goalId, progress) => {
    try {
      const updatedGoals = goals.map(goal =>
        goal.id === goalId ? { ...goal, current: progress } : goal
      );
      setGoals(updatedGoals);
      
      // Save locally first for immediate feedback
      await storageService.saveUserGoals(updatedGoals);
      
      // Then sync with server
      await updateGoals(updatedGoals);
    } catch (error) {
      console.error('Error updating goal progress:', error);
    }
  }, [goals, updateGoals]);

  useEffect(() => {
    if (token) {
      loadGoals();
    }
  }, [token, loadGoals]);

  return {
    goals,
    isLoading,
    error,
    loadGoals,
    addGoal,
    updateGoal,
    deleteGoal,
    updateGoalProgress,
    refreshGoals: loadGoals,
  };
};

export const useUserProfile = () => {
  const { token, user, updateUser } = useAuth();
  const [profile, setProfile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const loadProfile = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const response = await userApi.getProfile(token);
      setProfile(response.profile);
    } catch (error) {
      console.error('Error loading profile:', error);
      setError('Failed to load profile');
      // Fallback to local user data
      setProfile(user);
    } finally {
      setIsLoading(false);
    }
  }, [token, user]);

  const updateProfile = useCallback(async (profileData) => {
    try {
      setIsLoading(true);
      
      const response = await userApi.updateProfile(token, profileData);
      if (response.profile) {
        setProfile(response.profile);
        await updateUser(response.profile);
        return { success: true };
      } else {
        throw new Error('Invalid response from server');
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      setError('Failed to update profile');
      return { success: false, error: error.message };
    } finally {
      setIsLoading(false);
    }
  }, [token, updateUser]);

  useEffect(() => {
    if (token) {
      loadProfile();
    }
  }, [token, loadProfile]);

  return {
    profile,
    isLoading,
    error,
    loadProfile,
    updateProfile,
    refreshProfile: loadProfile,
  };
};

export const useUserAchievements = () => {
  const { token } = useAuth();
  const [achievements, setAchievements] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const loadAchievements = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const response = await userApi.getAchievements(token);
      setAchievements(response.achievements || []);
    } catch (error) {
      console.error('Error loading achievements:', error);
      setError('Failed to load achievements');
    } finally {
      setIsLoading(false);
    }
  }, [token]);

  useEffect(() => {
    if (token) {
      loadAchievements();
    }
  }, [token, loadAchievements]);

  return {
    achievements,
    isLoading,
    error,
    loadAchievements,
    refreshAchievements: loadAchievements,
  };
};

export default {
  useUserStats,
  useUserGoals,
  useUserProfile,
  useUserAchievements,
};