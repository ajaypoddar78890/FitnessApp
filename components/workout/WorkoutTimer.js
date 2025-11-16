import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, typography } from '../../theme';

const WorkoutTimer = ({
  isActive,
  isPaused,
  time,
  onStart,
  onPause,
  onStop,
  onReset,
  restTime,
  isResting,
}) => {
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const formatRestTime = (seconds) => {
    if (seconds <= 0) return '00:00';
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <View style={styles.container}>
      <View style={styles.timerContainer}>
        <Text style={styles.label}>Workout Time</Text>
        <Text style={[styles.time, isActive && styles.activeTime]}>
          {formatTime(time)}
        </Text>
      </View>

      {isResting && (
        <View style={styles.restContainer}>
          <Text style={styles.restLabel}>Rest Time</Text>
          <Text style={[styles.restTime, restTime <= 10 && styles.lowRestTime]}>
            {formatRestTime(restTime)}
          </Text>
        </View>
      )}

      <View style={styles.controls}>
        {!isActive && !isPaused ? (
          <TouchableOpacity style={styles.startButton} onPress={onStart}>
            <Ionicons name="play" size={24} color={colors.white} />
            <Text style={styles.buttonText}>Start</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            style={isPaused ? styles.startButton : styles.pauseButton}
            onPress={isPaused ? onStart : onPause}
          >
            <Ionicons
              name={isPaused ? "play" : "pause"}
              size={24}
              color={colors.white}
            />
            <Text style={styles.buttonText}>
              {isPaused ? 'Resume' : 'Pause'}
            </Text>
          </TouchableOpacity>
        )}

        {(isActive || isPaused) && (
          <TouchableOpacity style={styles.stopButton} onPress={onStop}>
            <Ionicons name="stop" size={24} color={colors.white} />
            <Text style={styles.buttonText}>Stop</Text>
          </TouchableOpacity>
        )}

        {time > 0 && (
          <TouchableOpacity style={styles.resetButton} onPress={onReset}>
            <Ionicons name="refresh" size={20} color={colors.text.secondary} />
          </TouchableOpacity>
        )}
      </View>

      <View style={styles.statusContainer}>
        <View style={[styles.statusDot, isActive && styles.activeDot]} />
        <Text style={styles.statusText}>
          {isActive ? 'Active' : isPaused ? 'Paused' : 'Ready'}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: spacing.lg,
    marginBottom: spacing.md,
    alignItems: 'center',
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  timerContainer: {
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  label: {
    ...typography.caption,
    color: colors.text.secondary,
    marginBottom: spacing.xs,
    textTransform: 'uppercase',
    fontWeight: '600',
  },
  time: {
    ...typography.h1,
    color: colors.text.primary,
    fontFamily: 'monospace',
  },
  activeTime: {
    color: colors.primary,
  },
  restContainer: {
    alignItems: 'center',
    marginBottom: spacing.md,
    backgroundColor: colors.warning + '20',
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderRadius: 8,
  },
  restLabel: {
    ...typography.caption,
    color: colors.warning,
    fontWeight: '600',
    marginBottom: spacing.xs,
  },
  restTime: {
    ...typography.h2,
    color: colors.warning,
    fontFamily: 'monospace',
  },
  lowRestTime: {
    color: colors.error,
  },
  controls: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  startButton: {
    backgroundColor: colors.success,
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.lg,
    borderRadius: 8,
    marginHorizontal: spacing.xs,
  },
  pauseButton: {
    backgroundColor: colors.warning,
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.lg,
    borderRadius: 8,
    marginHorizontal: spacing.xs,
  },
  stopButton: {
    backgroundColor: colors.error,
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.lg,
    borderRadius: 8,
    marginHorizontal: spacing.xs,
  },
  resetButton: {
    backgroundColor: colors.background,
    padding: spacing.sm,
    borderRadius: 8,
    marginLeft: spacing.sm,
  },
  buttonText: {
    ...typography.body,
    color: colors.white,
    marginLeft: spacing.xs,
    fontWeight: '600',
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.text.secondary,
    marginRight: spacing.sm,
  },
  activeDot: {
    backgroundColor: colors.success,
  },
  statusText: {
    ...typography.caption,
    color: colors.text.secondary,
    fontWeight: '500',
  },
});

export default WorkoutTimer;