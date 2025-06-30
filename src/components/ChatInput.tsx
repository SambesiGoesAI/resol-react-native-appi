import React, { useState, forwardRef } from 'react';
import { View, TextInput, TouchableOpacity, Text, StyleSheet, ActivityIndicator } from 'react-native';
import './ChatInputFocusOverride.css';
import { Colors } from '../constants/colors';

interface ChatInputProps {
  onSendMessage: (message: string) => void;
  isLoading: boolean;
  disabled?: boolean;
}

interface ChatInputProps {
  onSendMessage: (message: string) => void;
  isLoading: boolean;
  disabled?: boolean;
  sendButtonTextColor?: string; // New optional prop for button text color
}

export const ChatInput = forwardRef<TextInput, ChatInputProps>(({
  onSendMessage,
  isLoading,
  disabled = false,
  sendButtonTextColor, // Destructure new prop
}, ref) => {
  const [message, setMessage] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const [inputKey, setInputKey] = useState(0); // State to force TextInput re-mount

  const handleSend = () => {
    const trimmedMessage = message.trim();
    if (trimmedMessage && !isLoading && !disabled) {
      onSendMessage(trimmedMessage);
      setMessage(''); // Clear the React state
      setInputKey(prevKey => prevKey + 1); // Force TextInput re-mount
    }
  };

  const canSend = message.trim().length > 0 && !isLoading && !disabled;

  // New condition: treat focused input as "canSend" for styling purposes
  const showActiveStyle = (message.trim().length > 0 || isFocused) && !isLoading && !disabled;

  return (
    <View style={styles.container}>
      <View style={[
        styles.inputContainer,
        (isFocused && !isLoading) ? styles.inputContainerFocused : null
      ]}>
        <TextInput
          key={inputKey}
          style={[
            styles.textInput,
            message.length > 0 ? styles.textInputFocused : null
          ]}
          value={message}
          onChangeText={setMessage}
          placeholder="Kirjoita viesti..."
          placeholderTextColor={'#999999'}
          multiline
          maxLength={1000}
          editable={!isLoading && !disabled}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          onKeyPress={(e) => {
            if (e.nativeEvent.key === 'Enter') {
              e.preventDefault();
              handleSend();
            }
          }}
          ref={ref}
        />
        <TouchableOpacity
          style={[
            styles.sendButton,
            showActiveStyle
              ? styles.sendButtonActive
              : styles.sendButtonInactive
          ]}
          onPress={handleSend}
          disabled={!canSend}
        >
          {isLoading ? (
            <ActivityIndicator
              size="small"
              color={'#FFFFFF'}
            />
          ) : (
            <Text style={[
              styles.sendButtonText,
              showActiveStyle
                ? [styles.sendButtonTextActive, sendButtonTextColor ? { color: sendButtonTextColor } : {}]
                : styles.sendButtonTextInactive
            ]}>
              Lähetä
            </Text>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: Colors.white,
    borderTopWidth: 1,
    borderTopColor: Colors.secondary,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.lightGray,
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    minHeight: 44,
  },
  textInput: {
    flex: 1,
    fontSize: 16,
    color: Colors.black,
    maxHeight: 100,
    paddingVertical: 8,
    borderWidth: 0,
    borderColor: 'transparent',
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
    backgroundColor: Colors.chatSendButtonBackground,
  },
  sendButtonInactive: {
    backgroundColor: Colors.secondary,
  },
  sendButtonText: {
    fontSize: 14,
    fontWeight: '600',
  },
  sendButtonTextActive: {
    color: Colors.chatSendButtonText,
  },
  sendButtonTextInactive: {
    color: Colors.mediumGray,
  },
  textInputFocused: {
    borderColor: Colors.black, // dark gray color for focus frame
  },
  inputContainerFocused: {
    borderColor: Colors.darkGray, // dark gray color for focus frame
    borderWidth: 1,
  },
});