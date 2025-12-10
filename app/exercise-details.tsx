import { useNavigation, useRoute } from '@react-navigation/native';
import React from 'react';
import {
    Dimensions,
    Image,
    ScrollView,
    StyleSheet,
    TouchableOpacity,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Feather from 'react-native-vector-icons/Feather';
import Icon from 'react-native-vector-icons/Ionicons';
import { ThemedText } from '../components/themed-text';

const { width } = Dimensions.get('window');

interface ExerciseData {
  name: string;
  description: string;
  equipment: string[];
  techniques: string[];
  image: any;
  duration?: string;
  reps?: string;
  difficulty: string;
  muscleGroups: string[];
}

const getExerciseData = (exerciseName: string): ExerciseData => {
  const exerciseDatabase: { [key: string]: ExerciseData } = {
    'Jumping Jacks': {
      name: 'Jumping Jacks',
      description: 'A full-body cardio exercise that involves jumping with legs spread wide and arms overhead, then returning to starting position. Great for warming up and cardiovascular fitness.',
      equipment: ['None'],
      techniques: [
        'Stand with feet together and arms at your sides',
        'Jump while spreading your legs shoulder-width apart and raise your arms overhead',
        'Jump back to the starting position',
        'Maintain a steady rhythm and keep your core engaged'
      ],
      image: require('../assets/images/onboaring3.webp'),
      duration: '30 seconds',
      difficulty: 'Beginner',
      muscleGroups: ['Full Body', 'Cardiovascular']
    },
    'High Knees': {
      name: 'High Knees',
      description: 'A high-intensity cardio exercise that involves running in place while lifting knees as high as possible. Excellent for building leg strength and cardiovascular endurance.',
      equipment: ['None'],
      techniques: [
        'Stand with feet hip-width apart',
        'Run in place, bringing knees up toward your chest',
        'Keep your core tight and maintain good posture',
        'Pump your arms naturally as you run'
      ],
      image: require('../assets/images/onboaring2.webp'),
      duration: '30 seconds',
      difficulty: 'Intermediate',
      muscleGroups: ['Legs', 'Core', 'Cardiovascular']
    },
    'Push-ups': {
      name: 'Push-ups',
      description: 'A fundamental bodyweight exercise that targets the chest, shoulders, and triceps. Essential for building upper body strength and stability.',
      equipment: ['None'],
      techniques: [
        'Start in a plank position with hands slightly wider than shoulders',
        'Lower your body until chest nearly touches the ground',
        'Keep your body in a straight line from head to heels',
        'Push back up to starting position'
      ],
      image: require('../assets/images/onboaring1.webp'),
      reps: '10-15 reps',
      difficulty: 'Intermediate',
      muscleGroups: ['Chest', 'Shoulders', 'Triceps', 'Core']
    },
    'Squats': {
      name: 'Squats',
      description: 'A compound lower body exercise that targets multiple muscle groups. Perfect for building leg strength and improving functional movement patterns.',
      equipment: ['None'],
      techniques: [
        'Stand with feet shoulder-width apart',
        'Lower your body as if sitting back into a chair',
        'Keep your chest up and knees behind your toes',
        'Return to standing by driving through your heels'
      ],
      image: require('../assets/images/onboaring3.webp'),
      reps: '15-20 reps',
      difficulty: 'Beginner',
      muscleGroups: ['Quads', 'Glutes', 'Hamstrings', 'Core']
    },
    'Sumo Squat': {
      name: 'Sumo Squat',
      description: 'To further challenge yourself, try widening your stance to perform a sumo squat instead. This variation can add variety to your lower body strength training routine',
      equipment: ['2 Dumbbells'],
      techniques: [
        'Inhale while pushing your hips back and lowering into a squat position. Keep your core tight, back straight, and knees forward during this movement.',
        'Exhale while returning to the starting position. Focus on keeping your weight evenly distributed throughout your heel and midfoot.'
      ],
      image: require('../assets/images/onboaring2.webp'),
      reps: '12-15 reps',
      difficulty: 'Intermediate',
      muscleGroups: ['Glutes', 'Inner Thighs', 'Quads', 'Core']
    },
    'Lunges': {
      name: 'Lunges',
      description: 'A unilateral leg exercise that improves balance, coordination, and lower body strength. Great for correcting muscle imbalances.',
      equipment: ['None'],
      techniques: [
        'Stand with feet hip-width apart',
        'Step forward with one leg, lowering your hips',
        'Lower until both knees are bent at 90 degrees',
        'Push back to starting position and repeat on other leg'
      ],
      image: require('../assets/images/onboaring1.webp'),
      reps: '10-12 per leg',
      difficulty: 'Intermediate',
      muscleGroups: ['Quads', 'Glutes', 'Hamstrings', 'Calves']
    },
    'Mountain Climbers': {
      name: 'Mountain Climbers',
      description: 'A dynamic full-body exercise that combines cardio with core strengthening. Mimics the motion of climbing a mountain.',
      equipment: ['None'],
      techniques: [
        'Start in a high plank position',
        'Bring one knee toward your chest',
        'Quickly switch legs, bringing the other knee forward',
        'Continue alternating at a rapid pace'
      ],
      image: require('../assets/images/onboaring3.webp'),
      duration: '30 seconds',
      difficulty: 'Advanced',
      muscleGroups: ['Core', 'Shoulders', 'Legs', 'Cardiovascular']
    }
  };

  return exerciseDatabase[exerciseName] || exerciseDatabase['Squats'];
};

export default function ExerciseDetails() {
  const navigation = useNavigation();
  const route = useRoute();
  const { exerciseName, fromWorkout } = route.params || {};
  
  const exerciseData = getExerciseData(exerciseName as string);

  const handleBack = () => {
    navigation.goBack();
  };

  const handleClose = () => {
    navigation.goBack();
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Hero Section */}
        <View style={styles.heroSection}>
          <Image source={exerciseData.image} style={styles.heroImage} />
          <View style={styles.heroOverlay} />
          
          {/* Back Button */}
          <TouchableOpacity style={styles.backButton} onPress={handleBack}>
            <Feather name="arrow-left" size={24} color="#fff" />
          </TouchableOpacity>
        </View>

        {/* Content Section */}
        <View style={styles.contentSection}>
          {/* Exercise Title */}
          <View style={styles.titleSection}>
            <ThemedText style={styles.exerciseTitle}>{exerciseData.name}</ThemedText>
            <View style={styles.metaInfo}>
              <View style={styles.metaItem}>
                <Feather name="activity" size={16} color="#a855f7" />
                <ThemedText style={styles.metaText}>{exerciseData.difficulty}</ThemedText>
              </View>
              <View style={styles.metaItem}>
                <Feather name="clock" size={16} color="#a855f7" />
                <ThemedText style={styles.metaText}>
                  {exerciseData.duration || exerciseData.reps}
                </ThemedText>
              </View>
            </View>
          </View>

          {/* Description */}
          <View style={styles.section}>
            <ThemedText style={styles.description}>
              {exerciseData.description}
            </ThemedText>
          </View>

          {/* Equipment Section */}
          <View style={styles.section}>
            <ThemedText style={styles.sectionTitle}>Equipment</ThemedText>
            <View style={styles.equipmentContainer}>
              {exerciseData.equipment.map((item, index) => (
                <View key={index} style={styles.equipmentItem}>
                  <View style={styles.equipmentIcon}>
                    <Icon name="barbell" size={20} color="#a855f7" />
                  </View>
                  <ThemedText style={styles.equipmentText}>{item}</ThemedText>
                </View>
              ))}
            </View>
          </View>

          {/* Muscle Groups */}
          <View style={styles.section}>
            <ThemedText style={styles.sectionTitle}>Muscle Groups</ThemedText>
            <View style={styles.muscleGroupsContainer}>
              {exerciseData.muscleGroups.map((muscle, index) => (
                <View key={index} style={styles.muscleTag}>
                  <ThemedText style={styles.muscleTagText}>{muscle}</ThemedText>
                </View>
              ))}
            </View>
          </View>

          {/* Exercise Technique */}
          <View style={styles.section}>
            <ThemedText style={styles.sectionTitle}>Exercise technique</ThemedText>
            {exerciseData.techniques.map((technique, index) => (
              <View key={index} style={styles.techniqueItem}>
                <View style={styles.techniqueNumber}>
                  <ThemedText style={styles.techniqueNumberText}>{index + 1}</ThemedText>
                </View>
                <ThemedText style={styles.techniqueText}>{technique}</ThemedText>
              </View>
            ))}
          </View>

          {/* Close Button */}
          <TouchableOpacity style={styles.closeButton} onPress={handleClose}>
            <ThemedText style={styles.closeButtonText}>Close</ThemedText>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a2e',
  },
  scrollView: {
    flex: 1,
  },
  heroSection: {
    height: 300,
    position: 'relative',
  },
  heroImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  heroOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
  },
  backButton: {
    position: 'absolute',
    top: 50,
    left: 20,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  contentSection: {
    flex: 1,
    backgroundColor: '#1a1a2e',
    marginTop: -30,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    paddingHorizontal: 20,
    paddingTop: 30,
  },
  titleSection: {
    marginBottom: 20,
  },
  exerciseTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 10,
  },
  metaInfo: {
    flexDirection: 'row',
    gap: 20,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  metaText: {
    fontSize: 14,
    color: '#8e8e93',
  },
  section: {
    marginBottom: 25,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 15,
  },
  description: {
    fontSize: 16,
    lineHeight: 24,
    color: '#c7c7cc',
  },
  equipmentContainer: {
    gap: 12,
  },
  equipmentItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2d2d44',
    padding: 15,
    borderRadius: 12,
  },
  equipmentIcon: {
    width: 40,
    height: 40,
    borderRadius: 8,
    backgroundColor: 'rgba(168, 85, 247, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  equipmentText: {
    fontSize: 16,
    color: '#fff',
    fontWeight: '500',
  },
  muscleGroupsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  muscleTag: {
    backgroundColor: 'rgba(168, 85, 247, 0.2)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#a855f7',
  },
  muscleTagText: {
    color: '#a855f7',
    fontSize: 14,
    fontWeight: '500',
  },
  techniqueItem: {
    flexDirection: 'row',
    marginBottom: 15,
    alignItems: 'flex-start',
  },
  techniqueNumber: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#a855f7',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
    marginTop: 2,
  },
  techniqueNumberText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  techniqueText: {
    flex: 1,
    fontSize: 16,
    lineHeight: 24,
    color: '#c7c7cc',
  },
  closeButton: {
    backgroundColor: '#a855f7',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 25,
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 30,
  },
  closeButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
