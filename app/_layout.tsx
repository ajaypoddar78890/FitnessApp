import { DarkTheme, DefaultTheme, NavigationContainer, ThemeProvider } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { StatusBar } from 'react-native';
import 'react-native-reanimated';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { AuthProvider } from '../context/AuthContext';
import { WorkoutProvider } from '../context/WorkoutContext';
import { useColorScheme } from '../hooks/use-color-scheme';

// Import your screens
import TabLayout from './(tabs)/_layout';
import AuthLayout from './auth/_layout';
import ExerciseDetailsScreen from './exercise-details';
import IndexScreen from './index';
import WelcomeScreen from './welcome';
import WorkoutDetailsScreen from './workout-details';

const Stack = createStackNavigator();

export default function RootLayout() {
  const colorScheme = useColorScheme();

  return (
    <SafeAreaProvider>
      <AuthProvider>
        <WorkoutProvider>
          <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
            <NavigationContainer>
              <Stack.Navigator
                screenOptions={{
                  headerShown: false,
                }}>
                <Stack.Screen name="index" component={IndexScreen} options={{ headerShown: false }} />
                <Stack.Screen name="welcome" component={WelcomeScreen} options={{ headerShown: false }} />
                <Stack.Screen name="auth" component={AuthLayout} options={{ headerShown: false }} />
                <Stack.Screen name="tabs" component={TabLayout} options={{ headerShown: false }} />
                <Stack.Screen name="workout-details" component={WorkoutDetailsScreen} options={{ headerShown: false }} />
                <Stack.Screen name="exercise-details" component={ExerciseDetailsScreen} options={{ headerShown: false }} />
              </Stack.Navigator>
              <StatusBar barStyle="light-content" backgroundColor="#000000" translucent={false} />
            </NavigationContainer>
          </ThemeProvider>
        </WorkoutProvider>
      </AuthProvider>
    </SafeAreaProvider>
  );
}
