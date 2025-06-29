import React, { useContext } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { Platform } from 'react-native';
import { AlpoScreen } from '../screens/AlpoScreen';
import { UutisetScreen } from '../screens/UutisetScreen';
import { OhjeetScreen } from '../screens/OhjeetScreen';
import { WebViewScreen } from '../screens/WebViewScreen';
import { ThemeContext } from '../context/ThemeContext';
import { User } from '../services/auth';

const Tab = createBottomTabNavigator();

interface TabNavigatorProps {
  user: User | null;
  onLogout: () => void;
}

export const TabNavigator: React.FC<TabNavigatorProps> = ({ user, onLogout }) => {
  const { isDarkMode } = useContext(ThemeContext);

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: keyof typeof Ionicons.glyphMap;

          if (route.name === 'Alpo') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'Uutiset') {
            iconName = focused ? 'newspaper' : 'newspaper-outline';
          } else if (route.name === 'Ohjeet') {
            iconName = focused ? 'help-circle' : 'help-circle-outline';
          } else if (route.name === 'Ohjeet') {
            iconName = focused ? 'help-circle' : 'help-circle-outline';
          } else if (route.name === 'Web') {
            iconName = focused ? 'globe' : 'globe-outline';
          } else {
            iconName = 'help-outline';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: isDarkMode ? '#0A84FF' : '#007AFF',
        tabBarInactiveTintColor: isDarkMode ? '#8E8E93' : 'gray',
        headerStyle: {
          backgroundColor: isDarkMode ? '#121212' : '#007AFF',
        },
        headerTintColor: isDarkMode ? '#FFFFFF' : '#FFFFFF',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      })}
    >
      <Tab.Screen name="Alpo">
        {() => <AlpoScreen user={user} />}
      </Tab.Screen>
      <Tab.Screen name="Uutiset" component={UutisetScreen} />
      <Tab.Screen name="Huoltopyyntö">
        {() => <WebViewScreen uri="https://www.huoltokanava.fi/embed/notice/resol-oy" />}
      </Tab.Screen>
      <Tab.Screen name="Ohjeet">
        {() => <OhjeetScreen user={user} onLogout={onLogout} />}
      </Tab.Screen>
    </Tab.Navigator>
  );
};