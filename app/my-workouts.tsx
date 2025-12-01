import React, { useMemo } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, Image, FlatList } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { ThemedText } from '@/components/themed-text';
import { useWorkout } from '@/context/WorkoutContext';
import { Colors } from '@/constants/theme';
import { router } from 'expo-router';

interface WorkoutType {
  id: string;
  name: string;
  duration?: number;
  startTime?: string;
  endTime?: string;
  image?: string;
  lastPerformed?: string;
  completed?: boolean;
  favorite?: boolean;
}

export default function MyWorkouts() {
  const { workouts } = useWorkout();
  const [selectedTab, setSelectedTab] = React.useState('History');

  const formattedGroups = useMemo(() => {
    // Group workouts by date (lastPerformed) for history
    const groups: Record<string, WorkoutType[]> = {};
    workouts.forEach((w: WorkoutType) => {
      const dateKey = w.lastPerformed ? new Date(w.lastPerformed).toDateString() : 'Unknown';
      if (!groups[dateKey]) groups[dateKey] = [];
      groups[dateKey].push(w);
    });

    // Convert to array and sort by date desc
    const groupArr = Object.keys(groups).map(key => ({
      date: key,
      workouts: groups[key],
    }));

    groupArr.sort((a, b) => {
      if (a.date === 'Unknown') return 1;
      if (b.date === 'Unknown') return -1;
      return new Date(b.date).getTime() - new Date(a.date).getTime();
    });

    return groupArr;
  }, [workouts]);

  const handleBack = () => router.back();

  const renderSegment = (tabName: string) => (
    <TouchableOpacity
      key={tabName}
      style={[styles.segmentItem, selectedTab === tabName && styles.segmentItemActive]}
      onPress={() => setSelectedTab(tabName)}
      activeOpacity={0.8}
    >
      <ThemedText style={[styles.segmentText, selectedTab === tabName && styles.segmentTextActive]}>{tabName}</ThemedText>
    </TouchableOpacity>
  );

  const renderWorkoutRow = (workout: WorkoutType) => (
    <TouchableOpacity style={styles.workoutRow} key={workout.id} onPress={() => router.push({ pathname: '/workout-details', params: { id: workout.id, title: workout.name } })}>
      <View style={styles.thumb}>
        {workout.image ? (
          <Image source={{ uri: workout.image }} style={styles.thumbImage} />
        ) : (
          <View style={styles.thumbPlaceholder} />
        )}
      </View>

      <View style={styles.workoutInfo}>
  <ThemedText style={styles.workoutTitle}>{workout.name || (workout as any).title}</ThemedText>
  <ThemedText style={styles.workoutTime}>{workout.startTime ? `${workout.startTime} - ${workout.endTime}` : (workout.duration ? `${workout.duration} minutes` : '')}</ThemedText>
      </View>

      <View style={styles.checkIconWrapper}>
        {workout.completed && (
          <View style={styles.checkIcon}>
            <Ionicons name="checkmark" size={16} color="#fff" />
          </View>
        )}
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBack} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <ThemedText type="title" style={styles.title}>My workouts</ThemedText>
        <View style={{ width: 32 }} />
      </View>

  <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.segmentContainer}>
          {['History', 'Last', 'Favorites'].map(renderSegment)}
        </View>

        {selectedTab === 'History' && (
          <View>
            {formattedGroups.length === 0 ? (
              <View style={styles.emptyState}>
                <Ionicons name="fitness-outline" size={48} color="#8e8e93" />
                <ThemedText style={styles.emptyTitle}>No workouts yet</ThemedText>
                <ThemedText style={styles.emptySubtitle}>Your completed workouts will appear here</ThemedText>
              </View>
            ) : (
              formattedGroups.map(group => {
              const totalTime = group.workouts.reduce((s: number, w: WorkoutType) => s + (w.duration || 0), 0);
              const count = group.workouts.length;
              return (
                <View key={group.date} style={styles.groupContainer}>
                  <View style={styles.groupHeader}>
                    <ThemedText style={styles.groupDate}>{new Date(group.date).toLocaleDateString(undefined, { month: 'long', day: 'numeric', year: 'numeric' })}</ThemedText>
                    <ThemedText style={styles.groupSummary}>{count} workout{count > 1 ? 's' : ''}, {totalTime} minutes</ThemedText>
                  </View>

                  <View style={styles.groupList}>
                    {group.workouts.map((workout: WorkoutType) => renderWorkoutRow(workout))}
                  </View>
                </View>
              );
              })
            )}
          </View>
        )}

        {selectedTab === 'Last' && (
          <View style={styles.groupList}>
            {workouts.slice(0, 10).map((workout: WorkoutType) => renderWorkoutRow(workout))}
          </View>
        )}

        {selectedTab === 'Favorites' && (
          <View style={styles.groupList}>
            {workouts.filter((w: WorkoutType) => w.favorite).map((workout: WorkoutType) => renderWorkoutRow(workout))}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.dark.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 14,
    justifyContent: 'space-between',
  },
  backButton: {
    padding: 6,
    borderRadius: 20,
  },
  title: {
    fontWeight: '700',
    color: '#fff',
  },
  content: {
    paddingHorizontal: 16,
    paddingBottom: 40,
  },
  segmentContainer: {
    flexDirection: 'row',
    backgroundColor: '#2f2e38',
    borderRadius: 24,
    padding: 8,
    marginTop: 8,
    marginBottom: 20,
    justifyContent: 'space-between'
  },
  segmentItem: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
  },
  segmentItemActive: {
    backgroundColor: '#7c3aed',
  },
  segmentText: {
    color: '#bfc0c3',
    fontWeight: '600',
  },
  segmentTextActive: {
    color: '#fff',
  },
  groupContainer: {
    marginBottom: 16,
  },
  groupHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  groupDate: {
    color: '#fff',
    fontWeight: '700',
  },
  groupSummary: {
    color: '#8e8e93',
  },
  groupList: {
    gap: 12,
  },
  emptyState: {
    backgroundColor: '#2c2b34',
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
  },
  emptyTitle: {
    color: '#fff',
    fontWeight: '700',
    marginTop: 8,
  },
  emptySubtitle: {
    color: '#8e8e93',
    textAlign: 'center',
    marginTop: 6,
  },
  workoutRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#33303a',
    padding: 12,
    borderRadius: 12,
  },
  thumb: {
    width: 54,
    height: 54,
    borderRadius: 8,
    marginRight: 12,
    overflow: 'hidden'
  },
  thumbImage: {
    width: '100%',
    height: '100%',
  },
  thumbPlaceholder: {
    width: '100%',
    height: '100%',
    backgroundColor: '#2f2e38',
  },
  workoutInfo: {
    flex: 1,
  },
  workoutTitle: {
    color: '#fff',
    fontWeight: '700',
  },
  workoutTime: {
    color: '#8e8e93',
  },
  checkIconWrapper: {
    marginLeft: 8,
  },
  checkIcon: {
    backgroundColor: '#7c3aed',
    padding: 8,
    borderRadius: 16,
  },
});