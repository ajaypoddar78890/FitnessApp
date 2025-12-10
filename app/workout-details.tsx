import { useNavigation, useRoute } from '@react-navigation/native';
import React from 'react';
import {
    Dimensions,
    FlatList,
    Image,
    ScrollView,
    StyleSheet,
    TouchableOpacity,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Feather from 'react-native-vector-icons/Feather';
import { ThemedText } from '../components/themed-text';

const { width } = Dimensions.get('window');

interface Exercise {
  id: string;
  name: string;
  duration: string;
  reps?: string;
  image: any;
  type: 'exercise' | 'rest';
}

interface WorkoutSection {
  title: string;
  duration: string;
  exercises: Exercise[];
}

// Dynamic workout data based on workout type
const getWorkoutData = (workoutId: string, title: string) => {
  const workoutPlans: { [key: string]: any } = {
    'Morning Cardio': {
      description: 'Cardiovascular training is an essential component of any fitness routine, especially for building endurance and burning calories',
      duration: '30 min',
      calories: '340 Kcal',
      level: 'Beginner',
      equipment: [
        { name: '2 Dumbbells', icon: 'activity' },
        { name: 'Mat', icon: 'fitness-outline' }
      ],
      sections: [
        {
          title: 'Warm-up',
          duration: '3 Exercises • 2 Minutes',
          exercises: [
            { id: '1', name: 'Jumping Jacks', duration: '0:40', type: 'exercise', image: require('../assets/images/onboaring1.webp') },
            { id: '2', name: 'High Knees', duration: '0:30', type: 'exercise', image: require('../assets/images/onboaring1.webp') },
            { id: '3', name: 'Rest', duration: '0:30', type: 'rest', image: require('../assets/images/onboaring1.webp') },
          ]
        },
        {
          title: 'Workout',
          duration: '5 Exercises • 25 Minutes',
          exercises: [
            { id: '4', name: 'Burpees', duration: '20', reps: '20', type: 'exercise', image: require('../assets/images/onboaring1.webp') },
            { id: '5', name: 'Mountain Climbers', duration: '20', reps: '20', type: 'exercise', image: require('../assets/images/onboaring1.webp') },
            { id: '6', name: 'Jump Squats', duration: '20', reps: '20', type: 'exercise', image: require('../assets/images/onboaring1.webp') },
            { id: '7', name: 'Push Ups', duration: '20', reps: '15', type: 'exercise', image: require('../assets/images/onboaring1.webp') },
            { id: '8', name: 'Rest', duration: '01:30', type: 'rest', image: require('../assets/images/onboaring1.webp') },
          ]
        }
      ]
    },
    'Strength Training': {
      description: 'Resistance training, also known as strength training, is an essential component of any fitness routine, especially for your upper body',
      duration: '45 min',
      calories: '450 Kcal',
      level: 'Beginner',
      equipment: [
        { name: 'Dumbbells', icon: 'activity' },
        { name: 'Bench', icon: 'fitness-outline' }
      ],
      sections: [
        {
          title: 'Warm-up',
          duration: '3 Exercises • 5 Minutes',
          exercises: [
            { id: '1', name: 'Arm Circles', duration: '0:45', type: 'exercise', image: require('../assets/images/onboaring2.webp') },
            { id: '2', name: 'Shoulder Rolls', duration: '0:30', type: 'exercise', image: require('../assets/images/onboaring2.webp') },
            { id: '3', name: 'Rest', duration: '0:30', type: 'rest', image: require('../assets/images/onboaring2.webp') },
          ]
        },
        {
          title: 'Workout',
          duration: '6 Exercises • 35 Minutes',
          exercises: [
            { id: '4', name: 'Dumbbell Press', duration: '15', reps: '15', type: 'exercise', image: require('../assets/images/onboaring2.webp') },
            { id: '5', name: 'Bicep Curls', duration: '12', reps: '12', type: 'exercise', image: require('../assets/images/onboaring2.webp') },
            { id: '6', name: 'Tricep Dips', duration: '10', reps: '10', type: 'exercise', image: require('../assets/images/onboaring2.webp') },
            { id: '7', name: 'Shoulder Press', duration: '12', reps: '12', type: 'exercise', image: require('../assets/images/onboaring2.webp') },
            { id: '8', name: 'Chest Fly', duration: '10', reps: '10', type: 'exercise', image: require('../assets/images/onboaring2.webp') },
            { id: '9', name: 'Rest', duration: '02:00', type: 'rest', image: require('../assets/images/onboaring2.webp') },
          ]
        }
      ]
    },
    'Yoga Flow': {
      description: 'Mindful movement and flexibility training designed to improve strength, balance, and mental wellness',
      duration: '25 min',
      calories: '180 Kcal',
      level: 'Beginner',
      equipment: [
        { name: 'Yoga Mat', icon: 'activity' },
        { name: 'Block (Optional)', icon: 'square-outline' }
      ],
      sections: [
        {
          title: 'Warm-up',
          duration: '3 Exercises • 5 Minutes',
          exercises: [
            { id: '1', name: 'Cat-Cow Stretch', duration: '1:00', type: 'exercise', image: require('../assets/images/onboaring3.webp') },
            { id: '2', name: 'Child\'s Pose', duration: '0:45', type: 'exercise', image: require('../assets/images/onboaring3.webp') },
            { id: '3', name: 'Rest', duration: '0:30', type: 'rest', image: require('../assets/images/onboaring3.webp') },
          ]
        },
        {
          title: 'Flow Sequence',
          duration: '4 Exercises • 18 Minutes',
          exercises: [
            { id: '4', name: 'Sun Salutation A', duration: '8', reps: '8', type: 'exercise', image: require('../assets/images/onboaring3.webp') },
            { id: '5', name: 'Warrior II Flow', duration: '6', reps: '6', type: 'exercise', image: require('../assets/images/onboaring3.webp') },
            { id: '6', name: 'Tree Pose', duration: '5', reps: '5', type: 'exercise', image: require('../assets/images/onboaring3.webp') },
            { id: '7', name: 'Savasana', duration: '03:00', type: 'rest', image: require('../assets/images/onboaring3.webp') },
          ]
        }
      ]
    }
  };

  // Default workout data if specific workout not found
  return workoutPlans[title] || workoutPlans['Morning Cardio'];
};

export default function WorkoutDetailsScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const { id, title, level, duration, category } = route.params || {};
  
  const workoutData = getWorkoutData(id as string, title as string);

  const handleStartWorkout = () => {
    // Navigate to workout execution screen (to be created later)
    console.log('Starting workout:', title);
  };

  const handleScheduleWorkout = () => {
    console.log('Scheduling workout:', title);
  };

  const handlePickPlaylist = () => {
    console.log('Picking playlist for workout:', title);
  };

  const renderExercise = ({ item, index }: { item: Exercise; index: number }) => {
    const handleExercisePress = () => {
      if (item.type !== 'rest') {
        navigation.navigate('exercise-details', {
          exerciseName: item.name,
          fromWorkout: title,
        });
      }
    };

    return (
      <TouchableOpacity 
        style={styles.exerciseItem} 
        activeOpacity={0.7}
        onPress={handleExercisePress}
      >
        <View style={styles.exerciseImageContainer}>
          {item.type === 'rest' ? (
            <View style={styles.restIcon}>
              <Feather name="pause-circle" size={24} color="#a855f7" />
            </View>
          ) : (
            <Image source={item.image} style={styles.exerciseImage} />
          )}
        </View>
        
        <View style={styles.exerciseInfo}>
          <ThemedText style={styles.exerciseName}>{item.name}</ThemedText>
          <ThemedText style={styles.exerciseDuration}>
            {item.reps ? `${item.reps} reps` : item.duration}
          </ThemedText>
        </View>
        
        <TouchableOpacity style={styles.infoButton} onPress={handleExercisePress}>
          <Feather name="info" size={20} color="#8e8e93" />
        </TouchableOpacity>
      </TouchableOpacity>
    );
  };

  const renderWorkoutSection = ({ item }: { item: WorkoutSection }) => (
    <View style={styles.sectionContainer}>
      <View style={styles.sectionHeader}>
        <ThemedText style={styles.sectionTitle}>{item.title}</ThemedText>
        <ThemedText style={styles.sectionDuration}>{item.duration}</ThemedText>
      </View>
      
      <FlatList
        data={item.exercises}
        renderItem={renderExercise}
        keyExtractor={(exercise) => exercise.id}
        scrollEnabled={false}
        ItemSeparatorComponent={() => <View style={styles.exerciseSeparator} />}
      />
    </View>
  );

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Icon name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.favoriteButton}>
          <Icon name="heart-outline" size={24} color="#fff" />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Hero Section */}
        <View style={styles.heroSection}>
          {/* Mountain Graphics */}
          <View style={styles.mountainContainer}>
            <View style={styles.purpleDot} />
            <View style={styles.mountainBack} />
            <View style={styles.mountainFront} />
          </View>
        </View>

        {/* Workout Info */}
        <View style={styles.workoutInfo}>
          <ThemedText style={styles.workoutTitle}>{title}</ThemedText>
          <ThemedText style={styles.workoutDescription}>
            {workoutData.description}
          </ThemedText>

          {/* Stats */}
          <View style={styles.statsContainer}>
            <View style={styles.statItem}>
              <Icon name="time-outline" size={16} color="#fff" />
              <ThemedText style={styles.statText}>{workoutData.duration}</ThemedText>
            </View>
            <View style={styles.statItem}>
              <Icon name="flame-outline" size={16} color="#fff" />
              <ThemedText style={styles.statText}>{workoutData.calories}</ThemedText>
            </View>
            <View style={styles.statItem}>
              <Icon name="bar-chart-outline" size={16} color="#fff" />
              <ThemedText style={styles.statText}>{workoutData.level}</ThemedText>
            </View>
          </View>

          {/* Equipment */}
          <View style={styles.equipmentSection}>
            <View style={styles.equipmentHeader}>
              <ThemedText style={styles.equipmentTitle}>Equipment</ThemedText>
              <ThemedText style={styles.equipmentCount}>{workoutData.equipment.length} Items</ThemedText>
            </View>
            
            <View style={styles.equipmentList}>
              {workoutData.equipment.map((item: any, index: number) => (
                <View key={index} style={styles.equipmentItem}>
                  <View style={styles.equipmentIcon}>
                    <View style={styles.mountainIcon}>
                      <View style={styles.smallMountain} />
                    </View>
                  </View>
                  <ThemedText style={styles.equipmentName}>{item.name}</ThemedText>
                </View>
              ))}
            </View>
          </View>

          {/* Action Buttons */}
          <View style={styles.actionButtons}>
            <TouchableOpacity 
              style={styles.actionButton}
              onPress={handleScheduleWorkout}
            >
              <ThemedText style={styles.actionButtonText}>Schedule workout</ThemedText>
              <Icon name="chevron-forward" size={20} color="#fff" />
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.actionButton}
              onPress={handlePickPlaylist}
            >
              <ThemedText style={styles.actionButtonText}>Pick a playlist</ThemedText>
              <Icon name="chevron-forward" size={20} color="#fff" />
            </TouchableOpacity>
          </View>

          {/* Exercises */}
          <View style={styles.exercisesContainer}>
            <ThemedText style={styles.exercisesTitle}>Exercises</ThemedText>
            
            <FlatList
              data={workoutData.sections}
              renderItem={renderWorkoutSection}
              keyExtractor={(section, index) => index.toString()}
              scrollEnabled={false}
              ItemSeparatorComponent={() => <View style={styles.sectionSeparator} />}
            />
          </View>
        </View>
      </ScrollView>

      {/* Start Workout Button */}
      <View style={styles.bottomButton}>
        <TouchableOpacity 
          style={styles.startButton}
          onPress={handleStartWorkout}
          activeOpacity={0.8}
        >
          <ThemedText style={styles.startButtonText}>Start Workout</ThemedText>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a1a',
  },
  scrollView: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  favoriteButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  heroSection: {
    height: 200,
    backgroundColor: '#E5E7EB',
    margin: 20,
    borderRadius: 20,
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
  },
  mountainContainer: {
    position: 'relative',
    width: 100,
    height: 60,
  },
  purpleDot: {
    position: 'absolute',
    top: 0,
    right: 10,
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#8B5CF6',
  },
  mountainBack: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 0,
    height: 0,
    backgroundColor: 'transparent',
    borderStyle: 'solid',
    borderLeftWidth: 30,
    borderRightWidth: 40,
    borderBottomWidth: 35,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderBottomColor: '#A78BFA',
  },
  mountainFront: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    width: 0,
    height: 0,
    backgroundColor: 'transparent',
    borderStyle: 'solid',
    borderLeftWidth: 35,
    borderRightWidth: 35,
    borderBottomWidth: 40,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderBottomColor: '#8B5CF6',
  },
  workoutInfo: {
    paddingHorizontal: 20,
  },
  workoutTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: '#fff',
    marginBottom: 12,
  },
  workoutDescription: {
    fontSize: 16,
    color: '#a1a1aa',
    lineHeight: 24,
    marginBottom: 24,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: '#2a2a2a',
    borderRadius: 16,
    paddingVertical: 20,
    marginBottom: 32,
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statText: {
    fontSize: 14,
    color: '#fff',
    fontWeight: '600',
    marginTop: 8,
  },
  equipmentSection: {
    marginBottom: 32,
  },
  equipmentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  equipmentTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#fff',
  },
  equipmentCount: {
    fontSize: 14,
    color: '#a1a1aa',
  },
  equipmentList: {
    flexDirection: 'row',
    gap: 16,
  },
  equipmentItem: {
    alignItems: 'center',
    flex: 1,
  },
  equipmentIcon: {
    width: 60,
    height: 60,
    backgroundColor: '#2a2a2a',
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  mountainIcon: {
    position: 'relative',
    width: 30,
    height: 20,
  },
  smallMountain: {
    position: 'absolute',
    bottom: 0,
    left: 5,
    width: 0,
    height: 0,
    backgroundColor: 'transparent',
    borderStyle: 'solid',
    borderLeftWidth: 10,
    borderRightWidth: 10,
    borderBottomWidth: 15,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderBottomColor: '#8B5CF6',
  },
  equipmentName: {
    fontSize: 12,
    color: '#fff',
    textAlign: 'center',
  },
  actionButtons: {
    gap: 12,
    marginBottom: 32,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#2a2a2a',
    borderRadius: 16,
    paddingVertical: 16,
    paddingHorizontal: 20,
  },
  actionButtonText: {
    fontSize: 16,
    color: '#fff',
    fontWeight: '500',
  },
  exercisesContainer: {
    marginBottom: 100,
  },
  exercisesTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 20,
  },
  sectionContainer: {
    marginBottom: 24,
  },
  sectionHeader: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 4,
  },
  sectionDuration: {
    fontSize: 14,
    color: '#a1a1aa',
  },
  sectionSeparator: {
    height: 16,
  },
  exerciseItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2a2a2a',
    borderRadius: 16,
    padding: 16,
  },
  exerciseImageContainer: {
    width: 50,
    height: 50,
    borderRadius: 12,
    backgroundColor: '#E5E7EB',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  exerciseImage: {
    width: 40,
    height: 40,
    borderRadius: 8,
  },
  restIcon: {
    width: 50,
    height: 50,
    borderRadius: 12,
    backgroundColor: '#1a1a1a',
    alignItems: 'center',
    justifyContent: 'center',
  },
  exerciseInfo: {
    flex: 1,
  },
  exerciseName: {
    fontSize: 16,
    fontWeight: '500',
    color: '#fff',
    marginBottom: 4,
  },
  exerciseDuration: {
    fontSize: 14,
    color: '#a1a1aa',
  },
  exerciseSeparator: {
    height: 12,
  },
  infoButton: {
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bottomButton: {
    display:'none',
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 20,
    paddingVertical: 20,
    backgroundColor: '#1a1a1a',
  },
  startButton: {
    backgroundColor: '#a855f7',
    borderRadius: 25,
    paddingVertical: 16,
    alignItems: 'center',
    shadowColor: '#a855f7',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  startButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
});
