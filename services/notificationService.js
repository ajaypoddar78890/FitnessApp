import { Notifications } from 'expo-notifications';
import { Platform } from 'react-native';
import { storageService } from '../storage/storageService';

// Configure notification behavior
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

class NotificationService {
  constructor() {
    this.isInitialized = false;
    this.notificationSettings = null;
  }

  async initialize() {
    if (this.isInitialized) return;

    try {
      await this.requestPermissions();
      await this.loadSettings();
      this.isInitialized = true;
    } catch (error) {
      console.error('Failed to initialize notifications:', error);
    }
  }

  async requestPermissions() {
    try {
      const { status: existingStatus } = await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;

      if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }

      if (finalStatus !== 'granted') {
        console.warn('Notification permissions not granted');
        return false;
      }

      if (Platform.OS === 'android') {
        await Notifications.setNotificationChannelAsync('workout-reminders', {
          name: 'Workout Reminders',
          importance: Notifications.AndroidImportance.HIGH,
          vibrationPattern: [0, 250, 250, 250],
          lightColor: '#6366F1',
        });

        await Notifications.setNotificationChannelAsync('rest-timer', {
          name: 'Rest Timer',
          importance: Notifications.AndroidImportance.HIGH,
          vibrationPattern: [0, 250, 250, 250],
          lightColor: '#10B981',
        });
      }

      return true;
    } catch (error) {
      console.error('Error requesting notification permissions:', error);
      return false;
    }
  }

  async loadSettings() {
    try {
      const settings = await storageService.getSettings();
      this.notificationSettings = settings.notifications || {
        workoutReminders: true,
        restTimerAlerts: true,
        goalReminders: true,
        achievements: true,
        workoutReminderTime: '18:00', // 6 PM
        restDays: [0, 6], // Sunday and Saturday
      };
    } catch (error) {
      console.error('Error loading notification settings:', error);
      this.notificationSettings = {
        workoutReminders: true,
        restTimerAlerts: true,
        goalReminders: true,
        achievements: true,
        workoutReminderTime: '18:00',
        restDays: [0, 6],
      };
    }
  }

  async saveSettings(newSettings) {
    try {
      this.notificationSettings = { ...this.notificationSettings, ...newSettings };
      const allSettings = await storageService.getSettings();
      await storageService.saveSettings({
        ...allSettings,
        notifications: this.notificationSettings,
      });
    } catch (error) {
      console.error('Error saving notification settings:', error);
    }
  }

  async scheduleWorkoutReminder(workoutName, scheduleDate) {
    if (!this.notificationSettings?.workoutReminders) return null;

    try {
      const trigger = new Date(scheduleDate);
      
      const identifier = await Notifications.scheduleNotificationAsync({
        content: {
          title: 'Time to Work Out! 💪',
          body: `Your ${workoutName} workout is scheduled now. Let's get moving!`,
          sound: 'default',
          priority: Notifications.AndroidImportance.HIGH,
          categoryIdentifier: 'workout-reminder',
        },
        trigger,
      });

      return identifier;
    } catch (error) {
      console.error('Error scheduling workout reminder:', error);
      return null;
    }
  }

  async scheduleDailyWorkoutReminder() {
    if (!this.notificationSettings?.workoutReminders) return null;

    try {
      const [hour, minute] = this.notificationSettings.workoutReminderTime.split(':');
      
      const identifier = await Notifications.scheduleNotificationAsync({
        content: {
          title: 'Daily Workout Reminder 🏃‍♂️',
          body: "Don't forget to exercise today! Your body will thank you.",
          sound: 'default',
          priority: Notifications.AndroidImportance.DEFAULT,
        },
        trigger: {
          hour: parseInt(hour),
          minute: parseInt(minute),
          repeats: true,
        },
      });

      return identifier;
    } catch (error) {
      console.error('Error scheduling daily workout reminder:', error);
      return null;
    }
  }

  async scheduleRestTimer(duration) {
    if (!this.notificationSettings?.restTimerAlerts) return null;

    try {
      const identifier = await Notifications.scheduleNotificationAsync({
        content: {
          title: 'Rest Time Over! ⏰',
          body: 'Time to get back to your workout. You got this!',
          sound: 'default',
          vibrate: [0, 250, 250, 250],
          priority: Notifications.AndroidImportance.HIGH,
          categoryIdentifier: 'rest-timer',
        },
        trigger: {
          seconds: duration,
        },
      });

      return identifier;
    } catch (error) {
      console.error('Error scheduling rest timer:', error);
      return null;
    }
  }

  async sendWorkoutCompletionNotification(workoutName, duration, calories) {
    if (!this.notificationSettings?.achievements) return;

    try {
      await Notifications.scheduleNotificationAsync({
        content: {
          title: 'Workout Complete! 🎉',
          body: `Great job on completing ${workoutName}! ${duration} minutes, ${calories} calories burned.`,
          sound: 'default',
          priority: Notifications.AndroidImportance.DEFAULT,
        },
        trigger: null, // Send immediately
      });
    } catch (error) {
      console.error('Error sending workout completion notification:', error);
    }
  }

  async sendGoalAchievedNotification(goalName) {
    if (!this.notificationSettings?.achievements) return;

    try {
      await Notifications.scheduleNotificationAsync({
        content: {
          title: 'Goal Achieved! 🏆',
          body: `Congratulations! You've reached your ${goalName} goal. Keep up the amazing work!`,
          sound: 'default',
          priority: Notifications.AndroidImportance.DEFAULT,
        },
        trigger: null,
      });
    } catch (error) {
      console.error('Error sending goal achieved notification:', error);
    }
  }

  async sendStreakNotification(streakDays) {
    if (!this.notificationSettings?.achievements) return;

    try {
      let message = '';
      if (streakDays === 7) {
        message = 'One full week of workouts! 🔥';
      } else if (streakDays === 30) {
        message = 'One month streak! You\'re on fire! 🚀';
      } else if (streakDays === 100) {
        message = '100 day streak! You\'re a fitness legend! 👑';
      } else if (streakDays % 10 === 0) {
        message = `${streakDays} day streak! Keep it up! 💪`;
      } else {
        return; // Only send for milestone streaks
      }

      await Notifications.scheduleNotificationAsync({
        content: {
          title: 'Streak Milestone!',
          body: message,
          sound: 'default',
          priority: Notifications.AndroidImportance.DEFAULT,
        },
        trigger: null,
      });
    } catch (error) {
      console.error('Error sending streak notification:', error);
    }
  }

  async cancelNotification(identifier) {
    try {
      await Notifications.cancelScheduledNotificationAsync(identifier);
    } catch (error) {
      console.error('Error canceling notification:', error);
    }
  }

  async cancelAllNotifications() {
    try {
      await Notifications.cancelAllScheduledNotificationsAsync();
    } catch (error) {
      console.error('Error canceling all notifications:', error);
    }
  }

  async getScheduledNotifications() {
    try {
      return await Notifications.getAllScheduledNotificationsAsync();
    } catch (error) {
      console.error('Error getting scheduled notifications:', error);
      return [];
    }
  }

  async clearBadgeCount() {
    try {
      await Notifications.setBadgeCountAsync(0);
    } catch (error) {
      console.error('Error clearing badge count:', error);
    }
  }

  // Get notification settings for UI
  getSettings() {
    return this.notificationSettings;
  }

  // Update specific setting
  async updateSetting(key, value) {
    await this.saveSettings({ [key]: value });
  }
}

export const notificationService = new NotificationService();