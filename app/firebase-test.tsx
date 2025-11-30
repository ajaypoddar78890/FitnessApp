import { signInAnonymously } from 'firebase/auth';
import { addDoc, collection, getDocs, orderBy, query } from 'firebase/firestore';
import React, { useState } from 'react';
import { Button, ScrollView, StyleSheet, Text, View } from 'react-native';
import { auth, db } from '../services/firebase';

export default function FirebaseTestScreen() {
  const [userId, setUserId] = useState<string | null>(null);
  const [logs, setLogs] = useState<Array<any>>([]);
  const [loading, setLoading] = useState(false);

  const anonSignIn = async () => {
    setLoading(true);
    try {
      const res = await signInAnonymously(auth);
      setUserId(res.user.uid);
    } catch (e) {
      console.error('Sign in error', e);
      const msg = e instanceof Error ? e.message : String(e);
      alert('Sign in failed: ' + msg);
    } finally {
      setLoading(false);
    }
  };

  const writeTestDoc = async () => {
    setLoading(true);
    try {
      const col = collection(db, 'expo_test_docs');
      await addDoc(col, {
        uid: userId || 'anonymous',
        createdAt: new Date().toISOString(),
      });
      alert('Wrote test doc');
    } catch (e) {
      console.error('Write error', e);
      const msg = e instanceof Error ? e.message : String(e);
      alert('Write failed: ' + msg);
    } finally {
      setLoading(false);
    }
  };

  const readTestDocs = async () => {
    setLoading(true);
    try {
      const col = collection(db, 'expo_test_docs');
      const q = query(col, orderBy('createdAt', 'desc'));
      const snap = await getDocs(q);
      const items: any[] = [];
      snap.forEach((d) => items.push({ id: d.id, ...d.data() }));
      setLogs(items);
    } catch (e) {
      console.error('Read error', e);
      const msg = e instanceof Error ? e.message : String(e);
      alert('Read failed: ' + msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Firebase Quick Test</Text>
      <Text>User id: {userId || 'not signed in'}</Text>

      <View style={styles.button}>
        <Button title={loading ? 'Working...' : 'Sign in anonymously'} onPress={anonSignIn} disabled={loading} />
      </View>

      <View style={styles.button}>
        <Button title={loading ? 'Working...' : 'Write test doc'} onPress={writeTestDoc} disabled={loading} />
      </View>

      <View style={styles.button}>
        <Button title={loading ? 'Working...' : 'Read test docs'} onPress={readTestDocs} disabled={loading} />
      </View>

      <View style={{ marginTop: 16, width: '100%' }}>
        <Text style={styles.subtitle}>Recent docs</Text>
        {logs.length === 0 ? (
          <Text style={{ color: '#666' }}>No docs yet</Text>
        ) : (
          logs.map((l) => (
            <View key={l.id} style={styles.logItem}>
              <Text style={{ fontSize: 12 }}>{l.createdAt}</Text>
              <Text style={{ fontSize: 12 }}>uid: {l.uid}</Text>
              <Text style={{ fontSize: 12 }}>id: {l.id}</Text>
            </View>
          ))
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    alignItems: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 8,
  },
  button: {
    width: '100%',
    marginTop: 8,
  },
  logItem: {
    padding: 8,
    borderWidth: 1,
    borderColor: '#eee',
    borderRadius: 6,
    marginBottom: 8,
  },
});
