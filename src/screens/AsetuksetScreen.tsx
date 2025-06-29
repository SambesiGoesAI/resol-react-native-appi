import React, { useContext } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Switch, Alert, Platform } from 'react-native';
import { authService, User } from '../services/auth';
import { ThemeContext } from '../context/ThemeContext';

interface AsetuksetScreenProps {
  user: User | null;
  onLogout: () => void;
}

export const AsetuksetScreen: React.FC<AsetuksetScreenProps> = ({ user, onLogout }) => {
  const { isDarkMode, toggleDarkMode } = useContext(ThemeContext);
  const [notifications, setNotifications] = React.useState(true);
  const [analytics, setAnalytics] = React.useState(false);

  const handleLogout = async () => {
    const logoutAction = async () => {
      try {
        await performLogout();
      } catch (error) {
        // Silent fail
      }
    };

    if (Platform.OS === 'web') {
      if (window.confirm('Haluatko varmasti kirjautua ulos?')) {
        logoutAction();
      }
    } else {
      Alert.alert(
        'Kirjaudu ulos',
        'Haluatko varmasti kirjautua ulos?',
        [
          {
            text: 'Peruuta',
            style: 'cancel',
          },
          {
            text: 'Kirjaudu ulos',
            style: 'destructive',
            onPress: logoutAction,
          },
        ],
        { cancelable: false }
      );
    }
  };
  
  const performLogout = async () => {
    try {
      const result = await authService.signOut();
      
      if (result?.error) {
        return;
      }
      
      await onLogout();
    } catch (error) {
      // Silent fail
    }
  };

  return (
    <ScrollView style={[styles.container, isDarkMode ? styles.containerDark : null]}>
      <View style={styles.content}>
        <Text style={[styles.title, isDarkMode ? styles.titleDark : null]}>Asetukset</Text>
        
        <View style={[styles.section, isDarkMode ? styles.sectionDark : null]}>
          <Text style={[styles.sectionTitle, isDarkMode ? styles.sectionTitleDark : null]}>Käyttäjätiedot</Text>
          <View style={styles.infoRow}>
            <Text style={[styles.infoLabel, isDarkMode ? styles.infoLabelDark : null]}>Sähköposti:</Text>
            <Text style={[styles.infoValue, isDarkMode ? styles.infoValueDark : null]}>{user?.email || 'Ei saatavilla'}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={[styles.infoLabel, isDarkMode ? styles.infoLabelDark : null]}>Rooli:</Text>
            <Text style={[styles.infoValue, isDarkMode ? styles.infoValueDark : null]}>{user?.role || 'Tuntematon'}</Text>
          </View>
        </View>

        <View style={[styles.section, isDarkMode ? styles.sectionDark : null]}>
          <Text style={[styles.sectionTitle, isDarkMode ? styles.sectionTitleDark : null]}>Asetukset</Text>
          
          <View style={styles.settingRow}>
            <Text style={[styles.settingLabel, isDarkMode ? styles.settingLabelDark : null]}>Tumma tila</Text>
            <Switch
              value={isDarkMode}
              onValueChange={toggleDarkMode}
              trackColor={{ false: '#767577', true: '#007AFF' }}
              thumbColor={isDarkMode ? '#FFFFFF' : '#f4f3f4'}
            />
          </View>
          
          <View style={styles.settingRow}>
            <Text style={[styles.settingLabel, isDarkMode ? styles.settingLabelDark : null]}>Ilmoitukset</Text>
            <Switch
              value={notifications}
              onValueChange={setNotifications}
              trackColor={{ false: '#767577', true: '#007AFF' }}
              thumbColor={notifications ? '#FFFFFF' : '#f4f3f4'}
            />
          </View>
          
          <View style={styles.settingRow}>
            <Text style={[styles.settingLabel, isDarkMode ? styles.settingLabelDark : null]}>Analytiikka</Text>
            <Switch
              value={analytics}
              onValueChange={setAnalytics}
              trackColor={{ false: '#767577', true: '#007AFF' }}
              thumbColor={analytics ? '#FFFFFF' : '#f4f3f4'}
            />
          </View>
        </View>

        <TouchableOpacity
          style={styles.logoutButton}
          onPress={handleLogout}
        >
          <Text style={styles.logoutButtonText}>Kirjaudu ulos</Text>
        </TouchableOpacity>
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
    marginBottom: 30,
  },
  titleDark: {
    color: '#FFFFFF',
  },
  section: {
    backgroundColor: '#FFFFFF',
    padding: 20,
    borderRadius: 12,
    marginBottom: 20,
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
    marginBottom: 15,
  },
  sectionTitleDark: {
    color: '#FFFFFF',
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  infoLabel: {
    fontSize: 16,
    color: '#666666',
  },
  infoLabelDark: {
    color: '#BBBBBB',
  },
  infoValue: {
    fontSize: 16,
    color: '#333333',
    fontWeight: '500',
  },
  infoValueDark: {
    color: '#FFFFFF',
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  settingLabel: {
    fontSize: 16,
    color: '#333333',
  },
  settingLabelDark: {
    color: '#FFFFFF',
  },
  logoutButton: {
    backgroundColor: '#FF3B30',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
  },
  logoutButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
  },
});