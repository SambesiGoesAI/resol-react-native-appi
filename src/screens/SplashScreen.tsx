import React, { useEffect, useContext } from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { ThemeContext } from '../context/ThemeContext';

interface SplashScreenProps {
  onAnimationComplete: () => void;
}

export const SplashScreen: React.FC<SplashScreenProps> = ({ onAnimationComplete }) => {
  const { isDarkMode } = useContext(ThemeContext);

  React.useEffect(() => {
    // Simulate splash screen duration
    const timer = setTimeout(() => {
      onAnimationComplete();
    }, 2000);

    return () => clearTimeout(timer);
  }, [onAnimationComplete]);

  return (
    <View style={[styles.container, isDarkMode ? styles.containerDark : null]}>
      <Text style={[styles.title, isDarkMode ? styles.titleDark : null]}>Alpo auttaa!</Text>
      <ActivityIndicator size="large" color={isDarkMode ? '#0A84FF' : '#007AFF'} style={styles.loader} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
  containerDark: {
    backgroundColor: '#121212',
  },
  title: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 40,
  },
  titleDark: {
    color: '#FFFFFF',
  },
  loader: {
    marginTop: 20,
  },
});