import React from 'react';
import { View, StyleSheet } from 'react-native';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';

export default function WorkoutsTab() {
  return (
    <ThemedView style={styles.container}>
      <ThemedText type="title" style={styles.title}>
        Workouts
      </ThemedText>
      <ThemedText style={styles.desc}>
        Your workouts will appear here. Create and save workouts from the Workouts tab.
      </ThemedText>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  title: {
    marginTop: 24,
    marginBottom: 12,
    textAlign: 'center',
  },
  desc: {
    textAlign: 'center',
  },
});