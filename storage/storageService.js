import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEYS = {
  TOKEN: '@fitness_app:token',
  REFRESH_TOKEN: '@fitness_app:refresh_token',
  USER: '@fitness_app:user',
  WORKOUT_SESSION: '@fitness_app:workout_session',
  USER_GOALS: '@fitness_app:user_goals',
  SETTINGS: '@fitness_app:settings',
  ONBOARDING: '@fitness_app:onboarding_completed',
  OFFLINE_DATA: '@fitness_app:offline_data',
};

export const storageService = {
  // Authentication
  async saveToken(token) {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.TOKEN, token);
    } catch (error) {
      console.error('Error saving token:', error);
      throw error;
    }
  },

  async getToken() {
    try {
      return await AsyncStorage.getItem(STORAGE_KEYS.TOKEN);
    } catch (error) {
      console.error('Error getting token:', error);
      return null;
    }
  },

  async saveRefreshToken(refreshToken) {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, refreshToken);
    } catch (error) {
      console.error('Error saving refresh token:', error);
      throw error;
    }
  },

  async getRefreshToken() {
    try {
      return await AsyncStorage.getItem(STORAGE_KEYS.REFRESH_TOKEN);
    } catch (error) {
      console.error('Error getting refresh token:', error);
      return null;
    }
  },

  // User Data
  async saveUser(user) {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
    } catch (error) {
      console.error('Error saving user:', error);
      throw error;
    }
  },

  async getUser() {
    try {
      const user = await AsyncStorage.getItem(STORAGE_KEYS.USER);
      return user ? JSON.parse(user) : null;
    } catch (error) {
      console.error('Error getting user:', error);
      return null;
    }
  },

  // Workout Session
  async saveWorkoutSession(session) {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.WORKOUT_SESSION, JSON.stringify(session));
    } catch (error) {
      console.error('Error saving workout session:', error);
      throw error;
    }
  },

  async getWorkoutSession() {
    try {
      const session = await AsyncStorage.getItem(STORAGE_KEYS.WORKOUT_SESSION);
      return session ? JSON.parse(session) : null;
    } catch (error) {
      console.error('Error getting workout session:', error);
      return null;
    }
  },

  async clearWorkoutSession() {
    try {
      await AsyncStorage.removeItem(STORAGE_KEYS.WORKOUT_SESSION);
    } catch (error) {
      console.error('Error clearing workout session:', error);
    }
  },

  // User Goals
  async saveUserGoals(goals) {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.USER_GOALS, JSON.stringify(goals));
    } catch (error) {
      console.error('Error saving user goals:', error);
      throw error;
    }
  },

  async getUserGoals() {
    try {
      const goals = await AsyncStorage.getItem(STORAGE_KEYS.USER_GOALS);
      return goals ? JSON.parse(goals) : [];
    } catch (error) {
      console.error('Error getting user goals:', error);
      return [];
    }
  },

  // App Settings
  async saveSettings(settings) {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
    } catch (error) {
      console.error('Error saving settings:', error);
      throw error;
    }
  },

  async getSettings() {
    try {
      const settings = await AsyncStorage.getItem(STORAGE_KEYS.SETTINGS);
      return settings ? JSON.parse(settings) : {};
    } catch (error) {
      console.error('Error getting settings:', error);
      return {};
    }
  },

  // Onboarding
  async setOnboardingCompleted(completed = true) {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.ONBOARDING, JSON.stringify(completed));
    } catch (error) {
      console.error('Error setting onboarding status:', error);
    }
  },

  async isOnboardingCompleted() {
    try {
      const completed = await AsyncStorage.getItem(STORAGE_KEYS.ONBOARDING);
      return completed ? JSON.parse(completed) : false;
    } catch (error) {
      console.error('Error getting onboarding status:', error);
      return false;
    }
  },

  // Offline Data
  async saveOfflineData(data) {
    try {
      const existingData = await this.getOfflineData();
      const updatedData = { ...existingData, ...data };
      await AsyncStorage.setItem(STORAGE_KEYS.OFFLINE_DATA, JSON.stringify(updatedData));
    } catch (error) {
      console.error('Error saving offline data:', error);
      throw error;
    }
  },

  async getOfflineData() {
    try {
      const data = await AsyncStorage.getItem(STORAGE_KEYS.OFFLINE_DATA);
      return data ? JSON.parse(data) : {};
    } catch (error) {
      console.error('Error getting offline data:', error);
      return {};
    }
  },

  async clearOfflineData() {
    try {
      await AsyncStorage.removeItem(STORAGE_KEYS.OFFLINE_DATA);
    } catch (error) {
      console.error('Error clearing offline data:', error);
    }
  },

  // Utility Methods
  async clearAll() {
    try {
      await AsyncStorage.multiRemove([
        STORAGE_KEYS.TOKEN,
        STORAGE_KEYS.REFRESH_TOKEN,
        STORAGE_KEYS.USER,
        STORAGE_KEYS.WORKOUT_SESSION,
        STORAGE_KEYS.USER_GOALS,
      ]);
    } catch (error) {
      console.error('Error clearing storage:', error);
      throw error;
    }
  },

  async getAllKeys() {
    try {
      return await AsyncStorage.getAllKeys();
    } catch (error) {
      console.error('Error getting all keys:', error);
      return [];
    }
  },

  async getStorageSize() {
    try {
      const keys = await this.getAllKeys();
      const appKeys = keys.filter(key => key.startsWith('@fitness_app:'));
      let totalSize = 0;

      for (const key of appKeys) {
        const value = await AsyncStorage.getItem(key);
        if (value) {
          totalSize += new Blob([value]).size;
        }
      }

      return {
        keys: appKeys.length,
        size: totalSize,
        sizeFormatted: this.formatBytes(totalSize),
      };
    } catch (error) {
      console.error('Error calculating storage size:', error);
      return { keys: 0, size: 0, sizeFormatted: '0 B' };
    }
  },

  formatBytes(bytes, decimals = 2) {
    if (bytes === 0) return '0 B';

    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['B', 'KB', 'MB', 'GB'];

    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
  },
};