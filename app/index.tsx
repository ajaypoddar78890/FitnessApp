import { ThemedText } from '@/components/themed-text';
import { Colors } from '@/constants/theme';
import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, View } from 'react-native';
import { useAuth } from '../context/AuthContext';
import { storageService } from '../storage/storageService';

export default function IndexScreen() {
  const { isAuthenticated, isLoading, user } = useAuth();
  const [isCheckingOnboarding, setIsCheckingOnboarding] = useState(true);

  useEffect(() => {
    const checkInitialRoute = async () => {
      if (!isLoading) {
        if (isAuthenticated && user) {
          console.log('🏠 User is authenticated - redirecting to main app');
          // User is logged in, go to main app
          router.replace('/(tabs)');
        } else {
          // Check if onboarding was completed for new users
          const onboardingCompleted = await storageService.isOnboardingCompleted();
          if (onboardingCompleted) {
            console.log('� Onboarding completed - redirecting to signin');
            // User has seen onboarding, go to signin
            router.replace('/auth/signin');
          } else {
            console.log('👋 New user - showing welcome screens');
            // First time user, show welcome/onboarding
            router.replace('/welcome');
          }
        }
        setIsCheckingOnboarding(false);
      }
    };

    checkInitialRoute();
  }, [isLoading, isAuthenticated, user]);

  // Show loading screen while checking authentication and onboarding
  if (isLoading || isCheckingOnboarding) {
    return (
      <View style={{
        flex: 1,
        backgroundColor: Colors.dark.background,
        justifyContent: 'center',
        alignItems: 'center',
      }}>
        <ActivityIndicator size="large" color="#a855f7" />
        <ThemedText style={{ marginTop: 16, color: '#fff' }}>
          Loading...
        </ThemedText>
      </View>
    );
  }

  return null; // Should never reach here due to navigation redirects
}