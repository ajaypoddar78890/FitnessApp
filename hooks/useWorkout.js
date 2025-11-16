import { useState, useEffect, useCallback } from 'react';
import { useWorkout } from '../context/WorkoutContext';
import { useAuth } from '../context/AuthContext';
import { workoutApi } from '../api/workoutApi';

export const useWorkoutTimer = (initialTime = 0) => {
  const [time, setTime] = useState(initialTime);
  const [isActive, setIsActive] = useState(false);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    let interval = null;
    if (isActive && !isPaused) {
      interval = setInterval(() => {
        setTime(time => time + 1);
      }, 1000);
    } else if (!isActive && time !== 0) {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isActive, isPaused, time]);

  const start = useCallback(() => {
    setIsActive(true);
    setIsPaused(false);
  }, []);

  const pause = useCallback(() => {
    setIsPaused(true);
  }, []);

  const stop = useCallback(() => {
    setIsActive(false);
    setIsPaused(false);
  }, []);

  const reset = useCallback(() => {
    setTime(0);
    setIsActive(false);
    setIsPaused(false);
  }, []);

  return {
    time,
    isActive,
    isPaused,
    start,
    pause,
    stop,
    reset,
  };
};

export const useRestTimer = (restDuration = 60) => {
  const [restTime, setRestTime] = useState(0);
  const [isResting, setIsResting] = useState(false);

  useEffect(() => {
    let interval = null;
    if (isResting && restTime > 0) {
      interval = setInterval(() => {
        setRestTime(time => {
          if (time <= 1) {
            setIsResting(false);
            return 0;
          }
          return time - 1;
        });
      }, 1000);
    } else if (!isResting) {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isResting, restTime]);

  const startRest = useCallback((duration = restDuration) => {
    setRestTime(duration);
    setIsResting(true);
  }, [restDuration]);

  const stopRest = useCallback(() => {
    setIsResting(false);
    setRestTime(0);
  }, []);

  const skipRest = useCallback(() => {
    setIsResting(false);
    setRestTime(0);
  }, []);

  return {
    restTime,
    isResting,
    startRest,
    stopRest,
    skipRest,
  };
};

export const useWorkoutSession = () => {
  const { token } = useAuth();
  const {
    activeWorkout,
    workoutSession,
    startWorkout: contextStartWorkout,
    endWorkout: contextEndWorkout,
    pauseWorkout,
    resumeWorkout,
  } = useWorkout();

  const [sessionData, setSessionData] = useState({
    exercises: [],
    notes: '',
    difficulty: null,
    feeling: null,
  });

  const workoutTimer = useWorkoutTimer();
  const restTimer = useRestTimer();

  const startWorkout = useCallback(async (workout) => {
    const result = await contextStartWorkout(workout);
    if (result.success) {
      workoutTimer.start();
    }
    return result;
  }, [contextStartWorkout, workoutTimer]);

  const endWorkout = useCallback(async () => {
    workoutTimer.stop();
    
    const finalSessionData = {
      ...sessionData,
      duration: workoutTimer.time,
      endTime: new Date().toISOString(),
    };

    const result = await contextEndWorkout(finalSessionData);
    
    if (result.success) {
      // Reset session data
      setSessionData({
        exercises: [],
        notes: '',
        difficulty: null,
        feeling: null,
      });
      workoutTimer.reset();
      restTimer.stopRest();
    }
    
    return result;
  }, [contextEndWorkout, sessionData, workoutTimer, restTimer]);

  const pauseSession = useCallback(() => {
    workoutTimer.pause();
    pauseWorkout();
  }, [workoutTimer, pauseWorkout]);

  const resumeSession = useCallback(() => {
    workoutTimer.start();
    resumeWorkout();
  }, [workoutTimer, resumeWorkout]);

  const updateExerciseData = useCallback((exerciseId, data) => {
    setSessionData(prev => ({
      ...prev,
      exercises: prev.exercises.map(ex =>
        ex.id === exerciseId ? { ...ex, ...data } : ex
      ),
    }));
  }, []);

  const completeExercise = useCallback((exerciseId) => {
    updateExerciseData(exerciseId, { completed: true });
    // Start rest timer for next exercise
    if (restTimer.restTime === 0) {
      restTimer.startRest();
    }
  }, [updateExerciseData, restTimer]);

  const addSessionNote = useCallback((note) => {
    setSessionData(prev => ({ ...prev, notes: note }));
  }, []);

  const setSessionRating = useCallback((difficulty, feeling) => {
    setSessionData(prev => ({ ...prev, difficulty, feeling }));
  }, []);

  return {
    activeWorkout,
    workoutSession,
    sessionData,
    workoutTimer,
    restTimer,
    startWorkout,
    endWorkout,
    pauseSession,
    resumeSession,
    updateExerciseData,
    completeExercise,
    addSessionNote,
    setSessionRating,
  };
};

export const useWorkoutHistory = () => {
  const { token } = useAuth();
  const [history, setHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const loadHistory = useCallback(async (filters = {}) => {
    try {
      setIsLoading(true);
      setError(null);
      
      // This would be implemented with actual API call
      // const response = await workoutApi.getWorkoutHistory(token, filters);
      // setHistory(response.history || []);
      
      // Placeholder implementation
      setHistory([]);
    } catch (error) {
      console.error('Error loading workout history:', error);
      setError('Failed to load workout history');
    } finally {
      setIsLoading(false);
    }
  }, [token]);

  useEffect(() => {
    if (token) {
      loadHistory();
    }
  }, [token, loadHistory]);

  return {
    history,
    isLoading,
    error,
    loadHistory,
  };
};

export default {
  useWorkoutTimer,
  useRestTimer,
  useWorkoutSession,
  useWorkoutHistory,
};