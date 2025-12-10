import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';
import React from 'react';
import Feather from 'react-native-vector-icons/Feather';
import { Colors } from '../../constants/theme';
import { useColorScheme } from '../../hooks/use-color-scheme';

// Import your tab screens
import DevicesScreen from './devices';
import IndexScreen from './index';
import MeScreen from './me';
import WorkoutsScreen from './workouts';

const Tab = createMaterialBottomTabNavigator();

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
      }}
      barStyle={{
        backgroundColor: Colors[colorScheme ?? 'light'].background,
      }}>
      <Tab.Screen
        name="index"
        component={IndexScreen}
        options={{
          title: 'Home',
          tabBarIcon: ({ color }) => <Feather name="home" size={26} color={color} />,
        }}
      />
      <Tab.Screen
        name="workouts"
        component={WorkoutsScreen}
        options={{
          title: 'Trainings',
          tabBarIcon: ({ color }) => <Feather name="activity" size={26} color={color} />,
        }}
      />
      <Tab.Screen
        name="me"
        
         component={DevicesScreen}
        options={{
          title: 'Activity',
          tabBarIcon: ({ color }) => <Feather name="bar-chart-2" size={26} color={color} />,
        }}
      />
      <Tab.Screen
        name="devices"
         component={MeScreen}
        options={{
          title: 'Profile',
          tabBarIcon: ({ color }) => <Feather name="user" size={26} color={color} />,
        }}
      />
    </Tab.Navigator>
  );
}
