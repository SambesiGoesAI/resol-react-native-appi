import React, { useContext } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Switch, Alert, Platform } from 'react-native';
import { authService, User } from '../services/auth';
import { ThemeContext } from '../context/ThemeContext';

interface OhjeetScreenProps {
  user: User | null;
  onLogout: () => void;
}

export const OhjeetScreen: React.FC<OhjeetScreenProps> = ({ user, onLogout }) => {
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
        
        <Text style={[styles.subtitle, isDarkMode ? styles.subtitleDark : null]}>
          {`Tässä sovelluksessa voit keskustella Resol Oy:n virtuaalisen talonmiehen Alpon kanssa.

Huomioithan, että Alpo ei ole oikea henkilö, vaan tekoälyavustaja: se ei voi antaa oikeudellista tai lääketieteellistä neuvontaa.
        
Jos olet pikaisen avun tarpeessa olethan yhteydessä asiakaspalveluumme 030 450 4850 (avoinna: 08:00 - 17:00).

Päivystäjämme tavoitat 24h numerosta 044 796 7982.`}
        </Text>
        
        

        <View style={[styles.section, isDarkMode ? styles.sectionDark : null]}>
          <View style={styles.settingRow}>
            <Text style={[styles.settingLabel, isDarkMode ? styles.settingLabelDark : null]}>Ilmoitukset</Text>
            <Switch
              value={notifications}
              onValueChange={setNotifications}
              trackColor={{ false: '#767577', true: '#007AFF' }}
              thumbColor={notifications ? '#FFFFFF' : '#f4f3f4'}
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
  subtitle: {
    fontSize: 16,
    color: '#666666',
    marginBottom: 40,
    textAlign: 'center',
  },
  subtitleDark: {
    color: '#CCCCCC',
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