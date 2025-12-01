import { API_BASE_URL } from '../../constants/api';

const WORKOUT_ENDPOINTS = {
  WORKOUTS: '/workouts',
  EXERCISES: '/exercises',
  SESSIONS: '/sessions',
};

export const workoutApi = {
  getWorkouts: async (token) => {
    try {
      const response = await fetch(`${API_BASE_URL}${WORKOUT_ENDPOINTS.WORKOUTS}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch workouts');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Get workouts error:', error);
      throw error;
    }
  },

  createWorkout: async (token, workoutData) => {
    try {
      const response = await fetch(`${API_BASE_URL}${WORKOUT_ENDPOINTS.WORKOUTS}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(workoutData),
      });
      
      if (!response.ok) {
        throw new Error('Failed to create workout');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Create workout error:', error);
      throw error;
    }
  },

  updateWorkout: async (token, workoutId, workoutData) => {
    try {
      const response = await fetch(`${API_BASE_URL}${WORKOUT_ENDPOINTS.WORKOUTS}/${workoutId}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(workoutData),
      });
      
      if (!response.ok) {
        throw new Error('Failed to update workout');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Update workout error:', error);
      throw error;
    }
  },

  deleteWorkout: async (token, workoutId) => {
    try {
      const response = await fetch(`${API_BASE_URL}${WORKOUT_ENDPOINTS.WORKOUTS}/${workoutId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      
      return response.ok;
    } catch (error) {
      console.error('Delete workout error:', error);
      throw error;
    }
  },

  getExercises: async (token) => {
    try {
      const response = await fetch(`${API_BASE_URL}${WORKOUT_ENDPOINTS.EXERCISES}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch exercises');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Get exercises error:', error);
      throw error;
    }
  },

  startWorkoutSession: async (token, workoutId) => {
    try {
      const response = await fetch(`${API_BASE_URL}${WORKOUT_ENDPOINTS.SESSIONS}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ workoutId, startTime: new Date().toISOString() }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to start workout session');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Start workout session error:', error);
      throw error;
    }
  },

  endWorkoutSession: async (token, sessionId, sessionData) => {
    try {
      const response = await fetch(`${API_BASE_URL}${WORKOUT_ENDPOINTS.SESSIONS}/${sessionId}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...sessionData,
          endTime: new Date().toISOString(),
        }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to end workout session');
      }
      
      return await response.json();
    } catch (error) {
      console.error('End workout session error:', error);
      throw error;
    }
  },
};

export default function WorkoutApiRoute() {
  return null; // This is an API route, not a component
}