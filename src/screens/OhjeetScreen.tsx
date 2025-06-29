import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Switch, Alert, Platform } from 'react-native';
import { authService, User } from '../services/auth';
import { Colors } from '../constants/colors';

interface OhjeetScreenProps {
  user: User | null;
  onLogout: () => void;
}

export const OhjeetScreen: React.FC<OhjeetScreenProps> = ({ user, onLogout }) => {
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
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        
        <Text style={styles.subtitle}>
          {`Tässä sovelluksessa voit keskustella Resol Oy:n virtuaalisen talonmiehen Alpon kanssa.

Huomioithan, että Alpo ei ole oikea henkilö, vaan tekoälyavustaja: se ei voi antaa oikeudellista tai lääketieteellistä neuvontaa.
        
Jos olet pikaisen avun tarpeessa olethan yhteydessä asiakaspalveluumme:
030 450 4850 (avoinna: 08:00 - 17:00).

Päivystäjämme tavoitat 24h numerosta:
044 796 7982.`}
        </Text>
        
        

        <View style={styles.section}>
          <View style={styles.settingRow}>
            <Text style={styles.settingLabel}>Ilmoitukset</Text>
            <Switch
              value={notifications}
              onValueChange={setNotifications}
              trackColor={{ false: Colors.lightGray, true: Colors.primary }}
              thumbColor={notifications ? Colors.white : Colors.lightGray}
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
    backgroundColor: Colors.background,
  },
  content: {
    padding: 20,
  },
  
  section: {
    backgroundColor: Colors.white,
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
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.lightGray,
  },
  settingLabel: {
    fontSize: 16,
    color: Colors.text,
  },
  subtitle: {
    fontSize: 16,
    color: Colors.mediumGray,
    marginBottom: 40,
    textAlign: 'center',
  },

  logoutButton: {
    backgroundColor: Colors.error,
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
  },
  logoutButtonText: {
    color: Colors.white,
    fontSize: 18,
    fontWeight: '600',
  },
});