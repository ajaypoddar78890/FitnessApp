import React, { useEffect, useState } from 'react';
import { Animated, Dimensions, StyleSheet, Text } from 'react-native';

const { width } = Dimensions.get('window');

export const CustomToast = ({ visible, message, type = 'success', onHide }) => {
  const [fadeAnim] = useState(new Animated.Value(0));
  const [slideAnim] = useState(new Animated.Value(100)); // Start from 100 (below) instead of -100 (above)

  useEffect(() => {
    if (visible) {
      // Slide in and fade in
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();

      // Auto hide after 3 seconds
      const timer = setTimeout(() => {
        hideToast();
      }, 1500);

      return () => clearTimeout(timer);
    }
  }, [visible]);

  const hideToast = () => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 100, // Slide down instead of up
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start(() => {
      onHide && onHide();
    });
  };

  if (!visible && fadeAnim._value === 0) {
    return null;
  }

  const backgroundColor = type === 'success' ? '#10b981' : type === 'error' ? '#ef4444' : '#3b82f6';

  return (
    <Animated.View
      style={[
        styles.container,
        {
          opacity: fadeAnim,
          transform: [{ translateY: slideAnim }],
          backgroundColor,
        },
      ]}
    >
      <Text style={styles.text}>{message}</Text>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 100, // Position at bottom instead of top
    left: '50%', // Center horizontally
    marginLeft: -175, // Half of width to center (350/2 = 175)
    width: 350, // Fixed width instead of full screen
    backgroundColor: '#10b981',
    paddingHorizontal: 12,
    paddingVertical: 12,
    borderRadius: 12,
    zIndex: 9999,
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  text: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
    textAlign: 'center',
  },
});

// Toast manager for easy usage
class ToastManager {
  static toastRef = null;

  static setRef = (ref) => {
    ToastManager.toastRef = ref;
  };

  static show = (message, type = 'success') => {
    if (ToastManager.toastRef) {
      ToastManager.toastRef.showToast(message, type);
    }
  };
}

export { ToastManager };

