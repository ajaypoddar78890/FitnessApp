import { createStackNavigator } from '@react-navigation/stack';
import React from 'react';
import SignInScreen from './signin';
import SignUpScreen from './signup';

const AuthStack = createStackNavigator();

export default function AuthLayout() {
  return (
    <AuthStack.Navigator screenOptions={{ headerShown: false }}>
      <AuthStack.Screen name="SignIn" component={SignInScreen} />
      <AuthStack.Screen name="SignUp" component={SignUpScreen} />
    </AuthStack.Navigator>
  );
}
