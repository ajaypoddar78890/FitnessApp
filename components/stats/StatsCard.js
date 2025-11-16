import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, typography } from '../../theme';

const StatsCard = ({
  statsData,
  onPeriodChange,
  selectedPeriod = 'week',
}) => {
  const periods = [
    { key: 'week', label: 'Week' },
    { key: 'month', label: 'Month' },
    { key: 'year', label: 'Year' },
  ];

  const statItems = [
    {
      key: 'workoutsCompleted',
      label: 'Workouts',
      icon: 'fitness',
      color: colors.primary,
      value: statsData?.workoutsCompleted || 0,
    },
    {
      key: 'totalTime',
      label: 'Total Time',
      icon: 'time',
      color: colors.success,
      value: formatTime(statsData?.totalTime || 0),
    },
    {
      key: 'caloriesBurned',
      label: 'Calories',
      icon: 'flame',
      color: colors.warning,
      value: statsData?.caloriesBurned || 0,
    },
    {
      key: 'averageIntensity',
      label: 'Avg Intensity',
      icon: 'trending-up',
      color: colors.error,
      value: `${Math.round(statsData?.averageIntensity || 0)}%`,
    },
  ];

  function formatTime(minutes) {
    if (minutes < 60) return `${minutes}min`;
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}min`;
  }

  const renderPeriodSelector = () => (
    <View style={styles.periodSelector}>
      {periods.map((period) => (
        <TouchableOpacity
          key={period.key}
          style={[
            styles.periodButton,
            selectedPeriod === period.key && styles.activePeriod,
          ]}
          onPress={() => onPeriodChange(period.key)}
        >
          <Text
            style={[
              styles.periodText,
              selectedPeriod === period.key && styles.activePeriodText,
            ]}
          >
            {period.label}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );

  const renderStatItem = (item) => (
    <View key={item.key} style={styles.statItem}>
      <View style={[styles.statIcon, { backgroundColor: item.color }]}>
        <Ionicons name={item.icon} size={20} color={colors.white} />
      </View>
      <Text style={styles.statValue}>{item.value}</Text>
      <Text style={styles.statLabel}>{item.label}</Text>
    </View>
  );

  const renderProgressChart = () => {
    if (!statsData?.dailyProgress) return null;

    const maxValue = Math.max(...statsData.dailyProgress.map(day => day.workouts));
    
    return (
      <View style={styles.chartContainer}>
        <Text style={styles.chartTitle}>Daily Progress</Text>
        <View style={styles.chart}>
          {statsData.dailyProgress.map((day, index) => {
            const height = maxValue > 0 ? (day.workouts / maxValue) * 80 : 0;
            return (
              <View key={index} style={styles.chartColumn}>
                <View
                  style={[
                    styles.chartBar,
                    {
                      height: height,
                      backgroundColor: day.workouts > 0 ? colors.primary : colors.border,
                    },
                  ]}
                />
                <Text style={styles.chartLabel}>
                  {day.day.slice(0, 1)}
                </Text>
              </View>
            );
          })}
        </View>
      </View>
    );
  };

  const renderAchievements = () => {
    if (!statsData?.recentAchievements?.length) return null;

    return (
      <View style={styles.achievementsContainer}>
        <Text style={styles.achievementsTitle}>Recent Achievements</Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.achievementsList}
        >
          {statsData.recentAchievements.map((achievement, index) => (
            <View key={index} style={styles.achievementItem}>
              <View style={styles.achievementIcon}>
                <Ionicons
                  name={achievement.icon || 'trophy'}
                  size={24}
                  color={colors.warning}
                />
              </View>
              <Text style={styles.achievementText} numberOfLines={2}>
                {achievement.title}
              </Text>
              <Text style={styles.achievementDate}>
                {new Date(achievement.date).toLocaleDateString()}
              </Text>
            </View>
          ))}
        </ScrollView>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Statistics</Text>
        {renderPeriodSelector()}
      </View>

      <View style={styles.statsGrid}>
        {statItems.map(renderStatItem)}
      </View>

      {renderProgressChart()}

      {renderAchievements()}

      {statsData?.comparison && (
        <View style={styles.comparisonContainer}>
          <Text style={styles.comparisonTitle}>vs Last {selectedPeriod}</Text>
          <View style={styles.comparisonStats}>
            <View style={styles.comparisonItem}>
              <Ionicons
                name={statsData.comparison.workouts >= 0 ? 'trending-up' : 'trending-down'}
                size={20}
                color={statsData.comparison.workouts >= 0 ? colors.success : colors.error}
              />
              <Text
                style={[
                  styles.comparisonValue,
                  {
                    color: statsData.comparison.workouts >= 0 ? colors.success : colors.error,
                  },
                ]}
              >
                {statsData.comparison.workouts >= 0 ? '+' : ''}{statsData.comparison.workouts}
              </Text>
              <Text style={styles.comparisonLabel}>workouts</Text>
            </View>
            <View style={styles.comparisonItem}>
              <Ionicons
                name={statsData.comparison.time >= 0 ? 'trending-up' : 'trending-down'}
                size={20}
                color={statsData.comparison.time >= 0 ? colors.success : colors.error}
              />
              <Text
                style={[
                  styles.comparisonValue,
                  {
                    color: statsData.comparison.time >= 0 ? colors.success : colors.error,
                  },
                ]}
              >
                {statsData.comparison.time >= 0 ? '+' : ''}{Math.round(statsData.comparison.time)}
              </Text>
              <Text style={styles.comparisonLabel}>minutes</Text>
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
  },
  header: {
    marginBottom: spacing.lg,
  },
  title: {
    ...typography.h2,
    color: colors.text.primary,
    marginBottom: spacing.md,
  },
  periodSelector: {
    flexDirection: 'row',
    backgroundColor: colors.background,
    borderRadius: 8,
    padding: spacing.xs,
  },
  periodButton: {
    flex: 1,
    paddingVertical: spacing.sm,
    alignItems: 'center',
    borderRadius: 6,
  },
  activePeriod: {
    backgroundColor: colors.primary,
  },
  periodText: {
    ...typography.body,
    color: colors.text.secondary,
    fontWeight: '500',
  },
  activePeriodText: {
    color: colors.white,
    fontWeight: '600',
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: spacing.lg,
  },
  statItem: {
    width: '48%',
    backgroundColor: colors.background,
    borderRadius: 12,
    padding: spacing.md,
    alignItems: 'center',
    marginBottom: spacing.md,
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
    ...typography.h3,
    color: colors.text.primary,
    fontWeight: '600',
    marginBottom: spacing.xs,
  },
  statLabel: {
    ...typography.caption,
    color: colors.text.secondary,
    textAlign: 'center',
  },
  chartContainer: {
    marginBottom: spacing.lg,
  },
  chartTitle: {
    ...typography.h4,
    color: colors.text.primary,
    marginBottom: spacing.md,
  },
  chart: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    height: 100,
    paddingHorizontal: spacing.sm,
  },
  chartColumn: {
    flex: 1,
    alignItems: 'center',
    marginHorizontal: 2,
  },
  chartBar: {
    width: '80%',
    borderRadius: 2,
    marginBottom: spacing.xs,
  },
  chartLabel: {
    ...typography.caption,
    color: colors.text.secondary,
  },
  achievementsContainer: {
    marginBottom: spacing.lg,
  },
  achievementsTitle: {
    ...typography.h4,
    color: colors.text.primary,
    marginBottom: spacing.md,
  },
  achievementsList: {
    paddingRight: spacing.md,
  },
  achievementItem: {
    width: 120,
    backgroundColor: colors.background,
    borderRadius: 8,
    padding: spacing.sm,
    marginRight: spacing.sm,
    alignItems: 'center',
  },
  achievementIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.warning + '20',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.sm,
  },
  achievementText: {
    ...typography.caption,
    color: colors.text.primary,
    textAlign: 'center',
    marginBottom: spacing.xs,
    fontWeight: '500',
  },
  achievementDate: {
    ...typography.caption,
    color: colors.text.secondary,
    fontSize: 10,
  },
  comparisonContainer: {
    backgroundColor: colors.background,
    borderRadius: 8,
    padding: spacing.md,
  },
  comparisonTitle: {
    ...typography.body,
    color: colors.text.primary,
    fontWeight: '600',
    marginBottom: spacing.md,
    textAlign: 'center',
  },
  comparisonStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  comparisonItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  comparisonValue: {
    ...typography.body,
    fontWeight: '600',
    marginLeft: spacing.xs,
    marginRight: spacing.xs,
  },
  comparisonLabel: {
    ...typography.caption,
    color: colors.text.secondary,
  },
});

export default StatsCard;