import React from 'react';
import { StyleSheet, View, Text, ScrollView, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';

const { width } = Dimensions.get('window');
const GAP = 12;
const PADDING = 16;
const CARD_WIDTH = (width - PADDING * 2 - GAP) / 2;

// Simple Icons
const StepsIcon = () => (
  <View style={{width: 24, height: 24, backgroundColor: '#8B5CF6', borderRadius: 3, alignItems: 'center', justifyContent: 'center'}}>
    <ThemedText style={{color: 'white', fontSize: 14, fontWeight: 'bold'}}>👟</ThemedText>
  </View>
);

const HeartIcon = () => (
  <View style={{width: 24, height: 24, backgroundColor: '#FF4B6E', borderRadius: 3, alignItems: 'center', justifyContent: 'center'}}>
    <ThemedText style={{color: 'white', fontSize: 14, fontWeight: 'bold'}}>♥</ThemedText>
  </View>
);

const DumbbellIcon = () => (
  <View style={{width: 24, height: 24, backgroundColor: '#FFB946', borderRadius: 3, alignItems: 'center', justifyContent: 'center'}}>
    <ThemedText style={{color: 'white', fontSize: 14, fontWeight: 'bold'}}>🏋</ThemedText>
  </View>
);

const FlameIcon = () => (
  <View style={{width: 24, height: 24, backgroundColor: '#FF6B46', borderRadius: 3, alignItems: 'center', justifyContent: 'center'}}>
    <ThemedText style={{color: 'white', fontSize: 14, fontWeight: 'bold'}}>🔥</ThemedText>
  </View>
);

const SleepIcon = () => (
  <View style={{width: 24, height: 24, backgroundColor: '#4B9EFF', borderRadius: 3, alignItems: 'center', justifyContent: 'center'}}>
    <ThemedText style={{color: 'white', fontSize: 12, fontWeight: 'bold'}}>zzz</ThemedText>
  </View>
);

const CarIcon = () => (
  <View style={{width: 24, height: 24, backgroundColor: '#FF4B6E', borderRadius: 3, alignItems: 'center', justifyContent: 'center'}}>
    <ThemedText style={{color: 'white', fontSize: 14, fontWeight: 'bold'}}>🚗</ThemedText>
  </View>
);

const CircularProgress = ({ value, max, size = 100, strokeWidth = 6, children }: { value: number; max: number; size?: number; strokeWidth?: number; children: any }) => {
  const percentage = (value / max) * 100;

  return (
    <View style={{ width: size, height: size, alignItems: 'center', justifyContent: 'center' }}>
      <View style={{
        width: size,
        height: size,
        borderRadius: size / 2,
        borderWidth: strokeWidth,
        borderColor: 'rgba(255,255,255,0.1)',
        position: 'absolute',
      }} />
      <View style={{
        width: size,
        height: size,
        borderRadius: size / 2,
        borderWidth: strokeWidth,
        borderColor: '#7A4BFF',
        borderTopColor: '#7A4BFF',
        borderRightColor: percentage > 25 ? '#7A4BFF' : 'rgba(255,255,255,0.1)',
        borderBottomColor: percentage > 50 ? '#7A4BFF' : 'rgba(255,255,255,0.1)',
        borderLeftColor: percentage > 75 ? '#7A4BFF' : 'rgba(255,255,255,0.1)',
        position: 'absolute',
        transform: [{ rotate: '-90deg' }],
      }} />
      <View style={{ alignItems: 'center', justifyContent: 'center' }}>
        {children}
      </View>
    </View>
  );
};

const HeartRateChart = () => (
  <View style={{ alignItems: 'center', marginTop: 20 }}>
    <View style={{ flexDirection: 'row', alignItems: 'center', height: 40, width: 120 }}>
      <Text style={{ color: '#4BFFB4', fontSize: 24, fontWeight: 'bold' }}>♥ ~ ~ ~ ♥ ~ ~ ~ ♥</Text>
    </View>
  </View>
);

export default function DeviceActivity() {
  return (
    <ThemedView style={styles.root}>
      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        <ThemedText type="title" style={styles.header}>
          Activity
        </ThemedText>

        

        <View style={styles.grid}>
          {/* Steps */}
          <View style={[styles.card, { width: CARD_WIDTH, height: CARD_WIDTH, backgroundColor: 'rgba(196, 216, 255, 0.15)' }]}>
            <View style={styles.cardHeader}>
              <ThemedText style={styles.cardTitle}>Steps</ThemedText>
              <StepsIcon />
            </View>
            <View style={{ alignItems: 'center', marginTop: 20 }}>
              <CircularProgress value={1234} max={2000} size={100}>
                <ThemedText style={styles.circleNumber}>1234</ThemedText>
              </CircularProgress>
            </View>
          </View>

          {/* Heart rate */}
          <View style={[styles.card, { width: CARD_WIDTH, height: CARD_WIDTH, backgroundColor: 'rgba(196, 216, 255, 0.15)' }]}>
            <View style={styles.cardHeader}>
              <ThemedText style={styles.cardTitle}>Heart rate</ThemedText>
              <HeartIcon />
            </View>
            <HeartRateChart />
            <ThemedText style={styles.heartRateValue}>120 bpm</ThemedText>
          </View>

          {/* Training */}
          <View style={[styles.cardSmall, { width: CARD_WIDTH, backgroundColor: 'rgba(196, 216, 255, 0.15)' }]}>
            <View style={styles.cardHeader}>
              <ThemedText style={styles.cardTitle}>Training</ThemedText>
              <DumbbellIcon />
            </View>
            <ThemedText style={styles.cardValue}>120 minutes</ThemedText>
          </View>

          {/* Calories */}
          <View style={[styles.cardSmall, { width: CARD_WIDTH, backgroundColor: 'rgba(196, 216, 255, 0.15)' }]}>
            <View style={styles.cardHeader}>
              <ThemedText style={styles.cardTitle}>Calories</ThemedText>
              <FlameIcon />
            </View>
            <View style={{ alignItems: 'flex-end', marginTop: 20 }}>
              <CircularProgress value={990} max={1200} size={80}>
                <View style={{ alignItems: 'center' }}>
                  <ThemedText style={styles.circleNumberSmall}>990</ThemedText>
                </View>
              </CircularProgress>
            </View>
          </View>

          {/* Sleep */}
          <View style={[styles.cardLarge, { width: CARD_WIDTH, backgroundColor: 'rgba(196, 216, 255, 0.15)' }]}>
            <View style={styles.cardHeader}>
              <ThemedText style={styles.cardTitle}>Sleep</ThemedText>
              <SleepIcon />
            </View>
            <View style={styles.sleepBars}>
              <View style={[styles.bar, { height: 40, backgroundColor: '#4BFFB4' }]} />
              <View style={[styles.bar, { height: 50, backgroundColor: '#4BFFB4' }]} />
              <View style={[styles.bar, { height: 35, backgroundColor: '#4BFFB4' }]} />
              <View style={[styles.bar, { height: 45, backgroundColor: '#4BFFB4' }]} />
              <View style={[styles.bar, { height: 30, backgroundColor: '#4BFFB4' }]} />
              <View style={[styles.bar, { height: 55, backgroundColor: '#4BFFB4' }]} />
            </View>
            <ThemedText style={styles.cardValue}>7.5 hours</ThemedText>
          </View>

          {/* Distance */}
          <View style={[styles.cardSmall, { width: CARD_WIDTH, backgroundColor: 'rgba(196, 216, 255, 0.15)' }]}>
            <View style={styles.cardHeader}>
              <ThemedText style={styles.cardTitle}>Distance</ThemedText>
              <CarIcon />
            </View>
            <ThemedText style={styles.cardValue}>55 minutes</ThemedText>
          </View>
        </View>
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#000' },
  container: {
    paddingTop: 24,
    paddingHorizontal: PADDING,
    paddingBottom: 40,
  },
  header: {
    marginBottom: 12,
    fontWeight: '800',
    fontSize: 34,
    color: '#fff',
  },
  datesRow: {
    marginBottom: 18,
  },
  dateChip: {
    width: 68,
    height: 48,
    borderRadius: 10,
    marginRight: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dateChipActive: {
    shadowColor: '#7A4BFF',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 12,
  },
  dateText: {
    color: '#c2c6d2',
    fontSize: 12,
    fontWeight: '700',
  },
  dateSub: {
    color: '#c2c6d2',
    fontSize: 10,
  },
  dateTextActive: {
    color: '#fff',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  card: {
    borderRadius: 14,
    padding: 14,
    marginBottom: GAP,
    justifyContent: 'space-between',
  },
  cardSmall: {
    borderRadius: 14,
    padding: 14,
    marginBottom: GAP,
    height: 140,
    justifyContent: 'space-between',
  },
  cardLarge: {
    borderRadius: 14,
    padding: 14,
    marginBottom: GAP,
    height: 200,
    justifyContent: 'space-between',
  },
  cardHeader: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center' 
  },
  cardTitle: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '700',
  },
  cardValue: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '700',
  },
  heartRateValue: {
    color: '#ffffff',
    fontSize: 24,
    fontWeight: '800',
    textAlign: 'center',
    marginTop: 10,
  },
  circleNumber: {
    color: '#fff',
    fontSize: 20,
    fontWeight: '800',
  },
  circleNumberSmall: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '800',
  },
  sleepBars: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    marginTop: 20,
    marginBottom: 10,
    height: 60,
  },
  bar: {
    width: 8,
    borderRadius: 4,
  },
});