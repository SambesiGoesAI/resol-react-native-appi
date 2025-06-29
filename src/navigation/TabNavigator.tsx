import React, { useContext } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { AlpoScreen } from '../screens/AlpoScreen';
import { UutisetScreen } from '../screens/UutisetScreen';
import { AsetuksetScreen } from '../screens/OhjeetScreen';
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
          } else if (route.name === 'Asetukset') {
            iconName = focused ? 'settings' : 'settings-outline';
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
      <Tab.Screen name="Ohjeet">
        {() => <AsetuksetScreen user={user} onLogout={onLogout} />}
      </Tab.Screen>
    </Tab.Navigator>
  );
};