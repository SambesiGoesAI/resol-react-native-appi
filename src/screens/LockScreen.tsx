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

  const handleLogin = async () => {
    if (!accessCode.trim()) {
      Alert.alert('Error', 'Please enter an access code');
      return;
    }

    setIsLoading(true);
    try {
      const { user, error } = await authService.signInWithAccessCode(accessCode);
      
      if (error || !user) {
        Alert.alert('Login Failed', error || 'Invalid access code');
      } else {
        onLoginSuccess(user);
      }
    } catch (error) {
      Alert.alert('Error', 'An unexpected error occurred');
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
        <Text style={[styles.title, isDarkMode ? styles.titleDark : null]}>Welcome to Alpo</Text>
        <Text style={[styles.subtitle, isDarkMode ? styles.subtitleDark : null]}>Enter your access code to continue</Text>
        
        <TextInput
          style={[styles.input, isDarkMode ? styles.inputDark : null]}
          placeholder="Access Code"
          placeholderTextColor={isDarkMode ? '#AAAAAA' : '#999999'}
          value={accessCode}
          onChangeText={setAccessCode}
          secureTextEntry
          autoCapitalize="none"
          autoCorrect={false}
          editable={!isLoading}
        />
        
        <TouchableOpacity 
          style={[styles.button, isLoading && styles.buttonDisabled, isDarkMode ? styles.buttonDark : null]}
          onPress={handleLogin}
          disabled={isLoading}
        >
          {isLoading ? (
            <ActivityIndicator color="#FFFFFF" />
          ) : (
            <Text style={[styles.buttonText, isDarkMode ? styles.buttonTextDark : null]}>Login</Text>
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
});