import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Image,
  Dimensions,
  FlatList,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ThemedText } from '@/components/themed-text';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { router, useLocalSearchParams } from 'expo-router';

const { width } = Dimensions.get('window');

interface WorkoutCard {
  id: string;
  title: string;
  level: string;
  duration: string;
  image: any;
  category: string;
}

const workoutData: WorkoutCard[] = [
  {
    id: '1',
    title: 'Morning Cardio',
    level: 'Beginner',
    duration: '15 min',
    image: require('../../assets/images/onboaring1.webp'),
    category: 'Cardio'
  },
  {
    id: '2',
    title: 'Strength Training',
    level: 'Beginner',
    duration: '30 min',
    image: require('../../assets/images/onboaring2.webp'),
    category: 'Gym'
  },
  {
    id: '3',
    title: 'Yoga Flow',
    level: 'Beginner',
    duration: '20 min',
    image: require('../../assets/images/onboaring3.webp'),
    category: 'Yoga'
  },
  {
    id: '4',
    title: 'HIIT Workout',
    level: 'Intermediate',
    duration: '25 min',
    image: require('../../assets/images/onboaring1.webp'),
    category: 'Cardio'
  },
  {
    id: '5',
    title: 'Core Blast',
    level: 'Beginner',
    duration: '12 min',
    image: require('../../assets/images/onboaring2.webp'),
    category: 'Core'
  },
  {
    id: '6',
    title: 'Full Body Stretch',
    level: 'Beginner',
    duration: '45 min',
    image: require('../../assets/images/onboaring3.webp'),
    category: 'Stretch'
  },
  {
    id: '7',
    title: 'Evening Yoga',
    level: 'Intermediate',
    duration: '35 min',
    image: require('../../assets/images/onboaring1.webp'),
    category: 'Yoga'
  },
  {
    id: '8',
    title: 'Power Lifting',
    level: 'Advanced',
    duration: '50 min', 
    image: require('../../assets/images/onboaring2.webp'),
    category: 'Gym'
  },
  {
    id: '9',
    title: 'Fat Burn Cardio',
    level: 'Intermediate',
    duration: '28 min',
    image: require('../../assets/images/onboaring3.webp'),
    category: 'Cardio'
  },
  {
    id: '10',
    title: 'Flexibility Training',
    level: 'Beginner',
    duration: '18 min',
    image: require('../../assets/images/onboaring1.webp'),
    category: 'Stretch'
  },
];

export default function WorkoutsTab() {
  const params = useLocalSearchParams();
  const { category } = params;
  const [searchText, setSearchText] = useState('');
  const [filteredWorkouts, setFilteredWorkouts] = useState(
    category ? workoutData.filter(w => w.category === category) : workoutData
  );

  // Update filtered workouts when category changes
  useEffect(() => {
    console.log('Category changed:', category);
    console.log('Total workouts:', workoutData.length);
    const filtered = category ? workoutData.filter(w => w.category === category) : workoutData;
    console.log('Filtered workouts:', filtered.length);
    setFilteredWorkouts(filtered);
    setSearchText(''); // Reset search when category changes
  }, [category]);

  const handleSearch = (text: string) => {
    setSearchText(text);
    let baseWorkouts = category ? workoutData.filter(w => w.category === category) : workoutData;
    
    if (text === '') {
      setFilteredWorkouts(baseWorkouts);
    } else {
      const filtered = baseWorkouts.filter(workout =>
        workout.title.toLowerCase().includes(text.toLowerCase()) ||
        workout.category.toLowerCase().includes(text.toLowerCase()) ||
        workout.level.toLowerCase().includes(text.toLowerCase())
      );
      setFilteredWorkouts(filtered);
    }
  };

  const WorkoutCard = ({ item }: { item: WorkoutCard }) => {
    const handleCardPress = () => {
      router.push({
        pathname: '/workout-details',
        params: {
          id: item.id,
          title: item.title,
          level: item.level,
          duration: item.duration,
          category: item.category,
        }
      });
    };

    return (
      <TouchableOpacity 
        style={styles.workoutCard} 
        activeOpacity={0.8}
        onPress={handleCardPress}
      >
        <View style={styles.cardImageContainer}>
          <Image source={item.image} style={styles.cardImage} />
          <LinearGradient
            colors={['transparent', 'rgba(0,0,0,0.7)']}
            style={styles.cardGradient}
          />
          <TouchableOpacity style={styles.favoriteButton}>
            <Ionicons name="heart-outline" size={20} color="#fff" />
          </TouchableOpacity>
        </View>
        <View style={styles.cardContent}>
          <ThemedText style={styles.workoutTitle} numberOfLines={1}>
            {item.title}
          </ThemedText>
          <View style={styles.cardMeta}>
            <ThemedText style={styles.workoutLevel}>{item.level}</ThemedText>
            <ThemedText style={styles.workoutDuration}>{item.duration}</ThemedText>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  const FeaturedWorkout = () => (
    <TouchableOpacity style={styles.featuredCard} activeOpacity={0.8}>
      <Image source={require('../../assets/images/onboaring2.webp')} style={styles.featuredImage} />
      <LinearGradient
        colors={['transparent', 'rgba(0,0,0,0.8)']}
        style={styles.featuredGradient}
      />
      <View style={styles.featuredContent}>
        <View style={styles.featuredBadge}>
          <ThemedText style={styles.featuredBadgeText}>Featured</ThemedText>
        </View>
        <ThemedText style={styles.featuredTitle}>Elevate Beginner</ThemedText>
        <ThemedText style={styles.featuredSubtitle}>Training</ThemedText>
        <ThemedText style={styles.featuredDescription}>
          Perfect for beginners looking to start their fitness journey
        </ThemedText>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView 
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        bounces={true}
      >
         

        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <View style={styles.searchBar}>
            <Ionicons name="search" size={20} color="#8e8e93" style={styles.searchIcon} />
            <TextInput
              style={styles.searchInput}
              placeholder="Search something"
              placeholderTextColor="#8e8e93"
              value={searchText}
              onChangeText={handleSearch}
            />
          </View>
        </View>

        {/* Featured Workout */}
        <View style={styles.featuredSection}>
          <FeaturedWorkout />
        </View>

        {/* Workout Grid */}
        <View style={styles.workoutsGrid}>
          <FlatList
            data={filteredWorkouts}
            renderItem={({ item }) => <WorkoutCard item={item} />}
            keyExtractor={(item) => item.id}
            numColumns={2}
            columnWrapperStyle={styles.row}
            showsVerticalScrollIndicator={false}
            scrollEnabled={false}
            ItemSeparatorComponent={() => <View style={styles.separator} />}
            ListEmptyComponent={() => (
              <View style={styles.emptyContainer}>
                <ThemedText style={styles.emptyText}>
                  No workouts found {category ? `for category: ${category}` : ''}
                </ThemedText>
                <ThemedText style={styles.emptySubtext}>
                  Total available: {workoutData.length} | Filtered: {filteredWorkouts.length}
                </ThemedText>
              </View>
            )}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000ff',
    marginBottom:-8
  },
  scrollView: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  menuButton: {
    padding: 8,
  },
  searchContainer: {
    paddingHorizontal: 10,
    marginBottom: 20,
    backgroundColor:' #2D3450'
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2D3450',
    borderRadius: 15,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  searchIcon: {
    marginRight: 10,
    color: '#9662F1',
  },
  searchInput: {
    flex: 1,
    color: '#fff',
    fontSize: 16,
    fontWeight: '400',
  },
  featuredSection: {
    paddingHorizontal: 10,
    marginBottom: 20,
  },
  featuredCard: {
    height: 180,
    borderRadius: 10,
    overflow: 'hidden',
    position: 'relative',
  },
  featuredImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  featuredGradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  featuredContent: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 20,
  },
  featuredBadge: {
    alignSelf: 'flex-start',
    backgroundColor: '#a855f7',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    marginBottom: 8,
  },
  featuredBadgeText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  featuredTitle: {
    color: '#fff',
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 2,
  },
  featuredSubtitle: {
    color: '#fff',
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 8,
  },
  featuredDescription: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 14,
    lineHeight: 18,
  },
  workoutsGrid: {
    paddingHorizontal: 20,
    paddingBottom: 100,
  },
  row: {
    justifyContent: 'space-between',
  },
  separator: {
    height: 16,
  },
  workoutCard: {
    width: (width - 56) / 2,
    backgroundColor: '#080707ff',
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
    borderBottomRightRadius: 0,
    borderBottomLeftRadius: 0,

    overflow: 'hidden',
    marginBottom: 8,
  },
  cardImageContainer: {
    height: 120,
    position: 'relative',
  },
  cardImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  cardGradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
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
  cardContent: {
    padding: 10,
  },
  cardMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 1,
  },
  workoutLevel: {
    color: '#a855f7',
    fontSize: 12,
    fontWeight: '600',
  },
  workoutTitle: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  workoutDuration: {
    color: 'rgba(255, 255, 255, 0.6)',
    fontSize: 12,
    fontWeight: '400',
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
  },
  emptyText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 8,
  },
  emptySubtext: {
    color: 'rgba(255, 255, 255, 0.6)',
    fontSize: 14,
    textAlign: 'center',
  },
});