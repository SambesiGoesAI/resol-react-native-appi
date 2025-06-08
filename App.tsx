import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SplashScreen } from './src/screens/SplashScreen';
import { LockScreen } from './src/screens/LockScreen';
import { TabNavigator } from './src/navigation/TabNavigator';
import { authService } from './src/services/auth';
import { ThemeContext } from './src/context/ThemeContext';

export default function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<any>(null);

  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    checkAuthStatus();
    loadDarkModePreference();
  }, []);

  const checkAuthStatus = async () => {
    try {
      // Check if user data exists in AsyncStorage (for custom auth)
      const storedUser = await AsyncStorage.getItem('user');
      if (storedUser) {
        const userData = JSON.parse(storedUser);
        setUser(userData);
        setIsAuthenticated(true);
      } else {
        // Check Supabase auth
        const currentUser = await authService.getCurrentUser();
        if (currentUser) {
          setIsAuthenticated(true);
          setUser(currentUser);
        }
      }
    } catch (error) {
      console.error('Error checking auth status:', error);
    }
  };

  const loadDarkModePreference = async () => {
    try {
      const storedPreference = await AsyncStorage.getItem('darkMode');
      if (storedPreference !== null) {
        setIsDarkMode(storedPreference === 'true');
      }
    } catch (error) {
      console.error('Error loading dark mode preference:', error);
    }
  };

  const toggleDarkMode = async () => {
    try {
      const newValue = !isDarkMode;
      setIsDarkMode(newValue);
      await AsyncStorage.setItem('darkMode', newValue.toString());
    } catch (error) {
      console.error('Error saving dark mode preference:', error);
    }
  };

  const handleSplashComplete = () => {
    setIsLoading(false);
  };

  const handleLoginSuccess = async (userData: any) => {
    // Store user data in AsyncStorage for persistence
    await AsyncStorage.setItem('user', JSON.stringify(userData));
    setUser(userData);
    setIsAuthenticated(true);
  };

  const handleLogout = async () => {
    await AsyncStorage.removeItem('user');
    setUser(null);
    setIsAuthenticated(false);
  };

  if (isLoading) {
    return <SplashScreen onAnimationComplete={handleSplashComplete} />;
  }

  return (
    <ThemeContext.Provider value={{ isDarkMode, toggleDarkMode }}>
      <SafeAreaProvider>
        <NavigationContainer>
          {isAuthenticated ? (
            <TabNavigator user={user} onLogout={handleLogout} />
          ) : (
            <LockScreen onLoginSuccess={handleLoginSuccess} />
          )}
        </NavigationContainer>
      </SafeAreaProvider>
    </ThemeContext.Provider>
  );
}
