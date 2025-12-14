import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
// import VectorIcon from 'react-native-vector-icons/Ionicons';
import { Text } from 'react-native';

import { useAuth } from '../context/AuthContext';
import { colors } from '../theme';

// Auth Screens
import LoginScreen from '../screens/auth/LoginScreen';
import RegisterScreen from '../screens/auth/RegisterScreen';

// Main Screens
import HomeScreen from '../screens/main/HomeScreen';
import ProfileScreen from '../screens/profile/ProfileScreen';
import StatsScreen from '../screens/stats/StatsScreen';
import WorkoutsScreen from '../screens/workouts/WorkoutsScreen';

// Workout Screens
import CreateWorkoutScreen from '../screens/workouts/CreateWorkoutScreen';
import WorkoutDetailScreen from '../screens/workouts/WorkoutDetailScreen';
import WorkoutSessionScreen from '../screens/workouts/WorkoutSessionScreen';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

const AuthStack = () => (
  <Stack.Navigator
    initialRouteName="Login"
    screenOptions={{
      headerShown: false,
      cardStyle: { backgroundColor: colors.background },
    }}
  >
    <Stack.Screen name="Login" component={LoginScreen} />
    <Stack.Screen name="Register" component={RegisterScreen} />
  </Stack.Navigator>
);

const WorkoutStack = () => (
  <Stack.Navigator
    initialRouteName="WorkoutsList"
    screenOptions={{
      headerStyle: {
        backgroundColor: colors.surface,
        shadowColor: 'transparent',
        elevation: 0,
      },
      headerTintColor: colors.text.primary,
      headerTitleStyle: {
        fontWeight: '600',
      },
    }}
  >
    <Stack.Screen
      name="WorkoutsList"
      component={WorkoutsScreen}
      options={{ title: 'Workouts' }}
    />
    <Stack.Screen
      name="WorkoutDetail"
      component={WorkoutDetailScreen}
      options={{ title: 'Workout Details' }}
    />
    <Stack.Screen
      name="WorkoutSession"
      component={WorkoutSessionScreen}
      options={{ 
        title: 'Workout Session',
        headerLeft: null,
        gestureEnabled: false,
      }}
    />
    <Stack.Screen
      name="CreateWorkout"
      component={CreateWorkoutScreen}
      options={{ title: 'Create Workout' }}
    />
  </Stack.Navigator>
);

const MainTabs = () => (
  <Tab.Navigator
    initialRouteName="Home"
    screenOptions={({ route }) => ({
      tabBarIcon: ({ focused, color, size }) => {
        let iconName;

        switch (route.name) {
          case 'Home':
            iconName = focused ? 'home' : 'home-outline';
            break;
          case 'Workouts':
            iconName = focused ? 'fitness' : 'fitness-outline';
            break;
          case 'Stats':
            iconName = focused ? 'bar-chart' : 'bar-chart-outline';
            break;
          case 'Profile':
            iconName = focused ? 'person' : 'person-outline';
            break;
          default:
            iconName = 'home-outline';
        }

        return <Text style={{fontSize: size, color}}>{iconName.slice(0,1).toUpperCase()}</Text>;
      },
      tabBarActiveTintColor: colors.primary,
      tabBarInactiveTintColor: colors.text.secondary,
      tabBarStyle: {
        backgroundColor: colors.surface,
        borderTopColor: colors.border,
        paddingBottom: 5,
        paddingTop: 5,
        height: 60,
      },
      tabBarLabelStyle: {
        fontSize: 12,
        fontWeight: '500',
      },
      headerShown: false,
    })}
  >
    <Tab.Screen name="Home" component={HomeScreen} />
    <Tab.Screen name="Workouts" component={WorkoutStack} />
    <Tab.Screen name="Stats" component={StatsScreen} />
    <Tab.Screen name="Profile" component={ProfileScreen} />
  </Tab.Navigator>
);

const AppNavigator = () => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    // You can add a loading screen component here
    return null;
  }

  return isAuthenticated ? <MainTabs /> : <AuthStack />;
};

export default AppNavigator;