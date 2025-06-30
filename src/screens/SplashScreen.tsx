import React, { useEffect } from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { Colors } from '../constants/colors';

interface SplashScreenProps {
  onAnimationComplete: () => void;
}

export const SplashScreen: React.FC<SplashScreenProps> = ({ onAnimationComplete }) => {

  React.useEffect(() => {
    // Simulate splash screen duration
    const timer = setTimeout(() => {
      onAnimationComplete();
    }, 2000);

    return () => clearTimeout(timer);
  }, [onAnimationComplete]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Tervetuloa - tämä on Resol Appi!</Text>
      <ActivityIndicator size="large" color={Colors.primary} style={styles.loader} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F4C378',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#141B4F',
    marginBottom: 40,
    textAlign: 'center',
  },
  loader: {
    marginTop: 20,
  },
});