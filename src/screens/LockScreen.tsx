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
          {`Tässä sovelluksessa voit mm. keskustella Resol Oy:n virtuaalisen talonmiehen Alpon kanssa ja lähettää meille huoltopyyntöjä.\n\nUloskirjautuminen löytyy 'Ohjeet' -välilehdeltä.`}
        </Text>
       
        
        <View style={styles.inputContainer}>
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
        </View>
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
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.loginText,
    marginBottom: 10,
    marginTop: 60,
  },
  subtitle: {
    fontSize: 16,
    color: Colors.loginText,
    marginBottom: 40,
    textAlign: 'center',
  },
  input: {
    flex: 1,
    height: 40,
    backgroundColor: Colors.white,
    borderRadius: 8,
    paddingHorizontal: 16,
    fontSize: 16,
    borderWidth: 1,
    borderColor: Colors.lightGray,
    marginRight: 10,
    color: Colors.loginInputText,
  },
  button: {
    height: 40,
    backgroundColor: Colors.ohjeetButtonBackground,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 15,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    width: '100%',
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
    marginTop: 20,
    resizeMode: 'contain',
  },
});