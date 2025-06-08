import React, { useContext } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { ThemeContext } from '../context/ThemeContext';

interface AlpoScreenProps {
  user: any;
}

export const AlpoScreen: React.FC<AlpoScreenProps> = ({ user }) => {
  const { isDarkMode } = useContext(ThemeContext);

  return (
    <ScrollView style={[styles.container, isDarkMode ? styles.containerDark : null]}>
      <View style={styles.content}>
        <Text style={[styles.title, isDarkMode ? styles.titleDark : null]}>Alpo</Text>
        <Text style={[styles.subtitle, isDarkMode ? styles.subtitleDark : null]}>Welcome, {user?.email || 'User'}</Text>
        <Text style={[styles.roleText, isDarkMode ? styles.roleTextDark : null]}>Role: {user?.role || 'Unknown'}</Text>
        
        <View style={[styles.section, isDarkMode ? styles.sectionDark : null]}>
          <Text style={[styles.sectionTitle, isDarkMode ? styles.sectionTitleDark : null]}>Main Content Area</Text>
          <Text style={[styles.sectionText, isDarkMode ? styles.sectionTextDark : null]}>
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
  containerDark: {
    backgroundColor: '#121212',
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
  titleDark: {
    color: '#FFFFFF',
  },
  subtitle: {
    fontSize: 18,
    color: '#666666',
    marginBottom: 5,
  },
  subtitleDark: {
    color: '#CCCCCC',
  },
  roleText: {
    fontSize: 16,
    color: '#007AFF',
    marginBottom: 30,
  },
  roleTextDark: {
    color: '#0A84FF',
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
  sectionDark: {
    backgroundColor: '#1E1E1E',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#333333',
    marginBottom: 10,
  },
  sectionTitleDark: {
    color: '#FFFFFF',
  },
  sectionText: {
    fontSize: 16,
    color: '#666666',
    lineHeight: 24,
  },
  sectionTextDark: {
    color: '#CCCCCC',
  },
});