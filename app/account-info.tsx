import React from 'react';
import { View, StyleSheet, TouchableOpacity, Image, Modal, TextInput, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ThemedText } from '@/components/themed-text';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '@/context/AuthContext';
import { router } from 'expo-router';
import { Colors } from '@/constants/theme';

export default function AccountInfo() {
  const { user, updateUser } = useAuth();

  const [modalVisible, setModalVisible] = React.useState(false);
  const [fieldKey, setFieldKey] = React.useState<string | null>(null);
  const [fieldValue, setFieldValue] = React.useState('');

  const handleBack = () => {
    router.back();
  };

  const openEdit = (key: string, currentValue: string) => {
    setFieldKey(key);
    setFieldValue(currentValue);
    setModalVisible(true);
  };

  const saveField = async () => {
    if (!fieldKey) return;
    try {
      const data: any = {};
      data[fieldKey] = fieldValue;
      const result = await updateUser(data);
      if (result.success) {
        setModalVisible(false);
      } else {
        Alert.alert('Error', result.error || 'Failed to update');
      }
    } catch (err) {
      Alert.alert('Error', 'Failed to update user');
    }
  };

  const avatar = user?.avatar || null;
  const name = user?.name || 'Deborah Moore';
  const weight = user?.weight || '52.7 kg';
  const dob = user?.dob || 'Nov 30, 1990';
  const email = user?.email || 'deborah.moore@email.com';

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBack} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <View style={{ flex: 1 }} />
        <TouchableOpacity onPress={() => Alert.alert('Saved', 'Saved changes (placeholder)')}>
          <ThemedText style={styles.saveText}>Save</ThemedText>
        </TouchableOpacity>
      </View>

      <View style={styles.centered}>
        <View style={styles.avatarWrapper}>
          {avatar ? (
            <Image source={{ uri: avatar }} style={styles.avatar} />
          ) : (
            <View style={styles.placeholder} />
          )}
        </View>
      </View>

      <View style={styles.card}>
        <TouchableOpacity style={styles.cardRow} onPress={() => openEdit('name', name)}>
          <ThemedText style={styles.label}>Name</ThemedText>
          <View style={styles.rowRight}>
            <ThemedText style={styles.value}>{name}</ThemedText>
            <Ionicons name="chevron-forward" size={20} color="#fff" />
          </View>
        </TouchableOpacity>

        <TouchableOpacity style={styles.cardRow} onPress={() => openEdit('weight', weight)}>
          <ThemedText style={styles.label}>Weight</ThemedText>
          <View style={styles.rowRight}>
            <ThemedText style={styles.value}>{weight}</ThemedText>
            <Ionicons name="chevron-forward" size={20} color="#fff" />
          </View>
        </TouchableOpacity>

        <TouchableOpacity style={styles.cardRow} onPress={() => openEdit('dob', dob)}>
          <ThemedText style={styles.label}>Date of Birth</ThemedText>
          <View style={styles.rowRight}>
            <ThemedText style={styles.value}>{dob}</ThemedText>
            <Ionicons name="chevron-forward" size={20} color="#fff" />
          </View>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.cardRow, { borderBottomWidth: 0 }]} onPress={() => openEdit('email', email)}>
          <ThemedText style={styles.label}>Email</ThemedText>
          <View style={styles.rowRight}>
            <ThemedText style={styles.value}>{email}</ThemedText>
            <Ionicons name="chevron-forward" size={20} color="#fff" />
          </View>
        </TouchableOpacity>
      </View>

      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <ThemedText style={styles.modalTitle}>Edit {fieldKey}</ThemedText>
            <TextInput
              style={styles.input}
              value={fieldValue}
              onChangeText={setFieldValue}
              placeholder={`Enter ${fieldKey}`}
              placeholderTextColor="#8e8e93"
            />
            <View style={styles.modalActions}>
              <TouchableOpacity style={styles.modalButton} onPress={() => setModalVisible(false)}>
                <ThemedText>Cancel</ThemedText>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.modalButton, styles.saveModalButton]} onPress={saveField}>
                <ThemedText style={{ color: '#fff' }}>Save</ThemedText>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.dark.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
    paddingVertical: 14,
  },
  backButton: {
    padding: 6,
    borderRadius: 20,
  },
  title: {
    fontWeight: '700',
  },
  saveText: {
    color: '#a855f7',
    fontWeight: '700',
  },
  centered: {
    alignItems: 'center',
    marginBottom: 18,
  },
  avatarWrapper: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: '#e5e7eb',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatar: {
    width: 90,
    height: 90,
    borderRadius: 45,
  },
  placeholder: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: '#c7b1e6',
  },
  card: {
    marginHorizontal: 16,
    backgroundColor: '#2c2b34',
    borderRadius: 12,
    paddingVertical: 8,
    overflow: 'hidden',
  },
  cardRow: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#2b2b31',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  label: {
    color: '#bfc0c3',
  },
  value: {
    color: '#fff',
  },
  rowRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    maxWidth: '60%'
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: '90%',
    backgroundColor: '#1d1d2b',
    padding: 16,
    borderRadius: 12,
  },
  modalTitle: {
    fontWeight: '700',
    marginBottom: 8,
    color: '#fff',
  },
  input: {
    borderWidth: 1,
    borderColor: '#2b2b31',
    padding: 12,
    borderRadius: 8,
    color: '#fff',
    marginBottom: 12,
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 12,
  },
  modalButton: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    backgroundColor: 'transparent',
  },
  saveModalButton: {
    backgroundColor: '#a855f7',
  },
});