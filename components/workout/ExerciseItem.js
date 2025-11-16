import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, typography } from '../../theme';

const ExerciseItem = ({
  exercise,
  onUpdateSets,
  isActive,
  onComplete,
  isCompleted
}) => {
  const [sets, setSets] = useState(exercise.sets || []);
  const [currentSet, setCurrentSet] = useState(0);

  useEffect(() => {
    onUpdateSets(exercise.id, sets);
  }, [sets]);

  const addSet = () => {
    const newSet = {
      id: Date.now(),
      reps: exercise.targetReps || 0,
      weight: exercise.targetWeight || 0,
      completed: false,
    };
    setSets([...sets, newSet]);
  };

  const updateSet = (setIndex, field, value) => {
    const updatedSets = sets.map((set, index) => {
      if (index === setIndex) {
        return { ...set, [field]: value };
      }
      return set;
    });
    setSets(updatedSets);
  };

  const completeSet = (setIndex) => {
    const updatedSets = sets.map((set, index) => {
      if (index === setIndex) {
        return { ...set, completed: !set.completed };
      }
      return set;
    });
    setSets(updatedSets);
    
    if (setIndex === sets.length - 1 && !sets[setIndex].completed) {
      setCurrentSet(0);
      onComplete(exercise.id);
    } else if (!sets[setIndex].completed) {
      setCurrentSet(setIndex + 1);
    }
  };

  const removeSet = (setIndex) => {
    Alert.alert(
      'Remove Set',
      'Are you sure you want to remove this set?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Remove',
          style: 'destructive',
          onPress: () => {
            const updatedSets = sets.filter((_, index) => index !== setIndex);
            setSets(updatedSets);
          },
        },
      ]
    );
  };

  return (
    <View style={[styles.container, isActive && styles.activeContainer]}>
      <View style={styles.header}>
        <View style={styles.exerciseInfo}>
          <Text style={styles.exerciseName}>{exercise.name}</Text>
          {exercise.description && (
            <Text style={styles.exerciseDescription}>{exercise.description}</Text>
          )}
          {exercise.targetReps && exercise.targetWeight && (
            <Text style={styles.target}>
              Target: {exercise.targetReps} reps × {exercise.targetWeight}kg
            </Text>
          )}
        </View>
        {isCompleted && (
          <Ionicons name="checkmark-circle" size={24} color={colors.success} />
        )}
      </View>

      <View style={styles.setsContainer}>
        <Text style={styles.setsTitle}>Sets</Text>
        {sets.map((set, index) => (
          <View
            key={set.id}
            style={[
              styles.setRow,
              currentSet === index && styles.activeSet,
              set.completed && styles.completedSet,
            ]}
          >
            <Text style={styles.setNumber}>{index + 1}</Text>
            
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.input}
                value={set.reps.toString()}
                onChangeText={(value) => updateSet(index, 'reps', parseInt(value) || 0)}
                placeholder="Reps"
                keyboardType="numeric"
                editable={!set.completed}
              />
              <Text style={styles.inputLabel}>reps</Text>
            </View>

            <Text style={styles.separator}>×</Text>

            <View style={styles.inputContainer}>
              <TextInput
                style={styles.input}
                value={set.weight.toString()}
                onChangeText={(value) => updateSet(index, 'weight', parseFloat(value) || 0)}
                placeholder="Weight"
                keyboardType="numeric"
                editable={!set.completed}
              />
              <Text style={styles.inputLabel}>kg</Text>
            </View>

            <TouchableOpacity
              style={[
                styles.completeButton,
                set.completed && styles.completedButton,
              ]}
              onPress={() => completeSet(index)}
            >
              <Ionicons
                name={set.completed ? "checkmark" : "ellipse-outline"}
                size={20}
                color={set.completed ? colors.white : colors.primary}
              />
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.removeButton}
              onPress={() => removeSet(index)}
            >
              <Ionicons name="close" size={18} color={colors.error} />
            </TouchableOpacity>
          </View>
        ))}

        <TouchableOpacity style={styles.addSetButton} onPress={addSet}>
          <Ionicons name="add" size={20} color={colors.primary} />
          <Text style={styles.addSetText}>Add Set</Text>
        </TouchableOpacity>
      </View>

      {exercise.notes && (
        <View style={styles.notesContainer}>
          <Text style={styles.notesTitle}>Notes:</Text>
          <Text style={styles.notes}>{exercise.notes}</Text>
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
    borderWidth: 2,
    borderColor: 'transparent',
  },
  activeContainer: {
    borderColor: colors.primary,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: spacing.md,
  },
  exerciseInfo: {
    flex: 1,
  },
  exerciseName: {
    ...typography.h3,
    color: colors.text.primary,
    marginBottom: spacing.xs,
  },
  exerciseDescription: {
    ...typography.body,
    color: colors.text.secondary,
    marginBottom: spacing.xs,
  },
  target: {
    ...typography.caption,
    color: colors.primary,
    fontWeight: '600',
  },
  setsContainer: {
    marginBottom: spacing.md,
  },
  setsTitle: {
    ...typography.h4,
    color: colors.text.primary,
    marginBottom: spacing.sm,
  },
  setRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.sm,
    marginBottom: spacing.xs,
    backgroundColor: colors.background,
    borderRadius: 8,
  },
  activeSet: {
    backgroundColor: colors.primary + '20',
    borderWidth: 1,
    borderColor: colors.primary,
  },
  completedSet: {
    backgroundColor: colors.success + '20',
    borderWidth: 1,
    borderColor: colors.success,
  },
  setNumber: {
    ...typography.body,
    color: colors.text.primary,
    fontWeight: '600',
    width: 30,
  },
  inputContainer: {
    alignItems: 'center',
    marginHorizontal: spacing.sm,
  },
  input: {
    ...typography.body,
    color: colors.text.primary,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 6,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    textAlign: 'center',
    minWidth: 60,
    backgroundColor: colors.white,
  },
  inputLabel: {
    ...typography.caption,
    color: colors.text.secondary,
    marginTop: spacing.xs / 2,
  },
  separator: {
    ...typography.body,
    color: colors.text.secondary,
    marginHorizontal: spacing.sm,
  },
  completeButton: {
    marginLeft: spacing.md,
    padding: spacing.sm,
  },
  completedButton: {
    backgroundColor: colors.success,
    borderRadius: 20,
  },
  removeButton: {
    marginLeft: spacing.sm,
    padding: spacing.xs,
  },
  addSetButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.md,
    borderWidth: 1,
    borderColor: colors.primary,
    borderRadius: 8,
    borderStyle: 'dashed',
  },
  addSetText: {
    ...typography.body,
    color: colors.primary,
    marginLeft: spacing.sm,
    fontWeight: '600',
  },
  notesContainer: {
    backgroundColor: colors.background,
    padding: spacing.sm,
    borderRadius: 8,
  },
  notesTitle: {
    ...typography.caption,
    color: colors.text.primary,
    fontWeight: '600',
    marginBottom: spacing.xs,
  },
  notes: {
    ...typography.caption,
    color: colors.text.secondary,
  },
});

export default ExerciseItem;