import React from 'react';
import { StyleSheet } from 'react-native';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';

export default function DevicesTab() {
  return (
    <ThemedView style={styles.container}>
      <ThemedText type="title" style={styles.title}>
        Devices
      </ThemedText>
      <ThemedText style={styles.desc}>
        Manage and sync your fitness devices here. This is a placeholder screen for now.
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