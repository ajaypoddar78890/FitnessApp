import React, { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Feather from 'react-native-vector-icons/Feather';
import { authApi } from '../api/authApi';
import { CustomToast } from '../components/CustomToast';
import { ThemedText } from '../components/themed-text';
import { ThemedView } from '../components/themed-view';
import { Colors } from '../constants/theme';
import { useAuth } from '../context/AuthContext';
import { useColorScheme } from '../hooks/use-color-scheme';

export default function AccountInfo({ navigation, route }) {
  const { user, token } = useAuth();
  const theme = useColorScheme() ?? 'light';

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: Colors[theme].background,
    },
    safeArea: {
      flex: 1,
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: 16,
      paddingVertical: 16,
    },
    backButton: {
      padding: 8,
    },
    headerTitle: {
      fontSize: 18,
      fontWeight: '600',
      color: Colors[theme].text,
    },
    placeholder: {
      width: 40,
    },
    scrollView: {
      flex: 1,
    },
    section: {
      padding: 16,
      borderBottomWidth: 1,
      borderBottomColor: theme === 'dark' ? '#374151' : '#e5e7eb',
    },
    sectionTitle: {
      fontSize: 16,
      fontWeight: '600',
      color: Colors[theme].text,
      marginBottom: 12,
    },
    userInfo: {
      fontSize: 14,
      color: Colors[theme].icon,
      marginBottom: 4,
    },
    fieldContainer: {
      marginBottom: 16,
    },
    fieldLabel: {
      fontSize: 14,
      fontWeight: '500',
      color: Colors[theme].text,
      marginBottom: 8,
    },
    textInput: {
      backgroundColor: theme === 'dark' ? '#374151' : '#f9fafb',
      borderRadius: 8,
      paddingHorizontal: 12,
      paddingVertical: 12,
      fontSize: 16,
      color: Colors[theme].text,
      borderWidth: 1,
      borderColor: theme === 'dark' ? '#4b5563' : '#d1d5db',
    },
    optionsContainer: {
      flexDirection: 'row',
    },
    optionButton: {
      backgroundColor: theme === 'dark' ? '#374151' : '#f9fafb',
      paddingHorizontal: 16,
      paddingVertical: 8,
      borderRadius: 20,
      marginRight: 8,
      borderWidth: 1,
      borderColor: theme === 'dark' ? '#4b5563' : '#d1d5db',
    },
    optionButtonSelected: {
      backgroundColor: '#a855f7',
      borderColor: '#a855f7',
    },
    optionText: {
      fontSize: 14,
      color: Colors[theme].icon,
    },
    optionTextSelected: {
      color: '#fff',
      fontWeight: '500',
    },
    saveButton: {
      backgroundColor: '#a855f7',
      borderRadius: 12,
      paddingVertical: 16,
      alignItems: 'center',
      margin: 16,
      marginTop: 24,
    },
    saveButtonDisabled: {
      opacity: 0.6,
    },
    saveButtonText: {
      fontSize: 16,
      fontWeight: '600',
      color: '#fff',
    },
  });
  const [profile, setProfile] = useState({
    age: '',
    height: '',
    weight: '',
    gender: '',
    fitnessGoal: '',
    activityLevel: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);
  const [showCustomToast, setShowCustomToast] = useState(false);
  const [customToastMessage, setCustomToastMessage] = useState('');
  const [customToastType, setCustomToastType] = useState('success');

  // Fetch profile from API on mount
  React.useEffect(() => {
    const fetchProfile = async () => {
      if (!token) return;
      try {
        setIsFetching(true);
        console.log('📥 Fetching profile from API...');
        console.log('🌐 API Endpoint:', 'GET /auth/profile');
        
        const data = await authApi.getProfile(token);
        if (data && data.profile) {
          const p = data.profile as {
            age?: number;
            height?: number;
            weight?: number;
            gender?: string;
            fitnessGoal?: string;
            activityLevel?: string;
          };
          setProfile({
            age: p.age !== undefined ? p.age.toString() : '',
            height: p.height !== undefined ? p.height.toString() : '',
            weight: p.weight !== undefined ? p.weight.toString() : '',
            gender: p.gender || '',
            fitnessGoal: p.fitnessGoal || '',
            activityLevel: p.activityLevel || ''
          });
        }
      } catch (err) {
        console.error('Failed to fetch profile:', err);
      } finally {
        setIsFetching(false);
      }
    };
    fetchProfile();
  }, [token]);

  const handleBack = () => {
    navigation.goBack();
  };

  const handleInputChange = (field: string, value: string) => {
    setProfile(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSave = async () => {
    if (!token) {
      Alert.alert('Error', 'You must be logged in to update profile');
      return;
    }

    // Basic validation
    if (profile.age && (isNaN(Number(profile.age)) || Number(profile.age) < 1 || Number(profile.age) > 120)) {
      Alert.alert('Error', 'Please enter a valid age (1-120)');
      return;
    }

    if (profile.height && (isNaN(Number(profile.height)) || Number(profile.height) < 50 || Number(profile.height) > 300)) {
      Alert.alert('Error', 'Please enter a valid height (50-300 cm)');
      return;
    }

    if (profile.weight && (isNaN(Number(profile.weight)) || Number(profile.weight) < 20 || Number(profile.weight) > 500)) {
      Alert.alert('Error', 'Please enter a valid weight (20-500 kg)');
      return;
    }

    try {
      setIsLoading(true);
      console.log('💾 Saving fitness profile...', profile);

      // Separate fitness data from general profile data
      const fitnessData: any = {};
      const generalData: any = {};

      // Define which fields are fitness-related
      const fitnessFields = ['weight', 'height', 'age', 'fitnessGoal', 'activityLevel'];

      Object.keys(profile).forEach(key => {
        const value = profile[key];
        if (value === '' || value === undefined) return; // Skip empty fields

        if (fitnessFields.includes(key)) {
          // Convert numeric fields
          if (key === 'weight' || key === 'height' || key === 'age') {
            fitnessData[key] = Number(value);
          } else {
            fitnessData[key] = value;
          }
        } else {
          // General profile fields
          if (key === 'age') {
            generalData[key] = Number(value);
          } else {
            generalData[key] = value;
          }
        }
      });

      // Update fitness profile if we have fitness data
      if (Object.keys(fitnessData).length > 0) {
        console.log('📤 Sending fitness profile update payload:', JSON.stringify(fitnessData, null, 2));
        console.log('🌐 API Endpoint:', 'PUT /auth/profile/fitness');
        await authApi.updateFitnessProfile(token, fitnessData);
      }

      // Update general profile if we have general data
      if (Object.keys(generalData).length > 0) {
        console.log('📤 Sending general profile update payload:', JSON.stringify(generalData, null, 2));
        console.log('🌐 API Endpoint:', 'PUT /auth/profile');
        await authApi.updateProfile(token, generalData);
      }

      console.log('🍞 Attempting to show success toast with custom implementation...');
      setCustomToastMessage('Profile updated successfully! 🎉');
      setShowCustomToast(true);
      console.log('🍞 Custom success toast displayed');

      // Navigate back after toast is visible (reduced from 4000ms to 2000ms)
      setTimeout(() => {
        navigation.goBack();
      }, 1500);

      
    } catch (error: any) {
      console.error('Profile update error:', error);
      setCustomToastMessage(`Error: ${error.message || 'Failed to update profile'}`);
      setCustomToastType('error');
      setShowCustomToast(true);
    } finally {
      setIsLoading(false);
    }
  };

  const renderPickerField = (
    title: string, 
    value: string, 
    options: {label: string, value: string}[], 
    onSelect: (value: string) => void
  ) => (
    <View style={styles.fieldContainer}>
      <ThemedText style={styles.fieldLabel}>{title}</ThemedText>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.optionsContainer}>
        {options.map((option) => (
          <TouchableOpacity
            key={option.value}
            style={[
              styles.optionButton,
              value === option.value && styles.optionButtonSelected
            ]}
            onPress={() => onSelect(option.value)}
          >
            <ThemedText style={[
              styles.optionText,
              value === option.value && styles.optionTextSelected
            ]}>
              {option.label}
            </ThemedText>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );

  return (
    <ThemedView style={styles.container}>
      <SafeAreaView style={styles.safeArea} edges={['top']}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={handleBack} style={styles.backButton}>
            <Feather name="arrow-left" size={24} color={Colors[theme].text} />
          </TouchableOpacity>
          <ThemedText style={styles.headerTitle}>Fitness Profile</ThemedText>
          <View style={styles.placeholder} />
        </View>

        {isFetching ? (
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', }}>
            <ActivityIndicator size="large" color={Colors[theme].tint} />
          </View>
        ) : (
          <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
           
            {/* Basic Stats */}
            <View style={styles.section}>
              <ThemedText style={styles.sectionTitle}>Basic Stats</ThemedText>

              <View style={styles.fieldContainer}>
                <ThemedText style={styles.fieldLabel}>Age (years)</ThemedText>
                <TextInput
                  style={styles.textInput}
                  value={profile.age}
                  onChangeText={(value) => handleInputChange('age', value)}
                  placeholder={profile.age ? profile.age : "Enter your age"}
                  placeholderTextColor={Colors[theme].icon}
                  keyboardType="numeric"
                />
              </View>

              <View style={styles.fieldContainer}>
                <ThemedText style={styles.fieldLabel}>Height (cm)</ThemedText>
                <TextInput
                  style={styles.textInput}
                  value={profile.height}
                  onChangeText={(value) => handleInputChange('height', value)}
                  placeholder={profile.height ? profile.height : "Enter height in centimeters"}
                  placeholderTextColor={Colors[theme].icon}
                  keyboardType="numeric"
                />
              </View>

              <View style={styles.fieldContainer}>
                <ThemedText style={styles.fieldLabel}>Weight (kg)</ThemedText>
                <TextInput
                  style={styles.textInput}
                  value={profile.weight}
                  onChangeText={(value) => handleInputChange('weight', value)}
                  placeholder={profile.weight ? profile.weight : "Enter weight in kilograms"}
                  placeholderTextColor={Colors[theme].icon}
                  keyboardType="numeric"
                />
              </View>
              {/* Gender Selection */}
            {renderPickerField('Gender', profile.gender, [
              { label: 'Male', value: 'male' },
              { label: 'Female', value: 'female' },
              { label: 'Other', value: 'other' }
            ], (value) => handleInputChange('gender', value))}

            {/* Fitness Goal Selection */}
            {renderPickerField('Fitness Goal', profile.fitnessGoal, [
              { label: 'Weight Loss', value: 'weight_loss' },
              { label: 'Muscle Gain', value: 'muscle_gain' },
              { label: 'Maintenance', value: 'maintenance' },
              { label: 'Endurance', value: 'endurance' }
            ], (value) => handleInputChange('fitnessGoal', value))}

            {/* Activity Level Selection */}
            {renderPickerField('Activity Level', profile.activityLevel, [
              { label: 'Sedentary', value: 'sedentary' },
              { label: 'Lightly Active', value: 'lightly_active' },
              { label: 'Moderately Active', value: 'moderately_active' },
              { label: 'Very Active', value: 'very_active' }
            ], (value) => handleInputChange('activityLevel', value))}

            </View>

            {/* Debug: Show current payload */}
            <View style={styles.section}>
              <ThemedText style={styles.sectionTitle}>Debug: Current Payload</ThemedText>
              <ThemedText style={{ fontSize: 12, color: Colors[theme].icon, fontFamily: 'monospace' }}>
                {JSON.stringify({
                  ...profile,
                  age: profile.age ? Number(profile.age) : undefined,
                  height: profile.height ? Number(profile.height) : undefined,
                  weight: profile.weight ? Number(profile.weight) : undefined
                }, (key, value) => {
                  if (value === '' || value === undefined) return undefined;
                  return value;
                }, 2)}
              </ThemedText>
            </View>

            {/* Save Button */}
            <TouchableOpacity 
              style={[styles.saveButton, isLoading && styles.saveButtonDisabled]} 
              onPress={handleSave}
              disabled={isLoading}
            >
              {isLoading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <ThemedText style={styles.saveButtonText}>Save Profile</ThemedText>
              )}
            </TouchableOpacity>
          </ScrollView>
        )}

        {/* Custom Toast Component */}
        <CustomToast
          visible={showCustomToast}
          message={customToastMessage}
          type={customToastType}
          onHide={() => setShowCustomToast(false)}
        />
      </SafeAreaView>
    </ThemedView>
  );
}
