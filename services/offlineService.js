import NetInfo from '@react-native-netinfo/netinfo';
import { storageService } from '../storage/storageService';

class OfflineService {
  constructor() {
    this.isConnected = true;
    this.listeners = [];
    this.pendingRequests = [];
    this.retryQueue = [];
  }

  async initialize() {
    try {
      // Listen for network state changes
      this.unsubscribe = NetInfo.addEventListener(state => {
        const wasConnected = this.isConnected;
        this.isConnected = state.isConnected;
        
        if (!wasConnected && this.isConnected) {
          this.onConnected();
        } else if (wasConnected && !this.isConnected) {
          this.onDisconnected();
        }
        
        this.notifyListeners(state);
      });

      // Check initial connection state
      const netInfo = await NetInfo.fetch();
      this.isConnected = netInfo.isConnected;
    } catch (error) {
      console.error('Error initializing offline service:', error);
    }
  }

  addConnectionListener(callback) {
    this.listeners.push(callback);
    
    // Return unsubscribe function
    return () => {
      this.listeners = this.listeners.filter(listener => listener !== callback);
    };
  }

  notifyListeners(connectionState) {
    this.listeners.forEach(callback => {
      try {
        callback(connectionState);
      } catch (error) {
        console.error('Error in connection listener:', error);
      }
    });
  }

  async onConnected() {
    console.log('Device reconnected - syncing offline data');
    
    try {
      await this.syncOfflineData();
      await this.retryFailedRequests();
    } catch (error) {
      console.error('Error syncing offline data:', error);
    }
  }

  onDisconnected() {
    console.log('Device disconnected - enabling offline mode');
  }

  async saveOfflineWorkout(workout) {
    try {
      const offlineData = await storageService.getOfflineData();
      const workouts = offlineData.workouts || [];
      
      const offlineWorkout = {
        ...workout,
        id: `offline_${Date.now()}`,
        isOffline: true,
        timestamp: new Date().toISOString(),
      };
      
      workouts.push(offlineWorkout);
      
      await storageService.saveOfflineData({
        ...offlineData,
        workouts,
      });
      
      return offlineWorkout;
    } catch (error) {
      console.error('Error saving offline workout:', error);
      throw error;
    }
  }

  async saveOfflineWorkoutSession(session) {
    try {
      const offlineData = await storageService.getOfflineData();
      const sessions = offlineData.sessions || [];
      
      const offlineSession = {
        ...session,
        id: `offline_session_${Date.now()}`,
        isOffline: true,
        timestamp: new Date().toISOString(),
      };
      
      sessions.push(offlineSession);
      
      await storageService.saveOfflineData({
        ...offlineData,
        sessions,
      });
      
      return offlineSession;
    } catch (error) {
      console.error('Error saving offline session:', error);
      throw error;
    }
  }

  async saveOfflineGoalUpdate(goalUpdate) {
    try {
      const offlineData = await storageService.getOfflineData();
      const goalUpdates = offlineData.goalUpdates || [];
      
      const offlineGoalUpdate = {
        ...goalUpdate,
        id: `offline_goal_${Date.now()}`,
        isOffline: true,
        timestamp: new Date().toISOString(),
      };
      
      goalUpdates.push(offlineGoalUpdate);
      
      await storageService.saveOfflineData({
        ...offlineData,
        goalUpdates,
      });
      
      return offlineGoalUpdate;
    } catch (error) {
      console.error('Error saving offline goal update:', error);
      throw error;
    }
  }

  async queueRequest(request) {
    try {
      const offlineData = await storageService.getOfflineData();
      const pendingRequests = offlineData.pendingRequests || [];
      
      const queuedRequest = {
        ...request,
        id: `pending_${Date.now()}`,
        timestamp: new Date().toISOString(),
      };
      
      pendingRequests.push(queuedRequest);
      
      await storageService.saveOfflineData({
        ...offlineData,
        pendingRequests,
      });
      
      return queuedRequest;
    } catch (error) {
      console.error('Error queuing request:', error);
      throw error;
    }
  }

  async syncOfflineData() {
    try {
      const offlineData = await storageService.getOfflineData();
      
      if (!offlineData || Object.keys(offlineData).length === 0) {
        return { success: true, message: 'No offline data to sync' };
      }

      const results = {
        workouts: [],
        sessions: [],
        goalUpdates: [],
        errors: [],
      };

      // Sync offline workouts
      if (offlineData.workouts?.length) {
        for (const workout of offlineData.workouts) {
          try {
            // Here you would call your API to sync the workout
            // const synced = await workoutApi.createWorkout(token, workout);
            results.workouts.push({ id: workout.id, status: 'synced' });
          } catch (error) {
            results.errors.push({ 
              type: 'workout', 
              id: workout.id, 
              error: error.message 
            });
          }
        }
      }

      // Sync offline sessions
      if (offlineData.sessions?.length) {
        for (const session of offlineData.sessions) {
          try {
            // Here you would call your API to sync the session
            // const synced = await workoutApi.saveSession(token, session);
            results.sessions.push({ id: session.id, status: 'synced' });
          } catch (error) {
            results.errors.push({ 
              type: 'session', 
              id: session.id, 
              error: error.message 
            });
          }
        }
      }

      // Sync offline goal updates
      if (offlineData.goalUpdates?.length) {
        for (const goalUpdate of offlineData.goalUpdates) {
          try {
            // Here you would call your API to sync the goal update
            // const synced = await userApi.updateGoals(token, goalUpdate);
            results.goalUpdates.push({ id: goalUpdate.id, status: 'synced' });
          } catch (error) {
            results.errors.push({ 
              type: 'goal', 
              id: goalUpdate.id, 
              error: error.message 
            });
          }
        }
      }

      // Clear successfully synced data
      if (results.errors.length === 0) {
        await storageService.clearOfflineData();
      } else {
        // Keep only the data that failed to sync
        const failedWorkouts = offlineData.workouts?.filter(w => 
          results.errors.some(e => e.type === 'workout' && e.id === w.id)
        ) || [];
        
        const failedSessions = offlineData.sessions?.filter(s => 
          results.errors.some(e => e.type === 'session' && e.id === s.id)
        ) || [];
        
        const failedGoalUpdates = offlineData.goalUpdates?.filter(g => 
          results.errors.some(e => e.type === 'goal' && e.id === g.id)
        ) || [];
        
        await storageService.saveOfflineData({
          workouts: failedWorkouts,
          sessions: failedSessions,
          goalUpdates: failedGoalUpdates,
          pendingRequests: offlineData.pendingRequests || [],
        });
      }

      return {
        success: true,
        results,
        message: `Synced ${results.workouts.length + results.sessions.length + results.goalUpdates.length} items. ${results.errors.length} failed.`,
      };
    } catch (error) {
      console.error('Error syncing offline data:', error);
      return {
        success: false,
        error: error.message,
      };
    }
  }

  async retryFailedRequests() {
    try {
      const offlineData = await storageService.getOfflineData();
      const pendingRequests = offlineData.pendingRequests || [];
      
      if (pendingRequests.length === 0) return;

      const results = [];
      const stillPending = [];

      for (const request of pendingRequests) {
        try {
          // Attempt to retry the request
          // This would depend on your specific API structure
          // await fetch(request.url, request.options);
          results.push({ id: request.id, status: 'completed' });
        } catch (error) {
          stillPending.push(request);
          results.push({ 
            id: request.id, 
            status: 'failed', 
            error: error.message 
          });
        }
      }

      // Update pending requests with only the ones that still failed
      await storageService.saveOfflineData({
        ...offlineData,
        pendingRequests: stillPending,
      });

      return results;
    } catch (error) {
      console.error('Error retrying failed requests:', error);
      return [];
    }
  }

  async getOfflineStats() {
    try {
      const offlineData = await storageService.getOfflineData();
      
      return {
        workouts: offlineData.workouts?.length || 0,
        sessions: offlineData.sessions?.length || 0,
        goalUpdates: offlineData.goalUpdates?.length || 0,
        pendingRequests: offlineData.pendingRequests?.length || 0,
      };
    } catch (error) {
      console.error('Error getting offline stats:', error);
      return {
        workouts: 0,
        sessions: 0,
        goalUpdates: 0,
        pendingRequests: 0,
      };
    }
  }

  isOnline() {
    return this.isConnected;
  }

  isOffline() {
    return !this.isConnected;
  }

  destroy() {
    if (this.unsubscribe) {
      this.unsubscribe();
    }
    this.listeners = [];
    this.pendingRequests = [];
    this.retryQueue = [];
  }
}

export const offlineService = new OfflineService();