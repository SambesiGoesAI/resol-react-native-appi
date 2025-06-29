import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SplashScreen } from './src/screens/SplashScreen';
import { LockScreen } from './src/screens/LockScreen';
import { TabNavigator } from './src/navigation/TabNavigator';
import { authService, User } from './src/services/auth';

export default function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    checkAuthStatus();
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
      // Silent fail - auth check error
    }
  };

  const handleSplashComplete = () => {
    setIsLoading(false);
  };

  const handleLoginSuccess = async (userData: User) => {
    // Store user data in AsyncStorage for persistence
    await AsyncStorage.setItem('user', JSON.stringify(userData));
    setUser(userData);
    setIsAuthenticated(true);
  };

  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem('user');
      setUser(null);
      setIsAuthenticated(false);
    } catch (error) {
      // Silent fail
    }
  };

  if (isLoading) {
    return <SplashScreen onAnimationComplete={handleSplashComplete} />;
  }

  return (
    <SafeAreaProvider>
      <NavigationContainer key={isAuthenticated ? 'auth' : 'noauth'}>
        {isAuthenticated ? (
          <TabNavigator user={user} onLogout={handleLogout} />
        ) : (
          <LockScreen onLoginSuccess={handleLoginSuccess} />
        )}
      </NavigationContainer>
    </SafeAreaProvider>
  );
}
