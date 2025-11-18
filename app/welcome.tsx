import React, { useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import PagerView from 'react-native-pager-view';
import { router } from 'expo-router';

const { width, height } = Dimensions.get('window');

const onboardingData = [
  {
    title: 'Welcome',
    subtitle: 'to FitooZone',
    description: 'FitooZone has workouts on demand that you can find based on how much time you have',
  },
  {
    title: 'Workout Categories',
    subtitle: '',
    description: 'Workout categories will help you gain strength, get in better shape and embrace a healthy lifestyle',
  },
  {
    title: 'Custom Workouts',
    subtitle: '',
    description: 'Create and save your own custom workouts. Name your workouts, save them, and they\'ll automatically appear when you\'re ready to workout',
  },
];

const WelcomeScreen = () => {
  const [currentPage, setCurrentPage] = useState(0);
  const pagerRef = useRef<PagerView>(null);

  const handleGetStarted = () => {
    router.replace('/auth/signin' as any);
  };

  const handleNext = () => {
    if (currentPage < onboardingData.length - 1) {
      pagerRef.current?.setPage(currentPage + 1);
    } else {
      handleGetStarted();
    }
  };

  const handleSignIn = () => {
    router.push('/auth/signin' as any);
  };

  const renderContent = (item: typeof onboardingData[0], index: number) => (
    <View key={index} style={styles.pageContainer}>
      <LinearGradient
        colors={['#667eea', '#764ba2', '#f093fb']}
        style={styles.gradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        {/* Purple Circle */}
        <View style={styles.topCircle} />
        
        {/* Mountain Graphics */}
        <View style={styles.mountainContainer}>
          <View style={styles.mountainBack} />
          <View style={styles.mountainFront} />
        </View>

        {/* Welcome Content */}
        <View style={styles.content}>
          <View style={styles.titleContainer}>
            <Text style={styles.welcomeText}>{item.title}</Text>
            {item.subtitle ? (
              <Text style={styles.appNameText}>{item.subtitle}</Text>
            ) : null}
          </View>

          <Text style={styles.descriptionText}>
            {item.description}
          </Text>

          {/* Pagination Dots */}
          <View style={styles.paginationContainer}>
            {onboardingData.map((_, dotIndex) => (
              <View
                key={dotIndex}
                style={[
                  styles.dot,
                  dotIndex === currentPage ? styles.activeDot : null,
                ]}
              />
            ))}
          </View>

          {/* Action Button */}
          <TouchableOpacity 
            style={styles.getStartedButton}
            onPress={handleNext}
            activeOpacity={0.8}
          >
            <Text style={styles.getStartedText}>
              {currentPage === onboardingData.length - 1 ? 'Start Training' : 'Next'}
            </Text>
          </TouchableOpacity>

          {/* Sign In Link - only show on first screen */}
          {currentPage === 0 && (
            <View style={styles.signInContainer}>
              <Text style={styles.signInText}>Already have account? </Text>
              <TouchableOpacity onPress={handleSignIn}>
                <Text style={styles.signInLink}>Sing in</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </LinearGradient>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <PagerView
        ref={pagerRef}
        style={styles.container}
        initialPage={0}
        onPageSelected={(e) => setCurrentPage(e.nativeEvent.position)}
      >
        {onboardingData.map((item, index) => renderContent(item, index))}
      </PagerView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  pageContainer: {
    flex: 1,
  },
  gradient: {
    flex: 1,
    position: 'relative',
  },
  topCircle: {
    position: 'absolute',
    top: height * 0.15,
    left: width * 0.35,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#a855f7',
  },
  mountainContainer: {
    position: 'absolute',
    top: height * 0.25,
    left: 0,
    right: 0,
    height: height * 0.25,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  mountainBack: {
    position: 'absolute',
    bottom: 0,
    width: 0,
    height: 0,
    backgroundColor: 'transparent',
    borderStyle: 'solid',
    borderLeftWidth: 80,
    borderRightWidth: 120,
    borderBottomWidth: 100,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderBottomColor: '#8b5cf6',
    left: width * 0.25,
  },
  mountainFront: {
    position: 'absolute',
    bottom: 0,
    width: 0,
    height: 0,
    backgroundColor: 'transparent',
    borderStyle: 'solid',
    borderLeftWidth: 100,
    borderRightWidth: 100,
    borderBottomWidth: 120,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderBottomColor: '#a855f7',
    left: width * 0.4,
  },
  content: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#000',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    paddingHorizontal: 24,
    paddingTop: 40,
    paddingBottom: 40,
    height: height * 0.45,
  },
  titleContainer: {
    alignItems: 'center',
    marginBottom: 24,
  },
  welcomeText: {
    fontSize: 32,
    fontWeight: '700',
    color: '#fff',
    textAlign: 'center',
  },
  appNameText: {
    fontSize: 32,
    fontWeight: '700',
    color: '#fff',
    textAlign: 'center',
    marginTop: -5,
  },
  descriptionText: {
    fontSize: 16,
    color: '#a1a1aa',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 32,
    paddingHorizontal: 20,
  },
  paginationContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 32,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#3f3f46',
    marginHorizontal: 4,
  },
  activeDot: {
    backgroundColor: '#a855f7',
    width: 24,
  },
  getStartedButton: {
    backgroundColor: '#a855f7',
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 25,
    alignItems: 'center',
    marginBottom: 24,
    shadowColor: '#a855f7',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  getStartedText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
  signInContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  signInText: {
    fontSize: 14,
    color: '#a1a1aa',
  },
  signInLink: {
    fontSize: 14,
    color: '#a855f7',
    fontWeight: '600',
  },
});

export default WelcomeScreen;