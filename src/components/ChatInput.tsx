import React, { useContext, useState } from 'react';
import { View, TextInput, TouchableOpacity, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { ThemeContext } from '../context/ThemeContext';
import './ChatInputFocusOverride.css';
interface ChatInputProps {
  onSendMessage: (message: string) => void;
  isLoading: boolean;
  disabled?: boolean;
}

export const ChatInput: React.FC<ChatInputProps> = ({
  onSendMessage,
  isLoading,
  disabled = false
}) => {
  const { isDarkMode } = useContext(ThemeContext);
  const [message, setMessage] = useState('');
  const [isFocused, setIsFocused] = useState(false);

  const handleSend = () => {
    const trimmedMessage = message.trim();
    if (trimmedMessage && !isLoading && !disabled) {
      onSendMessage(trimmedMessage);
      setMessage('');
    }
  };

  const canSend = message.trim().length > 0 && !isLoading && !disabled;

  return (
    <View style={[
      styles.container,
      isDarkMode ? styles.containerDark : null
    ]}>
      <View style={[
        styles.inputContainer,
        isDarkMode ? styles.inputContainerDark : null,
        isFocused ? styles.inputContainerFocused : null
      ]}>
        <TextInput
          style={[
            styles.textInput,
            isDarkMode ? styles.textInputDark : null,
            message.length > 0 ? styles.textInputFocused : null
          ]}
          value={message}
          onChangeText={setMessage}
          placeholder="Kirjoita viesti..."
          placeholderTextColor={isDarkMode ? '#666666' : '#999999'}
          multiline
          maxLength={1000}
          editable={!isLoading && !disabled}
          onSubmitEditing={handleSend}
          blurOnSubmit={false}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          className="chat-input-no-outline"
        />
        <TouchableOpacity
          style={[
            styles.sendButton,
            canSend 
              ? [styles.sendButtonActive, isDarkMode ? styles.sendButtonActiveDark : null]
              : [styles.sendButtonInactive, isDarkMode ? styles.sendButtonInactiveDark : null]
          ]}
          onPress={handleSend}
          disabled={!canSend}
        >
          {isLoading ? (
            <ActivityIndicator 
              size="small" 
              color={isDarkMode ? '#FFFFFF' : '#FFFFFF'} 
            />
          ) : (
            <Text style={[
              styles.sendButtonText,
              canSend 
                ? [styles.sendButtonTextActive, isDarkMode ? styles.sendButtonTextActiveDark : null]
                : [styles.sendButtonTextInactive, isDarkMode ? styles.sendButtonTextInactiveDark : null]
            ]}>
              Lähetä
            </Text>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E5E5EA',
  },
  containerDark: {
    backgroundColor: '#1C1C1E',
    borderTopColor: '#2C2C2E',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F2F2F7',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    minHeight: 44,
  },
  inputContainerDark: {
    backgroundColor: '#2C2C2E',
  },
  textInput: {
    flex: 1,
    fontSize: 16,
    color: '#000000',
    maxHeight: 100,
    paddingVertical: 8,
    borderWidth: 0,
    borderColor: 'transparent',
  },
  textInputDark: {
    color: '#FFFFFF',
  },
  sendButton: {
    marginLeft: 12,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 16,
    minWidth: 60,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sendButtonActive: {
    backgroundColor: '#007AFF',
  },
  sendButtonActiveDark: {
    backgroundColor: '#0A84FF',
  },
  sendButtonInactive: {
    backgroundColor: '#E5E5EA',
  },
  sendButtonInactiveDark: {
    backgroundColor: '#48484A',
  },
  sendButtonText: {
    fontSize: 14,
    fontWeight: '600',
  },
  sendButtonTextActive: {
    color: '#FFFFFF',
  },
  sendButtonTextActiveDark: {
    color: '#FFFFFF',
  },
  sendButtonTextInactive: {
    color: '#999999',
  },
  sendButtonTextInactiveDark: {
    color: '#666666',
  },
  textInputFocused: {
    borderColor: '#000000', // dark gray color for focus frame
  },
  inputContainerFocused: {
    borderColor: '#555555', // dark gray color for focus frame
    borderWidth: 1,
  },
});