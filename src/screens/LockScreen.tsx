import React, { useState, useContext } from 'react';
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
} from 'react-native';
import { authService } from '../services/auth';
import { ThemeContext } from '../context/ThemeContext';

interface LockScreenProps {
  onLoginSuccess: (user: any) => void;
}

export const LockScreen: React.FC<LockScreenProps> = ({ onLoginSuccess }) => {
  const [accessCode, setAccessCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { isDarkMode } = useContext(ThemeContext);
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
      style={[styles.container, isDarkMode ? styles.containerDark : null]}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <View style={styles.content}>
        <Text style={[styles.title, styles.titleCentered, isDarkMode ? styles.titleDark : null]}>Tervetuloa Alpo-sovellukseen!</Text>
        <Text style={[styles.subtitle, isDarkMode ? styles.subtitleDark : null]}>Syötä pääsykoodisi ja paina 'Kirjaudu'</Text>
        
        <TextInput
          style={[styles.input, isDarkMode ? styles.inputDark : null]}
          placeholder="Pääsykoodi"
          placeholderTextColor={isDarkMode ? '#AAAAAA' : '#999999'}
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
          style={[styles.button, isLoading && styles.buttonDisabled, isDarkMode ? styles.buttonDark : null]}
          onPress={handleLogin}
          disabled={isLoading}
        >
          {isLoading ? (
            <ActivityIndicator color="#FFFFFF" />
          ) : (
            <Text style={[styles.buttonText, isDarkMode ? styles.buttonTextDark : null]}>Kirjaudu</Text>
          )}
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
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
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 10,
  },
  titleDark: {
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
  input: {
    width: '100%',
    height: 50,
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    paddingHorizontal: 16,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    marginBottom: 20,
    color: '#000000',
  },
  inputDark: {
    backgroundColor: '#1E1E1E',
    borderColor: '#444444',
    color: '#FFFFFF',
  },
  button: {
    width: '100%',
    height: 50,
    backgroundColor: '#007AFF',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonDark: {
    backgroundColor: '#0A84FF',
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
  },
  buttonTextDark: {
    color: '#FFFFFF',
  },
  titleCentered: {
    textAlign: 'center',
  },
});