import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { View } from 'react-native';
import { AuthProvider } from './context/AuthContext';
import { WorkoutProvider } from './context/WorkoutContext';

// Import your screens
import TabsLayout from './app/(tabs)/_layout';
import AuthLayout from './app/auth/_layout';
import SignInScreen from './app/auth/signin';
import SignUpScreen from './app/auth/signup';
import IndexScreen from './app/index';
import WelcomeScreen from './app/welcome';

const Stack = createStackNavigator();

export default function App() {
  console.log('MyFitnessApp starting...');
  
  return (
    <View style={{ flex: 1 }}>
      <AuthProvider>
        <WorkoutProvider>
          <NavigationContainer>
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
            </Stack.Navigator>
          </NavigationContainer>
        </WorkoutProvider>
      </AuthProvider>
    </View>
  );
}