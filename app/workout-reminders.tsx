import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { View, StyleSheet, TouchableOpacity, Modal, TextInput, Platform } from 'react-native';
import { ThemedText } from '../components/themed-text';
import { ThemedView } from '../components/themed-view';
import Icon from 'react-native-vector-icons/Ionicons';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import { Colors } from '../constants/theme';

export default function WorkoutReminders() {
  const [selectedDays, setSelectedDays] = React.useState<string[]>(['S']);
  const [startTime, setStartTime] = React.useState('07:00');
  const [endTime, setEndTime] = React.useState('08:00');
  const [timeModalVisible, setTimeModalVisible] = React.useState(false);
  const [editingTimeKey, setEditingTimeKey] = React.useState<'start' | 'end' | null>(null);

  const days = ['S','M','T','W','T','F','S'];

  const toggleDay = (day: string) => {
    setSelectedDays(prev => prev.includes(day) ? prev.filter(d => d !== day) : [...prev, day]);
  };

  const handleBack = () => navigation.goBack();

  const openTimeModal = (key: 'start' | 'end') => {
    setEditingTimeKey(key);
    setTimeModalVisible(true);
  };

  const saveTime = (value: string) => {
    if (editingTimeKey === 'start') setStartTime(value);
    if (editingTimeKey === 'end') setEndTime(value);
    setTimeModalVisible(false);
    setEditingTimeKey(null);
  };

  const createReminder = () => {
    // Placeholder: Save reminder flow
    console.log('Creating reminder for days:', selectedDays, startTime, endTime);
    navigation.goBack();
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ThemedView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={handleBack} style={styles.backButton}>
            <Icon name="arrow-back" size={22} color={'#fff'} />
          </TouchableOpacity>
          <ThemedText type="title" style={styles.headerTitle}>Workout reminders</ThemedText>
          <View style={{ width: 28 }} />
        </View>

        <View style={styles.content}>
          <ThemedText style={styles.heading}>Select the days you want to exercise</ThemedText>
          <View style={styles.daysRow}>
            {days.map((d, i) => {
              const isSelected = selectedDays.includes(d);
              return (
                <TouchableOpacity key={`${d}-${i}`} style={[styles.dayItem, isSelected && styles.dayItemSelected]} onPress={() => toggleDay(d)}>
                  <ThemedText style={[styles.dayText, isSelected && styles.dayTextSelected]}>{d}</ThemedText>
                </TouchableOpacity>
              );
            })}
          </View>

          <ThemedText style={styles.headingLarge}>Select the times you want to exercise</ThemedText>

          <TouchableOpacity style={styles.timeBar} activeOpacity={0.9} onPress={() => openTimeModal('start')}>
            <LinearGradient colors={["#3a2d4c", "#2d2f39"]} style={styles.timeBarInner}>
              <ThemedText style={styles.timeLabel}>{startTime} - {endTime}</ThemedText>
            </LinearGradient>
          </TouchableOpacity>

          <View style={{ flex: 1 }} />

          <TouchableOpacity onPress={createReminder} activeOpacity={0.9} style={styles.actionButtonWrapper}>
            <LinearGradient colors={["#7c3aed", "#a855f7"]} style={styles.actionButton}>
              <ThemedText style={styles.actionText}>Create a reminder</ThemedText>
            </LinearGradient>
          </TouchableOpacity>
        </View>

        <Modal visible={timeModalVisible} animationType="slide" transparent onRequestClose={() => setTimeModalVisible(false)}>
          <View style={styles.modalOverlay}>
            <View style={styles.modalContainer}>
              <ThemedText style={styles.modalTitle}>Set Time</ThemedText>
              <TextInput
                style={styles.input}
                value={editingTimeKey === 'start' ? startTime : endTime}
                onChangeText={(t) => editingTimeKey === 'start' ? setStartTime(t) : setEndTime(t)}
                placeholder="HH:MM"
                placeholderTextColor="#8e8e93"
                keyboardType={Platform.OS === 'web' ? 'default' : 'numeric'}
              />

              <View style={styles.modalActions}>
                <TouchableOpacity style={styles.modalButton} onPress={() => setTimeModalVisible(false)}>
                  <ThemedText>Cancel</ThemedText>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.modalButton, styles.saveModalButton]} onPress={() => saveTime(editingTimeKey === 'start' ? startTime : endTime)}>
                  <ThemedText style={{ color: '#fff' }}>Save</ThemedText>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      </ThemedView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.dark.background },
  container: { flex: 1 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 12, paddingVertical: 14 },
  backButton: { padding: 6, borderRadius: 24 },
  headerTitle: { fontWeight: '700', color: '#fff' },

  content: { flex: 1, paddingHorizontal: 16, paddingTop: 24 },
  heading: { color: '#fff', textAlign: 'center', marginBottom: 14 },
  headingLarge: { color: '#fff', textAlign: 'center', marginTop: 18, marginBottom: 22 },

  daysRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 24, paddingHorizontal: 36 },
  dayItem: { width: 44, height: 44, borderRadius: 22, backgroundColor: 'transparent', borderWidth: 1, borderColor: '#3a3b44', alignItems: 'center', justifyContent: 'center' },
  dayItemSelected: { backgroundColor: '#7c3aed', borderColor: '#7c3aed' },
  dayText: { color: '#bfc0c3', fontWeight: '700' },
  dayTextSelected: { color: '#fff' },

  timeBar: { height: 36, borderRadius: 10, overflow: 'hidden', marginHorizontal: 0 },
  timeBarInner: { paddingVertical: 8, alignItems: 'center' },
  timeLabel: { color: '#d9d9df', fontWeight: '600' },

  actionButtonWrapper: { marginBottom: 28, paddingHorizontal: 16 },
  actionButton: { paddingVertical: 14, borderRadius: 30, alignItems: 'center' },
  actionText: { color: '#fff', fontWeight: '700' },

  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center' },
  modalContainer: { width: '90%', backgroundColor: '#1d1d2b', padding: 16, borderRadius: 12 },
  modalTitle: { fontWeight: '700', marginBottom: 8, color: '#fff', textAlign: 'center' },
  input: { borderWidth: 1, borderColor: '#34343b', padding: 10, borderRadius: 8, color: '#fff', marginBottom: 12 },
  modalActions: { flexDirection: 'row', justifyContent: 'flex-end', gap: 12 },
  modalButton: { paddingVertical: 10, paddingHorizontal: 16, borderRadius: 8, backgroundColor: 'transparent' },
  saveModalButton: { backgroundColor: '#a855f7' },
});
