import { useState } from 'react';
import {
    Dimensions,
    FlatList,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/Ionicons';

const { width } = Dimensions.get('window');

const HomeScreen = ({ navigation }) => {
  const [searchText, setSearchText] = useState('');

  const categories = [
    { id: 1, name: 'Cardio', icon: '🔥', color: '#FFB800' },
    { id: 2, name: 'Yoga', icon: '🧘‍♀️', color: '#00D4FF' },
    { id: 3, name: 'Stretch', icon: '🏋️', color: '#FFB800' },
    { id: 4, name: 'Gym', icon: '🏆', color: '#FFD700' },
  ];

  const popularWorkouts = [
    {
      id: '1',
      title: 'Rapid Lower Body',
      level: 'Beginner',
      duration: '42 min',
      image: '🏃‍♀️',
    },
    {
      id: '2',
      title: 'Bodyweight Strength',
      level: 'Beginner',
      duration: '25 min',
      image: '💪',
    },
  ];

  const exercises = [
    {
      id: '1',
      name: 'Front and Back Lunge',
      duration: '0:30',
      icon: '🏃‍♀️',
    },
    {
      id: '2',
      name: 'Side Plank',
      duration: '0:30',
      icon: '🤸‍♀️',
    },
    {
      id: '3',
      name: 'Arm circles',
      duration: '0:30',
      icon: '🔄',
    },
    {
      id: '4',
      name: 'Sumo Squat',
      duration: '0:30',
      icon: '🏋️‍♀️',
    },
  ];

  const handleCategoryPress = (category) => {
    router.push({ pathname: '/(tabs)/workouts', params: { category: category.name } });
  };

  const handleWorkoutPress = (workout) => {
    router.push({
      pathname: '/workout-details',
      params: {
        id: workout.id,
        title: workout.title,
        level: workout.level,
        duration: workout.duration,
      }
    });
  };

  const handleExercisePress = (exercise) => {
    router.push({
      pathname: '/exercise-details',
      params: { exerciseName: exercise.name }
    });
  };

  const renderCategoryCard = ({ item }) => (
    <TouchableOpacity 
      style={styles.categoryCard}
      onPress={() => handleCategoryPress(item)}
      activeOpacity={0.8}
    >
      <Text style={styles.categoryIcon}>{item.icon}</Text>
      <Text style={styles.categoryName}>{item.name}</Text>
    </TouchableOpacity>
  );

  const renderWorkoutCard = ({ item }) => (
    <TouchableOpacity 
      style={styles.workoutCard}
      onPress={() => handleWorkoutPress(item)}
      activeOpacity={0.8}
    >
      <View style={styles.workoutImageContainer}>
        <Text style={styles.workoutEmoji}>{item.image}</Text>
        <TouchableOpacity style={styles.favoriteButton}>
          <Icon name="heart-outline" size={20} color="#fff" />
        </TouchableOpacity>
      </View>
      <View style={styles.workoutInfo}>
        <Text style={styles.workoutTitle}>{item.title}</Text>
        <View style={styles.workoutMeta}>
          <Text style={styles.workoutLevel}>{item.level}</Text>
          <Text style={styles.workoutDuration}>• {item.duration}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  const renderExerciseItem = ({ item }) => (
    <TouchableOpacity 
      style={styles.exerciseItem}
      onPress={() => handleExercisePress(item)}
      activeOpacity={0.8}
    >
      <View style={styles.exerciseIcon}>
        <Text style={styles.exerciseEmoji}>{item.icon}</Text>
      </View>
      <View style={styles.exerciseInfo}>
        <Text style={styles.exerciseName}>{item.name}</Text>
        <Text style={styles.exerciseDuration}>{item.duration}</Text>
      </View>
      <TouchableOpacity style={styles.exerciseInfoButton}>
        <Icon name="information-circle-outline" size={24} color="#8e8e93" />
      </TouchableOpacity>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView 
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        bounces={true}
      >
        {/* Header with greeting and notification */}
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>Hi , Poddar</Text>
          </View>
          <TouchableOpacity 
            style={styles.notificationButton}
            onPress={() => navigation.navigate('Notifications')}
          >
            <Icon name="notifications-outline" size={24} color="#fff" />
          </TouchableOpacity>
        </View>

        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <View style={styles.searchBar}>
            <Icon name="search" size={20} color="#9662F1" style={styles.searchIcon} />
            <TextInput
              style={styles.searchInput}
              placeholder="Search something"
              placeholderTextColor="#8e8e93"
              value={searchText}
              onChangeText={setSearchText}
            />
          </View>
        </View>

        {/* Category Section */}
        <View style={styles.sectionContainer}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Category</Text>
            <TouchableOpacity onPress={() => navigation.navigate('Workouts')}>
              <Text style={styles.viewAllText}>View All</Text>
            </TouchableOpacity>
          </View>
          <FlatList
            data={categories}
            renderItem={renderCategoryCard}
            keyExtractor={(item) => item.id.toString()}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.categoriesContainer}
          />
        </View>

        {/* Featured Workout */}
        <View style={styles.featuredSection}>
          <TouchableOpacity style={styles.featuredCard} activeOpacity={0.8}>
            <View style={styles.featuredContent}>
              <View style={styles.featuredLeft}>
                <Text style={styles.featuredTitle}>Full Body Toning{'\n'}Workout</Text>
                <Text style={styles.featuredDescription}>
                  Includes circuits to work{'\n'}every muscle
                </Text>
                <TouchableOpacity style={styles.startButton}>
                  <LinearGradient
                    colors={['#9662F1', '#7c3aed']}
                    style={styles.startButtonGradient}
                  >
                    <Text style={styles.startButtonText}>Start Training</Text>
                  </LinearGradient>
                </TouchableOpacity>
              </View>
              <View style={styles.featuredRight}>
                <View style={styles.featuredImage}>
                  <Text style={styles.mountainIcon}>⛰️</Text>
                </View>
              </View>
            </View>
          </TouchableOpacity>
        </View>

        {/* Popular Workouts Section */}
        <View style={styles.sectionContainer}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Popular Workouts</Text>
            <TouchableOpacity onPress={() => navigation.navigate('Workouts')}>
              <Text style={styles.viewAllText}>View All</Text>
            </TouchableOpacity>
          </View>
          <Text style={styles.workoutsCount}>Workouts: 80</Text>
          <FlatList
            data={popularWorkouts}
            renderItem={renderWorkoutCard}
            keyExtractor={(item) => item.id}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.workoutsContainer}
          />
        </View>

        {/* Exercises Section */}
        <View style={styles.sectionContainer}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Exercises</Text>
            <TouchableOpacity onPress={() => navigation.navigate('Workouts')}>
              <Text style={styles.viewAllText}>View All</Text>
            </TouchableOpacity>
          </View>
          <Text style={styles.exercisesCount}>Exercises: 210</Text>
          <FlatList
            data={exercises}
            renderItem={renderExerciseItem}
            keyExtractor={(item) => item.id}
            scrollEnabled={false}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  scrollView: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 20,
  },
  greeting: {
    fontSize: 28,
    fontWeight: '700',
    color: '#ffffff',
  },
  notificationButton: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: '#3d3d4d',
    alignItems: 'center',
    justifyContent: 'center',
  },
  searchContainer: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2D3450',
    borderRadius: 15,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    color: '#fff',
    fontSize: 16,
    fontWeight: '400',
  },
  sectionContainer: {
    marginBottom: 30,
    paddingHorizontal: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#ffffff',
  },
  viewAllText: {
    fontSize: 16,
    color: '#9662F1',
    fontWeight: '600',
  },
  categoriesContainer: {
    paddingLeft: 0,
  },
  categoryCard: {
    backgroundColor: '#2D3450',
    width: 80,
    height: 80,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 15,
  },
  categoryIcon: {
    fontSize: 24,
    marginBottom: 5,
  },
  categoryName: {
    fontSize: 12,
    fontWeight: '600',
    color: '#ffffff',
  },
  featuredSection: {
    paddingHorizontal: 20,
    marginBottom: 30,
  },
  featuredCard: {
    backgroundColor: '#2D3450',
    borderRadius: 16,
    overflow: 'hidden',
  },
  featuredContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
  },
  featuredLeft: {
    flex: 1,
    paddingRight: 20,
  },
  featuredTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#ffffff',
    marginBottom: 8,
    lineHeight: 24,
  },
  featuredDescription: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.7)',
    marginBottom: 16,
    lineHeight: 18,
  },
  startButton: {
    alignSelf: 'flex-start',
  },
  startButtonGradient: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 25,
  },
  startButtonText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '600',
  },
  featuredRight: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  featuredImage: {
    width: 80,
    height: 80,
    backgroundColor: '#9662F1',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  mountainIcon: {
    fontSize: 40,
  },
  workoutsCount: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.6)',
    marginBottom: 15,
  },
  workoutsContainer: {
    paddingLeft: 0,
  },
  workoutCard: {
    width: (width - 60) / 2,
    backgroundColor: '#1a1a1a',
    borderRadius: 12,
    marginRight: 15,
    overflow: 'hidden',
  },
  workoutImageContainer: {
    height: 120,
    backgroundColor: '#e5e5e5',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  workoutEmoji: {
    fontSize: 40,
  },
  favoriteButton: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  workoutInfo: {
    padding: 12,
  },
  workoutTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ffffff',
    marginBottom: 4,
  },
  workoutMeta: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  workoutLevel: {
    fontSize: 12,
    color: '#9662F1',
    fontWeight: '600',
  },
  workoutDuration: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.6)',
    marginLeft: 4,
  },
  exercisesCount: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.6)',
    marginBottom: 15,
  },
  exerciseItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2D3450',
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
  },
  exerciseIcon: {
    width: 50,
    height: 50,
    backgroundColor: '#9662F1',
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  exerciseEmoji: {
    fontSize: 24,
  },
  exerciseInfo: {
    flex: 1,
  },
  exerciseName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ffffff',
    marginBottom: 2,
  },
  exerciseDuration: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.6)',
  },
  exerciseInfoButton: {
    padding: 4,
  },
});

export default HomeScreen;
