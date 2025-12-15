import { Platform } from 'react-native';
import {
    getSdkStatus,
    initialize,
    openHealthConnectSettings,
    readRecords,
    requestPermission,
} from 'react-native-health-connect';

class HealthConnectService {
  constructor() {
    this.isInitialized = false;
  }

  async initializeHealthConnect() {
    if (Platform.OS !== 'android') {
      throw new Error('Health Connect is only available on Android');
    }

    try {
      const status = await getSdkStatus();
      if (status === 'NOT_INSTALLED') {
        throw new Error('Health Connect is not installed on this device');
      } else if (status === 'NOT_SUPPORTED') {
        throw new Error('Health Connect is not supported on this device');
      }

      await initialize();
      this.isInitialized = true;
      console.log('Health Connect initialized successfully');
    } catch (error) {
      console.error('Failed to initialize Health Connect:', error);
      throw error;
    }
  }

  async requestPermissions() {
    if (!this.isInitialized) {
      await this.initializeHealthConnect();
    }

    try {
      const grantedPermissions = await requestPermission([
        {
          accessType: 'read',
          recordType: 'Steps',
        },
      ]);

      if (grantedPermissions.length === 0) {
        throw new Error('Permissions not granted');
      }

      console.log('Health Connect permissions granted');
      return true;
    } catch (error) {
      console.error('Failed to request permissions:', error);
      throw error;
    }
  }

  async getStepsData(startDate, endDate) {
    if (!this.isInitialized) {
      await this.initializeHealthConnect();
    }

    try {
      const records = await readRecords('Steps', {
        timeRangeFilter: {
          operator: 'between',
          startTime: startDate.toISOString(),
          endTime: endDate.toISOString(),
        },
      });

      // Aggregate steps
      const totalSteps = records.reduce((sum, record) => sum + record.count, 0);
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

  async openSettings() {
    try {
      await openHealthConnectSettings();
    } catch (error) {
      console.error('Failed to open Health Connect settings:', error);
      throw error;
    }
  }
}

const healthConnectService = new HealthConnectService();

export default healthConnectService;