import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  RefreshControl,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { useAuth } from '../../context/AuthContext';
import { useWorkout } from '../../context/WorkoutContext';
import { useUserStats } from '../../hooks/useUser';
import WorkoutCard from '../../components/workout/WorkoutCard';
import StatsCard from '../../components/stats/StatsCard';
import { colors, spacing, typography } from '../../theme';

const HomeScreen = ({ navigation }) => {
  const { user } = useAuth();
  const { workouts, isLoading: workoutsLoading } = useWorkout();
  const { stats, isLoading: statsLoading, loadStats } = useUserStats();
  const [refreshing, setRefreshing] = useState(false);

  const recentWorkouts = workouts.slice(0, 3);
  const todayStats = {
    workoutsCompleted: stats?.dailyProgress?.[6]?.workouts || 0,
    totalTime: stats?.dailyProgress?.[6]?.minutes || 0,
    caloriesBurned: stats?.dailyProgress?.[6]?.calories || 0,
    streak: user?.streak || 0,
  };

  const onRefresh = async () => {
    setRefreshing(true);
    try {
      await loadStats();
    } catch (error) {
      console.error('Error refreshing data:', error);
    } finally {
      setRefreshing(false);
    }
  };

  const handleWorkoutPress = (workout) => {
    navigation.navigate('Workouts', {
      screen: 'WorkoutDetail',
      params: { workout },
    });
  };

  const renderGreeting = () => {
    const hour = new Date().getHours();
    let greeting = 'Good morning';
    if (hour >= 12 && hour < 17) greeting = 'Good afternoon';
    else if (hour >= 17) greeting = 'Good evening';

    return (
      <View style={styles.greeting}>
        <Text style={styles.greetingText}>
          {greeting}, {user?.name || 'Fitness Enthusiast'}!
        </Text>
        <Text style={styles.motivationText}>
          Ready to crush your fitness goals today?
        </Text>
      </View>
    );
  };

  const renderTodayStats = () => (
    <View style={styles.todayStats}>
      <Text style={styles.sectionTitle}>Today's Progress</Text>
      <View style={styles.statsGrid}>
        <View style={styles.statItem}>
          <View style={[styles.statIcon, { backgroundColor: colors.primary }]}>
            <Ionicons name="fitness" size={20} color={colors.white} />
          </View>
          <Text style={styles.statValue}>{todayStats.workoutsCompleted}</Text>
          <Text style={styles.statLabel}>Workouts</Text>
        </View>
        
        <View style={styles.statItem}>
          <View style={[styles.statIcon, { backgroundColor: colors.success }]}>
            <Ionicons name="time" size={20} color={colors.white} />
          </View>
          <Text style={styles.statValue}>
            {todayStats.totalTime < 60 
              ? `${todayStats.totalTime}min` 
              : `${Math.floor(todayStats.totalTime / 60)}h ${todayStats.totalTime % 60}min`
            }
          </Text>
          <Text style={styles.statLabel}>Active Time</Text>
        </View>
        
        <View style={styles.statItem}>
          <View style={[styles.statIcon, { backgroundColor: colors.warning }]}>
            <Ionicons name="flame" size={20} color={colors.white} />
          </View>
          <Text style={styles.statValue}>{todayStats.caloriesBurned}</Text>
          <Text style={styles.statLabel}>Calories</Text>
        </View>
        
        <View style={styles.statItem}>
          <View style={[styles.statIcon, { backgroundColor: colors.error }]}>
            <Ionicons name="trophy" size={20} color={colors.white} />
          </View>
          <Text style={styles.statValue}>{todayStats.streak}</Text>
          <Text style={styles.statLabel}>Day Streak</Text>
        </View>
      </View>
    </View>
  );

  const renderQuickActions = () => (
    <View style={styles.quickActions}>
      <Text style={styles.sectionTitle}>Quick Actions</Text>
      <View style={styles.actionsGrid}>
        <TouchableOpacity 
          style={styles.actionButton}
          onPress={() => navigation.navigate('Workouts', { screen: 'CreateWorkout' })}
        >
          <Ionicons name="add" size={24} color={colors.primary} />
          <Text style={styles.actionText}>New Workout</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.actionButton}
          onPress={() => navigation.navigate('Stats')}
        >
          <Ionicons name="bar-chart" size={24} color={colors.success} />
          <Text style={styles.actionText}>View Stats</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.actionButton}
          onPress={() => navigation.navigate('Profile')}
        >
          <Ionicons name="person" size={24} color={colors.warning} />
          <Text style={styles.actionText}>Profile</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.actionButton}
          onPress={() => navigation.navigate('Workouts')}
        >
          <Ionicons name="list" size={24} color={colors.error} />
          <Text style={styles.actionText}>All Workouts</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderRecentWorkouts = () => (
    <View style={styles.recentWorkouts}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Recent Workouts</Text>
        <TouchableOpacity onPress={() => navigation.navigate('Workouts')}>
          <Text style={styles.seeAllText}>See All</Text>
        </TouchableOpacity>
      </View>
      
      {recentWorkouts.length > 0 ? (
        recentWorkouts.map((workout) => (
          <WorkoutCard
            key={workout.id}
            workout={workout}
            onPress={handleWorkoutPress}
          />
        ))
      ) : (
        <View style={styles.emptyState}>
          <Ionicons name="fitness-outline" size={48} color={colors.text.secondary} />
          <Text style={styles.emptyStateText}>No workouts yet</Text>
          <TouchableOpacity 
            style={styles.createFirstWorkout}
            onPress={() => navigation.navigate('Workouts', { screen: 'CreateWorkout' })}
          >
            <Text style={styles.createFirstWorkoutText}>Create your first workout</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={colors.primary}
          />
        }
      >
        {renderGreeting()}
        {renderTodayStats()}
        {renderQuickActions()}
        {renderRecentWorkouts()}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: spacing.md,
    paddingBottom: spacing.xl,
  },
  greeting: {
    marginVertical: spacing.lg,
  },
  greetingText: {
    ...typography.h2,
    color: colors.text.primary,
    marginBottom: spacing.xs,
  },
  motivationText: {
    ...typography.body,
    color: colors.text.secondary,
  },
  sectionTitle: {
    ...typography.h3,
    color: colors.text.primary,
    marginBottom: spacing.md,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  seeAllText: {
    ...typography.body,
    color: colors.primary,
    fontWeight: '600',
  },
  todayStats: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: spacing.md,
    marginBottom: spacing.lg,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.sm,
  },
  statValue: {
    ...typography.h4,
    color: colors.text.primary,
    fontWeight: '600',
    marginBottom: spacing.xs,
  },
  statLabel: {
    ...typography.caption,
    color: colors.text.secondary,
    textAlign: 'center',
  },
  quickActions: {
    marginBottom: spacing.lg,
  },
  actionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  actionButton: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: spacing.md,
    alignItems: 'center',
    width: '48%',
    marginBottom: spacing.md,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  actionText: {
    ...typography.caption,
    color: colors.text.primary,
    marginTop: spacing.sm,
    fontWeight: '600',
  },
  recentWorkouts: {
    marginBottom: spacing.lg,
  },
  emptyState: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: spacing.xl,
    alignItems: 'center',
    marginTop: spacing.md,
  },
  emptyStateText: {
    ...typography.body,
    color: colors.text.secondary,
    marginVertical: spacing.md,
    textAlign: 'center',
  },
  createFirstWorkout: {
    backgroundColor: colors.primary,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderRadius: 8,
  },
  createFirstWorkoutText: {
    ...typography.body,
    color: colors.white,
    fontWeight: '600',
  },
});

export default HomeScreen;