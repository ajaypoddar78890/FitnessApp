import { useNavigation } from '@react-navigation/native';
import React from 'react';
import {
  FlatList,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import Feather from 'react-native-vector-icons/Feather';

interface Notification {
  id: string;
  title: string;
  time: string;
  icon: string;
  type: string;
}

const NotificationScreen = () => {
  const notifications: Notification[] = [
    {
      id: '1',
      title: 'Full Body Yoga',
      time: '08:30',
      icon: '⛰️',
      type: 'workout',
    },
    {
      id: '2',
      title: 'Functional Workout',
      time: '17:30',
      icon: '⛰️',
      type: 'workout',
    },
    {
      id: '3',
      title: 'Lower Body Express',
      time: '08:30',
      icon: '⛰️',
      type: 'workout',
    },
    {
      id: '4',
      title: 'Glutes & Abs',
      time: '17:30',
      icon: '⛰️',
      type: 'workout',
    },
  ];

  const navigation = useNavigation();

  const handleBackPress = () => {
    navigation.goBack();
  };

  const handleNotificationPress = (notification: Notification) => {
    // Navigate to workout details or handle notification action
    navigation.navigate('workout-details' as never, {
      title: notification.title,
      time: notification.time,
    });
  };

  const renderNotificationItem = ({ item }: { item: Notification }) => (
    <TouchableOpacity 
      style={styles.notificationItem}
      onPress={() => handleNotificationPress(item)}
      activeOpacity={0.8}
    >
      <View style={styles.notificationIcon}>
        <Text style={styles.iconEmoji}>{item.icon}</Text>
      </View>
      <View style={styles.notificationContent}>
        <Text style={styles.notificationTitle}>{item.title}</Text>
        <View style={styles.timeContainer}>
          <Text style={styles.notificationTime}>{item.time}</Text>
        </View>
      </View>
      <TouchableOpacity style={styles.arrowButton}>
        <Feather name="chevron-right" size={20} color="#8e8e93" />
      </TouchableOpacity>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={handleBackPress}>
          <Feather name="chevron-left" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Notifications</Text>
        <View style={styles.placeholder} />
      </View>
      
      <ScrollView 
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <FlatList
          data={notifications}
          renderItem={renderNotificationItem}
          keyExtractor={(item) => item.id}
          scrollEnabled={false}
          ItemSeparatorComponent={() => <View style={styles.separator} />}
        />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#2D3450',
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#2D3450',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#ffffff',
  },
  placeholder: {
    width: 40,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
  },
  notificationItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#3d3d4d',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
  },
  notificationIcon: {
    width: 60,
    height: 60,
    backgroundColor: '#9ca3af',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  iconEmoji: {
    fontSize: 30,
  },
  notificationContent: {
    flex: 1,
  },
  notificationTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#ffffff',
    marginBottom: 8,
  },
  timeContainer: {
    backgroundColor: '#9662F1',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: 'flex-start',
  },
  notificationTime: {
    fontSize: 12,
    fontWeight: '600',
    color: '#ffffff',
  },
  arrowButton: {
    padding: 8,
  },
  separator: {
    height: 0,
  },
});

export default NotificationScreen;
