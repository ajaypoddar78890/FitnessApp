import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, typography } from '../../theme';

const GoalCard = ({
  goals,
  onEditGoal,
  onAddGoal,
}) => {
  const goalTypes = [
    {
      id: 'weekly_workouts',
      title: 'Weekly Workouts',
      icon: 'calendar',
      color: colors.primary,
    },
    {
      id: 'weight_loss',
      title: 'Weight Goal',
      icon: 'trending-down',
      color: colors.success,
    },
    {
      id: 'strength',
      title: 'Strength Goal',
      icon: 'barbell',
      color: colors.warning,
    },
    {
      id: 'cardio_minutes',
      title: 'Cardio Minutes',
      icon: 'heart',
      color: colors.error,
    },
  ];

  const getGoalProgress = (goal) => {
    if (!goal || !goal.target) return 0;
    return Math.min((goal.current / goal.target) * 100, 100);
  };

  const formatGoalValue = (type, value, unit) => {
    switch (type) {
      case 'weight_loss':
        return `${value} ${unit || 'kg'}`;
      case 'cardio_minutes':
        return `${value} ${unit || 'min'}`;
      default:
        return value.toString();
    }
  };

  const renderGoalItem = (goalType) => {
    const goal = goals.find(g => g.type === goalType.id);
    const progress = getGoalProgress(goal);

    return (
      <TouchableOpacity
        key={goalType.id}
        style={styles.goalItem}
        onPress={() => goal ? onEditGoal(goal) : onAddGoal(goalType.id)}
      >
        <View style={styles.goalHeader}>
          <View style={[styles.goalIcon, { backgroundColor: goalType.color }]}>
            <Ionicons name={goalType.icon} size={20} color={colors.white} />
          </View>
          <Text style={styles.goalTitle}>{goalType.title}</Text>
        </View>

        {goal ? (
          <View style={styles.goalContent}>
            <View style={styles.goalValues}>
              <Text style={styles.currentValue}>
                {formatGoalValue(goal.type, goal.current, goal.unit)}
              </Text>
              <Text style={styles.separator}>/</Text>
              <Text style={styles.targetValue}>
                {formatGoalValue(goal.type, goal.target, goal.unit)}
              </Text>
            </View>

            <View style={styles.progressContainer}>
              <View style={styles.progressBar}>
                <View
                  style={[
                    styles.progressFill,
                    {
                      width: `${progress}%`,
                      backgroundColor: goalType.color,
                    },
                  ]}
                />
              </View>
              <Text style={styles.progressText}>
                {Math.round(progress)}%
              </Text>
            </View>

            {goal.deadline && (
              <Text style={styles.deadline}>
                Deadline: {new Date(goal.deadline).toLocaleDateString()}
              </Text>
            )}

            {progress >= 100 && (
              <View style={styles.completedBadge}>
                <Ionicons name="trophy" size={16} color={colors.warning} />
                <Text style={styles.completedText}>Completed!</Text>
              </View>
            )}
          </View>
        ) : (
          <View style={styles.addGoalPrompt}>
            <Ionicons name="add-circle-outline" size={24} color={colors.text.secondary} />
            <Text style={styles.addGoalText}>Set Goal</Text>
          </View>
        )}
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>My Goals</Text>
        <TouchableOpacity onPress={() => onAddGoal()}>
          <Ionicons name="add" size={24} color={colors.primary} />
        </TouchableOpacity>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.goalsContainer}
      >
        {goalTypes.map(renderGoalItem)}
      </ScrollView>

      {goals.length > 0 && (
        <View style={styles.summary}>
          <Text style={styles.summaryTitle}>This Week</Text>
          <View style={styles.summaryStats}>
            <View style={styles.summaryItem}>
              <Text style={styles.summaryValue}>
                {goals.filter(g => getGoalProgress(g) >= 100).length}
              </Text>
              <Text style={styles.summaryLabel}>Completed</Text>
            </View>
            <View style={styles.summaryItem}>
              <Text style={styles.summaryValue}>
                {goals.filter(g => getGoalProgress(g) > 0 && getGoalProgress(g) < 100).length}
              </Text>
              <Text style={styles.summaryLabel}>In Progress</Text>
            </View>
            <View style={styles.summaryItem}>
              <Text style={styles.summaryValue}>
                {goals.filter(g => getGoalProgress(g) === 0).length}
              </Text>
              <Text style={styles.summaryLabel}>Not Started</Text>
            </View>
          </View>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: spacing.md,
    marginBottom: spacing.md,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  title: {
    ...typography.h3,
    color: colors.text.primary,
  },
  goalsContainer: {
    paddingRight: spacing.md,
  },
  goalItem: {
    width: 200,
    backgroundColor: colors.background,
    borderRadius: 12,
    padding: spacing.md,
    marginRight: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  goalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  goalIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.sm,
  },
  goalTitle: {
    ...typography.body,
    color: colors.text.primary,
    fontWeight: '600',
    flex: 1,
  },
  goalContent: {
    flex: 1,
  },
  goalValues: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  currentValue: {
    ...typography.h3,
    color: colors.text.primary,
    fontWeight: '600',
  },
  separator: {
    ...typography.h3,
    color: colors.text.secondary,
    marginHorizontal: spacing.xs,
  },
  targetValue: {
    ...typography.h3,
    color: colors.text.secondary,
  },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  progressBar: {
    flex: 1,
    height: 6,
    backgroundColor: colors.border,
    borderRadius: 3,
    overflow: 'hidden',
    marginRight: spacing.sm,
  },
  progressFill: {
    height: '100%',
    borderRadius: 3,
  },
  progressText: {
    ...typography.caption,
    color: colors.text.secondary,
    fontWeight: '600',
  },
  deadline: {
    ...typography.caption,
    color: colors.text.secondary,
    marginBottom: spacing.sm,
  },
  completedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.warning + '20',
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: 6,
    alignSelf: 'flex-start',
  },
  completedText: {
    ...typography.caption,
    color: colors.warning,
    marginLeft: spacing.xs,
    fontWeight: '600',
  },
  addGoalPrompt: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.lg,
  },
  addGoalText: {
    ...typography.body,
    color: colors.text.secondary,
    marginTop: spacing.sm,
  },
  summary: {
    marginTop: spacing.lg,
    paddingTop: spacing.lg,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  summaryTitle: {
    ...typography.h4,
    color: colors.text.primary,
    marginBottom: spacing.md,
    textAlign: 'center',
  },
  summaryStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  summaryItem: {
    alignItems: 'center',
  },
  summaryValue: {
    ...typography.h2,
    color: colors.primary,
    fontWeight: '600',
  },
  summaryLabel: {
    ...typography.caption,
    color: colors.text.secondary,
    textAlign: 'center',
  },
});

export default GoalCard;