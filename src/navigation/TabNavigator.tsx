import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { Platform } from 'react-native';
import { AlpoScreen } from '../screens/AlpoScreen';
import { UutisetScreen } from '../screens/UutisetScreen';
import { OhjeetScreen } from '../screens/OhjeetScreen';
import { WebViewScreen } from '../screens/WebViewScreen';
import { User } from '../services/auth';
import { Colors } from '../constants/colors';

const Tab = createBottomTabNavigator();

interface TabNavigatorProps {
  user: User | null;
  onLogout: () => void;
}

export const TabNavigator: React.FC<TabNavigatorProps> = ({ user, onLogout }) => {

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        keyboardHidesTabBar: true,
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: keyof typeof Ionicons.glyphMap;

          if (route.name === 'Alpo') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'Uutiset') {
            iconName = focused ? 'newspaper' : 'newspaper-outline';
          } else if (route.name === 'Huoltopyyntö') {
            iconName = focused ? 'clipboard' : 'clipboard-outline';
          } else if (route.name === 'Ohjeet') {
            iconName = focused ? 'help-circle' : 'help-circle-outline';
          } else {
            iconName = 'help-outline';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: Colors.loginText,
        tabBarInactiveTintColor: Colors.loginText,
        headerStyle: {
          backgroundColor: Colors.headerBackground,
          marginBottom: 20,
        },
        headerTintColor: Colors.white,
        headerTitleStyle: {
          fontWeight: 'bold',
          paddingBottom: 10,
        },
        headerTitleAlign: 'center',
        tabBarStyle: {
          backgroundColor: Colors.headerBackground,
          paddingTop: 10,
        },
      })}
    >
      <Tab.Screen name="Alpo">
        {() => <AlpoScreen user={user} />}
      </Tab.Screen>
      <Tab.Screen name="Uutiset" component={UutisetScreen} />
      <Tab.Screen
        name="Huoltopyyntö"
        options={{
          tabBarLabel: 'Huoltopyyntö',
          headerTitle: 'Lähetä meille huoltopyyntösi tästä!',
        }}
      >
        {() => <WebViewScreen uri="https://www.huoltokanava.fi/embed/notice/resol-oy" />}
      </Tab.Screen>
      <Tab.Screen name="Ohjeet">
        {() => <OhjeetScreen user={user} onLogout={onLogout} />}
      </Tab.Screen>
    </Tab.Navigator>
  );
};