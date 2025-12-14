import React, { createContext, useContext, useEffect, useState } from 'react';
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
    // Initialize with mock data directly - no API calls
    loadMockData();
  }, []);

  const loadMockData = () => {
    setWorkouts([
      {
        id: '1',
        title: 'Morning Cardio',
        level: 'Beginner',
        duration: '15 min',
        category: 'Cardio',
        caloriesBurned: 120,
        date: new Date().toISOString(),
      },
      {
        id: '2',
        title: 'Strength Training',
        level: 'Intermediate',
        duration: '30 min',
        category: 'Gym',
        caloriesBurned: 250,
        date: new Date().toISOString(),
      },
      {
        id: '3',
        title: 'Evening Yoga',
        level: 'Beginner',
        duration: '20 min',
        category: 'Yoga',
        caloriesBurned: 80,
        date: new Date().toISOString(),
      },
    ]);

    setExercises([
      { id: '1', name: 'Push-ups', targetArea: 'Chest', difficulty: 'Beginner' },
      { id: '2', name: 'Squats', targetArea: 'Legs', difficulty: 'Beginner' },
      { id: '3', name: 'Pull-ups', targetArea: 'Back', difficulty: 'Intermediate' },
      { id: '4', name: 'Plank', targetArea: 'Core', difficulty: 'Beginner' },
      { id: '5', name: 'Deadlifts', targetArea: 'Back', difficulty: 'Advanced' },
    ]);
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