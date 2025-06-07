import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { AlpoScreen } from '../screens/AlpoScreen';
import { UutisetScreen } from '../screens/UutisetScreen';
import { AsetuksetScreen } from '../screens/AsetuksetScreen';

const Tab = createBottomTabNavigator();

interface TabNavigatorProps {
  user: any;
  onLogout: () => void;
}

export const TabNavigator: React.FC<TabNavigatorProps> = ({ user, onLogout }) => {
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
        tabBarActiveTintColor: '#007AFF',
        tabBarInactiveTintColor: 'gray',
        headerStyle: {
          backgroundColor: '#007AFF',
        },
        headerTintColor: '#FFFFFF',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      })}
    >
      <Tab.Screen name="Alpo">
        {() => <AlpoScreen user={user} />}
      </Tab.Screen>
      <Tab.Screen name="Uutiset" component={UutisetScreen} />
      <Tab.Screen name="Asetukset">
        {() => <AsetuksetScreen user={user} onLogout={onLogout} />}
      </Tab.Screen>
    </Tab.Navigator>
  );
};