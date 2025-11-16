import React, { createContext, useContext, useState, useEffect } from 'react';
import { Alert } from 'react-native';
import { workoutApi } from '../api/workoutApi';
import { storageService } from '../storage/storageService';
import { useAuth } from './AuthContext';

const WorkoutContext = createContext();

export const useWorkout = () => {
  const context = useContext(WorkoutContext);
  if (!context) {
    throw new Error('useWorkout must be used within a WorkoutProvider');
  }
  return context;
};

export const WorkoutProvider = ({ children }) => {
  const { token, isAuthenticated } = useAuth();
  const [workouts, setWorkouts] = useState([]);
  const [exercises, setExercises] = useState([]);
  const [activeWorkout, setActiveWorkout] = useState(null);
  const [workoutSession, setWorkoutSession] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (isAuthenticated && token) {
      loadWorkouts();
      loadExercises();
    }
  }, [isAuthenticated, token]);

  const loadWorkouts = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await workoutApi.getWorkouts(token);
      setWorkouts(response.workouts || []);
    } catch (error) {
      console.error('Error loading workouts:', error);
      setError('Failed to load workouts');
    } finally {
      setIsLoading(false);
    }
  };

  const loadExercises = async () => {
    try {
      const response = await workoutApi.getExercises(token);
      setExercises(response.exercises || []);
    } catch (error) {
      console.error('Error loading exercises:', error);
      // Don't set error for exercises as it's not critical
    }
  };

  const createWorkout = async (workoutData) => {
    try {
      setIsLoading(true);
      const response = await workoutApi.createWorkout(token, workoutData);
      
      if (response.workout) {
        setWorkouts(prevWorkouts => [...prevWorkouts, response.workout]);
        return { success: true, workout: response.workout };
      } else {
        throw new Error('Invalid response from server');
      }
    } catch (error) {
      console.error('Error creating workout:', error);
      setError('Failed to create workout');
      return { success: false, error: error.message };
    } finally {
      setIsLoading(false);
    }
  };

  const updateWorkout = async (workoutId, workoutData) => {
    try {
      setIsLoading(true);
      const response = await workoutApi.updateWorkout(token, workoutId, workoutData);
      
      if (response.workout) {
        setWorkouts(prevWorkouts =>
          prevWorkouts.map(workout =>
            workout.id === workoutId ? response.workout : workout
          )
        );
        return { success: true, workout: response.workout };
      } else {
        throw new Error('Invalid response from server');
      }
    } catch (error) {
      console.error('Error updating workout:', error);
      setError('Failed to update workout');
      return { success: false, error: error.message };
    } finally {
      setIsLoading(false);
    }
  };

  const deleteWorkout = async (workoutId) => {
    try {
      setIsLoading(true);
      const success = await workoutApi.deleteWorkout(token, workoutId);
      
      if (success) {
        setWorkouts(prevWorkouts =>
          prevWorkouts.filter(workout => workout.id !== workoutId)
        );
        
        // Clear active workout if it was deleted
        if (activeWorkout && activeWorkout.id === workoutId) {
          setActiveWorkout(null);
        }
        
        return { success: true };
      } else {
        throw new Error('Failed to delete workout');
      }
    } catch (error) {
      console.error('Error deleting workout:', error);
      setError('Failed to delete workout');
      return { success: false, error: error.message };
    } finally {
      setIsLoading(false);
    }
  };

  const startWorkout = async (workout) => {
    try {
      setIsLoading(true);
      const response = await workoutApi.startWorkoutSession(token, workout.id);
      
      if (response.session) {
        setActiveWorkout(workout);
        setWorkoutSession(response.session);
        
        // Save session to local storage for recovery
        await storageService.saveWorkoutSession(response.session);
        
        return { success: true, session: response.session };
      } else {
        throw new Error('Failed to start workout session');
      }
    } catch (error) {
      console.error('Error starting workout:', error);
      setError('Failed to start workout');
      return { success: false, error: error.message };
    } finally {
      setIsLoading(false);
    }
  };

  const endWorkout = async (sessionData) => {
    try {
      if (!workoutSession) {
        throw new Error('No active workout session');
      }

      setIsLoading(true);
      const response = await workoutApi.endWorkoutSession(
        token,
        workoutSession.id,
        sessionData
      );
      
      if (response.session) {
        // Update workout with completion data
        const completedWorkout = {
          ...activeWorkout,
          lastPerformed: new Date().toISOString(),
          completed: true,
        };
        
        setWorkouts(prevWorkouts =>
          prevWorkouts.map(workout =>
            workout.id === activeWorkout.id ? completedWorkout : workout
          )
        );
        
        setActiveWorkout(null);
        setWorkoutSession(null);
        
        // Clear session from local storage
        await storageService.clearWorkoutSession();
        
        return { success: true, session: response.session };
      } else {
        throw new Error('Failed to end workout session');
      }
    } catch (error) {
      console.error('Error ending workout:', error);
      setError('Failed to end workout');
      return { success: false, error: error.message };
    } finally {
      setIsLoading(false);
    }
  };

  const pauseWorkout = () => {
    if (workoutSession) {
      const updatedSession = {
        ...workoutSession,
        isPaused: true,
        pausedAt: new Date().toISOString(),
      };
      setWorkoutSession(updatedSession);
      storageService.saveWorkoutSession(updatedSession);
    }
  };

  const resumeWorkout = () => {
    if (workoutSession) {
      const updatedSession = {
        ...workoutSession,
        isPaused: false,
        pausedAt: null,
      };
      setWorkoutSession(updatedSession);
      storageService.saveWorkoutSession(updatedSession);
    }
  };

  const getWorkoutById = (workoutId) => {
    return workouts.find(workout => workout.id === workoutId);
  };

  const clearError = () => {
    setError(null);
  };

  const value = {
    workouts,
    exercises,
    activeWorkout,
    workoutSession,
    isLoading,
    error,
    loadWorkouts,
    loadExercises,
    createWorkout,
    updateWorkout,
    deleteWorkout,
    startWorkout,
    endWorkout,
    pauseWorkout,
    resumeWorkout,
    getWorkoutById,
    clearError,
  };

  return (
    <WorkoutContext.Provider value={value}>
      {children}
    </WorkoutContext.Provider>
  );
};