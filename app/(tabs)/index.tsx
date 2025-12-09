import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import HomeScreen from '../../screens/main/HomeScreen';
import { useNavigation } from '@react-navigation/native';

export default function HomeTab() {
  const navigation = useNavigation();
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <HomeScreen navigation={navigation} />
    </SafeAreaView>
  );
}
