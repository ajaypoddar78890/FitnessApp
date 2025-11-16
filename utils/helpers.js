// Date and Time utilities
export const dateUtils = {
  formatDate: (date, format = 'MM/DD/YYYY') => {
    if (!date) return '';
    const d = new Date(date);
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    const year = d.getFullYear();
    
    switch (format) {
      case 'MM/DD/YYYY':
        return `${month}/${day}/${year}`;
      case 'DD/MM/YYYY':
        return `${day}/${month}/${year}`;
      case 'YYYY-MM-DD':
        return `${year}-${month}-${day}`;
      case 'short':
        return d.toLocaleDateString('en-US', { 
          month: 'short', 
          day: 'numeric' 
        });
      case 'long':
        return d.toLocaleDateString('en-US', { 
          weekday: 'long',
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        });
      default:
        return d.toLocaleDateString();
    }
  },

  formatTime: (seconds) => {
    if (seconds < 60) return `${seconds}s`;
    
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    
    if (minutes < 60) {
      return remainingSeconds > 0 
        ? `${minutes}m ${remainingSeconds}s` 
        : `${minutes}m`;
    }
    
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    
    return remainingMinutes > 0 
      ? `${hours}h ${remainingMinutes}m` 
      : `${hours}h`;
  },

  formatDuration: (minutes) => {
    if (minutes < 60) return `${minutes} min`;
    
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    
    return remainingMinutes > 0 
      ? `${hours}h ${remainingMinutes}min` 
      : `${hours}h`;
  },

  getRelativeTime: (date) => {
    const now = new Date();
    const targetDate = new Date(date);
    const diffInMs = now.getTime() - targetDate.getTime();
    const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
    const diffInHours = Math.floor(diffInMinutes / 60);
    const diffInDays = Math.floor(diffInHours / 24);

    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInHours < 24) return `${diffInHours}h ago`;
    if (diffInDays < 7) return `${diffInDays}d ago`;
    
    return dateUtils.formatDate(date, 'short');
  },

  isToday: (date) => {
    const today = new Date();
    const targetDate = new Date(date);
    return today.toDateString() === targetDate.toDateString();
  },

  isThisWeek: (date) => {
    const now = new Date();
    const targetDate = new Date(date);
    const weekAgo = new Date(now.getTime() - (7 * 24 * 60 * 60 * 1000));
    return targetDate >= weekAgo && targetDate <= now;
  },
};

// Number and formatting utilities
export const formatUtils = {
  formatNumber: (num, decimals = 0) => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(decimals) + 'M';
    }
    if (num >= 1000) {
      return (num / 1000).toFixed(decimals) + 'K';
    }
    return num.toFixed(decimals);
  },

  formatCalories: (calories) => {
    return `${Math.round(calories)} cal`;
  },

  formatWeight: (weight, unit = 'kg') => {
    return `${weight} ${unit}`;
  },

  formatDistance: (distance, unit = 'km') => {
    if (unit === 'km' && distance < 1) {
      return `${Math.round(distance * 1000)} m`;
    }
    return `${distance.toFixed(1)} ${unit}`;
  },

  formatPercentage: (value, total) => {
    if (total === 0) return '0%';
    return `${Math.round((value / total) * 100)}%`;
  },
};

// Validation utilities
export const validationUtils = {
  isValidEmail: (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  },

  isValidPassword: (password) => {
    return password.length >= 6;
  },

  isValidName: (name) => {
    return name.trim().length >= 2;
  },

  isValidAge: (age) => {
    const numAge = parseInt(age);
    return numAge >= 13 && numAge <= 120;
  },

  isValidWeight: (weight) => {
    const numWeight = parseFloat(weight);
    return numWeight > 0 && numWeight <= 1000;
  },

  isValidHeight: (height) => {
    const numHeight = parseFloat(height);
    return numHeight > 0 && numHeight <= 300;
  },
};

// Device and platform utilities
export const deviceUtils = {
  isIOS: () => {
    return Platform.OS === 'ios';
  },

  isAndroid: () => {
    return Platform.OS === 'android';
  },

  getScreenDimensions: () => {
    const { width, height } = Dimensions.get('window');
    return { width, height };
  },

  isSmallScreen: () => {
    const { width, height } = Dimensions.get('window');
    return width < 375 || height < 667;
  },

  isTablet: () => {
    const { width, height } = Dimensions.get('window');
    return Math.min(width, height) > 600;
  },
};

// Array utilities
export const arrayUtils = {
  groupBy: (array, key) => {
    return array.reduce((groups, item) => {
      const group = item[key];
      groups[group] = groups[group] || [];
      groups[group].push(item);
      return groups;
    }, {});
  },

  sortBy: (array, key, direction = 'asc') => {
    return array.sort((a, b) => {
      if (direction === 'asc') {
        return a[key] > b[key] ? 1 : -1;
      } else {
        return a[key] < b[key] ? 1 : -1;
      }
    });
  },

  unique: (array, key) => {
    if (key) {
      return array.filter((item, index, self) => 
        index === self.findIndex(t => t[key] === item[key])
      );
    }
    return [...new Set(array)];
  },

  chunk: (array, size) => {
    const chunks = [];
    for (let i = 0; i < array.length; i += size) {
      chunks.push(array.slice(i, i + size));
    }
    return chunks;
  },
};

// Storage utilities
export const storageUtils = {
  calculateStorageSize: (data) => {
    const jsonString = JSON.stringify(data);
    const bytes = new Blob([jsonString]).size;
    
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  },

  isStorageQuotaExceeded: (error) => {
    return error && (
      error.code === 22 ||
      error.code === 1014 ||
      error.name === 'QuotaExceededError' ||
      error.name === 'NS_ERROR_DOM_QUOTA_REACHED'
    );
  },
};

// Health and fitness utilities
export const fitnessUtils = {
  calculateBMI: (weight, height) => {
    const heightInMeters = height / 100;
    return weight / (heightInMeters * heightInMeters);
  },

  getBMICategory: (bmi) => {
    if (bmi < 18.5) return 'Underweight';
    if (bmi < 25) return 'Normal';
    if (bmi < 30) return 'Overweight';
    return 'Obese';
  },

  estimateCaloriesBurned: (activity, duration, weight) => {
    // MET values for common activities
    const metValues = {
      walking: 3.5,
      jogging: 7.0,
      running: 10.0,
      cycling: 8.0,
      swimming: 6.0,
      weightlifting: 6.0,
      yoga: 3.0,
      dancing: 4.5,
    };

    const met = metValues[activity] || 5.0;
    const weightInKg = weight;
    const durationInHours = duration / 60;

    return Math.round(met * weightInKg * durationInHours);
  },

  calculateOneRepMax: (weight, reps) => {
    if (reps === 1) return weight;
    // Brzycki formula
    return Math.round(weight * (36 / (37 - reps)));
  },

  getIntensityLevel: (heartRate, age) => {
    const maxHeartRate = 220 - age;
    const percentage = (heartRate / maxHeartRate) * 100;

    if (percentage < 50) return 'Very Light';
    if (percentage < 60) return 'Light';
    if (percentage < 70) return 'Moderate';
    if (percentage < 85) return 'Vigorous';
    return 'Maximum';
  },
};

// Error handling utilities
export const errorUtils = {
  getErrorMessage: (error) => {
    if (typeof error === 'string') return error;
    if (error.message) return error.message;
    if (error.error) return error.error;
    return 'An unexpected error occurred';
  },

  isNetworkError: (error) => {
    return error.message?.includes('Network') ||
           error.message?.includes('Failed to fetch') ||
           error.code === 'NETWORK_ERROR';
  },

  isAuthenticationError: (error) => {
    return error.status === 401 || 
           error.status === 403 ||
           error.message?.includes('Unauthorized');
  },
};

export default {
  dateUtils,
  formatUtils,
  validationUtils,
  deviceUtils,
  arrayUtils,
  storageUtils,
  fitnessUtils,
  errorUtils,
};