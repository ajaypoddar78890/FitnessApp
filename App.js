import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { View } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import Toast from 'react-native-toast-message';
import { AuthProvider } from './context/AuthContext';
import { WorkoutProvider } from './context/WorkoutContext';

// Import your screens
import TabsLayout from './app/(tabs)/_layout';
import AuthLayout from './app/auth/_layout';
import SignInScreen from './app/auth/signin';
import SignUpScreen from './app/auth/signup';
import IndexScreen from './app/index';
import MyWorkoutsScreen from './app/my-workouts';
import WelcomeScreen from './app/welcome';
import WorkoutRemindersScreen from './app/workout-reminders';

const Stack = createStackNavigator();

export default function App() {
  console.log('MyFitnessApp starting...');
  
  return (
    <SafeAreaProvider>
      <AuthProvider>
        <WorkoutProvider>
          <NavigationContainer>
            <View style={{ flex: 1 }}>
              <Stack.Navigator
                initialRouteName="Index"
                screenOptions={{ headerShown: false }}
              >
                <Stack.Screen name="Index" component={IndexScreen} />
                <Stack.Screen name="Welcome" component={WelcomeScreen} />
                <Stack.Screen name="Auth" component={AuthLayout} />
                <Stack.Screen name="SignIn" component={SignInScreen} />
                <Stack.Screen name="SignUp" component={SignUpScreen} />
                <Stack.Screen name="Tabs" component={TabsLayout} />
                <Stack.Screen name="MyWorkouts" component={MyWorkoutsScreen} />
                <Stack.Screen name="WorkoutReminders" component={WorkoutRemindersScreen} />
              </Stack.Navigator>
              <Toast 
                ref={(ref) => Toast.setRef(ref)}
                position="bottom"
                bottomOffset={40}
              />
            </View>
          </NavigationContainer>
        </WorkoutProvider>
      </AuthProvider>
    </SafeAreaProvider>
  );
}