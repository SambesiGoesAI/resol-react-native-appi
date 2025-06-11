import React, { useContext } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { ThemeContext } from '../context/ThemeContext';
import { User } from '../services/auth';

interface AlpoScreenProps {
  user: User | null;
}

export const AlpoScreen: React.FC<AlpoScreenProps> = ({ user }) => {
  const { isDarkMode } = useContext(ThemeContext);

  return (
    <ScrollView style={[styles.container, isDarkMode ? styles.containerDark : null]}>
      <View style={styles.content}>
        <Text style={[styles.title, isDarkMode ? styles.titleDark : null]}>Alpo</Text>
        <Text style={[styles.subtitle, isDarkMode ? styles.subtitleDark : null]}>Tervetuloa, {user?.email || 'Käyttäjä'}</Text>
        <Text style={[styles.roleText, isDarkMode ? styles.roleTextDark : null]}>Rooli: {user?.role || 'Tuntematon'}</Text>
        
        <View style={[styles.section, isDarkMode ? styles.sectionDark : null]}>
          <Text style={[styles.sectionTitle, isDarkMode ? styles.sectionTitleDark : null]}>Pääsisältöalue</Text>
          <Text style={[styles.sectionText, isDarkMode ? styles.sectionTextDark : null]}>
            Tämä on Alpo-välilehden pääsisältöalue. Sisältö täällä perustuu käyttäjän rooliin ja käyttöoikeuksiin.
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