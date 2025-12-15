import Toast from 'react-native-toast-message';
import { storageService } from '../storage/storageService';

class NotificationService {
  constructor() {
    this.isInitialized = false;
    this.notificationSettings = null;
  }

  async initialize() {
    if (this.isInitialized) return;

    try {
      await this.loadSettings();
      this.isInitialized = true;
    } catch (error) {
      console.error('Failed to initialize notifications:', error);
    }
  }

  async requestPermissions() {
    // For now, we'll assume permissions are granted since we're using in-app toasts
    // In a real push notification setup, you'd request permissions here
    return true;
  }

  async loadSettings() {
    try {
      this.notificationSettings = await storageService.getData('notificationSettings') || {
        workoutReminders: true,
        dailyGoals: true,
        achievements: true,
        restTimerAlerts: true,
        goalReminders: true,
        workoutReminderTime: '18:00',
        restDays: [0, 6],
      };
    } catch (error) {
      console.error('Failed to load notification settings:', error);
      this.notificationSettings = {
        workoutReminders: true,
        dailyGoals: true,
        achievements: true,
        restTimerAlerts: true,
        goalReminders: true,
        workoutReminderTime: '18:00',
        restDays: [0, 6],
      };
    }
  }

  async saveSettings(settings) {
    try {
      this.notificationSettings = { ...this.notificationSettings, ...settings };
      await storageService.storeData('notificationSettings', this.notificationSettings);
    } catch (error) {
      console.error('Failed to save notification settings:', error);
    }
  }

  // Show in-app notification using Toast
  showNotification(title, message, type = 'info') {
    Toast.show({
      type: type, // 'success', 'error', 'info'
      text1: title,
      text2: message,
      position: 'top',
      visibilityTime: 4000,
      autoHide: true,
    });
  }

  // Workout reminder notification
  showWorkoutReminder(message = 'Time for your workout!') {
    if (this.notificationSettings?.workoutReminders) {
      this.showNotification('Workout Reminder', message, 'info');
    }
  }

  // Daily goal achievement notification
  showGoalAchieved(goalType, value) {
    if (this.notificationSettings?.dailyGoals) {
      this.showNotification(
        'Goal Achieved! 🎉',
        `You've reached your ${goalType} goal: ${value}`,
        'success'
      );
    }
  }

  // Achievement unlocked notification
  showAchievementUnlocked(achievementName, description) {
    if (this.notificationSettings?.achievements) {
      this.showNotification(
        'Achievement Unlocked! 🏆',
        `${achievementName}: ${description}`,
        'success'
      );
    }
  }

  // Rest timer notification
  showRestTimerFinished() {
    if (this.notificationSettings?.restTimerAlerts) {
      this.showNotification('Rest Time Over! ⏰', 'Time to get back to your workout!', 'info');
    }
  }

  // Workout completion notification
  showWorkoutCompleted(workoutName, duration, calories) {
    if (this.notificationSettings?.achievements) {
      this.showNotification(
        'Workout Complete! 🎉',
        `Great job on ${workoutName}! ${duration} min, ${calories} cal burned.`,
        'success'
      );
    }
  }

  // Generic success notification
  showSuccess(title, message) {
    this.showNotification(title, message, 'success');
  }

  // Generic error notification
  showError(title, message) {
    this.showNotification(title, message, 'error');
  }

  // Generic info notification
  showInfo(title, message) {
    this.showNotification(title, message, 'info');
  }

  // Get current settings
  getSettings() {
    return this.notificationSettings;
  }

  // Schedule a local notification (placeholder for future push notification implementation)
  async scheduleNotification(title, message, date) {
    // For now, just show immediate toast
    // In future, implement with react-native-push-notification
    console.log(`Scheduled notification: ${title} - ${message} at ${date}`);
    this.showNotification(title, message, 'info');
  }

  // Cancel scheduled notification (placeholder)
  async cancelNotification(notificationId) {
    console.log(`Cancelled notification: ${notificationId}`);
  }

  // Schedule workout reminder (placeholder)
  async scheduleWorkoutReminder(workoutName, scheduleDate) {
    if (!this.notificationSettings?.workoutReminders) return null;
    console.log(`Scheduling workout reminder for ${workoutName} at ${scheduleDate}`);
    return 'placeholder_id';
  }

  // Schedule daily workout reminder (placeholder)
  async scheduleDailyWorkoutReminder() {
    if (!this.notificationSettings?.workoutReminders) return null;
    console.log(`Scheduling daily workout reminder at ${this.notificationSettings.workoutReminderTime}`);
    return 'daily_reminder_id';
  }

  // Schedule rest timer (placeholder)
  async scheduleRestTimer(duration) {
    if (!this.notificationSettings?.restTimerAlerts) return null;
    console.log(`Scheduling rest timer for ${duration} seconds`);
    // Simulate the timer with setTimeout for now
    setTimeout(() => {
      this.showRestTimerFinished();
    }, duration * 1000);
    return 'rest_timer_id';
  }

  // Send workout completion notification
  async sendWorkoutCompletionNotification(workoutName, duration, calories) {
    this.showWorkoutCompleted(workoutName, duration, calories);
  }

  // Send goal achieved notification
  async sendGoalAchievedNotification(goalName) {
    this.showGoalAchieved(goalName, 'Congratulations!');
  }
}

export const notificationService = new NotificationService();