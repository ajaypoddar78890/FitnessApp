import { userApi } from '@/api/userApi';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Colors } from '@/constants/theme';
import { useAuth } from '@/context/AuthContext';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { useFocusEffect } from '@react-navigation/native';
import React, { useEffect, useState, useCallback } from 'react';
import { ActivityIndicator, Image, ScrollView, StyleSheet, Switch, TouchableOpacity, View } from 'react-native';

export default function MeTab() {
  const { user, logout, token } = useAuth();
  const [profile, setProfile] = useState<any>({});
  const [isLoadingProfile, setIsLoadingProfile] = useState(true);
  const [pinLock, setPinLock] = React.useState(true);
  const [appleHealth, setAppleHealth] = React.useState(true);
  const [darkMode, setDarkMode] = React.useState(true);

  // Get display values from user data and profile
  const name = user?.name || 'User';
  const avatar = user?.avatar || null;
  const weight = profile && profile.weight !== undefined && profile.weight !== null ? `${profile.weight} kg` : 'Set weight';
  const height = profile && profile.height !== undefined && profile.height !== null ? `${profile.height} cm` : 'Set height';
  const age = profile && profile.age !== undefined && profile.age !== null ? `${profile.age} years` : 'Set age';

  useFocusEffect(
    useCallback(() => {
      loadFitnessProfile();
    }, [token])
  );

  const loadFitnessProfile = useCallback(async () => {
    if (!token) return;
    
    try {
      setIsLoadingProfile(true);
      const data = await userApi.getFitnessProfile(token);
      console.log('📦 Profile response:', data);
      if (data && data.profile) {
        console.log('📦 Setting profile:', data.profile);
        setProfile(data.profile);
      } else {
        console.log('📦 No profile data found');
        setProfile({});
      }
    } catch (error: any) {
      console.log('⚠️ Could not load fitness profile:', error.message);
      // Don't show error to user, just use default values
      setProfile({});
    } finally {
      setIsLoadingProfile(false);
    }
  }, [token]);

  return (
    <ThemedView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <ThemedText type="title" style={styles.header}>Profile</ThemedText>

        <View style={styles.centered}>
        <View style={styles.avatarWrapper}>
          {avatar ? (
            <Image source={{ uri: avatar }} style={styles.avatar} />
          ) : (
            <View  style={styles.placeholder} />
          )}
        </View>
        <ThemedText type="title" style={styles.userName}>{name}</ThemedText>

        <View style={styles.statsRow}>
          <LinearGradient colors={["#7c3aed", "#a855f7"]} style={styles.statCard}>
            {isLoadingProfile ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <ThemedText style={styles.statValue}>{weight}</ThemedText>
            )}
          </LinearGradient>
          <LinearGradient colors={["#7c3aed", "#a855f7"]} style={styles.statCard}>
            {isLoadingProfile ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <ThemedText style={styles.statValue}>{height}</ThemedText>
            )}
          </LinearGradient>
          <LinearGradient colors={["#7c3aed", "#a855f7"]} style={styles.statCard}>
            {isLoadingProfile ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <ThemedText style={styles.statValue}>{age}</ThemedText>
            )}
          </LinearGradient>
        </View>

        <TouchableOpacity style={styles.goPremiumButton} activeOpacity={0.8}>
          <LinearGradient colors={["#7c3aed", "#a855f7"]} style={styles.goPremiumGradient}>
            <ThemedText style={styles.goPremiumText}>Go Premium</ThemedText>
          </LinearGradient>
        </TouchableOpacity>

        <View style={styles.card}>
          <TouchableOpacity style={styles.cardRow} onPress={() => {
            // Pass current profile data to account-info screen
            router.push({
              pathname: '/account-info',
              params: { profileData: JSON.stringify(profile || {}) }
            });
          }}>
            <ThemedText>Account & Profile Settings</ThemedText>
          </TouchableOpacity>
          <TouchableOpacity style={styles.cardRow} onPress={() => router.push('/my-workouts')}>
            <ThemedText>My workouts 🚀</ThemedText>
          </TouchableOpacity>
          <TouchableOpacity style={styles.cardRow} onPress={() => router.push('/workout-reminders')}>
            <ThemedText>Workout reminders</ThemedText>
          </TouchableOpacity>
          <TouchableOpacity style={styles.cardRow} onPress={logout}><ThemedText>Log out</ThemedText></TouchableOpacity>
        </View>

        <ThemedText style={styles.settingsHeader}>Settings</ThemedText>
        <View style={styles.card}>
          <TouchableOpacity style={styles.cardRow}><ThemedText>Preferences</ThemedText></TouchableOpacity>
          <TouchableOpacity style={styles.cardRow}><ThemedText>Plan Settings</ThemedText></TouchableOpacity>
          <View style={styles.cardRowRow}>
            <ThemedText>Pin Lock</ThemedText>
            <Switch value={pinLock} onValueChange={setPinLock} />
          </View>
          <View style={styles.cardRowRow}>
            <ThemedText>Apple Health</ThemedText>
            <Switch value={appleHealth} onValueChange={setAppleHealth} />
          </View>
          <View style={styles.cardRowRow}>
            <ThemedText>Dark Mode</ThemedText>
            <Switch value={darkMode} onValueChange={setDarkMode} />
          </View>
          <TouchableOpacity style={styles.cardRow}><ThemedText>Contacts Support</ThemedText></TouchableOpacity>
        </View>
        </View>
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
    backgroundColor: Colors.dark.background,
  },
  header: {
    marginTop: 16,
    paddingLeft: 6,
  },
  centered: {
    alignItems: 'center',
    marginTop: 16,
  },
  avatarWrapper: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: '#e5e7eb',
    alignItems: 'center',
    justifyContent: 'center',
  },
  placeholder: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: '#c7b1e6',
  },
  avatar: {
    width: 90,
    height: 90,
    borderRadius: 45,
  },
  userName: {
    marginTop: 8,
  },
  statsRow: {
    flexDirection: 'row',
    marginTop: 16,
    gap: 10,
  },
  statCard: {
    padding: 14,
    borderRadius: 12,
    marginHorizontal: 6,
    minWidth: 90,
    alignItems: 'center',
  },
  statValue: {
    color: '#fff',
    fontWeight: '700',
    textAlign: 'center',
  },
  goPremiumButton: {
    marginTop: 20,
    width: '100%',
  },
  goPremiumGradient: {
    paddingVertical: 16,
    borderRadius: 30,
    alignItems: 'center',
    marginHorizontal: 8,
  },
  goPremiumText: {
    color: '#fff',
    fontWeight: '700',
  },
  card: {
    marginTop: 18,
    width: '100%',
    backgroundColor: '#23232a',
    borderRadius: 12,
    paddingVertical: 8,
  },
  cardRow: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#2b2b31',
  },
  cardRowRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#2b2b31',
  },
  settingsHeader: {
    width: '100%',
    paddingLeft: 6,
    marginTop: 22,
    fontSize: 12,
    color: '#fff',
    fontWeight: '700',
  },
  scrollContent: {
    paddingBottom: 40,
  },
});