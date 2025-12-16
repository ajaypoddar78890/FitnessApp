import { Platform } from 'react-native';

// Try to import Health Connect functions
let healthConnectFunctions = null;
try {
  healthConnectFunctions = require('react-native-health-connect');
} catch (error) {
  console.warn('react-native-health-connect module not available:', error.message);
}

class HealthConnectService {
  constructor() {
    this.isInitialized = false;
    this.moduleAvailable = !!healthConnectFunctions;
  }

  async initializeHealthConnect() {
    if (!this.moduleAvailable) {
      throw new Error('Health Connect module is not available. Please check if the package is properly installed and linked.');
    }

    if (Platform.OS !== 'android') {
      throw new Error('Health Connect is only available on Android');
    }

    try {
      console.log('Checking Health Connect SDK status...');
      const { getSdkStatus } = healthConnectFunctions;
      const status = await getSdkStatus();
      console.log('Health Connect SDK status:', status);

      if (status === 'NOT_INSTALLED') {
        throw new Error('Health Connect is not installed on this device. Please install Google Health Connect from the Play Store.');
      } else if (status === 'NOT_SUPPORTED') {
        throw new Error('Health Connect is not supported on this device. Requires Android API 26+');
      }

      console.log('Initializing Health Connect...');
      const { initialize } = healthConnectFunctions;
      await initialize();
      this.isInitialized = true;
      console.log('Health Connect initialized successfully');
      return true;
    } catch (error) {
      console.error('Failed to initialize Health Connect:', error);
      throw error;
    }
  }

  async requestPermissions() {
    if (!this.moduleAvailable) {
      throw new Error('Health Connect module is not available.');
    }

    try {
      if (!this.isInitialized) {
        console.log('Initializing Health Connect before requesting permissions...');
        await this.initializeHealthConnect();
      }

      console.log('Requesting Health Connect permissions...');
      
      // Add timeout and additional error handling
      const { requestPermission } = healthConnectFunctions;
      
      // Check if requestPermission function exists
      if (!requestPermission) {
        throw new Error('Permission request function not available in Health Connect module');
      }

      console.log('Calling requestPermission with Steps access...');
      const grantedPermissions = await requestPermission([
        {
          accessType: 'read',
          recordType: 'Steps',
        },
      ]);

      console.log('Permissions result:', grantedPermissions);

      if (!grantedPermissions || grantedPermissions.length === 0) {
        throw new Error('Permissions not granted. Please allow Health Connect to access your step data.');
      }

      console.log('Health Connect permissions granted successfully');
      return true;
    } catch (error) {
      console.error('Failed to request permissions:', error);
      
      // Provide more specific error messages
      if (error.message.includes('User cancelled')) {
        throw new Error('Permission request was cancelled by user');
      } else if (error.message.includes('denied')) {
        throw new Error('Permissions were denied. Please grant access in Health Connect settings');
      } else {
        throw new Error(`Permission request failed: ${error.message}`);
      }
    }
  }

  async getStepsData(startDate, endDate) {
    if (!this.moduleAvailable) {
      throw new Error('Health Connect module is not available.');
    }

    try {
      if (!this.isInitialized) {
        await this.initializeHealthConnect();
      }

      console.log('Reading steps data from', startDate.toISOString(), 'to', endDate.toISOString());
      const { readRecords } = healthConnectFunctions;
      const records = await readRecords('Steps', {
        timeRangeFilter: {
          operator: 'between',
          startTime: startDate.toISOString(),
          endTime: endDate.toISOString(),
        },
      });

      console.log('Steps records received:', records);

      // Aggregate steps
      const totalSteps = records ? records.reduce((sum, record) => sum + (record.count || 0), 0) : 0;
      console.log('Total steps calculated:', totalSteps);
      return totalSteps;
    } catch (error) {
      console.error('Failed to read steps data:', error);
      throw error;
    }
  }

  async getTodaySteps() {
    const today = new Date();
    const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const endOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 23, 59, 59);

    return await this.getStepsData(startOfDay, endOfDay);
  }

  async openHealthConnectPlayStore() {
    const playStoreUrl = 'https://play.google.com/store/apps/details?id=com.google.android.apps.healthdata';
    
    // For React Native, we can use Linking to open URLs
    const Linking = require('react-native').Linking;
    
    try {
      await Linking.openURL(playStoreUrl);
    } catch (error) {
      console.error('Failed to open Play Store:', error);
      // Fallback: try to open in browser
      try {
        await Linking.openURL(`market://details?id=com.google.android.apps.healthdata`);
      } catch (fallbackError) {
        console.error('Failed to open Play Store fallback:', fallbackError);
      }
    }
  }

  // Check if Health Connect is available
  async isAvailable() {
    if (!this.moduleAvailable) {
      return false;
    }

    try {
      if (Platform.OS !== 'android') {
        return false;
      }

      const { getSdkStatus } = healthConnectFunctions;
      const status = await getSdkStatus();
      console.log('Health Connect SDK status:', status);
      
      // Handle different status codes
      if (status === 0 || status === 'NOT_INSTALLED') {
        console.log('Health Connect is not installed');
        return false;
      } else if (status === 1 || status === 'NOT_SUPPORTED') {
        console.log('Health Connect is not supported on this device');
        return false;
      } else if (status === 2 || status === 'SDK_UNAVAILABLE_PROVIDER_UPDATE_REQUIRED') {
        console.log('Health Connect provider update required');
        return false;
      } else if (status === 3 || status === 'SDK_AVAILABLE') {
        console.log('Health Connect is installed and available');
        return true;
      } else {
        console.log('Unknown Health Connect status:', status, '- treating as not available');
        return false;
      }
    } catch (error) {
      console.error('Error checking Health Connect availability:', error);
      return false;
    }
  }
}

const healthConnectService = new HealthConnectService();

export default healthConnectService;