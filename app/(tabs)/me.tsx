import React from 'react';
import { StyleSheet } from 'react-native';
import { ThemedView } from '@/components/themed-view';
import ProfileCard from '@/components/profile/ProfileCard';
import { useAuth } from '@/context/AuthContext';

export default function MeTab() {
  const { user } = useAuth();

  const noop = () => {};

  return (
    <ThemedView style={styles.container}>
      {user ? (
        <ProfileCard user={user} onEdit={noop} onViewStats={noop} onSettings={noop} />
      ) : (
        <ProfileCard
          user={{
            name: 'Guest',
            email: 'guest@example.com',
            avatar: null,
            level: 0,
            experience: 0,
            nextLevelExp: 100,
            streak: 0,
            totalWorkouts: 0,
            joinDate: new Date().toISOString(),
          }}
          onEdit={noop}
          onViewStats={noop}
          onSettings={noop}
        />
      )}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
});