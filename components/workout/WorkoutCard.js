import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, typography } from '../../theme';

const WorkoutCard = ({ 
  workout, 
  onPress, 
  onEdit, 
  onDelete 
}) => {
  const {
    id,
    name,
    description,
    duration,
    exercises,
    difficulty,
    image,
    completed,
    lastPerformed
  } = workout;

  const getDifficultyColor = (level) => {
    switch (level) {
      case 'easy':
        return colors.success;
      case 'medium':
        return colors.warning;
      case 'hard':
        return colors.error;
      default:
        return colors.primary;
    }
  };

  const formatDuration = (minutes) => {
    if (minutes < 60) return `${minutes}min`;
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}min`;
  };

  return (
    <TouchableOpacity
      style={[styles.card, completed && styles.completedCard]}
      onPress={() => onPress(workout)}
      activeOpacity={0.7}
    >
      {image && (
        <Image
          source={{ uri: image }}
          style={styles.image}
          resizeMode="cover"
        />
      )}
      
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.title}>{name}</Text>
          <View style={styles.actions}>
            {onEdit && (
              <TouchableOpacity
                onPress={() => onEdit(workout)}
                style={styles.actionButton}
              >
                <Ionicons name="pencil" size={18} color={colors.text.secondary} />
              </TouchableOpacity>
            )}
            {onDelete && (
              <TouchableOpacity
                onPress={() => onDelete(workout)}
                style={styles.actionButton}
              >
                <Ionicons name="trash" size={18} color={colors.error} />
              </TouchableOpacity>
            )}
          </View>
        </View>

        {description && (
          <Text style={styles.description} numberOfLines={2}>
            {description}
          </Text>
        )}

        <View style={styles.details}>
          <View style={styles.detailItem}>
            <Ionicons name="time-outline" size={16} color={colors.text.secondary} />
            <Text style={styles.detailText}>{formatDuration(duration)}</Text>
          </View>

          <View style={styles.detailItem}>
            <Ionicons name="fitness-outline" size={16} color={colors.text.secondary} />
            <Text style={styles.detailText}>{exercises?.length || 0} exercises</Text>
          </View>

          <View style={[styles.difficultyBadge, { backgroundColor: getDifficultyColor(difficulty) }]}>
            <Text style={styles.difficultyText}>{difficulty}</Text>
          </View>
        </View>

        {lastPerformed && (
          <Text style={styles.lastPerformed}>
            Last performed: {new Date(lastPerformed).toLocaleDateString()}
          </Text>
        )}

        {completed && (
          <View style={styles.completedBadge}>
            <Ionicons name="checkmark-circle" size={20} color={colors.success} />
            <Text style={styles.completedText}>Completed</Text>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    marginBottom: spacing.md,
    shadowColor: colors.shadow,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  completedCard: {
    opacity: 0.8,
    borderWidth: 2,
    borderColor: colors.success,
  },
  image: {
    width: '100%',
    height: 120,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },
  content: {
    padding: spacing.md,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  title: {
    ...typography.h3,
    color: colors.text.primary,
    flex: 1,
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionButton: {
    padding: spacing.xs,
    marginLeft: spacing.sm,
  },
  description: {
    ...typography.body,
    color: colors.text.secondary,
    marginBottom: spacing.sm,
  },
  details: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    marginBottom: spacing.sm,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: spacing.md,
    marginBottom: spacing.xs,
  },
  detailText: {
    ...typography.caption,
    color: colors.text.secondary,
    marginLeft: spacing.xs,
  },
  difficultyBadge: {
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs / 2,
    borderRadius: 12,
  },
  difficultyText: {
    ...typography.caption,
    color: colors.white,
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  lastPerformed: {
    ...typography.caption,
    color: colors.text.secondary,
    fontStyle: 'italic',
  },
  completedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: spacing.sm,
  },
  completedText: {
    ...typography.caption,
    color: colors.success,
    marginLeft: spacing.xs,
    fontWeight: '600',
  },
});

export default WorkoutCard;