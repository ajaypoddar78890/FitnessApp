import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import React, { useRef, useState } from 'react';
import {
  Dimensions,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import PagerView from 'react-native-pager-view';
import { SafeAreaView } from 'react-native-safe-area-context';
import { storageService } from '../storage/storageService';

const { width, height } = Dimensions.get('window');

const onboardingData = [
  {
    title: 'Welcome',
    subtitle: 'to Fitlabzz',
    description: 'Fitlabzz has workouts on demand that you can find based on how much time you have',
    image: require('../assets/images/onboaring1.webp'),
  },
  {
    title: 'Workout Categories',
    subtitle: '',
    description: 'Workout categories will help you gain strength, get in better shape and embrace a healthy lifestyle',
    image: require('../assets/images/onboaring2.webp'),
  },
  {
    title: 'Custom Workouts',
    subtitle: '',
    description: 'Create and save your own custom workouts. Name your workouts, save them, and they\'ll automatically appear when you\'re ready to workout',
    image: require('../assets/images/onboaring3.webp'),
  },
];

const WelcomeScreen = () => {
  const [currentPage, setCurrentPage] = useState(0);
  const pagerRef = useRef<PagerView>(null);

  const handleGetStarted = async () => {
    console.log('📚 Marking onboarding as completed');
    await storageService.setOnboardingCompleted(true);
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
      {/* Onboarding Image - Full screen background */}
      <Image 
        source={item.image} 
        style={styles.backgroundImage}
        resizeMode="cover"
      />
      
      {/* Gradient overlay from transparent to black */}
      <LinearGradient
        colors={['transparent', 'rgba(0,0,0,0.3)', 'rgba(0,0,0,0.8)', '#000000']}
        locations={[0, 0.4, 0.7, 1]}
        style={styles.gradientOverlay}
      />
      
      {/* Content overlay at bottom */}
      <View style={styles.contentOverlay}>
        <View style={styles.textSection}>
          <Text style={styles.welcomeText}>{item.title}</Text>
          {item.subtitle ? (
            <Text style={styles.appNameText}>{item.subtitle}</Text>
          ) : null}
          
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
              {currentPage === onboardingData.length - 1 ? 'Start Training' : (currentPage === 0 ? 'Get Started' : 'Start Training')}
            </Text>
          </TouchableOpacity>

          {/* Sign In Link - only show on first screen */}
          {currentPage === 0 && (
            <View style={styles.signInContainer}>
              <Text style={styles.signInText}>Already have account? </Text>
              <TouchableOpacity onPress={handleSignIn}>
                <Text style={styles.signInLink}>Sign in</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container} edges={[]}>
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
    backgroundColor: '#000',
  },
  pageContainer: {
    flex: 1,
  },
  backgroundImage: {
    width: '100%',
    height: '100%',
    position: 'absolute',
    top: 0,
    left: 0,
  },
  gradientOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  contentOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'transparent', // Make transparent to show gradient
    paddingHorizontal: 24,
    paddingTop: 60,
    paddingBottom: 40,
    height: height * 0.5, // Increase height to match Figma
  },
  textSection: {
    flex: 1,
    justifyContent: 'space-between',
  },
  welcomeText: {
    fontSize: 32,
    fontWeight: '700',
    color: '#fff',
    textAlign: 'center',
    marginBottom: 4,
  },
  appNameText: {
    fontSize: 32,
    fontWeight: '700',
    color: '#fff',
    textAlign: 'center',
    marginBottom: 16,
  },
  descriptionText: {
    fontSize: 16,
    color: '#a1a1aa', // Gray color like in Figma
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 24,
    paddingHorizontal: 16,
  },
  paginationContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#3f3f46', // Dark gray for inactive dots
    marginHorizontal: 4,
  },
  activeDot: {
    backgroundColor: '#a855f7', // Purple for active dot
    width: 24,
  },
  getStartedButton: {
    backgroundColor: '#a855f7',
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 25,
    alignItems: 'center',
    marginBottom: 16,
    width: '100%',
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
    color: '#a1a1aa', // Gray color
  },
  signInLink: {
    fontSize: 14,
    color: '#a855f7',
    fontWeight: '600',
  },
  // Unused styles - keeping for compatibility
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: width,
    height: height,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
  },
  content: {
    flex: 1,
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingTop: 60,
    paddingBottom: 40,
  },
  textContainer: {
    alignItems: 'center',
    marginTop: height * 0.5,
  },
  buttonContainer: {
    alignItems: 'center',
  },
  gradient: {
    flex: 1,
    position: 'relative',
  },
  imageContainer: {
    flex: 0.6,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 20,
    paddingHorizontal: 20,
  },
  onboardingImage: {
    width: width * 0.85,
    height: height * 0.45,
    borderRadius: 20,
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
  titleContainer: {
    alignItems: 'center',
    marginBottom: 16,
  },
});

export default WelcomeScreen;