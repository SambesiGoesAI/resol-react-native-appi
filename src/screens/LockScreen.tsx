import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  Image,
} from 'react-native';
import { authService, User } from '../services/auth';
import { Colors } from '../constants/colors';

interface LockScreenProps {
  onLoginSuccess: (user: User) => void;
}

export const LockScreen: React.FC<LockScreenProps> = ({ onLoginSuccess }) => {
  const [accessCode, setAccessCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const inputRef = React.useRef<TextInput>(null);

  React.useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleLogin = async () => {
    if (!accessCode.trim()) {
      Alert.alert('Virhe', 'Syötä pääsykoodi');
      return;
    }

    setIsLoading(true);
    try {
      const { user, error } = await authService.signInWithAccessCode(accessCode);
      
      if (error || !user) {
        Alert.alert('Kirjautuminen epäonnistui', error || 'Virheellinen pääsykoodi');
      } else {
        onLoginSuccess(user);
      }
    } catch (error) {
      Alert.alert('Virhe', 'Odottamaton virhe tapahtui');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView 
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <View style={styles.content}>
        <Text style={[styles.title, styles.titleCentered]}>Tervetuloa Resol Appiin!</Text>
        <Text style={styles.subtitle}>
          {`Tässä sovelluksessa voit mm. keskustella Resol Oy:n virtuaalisen talonmiehen Alpon kanssa ja lähettää meille huoltopyyntöjä.\n\nHuomioithan, että Alpo ei ole oikea henkilö, vaan tekoälyavustaja: se ei voi antaa oikeudellista tai lääketieteellistä neuvontaa.\n        \nJos olet pikaisen avun tarpeessa pyydämme olemaan yhteydessä asiakaspalveluumme:\n030 450 4850\n(avoinna: 08:00 - 17:00).\n\nPäivystäjämme tavoitat 24h numerosta:\n044 796 7982.\n\nVoit halutessasi kirjautua ulos sovelluksesta 'Ohjeet' -välilehdeltä.`}
        </Text>
        <Text style={styles.subtitle}>Syötä pääsykoodisi alle ja paina 'Kirjaudu'</Text>
        
        <TextInput
          style={styles.input}
          placeholder="Pääsykoodi"
          placeholderTextColor={Colors.loginPlaceholder}
          value={accessCode}
          onChangeText={setAccessCode}
          secureTextEntry
          autoCapitalize="none"
          autoCorrect={false}
          editable={!isLoading}
          onSubmitEditing={handleLogin}
          returnKeyType="done"
          ref={inputRef}
        />
        
        <TouchableOpacity 
          style={[styles.button, isLoading && styles.buttonDisabled]}
          onPress={handleLogin}
          disabled={isLoading}
        >
          {isLoading ? (
            <ActivityIndicator color={Colors.white} />
          ) : (
            <Text style={styles.buttonText}>Kirjaudu</Text>
          )}
        </TouchableOpacity>
        <Image
          source={require('../../assets/resol-logo.png')}
          style={styles.logo}
        />
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.loginBackground,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: Colors.loginText,
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: Colors.loginText,
    marginBottom: 40,
    textAlign: 'center',
  },
  input: {
    width: '100%',
    height: 50,
    backgroundColor: Colors.white,
    borderRadius: 8,
    paddingHorizontal: 16,
    fontSize: 16,
    borderWidth: 1,
    borderColor: Colors.lightGray,
    marginBottom: 20,
    color: Colors.loginInputText,
  },
  button: {
    width: '100%',
    height: 50,
    backgroundColor: Colors.loginButton,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    color: Colors.white,
    fontSize: 18,
    fontWeight: '600',
  },
  titleCentered: {
    textAlign: 'center',
  },
  logo: {
    width: 100,
    height: 100,
    marginTop: 50,
    resizeMode: 'contain',
  },
});