import React from 'react';
import HomeScreen from '../../screens/main/HomeScreen';

// Mock navigation object for now
const mockNavigation = {
  navigate: (screen: string, params?: any) => {
    console.log('Navigate to:', screen, params);
  }
};

export default function HomeTab() {
  return <HomeScreen navigation={mockNavigation} />;
}
