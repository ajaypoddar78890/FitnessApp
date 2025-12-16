import { useState } from 'react';
import {
    Dimensions,
    SafeAreaView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
    Alert,
    ActivityIndicator,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { healthConnectService } from '../../services';

const { width, height } = Dimensions.get('window');

const WelcomeScreen = ({ navigation }) => {
  const [isSettingUp, setIsSettingUp] = useState(false);

  const handleGetStarted = async () => {
    setIsSettingUp(true);
    
    try {
      // Check if Health Connect is available
      const available = await healthConnectService.isAvailable();
      
      if (!available) {
        // Health Connect not available - guide user to install
        Alert.alert(
          'Health Connect Setup',
          'To track your steps and activity, you need Google Health Connect.\n\n• Android 14+: Already included\n• Android 13 and below: Download from Play Store\n\nInstall it now?',
          [
            { 
              text: 'Skip for Now', 
              style: 'cancel',
              onPress: () => navigation.navigate('(tabs)')
            },
            { 
              text: 'Install Now', 
              onPress: () => {
                healthConnectService.openHealthConnectPlayStore();
                // Still navigate to main app - user can set up later
                setTimeout(() => navigation.navigate('(tabs)'), 1000);
              }
            }
          ]
        );
      } else {
        // Health Connect available - request permissions
        try {
          await healthConnectService.requestPermissions();
          Alert.alert(
            'Setup Complete! 🎉',
            'Health Connect is ready. You can now track your steps and activity.',
            [{ text: 'Continue', onPress: () => navigation.navigate('(tabs)') }]
          );
        } catch (permissionError) {
          console.log('Permission setup failed:', permissionError.message);
          
          // Permission failed, but still let user continue
          Alert.alert(
            'Setup Incomplete',
            'Health Connect permissions were not granted. You can set this up later from the home screen.',
            [{ text: 'Continue', onPress: () => navigation.navigate('(tabs)') }]
          );
        }
      }
    } catch (error) {
      console.error('Health Connect setup error:', error);
      // If setup fails, still let user continue to main app
      Alert.alert(
        'Welcome!',
        'Welcome to FitooZone! You can set up health tracking later.',
        [{ text: 'Continue', onPress: () => navigation.navigate('(tabs)') }]
      );
    } finally {
      setIsSettingUp(false);
    }
  };

  const handleSignIn = () => {
    // Navigate to login screen
    navigation.navigate('Login');
  };

  return (
    <SafeAreaView style={styles.container}>
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
            <Text style={styles.welcomeText}>Welcome</Text>
            <Text style={styles.appNameText}>to FitooZone</Text>
          </View>

          <Text style={styles.descriptionText}>
            FitooZone has workouts on demand that you can find based on how much time you have
          </Text>

          {/* Pagination Dots */}
          <View style={styles.paginationContainer}>
            <View style={[styles.dot, styles.activeDot]} />
            <View style={styles.dot} />
            <View style={styles.dot} />
          </View>

          {/* Get Started Button */}
          <TouchableOpacity 
            style={[styles.getStartedButton, isSettingUp && styles.disabledButton]}
            onPress={handleGetStarted}
            activeOpacity={0.8}
            disabled={isSettingUp}
          >
            {isSettingUp ? (
              <View style={styles.loadingContainer}>
                <ActivityIndicator color="#fff" size="small" />
                <Text style={styles.getStartedText}>Setting up...</Text>
              </View>
            ) : (
              <Text style={styles.getStartedText}>Get Started</Text>
            )}
          </TouchableOpacity>

          {/* Sign In Link */}
          <View style={styles.signInContainer}>
            <Text style={styles.signInText}>Already have account? </Text>
            <TouchableOpacity onPress={handleSignIn}>
                <Text style={styles.signInLink}>Sign in</Text>
              </TouchableOpacity>
          </View>
        </View>
      </LinearGradient>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
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
  disabledButton: {
    backgroundColor: '#6b46c1',
    shadowOpacity: 0.1,
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
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