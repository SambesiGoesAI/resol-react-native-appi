import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';

interface AlpoScreenProps {
  user: any;
}

export const AlpoScreen: React.FC<AlpoScreenProps> = ({ user }) => {
  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Alpo</Text>
        <Text style={styles.subtitle}>Welcome, {user?.email || 'User'}</Text>
        <Text style={styles.roleText}>Role: {user?.role || 'Unknown'}</Text>
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Main Content Area</Text>
          <Text style={styles.sectionText}>
            This is the primary content area for the Alpo tab. 
            Content here will be based on user role and permissions.
          </Text>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  content: {
    padding: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 18,
    color: '#666666',
    marginBottom: 5,
  },
  roleText: {
    fontSize: 16,
    color: '#007AFF',
    marginBottom: 30,
  },
  section: {
    backgroundColor: '#FFFFFF',
    padding: 20,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#333333',
    marginBottom: 10,
  },
  sectionText: {
    fontSize: 16,
    color: '#666666',
    lineHeight: 24,
  },
});