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

  return(
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.textContainer}>
          <Text style={styles.subtitle}>
            {`Tässä sovelluksessa voit keskustella Resol Oy:n virtuaalisen talonmiehen Alpon kanssa.\n\nHuomioithan, että Alpo ei ole oikea henkilö, vaan tekoälyavustaja: se ei voi antaa oikeudellista tai lääketieteellistä neuvontaa.\n        \nJos olet pikaisen avun tarpeessa olethan yhteydessä asiakaspalveluumme:\n030 450 4850 (avoinna: 08:00 - 17:00).\n\nPäivystäjämme tavoitat 24h numerosta:\n044 796 7982.`}
          </Text>
        </View>

        <View>
          <View style={styles.section}>
            <View style={styles.settingRow}>
              <Text style={styles.settingLabel}>Ilmoitukset</Text>
              <Switch
                value={notifications}
                onValueChange={setNotifications}
                trackColor={{ false: Colors.lightGray, true: Colors.toggleTrackOn }}
                thumbColor={notifications ? Colors.white : Colors.darkGray}
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
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.ohjeetBackground,
  },
  scrollContent: {
    flexGrow: 1,
    padding: 20,
  },
  textContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  
  section: {
    backgroundColor: Colors.settingsSectionBackground,
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
    borderBottomWidth: 0,
  },
  settingLabel: {
    fontSize: 16,
    color: Colors.settingsSectionText,
  },
  subtitle: {
    fontSize: 16,
    color: Colors.ohjeetText,
    textAlign: 'center',
  },

  logoutButton: {
    backgroundColor: Colors.ohjeetButtonBackground,
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