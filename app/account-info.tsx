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
import Toast from 'react-native-toast-message';
import { Colors } from '../constants/theme';
import { useAuth } from '../context/AuthContext';

export default function AccountInfo({ navigation, route }) {
  const { user, token } = useAuth();
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

  // Fetch profile from API on mount
  React.useEffect(() => {
    const fetchProfile = async () => {
      if (!token) return;
      try {
        setIsFetching(true);
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

      // Convert string numbers to actual numbers
      const profileData: any = {
        ...profile,
        age: profile.age ? Number(profile.age) : undefined,
        height: profile.height ? Number(profile.height) : undefined,
        weight: profile.weight ? Number(profile.weight) : undefined
      };

      // Remove empty fields
      Object.keys(profileData).forEach(key => {
        if (profileData[key] === '' || profileData[key] === undefined) {
          delete profileData[key];
        }
      });

      await authApi.updateProfile(token, profileData);
      
      Alert.alert('Success', 'Profile updated successfully!', [
        { text: 'OK', onPress: () => navigation.goBack() }
      ]);
    } catch (error: any) {
      console.error('Profile update error:', error);
      Alert.alert('Error', error.message || 'Failed to update profile. Please try again.');
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
            <Feather name="arrow-left" size={24} color="#fff" />
          </TouchableOpacity>
          <ThemedText style={styles.headerTitle}>Fitness Profile</ThemedText>
          <View style={styles.placeholder} />
        </View>

        {isFetching ? (
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', }}>
            <ActivityIndicator size="large" color="#a855f7" />
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
                  placeholderTextColor="#6b7280"
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
                  placeholderTextColor="#6b7280"
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
                  placeholderTextColor="#6b7280"
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
      </SafeAreaView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.dark.background,
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
    // borderBottomWidth: 1,
    // borderBottomColor: '#374151',
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#fff',
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
    borderBottomColor: '#374151',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 12,
  },
  userInfo: {
    fontSize: 14,
    color: '#9ca3af',
    marginBottom: 4,
  },
  fieldContainer: {
    marginBottom: 16,
  },
  fieldLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#fff',
    marginBottom: 8,
  },
  textInput: {
    backgroundColor: '#374151',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    fontSize: 16,
    color: '#fff',
    borderWidth: 1,
    borderColor: '#4b5563',
  },
  optionsContainer: {
    flexDirection: 'row',
  },
  optionButton: {
    backgroundColor: '#374151',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
    borderWidth: 1,
    borderColor: '#4b5563',
  },
  optionButtonSelected: {
    backgroundColor: '#a855f7',
    borderColor: '#a855f7',
  },
  optionText: {
    fontSize: 14,
    color: '#9ca3af',
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
