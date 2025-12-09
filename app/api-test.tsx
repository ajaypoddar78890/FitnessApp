import React, { useState } from 'react';
import { Button, ScrollView, StyleSheet, Text, View } from 'react-native';
import { API_BASE_URL, API_ENDPOINTS } from '../constants/api';

export default function ApiTestScreen() {
  const [testResult, setTestResult] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const testConnection = async () => {
    setIsLoading(true);
    setTestResult('Testing connection...');

    const url = `${API_BASE_URL}${API_ENDPOINTS.AUTH.REGISTER}`;
    
    try {
      console.log('Test: Attempting to connect to:', url);
      
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: 'test@example.com',
          password: 'testpass',
          name: 'Test User',
        }),
      });

      console.log('Test: Response status:', response.status);
      console.log('Test: Response headers:', response.headers);

      const responseText = await response.text();
      console.log('Test: Response text:', responseText);

      setTestResult(`Status: ${response.status}\nResponse: ${responseText}`);
    } catch (error) {
      console.error('Test: Connection error:', error);
      const msg = error instanceof Error ? error.message : String(error);
      setTestResult(`Error: ${msg}`);
    } finally {
      setIsLoading(false);
    }
  };

  const testBasicFetch = async () => {
    setIsLoading(true);
    setTestResult('Testing basic fetch...');

    try {
      const response = await fetch('https://httpbin.org/get');
      const data = await response.json();
      setTestResult(`Basic fetch works! Origin: ${data.origin}`);
    } catch (error) {
      const msg = error instanceof Error ? error.message : String(error);
      setTestResult(`Basic fetch failed: ${msg}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>API Connection Test</Text>
      
      <Text style={styles.label}>Target URL:</Text>
      <Text style={styles.url}>{`${API_BASE_URL}${API_ENDPOINTS.AUTH.REGISTER}`}</Text>
      
      <View style={styles.buttonContainer}>
        <Button 
          title={isLoading ? 'Testing...' : 'Test API Connection'} 
          onPress={testConnection}
          disabled={isLoading}
        />
      </View>

      <View style={styles.buttonContainer}>
        <Button 
          title={isLoading ? 'Testing...' : 'Test Basic Fetch'} 
          onPress={testBasicFetch}
          disabled={isLoading}
        />
      </View>

      <View style={styles.resultContainer}>
        <Text style={styles.resultTitle}>Result:</Text>
        <Text style={styles.result}>{testResult}</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  url: {
    fontSize: 14,
    backgroundColor: '#e0e0e0',
    padding: 8,
    borderRadius: 4,
    marginBottom: 20,
    fontFamily: 'monospace',
  },
  buttonContainer: {
    marginBottom: 12,
  },
  resultContainer: {
    marginTop: 20,
    padding: 12,
    backgroundColor: '#fff',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  resultTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  result: {
    fontSize: 14,
    fontFamily: 'monospace',
    color: '#333',
  },
});
