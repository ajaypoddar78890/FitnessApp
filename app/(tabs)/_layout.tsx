import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';
import React from 'react';
import Icon from 'react-native-vector-icons/Ionicons';
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
          title: 'Health',
          tabBarIcon: ({ color }) => <Icon name="home" size={24} color={color} />,
        }}
      />
      <Tab.Screen
        name="workouts"
        component={WorkoutsScreen}
        options={{
          title: 'Workouts',
          tabBarIcon: ({ color }) => <Icon name="barbell" size={24} color={color} />,
        }}
      />
      <Tab.Screen
        name="me"
        component={MeScreen}
        options={{
          title: 'Profile',
          tabBarIcon: ({ color }) => <Icon name="person" size={24} color={color} />,
        }}
      />
      <Tab.Screen
        name="devices"
        component={DevicesScreen}
        options={{
          title: 'Devices',
          tabBarIcon: ({ color }) => <Icon name="watch" size={24} color={color} />,
        }}
      />
    </Tab.Navigator>
  );
}
